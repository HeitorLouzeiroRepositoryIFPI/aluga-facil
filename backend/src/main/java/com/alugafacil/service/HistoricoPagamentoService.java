package com.alugafacil.service;

import com.alugafacil.exception.ResourceNotFoundException;
import com.alugafacil.model.Cliente;
import com.alugafacil.model.HistoricoPagamento;
import com.alugafacil.repository.ClienteRepository;
import com.alugafacil.repository.HistoricoPagamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HistoricoPagamentoService {
    
    private final HistoricoPagamentoRepository historicoPagamentoRepository;
    private final ClienteRepository clienteRepository;
    
    @Transactional
    public HistoricoPagamento criar(HistoricoPagamento historico) {
        return historicoPagamentoRepository.save(historico);
    }
    
    public HistoricoPagamento buscarPorId(Long id) {
        return historicoPagamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Histórico de pagamento não encontrado"));
    }
    
    public HistoricoPagamento buscarPorCliente(Long clienteId) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
        return historicoPagamentoRepository.findByCliente(cliente)
                .orElseThrow(() -> new ResourceNotFoundException("Histórico de pagamento não encontrado para este cliente"));
    }
    
    @Transactional
    public HistoricoPagamento atualizar(HistoricoPagamento historico) {
        buscarPorId(historico.getId());
        return historicoPagamentoRepository.save(historico);
    }
}
