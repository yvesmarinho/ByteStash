import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { getLanguageLabel, normalizeLanguage } from '../../utils/languageUtils';
import CopyButton from '../common/CopyButton';
import ReactMarkdown, { Components } from 'react-markdown';
import { FullCodeBlockProps } from '@/types/types';

const FullCodeBlock: React.FC<FullCodeBlockProps> = ({ 
  code, 
  language = 'plaintext'
}) => {
  const [normalizedLang, setNormalizedLang] = useState<string>('plaintext');
  const isMarkdown = getLanguageLabel(language) === 'markdown';

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
          height="400px"
          defaultLanguage={lang}
          defaultValue={code}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 13,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            folding: true,
            wordWrap: 'on',
            wrappingIndent: 'indent',
            padding: { top: 16, bottom: 16 },
          }}
        />
      );
    }
  };

  return (
    <div className="relative">
      <style>
        {`
          .markdown-content-full {
            color: white;
            background-color: #1E1E1E;
            padding: 1rem;
            border-radius: 0.5rem;
            position: relative;
          }

          .markdown-content-full p,
          .markdown-content-full li {
            font-size: 0.875rem;
            line-height: 1.5;
            margin-bottom: 0.5rem;
          }

          .markdown-content-full h1 {
            font-size: 1.5rem;
            line-height: 2rem;
            margin-bottom: 1rem;
            font-weight: 600;
          }

          .markdown-content-full h2 {
            font-size: 1.25rem;
            line-height: 1.75rem;
            margin-bottom: 0.75rem;
            font-weight: 600;
          }

          .markdown-content-full h3 {
            font-size: 1.125rem;
            line-height: 1.5rem;
            margin-bottom: 0.75rem;
            font-weight: 600;
          }

          .markdown-content-full h4,
          .markdown-content-full h5,
          .markdown-content-full h6 {
            font-size: 1rem;
            line-height: 1.5rem;
            margin-bottom: 0.5rem;
            font-weight: 600;
          }

          .markdown-content-full ul,
          .markdown-content-full ol {
            margin-left: 1.5rem;
            margin-bottom: 1rem;
          }

          .markdown-content-full code {
            background-color: rgba(255, 255, 255, 0.1);
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
            font-size: 0.875em;
          }
        `}
      </style>
      <div className="relative">
        {isMarkdown ? (
          <div className="markdown-content-full">
            <ReactMarkdown components={components}>
              {code}
            </ReactMarkdown>
          </div>
        ) : (
          <Editor
            height="400px"
            defaultLanguage={normalizedLang}
            defaultValue={code}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 13,
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              folding: true,
              wordWrap: 'on',
              wrappingIndent: 'indent',
              padding: { top: 16, bottom: 16 },
            }}
          />
        )}
        <CopyButton text={code} />
      </div>
    </div>
  );
};

export default FullCodeBlock;