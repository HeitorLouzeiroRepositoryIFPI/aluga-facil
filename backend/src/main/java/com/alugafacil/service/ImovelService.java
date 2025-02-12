package com.alugafacil.service;

import com.alugafacil.exception.BusinessException;
import com.alugafacil.exception.ResourceNotFoundException;
import com.alugafacil.model.Administrador;
import com.alugafacil.model.Imovel;
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
    private final AdministradorService administradorService;
    
    @Transactional
    public Imovel cadastrar(Imovel imovel, Long administradorId) {
        Administrador administrador = administradorService.buscarPorId(administradorId);
        imovel.setAdministrador(administrador);
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
    
    public List<Imovel> listarPorAdministrador(Long administradorId) {
        Administrador administrador = administradorService.buscarPorId(administradorId);
        return imovelRepository.findByAdministrador(administrador);
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
        imovel.setAdministrador(imovelExistente.getAdministrador());
        
        return imovelRepository.save(imovel);
    }

    @Transactional
    public Imovel atualizarPorCodigo(String codigo, Imovel imovel) {
        Imovel imovelExistente = buscarPorCodigo(codigo);
        
        imovel.setId(imovelExistente.getId());
        imovel.setCodigo(codigo);
        imovel.setAdministrador(imovelExistente.getAdministrador());
        
        return imovelRepository.save(imovel);
    }
    
    @Transactional
    public Imovel atualizarStatus(Long id, String status) {
        Imovel imovel = buscarPorId(id);
        imovel.setStatus(status);
        return imovelRepository.save(imovel);
    }
    
    @Transactional
    public void excluir(Long id) {
        Imovel imovel = buscarPorId(id);
        if (!imovel.getAlugueis().isEmpty()) {
            throw new BusinessException("Não é possível excluir um imóvel que possui aluguéis");
        }
        imovelRepository.delete(imovel);
    }

    @Transactional
    public void excluirPorCodigo(String codigo) {
        Imovel imovel = buscarPorCodigo(codigo);
        if (!imovel.getAlugueis().isEmpty()) {
            throw new BusinessException("Não é possível excluir um imóvel que possui aluguéis");
        }
        // Limpa a lista de fotos antes de excluir o imóvel
        imovel.getFotos().clear();
        imovelRepository.save(imovel);
        imovelRepository.delete(imovel);
    }
}
