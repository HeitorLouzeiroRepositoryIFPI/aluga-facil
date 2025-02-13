import { api } from "@/lib/api";

export interface PagamentoDTO {
  id?: number;
  contratoId: number;
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

export class PagamentosService {
  static async listar(): Promise<PagamentoDTO[]> {
    const response = await api.get('/pagamentos');
    return response.data;
  }

  static async buscarPorId(id: number): Promise<PagamentoDTO> {
    const response = await api.get(`/pagamentos/${id}`);
    return response.data;
  }

  static async criar(pagamento: PagamentoDTO): Promise<PagamentoDTO> {
    const response = await api.post('/pagamentos', pagamento);
    return response.data;
  }

  static async atualizar(id: number, pagamento: Partial<PagamentoDTO>): Promise<PagamentoDTO> {
    const response = await api.put(`/pagamentos/${id}`, pagamento);
    return response.data;
  }

  static async excluir(id: number): Promise<void> {
    await api.delete(`/pagamentos/${id}`);
  }

  static async alterarStatus(id: number, novoStatus: string): Promise<PagamentoDTO> {
    const response = await api.patch(`/pagamentos/${id}/status`, { status: novoStatus });
    return response.data;
  }
}
