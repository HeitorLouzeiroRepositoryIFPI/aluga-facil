package com.alugafacil.controller;

import com.alugafacil.dto.PagamentoDTO;
import com.alugafacil.model.Pagamento;
import com.alugafacil.service.PagamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/pagamentos")
@RequiredArgsConstructor
public class PagamentoController {
    
    private final PagamentoService pagamentoService;
    
    @PostMapping
    public ResponseEntity<Pagamento> criar(@Valid @RequestBody PagamentoDTO dto) {
        Pagamento pagamento = new Pagamento();
        pagamento.setValor(dto.getValor());
        pagamento.setDataPagamento(dto.getDataPagamento());
        pagamento.setStatus(dto.getStatus());
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(pagamentoService.criar(pagamento));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Pagamento> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pagamentoService.buscarPorId(id));
    }
    
    @GetMapping
    public ResponseEntity<List<Pagamento>> listarTodos() {
        return ResponseEntity.ok(pagamentoService.listarTodos());
    }
    
    @GetMapping("/aluguel/{aluguelId}")
    public ResponseEntity<List<Pagamento>> listarPorAluguel(@PathVariable Long aluguelId) {
        return ResponseEntity.ok(pagamentoService.listarPorAluguel(aluguelId));
    }
    
    @GetMapping("/periodo")
    public ResponseEntity<List<Pagamento>> listarPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        return ResponseEntity.ok(pagamentoService.listarPorPeriodo(inicio, fim));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> atualizarStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String formaPagamento) {
        pagamentoService.atualizarStatus(id, status, formaPagamento);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        pagamentoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
