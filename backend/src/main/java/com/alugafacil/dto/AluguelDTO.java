package com.alugafacil.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AluguelDTO {
    private Long id;
    
    @NotNull(message = "Data de início é obrigatória")
    private LocalDate dataInicio;
    
    @NotNull(message = "Data de fim é obrigatória")
    @Future(message = "Data de fim deve ser futura")
    private LocalDate dataFim;
    
    private String status;
    
    @NotNull(message = "O ID do cliente é obrigatório")
    private Long clienteId;
    
    @NotNull(message = "O ID do imóvel é obrigatório")
    private Long imovelId;

    @NotNull(message = "O valor mensal é obrigatório")
    @Min(value = 0, message = "Valor mensal deve ser maior que zero")
    private Double valorMensal;

    @NotNull(message = "O valor do depósito é obrigatório")
    @Min(value = 0, message = "Valor do depósito deve ser maior que zero")
    private Double valorDeposito;

    private String observacoes;
}
