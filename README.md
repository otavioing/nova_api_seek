# 🔎 Seek API

**Seek** é uma plataforma RESTful que conecta **Pessoas Físicas (PF)** e **Empresas**, unindo recursos sociais (postagens, curtidas, comentários, sistema de seguidores e chat) a recursos de empregabilidade (publicação de vagas e candidaturas). O projeto foi construído com Node.js e Express, seguindo uma arquitetura em camadas rigorosa para garantir organização, escalabilidade e manutenibilidade do código.

---

## 📑 Sumário

- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura da API](#-arquitetura-da-api)
- [Padrões de Resposta](#-padrões-de-resposta)
- [Como Rodar o Projeto Localmente](#-como-rodar-o-projeto-localmente)
- [Testes com Insomnia](#-testes-com-insomnia)
- [Licença](#-licença)

---

## 🚀 Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias e bibliotecas:

| Tecnologia | Finalidade |
|---|---|
| **Node.js** | Ambiente de execução do servidor |
| **Express** | Framework para construção da API RESTful |
| **MySQL** | Banco de dados relacional |
| **JWT (JSON Web Token)** | Autenticação e autorização de usuários |
| **Bcrypt** | Criptografia e hash de senhas |
| **Nodemailer** | Disparo de e-mails de verificação de conta e alertas de segurança |
| **Multer** | Upload de arquivos (fotos de perfil, banners e imagens de posts) |

---

## 🏗️ Arquitetura da API

A Seek API segue uma **arquitetura em camadas** bem definida, garantindo separação de responsabilidades, testabilidade e organização do código. Toda requisição percorre o seguinte fluxo:

```
Request → Route → Validator (Middleware) → Controller → Service → Repository → Banco de Dados
```

### 🔹 Descrição das camadas

- **Routes**
  Responsáveis por definir os endpoints da API e direcionar cada requisição para o middleware/controller correspondente.

- **Validator (Middleware)**
  Middlewares responsáveis por validar os dados recebidos (`body`, `params`, `query`) **antes** de chegarem ao Controller, garantindo que apenas dados íntegros sigam adiante no fluxo.

- **Controller**
  Recebe a requisição já validada, aciona a camada de Service e devolve a resposta ao cliente já formatada, utilizando o utilitário `utils/response.js` para padronizar o retorno em JSON.

- **Service**
  Concentra as regras de negócio da aplicação, como disparo de e-mails, validação de tokens, regras de permissão e demais lógicas que não pertencem diretamente ao controller nem ao banco de dados.

- **Repository**
  Única camada autorizada a realizar consultas (queries) diretas ao banco de dados MySQL. Isso garante que toda a lógica de acesso a dados fique isolada e centralizada.

> 💡 **Por que essa arquitetura?**
> Essa separação evita que regras de negócio se misturem com queries SQL ou com a lógica de rotas, tornando o código mais fácil de testar, manter e escalar.

---

## 📦 Padrões de Resposta

Para manter a consistência entre back-end e front-end, a API utiliza um arquivo utilitário (`utils/response.js`) que padroniza **todas** as respostas em formato JSON. Abaixo estão os principais formatos de resposta que o front-end irá receber:

### ✅ Sucesso com retorno de dados

```json
{
  "success": true,
  "message": "Usuário encontrado com sucesso.",
  "data": {
    "id": 1,
    "nome": "Otávio"
  }
}
```

### 📋 Sucesso com retorno de lista

```json
{
  "success": true,
  "message": "Usuários encontrados.",
  "data": [
    {
      "id": 1,
      "nome": "Otávio"
    }
  ],
  "count": 1
}
```

### ⚠️ Erro de validação

```json
{
  "success": false,
  "message": "Email é obrigatório.",
  "errors": [
    {
      "campo": "email",
      "mensagem": "Email é obrigatório."
    }
  ]
}
```

### ❌ Erro interno ou de regra de negócio

```json
{
  "success": false,
  "message": "Erro interno do servidor."
}
```

---

## ⚙️ Como Rodar o Projeto Localmente

Siga o passo a passo abaixo para configurar e executar a Seek API na sua máquina.

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/seu-usuario/seek-api.git
cd seek-api
```

### 2️⃣ Importe o banco de dados

O projeto conta com um arquivo `.sql` contendo toda a estrutura das tabelas necessárias.

1. Abra seu gerenciador de banco de dados MySQL de preferência (MySQL Workbench, DBeaver, phpMyAdmin, etc.).
2. Crie um novo banco de dados (schema), por exemplo: `seek_db`.
3. Importe o arquivo `.sql` fornecido no diretório do projeto (ex: `database/seek_db.sql`) para dentro do schema criado.

### 3️⃣ Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no exemplo abaixo:

```env
# Servidor
PORT=4500

# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASS=sua_senha
DB_NAME=seek_db
DB_PORT=3306

# Autenticação
JWT_SECRET=sua_chave_secreta_jwt
JWT_EXPIRES_IN=1d

# E-mail (Nodemailer)
MAIL_HOST=smtp.seuservidor.com
MAIL_PORT=587
MAIL_USER=seu_email@dominio.com
MAIL_PASS=sua_senha_de_email

# Upload de Arquivos
UPLOAD_PATH=./uploads
```

> ⚠️ **Atenção:** nunca suba o arquivo `.env` para o repositório. Certifique-se de que ele está incluído no `.gitignore`.

### 4️⃣ Instale as dependências

Com o Node.js instalado, execute o comando abaixo na raiz do projeto:

```bash
npm i
```

### 5️⃣ Inicie o servidor

Para iniciar a API, execute:

```bash
npm run start
```

Se tudo estiver configurado corretamente, o servidor estará disponível em:

```
http://localhost:4500
```

---

## 🧪 Testes com Insomnia

Para facilitar os testes de todas as rotas da API, o projeto disponibiliza uma coleção pronta do **Insomnia** dentro da pasta:

```
tests/
```

Dentro dessa pasta você encontrará um arquivo `.yaml` contendo toda a coleção de requisições já configuradas (rotas, headers, exemplos de body, autenticação, etc.).

### Como importar a coleção

1. Abra o aplicativo **Insomnia**.
2. Clique em **Create** (ou **Import**).
3. Selecione a opção **Import From File**.
4. Escolha o arquivo `.yaml` localizado na pasta `tests/` do projeto.
5. Pronto! Todas as rotas da Seek API estarão disponíveis e organizadas, prontas para uso imediato — sem necessidade de configurar cada requisição manualmente.

> 💡 Basta configurar a variável de ambiente do Insomnia com a URL base da sua API local (ex: `http://localhost:4500`) e o token de autenticação, quando necessário.

---

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se à vontade para utilizá-lo, modificá-lo e contribuir.
