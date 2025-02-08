package com.alugafacil.service;

import com.alugafacil.exception.BusinessException;
import com.alugafacil.exception.ResourceNotFoundException;
import com.alugafacil.model.Administrador;
import com.alugafacil.repository.AdministradorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdministradorService {
    
    private final AdministradorRepository administradorRepository;
    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;
    
    @Transactional
    public Administrador cadastrar(Administrador administrador) {
        if (usuarioService.existeEmail(administrador.getEmail())) {
            throw new BusinessException("Email já cadastrado");
        }
        
        administrador.setSenha(passwordEncoder.encode(administrador.getSenha()));
        return administradorRepository.save(administrador);
    }
    
    public Administrador buscarPorId(Long id) {
        return administradorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Administrador não encontrado"));
    }
    
    public List<Administrador> listarTodos() {
        return administradorRepository.findAll();
    }
    
    @Transactional
    public Administrador atualizar(Long id, Administrador administrador) {
        Administrador administradorExistente = buscarPorId(id);
        
        administrador.setId(id);
        administrador.setSenha(
            administrador.getSenha() != null && !administrador.getSenha().isEmpty() 
            ? passwordEncoder.encode(administrador.getSenha())
            : administradorExistente.getSenha()
        );
        
        return administradorRepository.save(administrador);
    }
    
    @Transactional
    public void excluir(Long id) {
        Administrador administrador = buscarPorId(id);
        administradorRepository.delete(administrador);
    }
}
