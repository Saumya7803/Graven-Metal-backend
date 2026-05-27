import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { publicApi } from '../../lib/publicApi';
import {
  CUSTOMER_AUTH_CHANGED_EVENT,
  clearCustomerAuth,
  getCustomerAuthToken,
  getCustomerAuthUser,
  isTokenExpired,
  setCustomerAuth,
  type AuthUser,
} from '../../lib/auth';

type AuthContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
};

const AuthContext = createContext<AuthContextValue>({
  isReady: false,
  isAuthenticated: false,
  token: null,
  user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      const savedToken = getCustomerAuthToken();
      const savedUser = getCustomerAuthUser();

      if (!savedToken || !savedUser || isTokenExpired(savedToken) || savedUser.role !== 'user') {
        clearCustomerAuth();
        setToken(null);
        setUser(null);
        setIsReady(true);
        return;
      }

      setToken(savedToken);
      setUser(savedUser);

      try {
        const nextUser = await publicApi.getMe();
        if (nextUser.role !== 'user') throw new Error('Invalid customer role');
        setCustomerAuth(savedToken, nextUser);
        setUser(nextUser);
      } catch {
        clearCustomerAuth();
        setToken(null);
        setUser(null);
      } finally {
        setIsReady(true);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const syncAuthState = () => {
      const nextToken = getCustomerAuthToken();
      const nextUser = getCustomerAuthUser();
      setToken(nextToken);
      setUser(nextUser?.role === 'user' ? nextUser : null);
    };

    window.addEventListener(CUSTOMER_AUTH_CHANGED_EVENT, syncAuthState);
    window.addEventListener('storage', syncAuthState);
    return () => {
      window.removeEventListener(CUSTOMER_AUTH_CHANGED_EVENT, syncAuthState);
      window.removeEventListener('storage', syncAuthState);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isReady,
      isAuthenticated: !!token && !!user,
      token,
      user,
    }),
    [isReady, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useCustomerAuth() {
  return useContext(AuthContext);
}
