package com.alugafacil.service;

import com.alugafacil.exception.BusinessException;
import com.alugafacil.exception.ResourceNotFoundException;
import com.alugafacil.model.Aluguel;
import com.alugafacil.model.Cliente;
import com.alugafacil.model.Imovel;
import com.alugafacil.repository.AluguelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AluguelService {
    
    private final AluguelRepository aluguelRepository;
    private final ClienteService clienteService;
    private final ImovelService imovelService;
    
    @Transactional
    public Aluguel criar(Aluguel aluguel, Long clienteId, Long imovelId) {
        Cliente cliente = clienteService.buscarPorId(clienteId);
        Imovel imovel = imovelService.buscarPorId(imovelId);
        
        if (!"DISPONIVEL".equals(imovel.getStatus())) {
            throw new BusinessException("Imóvel não está disponível para aluguel");
        }
        
        aluguel.setCliente(cliente);
        aluguel.setImovel(imovel);
        aluguel.setStatus("PENDENTE");
        
        Aluguel aluguelSalvo = aluguelRepository.save(aluguel);
        imovelService.atualizarStatus(imovelId, "ALUGADO");
        
        return aluguelSalvo;
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
        return aluguelRepository.findByDataInicioBetween(inicio, fim);
    }
    
    @Transactional
    public void atualizarStatus(Long id, String status) {
        Aluguel aluguel = buscarPorId(id);
        aluguel.setStatus(status);
        
        if ("FINALIZADO".equals(status)) {
            imovelService.atualizarStatus(aluguel.getImovel().getId(), "DISPONIVEL");
        }
        
        aluguelRepository.save(aluguel);
    }
    
    @Transactional
    public void excluir(Long id) {
        Aluguel aluguel = buscarPorId(id);
        if (!aluguel.getPagamentos().isEmpty()) {
            throw new BusinessException("Não é possível excluir um aluguel que possui pagamentos");
        }
        aluguelRepository.delete(aluguel);
    }
}
