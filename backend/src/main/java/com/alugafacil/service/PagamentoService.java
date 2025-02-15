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
        validarPagamento(pagamento);
        return pagamentoRepository.save(pagamento);
    }

    @Transactional
    public List<Pagamento> criarTodos(List<Pagamento> pagamentos) {
        pagamentos.forEach(this::validarPagamento);
        return pagamentoRepository.saveAll(pagamentos);
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
    public Pagamento alterarStatus(Long id, String novoStatus) {
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
            
            pagamento.setHistoricoPagamento(historico);
        }
        
        pagamento.setStatus(novoStatus);
        return pagamentoRepository.save(pagamento);
    }

    @Transactional
    public Pagamento alterarFormaPagamento(Long id, String formaPagamento) {
        log.info("Alterando forma de pagamento do pagamento {}: {}", id, formaPagamento);
        Pagamento pagamento = buscarPorId(id);
        pagamento.setFormaPagamento(formaPagamento);
        return pagamentoRepository.save(pagamento);
    }
    
    @Transactional
    public Pagamento atualizar(Long id, Pagamento pagamentoAtualizado) {
        Pagamento pagamento = buscarPorId(id);
        
        if (pagamentoAtualizado.getDataPagamento() != null) {
            pagamento.setDataPagamento(pagamentoAtualizado.getDataPagamento());
        }
        if (pagamentoAtualizado.getValor() != null) {
            pagamento.setValor(pagamentoAtualizado.getValor());
        }
        if (pagamentoAtualizado.getStatus() != null) {
            pagamento.setStatus(pagamentoAtualizado.getStatus());
        }
        if (pagamentoAtualizado.getFormaPagamento() != null) {
            pagamento.setFormaPagamento(pagamentoAtualizado.getFormaPagamento());
        }
        if (pagamentoAtualizado.getObservacoes() != null) {
            pagamento.setObservacoes(pagamentoAtualizado.getObservacoes());
        }
        
        validarPagamento(pagamento);
        return pagamentoRepository.save(pagamento);
    }
    
    @Transactional
    public void excluir(Long id) {
        Pagamento pagamento = buscarPorId(id);
        if (pagamento.getHistoricoPagamento() != null) {
            throw new BusinessException("Não é possível excluir um pagamento já realizado");
        }
        pagamentoRepository.delete(pagamento);
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
