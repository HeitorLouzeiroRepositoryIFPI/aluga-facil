package com.alugafacil.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "clientes")
@PrimaryKeyJoinColumn(name = "usuario_id")
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Cliente extends Usuario {
    
    @Column(nullable = false)
    private String telefone;
    
    @Column(nullable = false)
    private String endereco;
    
    @Column(nullable = false)
    private String status;
    
    @OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"cliente", "pagamentos", "valorMensal", "taxaAdministracao", "valorDeposito", "diaPagamento", "observacoes"})
    private List<Aluguel> alugueis = new ArrayList<>();
    
    @PrePersist
    public void prePersist() {
        this.setTipo("CLIENTE");
        if (this.status == null) {
            this.status = "ATIVO";
        }
    }
}