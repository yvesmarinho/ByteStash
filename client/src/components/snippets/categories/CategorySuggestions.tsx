import React, { useState, useRef, useEffect } from 'react';

interface CategorySuggestionsProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onCategorySelect: (category: string) => void;
  existingCategories: string[];
  selectedCategories: string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showAddText?: boolean;
  maxCategories?: number;
  handleHashtag?: boolean;
}

const CategorySuggestions: React.FC<CategorySuggestionsProps> = ({
  inputValue,
  onInputChange,
  onCategorySelect,
  existingCategories,
  selectedCategories,
  placeholder = "Type to search categories...",
  disabled = false,
  className = "",
  showAddText = false,
  maxCategories,
  handleHashtag = false
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    onInputChange(value);
    
    if (handleHashtag) {
      const hashtagIndex = value.lastIndexOf('#');
      if (hashtagIndex !== -1) {
        const typedCategory = value.slice(hashtagIndex + 1).trim().toLowerCase();
        const availableCategories = existingCategories.filter(cat => 
          !selectedCategories.includes(cat)
        );
        
        if (typedCategory) {
          const filtered = availableCategories.filter(cat => 
            cat.toLowerCase().includes(typedCategory)
          );
          setFilteredCategories(filtered);
          setShowDropdown(filtered.length > 0);
        } else {
          setFilteredCategories(availableCategories);
          setShowDropdown(availableCategories.length > 0);
        }
      } else {
        setShowDropdown(false);
      }
    } else {
      if (value.trim()) {
        const availableCategories = existingCategories.filter(cat => 
          !selectedCategories.includes(cat.toLowerCase())
        );
        
        const filtered = availableCategories.filter(
          category => category.toLowerCase().includes(value.toLowerCase()) &&
          category.toLowerCase() !== value.toLowerCase()
        );
        setFilteredCategories(filtered);
        setShowDropdown(filtered.length > 0);
      } else {
        setFilteredCategories([]);
        setShowDropdown(false);
      }
    }
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (selectedIndex >= 0 && filteredCategories[selectedIndex]) {
        handleCategorySelect(filteredCategories[selectedIndex]);
      } else if (inputValue.trim()) {
        if (handleHashtag) {
          const hashtagIndex = inputValue.lastIndexOf('#');
          if (hashtagIndex !== -1) {
            const typedCategory = inputValue.slice(hashtagIndex + 1).trim();
            if (typedCategory) {
              handleCategorySelect(typedCategory);
            }
          }
        } else {
          handleCategorySelect(inputValue.trim());
        }
      }
    } else if (e.key === 'ArrowDown' && showDropdown) {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredCategories.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp' && showDropdown) {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    if (handleHashtag) {
      const hashtagIndex = inputValue.lastIndexOf('#');
      if (hashtagIndex !== -1) {
        const newValue = inputValue.substring(0, hashtagIndex).trim();
        onInputChange(newValue);
      }
    } else {
      onInputChange('');
    }
    onCategorySelect(category.toLowerCase());
    setFilteredCategories([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={`mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white p-2 text-sm ${className}`}
        placeholder={placeholder}
        disabled={disabled || (maxCategories !== undefined && selectedCategories.length >= maxCategories)}
      />
      {showDropdown && (
        <div className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredCategories.map((category, index) => (
            <button
              key={category}
              className={`w-full text-left px-4 py-2 text-sm ${
                index === selectedIndex ? 'bg-gray-600' : 'hover:bg-gray-600'
              } text-white cursor-pointer flex items-center justify-between group`}
              onClick={() => handleCategorySelect(category)}
            >
              <span>{category}</span>
              {showAddText && (
                <span className="text-gray-400 opacity-0 group-hover:opacity-100">
                  Add category
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySuggestions;