import axios from 'axios';
import { UploadService } from './upload';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export interface Administrador {
  id: number;
  nome: string;
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
  fotos: string[];
  administrador: Administrador;
}

export interface ImovelDTO {
  nome: string;
  endereco: string;
  descricao: string;
  valorMensal: number;
  tipo: string;
  fotos: string[];
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
    fotos: ensureArray(data.fotos),
    administrador: data.administrador || { id: 0, nome: '' }
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
  fotos: [],
  administrador: { id: 0, nome: 'Não informado' }
});

export const ImoveisService = {
  async buscarPorCodigo(codigo: string): Promise<ImovelDTO> {
    const response = await api.get(`/imoveis/${codigo}`);
    return response.data;
  },

  async atualizar(codigo: string, imovel: ImovelDTO): Promise<ImovelDTO> {
    const response = await api.put(`/imoveis/${codigo}`, imovel);
    return response.data;
  },

  async atualizarComFotos(codigo: string, imovel: ImovelDTO, fotos: File[]): Promise<ImovelDTO> {
    // Primeiro faz upload das fotos
    const fotosUrls = await Promise.all(
      fotos.map(async (foto) => {
        const formData = new FormData();
        formData.append('file', foto);
        const response = await api.post('/upload', formData);
        return response.data.url;
      })
    );

    // Atualiza o imóvel com as novas fotos
    const imovelComFotos = {
      ...imovel,
      fotos: [...imovel.fotos, ...fotosUrls],
    };

    return await ImoveisService.atualizar(codigo, imovelComFotos);
  },

  async removerFoto(codigo: string, url: string): Promise<void> {
    await api.delete(`/imoveis/${codigo}/fotos`, { data: { url } });
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

  cadastrar: async (imovel: ImovelDTO, fotos?: File[]) => {
    try {
      // Se houver fotos, faz o upload primeiro
      if (fotos && fotos.length > 0) {
        console.log('Iniciando upload de fotos...');
        const uploadResults = await UploadService.uploadMultiplasFotos(fotos);
        const fotosUrls = uploadResults
          .filter((result) => result.success)
          .map((result) => result.url);
        console.log('URLs das fotos após upload:', fotosUrls);
        imovel.fotos = fotosUrls;
      }

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

  excluir: async (codigo: string) => {
    console.log('Excluindo imóvel com código', codigo);
    await api.delete(`/imoveis/${codigo}`);
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
