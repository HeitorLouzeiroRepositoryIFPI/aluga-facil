'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { FiArrowLeft } from 'react-icons/fi';

import { PagamentosService, PagamentoDTO } from '@/services/pagamentos';
import { ProtectedRoute } from '@/components/protected-route';
import DashboardLayout from '@/app/dashboard/DashboardLayout';
import { DataTable } from '@/components/data-table/DataTable';
import { StatusBadge } from '@/components/status-badge/StatusBadge';
import { StatsCard } from '@/components/stats-card/StatsCard';
import { Button } from '@/components/ui/button';
import { formatarValor } from '@/utils/formatters';

interface PageProps {
  params: {
    id: string;
  };
}

export default function PagamentosContratoPage({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagamentos, setPagamentos] = useState<PagamentoDTO[]>([]);
  const [detalhesContrato, setDetalhesContrato] = useState<{
    imovelNome?: string;
    imovelCodigo?: string;
    clienteNome?: string;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await PagamentosService.listar();
      const pagamentosDoContrato = data.filter(p => p.contratoId === parseInt(params.id));
      
      if (pagamentosDoContrato.length > 0) {
        const primeiro = pagamentosDoContrato[0];
        setDetalhesContrato({
          imovelNome: primeiro.imovel?.nome,
          imovelCodigo: primeiro.imovel?.codigo,
          clienteNome: primeiro.cliente?.nome,
        });
      }
      
      setPagamentos(pagamentosDoContrato);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
      setError('Erro ao carregar os dados');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: pagamentos.length,
    valorTotal: pagamentos.reduce((acc, p) => acc + (Number(p.valor) || 0), 0),
    pagos: pagamentos.filter(p => p.status === 'PAGO').length,
    valorPago: pagamentos.filter(p => p.status === 'PAGO').reduce((acc, p) => acc + (Number(p.valor) || 0), 0),
    pendentes: pagamentos.filter(p => p.status === 'PENDENTE').length,
    valorPendente: pagamentos.filter(p => p.status === 'PENDENTE').reduce((acc, p) => acc + (Number(p.valor) || 0), 0),
    atrasados: pagamentos.filter(p => p.status === 'ATRASADO').length,
    valorAtrasado: pagamentos.filter(p => p.status === 'ATRASADO').reduce((acc, p) => acc + (Number(p.valor) || 0), 0),
  };

  return (
    <ProtectedRoute allowedTypes={['admin']}>
      <DashboardLayout>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="p-2"
                >
                  <FiArrowLeft size={20} />
                </Button>
                <h1 className="text-2xl font-bold">Detalhes do Contrato</h1>
              </div>
              {detalhesContrato && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>Imóvel: {detalhesContrato.imovelNome} ({detalhesContrato.imovelCodigo})</p>
                  <p>Cliente: {detalhesContrato.clienteNome}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              title="Total"
              value={`${stats.total} pagamentos`}
              description={formatarValor(stats.valorTotal)}
            />
            <StatsCard
              title="Pagos"
              value={`${stats.pagos} pagamentos`}
              description={formatarValor(stats.valorPago)}
              color="green"
            />
            <StatsCard
              title="Pendentes"
              value={`${stats.pendentes} pagamentos`}
              description={formatarValor(stats.valorPendente)}
              color="yellow"
            />
            <StatsCard
              title="Atrasados"
              value={`${stats.atrasados} pagamentos`}
              description={formatarValor(stats.valorAtrasado)}
              color="red"
            />
          </div>

          <DataTable
            data={pagamentos}
            columns={[
              {
                header: "Data",
                accessor: (row) => format(new Date(row.dataPagamento), 'dd/MM/yyyy')
              },
              {
                header: "Valor",
                accessor: (row) => formatarValor(row.valor)
              },
              {
                header: "Forma de Pagamento",
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
                    type="pagamento"
                  />
                )
              },
              {
                header: "Observações",
                accessor: (row) => row.observacoes || '-'
              }
            ]}
            currentPage={1}
            itemsPerPage={10}
            loading={loading}
            error={error}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
