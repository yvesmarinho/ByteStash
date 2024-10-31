import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { getLanguageLabel, normalizeLanguage } from '../../utils/languageUtils';
import CopyButton from '../common/CopyButton';
import ReactMarkdown, { Components } from 'react-markdown';
import { FullCodeBlockProps } from '@/types/types';

const FullCodeBlock: React.FC<FullCodeBlockProps> = ({ 
  code, 
  language = 'plaintext',
  showLineNumbers = true
}) => {
  const [normalizedLang, setNormalizedLang] = useState<string>('plaintext');
  const [key, setKey] = useState<number>(0);
  const isMarkdown = getLanguageLabel(language) === 'markdown';

  useEffect(() => {
    const normalized = normalizeLanguage(language);
    setNormalizedLang(normalized);
    setKey(prev => prev + 1);
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
          key={`${lang}-${key}`}
          height="500px"
          language={lang}
          defaultValue={code}
          theme="vs-dark"
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
            lineDecorationsWidth: 24,
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
          .editor-mask-wrapper {
            position: relative;
            border-radius: 0.5rem;
            mask-image: radial-gradient(white, white);
            -webkit-mask-image: -webkit-radial-gradient(white, white);
            transform: translateZ(0);
            overflow: hidden;
          }

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
          <div className="editor-mask-wrapper">
            <Editor
              key={`${normalizedLang}-${key}`}
              height="500px"
              language={normalizedLang}
              className="rounded-lg"
              defaultValue={code}
              theme="vs-dark"
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
                lineDecorationsWidth: 24,
                padding: { top: 16, bottom: 16 },
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