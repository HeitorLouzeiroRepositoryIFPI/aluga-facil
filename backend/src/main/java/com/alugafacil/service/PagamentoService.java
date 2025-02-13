package com.alugafacil.service;

import com.alugafacil.exception.BusinessException;
import com.alugafacil.exception.ResourceNotFoundException;
import com.alugafacil.model.HistoricoPagamento;
import com.alugafacil.model.Pagamento;
import com.alugafacil.repository.PagamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
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
    public void atualizarStatus(Long id, String novoStatus, String formaPagamento) {
        Pagamento pagamento = buscarPorId(id);
        
        if ("PAGO".equals(novoStatus) && !"PAGO".equals(pagamento.getStatus())) {
            // Criar histórico quando o pagamento é marcado como pago
            HistoricoPagamento historico = HistoricoPagamento.builder()
                    .dataPagamento(LocalDate.now())
                    .valor(pagamento.getValor())
                    .formaPagamento(formaPagamento)
                    .build();
            
            historico = historicoPagamentoService.criar(historico);
            pagamento.setHistoricoPagamento(historico);
        }
        
        pagamento.setStatus(novoStatus);
        pagamentoRepository.save(pagamento);
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
    }
}
