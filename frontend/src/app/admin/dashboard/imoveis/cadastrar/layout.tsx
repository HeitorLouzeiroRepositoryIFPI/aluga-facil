import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastrar Imóvel - AlugaMais",
  description: "Cadastre um novo imóvel no sistema AlugaMais",
};

export default function CadastrarImovelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
