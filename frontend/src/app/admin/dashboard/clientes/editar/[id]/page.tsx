"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import EditarClienteForm from "./components/EditarClienteForm";

interface EditarClientePageProps {
  params: {
    id: string;
  };
}

export default function EditarClientePage({ params }: EditarClientePageProps) {
  const router = useRouter();
  const { user, userType } = useAuth();

  if (!user || userType !== 'admin') {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Editar Cliente</h1>
      </div>
      <EditarClienteForm id={parseInt(params.id)} />
    </div>
  );
}
