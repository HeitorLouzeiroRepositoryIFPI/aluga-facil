"use client";

import { useEffect, useState } from "react";
import { ImoveisService, Imovel } from "@/services/imoveis";
import { FiPlus, FiRefreshCw } from 'react-icons/fi';
import { ProtectedRoute } from "@/components/protected-route";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useDataTableState } from "@/hooks/useDataTableState";
import { DeleteModal } from "@/components/delete-modal/DeleteModal";
import { calculateImovelStats } from "@/utils/stats";
import { DataTable } from "@/components/data-table/DataTable";
import { StatusBadge } from "@/components/status-badge/StatusBadge";
import { StatsCard } from "@/components/stats-card/StatsCard";
import { SearchFilterBar } from "@/components/search-filter/SearchFilterBar";
import { ActionButtons } from "@/components/action-buttons/ActionButtons";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ImoveisPage() {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imovelToDelete, setImovelToDelete] = useState<string | null>(null);
  const [tipoFilter, setTipoFilter] = useState<string>("TODOS");
  const [stats, setStats] = useState({
    total: 0,
    alugados: 0,
    disponiveis: 0,
    valorTotal: 0
  });

  const {
    items: imoveis,
    filteredItems: filteredImoveis,
    loading,
    error,
    searchTerm,
    statusFilter,
    currentPage,
    setSearchTerm,
    setStatusFilter,
    setCurrentPage,
    refresh
  } = useDataTableState<Imovel>({
    fetchItems: ImoveisService.listarTodos,
    filterItems: (items, search, status) => {
      return items.filter(imovel => {
        const searchLower = search.toLowerCase();
        const matchesSearch = search === "" ||
          imovel.nome.toLowerCase().includes(searchLower) ||
          imovel.codigo.toLowerCase().includes(searchLower) ||
          imovel.endereco.toLowerCase().includes(searchLower) ||
          imovel.tipo.toLowerCase().includes(searchLower);
        
        const matchesStatus = status === "TODOS" || imovel.status === status;
        const matchesTipo = tipoFilter === "TODOS" || imovel.tipo === tipoFilter;
        
        return matchesSearch && matchesStatus && matchesTipo;
      });
    }
  });

  useEffect(() => {
    if (imoveis.length > 0) {
      setStats(calculateImovelStats(imoveis));
    }
  }, [imoveis]);

  const handleStatusChange = async (codigo: string, novoStatus: string) => {
    try {
      await ImoveisService.atualizar(codigo, { ...imoveis.find(i => i.codigo === codigo)!, status: novoStatus });
      refresh();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const handleDelete = (codigo: string) => {
    setImovelToDelete(codigo);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!imovelToDelete) return;

    try {
      await ImoveisService.excluir(imovelToDelete);
      toast.success('Imóvel excluído com sucesso!');
      refresh();
    } catch (error) {
      console.error('Erro ao excluir imóvel:', error);
      toast.error('Erro ao excluir imóvel');
    } finally {
      setDeleteModalOpen(false);
      setImovelToDelete(null);
    }
  };

  return (
    <ProtectedRoute allowedTypes={['admin', 'user']}>
      <DashboardLayout>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Imóveis</h1>
            <div className="flex gap-2">
              <Button onClick={refresh}>
                <FiRefreshCw className="mr-2" />
                Atualizar
              </Button>
              <Button onClick={() => router.push('/admin/dashboard/imoveis/cadastrar')}>
                <FiPlus className="mr-2" />
                Cadastrar Imóvel
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title="Total de Imóveis"
              value={stats.total}
              color="blue"
            />
            <StatsCard
              title="Imóveis Alugados"
              value={stats.alugados}
              color="green"
            />
            <StatsCard
              title="Imóveis Disponíveis"
              value={stats.disponiveis}
              color="yellow"
            />
          </div>

          <SearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          <DataTable
            data={filteredImoveis}
            columns={[
              {
                header: "Imóvel",
                accessor: (row) => (
                  <div className="flex items-center space-x-4">
                    {row.fotos && row.fotos.length > 0 && (
                      <div className="flex-shrink-0 w-12 h-12 relative">
                        <Image
                          src={row.fotos[0]}
                          alt={row.nome}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{row.nome}</div>
                      <div className="text-sm text-gray-500">{row.endereco}</div>
                    </div>
                  </div>
                )
              },
              {
                header: "Tipo",
                accessor: (row) => (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                    {row.tipo}
                  </span>
                )
              },
              {
                header: "Status",
                accessor: (row) => (
                  <StatusBadge
                    status={row.status}
                    statusMap={{
                      'DISPONIVEL': { label: 'Disponível', color: 'success' },
                      'ALUGADO': { label: 'Alugado', color: 'info' }
                    }}
                    onStatusChange={(newStatus) => handleStatusChange(row.codigo, newStatus)}
                  />
                )
              },
              {
                header: "Valor Mensal",
                accessor: (row) => `R$ ${row.valorMensal?.toFixed(2)}`
              },
              {
                header: "Ações",
                accessor: (row) => (
                  <ActionButtons
                    onEdit={() => router.push(`/admin/dashboard/imoveis/editar/${row.codigo}`)}
                    onDelete={() => handleDelete(row.codigo)}
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
              setImovelToDelete(null);
            }}
            onConfirm={confirmDelete}
            title="Confirmar exclusão do imóvel"
            description={`Tem certeza que deseja excluir o imóvel ${imovelToDelete}? Esta ação não pode ser desfeita.`}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
