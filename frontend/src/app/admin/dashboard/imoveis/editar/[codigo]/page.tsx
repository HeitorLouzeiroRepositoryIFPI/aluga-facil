"use client";

import { use } from "react";
import EditarImovelForm from "./components/EditarImovelForm";

interface EditarImovelPageProps {
  params: {
    codigo: string;
  };
}

export default function EditarImovelPage({ params }: EditarImovelPageProps) {
  const { codigo } = use(params);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Editar Imóvel</h1>
        <p className="text-muted-foreground">
          Atualize as informações do imóvel
        </p>
      </div>
      <EditarImovelForm codigo={codigo} />
    </div>
  );
}
