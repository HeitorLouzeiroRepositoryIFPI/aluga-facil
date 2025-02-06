package com.alugafacil.service;

import com.alugafacil.exception.BusinessException;
import com.alugafacil.exception.ResourceNotFoundException;
import com.alugafacil.model.Proprietario;
import com.alugafacil.repository.ProprietarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProprietarioService {
    
    private final ProprietarioRepository proprietarioRepository;
    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;
    
    @Transactional
    public Proprietario cadastrar(Proprietario proprietario) {
        if (usuarioService.existeEmail(proprietario.getEmail())) {
            throw new BusinessException("Email já cadastrado");
        }
        
        proprietario.setSenha(passwordEncoder.encode(proprietario.getSenha()));
        return proprietarioRepository.save(proprietario);
    }
    
    public Proprietario buscarPorId(Long id) {
        return proprietarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proprietário não encontrado"));
    }
    
    public List<Proprietario> listarTodos() {
        return proprietarioRepository.findAll();
    }
    
    @Transactional
    public Proprietario atualizar(Long id, Proprietario proprietario) {
        Proprietario proprietarioExistente = buscarPorId(id);
        
        proprietario.setId(id);
        proprietario.setSenha(
            proprietario.getSenha() != null && !proprietario.getSenha().isEmpty() 
            ? passwordEncoder.encode(proprietario.getSenha())
            : proprietarioExistente.getSenha()
        );
        
        return proprietarioRepository.save(proprietario);
    }
    
    @Transactional
    public void excluir(Long id) {
        Proprietario proprietario = buscarPorId(id);
        proprietarioRepository.delete(proprietario);
    }
}
