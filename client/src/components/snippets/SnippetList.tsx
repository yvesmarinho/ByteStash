import React from 'react';
import SnippetCard from './SnippetCard';
import { SnippetListProps } from '../../types/types';

const SnippetList: React.FC<SnippetListProps> = ({ 
  snippets, 
  viewMode, 
  onOpen, 
  onDelete, 
  onEdit, 
  compactView, 
  showCodePreview, 
  previewLines 
}) => {
  if (snippets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-400 mb-4">No snippets match your search criteria.</p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' 
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
      : 'space-y-6'
    }>
      {snippets.map(snippet => (
        <SnippetCard 
          key={snippet.id} 
          snippet={snippet} 
          viewMode={viewMode}
          onOpen={onOpen}
          onDelete={onDelete}
          onEdit={onEdit}
          compactView={compactView}
          showCodePreview={showCodePreview}
          previewLines={previewLines}
        />
      ))}
    </div>
  );
};

export default SnippetList;