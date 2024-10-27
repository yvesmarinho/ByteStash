const { getDb } = require('../config/database');

class SnippetRepository {
  #getSelectQuery(additional = '') {
    const baseQuery = `
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
    `.trim();

    return additional ? `${baseQuery} ${additional}` : baseQuery;
  }

  async findAll() {
    const db = getDb();
    try {
      const snippets = await db.all(
        this.#getSelectQuery('ORDER BY s.updated_at DESC')
      );
      return snippets.map(snippet => ({
        ...snippet,
        categories: snippet.categories ? snippet.categories.split(',') : []
      }));
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async create({ title, language, description, code, categories = [] }) {
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
      
      await this.#updateCategories(result.lastID, categories);
      
      const created = await db.get(
        `SELECT 
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
        GROUP BY s.id`,
        [result.lastID]
      );
      
      return {
        ...created,
        categories: created.categories ? created.categories.split(',') : []
      };
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  async #updateCategories(snippetId, categories) {
    const db = getDb();
    try {
      await db.run('DELETE FROM categories WHERE snippet_id = ?', [snippetId]);
      
      if (categories && categories.length > 0) {
        const stmt = await db.prepare(
          'INSERT INTO categories (snippet_id, name) VALUES (?, ?)'
        );
        
        for (const category of categories) {
          if (category.trim()) {
            await stmt.run(snippetId, category.trim().toLowerCase());
          }
        }
        
        await stmt.finalize();
      }
    } catch (error) {
      console.error('Error updating categories:', error);
      throw error;
    }
  }

  async update(id, { title, language, description, code, categories = [] }) {
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
      
      await this.#updateCategories(id, categories);
      
      const updated = await db.get(
        `SELECT 
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
        GROUP BY s.id`,
        [id]
      );
      
      return {
        ...updated,
        categories: updated.categories ? updated.categories.split(',') : []
      };
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  async delete(id) {
    const db = getDb();
    try {
      const snippet = await db.get(
        `SELECT 
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
        GROUP BY s.id`,
        [id]
      );
      
      if (snippet) {
        await db.run('DELETE FROM snippets WHERE id = ?', [id]);
      }
      
      return snippet ? {
        ...snippet,
        categories: snippet.categories ? snippet.categories.split(',') : []
      } : null;
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }
}

module.exports = new SnippetRepository();