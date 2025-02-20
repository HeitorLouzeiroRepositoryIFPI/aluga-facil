package com.alugafacil.service;

import com.alugafacil.exception.BusinessException;
import com.alugafacil.exception.ResourceNotFoundException;
import com.alugafacil.model.HistoricoPagamento;
import com.alugafacil.model.Pagamento;
import com.alugafacil.repository.PagamentoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor // Gera um construtor com argumentos para os campos finais (injeção de dependências)
@Slf4j // Habilita o uso de logs
public class PagamentoService {
    
    private final PagamentoRepository pagamentoRepository;
    private final HistoricoPagamentoService historicoPagamentoService;
    
    /**
     * Cria um novo pagamento após validação.
     */
    @Transactional
    public Pagamento criar(Pagamento pagamento) {
        try {
            log.info("Criando pagamento: {}", pagamento);
            validarPagamento(pagamento);
            return salvar(pagamento);
        } catch (Exception e) {
            log.error("Erro ao criar pagamento: ", e);
            throw new BusinessException("Erro ao criar pagamento: " + e.getMessage());
        }
    }

    /**
     * Cria uma lista de pagamentos após validação.
     */
    @Transactional
    public List<Pagamento> criarTodos(List<Pagamento> pagamentos) {
        try {
            log.info("Criando pagamentos: {}", pagamentos);
            pagamentos.forEach(this::validarPagamento);
            return pagamentoRepository.saveAll(pagamentos);
        } catch (Exception e) {
            log.error("Erro ao criar pagamentos: ", e);
            throw new BusinessException("Erro ao criar pagamentos: " + e.getMessage());
        }
    }
    
    /**
     * Busca um pagamento pelo ID.
     */
    public Pagamento buscarPorId(Long id) {
        return pagamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pagamento não encontrado"));
    }
    
    /**
     * Lista todos os pagamentos cadastrados.
     */
    public List<Pagamento> listarTodos() {
        return pagamentoRepository.findAll();
    }
    
    /**
     * Lista pagamentos de um aluguel específico.
     */
    public List<Pagamento> listarPorAluguel(Long aluguelId) {
        return pagamentoRepository.findByAluguelId(aluguelId);
    }
    
    /**
     * Lista pagamentos dentro de um período específico.
     */
    public List<Pagamento> listarPorPeriodo(LocalDate inicio, LocalDate fim) {
        return pagamentoRepository.findByDataPagamentoBetween(inicio, fim);
    }
    
    /**
     * Salva um pagamento no banco de dados.
     */
    @Transactional
    public Pagamento salvar(Pagamento pagamento) {
        try {
            log.info("Salvando pagamento: {}", pagamento);
            return pagamentoRepository.save(pagamento);
        } catch (Exception e) {
            log.error("Erro ao salvar pagamento: ", e);
            throw new BusinessException("Erro ao salvar pagamento: " + e.getMessage());
        }
    }

    /**
     * Altera o status de um pagamento.
     */
    @Transactional
    public Pagamento alterarStatus(Long id, String novoStatus) {
        try {
            log.info("Alterando status do pagamento {} para {}", id, novoStatus);
            Pagamento pagamento = buscarPorId(id);
            
            // Se estiver marcando como pago, registra a data de pagamento e cria histórico
            if ("PAGO".equals(novoStatus)) {
                pagamento.setDataPagamento(LocalDate.now());
                HistoricoPagamento historico = new HistoricoPagamento();
                historico.setDataPagamento(LocalDate.now());
                historico.setValor(pagamento.getValor());
                historico.setFormaPagamento(pagamento.getFormaPagamento());
                historico.setPagamento(pagamento);
                historicoPagamentoService.criar(historico);
                pagamento.setHistoricoPagamento(historico);
            }
            
            pagamento.setStatus(novoStatus);
            return salvar(pagamento);
        } catch (Exception e) {
            log.error("Erro ao alterar status do pagamento: ", e);
            throw new BusinessException("Erro ao alterar status do pagamento: " + e.getMessage());
        }
    }
    
    /**
     * Exclui um pagamento pelo ID.
     */
    @Transactional
    public void excluir(Long id) {
        try {
            log.info("Excluindo pagamento: {}", id);
            Pagamento pagamento = buscarPorId(id);
            pagamentoRepository.delete(pagamento);
        } catch (Exception e) {
            log.error("Erro ao excluir pagamento: ", e);
            throw new BusinessException("Erro ao excluir pagamento: " + e.getMessage());
        }
    }
    
    /**
     * Valida os dados de um pagamento antes da persistência.
     */
    private void validarPagamento(Pagamento pagamento) {
        if (pagamento.getValor() <= 0) {
            throw new BusinessException("Valor do pagamento deve ser maior que zero");
        }
        if (pagamento.getDataPagamento() == null) {
            throw new BusinessException("Data do pagamento é obrigatória");
        }
        if (pagamento.getAluguel() == null) {
            throw new BusinessException("Aluguel é obrigatório");
        }
    }
}
