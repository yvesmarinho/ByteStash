import React from 'react';
import { ChevronDown, Grid, List, Settings, Plus } from 'lucide-react';
import EnhancedSearch from './EnhancedSearch';

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'alpha-asc', label: 'Alphabetically A-Z' },
  { value: 'alpha-desc', label: 'Alphabetically Z-A' },
];

export type SortOrder = 'newest' | 'oldest' | 'alpha-asc' | 'alpha-desc';

export interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  languages: string[];
  sortOrder: 'newest' | 'oldest' | 'alpha-asc' | 'alpha-desc';
  setSortOrder: (order: 'newest' | 'oldest' | 'alpha-asc' | 'alpha-desc') => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  openSettingsModal: () => void;
  openNewSnippetModal: () => void;
  allCategories: string[];
  selectedCategories: string[];
  onCategoryClick: (category: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedLanguage, 
  setSelectedLanguage, 
  languages, 
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
  openSettingsModal,
  openNewSnippetModal,
  allCategories,
  selectedCategories,
  onCategoryClick
}) => {
  const handleCategorySelect = (category: string) => {
    onCategoryClick(category);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <EnhancedSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCategorySelect={handleCategorySelect}
        existingCategories={allCategories}
        selectedCategories={selectedCategories}
      />
      
      <div className="relative">
        <select
          className="appearance-none bg-gray-800 rounded-lg py-2 px-4 pr-10 focus:outline-none"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="">All Languages</option>
          {languages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <ChevronDown size={20} />
        </div>
      </div>

      <div className="relative">
        <select
          className="appearance-none bg-gray-800 rounded-lg py-2 px-4 pr-10 focus:outline-none"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrder)}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <ChevronDown size={20} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className={`h-10 px-4 rounded-lg ${viewMode === 'grid' ? 'bg-gray-700' : 'bg-gray-800'} hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center`}
          onClick={() => setViewMode('grid')}
        >
          <Grid size={20} />
        </button>
        <button
          className={`h-10 px-4 rounded-lg ${viewMode === 'list' ? 'bg-gray-700' : 'bg-gray-800'} hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center`}
          onClick={() => setViewMode('list')}
        >
          <List size={20} />
        </button>
        <button
          className="h-10 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center"
          onClick={openSettingsModal}
        >
          <Settings size={20} />
        </button>
        <button
          className="h-10 pr-4 pl-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
          onClick={openNewSnippetModal}
        >
          <Plus size={20} className="mr-2" />
          <span>New Snippet</span>
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilter;