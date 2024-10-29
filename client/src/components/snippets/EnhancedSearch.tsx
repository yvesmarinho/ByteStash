import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import BaseDropdown from '../common/BaseDropdown';

interface EnhancedSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onCategorySelect: (category: string) => void;
  existingCategories: string[];
  selectedCategories: string[];
}

const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  searchTerm,
  onSearchChange,
  onCategorySelect,
  existingCategories,
  selectedCategories
}) => {
  const [inputValue, setInputValue] = useState(searchTerm);
  const lastSearchTermRef = useRef(searchTerm);

  useEffect(() => {
    if (searchTerm !== lastSearchTermRef.current) {
      setInputValue(searchTerm);
      lastSearchTermRef.current = searchTerm;
    }
  }, [searchTerm]);

  const getSections = (searchTerm: string) => {
    if (!searchTerm.includes('#')) return [];

    const term = searchTerm.slice(searchTerm.lastIndexOf('#') + 1).trim().toLowerCase();
    const sections = [];
    
    const availableCategories = existingCategories.filter(
      cat => !selectedCategories.includes(cat.toLowerCase())
    );

    const filtered = term
      ? availableCategories.filter(cat => cat.toLowerCase().includes(term))
      : availableCategories;

    if (filtered.length > 0) {
      sections.push({
        title: 'Categories',
        items: filtered
      });
    }

    if (term && !existingCategories.some(cat => cat.toLowerCase() === term)) {
      sections.push({
        title: 'Add New',
        items: [`Add new: ${term}`]
      });
    }

    return sections;
  };

  const handleSelect = (option: string) => {
    const newCategory = option.startsWith('Add new:') 
      ? option.slice(9).trim() 
      : option;

    const hashtagIndex = inputValue.lastIndexOf('#');
    if (hashtagIndex !== -1) {
      const newValue = inputValue.substring(0, hashtagIndex).trim();
      setInputValue(newValue);
      onSearchChange(newValue);
    }

    onCategorySelect(newCategory.toLowerCase());
  };

  return (
    <div className="relative flex-grow">
      <BaseDropdown
        value={inputValue}
        onChange={(value) => {
          setInputValue(value);
          onSearchChange(value);
        }}
        onSelect={handleSelect}
        getSections={getSections}
        placeholder="Search snippets... (Type # to see all available categories)"
        className="h-10 mt-0 bg-gray-800"
        showChevron={false}
      />
      <Search 
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
        size={20} 
      />
    </div>
  );
};

export default EnhancedSearch;