import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApi } from '@/api/auth';
import { authStorage } from '@/store';
import { User, RegisterData, AuthResponse } from '@/types/auth';

type SessionContextValue = {
  session: boolean;
  isLoading: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: RegisterData) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const checkSession = async () => {
    try {
      const token = await authStorage.getToken();
      const savedUser = await authStorage.getUser();

      if (token && savedUser) {
        const response = await authApi.verifyToken(token);
        setUser(response.user);
        setSession(true);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      await authStorage.clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleAuthSuccess = async (response: AuthResponse) => {
    await authStorage.saveToken(response.token);
    await authStorage.saveUser(response.user);
    setUser(response.user);
    setSession(true);
  };

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      await handleAuthSuccess(response);
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  }, []);

  const signUp = useCallback(async (data: RegisterData) => {
    try {
      const response = await authApi.register(data);
      await handleAuthSuccess(response);
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    await authStorage.clearAuth();
    setSession(false);
    setUser(null);
  }, []);

  return (
    <SessionContext.Provider value={{ session, isLoading, user, signIn, signUp, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}