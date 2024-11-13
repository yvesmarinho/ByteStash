import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Snippet } from '../../../types/snippets';
import { getSnippetById } from '../../../utils/api/snippets';
import { LoginPage } from '../../auth/LoginPage';
import { FullCodeView } from './FullCodeView'; 

const SnippetPage: React.FC = () => {
  const { snippetId } = useParams<{ snippetId: string }>();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadSnippet();
  }, [snippetId, isAuthenticated]);

  const loadSnippet = async () => {
    if (!snippetId) return;
  
    try {
      setIsLoading(true);
      const data = await getSnippetById(snippetId);
      setSnippet(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load snippet');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Snippet not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <FullCodeView snippet={snippet} />
      </div>
    </div>
  );
};

export default SnippetPage;