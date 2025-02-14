package com.alugafacil.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "imoveis")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Imovel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String codigo;
    
    @Column(nullable = false)
    private String nome;
    
    @Column(nullable = false)
    private String tipo;
    
    @Column(nullable = false)
    private String endereco;
    
    @Column(nullable = false, length = 1000)
    private String descricao;
    
    @Column(nullable = false)
    private Double valorMensal;
    
    @Column(nullable = false)
    private String status;
    
    @ElementCollection
    @CollectionTable(name = "imovel_fotos", joinColumns = @JoinColumn(name = "imovel_id"))
    @Column(name = "url")
    private List<String> fotos = new ArrayList<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "administrador_id", nullable = false)
    @JsonIgnoreProperties({"imoveis", "senha"})
    @JsonBackReference
    private Administrador administrador;
    
    @OneToMany(mappedBy = "imovel", fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"imovel", "pagamentos", "valorMensal", "taxaAdministracao", "valorDeposito", "diaPagamento", "observacoes"})
    private List<Aluguel> alugueis = new ArrayList<>();
}
