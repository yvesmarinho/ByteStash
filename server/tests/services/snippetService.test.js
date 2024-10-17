const snippetService = require('../../src/services/snippetService');
const snippetRepository = require('../../src/repositories/snippetRepository');

jest.mock('../../src/repositories/snippetRepository');

describe('Snippet Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all snippets', async () => {
    const mockSnippets = [{ id: 1, title: 'Test Snippet' }];
    snippetRepository.findAll.mockResolvedValue(mockSnippets);

    const result = await snippetService.getAllSnippets();
    expect(result).toEqual(mockSnippets);
    expect(snippetRepository.findAll).toHaveBeenCalled();
  });

  it('should create a new snippet', async () => {
    const newSnippet = { title: 'New Snippet', language: 'JavaScript', description: 'Test', code: 'console.log("test");' };
    const createdSnippet = { id: 1, ...newSnippet };
    snippetRepository.create.mockResolvedValue(createdSnippet);

    const result = await snippetService.createSnippet(newSnippet);
    expect(result).toEqual(createdSnippet);
    expect(snippetRepository.create).toHaveBeenCalledWith(newSnippet);
  });

  it('should delete a snippet', async () => {
    const deletedSnippet = { id: 1, title: 'Deleted Snippet' };
    snippetRepository.delete.mockResolvedValue(deletedSnippet);

    const result = await snippetService.deleteSnippet(1);
    expect(result).toEqual(deletedSnippet);
    expect(snippetRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should update a snippet', async () => {
    const updatedSnippet = { id: 1, title: 'Updated Snippet', language: 'Python', description: 'Updated', code: 'print("updated")' };
    snippetRepository.update.mockResolvedValue(updatedSnippet);

    const result = await snippetService.updateSnippet(1, updatedSnippet);
    expect(result).toEqual(updatedSnippet);
    expect(snippetRepository.update).toHaveBeenCalledWith(1, updatedSnippet);
  });
});