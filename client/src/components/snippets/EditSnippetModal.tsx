import React, { useState, useEffect, useRef } from 'react';
import Modal from '../common/Modal';
import 'prismjs';
import 'prismjs/components/prism-markup-templating.js';
import 'prismjs/themes/prism.css';
import { getSupportedLanguages, getLanguageLabel } from '../../utils/languageUtils';
import DynamicCodeEditor from './DynamicCodeEditor';
import { EditSnippetModalProps } from '../../types/types';

interface CustomDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, value, onChange, maxLength }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInternalValue(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        matchCaseAndUpdate();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [options, internalValue]);

  const matchCaseAndUpdate = () => {
    const match = options.find(option => 
      option.toLowerCase() === internalValue.toLowerCase()
    );
    if (match) {
      setInternalValue(match);
      onChange(match);
    } else {
      onChange(internalValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.slice(0, maxLength);
    setInternalValue(newValue);
  };

  const handleOptionClick = (option: string) => {
    setInternalValue(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  const handleInputBlur = () => {
    matchCaseAndUpdate();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsOpen(false);
      matchCaseAndUpdate();
    }
  };

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(internalValue.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white p-2 text-sm"
        value={internalValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder="Select or type a language"
        maxLength={maxLength}
      />
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white text-sm"
                onClick={() => handleOptionClick(option)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {option}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-400 text-sm italic">
              No matching languages found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

const EditSnippetModal: React.FC<EditSnippetModalProps> = ({ isOpen, onClose, onSubmit, snippetToEdit }) => {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [key, setKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState('');
  
  useEffect(() => {
    if (snippetToEdit) {
      setCategories(snippetToEdit.categories || []);
    } else {
      setCategories([]);
    }
  }, [snippetToEdit]);

  const handleCategoryInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && categoryInput.trim()) {
      e.preventDefault();
      addCategory(categoryInput.trim());
    }
  };

  const addCategory = (category: string) => {
    const normalizedCategory = category.toLowerCase().replace(/,/g, '').trim();
    if (normalizedCategory && categories.length < 20 && !categories.includes(normalizedCategory)) {
      setCategories([...categories, normalizedCategory]);
    }
    setCategoryInput('');
  };

  const removeCategory = (categoryToRemove: string) => {
    setCategories(categories.filter(cat => cat !== categoryToRemove));
  };

  useEffect(() => {
    if (isOpen) {
      const languages = getSupportedLanguages().reduce((acc: string[], lang) => {
        acc.push(lang.language);
        acc.push(...lang.aliases);
        return acc;
      }, [])
      .sort((a, b) => {
        return getLanguageLabel(a).localeCompare(getLanguageLabel(b));
      });

      setSupportedLanguages(languages);

      if (snippetToEdit) {
        setTitle(snippetToEdit.title?.slice(0, 255) || '');
        setLanguage(snippetToEdit.language?.slice(0, 50) || '');
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

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const snippetData = {
      title: title.slice(0, 255),
      language: language.slice(0, 50),
      description: description,
      code: code,
      categories: categories
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
      <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-full">
        <h2 className="text-xl font-bold text-gray-100 mb-4">
          {snippetToEdit ? 'Edit Snippet' : 'Add New Snippet'}
        </h2>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 100))}
              className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white p-2 text-sm"
              required
              placeholder="Enter the title of the snippet (max 100 characters)"
              maxLength={100}
            />
            <p className="text-sm text-gray-400 mt-1">{title.length}/100 characters</p>
          </div>
          
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-300">Language</label>
            <CustomDropdown
              options={supportedLanguages}
              value={language}
              onChange={handleLanguageChange}
              maxLength={50}
            />
            <p className="text-sm text-gray-400 mt-1">{language.length}/50 characters</p>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white p-2 text-sm"
              rows={3}
              placeholder="Write a short description of the snippet"
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="categories" className="block text-sm font-medium text-gray-300">
              Categories (max 20)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="categories"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyDown={handleCategoryInputKeyDown}
                className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white p-2 text-sm"
                placeholder="Type a category and press Enter or comma"
                disabled={categories.length >= 20}
              />
              <p className="text-sm text-gray-400 mt-1">
                {categories.length}/20 categories
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => removeCategory(category)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-700 text-sm hover:bg-gray-600 transition-colors group"
                    type="button"
                  >
                    <span>{category}</span>
                    <span className="text-gray-400 group-hover:text-white">×</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <label htmlFor="code" className="block text-sm font-medium text-gray-300">Code</label>
            <div className="mt-1 rounded-md bg-gray-800 border border-gray-600 overflow-hidden">
              <DynamicCodeEditor
                key={key}
                code={code}
                onValueChange={setCode}
                language={language}
              />
            </div>
          </div>
        </div>

        <div className="sticky -bottom-1 inset-x-0 bg-gray-800 border-t border-gray-600 mt-4 z-10">
          <div className="flex justify-end gap-2 py-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
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
        </div>
      </form>
    </Modal>
  );
};

export default EditSnippetModal;