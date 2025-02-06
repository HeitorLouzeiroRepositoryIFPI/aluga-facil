package com.alugafacil.controller;

import com.alugafacil.dto.UsuarioDTO;
import com.alugafacil.model.Proprietario;
import com.alugafacil.service.ProprietarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proprietarios")
@RequiredArgsConstructor
public class ProprietarioController {
    
    private final ProprietarioService proprietarioService;
    
    @PostMapping
    public ResponseEntity<Proprietario> cadastrar(@Valid @RequestBody UsuarioDTO dto) {
        Proprietario proprietario = new Proprietario();
        proprietario.setNome(dto.getNome());
        proprietario.setEmail(dto.getEmail());
        proprietario.setSenha(dto.getSenha());
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(proprietarioService.cadastrar(proprietario));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Proprietario> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(proprietarioService.buscarPorId(id));
    }
    
    @GetMapping
    public ResponseEntity<List<Proprietario>> listarTodos() {
        return ResponseEntity.ok(proprietarioService.listarTodos());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Proprietario> atualizar(@PathVariable Long id, @Valid @RequestBody UsuarioDTO dto) {
        Proprietario proprietario = new Proprietario();
        proprietario.setNome(dto.getNome());
        proprietario.setEmail(dto.getEmail());
        proprietario.setSenha(dto.getSenha());
        
        return ResponseEntity.ok(proprietarioService.atualizar(id, proprietario));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        proprietarioService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
