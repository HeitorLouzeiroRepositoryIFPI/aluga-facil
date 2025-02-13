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
    private Long clienteId;
    private Long imovelId;

    @NotNull(message = "Valor mensal é obrigatório")
    @Min(value = 0, message = "Valor mensal deve ser maior que zero")
    private Double valorMensal;

    @NotNull(message = "Taxa de administração é obrigatória")
    @Min(value = 0, message = "Taxa de administração deve ser maior que zero")
    private Double taxaAdministracao;

    @NotNull(message = "Valor do depósito é obrigatório")
    @Min(value = 0, message = "Valor do depósito deve ser maior que zero")
    private Double valorDeposito;

    @NotNull(message = "Dia do pagamento é obrigatório")
    @Min(value = 1, message = "Dia do pagamento deve ser entre 1 e 31")
    private Integer diaPagamento;

    private String observacoes;
}
