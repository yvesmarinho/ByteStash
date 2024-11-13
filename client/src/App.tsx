import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './components/auth/LoginPage';
import { ROUTES } from './constants/routes';
import { PageContainer } from './components/common/layout/PageContainer';
import { ToastProvider } from './contexts/ToastContext';
import SnippetStorage from './components/snippets/view/SnippetStorage';
import SharedSnippetView from './components/snippets/share/SharedSnippetView';
import SnippetPage from './components/snippets/view/SnippetPage';

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated, isAuthRequired, isLoading } = useAuth();

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </PageContainer>
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
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path={ROUTES.SHARED_SNIPPET} element={<SharedSnippetView />} />
            <Route path={ROUTES.SNIPPET} element={<SnippetPage />} />
            <Route path={ROUTES.HOME} element={<AuthenticatedApp />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;