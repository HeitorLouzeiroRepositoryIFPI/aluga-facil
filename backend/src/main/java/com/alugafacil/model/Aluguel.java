package com.alugafacil.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "alugueis")
public class Aluguel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private LocalDate dataInicio;
    
    @Column(nullable = false)
    private LocalDate dataFim;
    
    @Column(nullable = false)
    private Double valorMensal;
    
    @Column(nullable = false)
    private Double taxaAdministracao;
    
    @Column(nullable = false)
    private Double valorDeposito;
    
    @Column(nullable = false)
    private Integer diaPagamento;
    
    private String observacoes;
    
    @Column(nullable = false)
    private String status;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonIgnoreProperties({"alugueis", "senha", "endereco", "telefone", "status"})
    private Cliente cliente;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "imovel_id", nullable = false)
    @JsonIgnoreProperties({"alugueis", "administrador", "descricao", "fotos", "status", "valorMensal", "tipo", "endereco"})
    private Imovel imovel;
    
    @OneToMany(mappedBy = "aluguel", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("aluguel")
    private List<Pagamento> pagamentos = new ArrayList<>();
}
