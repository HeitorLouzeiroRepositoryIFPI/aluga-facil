"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FiPlus, FiRefreshCw } from 'react-icons/fi';
import { ProtectedRoute } from "@/components/protected-route";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { ClientesService, ClienteDTO } from "@/services/clientes";
import { formatarCPF, formatarTelefone } from "@/lib/formatters";
import { useDataTableState } from "@/hooks/useDataTableState";
import { DeleteModal } from "@/components/delete-modal/DeleteModal";
import { calculateClienteStats } from "@/utils/stats";
import { DataTable } from "@/components/data-table/DataTable";
import { StatusBadge } from "@/components/status-badge/StatusBadge";
import { StatsCard } from "@/components/stats-card/StatsCard";
import { SearchFilterBar } from "@/components/search-filter/SearchFilterBar";
import { ActionButtons } from "@/components/action-buttons/ActionButtons";
import { Button } from "@/components/ui/button";

export default function ClientesPage() {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<ClienteDTO | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    inativos: 0,
    bloqueados: 0
  });

  const {
    items: clientes,
    filteredItems: filteredClientes,
    loading,
    error,
    searchTerm,
    statusFilter,
    currentPage,
    setSearchTerm,
    setStatusFilter,
    setCurrentPage,
    refresh
  } = useDataTableState<ClienteDTO>({
    fetchItems: ClientesService.listar,
    filterItems: (items, search, status) => {
      return items.filter(cliente => {
        const searchLower = search.toLowerCase();
        const matchesSearch = search === "" ||
          cliente.nome.toLowerCase().includes(searchLower) ||
          cliente.cpf.toLowerCase().includes(searchLower) ||
          cliente.telefone.toLowerCase().includes(searchLower) ||
          cliente.email?.toLowerCase().includes(searchLower);
        
        const matchesStatus = status === "TODOS" || cliente.status === status;
        
        return matchesSearch && matchesStatus;
      });
    }
  });

  useEffect(() => {
    if (clientes.length > 0) {
      setStats(calculateClienteStats(clientes));
    }
  }, [clientes]);

  const handleAlterarStatus = async (cliente: ClienteDTO, novoStatus: string) => {
    try {
      await ClientesService.alterarStatus(cliente.id!, novoStatus);
      refresh();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status do cliente');
    }
  };

  const handleDelete = (id: number) => {
    const cliente = clientes.find(c => c.id === id);
    if (cliente) {
      setClienteSelecionado(cliente);
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!clienteSelecionado) return;

    try {
      await ClientesService.excluir(clienteSelecionado.id!);
      toast.success('Cliente excluído com sucesso!');
      refresh();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast.error('Erro ao excluir cliente');
    } finally {
      setDeleteModalOpen(false);
      setClienteSelecionado(null);
    }
  };

  return (
    <ProtectedRoute allowedTypes={['admin']}>
      <DashboardLayout>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Clientes</h1>
            <div className="flex gap-2">
              <Button onClick={refresh}>
                <FiRefreshCw className="mr-2" />
                Atualizar
              </Button>
              <Button onClick={() => router.push('/admin/dashboard/clientes/cadastrar')}>
                <FiPlus className="mr-2" />
                Cadastrar Cliente
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              title="Total de Clientes"
              value={stats.total.toString()}
              description="Clientes cadastrados"
            />
            <StatsCard
              title="Clientes Ativos"
              value={stats.ativos.toString()}
              description="Em dia com pagamentos"
              color="green"
            />
            <StatsCard
              title="Clientes Inativos"
              value={stats.inativos.toString()}
              description="Sem contratos ativos"
              color="yellow"
            />
            <StatsCard
              title="Clientes Bloqueados"
              value={stats.bloqueados.toString()}
              description="Com restrições"
              color="red"
            />
          </div>

          <SearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          <DataTable
            data={filteredClientes}
            columns={[
              { header: "Nome", accessor: "nome" },
              { header: "CPF", accessor: (row) => formatarCPF(row.cpf) },
              { header: "Telefone", accessor: (row) => formatarTelefone(row.telefone) },
              {
                header: "Status",
                accessor: (row) => (
                  <StatusBadge
                    status={row.status}
                    onStatusChange={(newStatus) => handleAlterarStatus(row, newStatus)}
                  />
                )
              },
              {
                header: "Ações",
                accessor: (row) => (
                  <ActionButtons
                    onEdit={() => router.push(`/admin/dashboard/clientes/editar/${row.id}`)}
                    onDelete={() => handleDelete(row.id!)}
                  />
                )
              }
            ]}
            currentPage={currentPage}
            itemsPerPage={10}
            onPageChange={setCurrentPage}
            loading={loading}
            error={error}
          />

          <DeleteModal
            isOpen={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setClienteSelecionado(null);
            }}
            onConfirm={confirmDelete}
            title="Confirmar exclusão do cliente"
            description={`Tem certeza que deseja excluir o cliente ${clienteSelecionado?.nome}? Esta ação não pode ser desfeita.`}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
