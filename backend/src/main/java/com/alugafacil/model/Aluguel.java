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
@Table(name = "alugueis")
public class Aluguel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonBackReference
    private Cliente cliente;
    
    @ManyToOne
    @JoinColumn(name = "imovel_id", nullable = false)
    @JsonBackReference(value = "imovel-alugueis")
    private Imovel imovel;
    
    @Column(nullable = false)
    private LocalDate dataInicio;
    
    @Column(nullable = false)
    private LocalDate dataFim;
    
    @Column(nullable = false)
    private String status;
    
    @OneToMany(mappedBy = "aluguel", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Pagamento> pagamentos;
}
