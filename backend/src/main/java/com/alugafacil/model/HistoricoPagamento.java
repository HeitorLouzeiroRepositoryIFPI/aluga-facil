package com.alugafacil.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "historico_pagamentos")
public class HistoricoPagamento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private LocalDate dataPagamento;
    
    @Column(nullable = false)
    private Double valor;
    
    @Column(nullable = false)
    private String formaPagamento;
    
    @OneToMany(mappedBy = "historicoPagamento", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Pagamento> pagamentos;
}
