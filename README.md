# Bext Task Manager API

## Feedback
- Teste interessante, me fez sair da zona de conforto em relação ao banco de dados, pelo fato de que eu nunca tive experiência com MongoDB. Acredito que minha maior dificuldade esteve entre ele e a forma que é tratada toda a informação, sua estrutura. 
- As outras estruturas já estava familiarizado, acredito que a maioria está bem estruturada. Não gostei muito de como ficou o handle de Erros.

## Requisitos
- Node.js >= 18
- MongoDB Atlas (ou local)

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/andersonAzzolinii/BextTeste.git
   cd BextTeste
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env` na raiz do projeto:
   - Copie o exemplo e ajuste as variáveis:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=seu_link_mongodb
   COMPLEMENT_PASS=sua_senha_salt
   JWT_SECRET=sua_chave_jwt
   ```

## Executando o projeto

- Para rodar em modo desenvolvimento:
  ```bash
  npm run dev
  ```

- Para rodar em produção:
  ```bash
  npm run build
  npm start
  ```

## Testes

- Para rodar os testes automatizados:
  ```bash
  npm test
  ```


## Diagrama de Arquitetura

```
/src
│
├── controllers/      # Lógica das rotas, recebe req/res, chama services
│   └── Auth.ts
│   └── TaskList.ts
│   └── Task.ts
│
├── services/         # Regras de negócio, manipula dados, chama models
│   └── Auth.ts
│   └── TaskList.ts
│   └── Task.ts
│
├── models/           # Schemas Mongoose, estrutura dos dados
│   └── User.ts
│   └── TaskList.ts
│   └── Task.ts
│
├── middlewares/      # Funções intermediárias (auth, erros)
│   └── auth.ts
│   └── validation.ts
│   └── error.ts
│
├── routes/           # Define endpoints e associa controllers
│   └── authRoutes.ts
│   └── taskListRoutes.ts
│   └── taskRoutes.ts
│
├── schemas/          # Schemas Zod para validação de dados
│   └── index.ts
│
├── types/            # Tipos TypeScript compartilhados
│   └── index.ts
│
├── config/           # Configurações ( database e setup de testes)
│
├── __tests__/        # Testes automatizados (Jest/Supertest)
│
└── server.ts         # Inicialização do Express, carrega middlewares e rotas
```

**Responsabilidades:**
- controllers: interface HTTP
- services: lógica de negócio
- models: persistência de dados
- middlewares: autenticação, e tratamento de erros
- routes: mapeamento de endpoints
- schemas: validação de entrada
- types: tipagem
- config: configuração do app/banco
- __tests__: testes automatizados

## Fluxo de Autenticação

1. **Registro**
   - O usuário envia `name`, `email` e `password` para `POST /api/auth/register`.
   - A senha é validada, recebe um salt extra (`COMPLEMENT_PASS`), é criptografada e salva no banco.
   - Se o registro for bem-sucedido, retorna status 201.

2. **Login**
   - O usuário envia `email` e `password` para `POST /api/auth/login`.
   - O sistema busca o usuário pelo e-mail, compara a senha informada (usando o mesmo salt).
   - Se válido, gera um token JWT com o ID e e-mail do usuário.
   - O token é retornado no campo `data.token`.

3. **Uso do Token**
   - Para acessar rotas protegidas, o usuário envia o token JWT no header:
     ```
     Authorization: Bearer <token>
     ```
   - O middleware `authenticateToken` valida o token usando `JWT_SECRET`.
   - Se válido, adiciona os dados do usuário em `req.user` e libera o acesso.

4. **Validação do Token**
   - O token é verificado em cada requisição protegida.
   - Se o token estiver ausente, inválido ou expirado, retorna erro 401 ou 403.

**Resumo visual:**

```
[Usuário] --(register)--> [API] --(cria usuário, salva senha hash)--> [MongoDB]
[Usuário] --(login)--> [API] --(valida senha, gera JWT)--> [Usuário recebe token]
[Usuário] --(token no header)--> [API] --(valida JWT)--> [Acesso liberado ou negado]
```


## Diagrama de Entidade e Relacionamento (ER)

```
User
│
├── _id: ObjectId
├── name: string
├── email: string (único)
├── password: string

TaskList
│
├── _id: ObjectId
├── name: string
├── description: string
├── userId: ObjectId  ←── referência para User._id


Task
│
├── _id: ObjectId
├── title: string
├── description: string
├── status: string 
├── dueDate: Date
├── listId: ObjectId  ←── referência para TaskList._id
├── userId: ObjectId  ←── referência para User._id
```

**Relacionamentos:**
- Um User pode ter várias TaskList (1:N)
- Uma TaskList pertence a um User
- Uma TaskList pode ter várias Task (1:N)
- Uma Task pertence a uma TaskList e a um User


## Documentação de Rotas

### Autenticação

#### POST /api/auth/register
- **Descrição:** Registrar novo usuário
- **Body:**  
  ```json
  {
    "name": "Lucas",
    "email": "lucas@email.com",
    "password": "senhateste"
  }
  ```
- **Respostas:**
  - 201: Usuário criado
  - 400: Dados inválidos ou e-mail duplicado

#### POST /api/auth/login
- **Descrição:** Login do usuário
- **Body:**  
  ```json
  {
    "email": "lucas@email.com",
    "password": "senhateste"
  }
  ```
- **Respostas:**
  - 200: Login OK, retorna token
  - 401: Credenciais inválidas

#### GET /api/auth/me
- **Descrição:** Retorna dados do usuário autenticado
- **Header:** `Authorization: Bearer <token>`
- **Respostas:**
  - 200: Dados do usuário
  - 401: Token inválido/ausente

---

### Task Lists

#### POST /api/task-lists
- **Descrição:** Cria uma nova lista de tarefas
- **Body:**  
  ```json
  {
    "name": "Minha Lista",
    "description": "Descrição da lista"
  }
  ```
- **Header:** `Authorization: Bearer <token>`
- **Respostas:** 201, 400

#### GET /api/task-lists
- **Descrição:** Lista todas as listas do usuário
- **Header:** `Authorization: Bearer <token>`
- **Respostas:** 200

#### GET /api/task-lists/:id
- **Descrição:** Busca lista por ID
- **Header:** `Authorization: Bearer <token>`
- **Respostas:** 200, 404

#### PUT /api/task-lists/:id
- **Descrição:** Atualiza lista
- **Body:**  
  ```json
  {
    "name": "Novo nome",
    "description": "Nova descrição"
  }
  ```
- **Header:** `Authorization: Bearer <token>`
- **Respostas:** 200, 400, 404

#### DELETE /api/task-lists/:id
- **Descrição:** Remove lista (se não houver tarefas)
- **Header:** `Authorization: Bearer <token>`
- **Respostas:** 200, 404, 400

#### GET /api/task-lists/:listId/tasks
- **Descrição:** Lista todas as tarefas de uma lista específica
- **Header:** `Authorization: Bearer <token>`
- **Respostas:** 200, 404

---

### Tasks

#### POST /api/tasks
- **Descrição:** Cria uma nova tarefa
- **Body:**  
  ```json
  {
    "title": "Nova tarefa",
    "description": "Descrição da tarefa",
    "status": "pending",
    "listId": "id_da_lista"
  }
  ```
- **Header:** `Authorization: Bearer <token>`
- **Respostas:** 201, 400

#### GET /api/tasks
- **Descrição:** Lista todas as tarefas do usuário (filtros opcionais)
- **Query:** `listId, status, dueDateFrom, dueDateTo`
- **Header:** `Authorization: Bearer <token>`
- **Respostas:** 200

#### GET /api/tasks/:id
- **Descrição:** Busca tarefa por ID
- **Header:** `Authorization: Bearer <token>`
- **Respostas:** 200, 404

#### PUT /api/tasks/:id
- **Descrição:** Atualiza tarefa
- **Body:**  
  ```json
  {
    "title": "Novo título",
    "description": "Nova descrição",
    "status": "completed",
    "dueDate": "2025-07-21T00:00:00.000Z",
    "listId": "id_da_lista"
  }
  ```
- **Header:** `Authorization: Bearer <token>`
- **Respostas:** 200, 400, 404

#### DELETE /api/tasks/:id
- **Descrição:** Remove tarefa
- **Header:** `Authorization: Bearer <token>`
- **Respostas:** 200, 404


