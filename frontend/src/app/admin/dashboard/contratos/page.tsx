"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FiPlus, FiRefreshCw } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { ContratosService, ContratoDTO } from "@/services/contratos";
import { ProtectedRoute } from "@/components/protected-route";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { useDataTableState } from "@/hooks/useDataTableState";
import { calculateContratoStats } from "@/utils/stats";
import { DataTable } from "@/components/data-table/DataTable";
import { StatusBadge } from "@/components/status-badge/StatusBadge";
import { StatsCard } from "@/components/stats-card/StatsCard";
import { SearchFilterBar } from "@/components/search-filter/SearchFilterBar";
import { ActionButtons } from "@/components/action-buttons/ActionButtons";
import { Button } from "@/components/ui/button";

export default function ContratosPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    finalizados: 0,
    cancelados: 0,
    valorTotalMensal: 0
  });

  const {
    items: contratos,
    filteredItems: filteredContratos,
    loading,
    error,
    searchTerm,
    statusFilter,
    currentPage,
    setSearchTerm,
    setStatusFilter,
    setCurrentPage,
    refresh
  } = useDataTableState<ContratoDTO>({
    fetchItems: ContratosService.listar,
    filterItems: (items, search, status) => {
      return items.filter(contrato => {
        const searchLower = search.toLowerCase();
        const matchesSearch = search === "" ||
          contrato.cliente?.nome.toLowerCase().includes(searchLower) ||
          contrato.imovel?.nome.toLowerCase().includes(searchLower);
        
        const matchesStatus = status === "TODOS" || contrato.status === status;
        
        return matchesSearch && matchesStatus;
      });
    }
  });

  useEffect(() => {
    if (contratos.length > 0) {
      setStats(calculateContratoStats(contratos));
    }
  }, [contratos]);

  const handleStatusChange = async (id: number, novoStatus: string) => {
    try {
      await ContratosService.alterarStatus(id, novoStatus);
      toast.success('Status alterado com sucesso!');
      refresh();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status do contrato');
    }
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <ProtectedRoute allowedTypes={['admin']}>
      <DashboardLayout>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Contratos</h1>
            <div className="flex gap-2">
              <Button onClick={refresh}>
                <FiRefreshCw className="mr-2" />
                Atualizar
              </Button>
              <Button onClick={() => router.push('/admin/dashboard/contratos/novo')}>
                <FiPlus className="mr-2" />
                Novo Contrato
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <StatsCard
              title="Total de Contratos"
              value={stats.total.toString()}
              description="Contratos registrados"
            />
            <StatsCard
              title="Contratos Ativos"
              value={stats.ativos.toString()}
              description="Em andamento"
              color="green"
            />
            <StatsCard
              title="Contratos Finalizados"
              value={stats.finalizados.toString()}
              description="Concluídos"
              color="blue"
            />
            <StatsCard
              title="Contratos Cancelados"
              value={stats.cancelados.toString()}
              description="Interrompidos"
              color="red"
            />
            <StatsCard
              title="Valor Total Mensal"
              value={formatarValor(stats.valorTotalMensal)}
              description="Receita mensal"
              color="yellow"
            />
          </div>

          <SearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            statusOptions={[
              { value: 'TODOS', label: 'Todos' },
              { value: 'ATIVO', label: 'Ativo' },
              { value: 'FINALIZADO', label: 'Finalizado' },
              { value: 'CANCELADO', label: 'Cancelado' }
            ]}
          />

          <DataTable
            data={filteredContratos}
            columns={[
              {
                header: "Cliente",
                accessor: (row) => (
                  <div className="font-medium">{row.cliente?.nome}</div>
                )
              },
              {
                header: "Imóvel",
                accessor: (row) => (
                  <div className="font-medium">{row.imovel?.nome}</div>
                )
              },
              {
                header: "Data Início",
                accessor: (row) => (
                  <div>{format(new Date(row.dataInicio), 'dd/MM/yyyy', { locale: ptBR })}</div>
                )
              },
              {
                header: "Data Fim",
                accessor: (row) => (
                  <div>{format(new Date(row.dataFim), 'dd/MM/yyyy', { locale: ptBR })}</div>
                )
              },
              {
                header: "Valor Mensal",
                accessor: (row) => (
                  <div className="font-medium">{formatarValor(row.valorMensal)}</div>
                )
              },
              {
                header: "Valor Depósito",
                accessor: (row) => (
                  <div className="font-medium">{formatarValor(row.valorDeposito)}</div>
                )
              },
              {
                header: "Status",
                accessor: (row) => (
                  <StatusBadge
                    status={row.status}
                    statusMap={{
                      'ATIVO': { label: 'Ativo', color: 'success' },
                      'FINALIZADO': { label: 'Finalizado', color: 'default' },
                      'CANCELADO': { label: 'Cancelado', color: 'danger' }
                    }}
                    onStatusChange={(newStatus) => handleStatusChange(row.id!, newStatus)}
                  />
                )
              },
              {
                header: "Ações",
                accessor: (row) => (
                  <ActionButtons
                    onView={() => router.push(`/admin/dashboard/contratos/${row.id}`)}
                    onEdit={() => router.push(`/admin/dashboard/contratos/${row.id}/editar`)}
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
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
