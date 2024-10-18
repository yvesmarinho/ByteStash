import React from 'react';
import Modal from '../common/Modal';
import CodeBlock from './CodeBlock';
import { SnippetModalProps } from '../../types/types';

const SnippetModal: React.FC<SnippetModalProps> = ({ snippet, isOpen, onClose }) => {
  if (!snippet) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <h2 className="text-2xl font-bold text-gray-100 mb-2 truncate">{snippet.title}</h2>
        <p className="text-gray-400 mb-4 truncate">{snippet.language}</p>
        <p className="text-sm text-gray-300 mb-4 break-words">{snippet.description}</p>
        <CodeBlock code={snippet.code} language={snippet.language} />
      </div>
    </Modal>
  );
};

export default SnippetModal;