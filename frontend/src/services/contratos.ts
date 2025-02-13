import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});
import { ClienteDTO } from "./clientes";
import { Imovel } from "./imoveis";

export interface ContratoDTO {
  id?: number;
  clienteId: number;
  imovelCodigo: string;
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
    const response = await api.get('/contratos');
    return response.data;
  }

  static async buscarPorId(id: number): Promise<ContratoDTO> {
    const response = await api.get(`/contratos/${id}`);
    return response.data;
  }

  static async criar(contrato: ContratoDTO): Promise<ContratoDTO> {
    const response = await api.post('/contratos', contrato);
    return response.data;
  }

  static async atualizar(id: number, contrato: Partial<ContratoDTO>): Promise<ContratoDTO> {
    const response = await api.put(`/contratos/${id}`, contrato);
    return response.data;
  }

  static async excluir(id: number): Promise<void> {
    await api.delete(`/contratos/${id}`);
  }

  static async alterarStatus(id: number, novoStatus: string): Promise<ContratoDTO> {
    const response = await api.patch(`/contratos/${id}/status`, { status: novoStatus });
    return response.data;
  }

  static async verificarDisponibilidade(imovelCodigo: string, dataInicio: string, dataFim: string): Promise<boolean> {
    const response = await api.get(`/contratos/verificar-disponibilidade`, {
      params: { imovelCodigo, dataInicio, dataFim }
    });
    return response.data.disponivel;
  }
}
