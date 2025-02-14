package com.alugafacil.controller;

import com.alugafacil.dto.AluguelDTO;
import com.alugafacil.model.Aluguel;
import com.alugafacil.service.AluguelService;
import com.alugafacil.exception.BusinessException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alugueis")
@RequiredArgsConstructor
public class AluguelController {
    
    private final AluguelService aluguelService;
    private static final Logger log = LoggerFactory.getLogger(AluguelController.class);
    
    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody AluguelDTO dto) {
        try {
            log.info("Recebendo requisição para criar aluguel: {}", dto);
            
            Aluguel aluguel = Aluguel.builder()
                .dataInicio(dto.getDataInicio())
                .dataFim(dto.getDataFim())
                .valorMensal(dto.getValorMensal())
                .taxaAdministracao(dto.getTaxaAdministracao())
                .valorDeposito(dto.getValorDeposito())
                .diaPagamento(dto.getDiaPagamento())
                .observacoes(dto.getObservacoes())
                .status("ATIVO")
                .build();
            log.info("Aluguel mapeado: {}", aluguel);
            
            Aluguel aluguelSalvo = aluguelService.criar(aluguel, dto.getClienteId(), dto.getImovelId());
            log.info("Aluguel criado com sucesso: {}", aluguelSalvo);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(aluguelSalvo);
            
        } catch (BusinessException e) {
            log.error("Erro de negócio ao criar aluguel: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("Erro inesperado ao criar aluguel", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Erro interno ao criar aluguel: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Aluguel>> listar() {
        return ResponseEntity.ok(aluguelService.listarTodos());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Aluguel> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(aluguelService.buscarPorId(id));
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
    
    @GetMapping("/verificar-disponibilidade")
    public ResponseEntity<?> verificarDisponibilidade(
            @RequestParam Long imovelId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        try {
            log.info("Verificando disponibilidade para imóvel {} entre {} e {}", imovelId, dataInicio, dataFim);
            boolean disponivel = aluguelService.verificarDisponibilidade(imovelId, dataInicio, dataFim);
            log.info("Disponibilidade: {}", disponivel);
            return ResponseEntity.ok(Map.of("disponivel", disponivel));
        } catch (Exception e) {
            log.error("Erro ao verificar disponibilidade: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Erro ao verificar disponibilidade: " + e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> atualizarStatus(@PathVariable Long id, @RequestParam String status) {
        aluguelService.atualizarStatus(id, status);
        return ResponseEntity.noContent().build();
    }
}
