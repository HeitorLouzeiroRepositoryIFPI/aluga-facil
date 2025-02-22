package com.alugafacil.controller;

import com.alugafacil.dto.AdministradorDTO;
import com.alugafacil.model.Administrador;
import com.alugafacil.service.AdministradorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/administradores")
@RequiredArgsConstructor
public class AdministradorController {
    
    private final AdministradorService administradorService;
    
    @PostMapping
    public ResponseEntity<Administrador> cadastrar(@Valid @RequestBody AdministradorDTO dto) {
        Administrador administrador = Administrador.builder()
            .nome(dto.getNome())
            .email(dto.getEmail())
            .senha(dto.getSenha())
            .cpf(dto.getCpf())
            .dataNascimento(dto.getDataNascimento())
            .tipo("ADMIN")
            .build();
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(administradorService.cadastrar(administrador));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Administrador> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(administradorService.buscarPorId(id));
    }
    
    @GetMapping
    public ResponseEntity<List<Administrador>> listarTodos() {
        return ResponseEntity.ok(administradorService.listarTodos());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Administrador> atualizar(@PathVariable Long id, @Valid @RequestBody AdministradorDTO dto) {
        Administrador administrador = administradorService.buscarPorId(id);
        administrador.setNome(dto.getNome());
        administrador.setEmail(dto.getEmail());
        administrador.setSenha(dto.getSenha());
        administrador.setCpf(dto.getCpf());
        administrador.setDataNascimento(dto.getDataNascimento());
        
        return ResponseEntity.ok(administradorService.atualizar(id, administrador));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        administradorService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
