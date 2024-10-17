const request = require('supertest');
const express = require('express');
const snippetRoutes = require('../../src/routes/snippetRoutes');
const { pool } = require('../../src/config/database');

const app = express();
app.use(express.json());
app.use('/api/snippets', snippetRoutes);

describe('Snippet API Integration', () => {
  beforeAll(async () => {
    // Set up test database
    await pool.query('CREATE TABLE IF NOT EXISTS snippets (id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, language VARCHAR(50) NOT NULL, description TEXT, code TEXT NOT NULL, updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)');
  });

  afterAll(async () => {
    // Clean up test database
    await pool.query('DROP TABLE IF EXISTS snippets');
    await pool.end();
  });

  beforeEach(async () => {
    // Clear the table before each test
    await pool.query('DELETE FROM snippets');
  });

  it('should create and retrieve a snippet', async () => {
    const newSnippet = {
      title: 'Test Snippet',
      language: 'JavaScript',
      description: 'A test snippet',
      code: 'console.log("Hello, World!");',
    };

    // Create snippet
    const createResponse = await request(app)
      .post('/api/snippets')
      .send(newSnippet);
    expect(createResponse.status).toBe(201);
    const createdSnippet = createResponse.body;

    // Retrieve all snippets
    const getAllResponse = await request(app).get('/api/snippets');
    expect(getAllResponse.status).toBe(200);
    expect(getAllResponse.body).toHaveLength(1);
    expect(getAllResponse.body[0]).toMatchObject(newSnippet);

    // Update snippet
    const updatedSnippet = { ...newSnippet, title: 'Updated Test Snippet' };
    const updateResponse = await request(app)
      .put(`/api/snippets/${createdSnippet.id}`)
      .send(updatedSnippet);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toMatchObject(updatedSnippet);

    // Delete snippet
    const deleteResponse = await request(app).delete(`/api/snippets/${createdSnippet.id}`);
    expect(deleteResponse.status).toBe(200);

    // Verify deletion
    const getAfterDeleteResponse = await request(app).get('/api/snippets');
    expect(getAfterDeleteResponse.status).toBe(200);
    expect(getAfterDeleteResponse.body).toHaveLength(0);
  });

  it('should handle non-existent snippet operations', async () => {
    // Try to retrieve non-existent snippet
    const getNonExistentResponse = await request(app).get('/api/snippets/999');
    expect(getNonExistentResponse.status).toBe(404);

    // Try to update non-existent snippet
    const updateNonExistentResponse = await request(app)
      .put('/api/snippets/999')
      .send({ title: 'Non-existent Snippet' });
    expect(updateNonExistentResponse.status).toBe(404);

    // Try to delete non-existent snippet
    const deleteNonExistentResponse = await request(app).delete('/api/snippets/999');
    expect(deleteNonExistentResponse.status).toBe(404);
  });
});