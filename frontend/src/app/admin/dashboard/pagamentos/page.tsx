"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FiPlus, FiRefreshCw } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { PagamentosService, PagamentoDTO } from "@/services/pagamentos";
import { ProtectedRoute } from "@/components/protected-route";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { useDataTableState } from "@/hooks/useDataTableState";
import { DeleteModal } from "@/components/delete-modal/DeleteModal";
import { calculatePagamentoStats } from "@/utils/stats";
import { DataTable } from "@/components/data-table/DataTable";
import { StatusBadge } from "@/components/status-badge/StatusBadge";
import { StatsCard } from "@/components/stats-card/StatsCard";
import { SearchFilterBar } from "@/components/search-filter/SearchFilterBar";
import { ActionButtons } from "@/components/action-buttons/ActionButtons";
import { Button } from "@/components/ui/button";

export default function PagamentosPage() {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pagamentoToDelete, setPagamentoToDelete] = useState<number | null>(null);
  const [formaPagamentoFilter, setFormaPagamentoFilter] = useState<string>("TODOS");
  const [stats, setStats] = useState({
    total: 0,
    pagos: 0,
    pendentes: 0,
    atrasados: 0,
    valorTotalPago: 0,
    valorTotalPendente: 0,
    valorTotalAtrasado: 0
  });

  const {
    items: pagamentos,
    filteredItems: filteredPagamentos,
    loading,
    error,
    searchTerm,
    statusFilter,
    currentPage,
    setSearchTerm,
    setStatusFilter,
    setCurrentPage,
    refresh
  } = useDataTableState<PagamentoDTO>({
    fetchItems: PagamentosService.listar,
    filterItems: (items, search, status) => {
      return items.filter(pagamento => {
        const searchLower = search.toLowerCase();
        const matchesSearch = search === "" ||
          pagamento.cliente?.nome.toLowerCase().includes(searchLower) ||
          pagamento.cliente?.cpf.toLowerCase().includes(searchLower) ||
          pagamento.imovel?.nome.toLowerCase().includes(searchLower) ||
          pagamento.imovel?.codigo.toLowerCase().includes(searchLower) ||
          pagamento.formaPagamento.toLowerCase().includes(searchLower);
        
        const matchesStatus = status === "TODOS" || pagamento.status === status;
        const matchesFormaPagamento = formaPagamentoFilter === "TODOS" || pagamento.formaPagamento === formaPagamentoFilter;
        
        return matchesSearch && matchesStatus && matchesFormaPagamento;
      });
    }
  });

  useEffect(() => {
    if (pagamentos.length > 0) {
      setStats(calculatePagamentoStats(pagamentos));
    }
  }, [pagamentos]);

  const handleStatusChange = async (id: number, novoStatus: string) => {
    try {
      await PagamentosService.alterarStatus(id, novoStatus);
      refresh();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status do pagamento');
    }
  };

  const handleDelete = (id: number) => {
    setPagamentoToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!pagamentoToDelete) return;

    try {
      await PagamentosService.excluir(pagamentoToDelete);
      toast.success('Pagamento excluído com sucesso!');
      refresh();
    } catch (error) {
      console.error('Erro ao excluir pagamento:', error);
      toast.error('Erro ao excluir pagamento');
    } finally {
      setDeleteModalOpen(false);
      setPagamentoToDelete(null);
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
            <h1 className="text-2xl font-bold">Pagamentos</h1>
            <div className="flex gap-2">
              <Button onClick={refresh}>
                <FiRefreshCw className="mr-2" />
                Atualizar
              </Button>
              <Button onClick={() => router.push('/admin/dashboard/pagamentos/cadastrar')}>
                <FiPlus className="mr-2" />
                Cadastrar Pagamento
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              title="Total de Pagamentos"
              value={stats.total.toString()}
              description="Pagamentos registrados"
            />
            <StatsCard
              title="Pagamentos Pagos"
              value={formatarValor(stats.valorTotalPago)}
              description={`${stats.pagos} pagamentos`}
              color="green"
            />
            <StatsCard
              title="Pagamentos Pendentes"
              value={formatarValor(stats.valorTotalPendente)}
              description={`${stats.pendentes} pagamentos`}
              color="yellow"
            />
            <StatsCard
              title="Pagamentos Atrasados"
              value={formatarValor(stats.valorTotalAtrasado)}
              description={`${stats.atrasados} pagamentos`}
              color="red"
            />
          </div>

          <SearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            extraFilter={{
              label: "Forma de Pagamento",
              value: formaPagamentoFilter,
              onChange: setFormaPagamentoFilter,
              options: [
                { label: "Todos", value: "TODOS" },
                { label: "PIX", value: "PIX" },
                { label: "Cartão", value: "CARTAO" },
                { label: "Boleto", value: "BOLETO" },
                { label: "Dinheiro", value: "DINHEIRO" }
              ]
            }}
          />

          <DataTable
            data={filteredPagamentos}
            columns={[
              {
                header: "Cliente/Imóvel",
                accessor: (row) => (
                  <div>
                    <div className="text-sm font-medium">{row.cliente?.nome}</div>
                    <div className="text-xs text-gray-500">{row.imovel?.nome}</div>
                  </div>
                )
              },
              {
                header: "Valor",
                accessor: (row) => formatarValor(row.valor)
              },
              {
                header: "Data",
                accessor: (row) => format(new Date(row.dataPagamento), 'dd/MM/yyyy', { locale: ptBR })
              },
              {
                header: "Forma",
                accessor: (row) => (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                    {row.formaPagamento}
                  </span>
                )
              },
              {
                header: "Status",
                accessor: (row) => (
                  <StatusBadge
                    status={row.status}
                    onStatusChange={(newStatus) => handleStatusChange(row.id!, newStatus)}
                  />
                )
              },
              {
                header: "Ações",
                accessor: (row) => (
                  <ActionButtons
                    onEdit={() => router.push(`/admin/dashboard/pagamentos/editar/${row.id}`)}
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
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            title="Excluir Pagamento"
            message="Tem certeza que deseja excluir este pagamento? Esta ação não pode ser desfeita."
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}