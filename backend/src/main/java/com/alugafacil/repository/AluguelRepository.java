package com.alugafacil.repository; // Define o pacote do repositório

import com.alugafacil.model.Aluguel;
import com.alugafacil.model.Cliente;
import com.alugafacil.model.Imovel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Interface de repositório para a entidade Aluguel.
 * Extende JpaRepository para fornecer operações básicas de CRUD automaticamente.
 */
@Repository // Indica que esta interface é um componente de repositório do Spring
public interface AluguelRepository extends JpaRepository<Aluguel, Long> {

    /**
     * Busca todos os aluguéis de um determinado cliente.
     *
     * @param cliente Objeto Cliente
     * @return Lista de aluguéis associados ao cliente
     */
    List<Aluguel> findByCliente(Cliente cliente);

    /**
     * Busca todos os aluguéis de um determinado imóvel.
     *
     * @param imovel Objeto Imovel
     * @return Lista de aluguéis associados ao imóvel
     */
    List<Aluguel> findByImovel(Imovel imovel);

    /**
     * Busca aluguéis de um imóvel filtrando pelo status.
     *
     * @param imovel Objeto Imovel
     * @param status Status do aluguel (Exemplo: "Ativo", "Finalizado")
     * @return Lista de aluguéis do imóvel com o status informado
     */
    List<Aluguel> findByImovelAndStatus(Imovel imovel, String status);

    /**
     * Busca aluguéis de um imóvel com determinado status e cujo prazo ainda não expirou.
     *
     * @param imovel Objeto Imovel
     * @param status Status do aluguel
     * @param data Data mínima (o aluguel ainda está válido se a data de término for maior ou igual a esta)
     * @return Lista de aluguéis do imóvel filtrados pelo status e validade
     */
    List<Aluguel> findByImovelAndStatusAndDataFimGreaterThanEqual(Imovel imovel, String status, LocalDate data);

    /**
     * Busca aluguéis que possuem a data de início ou a data de fim dentro de um determinado período.
     *
     * @param inicio1 Data de início do primeiro intervalo
     * @param fim1 Data de fim do primeiro intervalo
     * @param inicio2 Data de início do segundo intervalo
     * @param fim2 Data de fim do segundo intervalo
     * @return Lista de aluguéis que possuem interseção com os períodos informados
     */
    List<Aluguel> findByDataInicioBetweenOrDataFimBetween(LocalDate inicio1, LocalDate fim1, LocalDate inicio2, LocalDate fim2);
}
