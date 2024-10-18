import React from 'react';
import SnippetStorage from './components/snippets/SnippetStorage';
import { ToastProvider } from './components/toast/Toast';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-900">
        <SnippetStorage />
      </div>
    </ToastProvider>
  );
};

export default App;