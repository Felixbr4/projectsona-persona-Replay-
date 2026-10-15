<?php
/**
 * Persona Replay - Main Front Controller & Application Router
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/functions.php';

// Models
require_once __DIR__ . '/models/Game.php';
require_once __DIR__ . '/models/Product.php';
require_once __DIR__ . '/models/Character.php';
require_once __DIR__ . '/models/DigitalKey.php';
require_once __DIR__ . '/models/ExternalOffer.php';
require_once __DIR__ . '/models/Order.php';
require_once __DIR__ . '/models/User.php';
require_once __DIR__ . '/models/Cart.php';

// Route Resolution
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
$path = parse_url($requestUri, PHP_URL_PATH) ?? '/';

// Strip base directory from path if in subfolder (e.g. /projecsona/)
if ($scriptDir !== '/' && strpos($path, $scriptDir) === 0) {
    $path = substr($path, strlen($scriptDir));
}

// Fallback to query param `?route=...` if rewrite isn't active
if (isset($_GET['route'])) {
    $path = '/' . ltrim($_GET['route'], '/');
}

$path = '/' . trim($path, '/');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// -----------------------------------------------------------------------------
// PUBLIC ROUTES
// -----------------------------------------------------------------------------

// 1. Home
if ($path === '/' || $path === '') {
    $games = Game::all();
    $featuredProducts = Product::all(['is_featured' => true]);
    require __DIR__ . '/views/home.php';
    exit;
}

// 2. Catalog
if ($path === '/catalogo') {
    $games = Game::all();
    $filters = [
        'search' => input('search'),
        'game_slug' => input('game_slug'),
        'platform' => input('platform'),
        'sort_by' => input('sort_by', 'featured')
    ];
    $products = Product::all($filters);
    require __DIR__ . '/views/catalog.php';
    exit;
}

// 3. Product Detail: /produto/{slug}
if (preg_match('#^/produto/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
    $slug = $matches[1];
    $product = Product::findBySlug($slug);
    if (!$product) {
        set_flash('error', 'Produto não encontrado.');
        header('Location: ' . url('catalogo'));
        exit;
    }

    if (!empty($product['game_theme'])) {
        $_SESSION['theme'] = $product['game_theme'];
    }

    require __DIR__ . '/views/product_detail.php';
    exit;
}

// 4. Games Hub: /jogos
if ($path === '/jogos') {
    $games = Game::all();
    require __DIR__ . '/views/games.php';
    exit;
}

// 5. Game Detail: /jogos/{slug}
if ($path === '/jogos/persona-4-golden') {
    header('Location: ' . url('jogos/persona-4'));
    exit;
}
if ($path === '/jogos/persona-4-revival') {
    $path = '/jogos/persona-4';
}

if (preg_match('#^/jogos/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
    $slug = $matches[1];
    $game = Game::findBySlug($slug);
    if (!$game) {
        set_flash('error', 'Jogo não encontrado.');
        header('Location: ' . url('jogos'));
        exit;
    }

    if (!empty($game['theme'])) {
        $_SESSION['theme'] = $game['theme'];
    }

    $characters = Game::getCharacters($game['id']);
    $products = Game::getProducts($game['id']);
    $offers = Game::getExternalOffers($game['id']);

    require __DIR__ . '/views/game_detail.php';
    exit;
}

// 6. Offers Comparison: /ofertas
if ($path === '/ofertas') {
    $games = Game::all();
    $filters = [
        'game_id' => input('game_id'),
        'platform' => input('platform')
    ];
    $offers = ExternalOffer::all($filters);
    require __DIR__ . '/views/offers.php';
    exit;
}

// 7. LGPD & Privacy Policy Page
if ($path === '/lgpd') {
    require __DIR__ . '/views/lgpd.php';
    exit;
}

// -----------------------------------------------------------------------------
// CART ROUTES
// -----------------------------------------------------------------------------

if ($path === '/carrinho') {
    $items = Cart::getItems();
    $total = Cart::total();
    require __DIR__ . '/views/cart.php';
    exit;
}

if ($path === '/carrinho/adicionar' && $method === 'POST') {
    $productId = input('product_id');
    $quantity = (int)input('quantity', 1);

    if ($productId) {
        if (Cart::add($productId, $quantity)) {
            set_flash('success', 'Produto adicionado ao seu carrinho!');
        } else {
            set_flash('error', 'Desculpe, este produto está sem estoque disponível no momento.');
        }
    }
    header('Location: ' . url('carrinho'));
    exit;
}

if ($path === '/carrinho/atualizar' && $method === 'POST') {
    $productId = input('product_id');
    $quantity = (int)input('quantity', 1);
    if ($productId) {
        Cart::update($productId, $quantity);
        set_flash('info', 'Quantidade atualizada.');
    }
    header('Location: ' . url('carrinho'));
    exit;
}

if ($path === '/carrinho/remover' && $method === 'POST') {
    $productId = input('product_id');
    if ($productId) {
        Cart::remove($productId);
        set_flash('info', 'Item removido do carrinho.');
    }
    header('Location: ' . url('carrinho'));
    exit;
}

if ($path === '/carrinho/limpar' && $method === 'POST') {
    Cart::clear();
    set_flash('info', 'Carrinho esvaziado.');
    header('Location: ' . url('carrinho'));
    exit;
}

// -----------------------------------------------------------------------------
// CHECKOUT ROUTES
// -----------------------------------------------------------------------------

if ($path === '/checkout') {
    require_auth();
    $items = Cart::getItems();
    if (empty($items)) {
        set_flash('warning', 'Adicione pelo menos um produto ao carrinho para finalizar a compra.');
        header('Location: ' . url('catalogo'));
        exit;
    }
    $total = Cart::total();
    $user = current_user();
    require __DIR__ . '/views/checkout.php';
    exit;
}

if ($path === '/checkout/processar' && $method === 'POST') {
    require_auth();
    $items = Cart::getItems();
    if (empty($items)) {
        header('Location: ' . url('catalogo'));
        exit;
    }

    $paymentMethod = input('payment_method', 'PIX');
    $user = current_user();

    $result = Order::createOrder($user['id'], $items, $paymentMethod);
    if ($result) {
        Cart::clear();
        $order = Order::getOrderDetail($result['order_id'], $user['id']);
        require __DIR__ . '/views/checkout_success.php';
        exit;
    } else {
        set_flash('error', 'Ocorreu um erro ao processar seu pedido. Tente novamente.');
        header('Location: ' . url('checkout'));
        exit;
    }
}

// -----------------------------------------------------------------------------
// AUTH ROUTES
// -----------------------------------------------------------------------------

if ($path === '/login') {
    if (is_logged_in()) {
        header('Location: ' . url('conta'));
        exit;
    }

    if ($method === 'POST') {
        $email = input('email');
        $password = input('password');

        $user = User::findByEmail($email);
        if ($user && User::verifyPassword($password, $user['password_hash'])) {
            if ($user['status'] !== 'ACTIVE') {
                set_flash('error', 'Sua conta está inativa ou bloqueada.');
            } else {
                $_SESSION['user'] = [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                    'status' => $user['status']
                ];
                set_flash('success', 'Bem-vindo de volta, ' . htmlspecialchars($user['name']) . '!');
                header('Location: ' . ($user['role'] === 'ADMIN' ? url('admin') : url('conta')));
                exit;
            }
        } else {
            set_flash('error', 'E-mail ou senha inválidos.');
        }
    }

    require __DIR__ . '/views/login.php';
    exit;
}

if ($path === '/cadastro') {
    if (is_logged_in()) {
        header('Location: ' . url('conta'));
        exit;
    }

    if ($method === 'POST') {
        $name = input('name');
        $email = input('email');
        $password = input('password');
        $passwordConfirm = input('password_confirm');

        if (empty($name) || empty($email) || empty($password)) {
            set_flash('error', 'Por favor, preencha todos os campos obrigatórios.');
        } elseif ($password !== $passwordConfirm) {
            set_flash('error', 'As senhas não coincidem.');
        } elseif (strlen($password) < 6) {
            set_flash('error', 'A senha deve conter no mínimo 6 caracteres.');
        } elseif (User::findByEmail($email)) {
            set_flash('error', 'Este e-mail já está cadastrado.');
        } else {
            $userId = User::create($name, $email, $password);
            $user = User::findById($userId);
            $_SESSION['user'] = $user;
            set_flash('success', 'Conta criada com sucesso! Desfrute da Persona Replay.');
            header('Location: ' . url('conta'));
            exit;
        }
    }

    require __DIR__ . '/views/register.php';
    exit;
}

if ($path === '/logout') {
    unset($_SESSION['user']);
    set_flash('info', 'Sessão encerrada com sucesso.');
    header('Location: ' . url('/'));
    exit;
}

// -----------------------------------------------------------------------------
// USER ACCOUNT ROUTES
// -----------------------------------------------------------------------------

if ($path === '/conta') {
    require_auth();
    $user = current_user();
    $orders = Order::getUserOrders($user['id']);
    require __DIR__ . '/views/account/profile.php';
    exit;
}

if (preg_match('#^/conta/pedidos/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
    require_auth();
    $user = current_user();
    $orderId = $matches[1];
    $order = Order::getOrderDetail($orderId, $user['id']);
    if (!$order) {
        set_flash('error', 'Pedido não encontrado.');
        header('Location: ' . url('conta'));
        exit;
    }
    require __DIR__ . '/views/account/order_detail.php';
    exit;
}

// -----------------------------------------------------------------------------
// ADMIN PANEL ROUTES
// -----------------------------------------------------------------------------

if ($path === '/admin') {
    require_admin();
    $allOrders = Order::all();
    $recentOrders = $allOrders;
    $totalOrdersCount = count($allOrders);
    
    $totalRevenue = 0.0;
    foreach ($allOrders as $o) {
        if ($o['status'] === 'COMPLETED' || $o['status'] === 'PAID') {
            $totalRevenue += (float)$o['total_amount'];
        }
    }

    $allKeys = DigitalKey::all();
    $totalKeys = count($allKeys);
    $availableKeysCount = 0;
    foreach ($allKeys as $k) {
        if ($k['status'] === 'AVAILABLE') {
            $availableKeysCount++;
        }
    }

    $allProducts = Product::all(['active' => null]);
    $totalProducts = count($allProducts);

    $allOffers = ExternalOffer::all();
    $totalOffers = count($allOffers);

    $allUsers = User::all();
    $totalUsers = count($allUsers);

    require __DIR__ . '/views/admin/dashboard.php';
    exit;
}

if ($path === '/admin/produtos') {
    require_admin();
    $products = Product::all(['active' => null]);
    require __DIR__ . '/views/admin/products.php';
    exit;
}

if ($path === '/admin/produtos/novo') {
    require_admin();
    $games = Game::all(false);
    if ($method === 'POST') {
        $id = Product::create($_POST);
        set_flash('success', 'Produto criado com sucesso!');
        header('Location: ' . url('admin/produtos'));
        exit;
    }
    $product = null;
    require __DIR__ . '/views/admin/product_form.php';
    exit;
}

if (preg_match('#^/admin/produtos/editar/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
    require_admin();
    $id = $matches[1];
    $product = Product::findById($id);
    if (!$product) {
        set_flash('error', 'Produto não encontrado.');
        header('Location: ' . url('admin/produtos'));
        exit;
    }
    $games = Game::all(false);

    if ($method === 'POST') {
        Product::update($id, $_POST);
        set_flash('success', 'Produto atualizado com sucesso!');
        header('Location: ' . url('admin/produtos'));
        exit;
    }

    require __DIR__ . '/views/admin/product_form.php';
    exit;
}

if ($path === '/admin/chaves') {
    require_admin();
    $keys = DigitalKey::all();
    $products = Product::all(['active' => null]);
    require __DIR__ . '/views/admin/keys.php';
    exit;
}

if ($path === '/admin/chaves/adicionar' && $method === 'POST') {
    require_admin();
    $productId = input('product_id');
    $keyCode = input('key_code');
    if ($productId && $keyCode) {
        DigitalKey::addKey($productId, $keyCode);
        set_flash('success', 'Chave criptografada e armazenada no estoque com sucesso!');
    }
    header('Location: ' . url('admin/chaves'));
    exit;
}

if ($path === '/admin/pedidos') {
    require_admin();
    $orders = Order::all();
    require __DIR__ . '/views/admin/orders.php';
    exit;
}

if (preg_match('#^/admin/pedidos/([a-zA-Z0-9_-]+)$#', $path, $matches)) {
    require_admin();
    $orderId = $matches[1];
    $order = Order::getOrderDetail($orderId);
    if (!$order) {
        set_flash('error', 'Pedido não encontrado.');
        header('Location: ' . url('admin/pedidos'));
        exit;
    }
    require __DIR__ . '/views/admin/order_detail.php';
    exit;
}

if ($path === '/admin/ofertas') {
    require_admin();
    $offers = ExternalOffer::all();
    $games = Game::all(false);
    $stores = ExternalOffer::getStores();
    require __DIR__ . '/views/admin/offers.php';
    exit;
}

if ($path === '/admin/ofertas/nova' && $method === 'POST') {
    require_admin();
    ExternalOffer::create($_POST);
    set_flash('success', 'Oferta externa cadastrada com sucesso!');
    header('Location: ' . url('admin/ofertas'));
    exit;
}

if ($path === '/admin/usuarios') {
    require_admin();
    $users = User::all();
    require __DIR__ . '/views/admin/users.php';
    exit;
}

// -----------------------------------------------------------------------------
// 404 NOT FOUND
// -----------------------------------------------------------------------------
http_response_code(404);
$pageTitle = "Página Não Encontrada";
require __DIR__ . '/includes/header.php';
?>
<div class="container" style="text-align: center; padding: 100px 20px;">
    <div style="font-size: 72px; font-weight: 900; color: var(--theme-primary); font-family: var(--font-display); margin-bottom: 12px;">404</div>
    <h1 class="font-display" style="font-size: 28px; font-weight: 900; text-transform: uppercase; margin-bottom: 12px;">Página Não Encontrada</h1>
    <p style="color: var(--theme-muted); margin-bottom: 24px;">A página que você tentou acessar não existe no Metaverso da Persona Replay.</p>
    <a href="<?= url('/') ?>" class="btn btn-primary btn-lg">Voltar à Página Inicial</a>
</div>
<?php
require __DIR__ . '/includes/footer.php';
