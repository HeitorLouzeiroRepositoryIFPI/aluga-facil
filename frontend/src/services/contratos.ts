import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});
import { ClienteDTO } from "./clientes";
import { Imovel } from "./imoveis";

export interface ContratoDTO {
  id?: number;
  clienteId: number;
  imovelId: number;
  dataInicio: string;
  dataFim: string;
  valorMensal: number;
  status: 'ATIVO' | 'FINALIZADO' | 'CANCELADO';
  observacoes?: string;
  cliente?: ClienteDTO;
  imovel?: Imovel;
  diaPagamento: number;
  taxaAdministracao: number;
  valorDeposito: number;
}

export class ContratosService {
  static async listar(): Promise<ContratoDTO[]> {
    const response = await api.get('/alugueis');
    return response.data;
  }

  static async buscarPorId(id: number): Promise<ContratoDTO> {
    const response = await api.get(`/alugueis/${id}`);
    return response.data;
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
    const response = await api.put(`/alugueis/${id}`, contrato);
    return response.data;
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
