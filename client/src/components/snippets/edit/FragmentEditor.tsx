import React, { useState } from 'react';
import { Trash2, ChevronUp, ChevronDown, ChevronRight, ChevronDown as CollapseIcon } from 'lucide-react';
import { IconButton } from '../../common/buttons/IconButton';
import { CodeFragment } from '../../../types/snippets';
import BaseDropdown from '../../common/dropdowns/BaseDropdown';
import { getSupportedLanguages } from '../../../utils/language/languageUtils';
import { CodeEditor } from '../../editor/CodeEditor';

interface FragmentEditorProps {
  fragment: CodeFragment;
  onUpdate: (fragment: CodeFragment) => void;
  onDelete: () => void;
  showLineNumbers: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export const FragmentEditor: React.FC<FragmentEditorProps> = ({
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
            <IconButton
              icon={<ChevronUp size={16} />}
              onClick={onMoveUp}
              disabled={!canMoveUp}
              variant="secondary"
              size="sm"
              className="disabled:opacity-50 w-9 h-9 hover:bg-gray-700 bg-transparent"
            />
            <IconButton
              icon={<ChevronDown size={16} />}
              onClick={onMoveDown}
              disabled={!canMoveDown}
              variant="secondary"
              size="sm"
              className="disabled:opacity-50 w-9 h-9 hover:bg-gray-700 bg-transparent"
            />
          </div>
  
          <div className="flex-1 flex items-center gap-3">
            <div className="w-1/3">
              <input
                type="text"
                value={fragment.file_name}
                onChange={handleFileNameChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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
            <IconButton
              icon={isCollapsed ? <ChevronRight size={16} /> : <CollapseIcon size={16} />}
              onClick={() => setIsCollapsed(!isCollapsed)}
              variant="secondary"
              size="sm"
              className="w-9 h-9 hover:bg-gray-700 bg-transparent"
            />
            <IconButton
              icon={<Trash2 size={16} />}
              onClick={onDelete}
              variant="secondary"
              size="sm"
              className="group-hover:text-red-400 w-9 h-9 hover:bg-gray-700 bg-transparent"
            />
          </div>
        </div>
  
        <div 
          style={{
            maxHeight: isCollapsed ? '0px' : '9999px',
            opacity: isCollapsed ? 0 : 1,
            overflow: 'hidden',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <div className="p-3">
            <CodeEditor
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
  