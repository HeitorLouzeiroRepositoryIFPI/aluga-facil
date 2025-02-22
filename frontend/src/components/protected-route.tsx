"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedTypes: string[];
}

export function ProtectedRoute({ children, allowedTypes }: ProtectedRouteProps) {
  const { userType, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !userType) {
      router.push("/login");
      return;
    }

    if (!isLoading && !allowedTypes.includes(userType!)) {
      // Redireciona para a página correta baseado no tipo de usuário
      if (userType === 'admin') {
        router.push('/admin/dashboard');
      } else if (userType === 'cliente') {
        router.push('/cliente/home');
      }
    }
  }, [userType, allowedTypes, router, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userType || !allowedTypes.includes(userType)) {
    return null;
  }

  return <>{children}</>;
}
