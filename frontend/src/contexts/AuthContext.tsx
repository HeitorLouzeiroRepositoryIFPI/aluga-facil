"use client";

import { createContext, useContext, useState } from 'react';

type UserType = 'admin' | 'cliente' | null;

interface User {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

interface AuthContextType {
  userType: UserType;
  user: User | null;
  setUserType: (type: UserType) => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null);
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ userType, user, setUserType, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}