import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, userApi } from '../api/services.js';
import {
  getErrorMessage,
  isBackendUnavailable,
  markBackendUnavailable,
  OFFLINE_STATUS_EVENT,
} from '../api/client.js';
import { readJson, removeKey, writeJson } from '../utils/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJson('user', null));
  const [token, setToken] = useState(() => readJson('token', null));
  const [loading, setLoading] = useState(Boolean(readJson('token', null)));
  const [error, setError] = useState('');

  const persist = useCallback((nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    if (nextToken) writeJson('token', nextToken);
    else removeKey('token');
    if (nextUser) writeJson('user', nextUser);
    else removeKey('user');
  }, []);

  useEffect(() => {
    let active = true;
    async function hydrate() {
      if (!token) {
        setLoading(false);
        return;
      }
      if (token.startsWith('demo-')) {
        markBackendUnavailable();
        setLoading(false);
        return;
      }
      try {
        const res = await authApi.me();
        if (active) {
          if (res.data.user) persist(token, res.data.user);
          else persist(null, null);
        }
      } catch (err) {
        if (!active) return;
        if (isBackendUnavailable(err)) {
          markBackendUnavailable();
          return;
        }
        if (err.response?.status === 401) {
          persist(null, null);
          return;
        }
        setError(getErrorMessage(err, 'Could not refresh your session'));
      } finally {
        if (active) setLoading(false);
      }
    }
    hydrate();
    return () => {
      active = false;
    };
  }, [token, persist]);

  useEffect(() => {
    if (!token || token.startsWith('demo-')) return undefined;

    const refreshSession = async (event) => {
      if (event.detail?.isOffline !== false) return;
      try {
        const res = await authApi.me();
        if (active) {
          if (res.data.user) persist(token, res.data.user);
          else persist(null, null);
        }
      } catch (err) {
        if (!active) return;
        if (isBackendUnavailable(err)) {
          markBackendUnavailable();
        } else if (err.response?.status === 401) {
          persist(null, null);
        } else {
          setError(getErrorMessage(err, 'Could not refresh your session'));
        }
      }
    };

    let active = true;
    window.addEventListener(OFFLINE_STATUS_EVENT, refreshSession);
    return () => {
      active = false;
      window.removeEventListener(OFFLINE_STATUS_EVENT, refreshSession);
    };
  }, [token, persist]);

  const login = async (email, password) => {
    setError('');
    try {
      const res = await authApi.login({ email, password });
      persist(res.data.token, res.data.user);
      return res.data.user;
    } catch (err) {
      const message = getErrorMessage(err, 'Login failed');
      setError(message);
      throw err;
    }
  };

  const register = async (payload) => {
    setError('');
    try {
      const res = await authApi.register(payload);
      persist(res.data.token, res.data.user);
      return res.data.user;
    } catch (err) {
      const message = getErrorMessage(err, 'Registration failed');
      setError(message);
      throw err;
    }
  };

  const updateProfile = async (payload) => {
    const res = await userApi.updateMe(payload);
    const next = res.data?.user || res.data;
    persist(token, next);
    return next;
  };

  const logout = () => {
    persist(null, null);
    setError('');
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      setError,
      isAuthenticated: Boolean(user && token),
      isFarmer: user?.role === 'farmer',
      isBuyer: user?.role === 'vendor',
      isAdmin: user?.role === 'admin' || user?.role === 'extension_officer',
      login,
      register,
      updateProfile,
      logout,
    }),
    [user, token, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
