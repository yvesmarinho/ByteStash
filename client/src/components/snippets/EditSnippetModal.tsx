import React, { useState, useEffect, useMemo } from 'react';
import Modal from '../common/Modal';
import 'prismjs';
import 'prismjs/components/prism-markup-templating.js';
import 'prismjs/themes/prism.css';
import { getSupportedLanguages, getLanguageLabel } from '../../utils/languageUtils';
import CodeEditor from './CodeEditor';
import { EditSnippetModalProps } from '../../types/types';
import { useSnippets } from '../../hooks/useSnippets';
import BaseDropdown from '../common/BaseDropdown';
import CategorySuggestions from './categories/CategorySuggestions';
import CategoryList from './categories/CategoryList';

const EditSnippetModal: React.FC<EditSnippetModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  snippetToEdit,
  showLineNumbers = true
}) => {
  const { snippets, reloadSnippets } = useSnippets();
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [key, setKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState('');

  const allCategories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    snippets.forEach(snippet => {
      snippet.categories?.forEach(category => {
        uniqueCategories.add(category);
      });
    });
    return Array.from(uniqueCategories).sort();
  }, [snippets]);

  const standardLanguages = useMemo(() => {
    const langs = getSupportedLanguages().reduce((acc: string[], lang) => {
      acc.push(lang.language);
      acc.push(...lang.aliases);
      return acc;
    }, []);
    return [...new Set(langs)].sort((a, b) => 
      getLanguageLabel(a).localeCompare(getLanguageLabel(b))
    );
  }, []);

  const customLanguages = useMemo(() => {
    const customLangs = snippets
      .map(snippet => snippet.language)
      .filter(lang => !standardLanguages.includes(lang));
    return [...new Set(customLangs)];
  }, [snippets, standardLanguages]);

  const sortByRelevance = (items: string[], searchTerm: string): string[] => {
    if (!searchTerm) return items;
    
    const term = searchTerm.toLowerCase();
    
    return [...items].sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      
      if (aLower === term && bLower !== term) return -1;
      if (aLower !== term && bLower === term) return 1;
      
      const aLabel = getLanguageLabel(a).toLowerCase();
      const bLabel = getLanguageLabel(b).toLowerCase();
      if (aLabel === term && bLabel !== term) return -1;
      if (aLabel !== term && bLabel === term) return 1;
      
      const aStarts = aLower.startsWith(term);
      const bStarts = bLower.startsWith(term);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      const aLabelStarts = aLabel.startsWith(term);
      const bLabelStarts = bLabel.startsWith(term);
      if (aLabelStarts && !bLabelStarts) return -1;
      if (!aLabelStarts && bLabelStarts) return 1;
      
      const aContains = aLower.includes(term);
      const bContains = bLower.includes(term);
      if (aContains && !bContains) return -1;
      if (!aContains && bContains) return 1;
      
      const aLabelContains = aLabel.includes(term);
      const bLabelContains = bLabel.includes(term);
      if (aLabelContains && !bLabelContains) return -1;
      if (!aLabelContains && bLabelContains) return 1;
      
      if (a.length !== b.length) return a.length - b.length;
      return a.localeCompare(b);
    });
  };

  const getLanguageSections = (searchTerm: string) => {
    const term = searchTerm.toLowerCase().trim();
    
    const normalizedStandard = standardLanguages.reduce((acc, lang) => {
      const normalized = lang.toLowerCase();
      if (!acc.some(l => l.toLowerCase() === normalized)) {
        acc.push(lang);
      }
      return acc;
    }, [] as string[]);
    
    const normalizedCustom = customLanguages.reduce((acc, lang) => {
      const normalized = lang.toLowerCase();
      if (!acc.some(l => l.toLowerCase() === normalized) && 
          !normalizedStandard.some(l => l.toLowerCase() === normalized)) {
        acc.push(lang);
      }
      return acc;
    }, [] as string[]);
    
    const sections = [];

    const standardFiltered = normalizedStandard.filter(option => {
      const label = getLanguageLabel(option).toLowerCase();
      const optionLower = option.toLowerCase();
      return label.includes(term) || optionLower.includes(term);
    });
    
    if (standardFiltered.length > 0) {
      sections.push({
        title: 'Standard Languages',
        items: sortByRelevance(standardFiltered, term)
      });
    }

    const customFiltered = normalizedCustom.filter(option => {
      const label = getLanguageLabel(option).toLowerCase();
      const optionLower = option.toLowerCase();
      return label.includes(term) || optionLower.includes(term);
    });

    if (customFiltered.length > 0) {
      sections.push({
        title: 'Custom Languages',
        items: sortByRelevance(customFiltered, term)
      });
    }

    const hasExactMatch = [...standardFiltered, ...customFiltered].some(
      option => 
        option.toLowerCase() === term || 
        getLanguageLabel(option).toLowerCase() === term
    );

    if (term && !hasExactMatch && term.length > 0) {
      sections.push({
        title: 'Add New',
        items: [`Add new: ${term}`]
      });
    }

    return sections;
  };

  useEffect(() => {
    if (isOpen) {
      if (snippetToEdit) {
        setTitle(snippetToEdit.title?.slice(0, 255) || '');
        setLanguage(snippetToEdit.language?.slice(0, 50) || '');
        setDescription(snippetToEdit.description || '');
        setCode(snippetToEdit.code || '');
        setCategories(snippetToEdit.categories || []);
      } else {
        setTitle('');
        setLanguage('');
        setDescription('');
        setCode('');
        setCategories([]);
      }
      setError('');
      setCategoryInput('');
      setKey(prevKey => prevKey + 1);
    }
  }, [isOpen, snippetToEdit]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleLanguageSelect = (option: string) => {
    const finalValue = option.startsWith('Add new:') ? option.slice(9).trim() : option;
    setLanguage(finalValue);
  };

  const handleCategorySelect = (category: string) => {
    const normalizedCategory = category.toLowerCase().trim();
    if (normalizedCategory && categories.length < 20 && !categories.includes(normalizedCategory)) {
      setCategories(prev => [...prev, normalizedCategory]);
    }
    setCategoryInput('');
  };

  const handleRemoveCategory = (e: React.MouseEvent, category: string) => {
    e.preventDefault();
    setCategories(cats => cats.filter(c => c !== category));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      await onSubmit(snippetData);
      reloadSnippets();
      onClose();
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
              className="mt-1 block w-full rounded-md bg-gray-700 text-white p-2 text-sm"
              required
              placeholder="Enter the title of the snippet (max 100 characters)"
              maxLength={100}
            />
            <p className="text-sm text-gray-400 mt-1">{title.length}/100 characters</p>
          </div>
          
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-300">Language</label>
            <BaseDropdown
              value={language}
              onChange={handleLanguageChange}
              onSelect={handleLanguageSelect}
              getSections={getLanguageSections}
              maxLength={50}
              placeholder="Select or type a language"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 text-white p-2 text-sm"
              rows={3}
              placeholder="Write a short description of the snippet"
            />
          </div>
          
          <div>
            <label htmlFor="categories" className="block text-sm font-medium text-gray-300">
              Categories (max 20)
            </label>
            <CategorySuggestions
              key={`category-suggestions-${key}`}
              inputValue={categoryInput}
              onInputChange={setCategoryInput}
              onCategorySelect={handleCategorySelect}
              existingCategories={allCategories}
              selectedCategories={categories}
              placeholder="Type a category and press Enter or comma"
              maxCategories={20}
              showAddText={true}
              handleHashtag={false}
            />
            <p className="text-sm text-gray-400 mt-1">
              {categories.length}/20 categories
            </p>
            <CategoryList
              categories={categories}
              onCategoryClick={handleRemoveCategory}
              className="mt-2"
              variant="removable"
            />
          </div>

          <div className="relative">
            <label htmlFor="code" className="block text-sm font-medium text-gray-300">Code</label>
            <div className="mt-1 rounded-md bg-gray-800 overflow-hidden">
              <CodeEditor
                key={key}
                code={code}
                onValueChange={(value) => setCode(value ?? '')}
                language={language}
                showLineNumbers={showLineNumbers}
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