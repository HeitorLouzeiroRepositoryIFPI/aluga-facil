package com.alugafacil.repository;

import com.alugafacil.model.Cliente;
import com.alugafacil.model.HistoricoPagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HistoricoPagamentoRepository extends JpaRepository<HistoricoPagamento, Long> {
    Optional<HistoricoPagamento> findByCliente(Cliente cliente);
}
