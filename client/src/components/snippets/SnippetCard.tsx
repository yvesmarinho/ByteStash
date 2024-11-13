import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Trash2, Clock, ChevronLeft, ChevronRight, FileCode, Share, Users, MoreVertical, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { CodeFragment, Snippet } from '../../types/types';
import { getLanguageLabel } from '../../utils/languageUtils';
import PreviewCodeBlock from './PreviewCodeBlock';
import CategoryList from './categories/CategoryList';
import { getSharesBySnippetId } from '../../api/share';

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
  const [activeShares, setActiveShares] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const loadShareStatus = async () => {
      try {
        const shares = await getSharesBySnippetId(snippet.id);
        const validShares = shares.filter(share => !share.expired);
        setActiveShares(validShares.length);
      } catch (error) {
        console.error('Error loading share status:', error);
      }
    };

    loadShareStatus();
  }, [snippet]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onEdit(snippet);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onShare(snippet);
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

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOpenInNewTab = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    window.open(`/snippets/${snippet.id}`, '_blank');
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
            <div className="flex items-center gap-2">
              {activeShares > 0 && (
                <div 
                  className="inline-flex items-center gap-1 px-2 bg-blue-900/40 text-blue-300 rounded text-xs border border-blue-700/30 leading-relaxed"
                  title={`Shared with ${activeShares} active link${activeShares === 1 ? '' : 's'}`}
                >
                  <Users size={12} className="stroke-[2.5]" />
                  <span>{activeShares}</span>
                </div>
              )}
              <h3 className={`${compactView ? 'text-lg' : 'text-xl'} font-bold text-gray-200 truncate leading-normal`} title={snippet.title}>
                {snippet.title}
              </h3>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
              <div className="truncate">{getUniqueLanguages(snippet.fragments)}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                <Clock size={12} />
                <span>Updated {getRelativeTime(snippet.updated_at)}</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              ref={buttonRef}
              onClick={toggleMenu}
              className="p-1.5 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical size={16} className="text-gray-400" />
            </button>

            {isMenuOpen && (
              <div 
                ref={menuRef}
                className="absolute right-0 top-8 w-48 bg-gray-800 rounded-md shadow-lg border border-gray-700 py-1 z-50"
              >
                <button
                  onClick={handleOpenInNewTab}
                  className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                >
                  <ExternalLink size={16} className="text-gray-400" />
                  Open in new tab
                </button>
                <button
                  onClick={handleShareClick}
                  className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                >
                  <Share size={16} className="text-gray-400" />
                  Share
                </button>
                <button
                  onClick={handleEditClick}
                  className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                >
                  <Pencil size={16} className="text-gray-400" />
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-700 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            )}
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