# Gestão de Leads - Backend

## Descrição

Este projeto é o backend para um sistema de gestão de leads, desenvolvido como um teste técnico. Ele fornece uma API robusta para gerenciar usuários, acessos e leads, com funcionalidades de autenticação e persistência de dados utilizando Prisma ORM e PostgreSQL.

## Tecnologias Utilizadas

O projeto foi construído com as seguintes tecnologias:

*   **TypeScript**: Linguagem de programação para maior segurança e escalabilidade.
*   **Node.js**: Ambiente de execução JavaScript.
*   **Fastify**: Framework web rápido e de baixo overhead para Node.js.
*   **Prisma ORM**: ORM moderno para Node.js e TypeScript, facilitando a interação com o banco de dados.
*   **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional.
*   **Bcryptjs**: Biblioteca para hash de senhas.
*   **jsonwebtoken**: Implementação de JSON Web Tokens para autenticação.
*   **tsx**: Ferramenta para executar TypeScript diretamente no Node.js.
*   **@fastify/swagger** e **@fastify/swagger-ui**: Para documentação automática da API.

## Pré-requisitos

Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

*   Node.js (versão 18 ou superior)
*   npm (gerenciador de pacotes do Node.js)
*   Docker e Docker Compose (opcional, para rodar o PostgreSQL em um container)
*   PostgreSQL (se não for usar Docker)

## Instalação

Siga os passos abaixo para configurar o projeto em sua máquina local:

1.  **Clone o repositório:**

    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd management-leads-back-main
    ```

    *(Nota: Substitua `<URL_DO_REPOSITORIO>` pela URL real do seu repositório.)*

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

## Configuração do Banco de Dados

Este projeto utiliza PostgreSQL. Você pode configurá-lo localmente ou usar Docker.

### Usando Docker Compose (Recomendado)

1.  Certifique-se de ter o Docker e o Docker Compose instalados.
2.  Crie um arquivo `.env` na raiz do projeto, baseado no `.env.example` (se houver), e configure a variável `DATABASE_URL` para apontar para o seu container PostgreSQL. Exemplo:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"
    ```

3.  Inicie o container do PostgreSQL:

    ```bash
    docker-compose up -d
    ```

4.  Execute as migrações do Prisma para criar o esquema do banco de dados:

    ```bash
    npx prisma migrate dev --name init
    ```

### Configuração Manual do PostgreSQL

1.  Certifique-se de ter uma instância do PostgreSQL rodando.
2.  Crie um novo banco de dados para o projeto (ex: `mydatabase`).
3.  Crie um arquivo `.env` na raiz do projeto e configure a variável `DATABASE_URL` com as credenciais do seu banco de dados. Exemplo:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"
    ```

4.  Execute as migrações do Prisma para criar o esquema do banco de dados:

    ```bash
    npx prisma migrate dev --name init
    ```

## Seeders (IMPORTANTE!)

**É crucial executar os seeders de acesso e de usuário administrador ANTES de iniciar o backend pela primeira vez.** Isso garante que o sistema tenha os dados iniciais necessários para autenticação e controle de acesso.

Execute os seguintes comandos na raiz do projeto:

1.  **Criar acessos padrão:**

    ```bash
    npm run db:seed:access
    ```

2.  **Criar usuário administrador inicial:**

    ```bash
    npm run db:seed:admin
    ```

## Execução do Backend

Após a instalação, configuração do banco de dados e execução dos seeders, você pode iniciar o servidor backend:

```bash
npm start
```
### ou teste no backend que está no ar!

•
Link: https://management-leads.onrender.com

•
Documentação da API (Swagger UI): https://management-leads.onrender.com/docs

O servidor estará disponível em `http://localhost:3000` (ou na porta configurada no `.env`). A documentação da API (Swagger UI) estará acessível em `http://localhost:3000/docs`.

## Scripts Disponíveis

*   `npm start`: Inicia o servidor em modo de desenvolvimento com `tsx watch`.
*   `npm run db:seed:access`: Executa o seeder para criar acessos padrão.
*   `npm run db:seed:admin`: Executa o seeder para criar um usuário administrador inicial.
*   `npm test`: Executa os testes (atualmente não implementado).
*   `npm run build`: Compila o código TypeScript para JavaScript.
*   `npm run lint`: Executa o linter (`tslint`).
*   `npm run prepublish`: Executa o build antes da publicação (hook).

## Estrutura do Projeto

```
.env.example
docker-compose.yml
package.json
package-lock.json
prisma/
├── migrations/
│   └── 20250927133120_init/
│       └── migration.sql
└── schema.prisma
src/
├── @types/
│   ├── types-fastify.ts
│   └── types-zod.ts
├── common/
│   └── dto/
│       ├── pagination-dto.ts
│       └── param-dto.ts
├── connection/
│   └── prisma.ts
├── controllers/
│   ├── auth-controller/
│   │   ├── dto/
│   │   │   └── auth-dto.ts
│   │   └── auth-controller.ts
│   ├── lead-controller/
│   │   ├── dto/
│   │   │   └── lead-dto.ts
│   │   └── lead-controller.ts
│   └── user-controller/
│       ├── dto/
│       │   └── user-dto.ts
│       └── user-controller.ts
├── index.ts
├── middlewares/
│   └── auth-middleware.ts
├── routes/
│   ├── auth-routes/
│   │   └── auth-routes.ts
│   ├── lead-routes/
│   │   └── lead-routes.ts
│   └── user-routes/
│       └── user-routes.ts
├── seeders/
│   ├── create-access.ts
│   └── create-user.ts
└── util/
    ├── function-check-domain.ts
    └── function-exclude.ts
tsconfig.json
tslint.json
```

**Desenvolvido por Jhoão Pedro**
