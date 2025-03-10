package com.alugafacil.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pagamentos")
public class Pagamento {
    
    private static final Logger logger = LoggerFactory.getLogger(Pagamento.class);
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column
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
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "historico_id")
    @JsonManagedReference
    private HistoricoPagamento historicoPagamento;

    @PrePersist
    @PreUpdate
    public void atualizarStatus() {
        // Se já estiver pago ou cancelado, não altera o status
        if ("PAGO".equals(this.status) || "CANCELADO".equals(this.status)) {
            return;
        }
        
        // Se não tiver status definido ou for PENDENTE/ATRASADO, atualiza baseado na data
        LocalDate hoje = LocalDate.now();
        logger.info("Atualizando status do pagamento {}: Data pagamento: {}, Hoje: {}", 
                this.id, this.dataPagamento, hoje);
        
        if (this.dataPagamento != null && this.dataPagamento.isBefore(hoje)) {
            logger.info("Pagamento {} está atrasado", this.id);
            this.status = "ATRASADO";
        } else {
            logger.info("Pagamento {} está pendente", this.id);
            this.status = "PENDENTE";
        }
    }
}
