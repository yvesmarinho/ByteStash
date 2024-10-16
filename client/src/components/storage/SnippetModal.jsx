import React from 'react';
import Modal from './Modal';
import CodeBlock from './CodeBlock';

const SnippetModal = ({ snippet, isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <h2 className="text-2xl font-bold text-gray-100 mb-2">{snippet.title}</h2>
    <p className="text-gray-400 mb-4">{snippet.language}</p>
    <p className="text-sm text-gray-300 mb-4">{snippet.description}</p>
    <CodeBlock code={snippet.code} language={snippet.language} />
  </Modal>
);

export default SnippetModal;