package com.alugafacil.controller;

import com.alugafacil.dto.ClienteDTO;
import com.alugafacil.dto.ClienteResponseDTO;
import com.alugafacil.model.Cliente;
import com.alugafacil.service.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteController {
    
    private final ClienteService clienteService;
    
    @PostMapping
    public ResponseEntity<ClienteResponseDTO> cadastrar(@Valid @RequestBody ClienteDTO dto) {
        Cliente cliente = Cliente.builder()
            .nome(dto.getNome())
            .email(dto.getEmail())
            .senha(dto.getSenha())
            .cpf(dto.getCpf())
            .telefone(dto.getTelefone())
            .endereco(dto.getEndereco())
            .dataNascimento(LocalDate.parse(dto.getDataNascimento()))
            .status(dto.getStatus())
            .tipo("CLIENTE")
            .build();
        
        Cliente savedCliente = clienteService.cadastrar(cliente);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ClienteResponseDTO.fromEntity(savedCliente));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> buscarPorId(@PathVariable Long id) {
        Cliente cliente = clienteService.buscarPorId(id);
        return ResponseEntity.ok(ClienteResponseDTO.fromEntity(cliente));
    }
    
    @GetMapping
    public ResponseEntity<List<ClienteResponseDTO>> listarTodos() {
        List<ClienteResponseDTO> clientes = clienteService.listarTodos()
                .stream()
                .map(ClienteResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(clientes);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody ClienteDTO dto) {
        Cliente cliente = clienteService.buscarPorId(id);
        
        cliente.setNome(dto.getNome());
        cliente.setEmail(dto.getEmail());
        cliente.setCpf(dto.getCpf());
        cliente.setTelefone(dto.getTelefone());
        cliente.setEndereco(dto.getEndereco());
        cliente.setDataNascimento(LocalDate.parse(dto.getDataNascimento()));
        cliente.setStatus(dto.getStatus());
        cliente.setTipo(dto.getTipo() != null ? dto.getTipo() : cliente.getTipo());
        
        // Only update password if it's provided
        if (dto.getSenha() != null && !dto.getSenha().isEmpty()) {
            cliente.setSenha(dto.getSenha());
        }
        
        Cliente updatedCliente = clienteService.atualizar(id, cliente);
        return ResponseEntity.ok(ClienteResponseDTO.fromEntity(updatedCliente));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        clienteService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ClienteResponseDTO> alterarStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Cliente cliente = clienteService.buscarPorId(id);
        cliente.setStatus(status);
        Cliente updatedCliente = clienteService.atualizar(id, cliente);
        return ResponseEntity.ok(ClienteResponseDTO.fromEntity(updatedCliente));
    }
}
