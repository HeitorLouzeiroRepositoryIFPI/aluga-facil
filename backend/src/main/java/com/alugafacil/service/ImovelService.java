package com.alugafacil.service;

import com.alugafacil.exception.BusinessException;
import com.alugafacil.exception.ResourceNotFoundException;
import com.alugafacil.model.Imovel;
import com.alugafacil.model.Proprietario;
import com.alugafacil.repository.ImovelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImovelService {
    
    private final ImovelRepository imovelRepository;
    private final ProprietarioService proprietarioService;
    
    @Transactional
    public Imovel cadastrar(Imovel imovel, Long proprietarioId) {
        Proprietario proprietario = proprietarioService.buscarPorId(proprietarioId);
        imovel.setProprietario(proprietario);
        imovel.setCodigo(UUID.randomUUID().toString());
        return imovelRepository.save(imovel);
    }
    
    public Imovel buscarPorId(Long id) {
        return imovelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Imóvel não encontrado"));
    }
    
    public Imovel buscarPorCodigo(String codigo) {
        return imovelRepository.findByCodigo(codigo)
                .orElseThrow(() -> new ResourceNotFoundException("Imóvel não encontrado"));
    }
    
    public List<Imovel> listarTodos() {
        return imovelRepository.findAll();
    }
    
    public List<Imovel> listarPorProprietario(Long proprietarioId) {
        Proprietario proprietario = proprietarioService.buscarPorId(proprietarioId);
        return imovelRepository.findByProprietario(proprietario);
    }
    
    public List<Imovel> listarPorStatus(String status) {
        return imovelRepository.findByStatus(status);
    }
    
    public List<Imovel> listarPorTipo(String tipo) {
        return imovelRepository.findByTipo(tipo);
    }
    
    public List<Imovel> listarPorValorMaximo(Double valor) {
        return imovelRepository.findByValorMensalLessThanEqual(valor);
    }
    
    @Transactional
    public Imovel atualizar(Long id, Imovel imovel) {
        Imovel imovelExistente = buscarPorId(id);
        
        imovel.setId(id);
        imovel.setCodigo(imovelExistente.getCodigo());
        imovel.setProprietario(imovelExistente.getProprietario());
        
        return imovelRepository.save(imovel);
    }
    
    @Transactional
    public void atualizarStatus(Long id, String status) {
        Imovel imovel = buscarPorId(id);
        imovel.setStatus(status);
        imovelRepository.save(imovel);
    }
    
    @Transactional
    public void excluir(Long id) {
        Imovel imovel = buscarPorId(id);
        if (!imovel.getAlugueis().isEmpty()) {
            throw new BusinessException("Não é possível excluir um imóvel que possui aluguéis");
        }
        imovelRepository.delete(imovel);
    }
}
