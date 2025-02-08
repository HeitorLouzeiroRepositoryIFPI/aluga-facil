package com.alugafacil.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
public class ImovelDTO {
    private Long id;
    private String codigo;
    
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    
    @NotBlank(message = "Endereço é obrigatório")
    private String endereco;
    
    @NotBlank(message = "Descrição é obrigatória")
    private String descricao;
    
    @NotNull(message = "Valor mensal é obrigatório")
    @Positive(message = "Valor mensal deve ser positivo")
    private Double valorMensal;
    
    private String status;
    
    @NotBlank(message = "Tipo é obrigatório")
    private String tipo;
    
    private List<String> fotos;
    private Long administradorId;
}
