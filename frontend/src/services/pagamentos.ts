import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export interface PagamentoDTO {
  id?: number;
  contratoId?: number; 
  valor: number;
  dataPagamento: string;
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'CANCELADO';
  formaPagamento: 'PIX' | 'CARTAO' | 'BOLETO' | 'DINHEIRO';
  observacoes?: string;
  cliente?: {
    nome: string;
    cpf: string;
  };
  imovel?: {
    codigo: string;
    nome: string;
  };
}

export interface PagamentoAgrupado {
  contratoId: number;
  valorTotal: number;
  totalPagamentos: number;
  pagos: number;
  valorPago: number;
  pendentes: number;
  valorPendente: number;
  atrasados: number;
  valorAtrasado: number;
  imovel?: {
    codigo: string;
    nome: string;
  };
  cliente?: {
    nome: string;
    cpf: string;
  };
}

export interface PagamentoUpdateDTO {
  formaPagamento?: 'PIX' | 'CARTAO' | 'BOLETO' | 'DINHEIRO';
  status?: 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'CANCELADO';
}

export class PagamentosService {
  static async listar(): Promise<PagamentoDTO[]> {
    const response = await api.get('/pagamentos');
    return response.data;
  }

  static async buscarPorId(id: number): Promise<PagamentoDTO> {
    const response = await api.get(`/pagamentos/${id}`);
    return response.data;
  }

  static async buscarPorContrato(contratoId: number): Promise<PagamentoDTO[]> {
    const response = await api.get(`/pagamentos/contrato/${contratoId}`);
    return response.data;
  }

  static async criar(pagamento: PagamentoDTO): Promise<PagamentoDTO> {
    const response = await api.post('/pagamentos', pagamento);
    return response.data;
  }

  static async atualizar(id: number, updates: PagamentoUpdateDTO): Promise<PagamentoDTO> {
    if (updates.status) {
      return await this.alterarStatus(id, updates.status);
    }
    if (updates.formaPagamento) {
      return await this.alterarFormaPagamento(id, updates.formaPagamento);
    }
    throw new Error('Invalid update: must provide either status or formaPagamento');
  }

  static async excluir(id: number): Promise<void> {
    await api.delete(`/pagamentos/${id}`);
  }

  static async alterarStatus(id: number, novoStatus: string): Promise<PagamentoDTO> {
    const response = await api.patch(`/pagamentos/${id}/status`, { status: novoStatus });
    return response.data;
  }

  static async alterarFormaPagamento(id: number, formaPagamento: string): Promise<PagamentoDTO> {
    const response = await api.patch(`/pagamentos/${id}/forma-pagamento`, { formaPagamento });
    return response.data;
  }

  static async listarAgrupados(): Promise<PagamentoAgrupado[]> {
    try {
      const response = await api.get('/pagamentos/agrupados');
      return response.data || [];
    } catch (error) {
      console.error('Erro ao listar pagamentos agrupados:', error);
      return [];
    }
  }
}
