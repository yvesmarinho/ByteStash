export interface CodeFragment {
  id?: string;
  file_name: string;
  code: string;
  language: string;
  position: number;
}

export interface Snippet {
  id: string;
  title: string;
  description: string;
  updated_at: string;
  categories: string[];
  fragments: CodeFragment[];
}

export interface SnippetCardProps {
  snippet: Snippet;
  viewMode: 'grid' | 'list';
  onOpen: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
  onEdit: (snippet: Snippet) => void;
  onCategoryClick: (category: string) => void;
  compactView: boolean;
  showCodePreview: boolean;
  previewLines: number;
  showCategories: boolean;
  expandCategories: boolean;
  showLineNumbers: boolean;
}

export interface SnippetModalProps {
  snippet: Snippet | null;
  isOpen: boolean;
  onClose: () => void;
  onCategoryClick: (category: string) => void;
  showLineNumbers: boolean;
}

export interface EditSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (snippetData: Omit<Snippet, 'id' | 'updated_at'>) => void;
  snippetToEdit: Snippet | null;
  showLineNumbers: boolean;
}

export interface CustomDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}

export interface CategoryListProps {
  categories: string[];
  onRemoveCategory: (category: string) => void;
  className?: string;
}

export interface CategorySuggestionsProps {
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
  handleHashtag: boolean;
}

export interface EnhancedSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onCategorySelect: (category: string) => void;
  existingCategories: string[];
  selectedCategories: string[];
}

export interface CustomDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  standardOptions?: string[];
}

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    compactView: boolean;
    showCodePreview: boolean;
    previewLines: number;
    includeCodeInSearch: boolean;
    showCategories: boolean;
    expandCategories: boolean;
    showLineNumbers: boolean;
  };
  onSettingsChange: (newSettings: SettingsModalProps['settings']) => void;
}

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

export interface SnippetListProps {
  snippets: Snippet[];
  viewMode: 'grid' | 'list';
  onOpen: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
  onEdit: (snippet: Snippet) => void;
  onCategoryClick: (category: string) => void;
  compactView: boolean;
  showCodePreview: boolean;
  previewLines: number;
  showCategories: boolean;
  expandCategories: boolean;
  showLineNumbers: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
}

export interface CopyButtonProps {
  text: string;
}

export interface FullCodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export interface PreviewCodeBlockProps {
  code: string;
  language?: string;
  previewLines?: number;
  showLineNumbers?: boolean;
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
  onValueChange: (value?: string) => void;
  showLineNumbers: boolean;
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

export interface FragmentEditorProps {
  fragment: CodeFragment;
  onUpdate: (updatedFragment: CodeFragment) => void;
  onDelete: () => void;
  showLineNumbers: boolean;
  dragHandleProps?: any;
}

export interface FragmentListProps {
  fragments: CodeFragment[];
  language: string;
  onUpdateFragment: (index: number, fragment: CodeFragment) => void;
  onDeleteFragment: (index: number) => void;
  onAddFragment: () => void;
  onReorderFragments: (fragments: CodeFragment[]) => void;
  showLineNumbers: boolean;
}