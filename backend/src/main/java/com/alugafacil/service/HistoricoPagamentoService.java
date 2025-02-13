package com.alugafacil.service;

import com.alugafacil.exception.ResourceNotFoundException;
import com.alugafacil.model.HistoricoPagamento;
import com.alugafacil.repository.HistoricoPagamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoricoPagamentoService {
    
    private final HistoricoPagamentoRepository historicoPagamentoRepository;
    
    @Transactional
    public HistoricoPagamento criar(HistoricoPagamento historico) {
        return historicoPagamentoRepository.save(historico);
    }
    
    public HistoricoPagamento buscarPorId(Long id) {
        return historicoPagamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Histórico de pagamento não encontrado"));
    }
    
    public List<HistoricoPagamento> listarTodos() {
        return historicoPagamentoRepository.findAll();
    }
    
    @Transactional
    public void excluir(Long id) {
        HistoricoPagamento historico = buscarPorId(id);
        historicoPagamentoRepository.delete(historico);
    }
}
