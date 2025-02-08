"use client";

import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

interface RoleContentProps {
  roles: ('admin' | 'cliente')[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleContent({ roles, children, fallback }: RoleContentProps) {
  const { userType } = useAuth();

  if (!userType || !roles.includes(userType)) {
    return fallback || null;
  }

  return <>{children}</>;
}
