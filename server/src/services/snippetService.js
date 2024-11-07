const snippetRepository = require('../repositories/snippetRepository');

class SnippetService {
  async getAllSnippets() {
    try {
      console.log('Service: Getting all snippets');
      const result = await snippetRepository.findAll();
      console.log(`Service: Retrieved ${result.length} snippets`);
      return result;
    } catch (error) {
      console.error('Service Error - getAllSnippets:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  async createSnippet(snippetData) {
    try {
      console.log('Service: Creating new snippet');
      const result = await snippetRepository.create(snippetData);
      console.log('Service: Created snippet with ID:', result.id);
      return result;
    } catch (error) {
      console.error('Service Error - createSnippet:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  async deleteSnippet(id) {
    try {
      console.log('Service: Deleting snippet:', id);
      const result = await snippetRepository.delete(id);
      console.log('Service: Delete operation result:', result ? 'Success' : 'Not Found');
      return result;
    } catch (error) {
      console.error('Service Error - deleteSnippet:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  async updateSnippet(id, snippetData) {
    try {
      console.log('Service: Updating snippet:', id);
      const result = await snippetRepository.update(id, snippetData);
      console.log('Service: Update operation result:', result ? 'Success' : 'Not Found');
      return result;
    } catch (error) {
      console.error('Service Error - updateSnippet:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }
}

module.exports = new SnippetService();