import React from 'react';
import SnippetStorage from './components/storage/SnippetStorage';
import { ToastProvider } from './components/toast/Toast';

function App() {
  return (
    <ToastProvider>
      <div className="App">
        <SnippetStorage />
      </div>
    </ToastProvider>
  );
}

export default App;