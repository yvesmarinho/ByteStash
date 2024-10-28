const { getDb } = require('../config/database');

class SnippetRepository {
  constructor() {
    // Prepare statements once for better performance
    this.selectAllStmt = null;
    this.insertSnippetStmt = null;
    this.insertCategoryStmt = null;
    this.updateSnippetStmt = null;
    this.deleteCategoriesStmt = null;
    this.selectByIdStmt = null;
    this.deleteSnippetStmt = null;
  }

  // Initialize prepared statements
  #initializeStatements() {
    const db = getDb();
    
    if (!this.selectAllStmt) {
      this.selectAllStmt = db.prepare(`
        SELECT 
          s.id,
          s.title,
          s.language,
          s.description,
          s.code,
          datetime(s.updated_at) || 'Z' as updated_at,
          GROUP_CONCAT(c.name) as categories
        FROM snippets s
        LEFT JOIN categories c ON s.id = c.snippet_id
        GROUP BY s.id
        ORDER BY s.updated_at DESC
      `);

      this.insertSnippetStmt = db.prepare(`
        INSERT INTO snippets (
          title, 
          language, 
          description, 
          code, 
          updated_at
        ) VALUES (?, ?, ?, ?, datetime('now', 'utc'))
      `);

      this.insertCategoryStmt = db.prepare(`
        INSERT INTO categories (snippet_id, name) VALUES (?, ?)
      `);

      this.updateSnippetStmt = db.prepare(`
        UPDATE snippets 
        SET title = ?, 
            language = ?, 
            description = ?, 
            code = ?,
            updated_at = datetime('now', 'utc')
        WHERE id = ?
      `);

      this.deleteCategoriesStmt = db.prepare(`
        DELETE FROM categories WHERE snippet_id = ?
      `);

      this.selectByIdStmt = db.prepare(`
        SELECT 
          s.id,
          s.title,
          s.language,
          s.description,
          s.code,
          datetime(s.updated_at) || 'Z' as updated_at,
          GROUP_CONCAT(c.name) as categories
        FROM snippets s
        LEFT JOIN categories c ON s.id = c.snippet_id
        WHERE s.id = ?
        GROUP BY s.id
      `);

      this.deleteSnippetStmt = db.prepare(`
        DELETE FROM snippets WHERE id = ?
      `);
    }
  }

  #processCategories(snippet) {
    return {
      ...snippet,
      categories: snippet.categories ? snippet.categories.split(',') : []
    };
  }

  findAll() {
    this.#initializeStatements();
    try {
      const snippets = this.selectAllStmt.all();
      return snippets.map(this.#processCategories);
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  create({ title, language, description, code, categories = [] }) {
    this.#initializeStatements();
    try {
      const db = getDb();
      
      return db.transaction(() => {
        // Insert snippet
        const insertResult = this.insertSnippetStmt.run(title, language, description, code);
        const snippetId = insertResult.lastInsertRowid;
        
        // Insert categories
        if (categories.length > 0) {
          for (const category of categories) {
            if (category.trim()) {
              this.insertCategoryStmt.run(snippetId, category.trim().toLowerCase());
            }
          }
        }
        
        // Get created snippet with categories
        const created = this.selectByIdStmt.get(snippetId);
        return this.#processCategories(created);
      })();
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  update(id, { title, language, description, code, categories = [] }) {
    this.#initializeStatements();
    try {
      const db = getDb();
      
      return db.transaction(() => {
        // Update snippet
        this.updateSnippetStmt.run(title, language, description, code, id);
        
        // Update categories
        this.deleteCategoriesStmt.run(id);
        for (const category of categories) {
          if (category.trim()) {
            this.insertCategoryStmt.run(id, category.trim().toLowerCase());
          }
        }
        
        // Get updated snippet with categories
        const updated = this.selectByIdStmt.get(id);
        return this.#processCategories(updated);
      })();
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  delete(id) {
    this.#initializeStatements();
    try {
      const db = getDb();
      
      return db.transaction(() => {
        // Get snippet before deletion
        const snippet = this.selectByIdStmt.get(id);
        if (snippet) {
          this.deleteSnippetStmt.run(id);
          return this.#processCategories(snippet);
        }
        return null;
      })();
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }
}

module.exports = new SnippetRepository();