package com.alugafacil.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import java.util.List;

@Data
@SuperBuilder
@Entity
@Table(name = "clientes")
@EqualsAndHashCode(callSuper = true)
@PrimaryKeyJoinColumn(name = "usuario_id")
public class Cliente extends Usuario {
    
    @Column(nullable = false)
    private String telefone;
    
    @Column(nullable = false)
    private String endereco;
    
    @Column(nullable = false)
    private String status;
    
    @OneToMany(mappedBy = "cliente")
    @JsonManagedReference
    private List<Aluguel> alugueis;
    
    @OneToOne(mappedBy = "cliente", cascade = CascadeType.ALL)
    @JsonManagedReference
    private HistoricoPagamento historicoPagamento;
    
    public Cliente() {
        super();
        setTipo("CLIENTE");
        this.status = "ATIVO";
    }
}