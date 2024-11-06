import React, { useState } from 'react';
import { Pencil, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { SnippetCardProps } from '../../types/types';
import { getLanguageLabel } from '../../utils/languageUtils';
import PreviewCodeBlock from './PreviewCodeBlock';
import CategoryList from './categories/CategoryList';

const SnippetCard: React.FC<SnippetCardProps> = ({
  snippet,
  viewMode,
  onOpen,
  onDelete,
  onEdit,
  onCategoryClick,
  compactView,
  showCodePreview,
  previewLines,
  showCategories,
  expandCategories,
  showLineNumbers
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(snippet);
  };

  const handleDeleteConfirm = () => {
    onDelete(snippet.id);
    setIsDeleteModalOpen(false);
  };

  const handleCategoryClick = (e: React.MouseEvent, category: string) => {
    e.preventDefault();
    e.stopPropagation();
    onCategoryClick(category);
  };

  const getRelativeTime = (updatedAt: string): string => {
    try {
      const date = new Date(updatedAt);
      return formatDistanceToNow(date, { 
        addSuffix: true,
        includeSeconds: true 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown time';
    }
  };

  const previewFragment = snippet.fragments[0];

  return (
    <>
      <div 
        className={`bg-gray-800 rounded-lg p-4 ${viewMode === 'grid' ? 'h-full' : 'mb-4'} cursor-pointer hover:bg-gray-700 transition-colors relative group ${compactView ? 'text-sm' : ''}`}
        onClick={() => onOpen(snippet)}
      >
        <button
          onClick={handleDeleteClick}
          className="absolute right-4 p-1.5 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100"
          title="Delete snippet"
        >
          <Trash2 size={compactView ? 16 : 18} className="text-gray-400 hover:text-red-500" />
        </button>
        <button
          onClick={handleEditClick}
          className="absolute right-12 p-1.5 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100"
          title="Edit snippet"
        >
          <Pencil size={compactView ? 16 : 18} className="text-gray-400 hover:text-blue-500" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <h3 className={`${compactView ? 'text-lg' : 'text-xl'} font-bold text-gray-200 truncate`} title={snippet.title}>
            {snippet.title}
          </h3>
        </div>

        <p className="text-sm text-gray-400 mb-2 truncate">
          {snippet.fragments.length > 0 
            ? snippet.fragments.map(fragment => getLanguageLabel(fragment.language)).join(', ')
            : 'No language'
          }
        </p>
        
        {!compactView && (
          <p className="text-sm text-gray-300 mb-2 line-clamp-1 min-h-[1em] break-words">
            {snippet.description ? snippet.description : 'No description available'}
          </p>
        )}
        
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <Clock size={compactView ? 12 : 14} className="mr-1" />
          <span>Updated {getRelativeTime(snippet.updated_at)}</span>
        </div>

        {showCategories && (
          <CategoryList
            categories={snippet.categories || []}
            onCategoryClick={handleCategoryClick}
            className="mb-3"
            variant="clickable"
            showAll={expandCategories}
          />
        )}

        {showCodePreview && previewFragment && (
          <>
            <div key={`preview-${snippet.id}`}>
              <PreviewCodeBlock 
                code={previewFragment.code}
                language={previewFragment.language}
                previewLines={previewLines}
                showLineNumbers={showLineNumbers}
              />
            </div>
            {(previewFragment.code.split('\n').length > previewLines || snippet.fragments.length > 1) && (
              <p className="text-xs text-gray-500 mt-2">Click to view all files...</p>
            )}
          </>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        snippetTitle={snippet.title}
      />
    </>
  );
};

export default SnippetCard;