import React, { useState, useRef, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { normalizeLanguage } from '../../utils/languageUtils';
import { DynamicCodeEditorProps } from '../../types/types';

const DynamicCodeEditor: React.FC<DynamicCodeEditorProps> = ({ 
  code: initialCode, 
  language = 'plaintext', 
  onValueChange, 
  expandable = false 
}) => {
  const [code, setCode] = useState(initialCode);
  const [normalizedLang, setNormalizedLang] = useState('plaintext');
  const [editorHeight, setEditorHeight] = useState('400px');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlighterRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setCode(initialCode);
    adjustHeight();
  }, [initialCode]);

  useEffect(() => {
    const normalized = normalizeLanguage(language);
    setNormalizedLang(normalized);
  }, [language]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onValueChange(newCode);
    adjustHeight();
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = `${Math.max(scrollHeight, 400)}px`;
      setEditorHeight(newHeight);
    }
  };
  
  const processCodeForHighlighter = (code: string): string => {
    return code.split('\n').map(line => line || ' ').join('\n');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.currentTarget.selectionStart === e.currentTarget.selectionEnd) {
        insertText('\t');
      } else {
        indentSelection();
      }
    } else if (e.key === '[' && e.ctrlKey) {
      e.preventDefault();
      unindentSelection();
    } else if (e.key === ']' && e.ctrlKey) {
      e.preventDefault();
      indentSelection();
    }
  };

  const insertText = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const newCode = 
      code.substring(0, selectionStart) + 
      text +
      code.substring(selectionEnd);
    
    setCode(newCode);
    onValueChange(newCode);
    
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = selectionStart + text.length;
    }, 0);
  };

  const indentSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const selectedText = code.substring(selectionStart, selectionEnd);
    const lines = selectedText.split('\n');
    const indentedLines = lines.map(line => '\t' + line);
    const newSelectedText = indentedLines.join('\n');

    const newCode = 
      code.substring(0, selectionStart) + 
      newSelectedText +
      code.substring(selectionEnd);
    
    setCode(newCode);
    onValueChange(newCode);

    setTimeout(() => {
      textarea.selectionStart = selectionStart;
      textarea.selectionEnd = selectionStart + newSelectedText.length;
    }, 0);
  };

  const unindentSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const selectedText = code.substring(selectionStart, selectionEnd);
    const lines = selectedText.split('\n');
    const unindentedLines = lines.map(line => {
      if (line.startsWith('\t')) {
        return line.substring(1);
      } else if (line.startsWith('    ')) {
        return line.substring(4);
      } else if (line.startsWith('   ')) {
        return line.substring(3);
      } else if (line.startsWith('  ')) {
        return line.substring(2);
      } else if (line.startsWith(' ')) {
        return line.substring(1);
      }
      return line;
    });
    const newSelectedText = unindentedLines.join('\n');

    const newCode = 
      code.substring(0, selectionStart) + 
      newSelectedText +
      code.substring(selectionEnd);
    
    setCode(newCode);
    onValueChange(newCode);

    setTimeout(() => {
      textarea.selectionStart = selectionStart;
      textarea.selectionEnd = selectionStart + newSelectedText.length;
    }, 0);
  };

  const fontSize = '14px';
  const lineHeight = '20px';
  const padding = '1rem';

  const commonStyles: React.CSSProperties = {
    boxSizing: 'border-box',
    margin: 0,
    border: 0,
    padding: padding,
    fontFamily: '"Fira Code", "Fira Mono", Consolas, Menlo, Monaco, "Courier New", monospace',
    fontSize: fontSize,
    lineHeight: lineHeight,
    tabSize: 4,
    whiteSpace: 'pre-wrap',
    wordBreak: 'keep-all',
    overflowWrap: 'break-word',
    width: '100%',
    height: editorHeight,
    minHeight: '400px',
  };

  return (
    <div className="relative rounded-md" style={{ backgroundColor: '#1e1e1e', height: editorHeight, minHeight: '400px' }}>
      <textarea
        ref={textareaRef}
        value={code}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        style={{
          ...commonStyles,
          position: 'absolute',
          top: 0,
          left: 0,
          color: 'transparent',
          caretColor: 'white',
          backgroundColor: 'transparent',
          zIndex: 1,
          resize: 'none',
          overflow: 'hidden',
        }}
        spellCheck="false"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
      />
      <div 
        ref={highlighterRef}
        style={{
          ...commonStyles,
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          backgroundColor: 'transparent',
          overflow: 'hidden',
        }}
      >
        <SyntaxHighlighter
          language={normalizedLang}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: 0,
            background: 'none',
            fontSize: 'inherit',
            lineHeight: 'inherit',
            fontFamily: 'inherit',
            height: '100%',
            width: '100%',
          }}
          codeTagProps={{
            style: {
              fontSize: 'inherit',
              lineHeight: 'inherit',
              fontFamily: 'inherit',
            },
          }}
          useInlineStyles={true}
          wrapLines={true}
          wrapLongLines={true}
        >
          {processCodeForHighlighter(code)}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default DynamicCodeEditor;