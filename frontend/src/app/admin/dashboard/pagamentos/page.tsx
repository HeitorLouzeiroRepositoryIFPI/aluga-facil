'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { PagamentoDTO, PagamentoAgrupado, PagamentosService } from '@/services/pagamentos';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatsCard } from '@/components/stats-card/StatsCard';
import { Button } from '@/components/ui/button';
import { formatarValor } from '@/utils/formatters';
import { useRouter } from 'next/navigation';

export default function PagamentosPage() {
  const router = useRouter();
  const [pagamentosAgrupados, setPagamentosAgrupados] = useState<PagamentoAgrupado[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const carregarPagamentos = useCallback(async () => {
    try {
      const dados = await PagamentosService.listarAgrupados();
      setPagamentosAgrupados(dados);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarPagamentos();
  }, [carregarPagamentos]);

  // Calcula as estatísticas totais
  const estatisticasGerais = useMemo(() => {
    return pagamentosAgrupados.reduce((acc, grupo) => {
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
  }, [pagamentosAgrupados]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Pagamentos</h1>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Pagamentos"
          value={estatisticasGerais.totalPagamentos}
          description={formatarValor(estatisticasGerais.valorTotal)}
        />
        <StatsCard
          title="Pagamentos Pagos"
          value={estatisticasGerais.pagos}
          description={formatarValor(estatisticasGerais.valorPago)}
          className="bg-green-100"
        />
        <StatsCard
          title="Pagamentos Pendentes"
          value={estatisticasGerais.pendentes}
          description={formatarValor(estatisticasGerais.valorPendente)}
          className="bg-yellow-100"
        />
        <StatsCard
          title="Pagamentos Atrasados"
          value={estatisticasGerais.atrasados}
          description={formatarValor(estatisticasGerais.valorAtrasado)}
          className="bg-red-100"
        />
      </div>

      {/* Tabela de Pagamentos Agrupados */}
      <Card className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imóvel</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Pagos</TableHead>
              <TableHead>Pendentes</TableHead>
              <TableHead>Atrasados</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagamentosAgrupados.map((grupo) => (
              <TableRow
                key={grupo.contratoId}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => router.push(`/admin/dashboard/pagamentos/contrato/${grupo.contratoId}`)}
              >
                <TableCell>
                  <div>
                    <div className="font-medium">{grupo.imovel?.nome || 'Sem nome'}</div>
                    <div className="text-sm text-gray-500">{grupo.imovel?.codigo || 'Sem código'}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{grupo.cliente?.nome || 'Sem cliente'}</div>
                    <div className="text-sm text-gray-500">{grupo.cliente?.cpf || ''}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{grupo.totalPagamentos}</div>
                  <div className="text-sm text-gray-500">{formatarValor(grupo.valorTotal)}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-green-600">{grupo.pagos}</div>
                  <div className="text-sm text-gray-500">{formatarValor(grupo.valorPago)}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-yellow-600">{grupo.pendentes}</div>
                  <div className="text-sm text-gray-500">{formatarValor(grupo.valorPendente)}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-red-600">{grupo.atrasados}</div>
                  <div className="text-sm text-gray-500">{formatarValor(grupo.valorAtrasado)}</div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/admin/dashboard/pagamentos/contrato/${grupo.contratoId}`);
                    }}
                  >
                    Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}