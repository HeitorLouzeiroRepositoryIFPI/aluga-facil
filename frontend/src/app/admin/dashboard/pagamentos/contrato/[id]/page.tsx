'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';

import { PagamentosService, PagamentoDTO } from '@/services/pagamentos';
import { ProtectedRoute } from '@/components/protected-route';
import DashboardLayout from '@/app/dashboard/DashboardLayout';
import { DataTable } from '@/components/data-table/DataTable';
import { StatusBadge } from '@/components/status-badge/StatusBadge';
import { StatsCard } from '@/components/stats-card/StatsCard';
import { Button } from '@/components/ui/button';
import { formatarValor } from '@/utils/formatters';

const STATUS_MAP = {
  PENDENTE: { label: 'Pendente', color: 'warning' },
  PAGO: { label: 'Pago', color: 'success' },
  ATRASADO: { label: 'Atrasado', color: 'danger' },
};

export default function PagamentosContratoPage() {
  const router = useRouter();
  const params = useParams();
  const contratoId = params?.id ? parseInt(params.id as string) : null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagamentos, setPagamentos] = useState<PagamentoDTO[]>([]);
  const [detalhesContrato, setDetalhesContrato] = useState<{
    imovelNome?: string;
    imovelCodigo?: string;
    clienteNome?: string;
  } | null>(null);

  useEffect(() => {
    if (contratoId) {
      loadData();
    }
  }, [contratoId]);

  const loadData = async () => {
    if (!contratoId) return;

    try {
      setLoading(true);
      const data = await PagamentosService.buscarPorContrato(contratoId);
      
      if (data.length > 0) {
        const primeiro = data[0];
        setDetalhesContrato({
          imovelNome: primeiro.imovel?.nome,
          imovelCodigo: primeiro.imovel?.codigo,
          clienteNome: primeiro.cliente?.nome,
        });
      }
      
      setPagamentos(data);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
      setError('Erro ao carregar os dados do contrato');
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

  if (loading) {
    return (
      <ProtectedRoute allowedTypes={['admin']}>
        <DashboardLayout>
          <div className="flex justify-center items-center min-h-screen">
            <span className="text-gray-500">Carregando...</span>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allowedTypes={['admin']}>
        <DashboardLayout>
          <div className="flex flex-col items-center gap-4">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => router.back()}>Voltar</Button>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

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
            <Button onClick={() => router.push(`/admin/dashboard/pagamentos/cadastrar?contratoId=${contratoId}`)}>
              <FiPlus className="mr-2" />
              Novo Pagamento
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              title="Total"
              value={stats.total}
              description={formatarValor(stats.valorTotal)}
              color="blue"
            />
            <StatsCard
              title="Pagos"
              value={stats.pagos}
              description={formatarValor(stats.valorPago)}
              color="green"
            />
            <StatsCard
              title="Pendentes"
              value={stats.pendentes}
              description={formatarValor(stats.valorPendente)}
              color="yellow"
            />
            <StatsCard
              title="Atrasados"
              value={stats.atrasados}
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
                accessor: (row) => row.formaPagamento || '-'
              },
              {
                header: "Status",
                accessor: (row) => (
                  <StatusBadge 
                    status={row.status} 
                    statusMap={STATUS_MAP}
                  />
                )
              },
              {
                header: "Observações",
                accessor: (row) => row.observacoes || '-'
              }
            ]}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
