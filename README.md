# AlugaFácil - Sistema de Aluguel de Imóveis

<div align="center">
  <h3 align="center">AlugaFácil</h3>
  <p align="center">
    Sistema de gerenciamento de aluguel de imóveis desenvolvido com Spring Boot e Next.js
    <br/>
    <a href="https://github.com/HeitorLouzeiroRepositoryIFPI/aluga-facil/issues">Reportar Bug</a>
    ·
    <a href="https://github.com/HeitorLouzeiroRepositoryIFPI/aluga-facil/issues">Sugerir Feature</a>
  </p>
</div>

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
  - [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Começando](#começando)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Criando o Primeiro Administrador](#criando-o-primeiro-administrador)
- [Uso](#uso)
- [Roadmap](#roadmap)
- [Contribuindo](#contribuindo)
- [Licença](#licença)
- [Contato](#contato)

## Sobre o Projeto

O AlugaFácil é um sistema completo para gerenciamento de aluguéis de imóveis, desenvolvido com tecnologias modernas para oferecer uma experiência eficiente tanto para proprietários quanto para inquilinos.

### Tecnologias

#### Backend
- Java 17
- Spring Boot 3.2.2
- Spring Security com JWT
- Spring Data JPA
- MySQL
- Maven

#### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn/ui

## Funcionalidades

- **Gestão de Imóveis**: Cadastro e gerenciamento completo
- **Controle de Usuários**: Administradores e inquilinos
- **Contratos**: Geração de contratos de aluguel
- **Pagamentos**: Controle de pagamentos e histórico
- **Dashboard**: Visualização de dados e relatórios
- **Segurança**: Autenticação JWT e controle de acesso

## Começando

### Pré-requisitos

* Java 17
* Node.js 18+
* MySQL
* Maven

### Instalação

1. Clone o repositório
   ```sh
   git clone https://github.com/HeitorLouzeiroRepositoryIFPI/aluga-facil.git
   ```

2. Configure o backend
   ```sh
   cd backend
   cp .env.example .env   # Configure suas variáveis de ambiente
   mvn install
   ```

3. Configure o frontend
   ```sh
   cd frontend
   npm install
   ```

4. Inicie o backend
   ```sh
   cd backend
   mvn spring-boot:run
   ```

5. Inicie o frontend
   ```sh
   cd frontend
   npm run dev
   ```

### Criando o Primeiro Administrador

Para criar o primeiro administrador do sistema, faça uma requisição POST para o endpoint `/api/administradores/`:

```sh
curl -X POST http://localhost:8080/api/administradores/ \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "administrador",
    "email": "administrador@gmail.com",
    "senha": "12345678",
    "cpf":"54900833606",
    "endereco":"Rua Rio Solimões",
    "telefone":"27987685379",
    "dataNascimento":"2000-06-06"
  }'
```

Após criar o primeiro administrador, você poderá fazer login no sistema usando o email e senha cadastrados.

### Documentação da API (Swagger)

Após iniciar o backend, você pode acessar a documentação interativa da API através do Swagger UI:

```
http://localhost:8080/swagger-ui/index.html
```

No Swagger UI você pode:
- Visualizar todos os endpoints disponíveis
- Testar as requisições diretamente pela interface
- Ver os modelos de dados e parâmetros necessários
- Autenticar-se usando JWT para testar endpoints protegidos

## Roadmap

- [x] Autenticação e Autorização
- [x] CRUD de Imóveis
- [x] CRUD de usuarios
- [x] Gestão de Contratos
- [x] Sistema de Pagamentos

## Contribuindo

1. Faça um Fork do projeto
2. Crie sua Feature Branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a Branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

## Contato

<div align='center'>  
  <a href="https://www.instagram.com/heitorlouzeiro/" target="_blank">
    <img src="https://img.shields.io/badge/-Instagram-%23E4405F?style=for-the-badge&logo=instagram&logoColor=white" target="_blank">
  </a> 
  <a href = "mailto:heitorlouzeirodev@gmail.com">
    <img src="https://img.shields.io/badge/-Gmail-%23333?style=for-the-badge&logo=gmail&logoColor=white" target="_blank">    
  </a>
  <a href="https://www.linkedin.com/in/heitor-louzeiro/" target="_blank">
    <img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank">
  </a> 
</div>