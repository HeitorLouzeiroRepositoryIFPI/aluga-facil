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
    
    @NotNull(message = "Data de pagamento é obrigatória")
    private LocalDate dataPagamento;
    
    @NotNull(message = "Status é obrigatório")
    private String status;
    
    @NotNull(message = "Aluguel é obrigatório")
    private Long aluguelId;
    
    private String formaPagamento;
}
