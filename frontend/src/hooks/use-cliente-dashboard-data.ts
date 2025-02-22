import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { addDays, differenceInMonths, parseISO } from "date-fns";

interface Cliente {
  id: number;
  nome: string;
  email: string;
  cpf: string;
}

interface Administrador {
  id: number;
  nome: string;
  email: string;
}

interface Imovel {
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

interface Aluguel {
  id: number;
  dataInicio: string; // formato: YYYY-MM-DD
  dataFim: string; // formato: YYYY-MM-DD
  valorMensal: number;
  taxaAdministracao: number;
  valorDeposito: number;
  diaPagamento: number;
  observacoes: string;
  status: string;
  cliente: Cliente;
  imovel: Imovel;
  pagamentos: Pagamento[];
  duracaoMeses?: number; // Campo calculado
}

interface Pagamento {
  id: number;
  valor: number;
  dataPagamento: string; // formato: YYYY-MM-DD
  status: string;
  aluguel: Aluguel;
}

interface PagamentoAgrupado {
  contratoId: number;
  valorTotal: number;
  totalPagamentos: number;
  pagos: number;
  valorPago: number;
  pendentes: number;
  valorPendente: number;
  atrasados: number;
  valorAtrasado: number;
  status: string;
  dataPagamento?: string; // formato: YYYY-MM-DD
}

interface ClienteDashboardData {
  alugueis: {
    total: number;
    ativos: Aluguel[];
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
  };
}

export function useClienteDashboardData() {
  const { user } = useAuth();

  return useQuery<ClienteDashboardData, Error>({
    queryKey: ["clienteDashboard", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        const error = new Error("Usuário não autenticado");
        toast.error(error.message);
        throw error;
      }

      try {
        // Buscar aluguéis do cliente
        const alugueisResponse = await api.get(`/alugueis/cliente/${user.id}`);
        
        // Buscar pagamentos agrupados
        const pagamentosResponse = await api.get(`/pagamentos/agrupados`);

        // Log detalhado da resposta
        console.log('Resposta completa dos aluguéis:', JSON.stringify(alugueisResponse.data, null, 2));
        
        // Log detalhado dos imóveis
        alugueisResponse.data.forEach((aluguel: Aluguel) => {
          console.log('Detalhes do imóvel:', {
            id: aluguel.imovel.id,
            nome: aluguel.imovel.nome,
            tipo: aluguel.imovel.tipo,
            codigo: aluguel.imovel.codigo,
            endereco: aluguel.imovel.endereco,
            completo: aluguel.imovel
          });
        });

        // Validar se as respostas contêm os dados esperados
        if (!alugueisResponse.data || !pagamentosResponse.data) {
          throw new Error("Dados inválidos retornados pela API");
        }

        // Filtrar apenas aluguéis ativos e calcular duração
        const alugueisAtivos = alugueisResponse.data.filter(
          (aluguel: Aluguel) => aluguel.status === 'ATIVO'
        ).map((aluguel: Aluguel) => {
          try {
            const dataInicio = parseISO(aluguel.dataInicio);
            const dataFim = parseISO(aluguel.dataFim);
            
            // Adiciona 1 dia ao fim para incluir o último dia no cálculo
            const dataFimAjustada = addDays(dataFim, 1);
            
            return {
              ...aluguel,
              duracaoMeses: differenceInMonths(dataFimAjustada, dataInicio)
            };
          } catch (error) {
            console.error('Erro ao processar datas do aluguel:', aluguel.id, error);
            return {
              ...aluguel,
              duracaoMeses: 0
            };
          }
        });

        // Filtrar pagamentos dos aluguéis ativos do cliente
        const alugueisIds = alugueisAtivos.map(a => a.id);
        const pagamentosDoCliente = pagamentosResponse.data.filter(
          (pag: PagamentoAgrupado) => alugueisIds.includes(pag.contratoId)
        );

        // Somar totais de pagamentos pendentes e atrasados
        const totais = pagamentosDoCliente.reduce((acc, pag: PagamentoAgrupado) => ({
          pendentes: {
            quantidade: acc.pendentes.quantidade + pag.pendentes,
            valor: acc.pendentes.valor + pag.valorPendente,
          },
          atrasados: {
            quantidade: acc.atrasados.quantidade + pag.atrasados,
            valor: acc.atrasados.valor + pag.valorAtrasado,
          },
        }), {
          pendentes: { quantidade: 0, valor: 0 },
          atrasados: { quantidade: 0, valor: 0 },
        });

        const dashboardData = {
          alugueis: {
            total: alugueisAtivos.length,
            ativos: alugueisAtivos,
          },
          pagamentos: {
            pendentes: totais.pendentes,
            atrasados: totais.atrasados,
          },
        };

        return dashboardData;
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);

        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message || 
            error.response?.data?.error ||
            'Erro ao carregar dados do dashboard';
          
          toast.error(errorMessage);
          
          console.error('Detalhes do erro da API:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            config: {
              url: error.config?.url,
              method: error.config?.method,
            }
          });
        } else {
          const message = error instanceof Error ? error.message : 'Erro desconhecido';
          toast.error(message);
        }
        throw error;
      }
    },
    enabled: !!user?.id,
    retry: 1, // Tenta uma vez mais em caso de erro
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
}
