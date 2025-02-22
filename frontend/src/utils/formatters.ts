export const formatarValor = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

export const formatarCPF = (cpf: string): string => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatarTelefone = (telefone: string): string => {
  return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

export const formatarCEP = (cep: string): string => {
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
};

export const formatarDataExtenso = (data: Date): string => {
  return data.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};
