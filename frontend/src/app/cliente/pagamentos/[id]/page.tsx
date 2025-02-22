"use client";

import { ProtectedRoute } from "@/components/protected-route";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { Loader2, AlertCircle, ArrowLeft, CreditCard, Landmark, QrCode } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import { toast } from "sonner";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Pagamento {
  id: number;
  valor: number;
  dataPagamento?: string;
  status: string;
  aluguel: {
    id: number;
    imovel: {
      nome: string;
      endereco: string;
    };
  };
}

type MetodoPagamento = 'PIX' | 'CARTAO' | 'BOLETO';

export default function PagamentoPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pagamentoId = params.id;
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<MetodoPagamento>('PIX');

  const { data: pagamento, isLoading, error } = useQuery<Pagamento>({
    queryKey: ["pagamento", pagamentoId],
    queryFn: async () => {
      const response = await api.get(`/pagamentos/${pagamentoId}`);
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

  const handlePagamento = async () => {
    if (!selectedMethod) {
      toast.error("Selecione um método de pagamento");
      return;
    }

    try {
      setLoadingPayment(true);
      await api.post(`/pagamentos/${pagamentoId}/pagar`, {
        metodo: selectedMethod
      });
      
      // Invalidar os caches
      await queryClient.invalidateQueries({ queryKey: ["pagamento", pagamentoId] });
      await queryClient.invalidateQueries({ queryKey: ["contrato", pagamento?.aluguel?.id] });
      
      toast.success("Pagamento realizado com sucesso!");
      router.push(`/cliente/contratos/${pagamento?.aluguel?.id}`);
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
            <h2 className="text-xl font-semibold">Erro ao carregar pagamento</h2>
            <p className="text-muted-foreground">
              Não foi possível carregar os dados do pagamento.
            </p>
            <Button onClick={() => router.back()} variant="outline">
              Voltar
            </Button>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!pagamento) {
    return (
      <ProtectedRoute allowedTypes={['cliente']}>
        <DashboardLayout>
          <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4">
            <AlertCircle className="w-12 h-12 text-yellow-500" />
            <h2 className="text-xl font-semibold">Pagamento não encontrado</h2>
            <p className="text-muted-foreground">
              O pagamento solicitado não foi encontrado.
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
        <div className="space-y-4 max-w-2xl mx-auto">
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
              <CardTitle>Realizar Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium">{pagamento.aluguel.imovel.nome}</h3>
                <p className="text-muted-foreground">{pagamento.aluguel.imovel.endereco}</p>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">Valor a Pagar</p>
                <p className="text-3xl font-bold">{formatCurrency(pagamento.valor)}</p>
              </div>

              <div className="pt-6 border-t">
                <h4 className="text-lg font-medium mb-4">Método de Pagamento</h4>
                <RadioGroup 
                  value={selectedMethod} 
                  onValueChange={(value) => setSelectedMethod(value as MetodoPagamento)}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PIX" id="pix" />
                    <Label htmlFor="pix" className="flex items-center gap-2">
                      <QrCode className="w-4 h-4" />
                      PIX
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="CARTAO" id="CARTAO" />
                    <Label htmlFor="CARTAO" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Cartão de Crédito
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="BOLETO" id="BOLETO" />
                    <Label htmlFor="BOLETO" className="flex items-center gap-2">
                      <Landmark className="w-4 h-4" />
                      Boleto Bancário
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button 
                className="w-full mt-6" 
                onClick={handlePagamento}
                disabled={loadingPayment}
              >
                {loadingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Confirmar Pagamento'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
