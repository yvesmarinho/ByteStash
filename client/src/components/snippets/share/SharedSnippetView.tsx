import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSharedSnippet } from '../../../api/share';
import { Snippet } from '../../../types/types';
import FullCodeBlock from '../FullCodeBlock';
import CategoryList from '../categories/CategoryList';
import { FileCode, Clock } from 'lucide-react';
import { getLanguageLabel } from '../../../utils/languageUtils';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../../context/AuthContext';
import LoginPage from '../../auth/LoginPage';

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{snippet.title}</h1>
          <p className="text-gray-300 mb-4">{snippet.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>Updated {formatDistanceToNow(new Date(snippet.updated_at), { addSuffix: true })}</span>
            </div>
          </div>

          {snippet.categories.length > 0 && (
            <CategoryList
              categories={snippet.categories}
              onCategoryClick={() => {}}
              className="mt-4"
              variant="clickable"
              showAll={true}
            />
          )}
        </div>

        <div className="space-y-6">
          {snippet.fragments.map((fragment, index) => (
            <div key={index} className="bg-gray-700 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-4">
                <div className="flex items-center gap-2">
                  <FileCode size={16} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-200">{fragment.file_name}</span>
                </div>
                <span className="text-sm text-gray-400">{getLanguageLabel(fragment.language)}</span>
              </div>
              <div className="p-4">
                <FullCodeBlock 
                  code={fragment.code} 
                  language={fragment.language} 
                  showLineNumbers={true}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SharedSnippetView;