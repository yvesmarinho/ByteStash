import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchSnippets, createSnippet, editSnippet, deleteSnippet } from '../api/snippets';
import { useToast } from '../components/toast/Toast';
import { Snippet } from '../types/types';

export const useSnippets = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();
  const hasLoadedRef = useRef(false);
  
  const loadSnippets = useCallback(async () => {
    if (!isLoading || hasLoadedRef.current) return;
    
    try {
      const fetchedSnippets = await fetchSnippets();
      const sortedSnippets = fetchedSnippets.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      setSnippets(sortedSnippets);
      
      if (!hasLoadedRef.current) {
        addToast('Snippets loaded successfully', 'success');
        hasLoadedRef.current = true;
      }
    } catch (error) {
      console.error('Failed to fetch snippets:', error);
      addToast('Failed to load snippets. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addToast]);
  
  useEffect(() => {
    loadSnippets();
  }, [loadSnippets]);

  const addSnippet = async (snippetData: Omit<Snippet, 'id' | 'updated_at'>) => {
    try {
      const newSnippet = await createSnippet(snippetData);
      setSnippets(prevSnippets => [...prevSnippets, newSnippet]);
      addToast('New snippet created successfully', 'success');
      return newSnippet;
    } catch (error) {
      console.error('Error creating snippet:', error);
      addToast('Failed to create snippet', 'error');
      throw error;
    }
  };

  const updateSnippet = async (id: string, snippetData: Omit<Snippet, 'id' | 'updated_at'>) => {
    try {
      const updatedSnippet = await editSnippet(id, snippetData);
      setSnippets(prevSnippets =>
        prevSnippets.map(s => s.id === updatedSnippet.id ? updatedSnippet : s)
      );
      addToast('Snippet updated successfully', 'success');
      return updatedSnippet;
    } catch (error) {
      console.error('Error updating snippet:', error);
      addToast('Failed to update snippet', 'error');
      throw error;
    }
  };

  const removeSnippet = async (id: string) => {
    try {
      await deleteSnippet(id);
      setSnippets(prevSnippets => {
        const updatedSnippets = prevSnippets.filter(snippet => snippet.id !== id);
        return updatedSnippets;
      });
      addToast('Snippet deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete snippet:', error);
      addToast('Failed to delete snippet. Please try again.', 'error');
      throw error;
    }
  };

  return {
    snippets,
    isLoading,
    addSnippet,
    updateSnippet,
    removeSnippet
  };
};