import React, { useState, useMemo, useCallback } from 'react';
import SearchAndFilter from './SearchAndFilter';
import SnippetList from './SnippetList';
import SnippetModal from './SnippetModal';
import EditSnippetModal from './EditSnippetModal';
import SettingsModal from '../settings/SettingsModal';
import { useSnippets } from '../../hooks/useSnippets';
import { useSettings } from '../../hooks/useSettings';
import { getLanguageLabel } from '../../utils/languageUtils';
import { Snippet } from '../../types/types';

const SnippetStorage: React.FC = () => {
  const { snippets, isLoading, addSnippet, updateSnippet, removeSnippet } = useSnippets();
  const { 
    viewMode, setViewMode, compactView, showCodePreview, 
    previewLines, includeCodeInSearch, updateSettings 
  } = useSettings();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [isEditSnippetModalOpen, setIsEditSnippetModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [snippetToEdit, setSnippetToEdit] = useState<Snippet | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const languages = useMemo(() => 
    [...new Set(snippets.map(snippet => getLanguageLabel(snippet.language)))], 
    [snippets]
  );

  const filteredSnippets = useMemo(() => {
    return snippets.filter(snippet => 
      (snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       snippet.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (includeCodeInSearch && snippet.code.toLowerCase().includes(searchTerm.toLowerCase()))) && 
      (selectedLanguage === '' || getLanguageLabel(snippet.language).toLowerCase() === selectedLanguage.toLowerCase())
    ).sort((a, b) => {
      const dateA = new Date(a.updated_at);
      const dateB = new Date(b.updated_at);
      return sortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });
  }, [snippets, searchTerm, selectedLanguage, includeCodeInSearch, sortOrder]);

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

  if (isLoading) {
    return <div className="text-center py-12">Loading snippets...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">ByteStash</h1>
      
      <SearchAndFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        languages={languages}
        sortOrder={sortOrder}
        toggleSortOrder={toggleSortOrder}
        viewMode={viewMode}
        setViewMode={setViewMode}
        openSettingsModal={() => setIsSettingsModalOpen(true)}
        openNewSnippetModal={() => openEditSnippetModal(null)}
      />
      
      <SnippetList 
        snippets={filteredSnippets}
        viewMode={viewMode}
        onOpen={openSnippet}
        onDelete={handleDeleteSnippet}
        onEdit={openEditSnippetModal}
        compactView={compactView}
        showCodePreview={showCodePreview}
        previewLines={previewLines}
      />

      {selectedSnippet && (
        <SnippetModal 
          snippet={selectedSnippet} 
          isOpen={!!selectedSnippet} 
          onClose={closeSnippet}
        />
      )}

      <EditSnippetModal
        isOpen={isEditSnippetModalOpen}
        onClose={closeEditSnippetModal}
        onSubmit={handleSnippetSubmit}
        snippetToEdit={snippetToEdit}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={{ compactView, showCodePreview, previewLines, includeCodeInSearch }}
        onSettingsChange={updateSettings}
      />
    </div>
  );
};

export default SnippetStorage;