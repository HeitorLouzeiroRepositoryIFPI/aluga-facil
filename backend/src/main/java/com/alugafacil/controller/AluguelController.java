package com.alugafacil.controller;

import com.alugafacil.dto.AluguelDTO;
import com.alugafacil.model.Aluguel;
import com.alugafacil.service.AluguelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/alugueis")
@RequiredArgsConstructor
public class AluguelController {
    
    private final AluguelService aluguelService;
    
    @PostMapping
    public ResponseEntity<Aluguel> criar(@Valid @RequestBody AluguelDTO dto) {
        Aluguel aluguel = new Aluguel();
        aluguel.setDataInicio(dto.getDataInicio());
        aluguel.setDataFim(dto.getDataFim());
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(aluguelService.criar(aluguel, dto.getClienteId(), dto.getImovelId()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Aluguel> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(aluguelService.buscarPorId(id));
    }
    
    @GetMapping
    public ResponseEntity<List<Aluguel>> listarTodos() {
        return ResponseEntity.ok(aluguelService.listarTodos());
    }
    
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Aluguel>> listarPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(aluguelService.listarPorCliente(clienteId));
    }
    
    @GetMapping("/imovel/{imovelId}")
    public ResponseEntity<List<Aluguel>> listarPorImovel(@PathVariable Long imovelId) {
        return ResponseEntity.ok(aluguelService.listarPorImovel(imovelId));
    }
    
    @GetMapping("/periodo")
    public ResponseEntity<List<Aluguel>> listarPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        return ResponseEntity.ok(aluguelService.listarPorPeriodo(inicio, fim));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> atualizarStatus(@PathVariable Long id, @RequestParam String status) {
        aluguelService.atualizarStatus(id, status);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        aluguelService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
