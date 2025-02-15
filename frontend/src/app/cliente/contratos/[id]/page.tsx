"use client";

import { ProtectedRoute } from "@/components/protected-route";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { Loader2, AlertCircle, Calendar, MapPin, Home, ArrowLeft } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import { toast } from "sonner";

interface Contrato {
  id: number;
  dataInicio: string;
  dataFim: string;
  valorMensal: number;
  taxaAdministracao: number;
  valorDeposito: number;
  diaPagamento: number;
  observacoes: string;
  status: string;
  imovel: {
    id: number;
    nome: string;
    tipo: string;
    codigo: string;
    endereco: string;
    valorMensal: number;
    administrador: {
      id: number;
      nome: string;
      email: string;
    };
  };
  pagamentos: Array<{
    id: number;
    valor: number;
    dataVencimento: string;
    dataPagamento?: string;
    status: string;
  }>;
}

export default function ContratoPage() {
  const params = useParams();
  const router = useRouter();
  const contratoId = params.id;

  const { data: contrato, isLoading, error } = useQuery<Contrato>({
    queryKey: ["contrato", contratoId],
    queryFn: async () => {
      const response = await api.get(`/alugueis/${contratoId}`);
      return response.data;
    },
  });

  const formatarData = (dataString: string | undefined) => {
    if (!dataString) return 'Data não disponível';
    
    try {
      const data = parseISO(dataString);
      return format(data, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Erro ao formatar data:', dataString, error);
      return 'Data inválida';
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
            <h2 className="text-xl font-semibold">Erro ao carregar contrato</h2>
            <p className="text-muted-foreground">
              Não foi possível carregar os dados do contrato.
            </p>
            <Button onClick={() => router.back()} variant="outline">
              Voltar
            </Button>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!contrato) {
    return (
      <ProtectedRoute allowedTypes={['cliente']}>
        <DashboardLayout>
          <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4">
            <AlertCircle className="w-12 h-12 text-yellow-500" />
            <h2 className="text-xl font-semibold">Contrato não encontrado</h2>
            <p className="text-muted-foreground">
              O contrato solicitado não foi encontrado.
            </p>
            <Button onClick={() => router.back()} variant="outline">
              Voltar
            </Button>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedTypes={['cliente']}>
      <DashboardLayout>
        <div className="space-y-4">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Contrato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium">{contrato.imovel.nome}</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{contrato.imovel.endereco}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-muted-foreground" />
                  <span>Tipo: {contrato.imovel.tipo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Dia Pagto:</span>
                  <span>{contrato.diaPagamento}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Taxa Adm:</span>
                  <span>{formatCurrency(contrato.taxaAdministracao)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Valor Mensal:</span>
                  <span>{formatCurrency(contrato.valorMensal)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {formatarData(contrato.dataInicio)} até {formatarData(contrato.dataFim)}
                  </span>
                </div>
                {contrato.observacoes && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Observações: {contrato.observacoes}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-lg font-medium mb-4">Pagamentos</h4>
                <div className="space-y-4">
                  {contrato.pagamentos.map((pagamento) => (
                    <div 
                      key={pagamento.id} 
                      className="flex flex-col md:flex-row justify-between gap-2 p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{formatCurrency(pagamento.valor)}</p>
                        <p className="text-sm text-muted-foreground">
                          Vencimento: {formatarData(pagamento.dataVencimento)}
                        </p>
                        {pagamento.dataPagamento && (
                          <p className="text-sm text-muted-foreground">
                            Conta/Mês: {formatarData(pagamento.dataPagamento)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          pagamento.status === 'PAGO' 
                            ? 'bg-green-100 text-green-800'
                            : pagamento.status === 'PENDENTE'
                            ? 'bg-yellow-100 text-yellow-800'
                            : pagamento.status === 'ATRASADO'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {pagamento.status}
                        </span>
                        {(pagamento.status === 'PENDENTE' || pagamento.status === 'ATRASADO') && (
                          <Button
                            size="sm"
                            onClick={() => router.push(`/cliente/pagamentos/${pagamento.id}`)}
                          >
                            Pagar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
