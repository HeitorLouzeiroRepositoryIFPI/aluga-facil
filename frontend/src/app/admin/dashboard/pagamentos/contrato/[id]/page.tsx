'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import { toast } from 'sonner';

import { PagamentosService, PagamentoDTO } from '@/services/pagamentos';
import { ProtectedRoute } from '@/components/protected-route';
import DashboardLayout from '@/app/dashboard/DashboardLayout';
import { DataTable } from '@/components/data-table/DataTable';
import { StatusBadge } from '@/components/status-badge/StatusBadge';
import { StatsCard } from '@/components/stats-card/StatsCard';
import { Button } from '@/components/ui/button';
import { formatarValor } from '@/utils/formatters';
import { PaymentMethodSelect, PaymentMethod, PAYMENT_METHODS } from '@/components/payment-method-select/PaymentMethodSelect';

const STATUS_MAP = {
  PENDENTE: { label: 'Pendente', color: 'warning' },
  PAGO: { label: 'Pago', color: 'success' },
  ATRASADO: { label: 'Atrasado', color: 'danger' },
  CANCELADO: { label: 'Cancelado', color: 'default' },
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

  const [stats, setStats] = useState({
    total: 0,
    valorTotal: 0,
    pagos: 0,
    valorPago: 0,
    pendentes: 0,
    valorPendente: 0,
    atrasados: 0,
    valorAtrasado: 0,
  });

  const calcularEstatisticas = (pagamentos: PagamentoDTO[]) => {
    return {
      total: pagamentos.length,
      valorTotal: pagamentos.reduce((acc, p) => acc + (Number(p.valor) || 0), 0),
      pagos: pagamentos.filter(p => p.status === 'PAGO').length,
      valorPago: pagamentos.filter(p => p.status === 'PAGO').reduce((acc, p) => acc + (Number(p.valor) || 0), 0),
      pendentes: pagamentos.filter(p => p.status === 'PENDENTE').length,
      valorPendente: pagamentos.filter(p => p.status === 'PENDENTE').reduce((acc, p) => acc + (Number(p.valor) || 0), 0),
      atrasados: pagamentos.filter(p => p.status === 'ATRASADO').length,
      valorAtrasado: pagamentos.filter(p => p.status === 'ATRASADO').reduce((acc, p) => acc + (Number(p.valor) || 0), 0),
    };
  };

  useEffect(() => {
    if (contratoId) {
      loadData();
    }
  }, [contratoId]);

  useEffect(() => {
    setStats(calcularEstatisticas(pagamentos));
  }, [pagamentos]);

  const handleUpdatePayment = async (id: number, updates: { formaPagamento?: PaymentMethod; status?: string }) => {
    try {
      if (!id) {
        toast.error('ID do pagamento inválido');
        return;
      }
      
      const pagamentoAtualizado = await PagamentosService.atualizar(id, updates);
      
      // Atualiza o pagamento na lista local
      setPagamentos(pagamentos.map(p => 
        p.id === id ? { ...p, ...updates } : p
      ));

      toast.success('Pagamento atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar pagamento:', error);
      toast.error('Erro ao atualizar pagamento. Verifique o console para mais detalhes.');
      // Se houver erro, recarrega os dados para garantir consistência
      await loadData();
    }
  };

  const handleConfirmPayment = async (pagamentoId: number, method: PaymentMethod) => {
    try {
      console.log('Confirmando pagamento:', { pagamentoId, method });
      
      // Primeiro atualiza a forma de pagamento
      await PagamentosService.alterarFormaPagamento(pagamentoId, method);
      
      // Depois marca como pago
      await PagamentosService.alterarStatus(pagamentoId, 'PAGO');
      
      toast.success('Pagamento confirmado com sucesso!');
      await loadData();
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      toast.error('Erro ao confirmar pagamento');
    }
  };

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
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                accessor: (row) => (
                  <div className="flex flex-col">
                    {row.status === 'PAGO' ? (
                      <div className="text-sm text-gray-900">
                        {row.formaPagamento ? PAYMENT_METHODS[row.formaPagamento as PaymentMethod] || row.formaPagamento : '-'}
                      </div>
                    ) : (
                      <PaymentMethodSelect
                        value={row.formaPagamento as PaymentMethod}
                        onValueChange={(value) => handleUpdatePayment(row.id, { formaPagamento: value })}
                        onConfirmPayment={(method) => handleConfirmPayment(row.id, method)}
                        disabled={row.status === 'PAGO'}
                      />
                    )}
                  </div>
                )
              },
              {
                header: "Status",
                accessor: (row) => (
                  <StatusBadge 
                    status={row.status} 
                    statusMap={STATUS_MAP}
                    onStatusChange={(newStatus) => handleUpdatePayment(row.id, { status: newStatus })}
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
