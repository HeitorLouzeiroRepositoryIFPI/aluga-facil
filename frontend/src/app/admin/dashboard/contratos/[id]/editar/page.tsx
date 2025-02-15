"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { use } from 'react';

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

interface EditarContratoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditarContratoPage({ params }: EditarContratoPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const resolvedParams = use(params);

  const [contrato, setContrato] = useState<ContratoDTO | null>(null);

  const {
    items: clientes,
    loading: loadingClientes,
    error: errorClientes
  } = useAsyncList<ClienteDTO>({
    fetchItems: async () => {
      console.log('Buscando clientes...');
      try {
        const result = await ClientesService.listar();
        console.log('Clientes carregados:', result);
        return result;
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        throw error;
      }
    },
    dependencies: []
  });

  const {
    items: imoveis,
    loading: loadingImoveis,
    error: errorImoveis
  } = useAsyncList<Imovel>({
    fetchItems: async () => {
      console.log('Buscando imóveis...');
      try {
        const result = await ImoveisService.listarTodos();
        console.log('Imóveis carregados:', result);
        return result;
      } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
        throw error;
      }
    },
    dependencies: []
  });

  const [formData, setFormData] = useState<Partial<ContratoDTO>>({
    clienteId: undefined,
    imovelId: undefined,
    dataInicio: "",
    dataFim: "",
    valorMensal: 0,
    valorDeposito: 0,
    observacoes: "",
    status: "ATIVO"
  });

  // Primeiro, carregar o contrato
  useEffect(() => {
    const fetchContrato = async () => {
      try {
        const contratoData = await ContratosService.buscarPorId(Number(resolvedParams.id));
        console.log('Contrato carregado:', contratoData);
        setContrato(contratoData);
      } catch (error) {
        console.error('Erro ao buscar contrato:', error);
        toast.error('Erro ao carregar dados do contrato');
        router.push('/admin/dashboard/contratos');
      }
    };

    fetchContrato();
  }, [resolvedParams.id, router]);

  // Depois, atualizar o formulário quando o contrato e as listas estiverem prontos
  useEffect(() => {
    if (contrato && !loadingClientes && !loadingImoveis && clientes.length > 0 && imoveis.length > 0) {
      console.log('Atualizando formulário com dados:', {
        contrato,
        clienteId: contrato.clienteId || contrato.cliente?.id,
        imovelId: contrato.imovelId || contrato.imovel?.id,
        clientes: clientes.length,
        imoveis: imoveis.length
      });

      // Extrair IDs do cliente e imóvel
      const clienteId = contrato.clienteId || contrato.cliente?.id;
      const imovelId = contrato.imovelId || contrato.imovel?.id;

      if (!clienteId) {
        console.error('ID do cliente não encontrado no contrato:', contrato);
        toast.error('Erro: ID do cliente não encontrado no contrato');
        return;
      }

      if (!imovelId) {
        console.error('ID do imóvel não encontrado no contrato:', contrato);
        toast.error('Erro: ID do imóvel não encontrado no contrato');
        return;
      }

      const clienteExiste = clientes.some(c => c.id === clienteId);
      const imovelExiste = imoveis.some(i => i.id === imovelId);

      if (!clienteExiste) {
        console.error(`Cliente ${clienteId} não encontrado na lista de clientes`);
        toast.error('Cliente não encontrado na lista');
      }
      if (!imovelExiste) {
        console.error(`Imóvel ${imovelId} não encontrado na lista de imóveis`);
        toast.error('Imóvel não encontrado na lista');
      }

      // Buscar o imóvel para pegar o valor mensal
      const imovel = imoveis.find(i => i.id === imovelId);
      const valorMensal = imovel ? imovel.valorMensal : contrato.valorMensal;
      const valorDeposito = imovel ? imovel.valorMensal * 2 : contrato.valorDeposito;

      setFormData({
        ...contrato,
        dataInicio: format(new Date(contrato.dataInicio), "yyyy-MM-dd"),
        dataFim: format(new Date(contrato.dataFim), "yyyy-MM-dd"),
        clienteId,
        imovelId,
        valorMensal,
        valorDeposito
      });

      setInitialLoading(false);
    }
  }, [contrato, loadingClientes, loadingImoveis, clientes, imoveis]);

  const handleImovelChange = (imovelId: string) => {
    const imovel = imoveis.find(i => i.id === Number(imovelId));
    if (imovel) {
      console.log('Atualizando valores com o novo imóvel:', imovel);
      setFormData(prev => ({
        ...prev,
        imovelId: Number(imovelId),
        valorMensal: imovel.valorMensal,
        valorDeposito: imovel.valorMensal * 2
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

      // Garantir que o imóvel existe e pegar seus valores
      const imovel = imoveis.find(i => i.id === formData.imovelId);
      if (!imovel) {
        toast.error('Imóvel não encontrado');
        return;
      }

      // Preparar dados para envio
      const dadosAtualizados: Partial<ContratoDTO> = {
        clienteId: formData.clienteId,
        imovelId: formData.imovelId,
        dataInicio: formData.dataInicio,
        dataFim: formData.dataFim,
        valorMensal: imovel.valorMensal,
        valorDeposito: imovel.valorMensal * 2,
        status: formData.status,
        observacoes: formData.observacoes
      };

      console.log('Dados para atualização:', dadosAtualizados);

      // Atualizar contrato
      await ContratosService.atualizar(Number(resolvedParams.id), dadosAtualizados);

      toast.success('Contrato atualizado com sucesso!');
      router.push('/admin/dashboard/contratos');

    } catch (error: any) {
      console.error('Erro ao atualizar contrato:', error);
      toast.error(error.message || 'Erro ao atualizar contrato');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/dashboard/contratos");
  };

  if (initialLoading || loadingClientes || loadingImoveis) {
    return (
      <ProtectedRoute allowedTypes={["admin"]}>
        <DashboardLayout>
          <div className="flex justify-center items-center h-full">
            <p>Carregando...</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (errorClientes || errorImoveis) {
    return (
      <ProtectedRoute allowedTypes={["admin"]}>
        <DashboardLayout>
          <div className="flex justify-center items-center h-full">
            <p>Erro ao carregar dados</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedTypes={["admin"]}>
      <DashboardLayout>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Editar Contrato</h1>
          </div>

          <Card className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cliente */}
                <div className="space-y-2">
                  <Label htmlFor="clienteId">Cliente</Label>
                  <Select 
                    value={formData.clienteId?.toString()}
                    onValueChange={(value) => {
                      console.log('Cliente selecionado:', value);
                      setFormData(prev => ({ ...prev, clienteId: Number(value) }));
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um cliente">
                        {formData.clienteId && clientes.find(c => c.id === formData.clienteId)?.nome}
                      </SelectValue>
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
                    value={formData.imovelId?.toString()}
                    onValueChange={handleImovelChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um imóvel">
                        {formData.imovelId && imoveis.find(i => i.id === formData.imovelId)?.nome}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {imoveis.map(imovel => (
                        <SelectItem key={imovel.id} value={imovel.id.toString()}>
                          {imovel.nome} - {imovel.codigo} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(imovel.valorMensal)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    readOnly
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    O valor mensal é definido pelo imóvel selecionado
                  </p>
                </div>

                {/* Valor do Depósito */}
                <div>
                  <Label htmlFor="valorDeposito">Valor do Depósito (R$)</Label>
                  <Input
                    type="number"
                    id="valorDeposito"
                    name="valorDeposito"
                    value={formData.valorDeposito}
                    readOnly
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    O valor do depósito é 2x o valor mensal
                  </p>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status || 'ATIVO'}
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, status: value }));
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ATIVO">Ativo</SelectItem>
                      <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                      <SelectItem value="CANCELADO">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
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
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
