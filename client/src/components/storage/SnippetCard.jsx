import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import CodeBlock from './CodeBlock';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { deleteSnippet } from '../../api/snippets';

const SnippetCard = ({ snippet, viewMode, onOpen, onDelete, onEdit }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(snippet);
  };

  const handleDeleteConfirm = () => {
    onDelete(snippet.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div 
        className={`bg-gray-800 rounded-lg p-4 ${viewMode === 'grid' ? 'h-full' : 'mb-4'} cursor-pointer hover:bg-gray-700 transition-colors relative group`}
        onClick={() => onOpen(snippet)}
      >
        <button
          onClick={handleDeleteClick}
          className="absolute right-4 p-1.5 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100"
          title="Delete snippet"
        >
          <Trash2 size={18} className="text-gray-400 hover:text-red-500" />
        </button>
        <button
          onClick={handleEditClick}
          className="absolute right-12 p-1.5 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100"
          title="Edit snippet"
        >
          <Pencil size={18} className="text-gray-400 hover:text-blue-500" />
        </button>
        <h3 className="text-xl font-bold mb-2 text-gray-200">{snippet.title}</h3>
        <p className="text-sm text-gray-400 mb-2">{snippet.language}</p>
        <p className="text-sm text-gray-300 mb-3 line-clamp-2 min-h-[3em]">{snippet.description ? snippet.description : 'No description available'}</p>
        <CodeBlock code={snippet.code} language={snippet.language} isPreview={true} />
        {snippet.code.split('\n').length > 4 && (
          <p className="text-xs text-gray-500 mt-2">Click to view full snippet...</p>
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