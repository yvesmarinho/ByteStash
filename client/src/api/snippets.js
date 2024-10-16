const API_URL = '/api/snippets';

export const fetchSnippets = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch snippets');
    }
    const data = await response.json();
    return data; // Return the fetched snippets instead of setting state directly
  } catch (error) {
    console.error('Error fetching snippets:', error);
    throw error; // Re-throw the error for the caller to handle
  }
};

export const createSnippet = async (snippet) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: snippet.title,
        language: snippet.language,
        description: snippet.description,
        code: snippet.code
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create snippet');
    }

    const createdSnippet = await response.json();
    return createdSnippet; // Return the created snippet
  } catch (error) {
    console.error('Error creating snippet:', error);
    throw error;
  }
};

export const deleteSnippet = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete snippet');
    }

    await response.json(); // Consume the response body
    return id; // Return the deleted snippet id
  } catch (error) {
    console.error('Error deleting snippet:', error);
    throw error;
  }
};

export const editSnippet = async (id, snippet) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: snippet.title,
        language: snippet.language,
        description: snippet.description,
        code: snippet.code
      }),
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