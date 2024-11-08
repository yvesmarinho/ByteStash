// Common types only

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

export interface FragmentEditorProps {
  fragment: CodeFragment;
  onUpdate: (updatedFragment: CodeFragment) => void;
  onDelete: () => void;
  showLineNumbers: boolean;
  dragHandleProps?: any;
}

export interface ShareSettings {
  requiresAuth: boolean;
  expiresIn?: number;
}

export interface Share {
  id: string;
  snippetId: string;
  requiresAuth: boolean;
  viewCount: number;
  expiresAt: string;
  createdAt: string;
  expired: boolean;
}