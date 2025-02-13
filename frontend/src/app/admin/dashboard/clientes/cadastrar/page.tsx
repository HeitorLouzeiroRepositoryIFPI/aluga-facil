"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import CadastrarClienteForm from "./components/CadastrarClienteForm";

export default function CadastrarClientePage() {
  const router = useRouter();
  const { user, userType } = useAuth();

  if (!user || userType !== 'admin') {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Cadastrar Cliente</h1>
      </div>
      <CadastrarClienteForm />
    </div>
  );
}
