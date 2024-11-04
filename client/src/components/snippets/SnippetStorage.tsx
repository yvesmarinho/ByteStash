import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import SearchAndFilter from './SearchAndFilter';
import SnippetList from './SnippetList';
import SnippetModal from './SnippetModal';
import EditSnippetModal from './EditSnippetModal';
import SettingsModal from '../settings/SettingsModal';
import { useSnippets } from '../../hooks/useSnippets';
import { useSettings } from '../../hooks/useSettings';
import { useAuth } from '../../context/AuthContext';
import { getLanguageLabel } from '../../utils/languageUtils';
import { Snippet } from '../../types/types';
import { initializeMonaco } from '../../utils/languageUtils';

const SnippetStorage: React.FC = () => {
  const { snippets, isLoading, addSnippet, updateSnippet, removeSnippet } = useSnippets();
  const { logout, isAuthRequired } = useAuth();
  const { 
    viewMode, setViewMode, compactView, showCodePreview, 
    previewLines, includeCodeInSearch, updateSettings,
    showCategories, expandCategories, showLineNumbers
  } = useSettings();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [isEditSnippetModalOpen, setIsEditSnippetModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [snippetToEdit, setSnippetToEdit] = useState<Snippet | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    initializeMonaco();
  }, []);

  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleCategoryClick = useCallback((category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      }
      return [...prev, category];
    });
  }, []);

  const handleLogout = () => {
    logout();
  };

  const languages = useMemo(() => 
    [...new Set(snippets.map(snippet => getLanguageLabel(snippet.language)))], 
    [snippets]
  );

  const allCategories = useMemo(() => 
    [...new Set(snippets.flatMap(snippet => snippet.categories))].sort(),
    [snippets]
  );

  const filteredSnippets = useMemo(() => {
    return snippets.filter(snippet => 
      (snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       snippet.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (includeCodeInSearch && snippet.code.toLowerCase().includes(searchTerm.toLowerCase()))) && 
      (selectedLanguage === '' || getLanguageLabel(snippet.language).toLowerCase() === selectedLanguage.toLowerCase()) &&
      (selectedCategories.length === 0 || 
       selectedCategories.every(cat => snippet.categories.includes(cat)))
    ).sort((a, b) => {
      const dateA = new Date(a.updated_at);
      const dateB = new Date(b.updated_at);
      return sortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });
  }, [snippets, searchTerm, selectedLanguage, includeCodeInSearch, sortOrder, selectedCategories]);

  const toggleSortOrder = useCallback(() => setSortOrder(prevOrder => prevOrder === 'desc' ? 'asc' : 'desc'), []);

  const openSnippet = useCallback((snippet: Snippet) => setSelectedSnippet(snippet), []);
  const closeSnippet = useCallback(() => setSelectedSnippet(null), []);

  const openEditSnippetModal = useCallback((snippet: Snippet | null = null) => {
    setSnippetToEdit(snippet);
    setIsEditSnippetModalOpen(true);
  }, []);

  const closeEditSnippetModal = useCallback(() => {
    setSnippetToEdit(null);
    setIsEditSnippetModalOpen(false);
  }, []);

  const handleSnippetSubmit = useCallback(async (snippetData: Omit<Snippet, 'id' | 'updated_at'>) => {
    try {
      if (snippetToEdit) {
        await updateSnippet(snippetToEdit.id, snippetData);
      } else {
        await addSnippet(snippetData);
      }
      closeEditSnippetModal();
    } catch (error) {
      console.error('Error saving snippet:', error);
    }
  }, [snippetToEdit, updateSnippet, addSnippet, closeEditSnippetModal]);

  const handleDeleteSnippet = useCallback(async (id: string) => {
    try {
      await removeSnippet(id);
      if (selectedSnippet && selectedSnippet.id === id) {
        closeSnippet();
      }
    } catch (error) {
      console.error('Failed to delete snippet:', error);
    }
  }, [removeSnippet, selectedSnippet, closeSnippet]);

  if (isLoading) {
    return <div className="text-center py-12">Loading snippets...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ByteStash</h1>
        {isAuthRequired && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        )}
      </div>
      
      <SearchAndFilter 
        searchTerm={searchTerm}
        setSearchTerm={handleSearchTermChange}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        languages={languages}
        sortOrder={sortOrder}
        toggleSortOrder={toggleSortOrder}
        viewMode={viewMode}
        setViewMode={setViewMode}
        openSettingsModal={() => setIsSettingsModalOpen(true)}
        openNewSnippetModal={() => openEditSnippetModal(null)}
        allCategories={allCategories}
        selectedCategories={selectedCategories}
        onCategoryClick={handleCategoryClick}
      />
      
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <span className="text-sm text-gray-400">Filtered by categories:</span>
          {selectedCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(category)}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 text-sm"
            >
              <span>{category}</span>
              <span className="text-gray-400 hover:text-white">×</span>
            </button>
          ))}
        </div>
      )}
      
      <SnippetList 
        snippets={filteredSnippets}
        viewMode={viewMode}
        onOpen={openSnippet}
        onDelete={handleDeleteSnippet}
        onEdit={openEditSnippetModal}
        onCategoryClick={handleCategoryClick}
        compactView={compactView}
        showCodePreview={showCodePreview}
        previewLines={previewLines}
        showCategories={showCategories}
        expandCategories={expandCategories}
        showLineNumbers={showLineNumbers}
      />

      {selectedSnippet && (
        <SnippetModal 
          snippet={selectedSnippet} 
          isOpen={!!selectedSnippet} 
          onClose={closeSnippet}
          onCategoryClick={handleCategoryClick}
          showLineNumbers={showLineNumbers}
        />
      )}

      <EditSnippetModal
        isOpen={isEditSnippetModalOpen}
        onClose={closeEditSnippetModal}
        onSubmit={handleSnippetSubmit}
        snippetToEdit={snippetToEdit}
        showLineNumbers={showLineNumbers}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={{ compactView, showCodePreview, previewLines, includeCodeInSearch, showCategories, expandCategories, showLineNumbers }}
        onSettingsChange={updateSettings}
      />
    </div>
  );
};

export default SnippetStorage;