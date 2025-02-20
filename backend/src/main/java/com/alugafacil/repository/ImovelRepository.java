package com.alugafacil.repository; // Define o pacote onde este repositório está localizado

import com.alugafacil.model.Administrador;
import com.alugafacil.model.Imovel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Interface de repositório para a entidade Imovel.
 * Extende JpaRepository para fornecer operações básicas de CRUD automaticamente.
 */
@Repository // Indica que esta interface é um repositório gerenciado pelo Spring
public interface ImovelRepository extends JpaRepository<Imovel, Long> {

    /**
     * Busca todos os imóveis cadastrados por um determinado administrador.
     *
     * @param administrador Objeto Administrador
     * @return Lista de imóveis associados ao administrador
     */
    List<Imovel> findByAdministrador(Administrador administrador);

    /**
     * Busca um imóvel pelo código único de identificação.
     *
     * @param codigo Código do imóvel
     * @return Um Optional contendo o imóvel, caso exista
     */
    Optional<Imovel> findByCodigo(String codigo);

    /**
     * Busca todos os imóveis que possuem um determinado status.
     *
     * @param status Status do imóvel (Exemplo: "Disponível", "Alugado")
     * @return Lista de imóveis com o status informado
     */
    List<Imovel> findByStatus(String status);

    /**
     * Busca todos os imóveis de um determinado tipo.
     *
     * @param tipo Tipo do imóvel (Exemplo: "Casa", "Apartamento", "Terreno")
     * @return Lista de imóveis que correspondem ao tipo informado
     */
    List<Imovel> findByTipo(String tipo);

    /**
     * Busca todos os imóveis com um valor de aluguel mensal menor ou igual ao valor especificado.
     *
     * @param valor Valor máximo do aluguel mensal
     * @return Lista de imóveis com aluguel mensal dentro do limite informado
     */
    List<Imovel> findByValorMensalLessThanEqual(Double valor);
}
