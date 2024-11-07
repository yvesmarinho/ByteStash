const express = require('express');
const snippetService = require('../services/snippetService');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('Fetching all snippets...');
    const snippets = await snippetService.getAllSnippets();
    console.log(`Successfully fetched ${snippets.length} snippets`);
    res.json(snippets);
  } catch (error) {
    console.error('Error in GET /snippets:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      stack: error.stack 
    });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('Creating new snippet:', req.body);
    const newSnippet = await snippetService.createSnippet(req.body);
    console.log('Successfully created snippet:', newSnippet.id);
    res.status(201).json(newSnippet);
  } catch (error) {
    console.error('Error in POST /snippets:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      stack: error.stack 
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting snippet:', req.params.id);
    const result = await snippetService.deleteSnippet(req.params.id);
    if (!result) {
      console.log('Snippet not found:', req.params.id);
      res.status(404).json({ error: 'Snippet not found' });
    } else {
      console.log('Successfully deleted snippet:', req.params.id);
      res.json({ id: result.id });
    }
  } catch (error) {
    console.error('Error in DELETE /snippets/:id:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      stack: error.stack 
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    console.log('Updating snippet:', req.params.id);
    const updatedSnippet = await snippetService.updateSnippet(req.params.id, req.body);
    if (!updatedSnippet) {
      console.log('Snippet not found:', req.params.id);
      res.status(404).json({ error: 'Snippet not found' });
    } else {
      console.log('Successfully updated snippet:', req.params.id);
      res.json(updatedSnippet);
    }
  } catch (error) {
    console.error('Error in PUT /snippets/:id:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      stack: error.stack 
    });
  }
});

module.exports = router;