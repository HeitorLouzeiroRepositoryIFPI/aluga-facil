import api from '@/services/api';

export interface ClienteDTO {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  cpf: string;
  telefone: string;
  endereco: string;
  dataNascimento: string;
  status: 'ATIVO' | 'INATIVO' | 'BLOQUEADO';
  tipo?: string;
}

export class ClientesService {
  static async listar(): Promise<ClienteDTO[]> {
    try {
      const response = await api.get('/clientes');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      return [];
    }
  }

  static async buscarPorId(id: number): Promise<ClienteDTO> {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  }

  static async cadastrar(cliente: ClienteDTO): Promise<ClienteDTO> {
    try {
      console.log('Enviando dados para API:', cliente);
      const response = await api.post('/clientes', cliente);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao cadastrar cliente:', error.response?.data || error);
      throw error;
    }
  }

  static async atualizar(id: number, cliente: ClienteDTO): Promise<ClienteDTO> {
    const response = await api.put(`/clientes/${id}`, cliente);
    return response.data;
  }

  static async alterarStatus(id: number, status: string): Promise<ClienteDTO> {
    const response = await api.patch(`/clientes/${id}/status`, { status });
    return response.data;
  }

  static async excluir(id: number): Promise<void> {
    await api.delete(`/clientes/${id}`);
  }
}
