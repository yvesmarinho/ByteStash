import React from 'react';
import { FileCode, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Snippet } from '../../../types/snippets';
import CategoryList from '../../categories/CategoryList';
import { getLanguageLabel } from '../../../utils/language/languageUtils';
import { FullCodeBlock } from '../../editor/FullCodeBlock';

interface FullCodeViewProps {
  snippet: Snippet;
  onCategoryClick?: (category: string) => void;
  showLineNumbers?: boolean;
  className?: string;
}

export const FullCodeView: React.FC<FullCodeViewProps> = ({
  snippet,
  onCategoryClick,
  showLineNumbers = true,
  className = ''
}) => {
  const handleCategoryClick = (e: React.MouseEvent, category: string) => {
    e.preventDefault();
    onCategoryClick?.(category);
  };

  return (
    <div className={className}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{snippet.title}</h1>
        <p className="text-gray-300 mb-4">{snippet.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>Updated {formatDistanceToNow(new Date(snippet.updated_at), { addSuffix: true })}</span>
          </div>
        </div>

        {snippet.categories?.length > 0 && (
          <CategoryList
            categories={snippet.categories}
            onCategoryClick={handleCategoryClick}
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
                showLineNumbers={showLineNumbers}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};