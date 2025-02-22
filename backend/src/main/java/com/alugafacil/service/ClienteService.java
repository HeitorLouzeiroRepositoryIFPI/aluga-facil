package com.alugafacil.service;

import com.alugafacil.exception.BusinessException;
import com.alugafacil.exception.ResourceNotFoundException;
import com.alugafacil.model.Cliente;
import com.alugafacil.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteService {
    
    private final ClienteRepository clienteRepository;
    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;
    
    public boolean existeCpf(String cpf) {
        return clienteRepository.findByCpf(cpf).isPresent();
    }

    @Transactional
    public Cliente cadastrar(Cliente cliente) {
        // Validar email
        if (usuarioService.existeEmail(cliente.getEmail())) {
            throw new BusinessException("Email já cadastrado");
        }

        // Validar CPF
        if (existeCpf(cliente.getCpf())) {
            throw new BusinessException("CPF já cadastrado");
        }

        // Criptografar senha
        cliente.setSenha(passwordEncoder.encode(cliente.getSenha()));
        
        // Salvar cliente
        return clienteRepository.save(cliente);
    }
    
    public Cliente buscarPorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
    }
    
    public Cliente buscarPorCpf(String cpf) {
        return clienteRepository.findByCpf(cpf)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
    }
    
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }
    
    public List<Cliente> listarPorStatus(String status) {
        return clienteRepository.findByStatus(status);
    }
    
    @Transactional
    public Cliente atualizar(Long id, Cliente cliente) {
        Cliente clienteExistente = buscarPorId(id);
        
        if (!clienteExistente.getCpf().equals(cliente.getCpf()) && existeCpf(cliente.getCpf())) {
            throw new BusinessException("CPF já cadastrado");
        }
        
        cliente.setId(id);
        cliente.setSenha(clienteExistente.getSenha());
        return clienteRepository.save(cliente);
    }
    
    @Transactional
    public void atualizarStatus(Long id, String status) {
        Cliente cliente = buscarPorId(id);
        cliente.setStatus(status);
        clienteRepository.save(cliente);
    }
    
    @Transactional
    public void excluir(Long id) {
        Cliente cliente = buscarPorId(id);
        if (!cliente.getAlugueis().isEmpty()) {
            throw new BusinessException("Não é possível excluir um cliente que possui aluguéis");
        }
        clienteRepository.delete(cliente);
    }
}
