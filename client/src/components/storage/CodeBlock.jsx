import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getLanguageForPrism } from '../../utils/languageUtils';
import CopyButton from './CopyButton';

const processCodeForPreview = (code, isPreview) => {
  if (!isPreview) return code;

  const lines = code.split('\n');
  const previewLines = lines.slice(0, 4);
  while (previewLines.length < 5) {
    previewLines.push('');
  }
  return previewLines.join('\n');
};

const CodeBlock = ({ code, language, isPreview = false }) => {
  const displayCode = processCodeForPreview(code, isPreview);

  return (
    <div className="relative">
      <style>
        {`
          .syntax-highlighter ::selection {
            background-color: rgba(255, 255, 255, 0.3) !important;
            color: inherit !important;
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