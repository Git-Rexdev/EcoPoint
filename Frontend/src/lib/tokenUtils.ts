// Token utility functions for authentication management

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Decode JWT token and extract payload
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * Get time remaining until token expires (in seconds)
 */
export const getTokenTimeRemaining = (token: string): number => {
  const payload = decodeToken(token);
  if (!payload) return 0;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - currentTime);
};

/**
 * Get token expiration date
 */
export const getTokenExpirationDate = (token: string): Date | null => {
  const payload = decodeToken(token);
  if (!payload) return null;
  
  return new Date(payload.exp * 1000);
};

/**
 * Check if token will expire within given minutes
 */
export const isTokenExpiringSoon = (token: string, minutes: number = 5): boolean => {
  const timeRemaining = getTokenTimeRemaining(token);
  return timeRemaining > 0 && timeRemaining < (minutes * 60);
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('deviceId');
  localStorage.removeItem('deviceSecret');
  localStorage.removeItem('user');
};

/**
 * Get stored token from localStorage
 */
export const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Check if user is authenticated with valid token
 */
export const isAuthenticated = (): boolean => {
  const token = getStoredToken();
  return token !== null && !isTokenExpired(token);
};

/**
 * Auto logout function
 */
export const performAutoLogout = (): void => {
  clearAuthData();
  
  // Show a user-friendly message
  if (window.location.pathname !== '/login') {
    // Store the current path to redirect back after re-login
    sessionStorage.setItem('redirectPath', window.location.pathname);
    
    // Store logout reason for showing message on login page
    sessionStorage.setItem('logoutReason', 'Session expired. Please login again.');
  }
  
  // Redirect to login
  window.location.href = '/login';
};

/**
 * Set up automatic token expiration checking
 */
export const setupTokenExpirationCheck = (): (() => void) => {
  const checkInterval = 60000; // Check every minute
  
  const checkTokenExpiration = () => {
    const token = getStoredToken();
    if (!token) return;
    
    if (isTokenExpired(token)) {
      console.log('Token expired, logging out...');
      performAutoLogout();
      return;
    }
    
    // Warn user if token is expiring soon (5 minutes)
    if (isTokenExpiringSoon(token, 5)) {
      console.log('Token expiring soon...');
      // You could show a notification here to warn the user
    }
  };
  
  // Initial check
  checkTokenExpiration();
  
  // Set up interval
  const intervalId = setInterval(checkTokenExpiration, checkInterval);
  
  // Return cleanup function
  return () => clearInterval(intervalId);
};

/**
 * Format time remaining in human-readable format
 */
export const formatTimeRemaining = (seconds: number): string => {
  if (seconds <= 0) return 'Expired';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};