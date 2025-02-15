"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "./query-provider";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryProvider>
  );
}
