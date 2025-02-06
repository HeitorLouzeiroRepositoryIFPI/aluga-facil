package com.alugafacil.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PagamentoDTO {
    private Long id;
    
    @NotNull(message = "Valor é obrigatório")
    @Positive(message = "Valor deve ser positivo")
    private Double valor;
    
    private LocalDate dataPagamento;
    private String status;
    private Long aluguelId;
}
