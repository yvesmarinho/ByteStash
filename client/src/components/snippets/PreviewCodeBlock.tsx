import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getLanguageLabel, normalizeLanguage } from '../../utils/languageUtils';
import CopyButton from '../common/CopyButton';
import ReactMarkdown, { Components } from 'react-markdown';
import { PreviewCodeBlockProps } from '@/types/types';

const PreviewCodeBlock: React.FC<PreviewCodeBlockProps> = ({ 
  code, 
  language = 'plaintext',
  previewLines = 4,
  showLineNumbers = true
}) => {
  const [normalizedLang, setNormalizedLang] = useState<string>('plaintext');
  const LINE_HEIGHT = 24;
  const visibleHeight = (previewLines + 2) * LINE_HEIGHT;
  const isMarkdown = getLanguageLabel(language) === 'markdown';

  useEffect(() => {
    const normalized = normalizeLanguage(language);
    setNormalizedLang(normalized);
  }, [language]);

  const lineNumberStyle = {
    minWidth: '2.5em',
    paddingRight: '0.5em',
    textAlign: 'right',
    userSelect: 'none',
    opacity: '0.5',
    borderRight: '1px solid #404040',
    marginRight: '1em',
  } as const;

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
        <SyntaxHighlighter
          language={lang}
          style={vscDarkPlus}
          className="syntax-highlighter-preview"
        >
          {code}
        </SyntaxHighlighter>
      );
    }
  };

  return (
    <div className="relative">
      <style>
        {`
          .syntax-highlighter-preview {
            min-height: ${visibleHeight}px !important;
            max-height: ${visibleHeight}px !important;
            overflow: hidden !important;
            border-radius: 0.5rem;
          }

          .syntax-highlighter-preview ::selection {
            background-color: rgba(255, 255, 255, 0.3) !important;
            color: inherit !important;
          }

          .markdown-content-preview {
            color: white;
            background-color: #1E1E1E;
            padding: 1rem;
            border-radius: 0.5rem;
            min-height: ${visibleHeight}px;
            max-height: ${visibleHeight}px;
            overflow: hidden;
            position: relative;
          }

          .markdown-content-preview p,
          .markdown-content-preview li {
            font-size: 0.875rem;
            line-height: 1.5;
            margin-bottom: 0.5rem;
          }

          .markdown-content-preview h1 {
            font-size: 1.5rem;
            line-height: 2rem;
            margin-bottom: 1rem;
            font-weight: 600;
          }

          .markdown-content-preview h2 {
            font-size: 1.25rem;
            line-height: 1.75rem;
            margin-bottom: 0.75rem;
            font-weight: 600;
          }

          .markdown-content-preview h3 {
            font-size: 1.125rem;
            line-height: 1.5rem;
            margin-bottom: 0.75rem;
            font-weight: 600;
          }

          .markdown-content-preview h4,
          .markdown-content-preview h5,
          .markdown-content-preview h6 {
            font-size: 1rem;
            line-height: 1.5rem;
            margin-bottom: 0.5rem;
            font-weight: 600;
          }

          .markdown-content-preview ul,
          .markdown-content-preview ol {
            margin-left: 1.5rem;
            margin-bottom: 1rem;
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
          <div className="relative">
            <div className="markdown-content-preview">
              <ReactMarkdown components={components}>
                {code}
              </ReactMarkdown>
            </div>
            <div 
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" 
              style={{ height: `${LINE_HEIGHT * 2}px` }}
            />
          </div>
        ) : (
          <>
            <SyntaxHighlighter
              language={normalizedLang}
              style={vscDarkPlus}
              wrapLines={true}
              className="syntax-highlighter-preview"
              lineNumberStyle={lineNumberStyle}
              showLineNumbers={showLineNumbers}
            >
              {code}
            </SyntaxHighlighter>
            <div 
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" 
              style={{ height: `${LINE_HEIGHT * 2}px` }}
            />
          </>
        )}
        <CopyButton text={code} />
      </div>
    </div>
  );
};

export default PreviewCodeBlock;