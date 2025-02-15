import api from '@/services/api';

export type PaymentMethod = 'PIX' | 'CARTAO' | 'BOLETO' | 'DINHEIRO';

export interface PagamentoDTO {
  id?: number;
  contratoId?: number; 
  valor: number;
  dataPagamento: string;
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'CANCELADO';
  formaPagamento: PaymentMethod | null;
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
  formaPagamento?: PaymentMethod | null;
  status?: 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'CANCELADO';
}

export class PagamentosService {
  static async listar(): Promise<PagamentoDTO[]> {
    const response = await api.get('pagamentos');
    return response.data;
  }

  static async buscarPorId(id: number): Promise<PagamentoDTO> {
    const response = await api.get(`pagamentos/${id}`);
    return response.data;
  }

  static async buscarPorContrato(contratoId: number): Promise<PagamentoDTO[]> {
    const response = await api.get(`pagamentos/contrato/${contratoId}`);
    return response.data;
  }

  static async criar(pagamento: PagamentoDTO): Promise<PagamentoDTO> {
    const response = await api.post('pagamentos', pagamento);
    return response.data;
  }

  static async atualizar(id: number, updates: Partial<PagamentoDTO>): Promise<PagamentoDTO> {
    try {
      // Remove campos undefined/null
      const validUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined && value !== null)
      );

      console.log('Atualizando pagamento:', { id, updates: validUpdates });
      const response = await api.put(`pagamentos/${id}`, validUpdates);
      console.log('Resposta da API:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar pagamento:', error);
      if (error.response) {
        console.error('Detalhes do erro:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      throw error;
    }
  }

  static async alterarStatus(id: number, status: string): Promise<PagamentoDTO> {
    try {
      console.log('Alterando status:', { id, status });
      const response = await api.patch(`pagamentos/${id}/status`, { status });
      console.log('Resposta da API:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      if (error.response) {
        console.error('Detalhes do erro:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      throw error;
    }
  }

  static async alterarFormaPagamento(id: number, formaPagamento: PaymentMethod | null): Promise<PagamentoDTO> {
    try {
      console.log('Alterando forma de pagamento:', { id, formaPagamento });
      const response = await api.patch(`pagamentos/${id}/forma-pagamento`, { formaPagamento });
      console.log('Resposta da API:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar forma de pagamento:', error);
      if (error.response) {
        console.error('Detalhes do erro:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      throw error;
    }
  }

  static async excluir(id: number): Promise<void> {
    await api.delete(`pagamentos/${id}`);
  }

  static async listarAgrupados(): Promise<PagamentoAgrupado[]> {
    try {
      const response = await api.get('pagamentos/agrupados');
      return response.data || [];
    } catch (error) {
      console.error('Erro ao listar pagamentos agrupados:', error);
      return [];
    }
  }
}
