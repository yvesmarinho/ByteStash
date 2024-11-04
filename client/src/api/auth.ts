interface AuthConfig {
  authRequired: boolean;
}

interface LoginResponse {
  token: string;
}

export const AUTH_API_URL = '/api/auth';

interface ApiError extends Error {
  status?: number;
}

export const AUTH_ERROR_EVENT = 'bytestash:auth_error';
export const authErrorEvent = new CustomEvent(AUTH_ERROR_EVENT);

const handleResponse = async (response: Response) => {
  if (response.status === 401 || response.status === 403) {
      window.dispatchEvent(authErrorEvent);
      
      const error = new Error('Authentication required') as ApiError;
      error.status = response.status;
      throw error;
  }

  if (!response.ok) {
      const text = await response.text();
      console.error('Error response body:', text);
      const error = new Error(`Request failed: ${response.status} ${response.statusText}`) as ApiError;
      error.status = response.status;
      throw error;
  }

  return response;
};

const getHeaders = (includeAuth = false) => {
  const headers: Record<string, string> = {
      'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) {
          headers['Authorization'] = `Bearer ${token}`;
      }
  }
  
  return headers;
};

export const getAuthConfig = async (): Promise<AuthConfig> => {
  try {
      const response = await fetch(`${AUTH_API_URL}/config`);
      await handleResponse(response);
      return response.json();
  } catch (error) {
      console.error('Error fetching auth config:', error);
      throw error;
  }
};

export const verifyToken = async (): Promise<boolean> => {
  try {
      const response = await fetch(`${AUTH_API_URL}/verify`, {
          headers: getHeaders(true)
      });
      
      if (response.status === 401 || response.status === 403) {
          return false;
      }
      
      const data = await response.json();
      return data.valid;
  } catch (error) {
      console.error('Error verifying token:', error);
      return false;
  }
};

export const login = async (username: string, password: string): Promise<string> => {
  try {
      const response = await fetch(`${AUTH_API_URL}/login`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ username, password })
      });

      await handleResponse(response);
      const data: LoginResponse = await response.json();
      return data.token;
  } catch (error) {
      console.error('Error logging in:', error);
      throw error;
  }
};