package com.alugafacil.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import jakarta.annotation.PostConstruct; 


import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@Entity
@Table(name = "proprietarios")
@EqualsAndHashCode(callSuper = true)
@PrimaryKeyJoinColumn(name = "usuario_id")
public class Proprietario extends Usuario {
    
    @OneToMany(mappedBy = "proprietario", cascade = CascadeType.ALL)
    private List<Imovel> imoveis;

    @PostConstruct
    public void init() {
        setTipo("PROPRIETARIO");
    }
}
