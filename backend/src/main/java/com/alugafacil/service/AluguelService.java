package com.alugafacil.service;

import com.alugafacil.exception.BusinessException;
import com.alugafacil.exception.ResourceNotFoundException;
import com.alugafacil.model.Aluguel;
import com.alugafacil.model.Cliente;
import com.alugafacil.model.Imovel;
import com.alugafacil.model.Pagamento;
import com.alugafacil.repository.AluguelRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AluguelService {
    
    private static final Logger log = LoggerFactory.getLogger(AluguelService.class);
    
    private final AluguelRepository aluguelRepository;
    private final ClienteService clienteService;
    private final ImovelService imovelService;
    private final PagamentoService pagamentoService;
    
    @Transactional
    public Aluguel criar(Aluguel aluguel, Long clienteId, Long imovelId) {
        try {
            log.info("Iniciando criação de aluguel. Cliente: {}, Imóvel: {}", clienteId, imovelId);
            
            // Validar cliente
            Cliente cliente = clienteService.buscarPorId(clienteId);
            aluguel.setCliente(cliente);
            log.info("Cliente validado: {}", cliente.getNome());
            
            // Validar imóvel
            Imovel imovel = imovelService.buscarPorId(imovelId);
            aluguel.setImovel(imovel);
            log.info("Imóvel validado: {}", imovel.getNome());
            
            // Verificar disponibilidade
            if (!verificarDisponibilidade(imovelId, aluguel.getDataInicio(), aluguel.getDataFim())) {
                throw new BusinessException("Imóvel não está disponível no período selecionado");
            }
            log.info("Disponibilidade verificada com sucesso");
            
            // Definir status inicial
            aluguel.setStatus("ATIVO");
            
            // Salvar aluguel
            log.info("Salvando aluguel");
            Aluguel aluguelSalvo = aluguelRepository.save(aluguel);
            log.info("Aluguel salvo com sucesso. ID: {}", aluguelSalvo.getId());
            
            // Gerar pagamentos mensais
            log.info("Gerando pagamentos mensais");
            List<Pagamento> pagamentos = gerarPagamentosMensais(aluguelSalvo);
            log.info("Pagamentos gerados: {}", pagamentos.size());
            
            try {
                pagamentoService.criarTodos(pagamentos);
                log.info("Pagamentos salvos com sucesso");
            } catch (Exception e) {
                log.error("Erro ao salvar pagamentos: {}", e.getMessage(), e);
                throw new BusinessException("Erro ao gerar pagamentos: " + e.getMessage());
            }
            
            return aluguelSalvo;
            
        } catch (Exception e) {
            log.error("Erro ao criar aluguel: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    private List<Pagamento> gerarPagamentosMensais(Aluguel aluguel) {
        List<Pagamento> pagamentos = new ArrayList<>();
        
        try {
            // Calcular número de meses entre data início e fim
            long meses = ChronoUnit.MONTHS.between(
                aluguel.getDataInicio().withDayOfMonth(1),
                aluguel.getDataFim().withDayOfMonth(1)
            ) + 1;
            
            log.info("Gerando {} pagamentos para o período de {} a {}", 
                meses, aluguel.getDataInicio(), aluguel.getDataFim());
            
            // Gerar um pagamento para cada mês
            for (int i = 0; i < meses; i++) {
                LocalDate dataPagamento = aluguel.getDataInicio()
                    .plusMonths(i)
                    .withDayOfMonth(aluguel.getDiaPagamento());
                
                Pagamento pagamento = Pagamento.builder()
                    .aluguel(aluguel)
                    .valor(aluguel.getValorMensal())
                    .dataPagamento(dataPagamento)
                    .status("PENDENTE")
                    .build();
                
                pagamentos.add(pagamento);
                log.info("Pagamento gerado para {}: {}", dataPagamento, pagamento.getValor());
            }
            
            return pagamentos;
            
        } catch (Exception e) {
            log.error("Erro ao gerar pagamentos mensais: {}", e.getMessage(), e);
            throw new BusinessException("Erro ao gerar pagamentos mensais: " + e.getMessage());
        }
    }
    
    public Aluguel buscarPorId(Long id) {
        return aluguelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aluguel não encontrado"));
    }
    
    public List<Aluguel> listarTodos() {
        return aluguelRepository.findAll();
    }
    
    public List<Aluguel> listarPorCliente(Long clienteId) {
        Cliente cliente = clienteService.buscarPorId(clienteId);
        return aluguelRepository.findByCliente(cliente);
    }
    
    public List<Aluguel> listarPorImovel(Long imovelId) {
        Imovel imovel = imovelService.buscarPorId(imovelId);
        return aluguelRepository.findByImovel(imovel);
    }
    
    public List<Aluguel> listarPorPeriodo(LocalDate inicio, LocalDate fim) {
        return aluguelRepository.findByDataInicioBetweenOrDataFimBetween(inicio, fim, inicio, fim);
    }
    
    @Transactional
    public void atualizarStatus(Long id, String status) {
        Aluguel aluguel = buscarPorId(id);
        aluguel.setStatus(status);
        aluguelRepository.save(aluguel);
    }
    
    @Transactional
    public void excluir(Long id) {
        try {
            log.info("Iniciando exclusão do aluguel: {}", id);
            
            // Buscar aluguel
            Aluguel aluguel = buscarPorId(id);
            log.info("Aluguel encontrado: {}", aluguel);
            
            // Verificar se pode ser excluído
            if ("ATIVO".equals(aluguel.getStatus())) {
                log.error("Tentativa de excluir aluguel ativo: {}", id);
                throw new BusinessException("Não é possível excluir um aluguel ativo. Cancele o aluguel primeiro.");
            }
            
            // Excluir pagamentos relacionados
            log.info("Excluindo pagamentos relacionados");
            List<Pagamento> pagamentos = pagamentoService.listarPorAluguel(id);
            
            // Verificar se há pagamentos já realizados
            boolean temPagamentosRealizados = pagamentos.stream()
                .anyMatch(p -> "PAGO".equals(p.getStatus()));
            if (temPagamentosRealizados) {
                log.error("Tentativa de excluir aluguel com pagamentos realizados: {}", id);
                throw new BusinessException("Não é possível excluir um aluguel que possui pagamentos já realizados");
            }
            
            // Excluir pagamentos pendentes
            for (Pagamento pagamento : pagamentos) {
                if ("PENDENTE".equals(pagamento.getStatus())) {
                    pagamentoService.excluir(pagamento.getId());
                }
            }
            log.info("{} pagamentos excluídos", pagamentos.size());
            
            // Excluir aluguel
            log.info("Excluindo aluguel");
            aluguelRepository.deleteById(id);
            log.info("Aluguel excluído com sucesso");
            
        } catch (BusinessException e) {
            log.error("Erro de negócio ao excluir aluguel: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Erro ao excluir aluguel: {}", e.getMessage(), e);
            throw new BusinessException("Erro ao excluir aluguel: " + e.getMessage());
        }
    }
    
    public boolean verificarDisponibilidade(Long imovelId, LocalDate dataInicio, LocalDate dataFim) {
        try {
            log.info("Buscando imóvel {}", imovelId);
            // Buscar o imóvel
            Imovel imovel = imovelService.buscarPorId(imovelId);
            log.info("Imóvel encontrado: {}", imovel);
            
            // Verificar se o imóvel está disponível
            if (!"DISPONIVEL".equals(imovel.getStatus())) {
                log.info("Imóvel não está com status DISPONIVEL. Status atual: {}", imovel.getStatus());
                return false;
            }
            
            // Buscar aluguéis ativos do imóvel no período
            log.info("Buscando aluguéis ativos para o imóvel");
            List<Aluguel> alugueis = aluguelRepository.findByImovelAndStatusAndDataFimGreaterThanEqual(
                imovel, 
                "ATIVO",
                dataInicio
            );
            log.info("Aluguéis encontrados: {}", alugueis.size());
            
            // Se não houver aluguéis, o imóvel está disponível
            if (alugueis.isEmpty()) {
                log.info("Nenhum aluguel encontrado, imóvel está disponível");
                return true;
            }
            
            // Verificar se há sobreposição de datas
            for (Aluguel aluguel : alugueis) {
                log.info("Verificando sobreposição com aluguel: {} a {}", 
                    aluguel.getDataInicio(), aluguel.getDataFim());
                
                // Se o período solicitado começa antes do fim do aluguel atual
                // e termina depois do início do aluguel atual
                // então há sobreposição
                if (dataInicio.isBefore(aluguel.getDataFim()) && 
                    dataFim.isAfter(aluguel.getDataInicio())) {
                    log.info("Encontrada sobreposição de datas");
                    return false;
                }
            }
            
            log.info("Nenhuma sobreposição encontrada, imóvel está disponível");
            return true;
        } catch (Exception e) {
            log.error("Erro ao verificar disponibilidade: {}", e.getMessage(), e);
            throw e;
        }
    }
}
