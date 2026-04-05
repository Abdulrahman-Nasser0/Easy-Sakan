'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SessionData } from '@/lib/session';

interface AuthContextType {
  user: SessionData | null;
  isLoading: boolean;
  isStudent: boolean;
  isLandlord: boolean;
  isAdmin: boolean;
  isVerified: boolean;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isStudent: user?.role === 'Student',
    isLandlord: user?.role === 'Landlord',
    isAdmin: user?.role === 'Admin',
    isVerified: user?.isVerified ?? false,
    refetchUser: fetchSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
