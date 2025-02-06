package com.alugafacil.model;

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
    
    @OneToMany(mappedBy = "cliente")
    private List<Aluguel> alugueis;
    
    @OneToOne(mappedBy = "cliente", cascade = CascadeType.ALL)
    private HistoricoPagamento historicoPagamento;
    
    public Cliente() {
        super();
        setTipo("CLIENTE");
    }
}