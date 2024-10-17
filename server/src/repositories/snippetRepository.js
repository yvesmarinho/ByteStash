const { pool } = require('../config/database');

class SnippetRepository {
  async findAll() {
    const result = await pool.query('SELECT * FROM snippets');
    return result.rows;
  }

  async create({ title, language, description, code }) {
    const result = await pool.query(
      'INSERT INTO snippets (title, language, description, code) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, language, description, code]
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await pool.query('DELETE FROM snippets WHERE id = $1 RETURNING id, title, language', [id]);
    return result.rows[0];
  }

  async update(id, { title, language, description, code }) {
    const result = await pool.query(
      'UPDATE snippets SET title = $1, language = $2, description = $3, code = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [title, language, description, code, id]
    );
    return result.rows[0];
  }
}

module.exports = new SnippetRepository();