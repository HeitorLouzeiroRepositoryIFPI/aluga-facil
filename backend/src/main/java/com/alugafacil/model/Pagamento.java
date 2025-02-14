package com.alugafacil.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pagamentos")
@Slf4j
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
    
    @Column
    private String formaPagamento;
    
    @Column
    private String observacoes;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "aluguel_id", nullable = false)
    @JsonIgnoreProperties({"pagamentos"})
    private Aluguel aluguel;
    
    @ManyToOne
    @JoinColumn(name = "historico_id")
    @JsonIgnoreProperties("pagamento")
    private HistoricoPagamento historicoPagamento;

    @PrePersist
    @PreUpdate
    public void atualizarStatus() {
        if (!"PAGO".equals(this.status) && !"CANCELADO".equals(this.status)) {
            LocalDate hoje = LocalDate.now();
            log.info("Atualizando status do pagamento {}: Data pagamento: {}, Hoje: {}", 
                    this.id, this.dataPagamento, hoje);
            
            if (this.dataPagamento.isBefore(hoje)) {
                log.info("Pagamento {} está atrasado", this.id);
                this.status = "ATRASADO";
            } else {
                log.info("Pagamento {} está pendente", this.id);
                this.status = "PENDENTE";
            }
        }
    }
}
