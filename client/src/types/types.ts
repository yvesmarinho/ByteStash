export interface Snippet {
    id: string;
    title: string;
    language: string;
    description: string;
    code: string;
    updated_at: string;
  }
  
  export interface SnippetCardProps {
    snippet: Snippet;
    viewMode: 'grid' | 'list';
    onOpen: (snippet: Snippet) => void;
    onDelete: (id: string) => void;
    onEdit: (snippet: Snippet) => void;
    compactView: boolean;
    showCodePreview: boolean;
    previewLines: number;
  }
  
  export interface SnippetModalProps {
    snippet: Snippet | null;
    isOpen: boolean;
    onClose: () => void;
  }
  
  export interface EditSnippetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (snippetData: Omit<Snippet, 'id' | 'updated_at'>) => void;
    snippetToEdit: Snippet | null;
  }
  
  export interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: {
      compactView: boolean;
      showCodePreview: boolean;
      previewLines: number;
      includeCodeInSearch: boolean;
    };
    onSettingsChange: (newSettings: SettingsModalProps['settings']) => void;
  }
  
  export interface SearchAndFilterProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedLanguage: string;
    setSelectedLanguage: (language: string) => void;
    languages: string[];
    sortOrder: 'asc' | 'desc';
    toggleSortOrder: () => void;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
    openSettingsModal: () => void;
    openNewSnippetModal: () => void;
  }
  
  export interface SnippetListProps {
    snippets: Snippet[];
    viewMode: 'grid' | 'list';
    onOpen: (snippet: Snippet) => void;
    onDelete: (id: string) => void;
    onEdit: (snippet: Snippet) => void;
    compactView: boolean;
    showCodePreview: boolean;
    previewLines: number;
  }
  
  export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }
  
  export interface CopyButtonProps {
    text: string;
  }
  
  export interface CodeBlockProps {
    code: string;
    language?: string;
    isPreview?: boolean;
    previewLines?: number;
  }
  
  export interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    snippetTitle: string;
  }
  
  export interface DynamicCodeEditorProps {
    code: string;
    language?: string;
    onValueChange: (value: string) => void;
  }
  
  export interface ToastProviderProps {
    children: React.ReactNode;
  }
  
  export interface ToastContextType {
    addToast: (message: string, type?: 'info' | 'success' | 'error' | 'warning', duration?: number) => void;
    removeToast: (id: number) => void;
  }
  
  export interface ToastProps {
    id: number;
    message: string;
    type: 'info' | 'success' | 'error' | 'warning';
    duration: number;
    onClose: () => void;
  }