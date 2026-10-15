<?php
/**
 * Persona Replay - Automated Database Installer & Seeder
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/functions.php';

$output = [];
$success = false;
$isCli = (php_sapi_name() === 'cli');

if ($isCli || ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    try {
        $driver = 'mysql';
        $pdo = null;

        // Try connecting to MySQL
        try {
            $dsnNoDb = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=" . DB_CHARSET;
            $pdo = new PDO($dsnNoDb, DB_USER, DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
            $output[] = "⚡ Conectado ao servidor MySQL com sucesso.";
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            $pdo->exec("USE `" . DB_NAME . "`");
            $output[] = "📁 Banco de dados MySQL `" . DB_NAME . "` pronto.";
            $driver = 'mysql';
        } catch (Exception $e) {
            $output[] = "⚠️ MySQL não ativo. Alternando para SQLite local...";
            $sqlitePath = __DIR__ . '/database.sqlite';
            $pdo = new PDO("sqlite:" . $sqlitePath, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
            $pdo->exec("PRAGMA foreign_keys = ON;");
            $driver = 'sqlite';
            $output[] = "📁 Banco de dados SQLite pronto.";
        }

        // 1. Criar Tabelas
        if ($driver === 'mysql') {
            $sql = file_get_contents(__DIR__ . '/database.sql');
            $statements = array_filter(array_map('trim', explode(';', $sql)));
            foreach ($statements as $stmt) {
                if (!empty($stmt)) {
                    $pdo->exec($stmt);
                }
            }
            try {
                $pdo->exec("ALTER TABLE `characters` ADD COLUMN `image_transformed` VARCHAR(500) NULL AFTER `image`");
            } catch (Exception $colEx) {
                // Column already exists
            }
        }

        // 2. Limpar dados anteriores
        if ($driver === 'mysql') {
            $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
        }
        $tables = ['digital_keys', 'order_items', 'payments', 'orders', 'cart_items', 'carts', 'external_offers', 'external_stores', 'products', 'characters', 'games', 'users'];
        foreach ($tables as $t) {
            $pdo->exec("DELETE FROM `$t`");
        }
        if ($driver === 'mysql') {
            $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
        }

        // 3. Usuários
        $adminId = Database::uuid();
        $adminPass = password_hash('adminpassword123', PASSWORD_BCRYPT, ['cost' => 12]);
        $stmt = $pdo->prepare("INSERT INTO users (id, name, email, password_hash, role, status, email_verified) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)");
        $stmt->execute([$adminId, 'Igor Velvet Master', 'admin@projecsona.com', $adminPass, 'ADMIN', 'ACTIVE']);

        $demoUserId = Database::uuid();
        $demoPass = password_hash('userpassword123', PASSWORD_BCRYPT, ['cost' => 12]);
        $stmt->execute([$demoUserId, 'Ren Amamiya (Joker)', 'ren.amamiya@projecsona.com', $demoPass, 'USER', 'ACTIVE']);
        $output[] = "👤 Usuários Persona Replay criados: Admin e Joker.";

        // 4. Jogos Persona (Persona 3 Reload, Persona 4 Revival, Persona 5 Royal)
        $p3Id = Database::uuid();
        $p4Id = Database::uuid();
        $p5Id = Database::uuid();

        $stmtGame = $pdo->prepare("INSERT INTO games (id, name, slug, theme, genre, developer, release_date, metacritic_score, description, story, image, banner_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmtGame->execute([
            $p3Id,
            'Persona 3 Reload',
            'persona-3-reload',
            'persona3',
            'JRPG / Dungeon Crawler Noturno',
            'ATLUS / P-Studio',
            '02 de Fevereiro de 2024',
            89,
            'Mergulhe na Dark Hour e desperte as profundezas do seu coração. O remake definitivo com visuais modernizados e trilha sonora regravada.',
            'Ao se transferir para a Gekkoukan High School, o protagonista descobre a "Dark Hour", uma hora sobrenatural escondida à meia-noite onde sombras emergem de uma colossal torre chamada Tártaro. Ao despertar sua Persona, ele se junta ao SEES para desvendar o mistério e enfrentar o destino.',
            'assets/images/covers/p3r.jpg',
            'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop'
        ]);

        $stmtGame->execute([
            $p4Id,
            'Persona 4 Revival',
            'persona-4',
            'persona4',
            'JRPG / Investigação Sobrenatural',
            'ATLUS / P-Studio',
            '13 de Novembro de 2024',
            93,
            'Sintonize no Midnight Channel e encare sua verdadeira face. Uma narrativa eletrizante de investigação numa pacata cidade rural envolta por neblina misteriosa.',
            'A pacata cidade rural de Inaba é abalada por uma série de assassinatos bizarros que ocorrem em noites chuvosas de neblina densa. Ao investigar o lendário rumor do "Midnight Channel", o protagonista e seus amigos descobrem uma passagem secreta para o Mundo da TV, onde enfrentam suas próprias Sombras para salvar vítimas.',
            'assets/images/covers/p4r.jpg',
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop'
        ]);

        $stmtGame->execute([
            $p5Id,
            'Persona 5 Royal',
            'persona-5-royal',
            'persona5',
            'JRPG / Stylized Heist / Ação',
            'ATLUS / P-Studio',
            '21 de Outubro de 2022',
            95,
            'Coloque sua máscara, roube os desejos corrompidos e liberte o mundo. A experiência definitiva dos Phantom Thieves com estilo inconfundível.',
            'Após ser injustamente acusado, o protagonista se transfere para Tóquio e descobre o Metaverso. Ele funda os "Phantom Thieves of Hearts" para invadir os Palácios cognitivos de adultos abusivos, roubar seus tesouros corrompidos e fazer seus corações mudarem.',
            'assets/images/covers/p5r.jpg',
            'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1600&auto=format&fit=crop'
        ]);
        $output[] = "🎮 Jogos Persona cadastrados (P3 Reload, Persona 4 Revival, P5 Royal com capas oficiais).";

        // 5. Personagens com Imagens Locais Oficiais e Descrições Curtas sem Spoilers
        $characters = [
            // Persona 3 Reload
            [$p3Id, 'Makoto Yuki', 'Protagonista / Líder do SEES', 'Orpheus & Thanatos', '0 - O Louco (The Fool)', 'Estudante recém-transferido com a rara habilidade de invocar múltiplas Personas durante a Hora Sombria.', 'assets/images/persona/persona 3 reload/makoto.jpg', null],
            [$p3Id, 'Yukari Takeba', 'Arqueira / Membro do SEES', 'Io', 'VI - Os Enamorados (The Lovers)', 'Colega de classe dedicada e arqueira talentosa que luta para proteger seus companheiros de dormitório.', 'assets/images/persona/persona 3 reload/yukari.jpg', null],
            [$p3Id, 'Junpei Iori', 'Espadachim / Atacante', 'Hermes', 'I - O Mago (The Magician)', 'Colega bem-humorado e entusiasta que busca provar seu valor e proteger as pessoas como herói.', 'assets/images/persona/persona 3 reload/junpei.jpg', null],
            [$p3Id, 'Akihiko Sanada', 'Capitão de Boxe', 'Polydeuces', 'IV - O Imperador (The Emperor)', 'Veterano disciplinado de artes marciais focado em aprimorar sua força física e determinação inabalável.', 'assets/images/persona/persona 3 reload/Sanada.jpg', null],
            [$p3Id, 'Mitsuru Kirijo', 'Presidente Estudantil / Esgrimista', 'Penthesilea', 'III - A Imperatriz (Empress)', 'Líder nata do conselho estudantil que empunha sabres e magias congelantes com elegância tática.', 'assets/images/persona/persona 3 reload/Mitsuru.jpg', null],
            [$p3Id, 'Aigis', 'Arma Anti-Sombra de 7ª Geração', 'Palladion', 'VII - A Carruagem (The Chariot)', 'Androide de combate criada para combater sombras, dotada de grande lealdade ao protagonista.', 'assets/images/persona/persona 3 reload/Aigis.jpg', null],
            [$p3Id, 'Ken Amada', 'Usuário de Lança', 'Nemesis', 'VIII - A Justiça (Justice)', 'Jovem perspicaz e maduro para a idade, combate com destreza usando armas de haste e magias de luz.', 'assets/images/persona/persona 3 reload/amada.jpg', null],
            [$p3Id, 'Shinjiro Aragaki', 'Veterano de Combate', 'Castor', 'V - O Hierofante (Hierophant)', 'Antigo membro com aparência severa, coração protetor e força descomunal de impacto em combate.', 'assets/images/persona/persona 3 reload/Aragaki.jpg', null],
            [$p3Id, 'Koromaru', 'Cão Guardião', 'Cerberus', 'XI - A Força (Strength)', 'Cão inteligente e corajoso que empunha facas na boca e combate Sombras com lealdade admirável.', 'assets/images/persona/persona 3 reload/Koromaru.jpg', null],

            // Persona 4 Revival
            [$p4Id, 'Yu Narukami', 'Protagonista / Líder da Equipe', 'Izanagi', '0 - O Louco (The Fool)', 'Estudante calmo e confiante que lidera a equipe de investigação nas névoas do Mundo da TV.', 'assets/images/persona/persona 4 revival/Yu.jpg', null],
            [$p4Id, 'Yosuke Hanamura', 'Estrategista Ágil', 'Jiraiya', 'I - O Mago (The Magician)', 'Amigo leal do protagonista, combate com adagas gêmeas e grande senso de companheirismo.', 'assets/images/persona/persona 4 revival/Yusuke.jpg', null],
            [$p4Id, 'Chie Satonaka', 'Especialista em Kung Fu', 'Tomoe', 'VIII - A Carruagem / A Força', 'Garota energética apaixonada por artes marciais que defende seus amigos com chutes fulminantes.', 'assets/images/persona/persona 4 revival/chie.jpg', null],
            [$p4Id, 'Yukiko Amagi', 'Herdeira da Pousada Amagi', 'Konohana Sakuya', 'II - A Sacerdotisa (High Priestess)', 'Jovem graciosa especializada em magias de fogo e cura restauradora para toda a equipe.', 'assets/images/persona/persona 4 revival/yukiko.jpg', null],
            [$p4Id, 'Kanji Tatsumi', 'Guerreiro de Vanguarda', 'Take-Mikazuchi', 'IV - O Imperador (The Emperor)', 'Apesar da postura intimidadora, tem coração bondoso e desfere golpes elétricos devastadores.', 'assets/images/persona/persona 4 revival/Kanji.jpg', null],
            [$p4Id, 'Rise Kujikawa', 'Navegadora / Idol', 'Himiko', 'VI - Os Enamorados (The Lovers)', 'Famosa idol que usa sua capacidade perceptiva para orientar a equipe em tempo real no combate.', 'assets/images/persona/persona 4 revival/Rise.jpg', null],
            [$p4Id, 'Teddie (Kuma)', 'Guia do TV World', 'Kintoki-Douji', 'XVII - A Estrela (The Star)', 'Criatura carismática nativa do Mundo da TV que apoia o grupo com magias de gelo e energia.', 'assets/images/persona/persona 4 revival/Teddy.jpg', null],
            [$p4Id, 'Naoto Shirogane', 'Detetive Prodígio', 'Sukuna-Hikona', 'V - O Hierofante / A Fortuna', 'Jovem prodígio da investigação policial com intelecto tático e maestria no uso de armas de fogo.', 'assets/images/persona/persona 4 revival/naoto.jpg', null],

            // Persona 5 Royal (com Imagem Normal e Imagem Transformada)
            [$p5Id, 'Ren Amamiya (Joker)', 'Líder dos Phantom Thieves', 'Arsène', '0 - O Louco (The Fool)', 'Líder carismático dos Ladrões Fantasmas, mestre da furtividade e de múltiplas Personas no Metaverso.', 'assets/images/persona/persona 5 Royal/ren/Ren.jpg', 'assets/images/persona/persona 5 Royal/ren/ren_transformed.jpg'],
            [$p5Id, 'Morgana (Mona)', 'Guia do Metaverso', 'Zorro', 'I - O Mago (The Magician)', 'Criatura misteriosa de agilidade felina que ensina as táticas do Metaverso e cura os aliados.', 'assets/images/persona/persona 5 Royal/morgana/morgana.jpg', 'assets/images/persona/persona 5 Royal/morgana/morgana_transformed.jpg'],
            [$p5Id, 'Ryuji Sakamoto (Skull)', 'Vanguarda Rebelde', 'Captain Kidd', 'VII - A Carruagem (The Chariot)', 'Ex-atleta impetuoso com determinação de aço, combate com bastões pesados e poder elétrico.', 'assets/images/persona/persona 5 Royal/ryuji/ryuji.jpg', 'assets/images/persona/persona 5 Royal/ryuji/ryuji_transformed.jpg'],
            [$p5Id, 'Ann Takamaki (Panther)', 'Atacante Flamejante', 'Carmen', 'VI - Os Enamorados (The Lovers)', 'Estudante determinada e empática que empunha chicotes e magias de fogo avassaladoras.', 'assets/images/persona/persona 5 Royal/ann/ann.jpg', 'assets/images/persona/persona 5 Royal/ann/ann_transformed.jpg'],
            [$p5Id, 'Yusuke Kitagawa (Fox)', 'Espadachim Artista', 'Goemon', 'IV - O Imperador (The Emperor)', 'Artista dedicado à beleza e à honra, combate com katanas afiadas e habilidades de gelo.', 'assets/images/persona/persona 5 Royal/yusuke/yusuke.jpg', 'assets/images/persona/persona 5 Royal/yusuke/yusuke_transformed.jpg'],
            [$p5Id, 'Makoto Niijima (Queen)', 'Estrategista / Punho de Ferro', 'Johanna', 'II - A Sacerdotisa (High Priestess)', 'A mente tática do grupo. Pilota uma motocicleta Persona com socos nucleares contundentes.', 'assets/images/persona/persona 5 Royal/makoto/makoto.jpg', 'assets/images/persona/persona 5 Royal/makoto/makoto_transformed.jpg'],
            [$p5Id, 'Futaba Sakura (Oracle)', 'Navegadora Hacker', 'Necronomicon', 'IX - O Eremita (The Hermit)', 'Hacker genial que monitora os Palácios, provendo buffs e suporte analítico vital à equipe.', 'assets/images/persona/persona 5 Royal/futaba/Futaba.jpg', 'assets/images/persona/persona 5 Royal/futaba/futaba_transformed.jpg'],
            [$p5Id, 'Haru Okumura (Noir)', 'Artilheira Elegante', 'Milady', 'III - A Imperatriz (Empress)', 'Herdeira gentil com espírito aventureiro, empunha machados de duas mãos e ataques psicocinéticos.', 'assets/images/persona/persona 5 Royal/haru/Haru.jpg', 'assets/images/persona/persona 5 Royal/haru/haru_transformed.jpg'],
            [$p5Id, 'Goro Akechi (Crow)', 'Detetive / Duelista', 'Robin Hood', 'VIII - A Justiça (Justice)', 'Detetive brilhante de raciocínio afiado que empunha sabres laser e magias de luz radiante.', 'assets/images/persona/persona 5 Royal/akechi/akechi.jpg', 'assets/images/persona/persona 5 Royal/akechi/akechi_transformed.jpg'],
            [$p5Id, 'Kasumi Yoshizawa (Violet)', 'Ginasta Prodígio', 'Cendrillon', 'A Fé (The Faith)', 'Ginasta rítmica graciosa que combate com estoque e movimentos acrobáticos elegantes.', 'assets/images/persona/persona 5 Royal/kasumi/Kasumi.jpg', 'assets/images/persona/persona 5 Royal/kasumi/kasumi_transformed.jpg']
        ];

        $stmtChar = $pdo->prepare("INSERT INTO characters (id, game_id, name, role_tag, persona_name, arcana, description, image, image_transformed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($characters as $char) {
            $stmtChar->execute([Database::uuid(), $char[0], $char[1], $char[2], $char[3], $char[4], $char[5], $char[6], $char[7]]);
        }
        $output[] = "🎭 " . count($characters) . " Personagens cadastrados com imagens oficiais e modo transformado P5.";

        // 6. Produtos da Loja (Persona 3 Reload, Persona 4 Revival, Persona 5 Royal)
        $p3StdId = Database::uuid();
        $p3DlxId = Database::uuid();
        $p4RevivalId = Database::uuid();
        $p5StdId = Database::uuid();
        $p5SupId = Database::uuid();

        $stmtProd = $pdo->prepare("INSERT INTO products (id, game_id, name, slug, description, edition, price, original_price, platform, stock_quantity, active, is_featured, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        // P3 Reload
        $stmtProd->execute([$p3StdId, $p3Id, 'Persona 3 Reload - Standard Edition (Steam Key)', 'persona-3-reload-standard', 'Edição padrão completa de Persona 3 Reload para ativação imediata na Steam.', 'Standard Edition', 244.93, 349.90, 'Steam', 5, 1, 1, 'assets/images/covers/p3r.jpg']);
        $stmtProd->execute([$p3DlxId, $p3Id, 'Persona 3 Reload - Digital Deluxe Edition (Steam Key)', 'persona-3-reload-deluxe', 'Inclui jogo base + Livro de Arte Digital oficial + Trilha Sonora Digital com arranjos exclusivos.', 'Digital Deluxe Edition', 299.90, 399.90, 'Steam', 3, 1, 1, 'assets/images/covers/p3r.jpg']);
        
        // P4 Revival
        $stmtProd->execute([$p4RevivalId, $p4Id, 'Persona 4 Revival - Definitive Edition (Steam Key)', 'persona-4-revival-definitive', 'A recriação expandida da jornada em Inaba com gráficos renovados, melhorias de qualidade de vida e conteúdo extra.', 'Revival Definitive Edition', 189.90, 249.90, 'Steam', 6, 1, 1, 'assets/images/covers/p4r.jpg']);
        
        // P5 Royal
        $stmtProd->execute([$p5StdId, $p5Id, 'Persona 5 Royal - Standard Edition (Steam Key)', 'persona-5-royal-standard', 'A obra-prima dos RPGs modernos com mais de 40 DLCs inclusos gratuitamente (trajes, BGM e Personas lendárias).', 'Standard Edition', 119.96, 299.90, 'Steam', 6, 1, 1, 'assets/images/covers/p5r.jpg']);
        $stmtProd->execute([$p5SupId, $p5Id, 'Persona 5 Royal - Phantom Thieves Supreme Edition (Steam Key)', 'persona-5-royal-supreme', 'Inclui jogo completo, pacote de Personas DLC, livro de arte em alta definição e papel de parede dinâmico.', 'Supreme Edition', 169.90, 349.90, 'Steam', 4, 1, 1, 'assets/images/covers/p5r.jpg']);
        $output[] = "🛍️ Catálogo Persona Replay populado (P3 Reload, Persona 4 Revival, P5 Royal com capas oficiais).";

        // 7. Chaves Steam Criptografadas
        $keysList = [
            $p3StdId => ["P3RE-7B9A-48FE-91C2", "P3RE-88AF-3321-DC89", "P3RE-1142-990A-EFB3", "P3RE-5561-AA88-3419", "P3RE-9011-88FE-7721"],
            $p3DlxId => ["P3DLX-9981-AA11-4432", "P3DLX-5511-BC44-9981", "P3DLX-7744-1188-EE55"],
            $p4RevivalId => ["P4RV-9988-7766-5544", "P4RV-1234-5678-9012", "P4RV-ABCD-EF01-2345", "P4RV-4451-9988-AACC", "P4RV-8811-3322-FF99", "P4RV-1177-8899-0011"],
            $p5StdId => ["P5RY-ABCD-1234-EF56", "P5RY-7890-WXYZ-1122", "P5RY-3344-5566-7788", "P5RY-9900-AABB-CCDD"],
            $p5SupId => ["P5SUP-9911-AABB-CCDD", "P5SUP-2233-4455-6677", "P5SUP-8899-0011-2233"]
        ];

        $stmtKey = $pdo->prepare("INSERT INTO digital_keys (id, product_id, code_encrypted, code_hash, status) VALUES (?, ?, ?, ?, 'AVAILABLE')");
        $totalKeysInserted = 0;
        foreach ($keysList as $prodId => $codes) {
            foreach ($codes as $rawCode) {
                $enc = encrypt_key($rawCode);
                $stmtKey->execute([Database::uuid(), $prodId, $enc['encrypted'], $enc['hash']]);
                $totalKeysInserted++;
            }
        }
        $output[] = "🔑 $totalKeysInserted Chaves digitais criptografadas (AES-256) em estoque.";

        // 8. Lojas e Ofertas Externas
        $steamStoreId = Database::uuid();
        $nuuvemStoreId = Database::uuid();
        $gmgStoreId = Database::uuid();
        $epicStoreId = Database::uuid();

        $stmtStore = $pdo->prepare("INSERT INTO external_stores (id, name, website, reliability_status) VALUES (?, ?, ?, ?)");
        $stmtStore->execute([$steamStoreId, 'Steam Store Oficial', 'https://store.steampowered.com', 'OFFICIAL_STORE']);
        $stmtStore->execute([$nuuvemStoreId, 'Nuuvem (Brasil)', 'https://www.nuuvem.com', 'OFFICIAL_RESELLER']);
        $stmtStore->execute([$gmgStoreId, 'Green Man Gaming', 'https://www.greenmangaming.com', 'AUTHORIZED_PARTNER']);
        $stmtStore->execute([$epicStoreId, 'Epic Games Store', 'https://store.epicgames.com', 'OFFICIAL_STORE']);

        $offers = [
            [$nuuvemStoreId, $p3Id, $p3StdId, 258.90, 349.90, 'https://www.nuuvem.com/br-pt/item/persona-3-reload', 'Steam'],
            [$steamStoreId, $p3Id, $p3StdId, 349.90, 349.90, 'https://store.steampowered.com/app/2161700/Persona_3_Reload/', 'Steam'],
            [$gmgStoreId, $p3Id, $p3StdId, 265.40, 349.90, 'https://www.greenmangaming.com/games/persona-3-reload-pc/', 'Steam'],
            [$nuuvemStoreId, $p4Id, $p4RevivalId, 179.90, 249.90, 'https://www.nuuvem.com/br-pt/item/persona-4-revival', 'Steam'],
            [$steamStoreId, $p4Id, $p4RevivalId, 189.90, 249.90, 'https://store.steampowered.com/app/persona-4-revival/', 'Steam'],
            [$gmgStoreId, $p4Id, $p4RevivalId, 184.90, 249.90, 'https://www.greenmangaming.com/games/persona-4-revival/', 'Steam'],
            [$nuuvemStoreId, $p5Id, $p5StdId, 134.95, 299.90, 'https://www.nuuvem.com/br-pt/item/persona-5-royal', 'Steam'],
            [$steamStoreId, $p5Id, $p5StdId, 149.95, 299.90, 'https://store.steampowered.com/app/1687950/Persona_5_Royal/', 'Steam'],
            [$gmgStoreId, $p5Id, $p5StdId, 128.90, 299.90, 'https://www.greenmangaming.com/games/persona-5-royal-pc/', 'Steam'],
            [$epicStoreId, $p5Id, $p5StdId, 299.90, 299.90, 'https://store.epicgames.com/p/persona-5-royal', 'Epic']
        ];

        $stmtOffer = $pdo->prepare("INSERT INTO external_offers (id, store_id, game_id, product_id, price, original_price, url, platform) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($offers as $off) {
            $stmtOffer->execute([Database::uuid(), $off[0], $off[1], $off[2], $off[3], $off[4], $off[5], $off[6]]);
        }
        $output[] = "📊 Comparador de preços configurado.";

        $success = true;
    } catch (Exception $e) {
        $output[] = "❌ ERRO: " . $e->getMessage();
    }
}

if ($isCli) {
    echo "\n" . implode("\n", $output) . "\n\n";
    exit($success ? 0 : 1);
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instalador Persona Replay</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
    <style>
        body { background: #0e122b; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; }
        .card { background: #181d45; border: 2px solid #313a7a; border-radius: 20px; max-width: 650px; width: 100%; padding: 36px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); }
        h1 { font-family: 'Cinzel', serif; font-size: 28px; color: #ef4444; letter-spacing: 2px; margin-bottom: 8px; }
        .log-box { background: #070918; border: 1px solid #313a7a; border-radius: 12px; padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #10b981; max-height: 280px; overflow-y: auto; margin-bottom: 24px; line-height: 1.7; }
        .btn { display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 14px 24px; background: #ef4444; color: white; font-weight: 800; text-transform: uppercase; border: none; border-radius: 10px; cursor: pointer; text-decoration: none; }
        .btn-success { background: #10b981; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Persona Replay Installer</h1>
        <p>Instalação e configuração automática do banco de dados.</p>

        <?php if (!empty($output)): ?>
            <div class="log-box">
                <?php foreach ($output as $line): ?>
                    <div><?= htmlspecialchars($line) ?></div>
                <?php endforeach; ?>
            </div>

            <?php if ($success): ?>
                <a href="<?= BASE_URL ?>/" class="btn btn-success">Acessar Persona Replay ➔</a>
            <?php else: ?>
                <form method="POST">
                    <button type="submit" class="btn">Tentar Novamente</button>
                </form>
            <?php endif; ?>
        <?php else: ?>
            <form method="POST">
                <button type="submit" class="btn">⚡ Instalar e Popular Banco de Dados</button>
            </form>
        <?php endif; ?>
    </div>
</body>
</html>
