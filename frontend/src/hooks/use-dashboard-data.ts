import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { Imovel } from "@/services/imoveis";
import { PagamentoDTO } from "@/services/pagamentos";

interface DashboardData {
  imoveis: {
    total: number;
    ativos: number;
  };
  pagamentos: {
    pendentes: {
      quantidade: number;
      valor: number;
    };
    atrasados: {
      quantidade: number;
      valor: number;
    };
    recebidos: {
      quantidade: number;
      valor: number;
    };
  };
  atividadesRecentes: {
    tipo: string;
    descricao: string;
    data: string;
    imovel: {
      nome: string;
      codigo: string;
    };
  }[];
}

export function useDashboardData() {
  return useQuery<DashboardData>({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      const [imoveisResponse, pagamentosResponse] = await Promise.all([
        api.get<Imovel[]>("/imoveis"),
        api.get<PagamentoDTO[]>("/pagamentos"),
      ]);

      const imoveis = imoveisResponse.data;
      const pagamentos = pagamentosResponse.data;

      // Calcula totais de imóveis
      const totalImoveis = imoveis.length;
      const imoveisAtivos = imoveis.filter(
        (imovel) => imovel.status === "DISPONIVEL"
      ).length;

      // Calcula totais de pagamentos
      const pagamentosPendentes = pagamentos.filter(
        (pag) => pag.status === "PENDENTE"
      );
      const pagamentosAtrasados = pagamentos.filter(
        (pag) => pag.status === "ATRASADO"
      );
      const pagamentosRecebidos = pagamentos.filter(
        (pag) => pag.status === "PAGO"
      );

      // Gera atividades recentes
      const atividadesRecentes = pagamentos
        .sort((a, b) => {
          return (
            new Date(b.dataPagamento).getTime() -
            new Date(a.dataPagamento).getTime()
          );
        })
        .slice(0, 5)
        .map((pag) => ({
          tipo: pag.status === "PAGO" ? "Pagamento Recebido" : "Pagamento Pendente",
          descricao: `R$ ${pag.valor.toFixed(2)}`,
          data: new Date(pag.dataPagamento).toLocaleDateString(),
          imovel: {
            nome: pag.aluguel.imovel.nome,
            codigo: pag.aluguel.imovel.codigo,
          },
        }));

      return {
        imoveis: {
          total: totalImoveis,
          ativos: imoveisAtivos,
        },
        pagamentos: {
          pendentes: {
            quantidade: pagamentosPendentes.length,
            valor: pagamentosPendentes.reduce((acc, pag) => acc + pag.valor, 0),
          },
          atrasados: {
            quantidade: pagamentosAtrasados.length,
            valor: pagamentosAtrasados.reduce((acc, pag) => acc + pag.valor, 0),
          },
          recebidos: {
            quantidade: pagamentosRecebidos.length,
            valor: pagamentosRecebidos.reduce((acc, pag) => acc + pag.valor, 0),
          },
        },
        atividadesRecentes,
      };
    },
  });
}
