const { getDb } = require('../config/database');

class SnippetRepository {
  constructor() {
    this.selectAllStmt = null;
    this.insertStmt = null;
    this.updateStmt = null;
    this.deleteStmt = null;
    this.selectByIdStmt = null;
  }

  #initializeStatements() {
    const db = getDb();
    
    if (!this.selectAllStmt) {
      this.selectAllStmt = db.prepare(`
        SELECT 
          id,
          title,
          language,
          description,
          code,
          datetime(updated_at) || 'Z' as updated_at
        FROM snippets
        ORDER BY updated_at DESC
      `);

      this.insertStmt = db.prepare(`
        INSERT INTO snippets (
          title, 
          language, 
          description, 
          code, 
          updated_at
        ) VALUES (?, ?, ?, ?, datetime('now', 'utc'))
      `);

      this.updateStmt = db.prepare(`
        UPDATE snippets 
        SET title = ?, 
            language = ?, 
            description = ?, 
            code = ?,
            updated_at = datetime('now', 'utc')
        WHERE id = ?
      `);

      this.deleteStmt = db.prepare('DELETE FROM snippets WHERE id = ?');

      this.selectByIdStmt = db.prepare(`
        SELECT 
          id,
          title,
          language,
          description,
          code,
          datetime(updated_at) || 'Z' as updated_at
        FROM snippets
        WHERE id = ?
      `);
    }
  }

  findAll() {
    this.#initializeStatements();
    try {
      return this.selectAllStmt.all();
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  create({ title, language, description, code }) {
    this.#initializeStatements();
    try {
      const db = getDb();
      const result = db.transaction(() => {
        const insertResult = this.insertStmt.run(title, language, description, code);
        return this.selectByIdStmt.get(insertResult.lastInsertRowid);
      })();
      
      return result;
    } catch (error) {
      console.error('Error in create:', error);
      console.error('Parameters:', { title, language, description, code });
      throw error;
    }
  }

  delete(id) {
    this.#initializeStatements();
    try {
      const db = getDb();
      return db.transaction(() => {
        const snippet = this.selectByIdStmt.get(id);
        if (snippet) {
          this.deleteStmt.run(id);
        }
        return snippet;
      })();
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  update(id, { title, language, description, code }) {
    this.#initializeStatements();
    try {
      const db = getDb();
      return db.transaction(() => {
        this.updateStmt.run(title, language, description, code, id);
        return this.selectByIdStmt.get(id);
      })();
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }
}

module.exports = new SnippetRepository();