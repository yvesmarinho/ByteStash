import React from 'react';
import SnippetStorage from './components/snippets/SnippetStorage';
import { ToastProvider } from './components/toast/Toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/auth/LoginPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SharedSnippetView from './components/snippets/share/SharedSnippetView';
import SnippetPage from './components/snippets/SnippetPage';

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated, isAuthRequired, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (isAuthRequired && !isAuthenticated) {
    return <LoginPage />;
  }

  return <SnippetStorage />;
};

const App: React.FC = () => {
  return (
    <Router basename={window.__BASE_PATH__} future={{ v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/s/:shareId" element={<SharedSnippetView />} />
            <Route path="/snippets/:snippetId" element={<SnippetPage />} />
            <Route path="/" element={<AuthenticatedApp />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;