package com.alugafacil.dto;

import com.alugafacil.model.Cliente;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String cpf;
    private String telefone;
    private String endereco;
    private LocalDate dataNascimento;
    private String status;
    private String tipo;

    public static ClienteResponseDTO fromEntity(Cliente cliente) {
        return ClienteResponseDTO.builder()
                .id(cliente.getId())
                .nome(cliente.getNome())
                .email(cliente.getEmail())
                .cpf(cliente.getCpf())
                .telefone(cliente.getTelefone())
                .endereco(cliente.getEndereco())
                .dataNascimento(cliente.getDataNascimento())
                .status(cliente.getStatus())
                .tipo(cliente.getTipo())
                .build();
    }
}
