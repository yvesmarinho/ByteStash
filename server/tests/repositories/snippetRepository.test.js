const { pool } = require('../../src/config/database');
const snippetRepository = require('../../src/repositories/snippetRepository');

jest.mock('../../src/config/database', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('Snippet Repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find all snippets', async () => {
    const mockSnippets = [{ id: 1, title: 'Test Snippet' }];
    pool.query.mockResolvedValue({ rows: mockSnippets });

    const result = await snippetRepository.findAll();
    expect(result).toEqual(mockSnippets);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM snippets');
  });

  it('should create a new snippet', async () => {
    const newSnippet = { title: 'New Snippet', language: 'JavaScript', description: 'Test', code: 'console.log("test");' };
    const createdSnippet = { id: 1, ...newSnippet };
    pool.query.mockResolvedValue({ rows: [createdSnippet] });

    const result = await snippetRepository.create(newSnippet);
    expect(result).toEqual(createdSnippet);
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO snippets (title, language, description, code) VALUES ($1, $2, $3, $4) RETURNING *',
      [newSnippet.title, newSnippet.language, newSnippet.description, newSnippet.code]
    );
  });

  it('should delete a snippet', async () => {
    const deletedSnippet = { id: 1, title: 'Deleted Snippet' };
    pool.query.mockResolvedValue({ rows: [deletedSnippet] });

    const result = await snippetRepository.delete(1);
    expect(result).toEqual(deletedSnippet);
    expect(pool.query).toHaveBeenCalledWith('DELETE FROM snippets WHERE id = $1 RETURNING id, title, language', [1]);
  });

  it('should update a snippet', async () => {
    const updatedSnippet = { id: 1, title: 'Updated Snippet', language: 'Python', description: 'Updated', code: 'print("updated")' };
    pool.query.mockResolvedValue({ rows: [updatedSnippet] });

    const result = await snippetRepository.update(1, updatedSnippet);
    expect(result).toEqual(updatedSnippet);
    expect(pool.query).toHaveBeenCalledWith(
      'UPDATE snippets SET title = $1, language = $2, description = $3, code = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [updatedSnippet.title, updatedSnippet.language, updatedSnippet.description, updatedSnippet.code, 1]
    );
  });
});