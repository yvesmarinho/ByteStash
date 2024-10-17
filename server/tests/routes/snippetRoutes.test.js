const request = require('supertest');
const express = require('express');
const snippetRoutes = require('../../src/routes/snippetRoutes');
const snippetService = require('../../src/services/snippetService');

jest.mock('../../src/services/snippetService');

const app = express();
app.use(express.json());
app.use('/api/snippets', snippetRoutes);

describe('Snippet Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/snippets', () => {
    it('should return all snippets', async () => {
      const mockSnippets = [
        { id: 1, title: 'Test Snippet 1' },
        { id: 2, title: 'Test Snippet 2' }
      ];
      snippetService.getAllSnippets.mockResolvedValue(mockSnippets);

      const response = await request(app).get('/api/snippets');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSnippets);
    });

    it('should handle errors', async () => {
      snippetService.getAllSnippets.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/snippets');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('POST /api/snippets', () => {
    it('should create a new snippet', async () => {
      const newSnippet = {
        title: 'New Snippet',
        language: 'JavaScript',
        description: 'A new test snippet',
        code: 'console.log("Hello, World!");'
      };
      const createdSnippet = { id: 1, ...newSnippet };
      snippetService.createSnippet.mockResolvedValue(createdSnippet);

      const response = await request(app)
        .post('/api/snippets')
        .send(newSnippet);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdSnippet);
    });

    it('should handle errors during creation', async () => {
      const newSnippet = {
        title: 'New Snippet',
        language: 'JavaScript',
        description: 'A new test snippet',
        code: 'console.log("Hello, World!");'
      };
      snippetService.createSnippet.mockRejectedValue(new Error('Creation error'));

      const response = await request(app)
        .post('/api/snippets')
        .send(newSnippet);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('DELETE /api/snippets/:id', () => {
    it('should delete a snippet', async () => {
      const deletedSnippet = { id: 1, title: 'Deleted Snippet' };
      snippetService.deleteSnippet.mockResolvedValue(deletedSnippet);

      const response = await request(app).delete('/api/snippets/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: deletedSnippet.id });
    });

    it('should return 404 for non-existent snippet', async () => {
      snippetService.deleteSnippet.mockResolvedValue(null);

      const response = await request(app).delete('/api/snippets/999');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Snippet not found' });
    });

    it('should handle errors during deletion', async () => {
      snippetService.deleteSnippet.mockRejectedValue(new Error('Deletion error'));

      const response = await request(app).delete('/api/snippets/1');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('PUT /api/snippets/:id', () => {
    it('should update a snippet', async () => {
      const updatedSnippet = {
        id: 1,
        title: 'Updated Snippet',
        language: 'Python',
        description: 'An updated test snippet',
        code: 'print("Hello, World!")'
      };
      snippetService.updateSnippet.mockResolvedValue(updatedSnippet);

      const response = await request(app)
        .put('/api/snippets/1')
        .send(updatedSnippet);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedSnippet);
    });

    it('should return 404 for non-existent snippet', async () => {
      snippetService.updateSnippet.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/snippets/999')
        .send({ title: 'Non-existent Snippet' });
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Snippet not found' });
    });

    it('should handle errors during update', async () => {
      snippetService.updateSnippet.mockRejectedValue(new Error('Update error'));

      const response = await request(app)
        .put('/api/snippets/1')
        .send({ title: 'Updated Snippet' });
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });
});