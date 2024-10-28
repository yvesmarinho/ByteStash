import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import CategorySuggestions from './categories/CategorySuggestions';

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

  const handleInputChange = (value: string) => {
    setInputValue(value);
    onSearchChange(value);
  };

  return (
    <div className="relative flex-grow">
      <CategorySuggestions
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onCategorySelect={onCategorySelect}
        existingCategories={existingCategories}
        selectedCategories={selectedCategories}
        placeholder="Search snippets... (Type # to see all available categories)"
        className="w-full bg-gray-800 rounded-lg py-2 px-4 pr-10 focus:outline-none"
        handleHashtag={true}
      />
      <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
    </div>
  );
};

export default EnhancedSearch;