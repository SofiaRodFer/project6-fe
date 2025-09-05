// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiService from "../api/ApiService.ts";
import type { AuthRequest } from '../types.ts';

// Tipos de dados
interface User {
  username: string;
  roles: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (data: AuthRequest) => Promise<void>;
  logout: () => void;
}

// Criar o Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// O Provedor do Contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Tenta carregar o token do localStorage ao iniciar a app
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: { sub: string; roles: string[] } = jwtDecode(token);
        setUser({ username: decodedToken.sub, roles: decodedToken.roles });
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const login = async (data: AuthRequest) => {
    const response = await apiService.post('/auth/login', data);
    const { token } = response.data;
    localStorage.setItem('authToken', token);
    const decodedToken: { sub: string; roles: string[] } = jwtDecode(token);
    setUser({ username: decodedToken.sub, roles: decodedToken.roles });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto facilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};