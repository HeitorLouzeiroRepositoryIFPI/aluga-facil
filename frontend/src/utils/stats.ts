import { ClienteDTO } from "@/services/clientes";
import { Imovel } from "@/services/imoveis";

export interface ClienteStats {
  total: number;
  ativos: number;
  inativos: number;
  bloqueados: number;
}

export interface ImovelStats {
  total: number;
  alugados: number;
  disponiveis: number;
  valorTotal: number;
}

export function calculateClienteStats(clientes: ClienteDTO[]): ClienteStats {
  return {
    total: clientes.length,
    ativos: clientes.filter(cliente => cliente.status === 'ATIVO').length,
    inativos: clientes.filter(cliente => cliente.status === 'INATIVO').length,
    bloqueados: clientes.filter(cliente => cliente.status === 'BLOQUEADO').length
  };
}

export function calculateImovelStats(imoveis: Imovel[]): ImovelStats {
  return {
    total: imoveis.length,
    alugados: imoveis.filter(imovel => imovel.status === 'ALUGADO').length,
    disponiveis: imoveis.filter(imovel => imovel.status === 'DISPONIVEL').length,
    valorTotal: imoveis.reduce((acc, imovel) => acc + (imovel.valorMensal || 0), 0)
  };
}
