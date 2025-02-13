"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

import { ContratoDTO, ContratosService } from "@/services/contratos";
import { ClientesService, ClienteDTO } from "@/services/clientes";
import { ImoveisService, Imovel } from "@/services/imoveis";
import { useAsyncList } from "@/hooks/useAsyncList";
import { ProtectedRoute } from "@/components/protected-route";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function NovoContratoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    items: clientes,
    loading: loadingClientes,
    error: errorClientes
  } = useAsyncList<ClienteDTO>({
    fetchItems: () => ClientesService.listar(),
    dependencies: []
  });

  const {
    items: imoveis,
    loading: loadingImoveis,
    error: errorImoveis
  } = useAsyncList<Imovel>({
    fetchItems: async () => {
      console.log('Buscando imóveis disponíveis...');
      const result = await ImoveisService.listarPorStatus('DISPONIVEL');
      console.log('Imóveis disponíveis:', result);
      return result;
    },
    dependencies: []
  });

  useEffect(() => {
    console.log('Clientes:', clientes);
    console.log('Imóveis:', imoveis);
  }, [clientes, imoveis]);

  const [formData, setFormData] = useState<Partial<ContratoDTO>>({
    clienteId: undefined,
    imovelId: undefined,
    dataInicio: format(new Date(), "yyyy-MM-dd"),
    dataFim: format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), "yyyy-MM-dd"),
    valorMensal: 0,
    diaPagamento: 5,
    taxaAdministracao: 10,
    valorDeposito: 0,
    observacoes: ""
  });

  const handleImovelChange = (imovelId: string) => {
    const imovel = imoveis.find(i => i.id === Number(imovelId));
    if (imovel) {
      setFormData(prev => ({
        ...prev,
        imovelId: Number(imovelId),
        valorMensal: imovel.valorMensal
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "valorMensal" || name === "taxaAdministracao" || name === "valorDeposito" || name === "diaPagamento"
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      // Validar campos obrigatórios
      if (!formData.clienteId || !formData.imovelId || !formData.dataInicio || !formData.dataFim) {
        toast.error('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      console.log('Dados do formulário:', formData);

      // Verifica disponibilidade do imóvel
      try {
        const disponivel = await ContratosService.verificarDisponibilidade(
          formData.imovelId,
          formData.dataInicio,
          formData.dataFim
        );

        if (!disponivel) {
          toast.error('Imóvel não está disponível no período selecionado');
          return;
        }
      } catch (error: any) {
        console.error('Erro ao verificar disponibilidade:', error);
        toast.error(error.message || 'Erro ao verificar disponibilidade do imóvel');
        return;
      }

      // Criar contrato
      const contrato = await ContratosService.criar({
        ...formData,
        status: 'ATIVO'
      } as ContratoDTO);

      toast.success('Contrato criado com sucesso!');
      router.push('/admin/dashboard/contratos');

    } catch (error: any) {
      console.error('Erro ao criar contrato:', error);
      toast.error(error.response?.data?.message || 'Erro ao criar contrato');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/dashboard/contratos");
  };

  if (loadingClientes || loadingImoveis) {
    return <div>Carregando...</div>;
  }

  if (errorClientes || errorImoveis) {
    return <div>Erro ao carregar dados</div>;
  }

  return (
    <ProtectedRoute allowedTypes={["admin"]}>
      <DashboardLayout>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Novo Contrato</h1>
          </div>

          <Card className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cliente */}
                <div className="space-y-2">
                  <Label htmlFor="clienteId">Cliente</Label>
                  <Select 
                    value={formData.clienteId?.toString() || ''}
                    onValueChange={(value) => {
                      console.log('Cliente selecionado:', value);
                      setFormData(prev => ({ ...prev, clienteId: Number(value) }));
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map(cliente => (
                        <SelectItem key={cliente.id} value={cliente.id.toString()}>
                          {cliente.nome} - CPF: {cliente.cpf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Imóvel */}
                <div className="space-y-2">
                  <Label htmlFor="imovelId">Imóvel</Label>
                  <Select 
                    value={formData.imovelId?.toString() || ''}
                    onValueChange={handleImovelChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um imóvel" />
                    </SelectTrigger>
                    <SelectContent>
                      {imoveis.map(imovel => (
                        <SelectItem key={imovel.id} value={imovel.id.toString()}>
                          {imovel.nome} - {imovel.codigo} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(imovel.valorMensal)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {loadingImoveis && <p className="text-sm text-muted-foreground">Carregando imóveis...</p>}
                  {errorImoveis && <p className="text-sm text-destructive">Erro ao carregar imóveis</p>}
                  {!loadingImoveis && !errorImoveis && imoveis.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nenhum imóvel disponível</p>
                  )}
                </div>

                {/* Data Início */}
                <div>
                  <Label htmlFor="dataInicio">Data de Início</Label>
                  <Input
                    type="date"
                    id="dataInicio"
                    name="dataInicio"
                    value={formData.dataInicio}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Data Fim */}
                <div>
                  <Label htmlFor="dataFim">Data de Término</Label>
                  <Input
                    type="date"
                    id="dataFim"
                    name="dataFim"
                    value={formData.dataFim}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Valor Mensal */}
                <div>
                  <Label htmlFor="valorMensal">Valor Mensal (R$)</Label>
                  <Input
                    type="number"
                    id="valorMensal"
                    name="valorMensal"
                    value={formData.valorMensal}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    disabled
                  />
                </div>

                {/* Taxa de Administração */}
                <div>
                  <Label htmlFor="taxaAdministracao">Taxa de Administração (%)</Label>
                  <Input
                    type="number"
                    id="taxaAdministracao"
                    name="taxaAdministracao"
                    value={formData.taxaAdministracao}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="100"
                  />
                </div>

                {/* Valor do Depósito */}
                <div>
                  <Label htmlFor="valorDeposito">Valor do Depósito (R$)</Label>
                  <Input
                    type="number"
                    id="valorDeposito"
                    name="valorDeposito"
                    value={formData.valorDeposito}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Dia do Pagamento */}
                <div>
                  <Label htmlFor="diaPagamento">Dia do Pagamento</Label>
                  <Input
                    type="number"
                    id="diaPagamento"
                    name="diaPagamento"
                    value={formData.diaPagamento}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="31"
                  />
                </div>
              </div>

              {/* Observações */}
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Criando..." : "Criar Contrato"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
