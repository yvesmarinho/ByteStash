import { Snippet } from '../types/types';

export const API_URL = '/api/snippets';

interface ApiError extends Error {
    status?: number;
}

export const AUTH_ERROR_EVENT = 'bytestash:auth_error';
export const authErrorEvent = new CustomEvent(AUTH_ERROR_EVENT);

const handleResponse = async (response: Response) => {
    if (response.status === 401 || response.status === 403) {
        window.dispatchEvent(authErrorEvent);
        
        const error = new Error('Authentication required') as ApiError;
        error.status = response.status;
        throw error;
    }

    if (!response.ok) {
        const text = await response.text();
        console.error('Error response body:', text);
        const error = new Error(`Request failed: ${response.status} ${response.statusText}`) as ApiError;
        error.status = response.status;
        throw error;
    }

    return response;
};

const getHeaders = () => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

export const fetchSnippets = async (): Promise<Snippet[]> => {
    try {
        const response = await fetch(API_URL, {
            headers: getHeaders()
        });
        
        await handleResponse(response);
        const text = await response.text();
        
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse JSON:', e);
            console.error('Full response:', text);
            throw e;
        }
    } catch (error) {
        console.error('Error fetching snippets:', error);
        throw error;
    }
};

export const createSnippet = async (snippet: Omit<Snippet, 'id' | 'updated_at'>): Promise<Snippet> => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(snippet),
        });

        await handleResponse(response);
        return response.json();
    } catch (error) {
        console.error('Error creating snippet:', error);
        throw error;
    }
};

export const deleteSnippet = async (id: string): Promise<string> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });

        await handleResponse(response);
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
            headers: getHeaders(),
            body: JSON.stringify(snippet),
        });

        await handleResponse(response);
        return response.json();
    } catch (error) {
        console.error('Error updating snippet:', error);
        throw error;
    }
};