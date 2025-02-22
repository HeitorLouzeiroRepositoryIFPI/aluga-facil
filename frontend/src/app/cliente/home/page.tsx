"use client";

import { ProtectedRoute } from "@/components/protected-route";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useClienteDashboardData } from "@/hooks/use-cliente-dashboard-data";
import { formatCurrency } from "@/lib/utils";
import { Loader2, Home, Calendar, MapPin } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";
import { useRouter } from "next/navigation";

export default function ClienteHome() {
  const { data, isLoading, error, refetch } = useClienteDashboardData();
  const [loadingPayment, setLoadingPayment] = useState(false);
  const router = useRouter();

  const formatarData = (dataString: string | undefined) => {
    if (!dataString) return 'Data não disponível';
    
    try {
      const data = parseISO(dataString); // dataString no formato YYYY-MM-DD
      return format(data, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Erro ao formatar data:', dataString, error);
      return 'Data inválida';
    }
  };

  const handlePagamento = async (pagamentoId: number) => {
    try {
      setLoadingPayment(true);
      await api.post(`/pagamentos/${pagamentoId}/pagar`);
      await refetch();
      toast.success("Pagamento realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoadingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedTypes={['cliente']}>
        <DashboardLayout>
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allowedTypes={['cliente']}>
        <DashboardLayout>
          <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <h2 className="text-xl font-semibold">Erro ao carregar dados</h2>
            <p className="text-muted-foreground">
              Não foi possível carregar os dados do seu dashboard.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Tentar novamente
            </Button>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedTypes={['cliente']}>
      <DashboardLayout>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Aluguéis Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{data?.alugueis.total || 0}</p>
              <p className="text-sm text-muted-foreground">
                Imóveis alugados atualmente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pagamentos Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-600">
                {formatCurrency(data?.pagamentos.pendentes.valor || 0)}
              </p>
              <p className="text-sm text-muted-foreground">
                {data?.pagamentos.pendentes.quantidade || 0} pagamentos pendentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pagamentos Atrasados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(data?.pagamentos.atrasados.valor || 0)}
              </p>
              <p className="text-sm text-muted-foreground">
                {data?.pagamentos.atrasados.quantidade || 0} pagamentos atrasados
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Meus Imóveis Alugados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data?.alugueis.ativos.map((aluguel) => (
                <div key={aluguel.id} className="flex flex-col gap-4 p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-medium">{aluguel.imovel.nome}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{aluguel.imovel.endereco}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-muted-foreground" />
                      <span>Tipo: {aluguel.imovel.tipo}</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between gap-4 pt-4 border-t">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatarData(aluguel.dataInicio)} até {formatarData(aluguel.dataFim)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Contrato: {aluguel.duracaoMeses} meses
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-medium">
                        {formatCurrency(aluguel.valorMensal)}
                      </p>
                      <p className="text-sm text-muted-foreground">por mês</p>
                    </div>
                  </div>

                  {aluguel.observacoes && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>Observações: {aluguel.observacoes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-2 justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/cliente/contratos/${aluguel.id}`)}
                    >
                      Ver Contrato
                    </Button>
                  </div>
                </div>
              ))}

              {!data?.alugueis.ativos.length && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Você não possui imóveis alugados no momento.
                  </p>
                  <Button className="mt-4" variant="outline">
                    Explorar Imóveis Disponíveis
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
