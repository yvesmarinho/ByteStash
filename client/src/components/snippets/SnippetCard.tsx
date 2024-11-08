import React, { useState } from 'react';
import { Pencil, Trash2, Clock, ChevronLeft, ChevronRight, FileCode, Share } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { CodeFragment, Snippet } from '../../types/types';
import { getLanguageLabel } from '../../utils/languageUtils';
import PreviewCodeBlock from './PreviewCodeBlock';
import CategoryList from './categories/CategoryList';

export interface SnippetCardProps {
  snippet: Snippet;
  viewMode: 'grid' | 'list';
  onOpen: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
  onEdit: (snippet: Snippet) => void;
  onCategoryClick: (category: string) => void;
  onShare: (snippet: Snippet) => void;
  compactView: boolean;
  showCodePreview: boolean;
  previewLines: number;
  showCategories: boolean;
  expandCategories: boolean;
  showLineNumbers: boolean;
}

const SnippetCard: React.FC<SnippetCardProps> = ({
  snippet,
  viewMode,
  onOpen,
  onDelete,
  onEdit,
  onCategoryClick,
  onShare,
  compactView,
  showCodePreview,
  previewLines,
  showCategories,
  expandCategories,
  showLineNumbers
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentFragmentIndex, setCurrentFragmentIndex] = useState(0);

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

  const handlePrevFragment = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentFragmentIndex(prev => 
      prev > 0 ? prev - 1 : snippet.fragments.length - 1
    );
  };

  const handleNextFragment = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentFragmentIndex(prev => 
      prev < snippet.fragments.length - 1 ? prev + 1 : 0
    );
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

  const getUniqueLanguages = (fragments: CodeFragment[]): string => {
    if (!fragments || fragments.length === 0) {
      return 'No language';
    }
  
    const uniqueLanguages = [...new Set(
      fragments.map(fragment => getLanguageLabel(fragment.language))
    )];
  
    return uniqueLanguages.join(', ');
  };

  const currentFragment = snippet.fragments[currentFragmentIndex];

  return (
    <>
      <div 
        className={`bg-gray-800 rounded-lg p-4 ${viewMode === 'grid' ? 'h-full' : 'mb-4'} cursor-pointer hover:bg-gray-700 transition-colors relative group ${compactView ? 'text-sm' : ''}`}
        onClick={() => onOpen(snippet)}
      >
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className={`${compactView ? 'text-lg' : 'text-xl'} font-bold text-gray-200 truncate`} title={snippet.title}>
              {snippet.title}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
              <div className="truncate">{getUniqueLanguages(snippet.fragments)}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                <Clock size={12} />
                <span>Updated {getRelativeTime(snippet.updated_at)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(snippet);
              }}
              className="p-1.5 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100"
              title="Share snippet"
            >
              <Share size={16} className="text-gray-400 hover:text-blue-500" />
            </button>
            <button
              onClick={handleEditClick}
              className="p-1.5 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100"
              title="Edit snippet"
            >
              <Pencil size={16} className="text-gray-400 hover:text-blue-500" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-1.5 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100"
              title="Delete snippet"
            >
              <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
            </button>
          </div>
        </div>

        {!compactView && snippet.description && (
          <p className="text-sm text-gray-300 mb-3 line-clamp-1">
            {snippet.description}
          </p>
        )}

        {showCategories && (
          <div className="mb-3">
            <CategoryList
              categories={snippet.categories || []}
              onCategoryClick={handleCategoryClick}
              variant="clickable"
              showAll={expandCategories}
            />
          </div>
        )}

        {showCodePreview && currentFragment && (
          <div>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1 bg-gray-900/50 rounded px-2 py-1">
              <div className="flex items-center gap-1 min-w-0">
                <FileCode size={12} className="text-gray-500 shrink-0" />
                <span className="truncate">{currentFragment.file_name}</span>
              </div>
              {snippet.fragments.length > 1 && (
                <div className="flex items-center gap-0.5 ml-2">
                  <button
                    onClick={handlePrevFragment}
                    className="p-0.5 hover:bg-gray-700 rounded transition-colors"
                    title="Previous file"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="mx-1 text-gray-500">{currentFragmentIndex + 1}/{snippet.fragments.length}</span>
                  <button
                    onClick={handleNextFragment}
                    className="p-0.5 hover:bg-gray-700 rounded transition-colors"
                    title="Next file"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
            
            <div key={`preview-${snippet.id}-${currentFragmentIndex}`}>
              <PreviewCodeBlock 
                code={currentFragment.code}
                language={currentFragment.language}
                previewLines={previewLines}
                showLineNumbers={showLineNumbers}
              />
            </div>
          </div>
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