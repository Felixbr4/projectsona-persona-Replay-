# 🎭 ProjecSona — Plataforma Digital & Comparador Persona

Aplicação web Full-Stack moderna e funcional para a loja digital especializada na franquia de jogos **Persona** (Persona 3 Reload, Persona 4 Revival e Persona 5 Royal).

---

## 🌟 Recursos Principais

1. **Loja Digital & Gestão de Chaves Steam**:
   - Compra transacional com reserva de estoque em tempo real.
   - Chaves Steam protegidas com criptografia de ponta a ponta (`AES-256-CBC` + `SHA-256`).
   - Revelação segura da chave com registro de log de auditoria no painel do usuário.
   - Máscara de segurança para listagens públicas e administrativas (`XXXX-XXXX-****-1234`).

2. **Comparador de Preços em Tempo Real**:
   - Comparação transparente entre as ofertas da loja própria e lojas autorizadas externas (Steam, Nuuvem, Green Man Gaming, Epic Games).
   - Identificação e destaque automático do **Menor Preço Encontrado**.

3. **Arquitetura de Temas & Transições Cinemáticas**:
   - **Persona 3 Reload**: Tema *Dark Hour* (Azul neon, Meia-Noite, Relógio com dispersão).
   - **Persona 4 Revival**: Tema *TV World* (Amarelo, estática de TV analógica CRT, espiral hipnótica).
   - **Persona 5 Royal**: Tema *Phantom Thieves* (Vermelho e preto, cortes diagonais, cartas e efeito All-Out Attack).
   - `TransitionManager` totalmente desacoplado com suporte a `prefers-reduced-motion`.

4. **Sistema Completo de Autenticação & Segurança**:
   - Cadastro, Login com sessões seguras em Cookies `HttpOnly`.
   - Fluxo de Verificação de E-mail por Token com expiração.
   - Fluxo de Recuperação de Acesso ("Esqueci minha senha").
   - Controle de Acesso por Perfis (Role-Based Access Control - `USER` e `ADMIN`).

5. **Painel Administrativo Completo (`/admin`)**:
   - **Dashboard**: Receita real aprovada, total de pedidos, usuários e estoque de chaves.
   - **Produtos**: CRUD completo com suporte a exclusão lógica para preservar histórico de pedidos.
   - **Estoque & Chaves**: Inserção em lote de chaves criptografadas e inspeção mascarada.
   - **Pedidos**: Acompanhamento e atualização de status em tempo real.
   - **Ofertas Externas**: Cadastro e atualização de preços de lojas parceiras.

---

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos
- **Node.js**: v18+ ou v20+ LTS
- **NPM** ou **Yarn**

### 2. Instalação das Dependências
```bash
npm install
```

### 3. Configuração do Banco de Dados e Seed
Gere o cliente Prisma, crie o banco relacional e execute o Seed com os dados demonstrativos:
```bash
# Gerar Prisma Client
npx prisma generate

# Sincronizar o Schema com o Banco
npx prisma db push

# Executar Seed com dados completos (Jogos, Personagens, Produtos, Chaves Steam, Ofertas e Usuários)
npx tsx prisma/seed.ts
```

### 4. Executar em Modo de Desenvolvimento
```bash
npm run dev
```
Acesse a aplicação em [http://localhost:3000](http://localhost:3000).

---

## 🔑 Contas de Demonstração

| Perfil | E-mail | Senha | Função |
|---|---|---|---|
| **Administrador** | `admin@projecsona.com` | `adminpassword123` | Acesso total ao painel `/admin` |
| **Cliente Demo** | `ren.amamiya@projecsona.com` | `userpassword123` | Compra, pedidos e resgate de chaves |

---

## 📁 Estrutura do Projeto

```
projecsona/
├── prisma/
│   ├── schema.prisma              # Schema relacional (User, Game, Product, DigitalKey, Order, etc.)
│   └── seed.ts                    # Seed rico com 3 jogos, personagens, chaves e ofertas
├── src/
│   ├── app/
│   │   ├── (public)/              # Rotas públicas (Catálogo, Jogos temáticos, Produtos, Ofertas)
│   │   ├── (auth)/                # Rotas de autenticação (Login, Cadastro, Tokens)
│   │   ├── conta/                 # Painel do usuário (Perfil, Pedidos, Revelação de Chaves)
│   │   ├── carrinho/              # Carrinho de compras com checagem de estoque
│   │   ├── checkout/              # Checkout transacional
│   │   ├── admin/                 # Painel administrativo protegido (Dashboard, CRUD, Estoque)
│   │   └── api/                   # Route Handlers REST com validação Zod
│   ├── components/
│   │   ├── ui/                    # Componentes base reutilizáveis (Button, Input, Modal, Badge)
│   │   ├── themes/                # ThemeProvider e sincronizadores de tema
│   │   ├── transitions/           # TransitionManager e as 3 transições temáticas
│   │   ├── games/                 # Componentes de jogo (Hero, História, Personagens, Mecânicas)
│   │   └── products/              # Cards, Grids e Tabela Comparadora de Preços
│   ├── context/                   # AuthContext e CartContext
│   ├── lib/
│   │   ├── db/                    # Singleton do Prisma Client
│   │   ├── security/              # Utilitários de criptografia AES-256 e Bcrypt
│   │   ├── validation/            # Schemas de validação Zod
│   │   ├── email/                 # Abstração de EmailService
│   │   └── payments/              # Abstração de PaymentGateway
│   └── services/                  # Regras de negócio desacopladas
└── tailwind.config.ts             # Cores e animações personalizadas Persona
```
