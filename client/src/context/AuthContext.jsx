import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

const load = () => {
  try {
    return JSON.parse(localStorage.getItem('elegance_user')) || null;
  } catch (e) {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(load);

  const save = useCallback((u) => {
    if (u) localStorage.setItem('elegance_user', JSON.stringify(u));
    else localStorage.removeItem('elegance_user');
    setUser(u);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    save(data);
    return data;
  };

  const loginWithGoogle = async (credential) => {
    const { data } = await api.post('/auth/google', { credential });
    save(data);
    return data;
  };

  const register = async (form) => {
    const { data } = await api.post('/auth/register', form);
    save(data);
    return data;
  };

  const updateProfile = async (form) => {
    const { data } = await api.put('/auth/profile', form);
    save(data);
    return data;
  };

  const logout = () => save(null);

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, register, updateProfile, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
