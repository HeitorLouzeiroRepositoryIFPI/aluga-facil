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
    
    @Column(nullable = false)
    private String cpf;
    
    @Column(nullable = false)
    private String telefone;
    
    @Column(nullable = false)
    private String endereco;
    
    @Column(nullable = false)
    private String dataNascimento;
    
    @Column(nullable = false)
    private String status;
    
    @OneToMany(mappedBy = "cliente")
    private List<Aluguel> alugueis;
    
    @OneToOne(mappedBy = "cliente", cascade = CascadeType.ALL)
    private HistoricoPagamento historicoPagamento;
    
    public Cliente() {
        super();
        setTipo("CLIENTE");
        this.status = "ATIVO";
    }
}