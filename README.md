# 🎭 ProjecSona - A Loja Definitiva da Franquia Persona (Versão PHP)

Sistema web completo de e-commerce e comparador de preços dedicado à franquia Persona (**Persona 3 Reload**, **Persona 4 Revival / Golden** e **Persona 5 Royal**), desenvolvido em **PHP puro moderno + PDO + MySQL / SQLite** para rodar diretamente no Apache do XAMPP.

---

## 🌟 Principais Recursos

1. **Catálogo Completo & Edições**:
   - Edições Standard, Digital Deluxe e Supreme com suporte a chaves digitais Steam.
   - Filtros por jogo, plataforma, ordenação por desconto ou preço e busca em tempo real.

2. **Lores & Rosters de Personagens**:
   - Hub de jogos com enredo aprofundado, pontuações do Metacritic e galeria de personagens (Makoto Yuki, Aigis, Yu Narukami, Chie, Joker, Morgana, Kasumi, etc.).

3. **Comparador de Preços em Tempo Real**:
   - Comparação transparente com lojas parceiras oficiais (Steam Store, Nuuvem Brasil, Green Man Gaming, Epic Games Store).

4. **Estoque de Chaves Digitais com Criptografia**:
   - Códigos de ativação Steam protegidos por criptografia **AES-256-CBC**.
   - Liberação e revelação automática no painel do usuário e na tela pós-checkout com botão de cópia instantânea.

5. **Carrinho & Checkout com Pix Simulado**:
   - Controle transacional de estoque que previne venda de chaves duplicadas.
   - Checkout instantâneo com geração de pedido, transação e comprovante.

6. **Sistema de Autenticação & Painel Admin**:
   - Sessões seguras, controle de perfis (`USER` e `ADMIN`), hash com BCRYPT (custo 12).
   - Painel administrativo com métricas financeiras, gestão de produtos, controle de chaves e visualização de pedidos.

7. **Design System Persona Reativo**:
   - Troca dinâmica de temas via barra superior:
     - **P3**: Neon Cyan / Dark Hour
     - **P4**: Midnight Channel / Amarelo Dourado
     - **P5**: Phantom Thieves / Vermelho Rebelde
     - **Velvet**: Sala de Veludo Mística

---

## 🚀 Como Executar no XAMPP

### 1. Inicializar no Apache
Como o projeto já está localizado em `C:\xampp\htdocs\projecsona`:
1. Abra o **XAMPP Control Panel**.
2. Inicie o módulo **Apache** (e opcionalmente o **MySQL**).
3. Abra seu navegador em:
   ```
   http://localhost/projecsona/
   ```

### 2. Inicialização & Seed do Banco de Dados
O banco de dados já foi populado com todos os dados. Caso precise resetar ou reinstalar a qualquer momento:
- Pelo navegador: `http://localhost/projecsona/install.php`
- Ou pelo terminal: `php install.php` (ou `C:\xampp\php\php.exe install.php`)

---

## 🔑 Credenciais Padrão

| Perfil | E-mail | Senha |
|---|---|---|
| **Administrador** | `admin@projecsona.com` | `adminpassword123` |
| **Cliente Demo (Joker)** | `ren.amamiya@projecsona.com` | `userpassword123` |

---

## 📁 Estrutura do Projeto em PHP

```
projecsona/
├── index.php               # Front-controller e roteador mestre
├── install.php             # Instalador e seeder automatizado
├── database.sql            # Schema MySQL estrutural
├── database.sqlite         # Base SQLite local com seed completo
├── .htaccess               # Regras de reescrita de URL amigável
├── config/
│   ├── config.php          # Constantes, segurança e segredo AES-256
│   └── database.php        # Conexão PDO Híbrida (MySQL / SQLite)
├── includes/
│   ├── functions.php       # Criptografia, formatação monetária e auth
│   ├── header.php          # Navbar temática Persona com seletor de tema
│   └── footer.php          # Rodapé estilizado
├── models/
│   ├── Game.php            # Modelo de jogos e lore
│   ├── Product.php         # Modelo do catálogo e edições
│   ├── Character.php       # Modelo dos personagens
│   ├── DigitalKey.php      # Modelo de chaves Steam criptografadas
│   ├── Order.php           # Modelo de pedidos e transações
│   ├── ExternalOffer.php   # Modelo de comparador de preços
│   ├── User.php            # Modelo de usuários e autenticação
│   └── Cart.php            # Modelo do carrinho em sessão
├── views/
│   ├── home.php            # Página inicial
│   ├── catalog.php         # Catálogo com filtros
│   ├── product_detail.php  # Detalhes do produto
│   ├── games.php           # Hub dos jogos Persona
│   ├── game_detail.php     # Lore, personagens e ofertas do jogo
│   ├── offers.php          # Comparador de preços geral
│   ├── cart.php            # Carrinho de compras
│   ├── checkout.php        # Tela de pagamento Pix
│   ├── checkout_success.php# Entrega da chave Steam criptografada
│   ├── login.php / register.php # Autenticação
│   ├── account/            # Painel do cliente e pedidos
│   └── admin/              # Dashboard, gestão de chaves e produtos
└── assets/
    ├── css/style.css       # Design system Persona com temas dinâmicos
    └── js/app.js           # Alternador de temas, cópia de chaves e carrinho
```
