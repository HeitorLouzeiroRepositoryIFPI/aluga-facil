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
@Table(name = "administradores")
@PrimaryKeyJoinColumn(name = "usuario_id")
@EqualsAndHashCode(callSuper = true)
public class Administrador extends Usuario {
    
    @OneToMany(mappedBy = "administrador")
    @JsonIgnoreProperties({"administrador", "alugueis"})
    private List<Imovel> imoveis = new ArrayList<>();
    
    @PrePersist
    public void prePersist() {
        this.setTipo("ADMIN");
    }
}
