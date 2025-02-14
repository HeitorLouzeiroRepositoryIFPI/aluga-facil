'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { PagamentoDTO, PagamentoAgrupado, PagamentosService } from '@/services/pagamentos';
import { FiPlus, FiRefreshCw } from 'react-icons/fi';
import { ProtectedRoute } from "@/components/protected-route";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";
import { DataTable } from "@/components/data-table/DataTable";
import { StatsCard } from '@/components/stats-card/StatsCard';
import { SearchFilterBar } from "@/components/search-filter/SearchFilterBar";
import { Button } from '@/components/ui/button';
import { formatarValor } from '@/utils/formatters';

export default function PagamentosPage() {
  const router = useRouter();
  const [pagamentosAgrupados, setPagamentosAgrupados] = useState<PagamentoAgrupado[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [isLoading, setIsLoading] = useState(true);

  const carregarPagamentos = useCallback(async () => {
    try {
      setIsLoading(true);
      const dados = await PagamentosService.listarAgrupados();
      setPagamentosAgrupados(dados);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
      toast.error('Erro ao carregar pagamentos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarPagamentos();
  }, [carregarPagamentos]);

  // Filtra os pagamentos baseado na busca
  const pagamentosFiltrados = useMemo(() => {
    return pagamentosAgrupados.filter(grupo => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === "" ||
        grupo.imovel?.nome?.toLowerCase().includes(searchLower) ||
        grupo.imovel?.codigo?.toLowerCase().includes(searchLower) ||
        grupo.cliente?.nome?.toLowerCase().includes(searchLower) ||
        grupo.cliente?.cpf?.toLowerCase().includes(searchLower);

      return matchesSearch;
    });
  }, [pagamentosAgrupados, searchTerm]);

  // Calcula as estatísticas totais
  const estatisticasGerais = useMemo(() => {
    return pagamentosFiltrados.reduce((acc, grupo) => {
      acc.totalPagamentos += grupo.totalPagamentos;
      acc.valorTotal += grupo.valorTotal;
      acc.pagos += grupo.pagos;
      acc.valorPago += grupo.valorPago;
      acc.pendentes += grupo.pendentes;
      acc.valorPendente += grupo.valorPendente;
      acc.atrasados += grupo.atrasados;
      acc.valorAtrasado += grupo.valorAtrasado;
      return acc;
    }, {
      totalPagamentos: 0,
      valorTotal: 0,
      pagos: 0,
      valorPago: 0,
      pendentes: 0,
      valorPendente: 0,
      atrasados: 0,
      valorAtrasado: 0
    });
  }, [pagamentosFiltrados]);

  return (
    <ProtectedRoute allowedTypes={['admin', 'user']}>
      <DashboardLayout>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Pagamentos</h1>
            <div className="flex gap-2">
              <Button onClick={carregarPagamentos}>
                <FiRefreshCw className="mr-2" />
                Atualizar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              title="Total de Pagamentos"
              value={estatisticasGerais.totalPagamentos}
              description={formatarValor(estatisticasGerais.valorTotal)}
              color="blue"
            />
            <StatsCard
              title="Pagamentos Pagos"
              value={estatisticasGerais.pagos}
              description={formatarValor(estatisticasGerais.valorPago)}
              color="green"
            />
            <StatsCard
              title="Pagamentos Pendentes"
              value={estatisticasGerais.pendentes}
              description={formatarValor(estatisticasGerais.valorPendente)}
              color="yellow"
            />
            <StatsCard
              title="Pagamentos Atrasados"
              value={estatisticasGerais.atrasados}
              description={formatarValor(estatisticasGerais.valorAtrasado)}
              color="red"
            />
          </div>

          <SearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <span className="text-gray-500">Carregando...</span>
            </div>
          ) : (
            <DataTable
              data={pagamentosFiltrados}
              columns={[
                {
                  header: "Imóvel",
                  accessor: (row) => (
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{row.imovel?.nome || 'Sem nome'}</div>
                      <div className="text-sm text-gray-500">{row.imovel?.codigo || 'Sem código'}</div>
                    </div>
                  )
                },
                {
                  header: "Cliente",
                  accessor: (row) => (
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{row.cliente?.nome || 'Sem cliente'}</div>
                      <div className="text-sm text-gray-500">{row.cliente?.cpf || ''}</div>
                    </div>
                  )
                },
                {
                  header: "Total",
                  accessor: (row) => (
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{row.totalPagamentos}</div>
                      <div className="text-sm text-gray-500">{formatarValor(row.valorTotal)}</div>
                    </div>
                  )
                },
                {
                  header: "Pagos",
                  accessor: (row) => (
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-green-600">{row.pagos}</div>
                      <div className="text-sm text-gray-500">{formatarValor(row.valorPago)}</div>
                    </div>
                  )
                },
                {
                  header: "Pendentes",
                  accessor: (row) => (
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-yellow-600">{row.pendentes}</div>
                      <div className="text-sm text-gray-500">{formatarValor(row.valorPendente)}</div>
                    </div>
                  )
                },
                {
                  header: "Atrasados",
                  accessor: (row) => (
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-red-600">{row.atrasados}</div>
                      <div className="text-sm text-gray-500">{formatarValor(row.valorAtrasado)}</div>
                    </div>
                  )
                },
                {
                  header: "Ações",
                  accessor: (row) => (
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/dashboard/pagamentos/contrato/${row.contratoId}`);
                        }}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  )
                }
              ]}
              onRowClick={(row) => router.push(`/admin/dashboard/pagamentos/contrato/${row.contratoId}`)}
              rowClassName="cursor-pointer hover:bg-gray-50"
            />
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}