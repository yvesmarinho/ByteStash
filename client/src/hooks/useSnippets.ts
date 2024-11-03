import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchSnippets, createSnippet, editSnippet, deleteSnippet } from '../api/snippets';
import { useToast } from '../components/toast/Toast';
import { useAuth } from '../context/AuthContext';
import { Snippet } from '../types/types';

export const useSnippets = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();
  const { logout } = useAuth();
  const hasLoadedRef = useRef(false);
  
  const handleAuthError = (error: any) => {
    if (error.status === 401 || error.status === 403) {
      logout();
      addToast('Session expired. Please login again.', 'error');
    }
  };
  
  const loadSnippets = useCallback(async () => {
    if (!isLoading || hasLoadedRef.current) return;
    
    try {
      const fetchedSnippets = await fetchSnippets();
      const sortedSnippets = fetchedSnippets.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      setSnippets(sortedSnippets);
      
      if (!hasLoadedRef.current) {
        addToast('Snippets loaded successfully', 'success');
        hasLoadedRef.current = true;
      }
    } catch (error: any) {
      console.error('Failed to fetch snippets:', error);
      handleAuthError(error);
      addToast('Failed to load snippets. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addToast, logout]);
  
  useEffect(() => {
    loadSnippets();
  }, [loadSnippets]);

  const reloadSnippets = useCallback(() => {
    hasLoadedRef.current = false;
    setIsLoading(true);
    loadSnippets();
  }, [loadSnippets]);

  const addSnippet = async (snippetData: Omit<Snippet, 'id' | 'updated_at'>) => {
    try {
      const newSnippet = await createSnippet(snippetData);
      setSnippets(prevSnippets => [...prevSnippets, newSnippet]);
      addToast('New snippet created successfully', 'success');
      return newSnippet;
    } catch (error: any) {
      console.error('Error creating snippet:', error);
      handleAuthError(error);
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
    } catch (error: any) {
      console.error('Error updating snippet:', error);
      handleAuthError(error);
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
    } catch (error: any) {
      console.error('Failed to delete snippet:', error);
      handleAuthError(error);
      addToast('Failed to delete snippet. Please try again.', 'error');
      throw error;
    }
  };

  return {
    snippets,
    isLoading,
    addSnippet,
    updateSnippet,
    removeSnippet,
    reloadSnippets
  };
};