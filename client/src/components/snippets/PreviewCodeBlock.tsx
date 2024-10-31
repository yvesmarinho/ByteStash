import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { getLanguageLabel, normalizeLanguage } from '../../utils/languageUtils';
import CopyButton from '../common/CopyButton';
import ReactMarkdown, { Components } from 'react-markdown';
import { PreviewCodeBlockProps } from '@/types/types';

const PreviewCodeBlock: React.FC<PreviewCodeBlockProps> = ({
  code,
  language = 'plaintext',
  previewLines = 4,
  showLineNumbers
}) => {
  const [normalizedLang, setNormalizedLang] = useState<string>('plaintext');
  const isMarkdown = getLanguageLabel(language) === 'markdown';
  const LINE_HEIGHT = 19;
  const visibleHeight = (previewLines + 2) * LINE_HEIGHT;

  useEffect(() => {
    const normalized = normalizeLanguage(language);
    setNormalizedLang(normalized);
  }, [language]);

  const components: Components = {
    code: ({ className, children }) => (
      <code className={className}>
        {children}
      </code>
    ),
    pre: ({ children }) => {
      const codeElement = React.Children.toArray(children).find(
        (child) => React.isValidElement(child) && child.type === 'code'
      );
      
      if (!React.isValidElement(codeElement)) {
        return <pre>{children}</pre>;
      }

      const className = codeElement.props.className || '';
      const match = /language-(\w+)/.exec(className);
      const lang = match ? match[1] : normalizedLang;
      const code = String(codeElement.props.children).replace(/\n$/, '');

      return (
        <Editor
          height={`${visibleHeight}px`}
          defaultLanguage={lang}
          defaultValue={code}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 13,
            lineNumbers: showLineNumbers ? 'on' : 'off',
            renderLineHighlight: 'none',
            folding: false,
            wordWrap: 'on',
            wrappingIndent: 'indent',
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            scrollbar: {
              vertical: 'hidden',
              horizontal: 'hidden',
              handleMouseWheel: false,
            },
            domReadOnly: true,
            contextmenu: false,
            lineDecorationsWidth: 24,
            padding: { top: 16, bottom: 16 },
          }}
        />
      );
    }
  };

  return (
    <div className="relative select-none" style={{ height: visibleHeight }}>
      <style>
        {`
          .markdown-content-preview {
            color: white;
            background-color: #1E1E1E;
            padding: 1rem;
            border-radius: 0.5rem;
            position: relative;
            max-height: ${visibleHeight}px;
            overflow: hidden;
          }

          .markdown-content-preview p,
          .markdown-content-preview li {
            font-size: 0.875rem;
            line-height: 1.5;
            margin-bottom: 0.5rem;
          }

          .markdown-content-preview code {
            background-color: rgba(255, 255, 255, 0.1);
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
            font-size: 0.875em;
          }
        `}
      </style>
      <div className="relative">
        {isMarkdown ? (
          <div className="markdown-content-preview">
            <ReactMarkdown components={components}>
              {code}
            </ReactMarkdown>
          </div>
        ) : (
          <Editor
            className="pointer-events-none"
            height={`${visibleHeight}px`}
            defaultLanguage={normalizedLang}
            defaultValue={code}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 13,
              lineNumbers: 'off',
              renderLineHighlight: 'none',
              folding: false,
              wordWrap: 'on',
              wrappingIndent: 'indent',
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              overviewRulerBorder: false,
              scrollbar: {
                vertical: 'hidden',
                horizontal: 'hidden',
                handleMouseWheel: false,
              },
              domReadOnly: true,
              contextmenu: false,
              lineDecorationsWidth: 24,
              padding: { top: 16, bottom: 16 },
            }}
          />
        )}

        {!isMarkdown && (
          <div 
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1e1e1e] to-transparent pointer-events-none rounded-b-lg"
            style={{ height: `${LINE_HEIGHT * 2}px`, zIndex: 2 }}
          />
        )}

        <div className="absolute" style={{ zIndex: 3, right: 0, top: 0 }}>
          <CopyButton text={code} />
        </div>
      </div>
    </div>
  );
};

export default PreviewCodeBlock;