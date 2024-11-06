import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { getLanguageLabel, getMonacoLanguage } from '../../utils/languageUtils';
import CopyButton from '../common/CopyButton';
import ReactMarkdown from 'react-markdown';
import { FullCodeBlockProps } from '@/types/types';

const FullCodeBlock: React.FC<FullCodeBlockProps> = ({ 
  code, 
  language = 'plaintext',
  showLineNumbers = true
}) => {
  const [normalizedLang, setNormalizedLang] = useState<string>('plaintext');
  const [key, setKey] = useState<number>(0);
  const [editorHeight, setEditorHeight] = useState<string>("100px");
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const editorRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isMarkdown = getLanguageLabel(language) === 'markdown';

  useEffect(() => {
    const normalized = getMonacoLanguage(language);
    setNormalizedLang(normalized);
    setKey(prev => prev + 1);
  }, [language]);

  const updateEditorHeight = () => {
    if (!editorRef.current) return;
    
    const editor = editorRef.current;
    const contentHeight = editor.getContentHeight();
    const newHeight = Math.min(500, Math.max(100, contentHeight));
    
    setEditorHeight(`${newHeight}px`);
    editor.layout();
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    editor.onDidContentSizeChange(() => {
      window.requestAnimationFrame(updateEditorHeight);
    });
    
    updateEditorHeight();
    
    editor.onDidFocusEditorWidget(() => {
      setIsEditorFocused(true);
      if (wrapperRef.current) {
        wrapperRef.current.style.overflow = 'auto';
      }
    });
    
    editor.onDidBlurEditorWidget(() => {
      setIsEditorFocused(false);
      if (wrapperRef.current) {
        wrapperRef.current.style.overflow = 'hidden';
      }
    });
  };

  return (
    <div className="relative">
      <style>
        {`
          .editor-mask-wrapper {
            position: relative;
            border-radius: 0.5rem;
            mask-image: radial-gradient(white, white);
            -webkit-mask-image: -webkit-radial-gradient(white, white);
            transform: translateZ(0);
            overflow: hidden;
          }

          .editor-mask-wrapper:hover {
            overflow: auto !important;
          }

          .editor-mask-wrapper:not(:hover):not(.focused) .monaco-editor .scroll-decoration {
            box-shadow: none !important;
          }

          .editor-mask-wrapper:not(:hover):not(.focused) .monaco-editor .scrollbar {
            opacity: 0 !important;
          }

          .markdown-content-full {
            color: white;
            background-color: #1E1E1E;
            padding: 1rem;
            border-radius: 0.5rem;
            position: relative;
          }
        `}
      </style>
      <div className="relative">
        {isMarkdown ? (
          <div className="markdown-content-full">
            <ReactMarkdown className="text-sm text-gray-300 markdown">
              {code}
            </ReactMarkdown>
          </div>
        ) : (
          <div 
            ref={wrapperRef}
            className={`editor-mask-wrapper ${isEditorFocused ? 'focused' : ''}`}
          >
            <Editor
              key={`${normalizedLang}-${key}`}
              height={editorHeight}
              defaultLanguage={normalizedLang}
              className="rounded-lg"
              defaultValue={code}
              theme="vs-dark"
              onMount={handleEditorDidMount}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 13,
                lineNumbers: showLineNumbers ? 'on' : 'off',
                renderLineHighlight: 'all',
                folding: false,
                wordWrap: 'on',
                wrappingIndent: 'indent',
                lineDecorationsWidth: showLineNumbers ? 24 : 50,
                padding: { top: 12, bottom: 12 }
              }}
            />
          </div>
        )}

        <div className="absolute" style={{ zIndex: 3, right: 0, top: 0 }}>
          <CopyButton text={code} />
        </div>
      </div>
    </div>
  );
};

export default FullCodeBlock;