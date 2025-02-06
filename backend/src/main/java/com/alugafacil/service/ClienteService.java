package com.alugafacil.service;

import com.alugafacil.exception.BusinessException;
import com.alugafacil.exception.ResourceNotFoundException;
import com.alugafacil.model.Cliente;
import com.alugafacil.model.HistoricoPagamento;
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
    private final HistoricoPagamentoService historicoPagamentoService;
    
    @Transactional
    public Cliente cadastrar(Cliente cliente) {
        if (usuarioService.existeEmail(cliente.getEmail())) {
            throw new BusinessException("Email já cadastrado");
        }
        
        cliente.setSenha(passwordEncoder.encode(cliente.getSenha()));
        Cliente clienteSalvo = clienteRepository.save(cliente);
        
        // Criar histórico de pagamento para o cliente
        HistoricoPagamento historico = new HistoricoPagamento();
        historico.setCliente(clienteSalvo);
        historicoPagamentoService.criar(historico);
        
        return clienteSalvo;
    }
    
    public Cliente buscarPorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
    }
    
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }
    
    @Transactional
    public Cliente atualizar(Long id, Cliente cliente) {
        Cliente clienteExistente = buscarPorId(id);
        
        cliente.setId(id);
        cliente.setSenha(
            cliente.getSenha() != null && !cliente.getSenha().isEmpty() 
            ? passwordEncoder.encode(cliente.getSenha())
            : clienteExistente.getSenha()
        );
        
        return clienteRepository.save(cliente);
    }
    
    @Transactional
    public void excluir(Long id) {
        Cliente cliente = buscarPorId(id);
        clienteRepository.delete(cliente);
    }
}
