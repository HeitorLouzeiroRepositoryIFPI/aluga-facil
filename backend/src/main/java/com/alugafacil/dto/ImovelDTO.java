package com.alugafacil.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.Data;

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
    
    @NotNull(message = "O valor mensal é obrigatório")
    @Positive(message = "O valor mensal deve ser maior ou igual a zero")
    private Double valorMensal;
    
    private String status;
    
    @NotBlank(message = "Tipo é obrigatório")
    private String tipo;
    
    private Long administradorId;
}
