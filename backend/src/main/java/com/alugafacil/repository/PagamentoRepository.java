package com.alugafacil.repository;

import com.alugafacil.model.Aluguel;
import com.alugafacil.model.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
    List<Pagamento> findByAluguel(Aluguel aluguel);
    List<Pagamento> findByStatus(String status);
    List<Pagamento> findByDataPagamentoBetween(LocalDate inicio, LocalDate fim);
    List<Pagamento> findByAluguelAndStatus(Aluguel aluguel, String status);
    List<Pagamento> findByAluguelId(Long aluguelId);
    List<Pagamento> findByStatusAndDataPagamentoLessThanEqual(String status, LocalDate data);
}
