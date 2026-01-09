'use client';

import { useState, useEffect } from 'react';

const ADMIN_PIN = '2018';
const SESSION_KEY = 'smartypants_admin_auth';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AdminAuthReturn extends AdminAuthState {
  login: (pin: string) => boolean;
  logout: () => void;
}

/**
 * Hook for managing admin authentication via PIN
 * Session persists for 24 hours in localStorage
 */
export function useAdminAuth(): AdminAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (sessionData) {
        const { timestamp } = JSON.parse(sessionData);
        if (Date.now() - timestamp < SESSION_DURATION) {
          setIsAuthenticated(true);
        } else {
          // Session expired
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch {
      // Invalid session data
      localStorage.removeItem(SESSION_KEY);
    }
    setIsLoading(false);
  }, []);

  const login = (pin: string): boolean => {
    if (pin === ADMIN_PIN) {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ timestamp: Date.now() })
      );
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = (): void => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
