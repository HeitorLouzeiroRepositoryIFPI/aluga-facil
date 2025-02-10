package com.alugafacil.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "imoveis")
public class Imovel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String codigo;
    
    @Column(nullable = false)
    private String nome;
    
    @Column(nullable = false)
    private String endereco;
    
    @Column(nullable = false, length = 1000)
    private String descricao;
    
    @Column(nullable = false)
    private Double valorMensal;
    
    @Column(nullable = false)
    private String status;
    
    @Column(nullable = false)
    private String tipo;
    
    @ElementCollection
    @CollectionTable(name = "imovel_fotos", joinColumns = @JoinColumn(name = "imovel_id"))
    @Column(name = "url")
    private List<String> fotos;
    
    @ManyToOne
    @JoinColumn(name = "administrador_id", nullable = false)
    @JsonBackReference
    private Administrador administrador;
    
    @OneToMany(mappedBy = "imovel")
    private List<Aluguel> alugueis;
}
