const snippetRepository = require('../repositories/snippetRepository');

class SnippetService {
  async getAllSnippets() {
    return await snippetRepository.findAll();
  }

  async createSnippet(snippetData) {
    return await snippetRepository.create(snippetData);
  }

  async deleteSnippet(id) {
    return await snippetRepository.delete(id);
  }

  async updateSnippet(id, snippetData) {
    return await snippetRepository.update(id, snippetData);
  }
}

module.exports = new SnippetService();