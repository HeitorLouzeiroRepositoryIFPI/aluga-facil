import { ClienteDTO } from "@/services/clientes";
import { Imovel } from "@/services/imoveis";
import { PagamentoDTO } from "@/services/pagamentos";
import { ContratoDTO } from "@/services/contratos";

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

export interface PagamentoStats {
  total: number;
  pagos: number;
  pendentes: number;
  atrasados: number;
  valorTotalPago: number;
  valorTotalPendente: number;
  valorTotalAtrasado: number;
}

export interface ContratoStats {
  total: number;
  ativos: number;
  finalizados: number;
  cancelados: number;
  valorTotalMensal: number;
}

export function calculateClienteStats(clientes: ClienteDTO[]): ClienteStats {
  return {
    total: clientes.length,
    ativos: clientes.filter(c => c.status === 'ATIVO').length,
    inativos: clientes.filter(c => c.status === 'INATIVO').length,
    bloqueados: clientes.filter(c => c.status === 'BLOQUEADO').length
  };
}

export function calculateImovelStats(imoveis: Imovel[]): ImovelStats {
  return {
    total: imoveis.length,
    alugados: imoveis.filter(i => i.status === 'ALUGADO').length,
    disponiveis: imoveis.filter(i => i.status === 'DISPONIVEL').length,
    valorTotal: imoveis
      .filter(i => i.status === 'ALUGADO')
      .reduce((total, imovel) => total + (imovel.valorMensal || 0), 0)
  };
}

export function calculatePagamentoStats(pagamentos: PagamentoDTO[]): PagamentoStats {
  const valorTotalPago = pagamentos
    .filter(p => p.status === 'PAGO')
    .reduce((total, pag) => total + pag.valor, 0);

  const valorTotalPendente = pagamentos
    .filter(p => p.status === 'PENDENTE')
    .reduce((total, pag) => total + pag.valor, 0);

  const valorTotalAtrasado = pagamentos
    .filter(p => p.status === 'ATRASADO')
    .reduce((total, pag) => total + pag.valor, 0);

  return {
    total: pagamentos.length,
    pagos: pagamentos.filter(p => p.status === 'PAGO').length,
    pendentes: pagamentos.filter(p => p.status === 'PENDENTE').length,
    atrasados: pagamentos.filter(p => p.status === 'ATRASADO').length,
    valorTotalPago,
    valorTotalPendente,
    valorTotalAtrasado
  };
}

export function calculateContratoStats(contratos: ContratoDTO[]): ContratoStats {
  return {
    total: contratos.length,
    ativos: contratos.filter(c => c.status === 'ATIVO').length,
    finalizados: contratos.filter(c => c.status === 'FINALIZADO').length,
    cancelados: contratos.filter(c => c.status === 'CANCELADO').length,
    valorTotalMensal: contratos
      .filter(c => c.status === 'ATIVO')
      .reduce((total, contrato) => total + contrato.valorMensal, 0)
  };
}
