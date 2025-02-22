import api from '@/services/api';

export interface Administrador {
  id: number;
  nome: string;
  email: string;
}

export interface Imovel {
  id: number;
  codigo: string;
  nome: string;
  endereco: string;
  descricao: string;
  valorMensal: number;
  status: string;
  tipo: string;
  administrador: Administrador;
}

export interface ImovelDTO {
  nome: string;
  endereco: string;
  descricao: string;
  valorMensal: number;
  tipo: string;
  administradorId: number;
}

// Função auxiliar para garantir que a resposta seja sempre um array
const ensureArray = <T>(data: T | T[]): T[] => {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

// Função para validar e normalizar os dados do imóvel
const normalizeImovel = (data: any): Imovel => {
  // Log do objeto recebido para debug
  console.log('Normalizando imóvel:', data);

  // Se não houver dados, retorna um objeto padrão
  if (!data) {
    console.warn('Dados do imóvel ausentes');
    return getDefaultImovel();
  }

  // Garante que todas as propriedades obrigatórias existam
  const imovel: Imovel = {
    id: data.id || 0,
    codigo: data.codigo || '',
    nome: data.nome || '',
    endereco: data.endereco || '',
    descricao: data.descricao || '',
    valorMensal: data.valorMensal || 0,
    status: data.status || 'DISPONIVEL',
    tipo: data.tipo || '',
    administrador: data.administrador || { id: 0, nome: '', email: '' }
  };

  console.log('Imóvel normalizado:', imovel);
  return imovel;
};

const getDefaultImovel = (): Imovel => ({
  id: 0,
  codigo: '',
  nome: 'Imóvel não encontrado',
  endereco: 'Endereço não informado',
  descricao: 'Sem descrição',
  valorMensal: 0,
  status: 'INDEFINIDO',
  tipo: 'Não especificado',
  administrador: { id: 0, nome: 'Não informado', email: '' }
});

export const ImoveisService = {
  async buscarPorCodigo(codigo: string): Promise<ImovelDTO> {
    const response = await api.get(`/imoveis/${codigo}`);
    return response.data;
  },

  async atualizar(codigo: string, imovel: ImovelDTO): Promise<ImovelDTO> {
    const { data } = await api.put(`/imoveis/${codigo}`, imovel);
    return {
      ...data,
      status: data.status || 'DISPONIVEL',
    };
  },

  async excluir(codigo: string): Promise<void> {
    await api.delete(`/imoveis/${codigo}`);
  },

  listarTodos: async () => {
    try {
      const response = await api.get<any[]>('/imoveis');
      console.log('Response from listarTodos:', response.data);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Resposta da API inválida:', response.data);
        return [];
      }

      // Normaliza cada imóvel do array
      const imoveis = response.data.map(normalizeImovel);
      console.log('Normalized imoveis:', imoveis);
      return imoveis;
    } catch (error) {
      console.error('Erro ao listar imóveis:', error);
      return [];
    }
  },

  listarPorAdministrador: async (administradorId: number) => {
    try {
      const response = await api.get<any[]>(`/imoveis/administrador/${administradorId}`);
      console.log('Response from listarPorAdministrador:', response.data);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Resposta da API inválida:', response.data);
        return [];
      }

      // Normaliza cada imóvel do array
      const imoveis = response.data.map(normalizeImovel);
      console.log('Normalized imoveis:', imoveis);
      return imoveis;
    } catch (error) {
      console.error('Erro ao listar imóveis por administrador:', error);
      return [];
    }
  },

  async listarPorStatus(status: string) {
    try {
      console.log('Buscando imóveis com status:', status);
      const response = await api.get(`/imoveis/status/${status}`);
      console.log('Resposta da API:', response.data);
      const data = await response.data;
      const imoveis = ensureArray(data).map(normalizeImovel);
      console.log('Imóveis normalizados:', imoveis);
      return imoveis;
    } catch (error) {
      console.error('Erro ao listar imóveis por status:', error);
      return [];
    }
  },

  listarPorTipo: async (tipo: string) => {
    try {
      const response = await api.get<any[]>(`/imoveis/tipo/${tipo}`);
      console.log('Response from listarPorTipo:', response.data);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Resposta da API inválida:', response.data);
        return [];
      }

      // Normaliza cada imóvel do array
      const imoveis = response.data.map(normalizeImovel);
      console.log('Normalized imoveis:', imoveis);
      return imoveis;
    } catch (error) {
      console.error('Erro ao listar imóveis por tipo:', error);
      return [];
    }
  },

  listarPorValorMaximo: async (valor: number) => {
    try {
      const response = await api.get<any[]>(`/imoveis/valor/${valor}`);
      console.log('Response from listarPorValorMaximo:', response.data);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Resposta da API inválida:', response.data);
        return [];
      }

      // Normaliza cada imóvel do array
      const imoveis = response.data.map(normalizeImovel);
      console.log('Normalized imoveis:', imoveis);
      return imoveis;
    } catch (error) {
      console.error('Erro ao listar imóveis por valor máximo:', error);
      return [];
    }
  },

  buscarPorId: async (id: number) => {
    try {
      const response = await api.get<any>(`/imoveis/${id}`);
      console.log('Response from buscarPorId:', response.data);
      return normalizeImovel(response.data);
    } catch (error) {
      console.error('Erro ao buscar imóvel por ID:', error);
      return getDefaultImovel();
    }
  },

  buscarPorCodigo: async (codigo: string) => {
    try {
      const response = await api.get<any>(`/imoveis/codigo/${codigo}`);
      console.log('Response from buscarPorCodigo:', response.data);
      return normalizeImovel(response.data);
    } catch (error) {
      console.error('Erro ao buscar imóvel por código:', error);
      return getDefaultImovel();
    }
  },

  cadastrar: async (imovel: ImovelDTO) => {
    try {
      const response = await api.post<any>('/imoveis', imovel);
      console.log('Response from cadastrar:', response.data);
      return normalizeImovel(response.data);
    } catch (error) {
      console.error('Erro ao cadastrar imóvel:', error);
      throw error;
    }
  },

  atualizar: async (id: number, imovel: ImovelDTO) => {
    try {
      const response = await api.put<any>(`/imoveis/${id}`, imovel);
      console.log('Response from atualizar:', response.data);
      return normalizeImovel(response.data);
    } catch (error) {
      console.error('Erro ao atualizar imóvel:', error);
      return getDefaultImovel();
    }
  },

  atualizarStatus: async (id: number, status: string) => {
    console.log('Atualizando status de imóvel com id', id, 'para', status);
    await api.patch(`/imoveis/${id}/status?status=${status}`);
  },

  async listarDisponiveis(): Promise<Imovel[]> {
    try {
      const response = await api.get('/imoveis/status/DISPONIVEL');
      const data = await response.data;
      return ensureArray(data).map(normalizeImovel);
    } catch (error) {
      console.error('Erro ao listar imóveis disponíveis:', error);
      return [];
    }
  },
};
