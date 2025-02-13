package com.alugafacil.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pagamentos")
public class Pagamento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private LocalDate dataPagamento;
    
    @Column(nullable = false)
    private Double valor;
    
    @Column(nullable = false)
    private String status;
    
    @ManyToOne
    @JoinColumn(name = "aluguel_id", nullable = false)
    @JsonIgnoreProperties({"pagamentos", "cliente", "imovel"})
    private Aluguel aluguel;
    
    @ManyToOne
    @JoinColumn(name = "historico_id")
    @JsonIgnoreProperties("pagamento")
    private HistoricoPagamento historicoPagamento;
}
