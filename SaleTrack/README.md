# Sistema de Contabilidade de Vendas

Sistema simples para registro e controle de vendas com interface web.

## Funcionalidades

- ✅ Registro de vendas (usuário, quantidade, valor)
- ✅ Filtros por data específica e usuário
- ✅ Totalizadores automáticos (valor e quantidade)
- ✅ Histórico de vendas em tabela
- ✅ Remoção de vendas específicas
- ✅ Banco de dados PostgreSQL
- ✅ Interface responsiva

## Tecnologias

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Banco**: PostgreSQL + Drizzle ORM
- **UI**: Shadcn/UI Components

## Como usar

### 1. Instalação

```bash
npm install
```

### 2. Configurar banco de dados

Crie um arquivo `.env` com:

```
DATABASE_URL=sua_string_de_conexao_postgresql
```

### 3. Criar tabelas

```bash
npm run db:push
```

### 4. Executar

```bash
npm run dev
```

O sistema estará disponível em `http://localhost:5000`

## Deploy Gratuito

### Vercel (Recomendado)

1. Faça fork deste repositório
2. Conecte sua conta Vercel ao GitHub
3. Configure a variável `DATABASE_URL` no Vercel
4. Deploy automático

### Railway

1. Conecte o repositório no Railway
2. Configure as variáveis de ambiente
3. Deploy automático

### Netlify

1. Conecte o repositório no Netlify
2. Configure build settings
3. Deploy automático

## Estrutura do Projeto

```
├── client/          # Frontend React
├── server/          # Backend Express
├── shared/          # Tipos e schemas compartilhados
└── package.json     # Dependências e scripts
```

## Banco de Dados

O sistema usa PostgreSQL com as seguintes tabelas:

- `users`: Usuários do sistema
- `sales`: Registro de vendas

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request