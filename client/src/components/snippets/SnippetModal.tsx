import React from 'react';
import Modal from '../common/Modal';
import { SnippetModalProps } from '../../types/types';
import FullCodeBlock from './FullCodeBlock';
import CategoryList from './categories/CategoryList';

const SnippetModal: React.FC<SnippetModalProps> = ({ 
  snippet, 
  isOpen, 
  onClose, 
  onCategoryClick 
}) => {
  if (!snippet) return null;

  const handleCategoryClick = (e: React.MouseEvent, category: string) => {
    e.preventDefault();
    onCategoryClick(category);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold text-gray-100 mb-2 truncate">{snippet.title}</h2>
      <p className="text-gray-400 mb-4 truncate">{snippet.language}</p>
      <p className="text-sm text-gray-300 mb-4 break-words">{snippet.description}</p>
      <CategoryList
        categories={snippet.categories || []}
        onCategoryClick={handleCategoryClick}
        className="mb-3"
        variant="clickable"
        showAll={true}
      />
      <FullCodeBlock code={snippet.code} language={snippet.language} />
    </Modal>
  );
};

export default SnippetModal;