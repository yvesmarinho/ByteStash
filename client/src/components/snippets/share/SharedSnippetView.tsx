import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Snippet } from '../../../types/snippets';
import { useAuth } from '../../../hooks/useAuth';
import { getSharedSnippet } from '../../../utils/api/share';
import { LoginPage } from '../../auth/LoginPage';
import { FullCodeView } from '../view/FullCodeView';

const SharedSnippetView: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadSharedSnippet();
  }, [shareId, isAuthenticated]);

  const loadSharedSnippet = async () => {
    if (!shareId) return;
  
    try {
      setIsLoading(true);
      const shared = await getSharedSnippet(shareId);
      setSnippet(shared);
      setError(null);
    } catch (err: any) {
      setErrorCode(err.errorCode);
      setError(err.error);
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

  if (errorCode === 401 && !isAuthenticated) {
    return <LoginPage />;
  }

  if (errorCode === 410) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Shared snippet has expired</div>
      </div>
    );
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

export default SharedSnippetView;