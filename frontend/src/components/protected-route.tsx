"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedTypes: string[];
}

export function ProtectedRoute({ children, allowedTypes }: ProtectedRouteProps) {
  const { userType } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userType) {
      router.push("/login");
      return;
    }

    if (!allowedTypes.includes(userType)) {
      // Redireciona para a página correta baseado no tipo de usuário
      if (userType === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/cliente/home');
      }
    }
  }, [userType, allowedTypes, router]);

  if (!userType || !allowedTypes.includes(userType)) {
    return null;
  }

  return <>{children}</>;
}
