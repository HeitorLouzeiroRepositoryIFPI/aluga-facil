package com.alugafacil.dto;

import com.alugafacil.model.Imovel;
import lombok.Data;

import java.util.List;

@Data
public class ImovelResponseDTO {
    private Long id;
    private String codigo;
    private String nome;
    private String endereco;
    private String descricao;
    private Double valorMensal;
    private String tipo;
    private String status;
    private List<String> fotos;
    private Long administradorId;
    private String administradorNome;

    public static ImovelResponseDTO fromEntity(Imovel imovel) {
        ImovelResponseDTO dto = new ImovelResponseDTO();
        dto.setId(imovel.getId());
        dto.setCodigo(imovel.getCodigo());
        dto.setNome(imovel.getNome());
        dto.setEndereco(imovel.getEndereco());
        dto.setDescricao(imovel.getDescricao());
        dto.setValorMensal(imovel.getValorMensal());
        dto.setTipo(imovel.getTipo());
        dto.setStatus(imovel.getStatus());
        dto.setFotos(imovel.getFotos());
        
        if (imovel.getAdministrador() != null) {
            dto.setAdministradorId(imovel.getAdministrador().getId());
            dto.setAdministradorNome(imovel.getAdministrador().getNome());
        }
        
        return dto;
    }
}
