import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { normalizeLanguage } from '../../utils/languageUtils';
import CopyButton from '../common/CopyButton';
import { CodeBlockProps } from '../../types/types';

const CodeBlock: React.FC<CodeBlockProps> = ({ 
  code, 
  language = 'plaintext', 
  isPreview = false, 
  previewLines = 4 
}) => {
  const [normalizedLang, setNormalizedLang] = useState('plaintext');
  const LINE_HEIGHT = 24;
  const visibleHeight = (previewLines + 2) * LINE_HEIGHT;

  useEffect(() => {
    const normalized = normalizeLanguage(language);
    setNormalizedLang(normalized);
  }, [language]);

  return (
    <div className="relative">
      <style>
        {`
          .syntax-highlighter ::selection {
            background-color: rgba(255, 255, 255, 0.3) !important;
            color: inherit !important;
          }
          .syntax-highlighter {
            min-height: ${isPreview ? `${visibleHeight}px` : 'auto'} !important;
          }
          .syntax-highlighter pre {
            min-height: ${isPreview ? `${visibleHeight}px` : 'auto'} !important;
            line-height: ${LINE_HEIGHT}px !important;
          }
          .syntax-highlighter code {
            display: inline-block;
            min-height: ${isPreview ? `${visibleHeight}px` : 'auto'} !important;
            line-height: ${LINE_HEIGHT}px !important;
          }
        `}
      </style>
      <div className="relative">
        <SyntaxHighlighter
          language={normalizedLang}
          style={vscDarkPlus}
          customStyle={{
            padding: '1rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            lineHeight: `${LINE_HEIGHT}px`,
            maxHeight: isPreview ? `${visibleHeight}px` : 'none',
            overflow: 'hidden',
          }}
          wrapLines={true}
          className="syntax-highlighter"
        >
          {code}
        </SyntaxHighlighter>
        {isPreview && (
          <div 
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" 
            style={{ height: `${LINE_HEIGHT * 2}px` }}
          />
        )}
        <CopyButton text={code} />
      </div>
    </div>
  );
};

export default CodeBlock;