import React, { useState, useRef } from 'react';
import { Trash2, ChevronUp, ChevronDown, ChevronRight, ChevronDown as CollapseIcon } from 'lucide-react';
import { FragmentEditorProps } from '../../types/types';
import DynamicCodeEditor from './CodeEditor';
import { getSupportedLanguages } from '../../utils/languageUtils';
import BaseDropdown from '../common/BaseDropdown';

interface ExtendedFragmentEditorProps extends FragmentEditorProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const FragmentEditor: React.FC<ExtendedFragmentEditorProps> = ({
  fragment,
  onUpdate,
  onDelete,
  showLineNumbers,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...fragment,
      file_name: e.target.value
    });
  };

  const handleCodeChange = (newCode: string | undefined) => {
    onUpdate({
      ...fragment,
      code: newCode || ''
    });
  };

  const handleLanguageChange = (newLanguage: string) => {
    onUpdate({
      ...fragment,
      language: newLanguage
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
      <div className="flex items-center gap-2 p-3 bg-gray-850">
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-1.5 hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Move up"
          >
            <ChevronUp size={16} className="text-gray-400" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-1.5 hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Move down"
          >
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 flex items-center gap-3">
          <div className="w-1/3">
            <input
              type="text"
              value={fragment.file_name}
              onChange={handleFileNameChange}
              className="w-full bg-gray-700 text-white px-3 py-1.5 rounded text-sm border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="File name"
              required
            />
          </div>

          <div className="w-2/3">
            <BaseDropdown
              value={fragment.language}
              onChange={handleLanguageChange}
              onSelect={handleLanguageChange}
              getSections={(searchTerm) => [{
                title: 'Languages',
                items: getSupportedLanguages()
                  .filter(lang => 
                    lang.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lang.label.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(lang => lang.language)
              }]}
              maxLength={50}
              placeholder="Select language"
            />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-gray-700 rounded transition-colors group"
            title={isCollapsed ? "Show code" : "Hide code"}
          >
            {isCollapsed ? (
              <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-300" />
            ) : (
              <CollapseIcon size={16} className="text-gray-400 group-hover:text-gray-300" />
            )}
          </button>
          
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-gray-700 rounded transition-colors group"
            title="Delete fragment"
            type="button"
          >
            <Trash2 size={16} className="text-gray-400 group-hover:text-red-400" />
          </button>
        </div>
      </div>

      <div 
        ref={contentRef}
        style={{
          maxHeight: isCollapsed ? '0px' : '9999px',
          opacity: isCollapsed ? 0 : 1,
          overflow: 'hidden',
          transition: 'all 0.2s ease-in-out'
        }}
      >
        <div className="p-3">
          <DynamicCodeEditor
            code={fragment.code}
            language={fragment.language}
            onValueChange={handleCodeChange}
            showLineNumbers={showLineNumbers}
          />
        </div>
      </div>
    </div>
  );
};

export default FragmentEditor;