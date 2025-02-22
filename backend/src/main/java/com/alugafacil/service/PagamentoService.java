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
@RequiredArgsConstructor
@Slf4j
public class PagamentoService {
    
    private final PagamentoRepository pagamentoRepository;
    private final HistoricoPagamentoService historicoPagamentoService;
    
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
    
    public Pagamento buscarPorId(Long id) {
        return pagamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pagamento não encontrado"));
    }
    
    public List<Pagamento> listarTodos() {
        return pagamentoRepository.findAll();
    }
    
    public List<Pagamento> listarPorAluguel(Long aluguelId) {
        return pagamentoRepository.findByAluguelId(aluguelId);
    }
    
    public List<Pagamento> listarPorPeriodo(LocalDate inicio, LocalDate fim) {
        return pagamentoRepository.findByDataPagamentoBetween(inicio, fim);
    }
    
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

    @Transactional
    public Pagamento alterarStatus(Long id, String novoStatus) {
        try {
            log.info("Alterando status do pagamento {} para {}", id, novoStatus);
            Pagamento pagamento = buscarPorId(id);
            
            // Se estiver marcando como pago, registra a data de pagamento
            if ("PAGO".equals(novoStatus)) {
                pagamento.setDataPagamento(LocalDate.now());
                
                // Criar histórico do pagamento
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

    @Transactional
    public Pagamento alterarFormaPagamento(Long id, String formaPagamento) {
        try {
            log.info("Alterando forma de pagamento do pagamento {} para {}", id, formaPagamento);
            Pagamento pagamento = buscarPorId(id);
            pagamento.setFormaPagamento(formaPagamento);
            return salvar(pagamento);
        } catch (Exception e) {
            log.error("Erro ao alterar forma de pagamento: ", e);
            throw new BusinessException("Erro ao alterar forma de pagamento: " + e.getMessage());
        }
    }
    
    @Transactional
    public Pagamento atualizar(Long id, Pagamento pagamentoAtualizado) {
        try {
            log.info("Atualizando pagamento {}: {}", id, pagamentoAtualizado);
            Pagamento pagamentoExistente = buscarPorId(id);
            
            pagamentoExistente.setValor(pagamentoAtualizado.getValor());
            pagamentoExistente.setDataPagamento(pagamentoAtualizado.getDataPagamento());
            pagamentoExistente.setStatus(pagamentoAtualizado.getStatus());
            pagamentoExistente.setFormaPagamento(pagamentoAtualizado.getFormaPagamento());
            
            return salvar(pagamentoExistente);
        } catch (Exception e) {
            log.error("Erro ao atualizar pagamento: ", e);
            throw new BusinessException("Erro ao atualizar pagamento: " + e.getMessage());
        }
    }

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
    
    @Transactional
    public Pagamento confirmarPagamento(Long id, String formaPagamento, String status) {
        try {
            log.info("Confirmando pagamento {} com forma de pagamento {} e status {}", id, formaPagamento, status);
            Pagamento pagamento = buscarPorId(id);
            
            // Atualiza a forma de pagamento
            pagamento.setFormaPagamento(formaPagamento);
            
            // Se estiver marcando como pago, registra a data de pagamento e cria histórico
            if ("PAGO".equals(status)) {
                pagamento.setDataPagamento(LocalDate.now());
                
                // Criar histórico do pagamento
                HistoricoPagamento historico = new HistoricoPagamento();
                historico.setDataPagamento(LocalDate.now());
                historico.setValor(pagamento.getValor());
                historico.setFormaPagamento(formaPagamento);
                historico.setPagamento(pagamento);
                
                historicoPagamentoService.criar(historico);
                pagamento.setHistoricoPagamento(historico);
            }
            
            // Atualiza o status
            pagamento.setStatus(status);
            
            return salvar(pagamento);
        } catch (Exception e) {
            log.error("Erro ao confirmar pagamento: ", e);
            throw new BusinessException("Erro ao confirmar pagamento: " + e.getMessage());
        }
    }

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
