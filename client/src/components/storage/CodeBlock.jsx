import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyButton from './CopyButton';

const CodeBlock = ({ code, language, isPreview = false }) => (
  <div className="relative">
    <SyntaxHighlighter
      language={language.toLowerCase()}
      style={vscDarkPlus}
      customStyle={{
        padding: '1rem',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
      }}
    >
      {isPreview ? code.split('\n').slice(0, 3).join('\n') : code}
    </SyntaxHighlighter>
    <CopyButton text={code} />
  </div>
);

export default CodeBlock;