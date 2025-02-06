package com.alugafacil.controller;

import com.alugafacil.dto.ImovelDTO;
import com.alugafacil.model.Imovel;
import com.alugafacil.service.ImovelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/imoveis")
@RequiredArgsConstructor
public class ImovelController {
    
    private final ImovelService imovelService;
    
    @PostMapping
    public ResponseEntity<Imovel> cadastrar(@Valid @RequestBody ImovelDTO dto) {
        Imovel imovel = new Imovel();
        imovel.setNome(dto.getNome());
        imovel.setEndereco(dto.getEndereco());
        imovel.setDescricao(dto.getDescricao());
        imovel.setValorMensal(dto.getValorMensal());
        imovel.setTipo(dto.getTipo());
        imovel.setFotos(dto.getFotos());
        imovel.setStatus("DISPONIVEL");
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(imovelService.cadastrar(imovel, dto.getProprietarioId()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Imovel> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(imovelService.buscarPorId(id));
    }
    
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Imovel> buscarPorCodigo(@PathVariable String codigo) {
        return ResponseEntity.ok(imovelService.buscarPorCodigo(codigo));
    }
    
    @GetMapping
    public ResponseEntity<List<Imovel>> listarTodos() {
        return ResponseEntity.ok(imovelService.listarTodos());
    }
    
    @GetMapping("/proprietario/{proprietarioId}")
    public ResponseEntity<List<Imovel>> listarPorProprietario(@PathVariable Long proprietarioId) {
        return ResponseEntity.ok(imovelService.listarPorProprietario(proprietarioId));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Imovel>> listarPorStatus(@PathVariable String status) {
        return ResponseEntity.ok(imovelService.listarPorStatus(status));
    }
    
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Imovel>> listarPorTipo(@PathVariable String tipo) {
        return ResponseEntity.ok(imovelService.listarPorTipo(tipo));
    }
    
    @GetMapping("/valor/{valor}")
    public ResponseEntity<List<Imovel>> listarPorValorMaximo(@PathVariable Double valor) {
        return ResponseEntity.ok(imovelService.listarPorValorMaximo(valor));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Imovel> atualizar(@PathVariable Long id, @Valid @RequestBody ImovelDTO dto) {
        Imovel imovel = new Imovel();
        imovel.setNome(dto.getNome());
        imovel.setEndereco(dto.getEndereco());
        imovel.setDescricao(dto.getDescricao());
        imovel.setValorMensal(dto.getValorMensal());
        imovel.setTipo(dto.getTipo());
        imovel.setFotos(dto.getFotos());
        
        return ResponseEntity.ok(imovelService.atualizar(id, imovel));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> atualizarStatus(@PathVariable Long id, @RequestParam String status) {
        imovelService.atualizarStatus(id, status);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        imovelService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
