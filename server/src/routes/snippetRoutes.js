const express = require('express');
const snippetService = require('../services/snippetService');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const snippets = await snippetService.getAllSnippets();
    res.json(snippets);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newSnippet = await snippetService.createSnippet(req.body);
    res.status(201).json(newSnippet);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await snippetService.deleteSnippet(req.params.id);
    if (!result) {
      res.status(404).json({ error: 'Snippet not found' });
    } else {
      res.json({ id: result.id });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedSnippet = await snippetService.updateSnippet(req.params.id, req.body);
    if (!updatedSnippet) {
      res.status(404).json({ error: 'Snippet not found' });
    } else {
      res.json(updatedSnippet);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;