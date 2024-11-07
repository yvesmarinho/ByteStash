import React from 'react';
import { getLanguageLabel, getMonacoLanguage } from '../../utils/languageUtils';
import CopyButton from '../common/CopyButton';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export interface PreviewCodeBlockProps {
  code: string;
  language?: string;
  previewLines?: number;
  showLineNumbers?: boolean;
}

const PreviewCodeBlock: React.FC<PreviewCodeBlockProps> = ({
  code,
  language = 'plaintext',
  previewLines = 4,
  showLineNumbers = true
}) => {
  const isMarkdown = getLanguageLabel(language) === 'markdown';
  const LINE_HEIGHT = 19;
  const visibleHeight = (previewLines + 2) * LINE_HEIGHT;

  const truncatedCode = code.split('\n').slice(0, previewLines + 5).join('\n');

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

          /* Hide extra lines */
          .token-line:nth-child(n+${previewLines + 1}) {
            visibility: hidden;
          }

          /* Hide extra line numbers */
          .react-syntax-highlighter-line-number:nth-child(n+${previewLines + 1}) {
            visibility: hidden;
          }
        `}
      </style>

      <div className="relative">
        {isMarkdown ? (
          <div className="markdown-content-preview">
            <ReactMarkdown className="text-sm text-gray-300 markdown">
              {truncatedCode}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="preview-wrapper">
            <SyntaxHighlighter
              language={getMonacoLanguage(language)}
              style={customStyle}
              showLineNumbers={showLineNumbers}
              wrapLines={true}
              lineProps={{
                style: {
                  whiteSpace: 'pre',
                  wordBreak: 'break-all',
                  paddingLeft: 0
                }
              }}
              customStyle={{
                maxHeight: visibleHeight,
                minHeight: visibleHeight,
                marginBottom: 0,
                marginTop: 0,
                textIndent: 0,
                paddingLeft: showLineNumbers ? 10 : 20,
                borderRadius: '0.5rem',
                overflow: 'hidden'
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
              {truncatedCode}
            </SyntaxHighlighter>
          </div>
        )}

        <div 
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1e1e1e] to-transparent pointer-events-none rounded-b-lg"
          style={{ height: `${LINE_HEIGHT * 2}px` }}
        />

        <div className="absolute" style={{ zIndex: 3, right: 0, top: 0 }}>
          <CopyButton text={code} />
        </div>
      </div>
    </div>
  );
};

export default PreviewCodeBlock;