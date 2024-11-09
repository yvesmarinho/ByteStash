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
  snippet_id: number;
  requires_auth: number;
  view_limit: number | null;
  view_count: number;
  expires_at: string;
  created_at: string;
  expired: number;
}