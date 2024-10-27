import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

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
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastSearchTermRef = useRef(searchTerm);

  useEffect(() => {
    if (searchTerm !== lastSearchTermRef.current) {
      setInputValue(searchTerm);
      lastSearchTermRef.current = searchTerm;
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onSearchChange(value);

    const hashtagIndex = value.lastIndexOf('#');
    if (hashtagIndex !== -1) {
      const typedCategory = value.slice(hashtagIndex + 1).trim().toLowerCase();
      
      let availableCategories = existingCategories.filter(cat => !selectedCategories.includes(cat));
      
      if (typedCategory) {
        availableCategories = availableCategories.filter(cat => 
          cat.toLowerCase().includes(typedCategory)
        );
      }
      
      setFilteredCategories(availableCategories);
      setShowDropdown(availableCategories.length > 0);
      setSelectedIndex(0);
    } else {
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCategories.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCategories.length > 0) {
          handleCategorySelect(filteredCategories[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };

  const handleCategorySelect = (category: string) => {
    const hashtagIndex = inputValue.lastIndexOf('#');
    if (hashtagIndex === -1) return;

    const newValue = inputValue.substring(0, hashtagIndex).trim();
    
    setInputValue(newValue);
    onSearchChange(newValue);
    onCategorySelect(category);
    setShowDropdown(false);
    
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.value = newValue;
    }
  };

  return (
    <div className="relative flex-grow" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search snippets... (Type # to see all available categories)"
        className="w-full bg-gray-800 rounded-lg py-2 px-4 pr-10 focus:outline-none"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
      
      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 rounded-lg shadow-lg border border-gray-700 max-h-60 overflow-y-auto">
          {filteredCategories.length === 0 ? (
            <div className="px-4 py-2 text-gray-400 text-sm italic">
              No matching categories available
            </div>
          ) : (
            filteredCategories.map((category, index) => (
              <button
                key={index}
                className={`w-full text-left px-4 py-2 hover:bg-gray-700 text-gray-200 text-sm flex items-center justify-between group
                  ${index === selectedIndex ? 'bg-gray-700' : ''}`}
                onClick={() => handleCategorySelect(category)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span>{category}</span>
                <span className="text-gray-400 opacity-0 group-hover:opacity-100">Add category</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearch;