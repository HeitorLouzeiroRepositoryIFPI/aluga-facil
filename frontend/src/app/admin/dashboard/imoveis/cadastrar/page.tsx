import CadastrarImovelForm from "./components/CadastrarImovelForm";
import DashboardLayout from "@/app/dashboard/DashboardLayout";

export default function CadastrarImovelPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Cadastrar Novo Imóvel</h1>
        <CadastrarImovelForm />
      </div>
    </DashboardLayout>
  );
}
