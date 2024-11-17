import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { register } from '../../utils/api/auth';
import { PageContainer } from '../common/layout/PageContainer';
import { useToast } from '../../hooks/useToast';

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, authConfig } = useAuth();
  const { addToast } = useToast();

  if (!authConfig?.allowNewAccounts) {
    return (
      <PageContainer className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Registration Disabled</h2>
          <p className="text-gray-400 mb-4">New account registration is currently disabled.</p>
          <Link 
            to="/login" 
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Return to Login
          </Link>
        </div>
      </PageContainer>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      setIsLoading(false);
      return;
    }

    try {
      const response = await register(username, password);
      if (response.token && response.user) {
        login(response.token, response.user);
      }
    } catch (err: any) {
      const errorMessage = err.error || 'Failed to register';
      addToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              sign in to your account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border 
                  border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-t-md 
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border 
                  border-gray-700 placeholder-gray-500 text-white bg-gray-800
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border 
                  border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-b-md
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
                text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};