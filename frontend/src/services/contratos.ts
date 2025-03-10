import api from '@/services/api';
import { ClienteDTO } from "./clientes";
import { Imovel } from "./imoveis";

export interface ContratoDTO {
  id?: number;
  clienteId: number;
  imovelId: number;
  dataInicio: string;
  dataFim: string;
  valorMensal: number;
  valorDeposito: number;
  status: 'ATIVO' | 'FINALIZADO' | 'CANCELADO';
  observacoes?: string;
  cliente?: ClienteDTO;
  imovel?: Imovel;
}

export class ContratosService {
  static async listar(): Promise<ContratoDTO[]> {
    const response = await api.get('/alugueis');
    return response.data;
  }

  static async buscarPorId(id: number): Promise<ContratoDTO> {
    try {
      console.log('Buscando contrato por ID:', id);
      const response = await api.get(`/alugueis/${id}`);
      const contrato = response.data;
      
      // Garantir que os IDs estejam definidos
      if (contrato.cliente && !contrato.clienteId) {
        contrato.clienteId = contrato.cliente.id;
      }
      if (contrato.imovel && !contrato.imovelId) {
        contrato.imovelId = contrato.imovel.id;
      }

      console.log('Contrato recebido da API:', contrato);
      return contrato;
    } catch (error) {
      console.error('Erro ao buscar contrato:', error);
      throw error;
    }
  }

  static async criar(contrato: ContratoDTO): Promise<ContratoDTO> {
    try {
      console.log('Enviando contrato:', contrato);
      const response = await api.post('/alugueis', contrato);
      console.log('Resposta:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar contrato:', error.response?.data || error);
      throw error;
    }
  }

  static async atualizar(id: number, contrato: Partial<ContratoDTO>): Promise<ContratoDTO> {
    try {
      console.log('Atualizando contrato:', { id, dados: contrato });
      const response = await api.patch(`/alugueis/${id}`, contrato);
      console.log('Resposta da atualização:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar contrato:', {
        error,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(error.response?.data?.message || 'Erro ao atualizar contrato');
    }
  }

  static async excluir(id: number): Promise<void> {
    try {
      console.log('Excluindo contrato:', id);
      await api.delete(`/alugueis/${id}`);
      console.log('Contrato excluído com sucesso');
    } catch (error: any) {
      console.error('Erro ao excluir contrato:', error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Erro ao excluir contrato');
    }
  }

  static async alterarStatus(id: number, novoStatus: string): Promise<ContratoDTO> {
    try {
      const response = await api.patch(`/alugueis/${id}/status?status=${novoStatus}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao alterar status:', error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Erro ao alterar status do contrato');
    }
  }

  static async verificarDisponibilidade(imovelId: number, dataInicio: string, dataFim: string): Promise<boolean> {
    try {
      console.log('Verificando disponibilidade:', { imovelId, dataInicio, dataFim });
      const response = await api.get(`/alugueis/verificar-disponibilidade`, {
        params: { imovelId, dataInicio, dataFim }
      });
      console.log('Resposta:', response.data);
      return response.data.disponivel;
    } catch (error: any) {
      console.error('Erro ao verificar disponibilidade:', error.response?.data || error);
      throw new Error(`Erro ao verificar disponibilidade: ${error.message}`);
    }
  }
}
