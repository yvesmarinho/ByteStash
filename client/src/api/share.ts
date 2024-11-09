import { ShareSettings, Share, Snippet } from '../types/types';
import { basePath } from './basePath';

const SHARE_API_URL = `${basePath}/api/share`;

export const createShare = async (
  snippetId: string, 
  settings: ShareSettings
): Promise<Share> => {
  const response = await fetch(SHARE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      snippetId,
      ...settings
    })
  });

  if (!response.ok) {
    throw new Error('Failed to create share');
  }

  return response.json();
};

export const getSharesBySnippetId = async (snippetId: string): Promise<Share[]> => {
  const response = await fetch(`${SHARE_API_URL}/snippet/${snippetId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get shares');
  }

  return response.json();
};

export const deleteShare = async (shareId: string): Promise<void> => {
  const response = await fetch(`${SHARE_API_URL}/${shareId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete share');
  }
};

export const getSharedSnippet = async (shareId: string): Promise<Snippet> => {
  const response = await fetch(`${SHARE_API_URL}/${shareId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  if (!response.ok) {
    const data = await response.json();
    const error = new Error(data.error || 'Failed to get shared snippet') as any;
    error.errorCode = response.status;
    throw error;
  }
  
  return response.json();
};