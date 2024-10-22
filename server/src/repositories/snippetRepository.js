const { getDb } = require('../config/database');

class SnippetRepository {
  // Helper method to format SELECT statements with proper UTC handling
  #getSelectQuery(additional = '') {
    return `
      SELECT 
        id,
        title,
        language,
        description,
        code,
        datetime(updated_at) || 'Z' as updated_at
      FROM snippets
      ${additional}
    `.trim();
  }

  async findAll() {
    const db = getDb();
    try {
      const snippets = await db.all(
        this.#getSelectQuery('ORDER BY updated_at DESC')
      );
      return snippets;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async create({ title, language, description, code }) {
    const db = getDb();
    try {
      const result = await db.run(
        `INSERT INTO snippets (
          title, 
          language, 
          description, 
          code, 
          updated_at
        ) VALUES (?, ?, ?, ?, datetime('now', 'utc'))`,
        [title, language, description, code]
      );
      
      // Fetch the created snippet with UTC formatting
      const created = await db.get(
        this.#getSelectQuery('WHERE id = ?'),
        [result.lastID]
      );
      return created;
    } catch (error) {
      console.error('Error in create:', error);
      console.error('Parameters:', { title, language, description, code });
      throw error;
    }
  }

  async delete(id) {
    const db = getDb();
    try {
      // Only fetch necessary fields for deletion confirmation
      const snippet = await db.get(
        this.#getSelectQuery('WHERE id = ?'),
        [id]
      );
      
      if (snippet) {
        await db.run('DELETE FROM snippets WHERE id = ?', [id]);
      }
      
      return snippet;
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  async update(id, { title, language, description, code }) {
    const db = getDb();
    try {
      await db.run(
        `UPDATE snippets 
         SET title = ?, 
             language = ?, 
             description = ?, 
             code = ?,
             updated_at = datetime('now', 'utc')
         WHERE id = ?`,
        [title, language, description, code, id]
      );
      
      // Return updated snippet with UTC formatting
      return db.get(
        this.#getSelectQuery('WHERE id = ?'),
        [id]
      );
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }
}

module.exports = new SnippetRepository();