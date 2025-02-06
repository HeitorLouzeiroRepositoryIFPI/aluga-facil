package com.alugafacil.service;

import com.alugafacil.exception.BusinessException;
import com.alugafacil.exception.ResourceNotFoundException;
import com.alugafacil.model.Aluguel;
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
    private final AluguelService aluguelService;
    private final HistoricoPagamentoService historicoPagamentoService;
    
    @Transactional
    public Pagamento registrar(Pagamento pagamento, Long aluguelId) {
        Aluguel aluguel = aluguelService.buscarPorId(aluguelId);
        
        if (!"ATIVO".equals(aluguel.getStatus())) {
            throw new BusinessException("Não é possível registrar pagamento para um aluguel que não está ativo");
        }
        
        pagamento.setAluguel(aluguel);
        pagamento.setStatus("PENDENTE");
        
        Pagamento pagamentoSalvo = pagamentoRepository.save(pagamento);
        
        // Adicionar ao histórico do cliente
        HistoricoPagamento historico = historicoPagamentoService.buscarPorCliente(aluguel.getCliente().getId());
        historico.getPagamentos().add(pagamentoSalvo);
        historicoPagamentoService.atualizar(historico);
        
        return pagamentoSalvo;
    }
    
    public Pagamento buscarPorId(Long id) {
        return pagamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pagamento não encontrado"));
    }
    
    public List<Pagamento> listarTodos() {
        return pagamentoRepository.findAll();
    }
    
    public List<Pagamento> listarPorAluguel(Long aluguelId) {
        Aluguel aluguel = aluguelService.buscarPorId(aluguelId);
        return pagamentoRepository.findByAluguel(aluguel);
    }
    
    public List<Pagamento> listarPorPeriodo(LocalDate inicio, LocalDate fim) {
        return pagamentoRepository.findByDataPagamentoBetween(inicio, fim);
    }
    
    @Transactional
    public void confirmarPagamento(Long id) {
        Pagamento pagamento = buscarPorId(id);
        pagamento.setStatus("PAGO");
        pagamento.setDataPagamento(LocalDate.now());
        pagamentoRepository.save(pagamento);
    }
    
    @Transactional
    public void excluir(Long id) {
        Pagamento pagamento = buscarPorId(id);
        if ("PAGO".equals(pagamento.getStatus())) {
            throw new BusinessException("Não é possível excluir um pagamento já confirmado");
        }
        pagamentoRepository.delete(pagamento);
    }
}
