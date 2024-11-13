import { authService } from '../../service/authService';
import { createCustomEvent, EVENTS } from '../../constants/events';

export const getAuthConfig = async () => {
  try {
    return await authService.getConfig();
  } catch (error) {
    console.error('Error fetching auth config:', error);
    throw error;
  }
};

export const verifyToken = async (): Promise<boolean> => {
  try {
    return await authService.verifyToken();
  } catch (error) {
    console.error('Error verifying token:', error);
    window.dispatchEvent(createCustomEvent(EVENTS.AUTH_ERROR));
    return false;
  }
};

export const login = async (username: string, password: string): Promise<string> => {
  try {
    return await authService.login(username, password);
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};