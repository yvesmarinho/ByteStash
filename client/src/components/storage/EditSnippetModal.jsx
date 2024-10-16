import React, { useState, useMemo, useEffect } from 'react';
import Modal from './Modal';
import 'prismjs';
import 'prismjs/components/prism-markup-templating.js';
import 'prismjs/themes/prism.css';
import { getSupportedLanguages } from '../../utils/languageUtils';
import DynamicCodeEditor from './DynamicCodeEditor';

const CustomDropdown = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = React.useRef(null);
  const inputRef = React.useRef(null);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = (options || []).filter(option =>
    option.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleOptionClick = (option) => {
    onChange(option);
    setSearchTerm(option);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchTerm && !filteredOptions.includes(searchTerm)) {
        onChange(searchTerm); // Add custom entry
        setIsOpen(false);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white p-2 text-sm"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder="Select or type a language"
      />
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white text-sm"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-400 text-sm italic">
              Press Enter to add "{searchTerm}" as a custom language
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

const EditSnippetModal = ({ isOpen, onClose, onSubmit, snippetToEdit }) => {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [key, setKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supportedLanguages = useMemo(() => getSupportedLanguages(), []);
  
  useEffect(() => {
    if (isOpen) {
      if (snippetToEdit) {
        setTitle(snippetToEdit.title || '');
        setLanguage(snippetToEdit.language || '');
        setDescription(snippetToEdit.description || '');
        setCode(snippetToEdit.code || '');
      } else {
        setTitle('');
        setLanguage('');
        setDescription('');
        setCode('');
      }
      setError('');
      setKey(prevKey => prevKey + 1);
    }
  }, [isOpen, snippetToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const snippetData = {
      title,
      language,
      description,
      code
    };

    try {
      onSubmit(snippetData);
    } catch (error) {
      setError('An error occurred while saving the snippet. Please try again.');
      console.error('Error saving snippet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold text-gray-100 mb-4">
        {snippetToEdit ? 'Edit Snippet' : 'Add New Snippet'}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white p-2 text-sm"
            required
            placeholder="Enter the title of the snippet"
          />
        </div>
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-300">Language</label>
          <CustomDropdown
            options={supportedLanguages}
            value={language}
            onChange={setLanguage}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white p-2 text-sm"
            rows="3"
            placeholder="Write a short description of the snippet"
          ></textarea>
        </div>
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-300">Code</label>
          <div className="mt-1 rounded-md bg-gray-800 border border-gray-600 overflow-hidden">
          <DynamicCodeEditor
            key={key}
            code={code}
            onValueChange={setCode}
            language={language}
            required
          />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:bg-blue-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (snippetToEdit ? 'Save Changes' : 'Add Snippet')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditSnippetModal;