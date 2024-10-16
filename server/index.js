const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// TODO: Tidy up

// PostgreSQL connection
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Initialize database
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS snippets (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        language VARCHAR(50) NOT NULL,
        description TEXT,
        code TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(createTableQuery);
    await client.query('COMMIT');
    console.log('Database initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client/build')));

// GET /api/snippets
app.get('/api/snippets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM snippets');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching snippets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/snippets
app.post('/api/snippets', async (req, res) => {
  const { title, language, description, code } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO snippets (title, language, description, code) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, language, description, code]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating snippet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/snippets/:id
app.delete('/api/snippets/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM snippets WHERE id = $1 RETURNING id, title, language', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Snippet not found' });
    } else {
      res.json({ id: result.rows[0].id });
    }
  } catch (error) {
    console.error('Error deleting snippet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/snippets/:id
app.put('/api/snippets/:id', async (req, res) => {
  const id = req.params.id;
  const { title, language, description, code } = req.body;
  try {
    const result = await pool.query(
      'UPDATE snippets SET title = $1, language = $2, description = $3, code = $4 WHERE id = $5 RETURNING *',
      [title, language, description, code, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Snippet not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating snippet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database. Exiting.', error);
    process.exit(1);
  });