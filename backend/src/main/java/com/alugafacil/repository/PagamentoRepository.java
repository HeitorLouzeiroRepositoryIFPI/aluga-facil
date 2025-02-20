package com.alugafacil.repository; // Define o pacote onde o repositório está localizado

import com.alugafacil.model.Aluguel;
import com.alugafacil.model.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Interface de repositório para a entidade Pagamento.
 * Estende JpaRepository, permitindo operações CRUD automáticas.
 */
@Repository // Indica que esta interface é um repositório do Spring
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {

    /**
     * Busca todos os pagamentos associados a um determinado aluguel.
     *
     * @param aluguel Objeto Aluguel
     * @return Lista de pagamentos relacionados ao aluguel informado
     */
    List<Pagamento> findByAluguel(Aluguel aluguel);

    /**
     * Busca todos os pagamentos com um determinado status.
     *
     * @param status Status do pagamento (Exemplo: "Pago", "Pendente", "Atrasado")
     * @return Lista de pagamentos que correspondem ao status informado
     */
    List<Pagamento> findByStatus(String status);

    /**
     * Busca todos os pagamentos realizados dentro de um período específico.
     *
     * @param inicio Data inicial do intervalo
     * @param fim    Data final do intervalo
     * @return Lista de pagamentos dentro do período especificado
     */
    List<Pagamento> findByDataPagamentoBetween(LocalDate inicio, LocalDate fim);

    /**
     * Busca todos os pagamentos de um aluguel específico que possuem um determinado status.
     *
     * @param aluguel Objeto Aluguel
     * @param status  Status do pagamento
     * @return Lista de pagamentos do aluguel informado que correspondem ao status especificado
     */
    List<Pagamento> findByAluguelAndStatus(Aluguel aluguel, String status);

    /**
     * Busca todos os pagamentos associados a um aluguel pelo ID do aluguel.
     *
     * @param aluguelId ID do aluguel
     * @return Lista de pagamentos relacionados ao aluguel informado
     */
    List<Pagamento> findByAluguelId(Long aluguelId);

    /**
     * Busca todos os pagamentos com um determinado status cuja data de pagamento seja menor ou igual à data especificada.
     *
     * @param status Status do pagamento (Exemplo: "Pendente", "Atrasado")
     * @param data   Data limite para filtrar os pagamentos
     * @return Lista de pagamentos que atendem aos critérios informados
     */
    List<Pagamento> findByStatusAndDataPagamentoLessThanEqual(String status, LocalDate data);
}
