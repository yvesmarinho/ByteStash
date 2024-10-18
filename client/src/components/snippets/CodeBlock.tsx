import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getLanguageForPrism } from '../../utils/languageUtils';
import CopyButton from '../common/CopyButton';
import { CodeBlockProps } from '../../types/types';

const processCodeForPreview = (code: string, isPreview: boolean, previewLines: number): string => {
  if (!isPreview) return code;

  const lines = code.split('\n');
  const displayLines = lines.slice(0, previewLines);
  
  // Ensure we always have exactly previewLines number of lines
  while (displayLines.length < previewLines) {
    displayLines.push('');
  }
  
  return displayLines.join('\n');
};

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, isPreview = false, previewLines = 4 }) => {
  const displayCode = processCodeForPreview(code, isPreview, previewLines);

  return (
    <div className="relative">
      <style>
        {`
          .syntax-highlighter ::selection {
            background-color: rgba(255, 255, 255, 0.3) !important;
            color: inherit !important;
          }
          .syntax-highlighter {
            min-height: ${isPreview ? `${previewLines * 1.5}em` : 'auto'} !important;
          }
          .syntax-highlighter pre {
            min-height: ${isPreview ? `${previewLines * 1.5}em` : 'auto'} !important;
          }
          .syntax-highlighter code {
            display: inline-block;
            min-height: ${isPreview ? `${previewLines * 1.5}em` : 'auto'} !important;
          }
        `}
      </style>
      <SyntaxHighlighter
        language={getLanguageForPrism(language)}
        style={vscDarkPlus}
        customStyle={{
          padding: '1rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.5em',
        }}
        wrapLines={true}
        className="syntax-highlighter"
      >
        {displayCode}
      </SyntaxHighlighter>
      <CopyButton text={code} />
    </div>
  );
};

export default CodeBlock;