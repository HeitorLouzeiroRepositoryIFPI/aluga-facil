package com.alugafacil.repository;

import com.alugafacil.model.Aluguel;
import com.alugafacil.model.Cliente;
import com.alugafacil.model.Imovel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AluguelRepository extends JpaRepository<Aluguel, Long> {
    List<Aluguel> findByCliente(Cliente cliente);
    List<Aluguel> findByImovel(Imovel imovel);
    List<Aluguel> findByImovelAndStatus(Imovel imovel, String status);
    List<Aluguel> findByImovelAndStatusAndDataFimGreaterThanEqual(Imovel imovel, String status, LocalDate data);
    List<Aluguel> findByDataInicioBetweenOrDataFimBetween(LocalDate inicio1, LocalDate fim1, LocalDate inicio2, LocalDate fim2);
}
