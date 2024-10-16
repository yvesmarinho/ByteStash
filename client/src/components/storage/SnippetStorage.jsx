import React, { useState, useEffect, useCallback } from 'react';
import { Search, Grid, List, Plus, ChevronDown } from 'lucide-react';
import SnippetCard from './SnippetCard';
import SnippetModal from './SnippetModal';
import EditSnippetModal  from './EditSnippetModal';
import { createSnippet, deleteSnippet, editSnippet, fetchSnippets } from '../../api/snippets';
import { useToast } from '../toast/Toast';

const SnippetStorage = () => {
  const [snippets, setSnippets] = useState([]);
  const [filteredSnippets, setFilteredSnippets] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [isEditSnippetModalOpen, setIsEditSnippetModalOpen] = useState(false);
  const [snippetToEdit, setSnippetToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  const loadSnippets = useCallback(async () => {
    if (!isLoading) return;
    
    try {
      const fetchedSnippets = await fetchSnippets();
      setSnippets(fetchedSnippets);
      setFilteredSnippets(fetchedSnippets);
      addToast('Snippets loaded successfully', 'success');
    } catch (error) {
      console.error('Failed to fetch snippets:', error);
      addToast('Failed to load snippets. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addToast]);

  useEffect(() => {
    loadSnippets();
  }, [loadSnippets]);

  useEffect(() => {
    const filtered = snippets.filter(snippet => 
      (snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       snippet.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedLanguage === '' || snippet.language === selectedLanguage)
    );
    setFilteredSnippets(filtered);
  }, [searchTerm, selectedLanguage, snippets]);

  const languages = [...new Set(snippets.map(snippet => snippet.language))];

  const openSnippet = (snippet) => {
    setSelectedSnippet(snippet);
  };

  const closeSnippet = () => {
    setSelectedSnippet(null);
  };

  const openEditSnippetModal = (snippet = null) => {
    setSnippetToEdit(snippet);
    setIsEditSnippetModalOpen(true);
  };

  const closeEditSnippetModal = () => {
    setSnippetToEdit(null);
    setIsEditSnippetModalOpen(false);
  };

  const handleSnippetSubmit = async (snippetData) => {
    try {
      let updatedSnippetData;
      if (snippetToEdit) {
        // Editing an existing snippet
        updatedSnippetData = await editSnippet(snippetToEdit.id, snippetData);
        setSnippets(prevSnippets =>
          prevSnippets.map(s => s.id === updatedSnippetData.id ? updatedSnippetData : s)
        );
        addToast('Snippet updated successfully', 'success');
      } else {
        // Creating a new snippet
        updatedSnippetData = await createSnippet(snippetData);
        setSnippets(prevSnippets => [...prevSnippets, updatedSnippetData]);
        addToast('New snippet created successfully', 'success');
      }
      closeEditSnippetModal();
    } catch (error) {
      console.error('Error saving snippet:', error);
      addToast(snippetToEdit ? 'Failed to update snippet' : 'Failed to create snippet', 'error');
    }
  };

  const handleDeleteSnippet = async (id) => {
    try {
      await deleteSnippet(id);
      setSnippets(prevSnippets => prevSnippets.filter(snippet => snippet.id !== id));
      if (selectedSnippet && selectedSnippet.id === id) {
        closeSnippet();
      }
      addToast('Snippet deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete snippet:', error);
      addToast('Failed to delete snippet. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">ByteStash</h1>
      
      <div className="flex flex-wrap items-center mb-6 gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search snippets..."
            className="w-full bg-gray-800 rounded-lg py-2 px-4 pr-10 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
        </div>
        
        <div className="relative">
          <select
            className="appearance-none bg-gray-800 rounded-lg py-2 pl-4 pr-10 focus:outline-none"
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
        
        <button
          className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-700' : 'bg-gray-800'}`}
          onClick={() => setViewMode('grid')}
        >
          <Grid size={20} />
        </button>
        <button
          className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-700' : 'bg-gray-800'}`}
          onClick={() => setViewMode('list')}
        >
          <List size={20} />
        </button>
        <button
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-200 flex items-center"
          onClick={() => openEditSnippetModal(null)}
        >
          <Plus size={20} className="mr-2" />
          <span>New Snippet</span>
        </button>
      </div>
      
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'space-y-6'
      }>
        {filteredSnippets.map(snippet => (
          <SnippetCard 
            key={snippet.id} 
            snippet={snippet} 
            viewMode={viewMode}
            onOpen={openSnippet}
            onDelete={handleDeleteSnippet}
            onEdit={openEditSnippetModal}
          />
        ))}
      </div>

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
    </div>
  );
};

export default SnippetStorage;