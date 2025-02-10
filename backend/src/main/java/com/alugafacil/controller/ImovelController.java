package com.alugafacil.controller;

import com.alugafacil.dto.ImovelDTO;
import com.alugafacil.dto.ImovelResponseDTO;
import com.alugafacil.exception.ResourceNotFoundException;
import com.alugafacil.model.Imovel;
import com.alugafacil.service.ImovelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/imoveis")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ImovelController {
    
    private final ImovelService imovelService;
    
    @PostMapping
    public ResponseEntity<ImovelResponseDTO> cadastrar(@Valid @RequestBody ImovelDTO dto) {
        Imovel imovel = new Imovel();
        imovel.setCodigo(UUID.randomUUID().toString());
        imovel.setNome(dto.getNome());
        imovel.setEndereco(dto.getEndereco());
        imovel.setDescricao(dto.getDescricao());
        imovel.setValorMensal(dto.getValorMensal());
        imovel.setTipo(dto.getTipo());
        imovel.setFotos(dto.getFotos());
        imovel.setStatus("DISPONIVEL");
        
        Imovel novoImovel = imovelService.cadastrar(imovel, dto.getAdministradorId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ImovelResponseDTO.fromEntity(novoImovel));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ImovelResponseDTO> buscarPorId(@PathVariable Long id) {
        Imovel imovel = imovelService.buscarPorId(id);
        if (imovel != null) {
            return ResponseEntity.ok(ImovelResponseDTO.fromEntity(imovel));
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<ImovelResponseDTO> buscarPorCodigo(@PathVariable String codigo) {
        Imovel imovel = imovelService.buscarPorCodigo(codigo);
        if (imovel != null) {
            return ResponseEntity.ok(ImovelResponseDTO.fromEntity(imovel));
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping
    public ResponseEntity<List<ImovelResponseDTO>> listarTodos() {
        List<Imovel> imoveis = imovelService.listarTodos();
        List<ImovelResponseDTO> dtos = imoveis.stream()
            .map(ImovelResponseDTO::fromEntity)
            .toList();
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/administrador/{administradorId}")
    public ResponseEntity<List<ImovelResponseDTO>> listarPorAdministrador(@PathVariable Long administradorId) {
        List<Imovel> imoveis = imovelService.listarPorAdministrador(administradorId);
        List<ImovelResponseDTO> dtos = imoveis.stream()
            .map(ImovelResponseDTO::fromEntity)
            .toList();
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ImovelResponseDTO>> listarPorStatus(@PathVariable String status) {
        List<Imovel> imoveis = imovelService.listarPorStatus(status.toUpperCase());
        List<ImovelResponseDTO> dtos = imoveis.stream()
            .map(ImovelResponseDTO::fromEntity)
            .toList();
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<ImovelResponseDTO>> listarPorTipo(@PathVariable String tipo) {
        List<Imovel> imoveis = imovelService.listarPorTipo(tipo.toUpperCase());
        List<ImovelResponseDTO> dtos = imoveis.stream()
            .map(ImovelResponseDTO::fromEntity)
            .toList();
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/valor/{valor}")
    public ResponseEntity<List<ImovelResponseDTO>> listarPorValorMaximo(@PathVariable Double valor) {
        List<Imovel> imoveis = imovelService.listarPorValorMaximo(valor);
        List<ImovelResponseDTO> dtos = imoveis.stream()
            .map(ImovelResponseDTO::fromEntity)
            .toList();
        return ResponseEntity.ok(dtos);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ImovelResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody ImovelDTO dto) {
        Imovel imovelExistente = imovelService.buscarPorId(id);
        if (imovelExistente == null) {
            return ResponseEntity.notFound().build();
        }

        imovelExistente.setNome(dto.getNome());
        imovelExistente.setEndereco(dto.getEndereco());
        imovelExistente.setDescricao(dto.getDescricao());
        imovelExistente.setValorMensal(dto.getValorMensal());
        imovelExistente.setTipo(dto.getTipo());
        imovelExistente.setFotos(dto.getFotos());
        
        Imovel imovelAtualizado = imovelService.atualizar(id, imovelExistente);
        return ResponseEntity.ok(ImovelResponseDTO.fromEntity(imovelAtualizado));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<ImovelResponseDTO> atualizarStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Imovel imovelAtualizado = imovelService.atualizarStatus(id, status.toUpperCase());
            return ResponseEntity.ok(ImovelResponseDTO.fromEntity(imovelAtualizado));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (imovelService.buscarPorId(id) == null) {
            return ResponseEntity.notFound().build();
        }
        imovelService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
