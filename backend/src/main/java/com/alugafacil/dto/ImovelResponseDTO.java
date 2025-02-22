package com.alugafacil.dto;

import com.alugafacil.model.Imovel;
import lombok.Data;

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
    private Long administradorId;
    private String administradorNome;
    private AdministradorDTO administrador;

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
        
        if (imovel.getAdministrador() != null) {
            dto.setAdministradorId(imovel.getAdministrador().getId());
            dto.setAdministradorNome(imovel.getAdministrador().getNome());
        }
        
        return dto;
    }
}
