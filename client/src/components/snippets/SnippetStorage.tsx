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
import ShareMenu from './share/ShareMenu';

const APP_VERSION = "1.4.0";

const SnippetStorage: React.FC = () => {
  const { snippets, isLoading, addSnippet, updateSnippet, removeSnippet, reloadSnippets } = useSnippets();
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
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alpha-asc' | 'alpha-desc'>('newest');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [snippetToShare, setSnippetToShare] = useState<Snippet | null>(null);

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

  const openShareMenu = useCallback((snippet: Snippet) => {
    setSnippetToShare(snippet);
    setIsShareMenuOpen(true);
  }, []);
  
  const closeShareMenu = useCallback(() => {
    setSnippetToShare(null);
    setIsShareMenuOpen(false);
  }, []);

  const languages = useMemo(() => {
    const langSet = new Set<string>();
    snippets.forEach(snippet => {
      snippet.fragments.forEach(fragment => {
        langSet.add(getLanguageLabel(fragment.language));
      });
    });
    return Array.from(langSet).sort();
  }, [snippets]);

  const allCategories = useMemo(() => 
    [...new Set(snippets.flatMap(snippet => snippet.categories))].sort(),
    [snippets]
  );

  const filteredSnippets = useMemo(() => {
    return snippets.filter(snippet => {
      const basicMatch = (
        snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      const fragmentMatch = snippet.fragments.some(fragment => 
        fragment.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getLanguageLabel(fragment.language).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (includeCodeInSearch && fragment.code.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  
      const languageMatch = selectedLanguage === '' || 
        snippet.fragments.some(fragment => 
          getLanguageLabel(fragment.language).toLowerCase() === selectedLanguage.toLowerCase()
        );
  
      const categoryMatch = selectedCategories.length === 0 || 
        selectedCategories.every(cat => snippet.categories.includes(cat));
  
      return (basicMatch || fragmentMatch) && languageMatch && categoryMatch;
    }).sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'oldest':
          return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        case 'alpha-asc':
          return a.title.localeCompare(b.title);
        case 'alpha-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [snippets, searchTerm, selectedLanguage, includeCodeInSearch, sortOrder, selectedCategories]);

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
        const updatedSnippet = await updateSnippet(snippetToEdit.id, snippetData);
        await reloadSnippets();
        if (selectedSnippet?.id === snippetToEdit.id) {
          setSelectedSnippet(updatedSnippet);
        }
      } else {
        await addSnippet(snippetData);
        await reloadSnippets();
      }
      closeEditSnippetModal();
    } catch (error) {
      console.error('Error saving snippet:', error);
      throw error;
    }
  }, [snippetToEdit, updateSnippet, addSnippet, closeEditSnippetModal, selectedSnippet, reloadSnippets]);

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
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-end gap-2">
          <h1 className="text-4xl font-bold text-gray-100">ByteStash</h1>
          <span className="text-sm text-gray-400 mb-0">v{APP_VERSION}</span>
        </div>
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
        setSortOrder={setSortOrder}
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
        onShare={openShareMenu}
        compactView={compactView}
        showCodePreview={showCodePreview}
        previewLines={previewLines}
        showCategories={showCategories}
        expandCategories={expandCategories}
        showLineNumbers={showLineNumbers}
      />

      <SnippetModal 
        snippet={selectedSnippet} 
        isOpen={!!selectedSnippet} 
        onClose={closeSnippet}
        onCategoryClick={handleCategoryClick}
        showLineNumbers={showLineNumbers}
      />

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
        settings={{ 
          compactView, 
          showCodePreview, 
          previewLines, 
          includeCodeInSearch, 
          showCategories, 
          expandCategories, 
          showLineNumbers 
        }}
        onSettingsChange={updateSettings}
      />

      {snippetToShare && (
        <ShareMenu
          snippetId={snippetToShare.id}
          isOpen={isShareMenuOpen}
          onClose={closeShareMenu}
        />
      )}
    </div>
  );
};

export default SnippetStorage;