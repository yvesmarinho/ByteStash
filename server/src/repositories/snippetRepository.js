const { getDb } = require('../config/database');

class SnippetRepository {
  constructor() {
    this.selectAllStmt = null;
    this.insertSnippetStmt = null;
    this.insertFragmentStmt = null;
    this.insertCategoryStmt = null;
    this.updateSnippetStmt = null;
    this.deleteFragmentsStmt = null;
    this.deleteCategoriesStmt = null;
    this.selectByIdStmt = null;
    this.deleteSnippetStmt = null;
    this.selectFragmentsStmt = null;
  }

  #initializeStatements() {
    const db = getDb();
    
    if (!this.selectAllStmt) {
      // Basic snippet data with categories
      this.selectAllStmt = db.prepare(`
        SELECT 
          s.id,
          s.title,
          s.description,
          datetime(s.updated_at) || 'Z' as updated_at,
          GROUP_CONCAT(DISTINCT c.name) as categories
        FROM snippets s
        LEFT JOIN categories c ON s.id = c.snippet_id
        GROUP BY s.id
        ORDER BY s.updated_at DESC
      `);

      // Get fragments for a snippet
      this.selectFragmentsStmt = db.prepare(`
        SELECT id, file_name, code, language, position
        FROM fragments
        WHERE snippet_id = ?
        ORDER BY position
      `);

      // Insert new snippet
      this.insertSnippetStmt = db.prepare(`
        INSERT INTO snippets (
          title, 
          description, 
          updated_at
        ) VALUES (?, ?, datetime('now', 'utc'))
      `);

      // Insert fragment with language
      this.insertFragmentStmt = db.prepare(`
        INSERT INTO fragments (
          snippet_id,
          file_name,
          code,
          language,
          position
        ) VALUES (?, ?, ?, ?, ?)
      `);

      // Insert category
      this.insertCategoryStmt = db.prepare(`
        INSERT INTO categories (snippet_id, name) VALUES (?, ?)
      `);

      // Update snippet
      this.updateSnippetStmt = db.prepare(`
        UPDATE snippets 
        SET title = ?, 
            description = ?,
            updated_at = datetime('now', 'utc')
        WHERE id = ?
      `);

      // Delete fragments
      this.deleteFragmentsStmt = db.prepare(`
        DELETE FROM fragments WHERE snippet_id = ?
      `);

      // Delete categories
      this.deleteCategoriesStmt = db.prepare(`
        DELETE FROM categories WHERE snippet_id = ?
      `);

      // Get snippet by ID
      this.selectByIdStmt = db.prepare(`
        SELECT 
          s.id,
          s.title,
          s.description,
          datetime(s.updated_at) || 'Z' as updated_at,
          GROUP_CONCAT(DISTINCT c.name) as categories
        FROM snippets s
        LEFT JOIN categories c ON s.id = c.snippet_id
        WHERE s.id = ?
        GROUP BY s.id
      `);

      // Delete snippet
      this.deleteSnippetStmt = db.prepare(`
        DELETE FROM snippets WHERE id = ?
      `);
    }
  }

  #processSnippet(snippet) {
    if (!snippet) return null;

    const fragments = this.selectFragmentsStmt.all(snippet.id);
    
    return {
      ...snippet,
      categories: snippet.categories ? snippet.categories.split(',') : [],
      fragments: fragments.sort((a, b) => a.position - b.position)
    };
  }

  findAll() {
    this.#initializeStatements();
    try {
      const snippets = this.selectAllStmt.all();
      return snippets.map(this.#processSnippet.bind(this));
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  create({ title, description, categories = [], fragments = [] }) {
    this.#initializeStatements();
    try {
      const db = getDb();
      
      return db.transaction(() => {
        // Insert snippet
        const insertResult = this.insertSnippetStmt.run(title, description);
        const snippetId = insertResult.lastInsertRowid;
        
        // Insert fragments with their individual languages
        fragments.forEach((fragment, index) => {
          this.insertFragmentStmt.run(
            snippetId,
            fragment.file_name || `file${index + 1}`,
            fragment.code || '',
            fragment.language || 'plaintext',
            fragment.position || index
          );
        });
        
        // Insert categories
        if (categories.length > 0) {
          for (const category of categories) {
            if (category.trim()) {
              this.insertCategoryStmt.run(snippetId, category.trim().toLowerCase());
            }
          }
        }
        
        // Get created snippet with categories and fragments
        const created = this.selectByIdStmt.get(snippetId);
        return this.#processSnippet(created);
      })();
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  update(id, { title, description, categories = [], fragments = [] }) {
    this.#initializeStatements();
    try {
      const db = getDb();
      
      return db.transaction(() => {
        // Update snippet
        this.updateSnippetStmt.run(title, description, id);
        
        // Update fragments
        this.deleteFragmentsStmt.run(id);
        fragments.forEach((fragment, index) => {
          this.insertFragmentStmt.run(
            id,
            fragment.file_name || `file${index + 1}`,
            fragment.code || '',
            fragment.language || 'plaintext',
            fragment.position || index
          );
        });
        
        // Update categories
        this.deleteCategoriesStmt.run(id);
        for (const category of categories) {
          if (category.trim()) {
            this.insertCategoryStmt.run(id, category.trim().toLowerCase());
          }
        }
        
        // Get updated snippet with categories and fragments
        const updated = this.selectByIdStmt.get(id);
        return this.#processSnippet(updated);
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
          return this.#processSnippet(snippet);
        }
        return null;
      })();
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  findById(id) {
    this.#initializeStatements();
    try {
      const snippet = this.selectByIdStmt.get(id);
      return this.#processSnippet(snippet);
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }
}

module.exports = new SnippetRepository();