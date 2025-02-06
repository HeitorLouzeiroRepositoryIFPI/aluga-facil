package com.alugafacil.controller;

import com.alugafacil.dto.UsuarioDTO;
import com.alugafacil.model.Cliente;
import com.alugafacil.service.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteController {
    
    private final ClienteService clienteService;
    
    @PostMapping
    public ResponseEntity<Cliente> cadastrar(@Valid @RequestBody UsuarioDTO dto) {
        Cliente cliente = Cliente.builder()
            .nome(dto.getNome())
            .email(dto.getEmail())
            .senha(dto.getSenha())
            .tipo("CLIENTE")
            .build();
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(clienteService.cadastrar(cliente));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.buscarPorId(id));
    }
    
    @GetMapping
    public ResponseEntity<List<Cliente>> listarTodos() {
        return ResponseEntity.ok(clienteService.listarTodos());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> atualizar(@PathVariable Long id, @Valid @RequestBody UsuarioDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setNome(dto.getNome());
        cliente.setEmail(dto.getEmail());
        cliente.setSenha(dto.getSenha());
        
        return ResponseEntity.ok(clienteService.atualizar(id, cliente));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        clienteService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
