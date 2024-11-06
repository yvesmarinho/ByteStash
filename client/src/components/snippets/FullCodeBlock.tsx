import React, { useState, useEffect } from 'react';
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
  const isMarkdown = getLanguageLabel(language) === 'markdown';

  useEffect(() => {
    const normalized = getMonacoLanguage(language);
    setNormalizedLang(normalized);
    setKey(prev => prev + 1);
  }, [language]);

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

          .markdown-content-full blockquote {
            border-left: 3px solid #4a5568;
            padding-left: 1rem;
            margin: 1rem 0;
            color: #a0aec0;
          }

          .markdown-content-full table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
          }

          .markdown-content-full th,
          .markdown-content-full td {
            border: 1px solid #4a5568;
            padding: 0.5rem;
            text-align: left;
          }

          .markdown-content-full th {
            background-color: #2d3748;
          }

          .markdown-content-full hr {
            border: 0;
            border-top: 1px solid #4a5568;
            margin: 1rem 0;
          }
        `}
      </style>
      <div className="relative">
        {isMarkdown ? (
          <div className="markdown-content-full">
            <ReactMarkdown
              className="text-sm text-gray-300 markdown"
            >
              {code}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="editor-mask-wrapper">
            <Editor
              key={`${normalizedLang}-${key}`}
              height="500px"
              defaultLanguage={normalizedLang}
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