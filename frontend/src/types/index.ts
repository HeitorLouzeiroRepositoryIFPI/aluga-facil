export interface LoginRequest {
  email: string;
  senha: string;
}

export interface JwtResponse {
  token: string;
  tipo: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

export interface Imovel {
  id: number;
  codigo: string;
  nome: string;
  tipo: string;
  endereco: string;
  descricao: string;
  valorMensal: number;
  status: string;
  administrador?: Administrador;
  alugueis?: Aluguel[];
}

export interface ImovelDTO {
  nome: string;
  endereco: string;
  descricao: string;
  valorMensal: number;
  tipo: string;
  fotos: string[];
  proprietarioId: number;
}

export interface Cliente extends Usuario {
  tipo: 'CLIENTE';
}

export interface Proprietario extends Usuario {
  tipo: 'PROPRIETARIO';
}
