"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { use } from "react";
import EditarClienteForm from "./components/EditarClienteForm";

interface EditarClientePageProps {
  params: {
    id: string;
  };
}

export default function EditarClientePage({ params }: EditarClientePageProps) {
  const router = useRouter();
  const { user, userType } = useAuth();
  const { id } = use(params);

  if (!user || userType !== 'admin') {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Editar Cliente</h1>
      <EditarClienteForm id={parseInt(id)} />
    </div>
  );
}
