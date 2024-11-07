import React, { useState, useEffect, useRef } from 'react';
import { getLanguageLabel, getMonacoLanguage } from '../../utils/languageUtils';
import CopyButton from '../common/CopyButton';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { FullCodeBlockProps } from '@/types/types';

const FullCodeBlock: React.FC<FullCodeBlockProps> = ({ 
  code, 
  language = 'plaintext',
  showLineNumbers = true
}) => {
  const isMarkdown = getLanguageLabel(language) === 'markdown';
  const [highlighterHeight, setHighlighterHeight] = useState<string>("100px");
  const containerRef = useRef<HTMLDivElement>(null);
  const LINE_HEIGHT = 19;

  useEffect(() => {
    updateHighlighterHeight();
    const resizeObserver = new ResizeObserver(updateHighlighterHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [code]);

  const updateHighlighterHeight = () => {
    if (!containerRef.current) return;
    
    const lineCount = code.split('\n').length;
    const contentHeight = (lineCount * LINE_HEIGHT) + 35;
    const newHeight = Math.min(500, Math.max(100, contentHeight));
    setHighlighterHeight(`${newHeight}px`);
  };

  const customStyle = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      margin: 0,
      fontSize: '13px',
      background: '#1E1E1E',
      padding: '1rem',
    },
    'code[class*="language-"]': {
      ...vscDarkPlus['code[class*="language-"]'],
      fontSize: '13px',
      background: '#1E1E1E',
      display: 'block',
      textIndent: 0,
    }
  };

  return (
    <div className="relative">
      <style>
        {`
          .syntax-highlighter-full {
            overflow: auto !important;
            border-radius: 0.5rem;
          }

          .syntax-highlighter-full ::selection {
            background-color: rgba(255, 255, 255, 0.3) !important;
            color: inherit !important;
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
            <ReactMarkdown className="text-sm text-gray-300 markdown">
              {code}
            </ReactMarkdown>
          </div>
        ) : (
          <div 
            ref={containerRef}
            className="highlighter-wrapper"
            style={{ maxHeight: '500px' }}
          >
            <SyntaxHighlighter
              className="syntax-highlighter-full"
              language={getMonacoLanguage(language)}
              style={customStyle}
              showLineNumbers={showLineNumbers}
              wrapLines={true}
              lineProps={{
                style: { 
                  whiteSpace: 'pre',
                  wordBreak: 'break-all',
                  paddingLeft: 0,
                  textIndent: 0,
                  marginLeft: 0
                }
              }}
              customStyle={{
                height: highlighterHeight,
                minHeight: '100px',
                marginBottom: 0,
                marginTop: 0,
                textIndent: 0,
                paddingLeft: showLineNumbers ? 0 : 20
              }}
              useInlineStyles={true}
              codeTagProps={{
                style: {
                  textIndent: 0,
                  paddingLeft: 0,
                  marginLeft: 0
                }
              }}
            >
              {code}
            </SyntaxHighlighter>
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