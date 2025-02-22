"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  isLoading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType') as UserType;

    if (storedUser && storedUserType) {
      setUser(JSON.parse(storedUser));
      setUserType(storedUserType);
    }

    setIsLoading(false);
  }, []);

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
      const type = newUser.tipo.toLowerCase() as UserType;
      setUserType(type);
      localStorage.setItem('userType', type);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      setUserType(null);
    }
  };

  const handleSetUserType = (type: UserType) => {
    setUserType(type);
    if (type) {
      localStorage.setItem('userType', type);
    } else {
      localStorage.removeItem('userType');
    }
  };

  const signOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('alugafacil.token');
    setUser(null);
    setUserType(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        userType, 
        user, 
        setUserType: handleSetUserType, 
        setUser: handleSetUser,
        isLoading,
        signOut
      }}
    >
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