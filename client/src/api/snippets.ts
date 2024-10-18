import { Snippet } from '../types/types';

const API_URL = '/api/snippets';

export const fetchSnippets = async (): Promise<Snippet[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch snippets');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching snippets:', error);
    throw error;
  }
};

export const createSnippet = async (snippet: Omit<Snippet, 'id' | 'updated_at'>): Promise<Snippet> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(snippet),
    });

    if (!response.ok) {
      throw new Error('Failed to create snippet');
    }

    const createdSnippet = await response.json();
    return createdSnippet;
  } catch (error) {
    console.error('Error creating snippet:', error);
    throw error;
  }
};

export const deleteSnippet = async (id: string): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete snippet');
    }

    await response.json();
    return id;
  } catch (error) {
    console.error('Error deleting snippet:', error);
    throw error;
  }
};

export const editSnippet = async (id: string, snippet: Omit<Snippet, 'id' | 'updated_at'>): Promise<Snippet> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(snippet),
    });

    if (!response.ok) {
      throw new Error('Failed to update snippet');
    }

    const updatedSnippet = await response.json();
    return updatedSnippet;
  } catch (error) {
    console.error('Error updating snippet:', error);
    throw error;
  }
};