import React from 'react';
import { getLanguageLabel, getMonacoLanguage } from '../../utils/languageUtils';
import CopyButton from '../common/CopyButton';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { PreviewCodeBlockProps } from '@/types/types';

const PreviewCodeBlock: React.FC<PreviewCodeBlockProps> = ({
  code,
  language = 'plaintext',
  previewLines = 4,
  showLineNumbers = true
}) => {
  const isMarkdown = getLanguageLabel(language) === 'markdown';
  const LINE_HEIGHT = 19;
  const visibleHeight = (previewLines + 2) * LINE_HEIGHT;

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

          .markdown-content-preview blockquote {
            border-left: 3px solid #4a5568;
            padding-left: 1rem;
            margin: 1rem 0;
            color: #a0aec0;
          }

          .markdown-content-preview table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
          }

          .markdown-content-preview th,
          .markdown-content-preview td {
            border: 1px solid #4a5568;
            padding: 0.5rem;
            text-align: left;
          }

          .markdown-content-preview th {
            background-color: #2d3748;
          }

          .markdown-content-preview hr {
            border: 0;
            border-top: 1px solid #4a5568;
            margin: 1rem 0;
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
              {code}
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
                  display: 'flex'
                }
              }}
              customStyle={{
                maxHeight: visibleHeight,
                minHeight: visibleHeight,
                marginBottom: 0,
                marginTop: 0,
                textIndent: 0,
                paddingLeft: showLineNumbers ? 0 : 20,
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
              {code}
            </SyntaxHighlighter>
            <div 
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1e1e1e] to-transparent pointer-events-none rounded-b-lg"
              style={{ height: `${LINE_HEIGHT * 2}px` }}
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

export default PreviewCodeBlock;