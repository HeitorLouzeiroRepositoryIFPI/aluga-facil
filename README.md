# AlugaFácil - Sistema de Aluguel de Imóveis

Sistema de gerenciamento de aluguel de imóveis desenvolvido com Spring Boot.

## Tecnologias Utilizadas

- Java 17
- Spring Boot 3.2.2
- Spring Security
- Spring Data JPA
- Mysql
- JWT para autenticação
- Maven

## Estrutura do Projeto

O projeto segue uma arquitetura em camadas:

- `config`: Configurações do Spring e segurança
- `controller`: Endpoints da API REST
- `model`: Entidades JPA
- `repository`: Interfaces de acesso aos dados
- `service`: Lógica de negócio
- `dto`: Objetos de transferência de dados
- `security`: Classes relacionadas à segurança
- `exception`: Tratamento de exceções

## Configuração do Ambiente

1. Instale o Java 17
2. Instale o PostgreSQL
3. Configure as credenciais do banco de dados em `application.properties`
4. Execute o projeto usando Maven: `mvn spring-boot:run`

## Funcionalidades Principais

- Cadastro e autenticação de usuários (Proprietários e Clientes)
- Gerenciamento de imóveis
- Sistema de aluguel
- Controle de pagamentos
- Histórico de aluguéis e pagamentos
