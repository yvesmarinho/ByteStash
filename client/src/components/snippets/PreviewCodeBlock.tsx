import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { getLanguageLabel, normalizeLanguage } from '../../utils/languageUtils';
import CopyButton from '../common/CopyButton';
import ReactMarkdown from 'react-markdown';
import { PreviewCodeBlockProps } from '@/types/types';

const PreviewCodeBlock: React.FC<PreviewCodeBlockProps> = ({
  code,
  language = 'plaintext',
  previewLines = 4,
  showLineNumbers = true
}) => {
  const [normalizedLang, setNormalizedLang] = useState<string>('plaintext');
  const isMarkdown = getLanguageLabel(language) === 'markdown';
  const LINE_HEIGHT = 19;
  const visibleHeight = (previewLines + 2) * LINE_HEIGHT;

  useEffect(() => {
    const normalized = normalizeLanguage(language);
    setNormalizedLang(normalized);
  }, [language]);

  return (
    <div className="relative select-none" style={{ height: visibleHeight }}>
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
        `}
      </style>
      <div className="relative">
        {isMarkdown ? (
          <div className="markdown-content-preview">
            <ReactMarkdown
              className="text-sm text-gray-300 markdown"
            >
              {code}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="editor-mask-wrapper">
            <Editor
              className="pointer-events-none rounded-lg"
              height={`${visibleHeight}px`}
              defaultLanguage={normalizedLang}
              defaultValue={code}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 13,
                lineNumbers: showLineNumbers ? 'on' : 'off',
                renderLineHighlight: 'none',
                folding: false,
                wordWrap: 'on',
                wrappingIndent: 'indent',
                overviewRulerLanes: 0,
                hideCursorInOverviewRuler: true,
                overviewRulerBorder: false,
                scrollbar: {
                  vertical: 'hidden',
                  horizontal: 'hidden',
                  handleMouseWheel: false,
                },
                domReadOnly: true,
                contextmenu: false,
                lineDecorationsWidth: 24,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>
        )}

        {!isMarkdown && (
          <div 
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1e1e1e] to-transparent pointer-events-none rounded-b-lg"
            style={{ height: `${LINE_HEIGHT * 2}px`, zIndex: 2 }}
          />
        )}

        <div className="absolute" style={{ zIndex: 3, right: 0, top: 0 }}>
          <CopyButton text={code} />
        </div>
      </div>
    </div>
  );
};

export default PreviewCodeBlock;