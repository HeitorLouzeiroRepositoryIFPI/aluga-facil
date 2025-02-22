package com.alugafacil.repository;

import com.alugafacil.model.HistoricoPagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoricoPagamentoRepository extends JpaRepository<HistoricoPagamento, Long> {
}
