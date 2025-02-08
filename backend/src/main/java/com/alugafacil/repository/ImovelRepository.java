package com.alugafacil.repository;

import com.alugafacil.model.Administrador;
import com.alugafacil.model.Imovel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImovelRepository extends JpaRepository<Imovel, Long> {
    List<Imovel> findByAdministrador(Administrador administrador);
    Optional<Imovel> findByCodigo(String codigo);
    List<Imovel> findByStatus(String status);
    List<Imovel> findByTipo(String tipo);
    List<Imovel> findByValorMensalLessThanEqual(Double valor);
}
