import React, { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { DynamicCodeEditorProps } from '../../types/types';
import { getMonacoLanguage } from '../../utils/languageUtils';
import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';

const DynamicCodeEditor: React.FC<DynamicCodeEditorProps> = ({
  code,
  language = 'plaintext',
  onValueChange,
  showLineNumbers = true
}) => {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoLanguage = getMonacoLanguage(language);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        Monaco.editor.setModelLanguage(model, monacoLanguage);
      }
    }
  }, [monacoLanguage]);

  return (
    <div className="overflow-hidden rounded-lg">
      <Editor
        height="400px"
        defaultValue={code}
        defaultLanguage={monacoLanguage}
        onChange={onValueChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          lineNumbers: showLineNumbers ? 'on' : 'off',
          renderLineHighlight: 'all',
          wordWrap: 'on',
          wrappingIndent: 'indent',
          automaticLayout: true,
          tabSize: 2,
          formatOnPaste: true,
          formatOnType: true,
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
};

export default DynamicCodeEditor;