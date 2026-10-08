<?php
/**
 * Persona Replay - Games Hub View
 */

$pageTitle = "Jogos & Lore Persona";
$activeNav = "games";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="container" style="padding-top: 40px; padding-bottom: 80px;">
    <!-- Section Header -->
    <div style="text-align: center; max-width: 700px; margin: 0 auto 48px auto;">
        <span class="badge badge-primary" style="margin-bottom: 8px;">Universo Persona Replay</span>
        <h1 class="font-display" style="font-size: 42px; font-weight: 900; text-transform: uppercase;">A Saga dos Ladrões & Executores</h1>
        <p style="color: var(--theme-muted); font-size: 16px;">Conheça a história, personagens lendários e edições de cada capítulo marcante da franquia Persona.</p>
    </div>

    <!-- Games Grid -->
    <div style="display: flex; flex-direction: column; gap: 48px;">
        <?php foreach ($games as $game): 
            $gameTheme = $game['theme'] ?? 'persona5';
        ?>
            <div class="card card-hover" style="padding: 0; overflow: hidden; display: grid; grid-template-columns: 1.2fr 1fr; border-radius: 20px;">
                <div style="position: relative; min-height: 320px;">
                    <img src="<?= asset($game['image']) ?>" alt="<?= htmlspecialchars($game['name']) ?>" style="width: 100%; height: 100%; object-fit: cover;">
                </div>

                <div style="padding: 36px; display: flex; flex-direction: column; justify-content: center;">
                    <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
                        <span class="badge badge-primary">Metacritic <?= $game['metacritic_score'] ?></span>
                        <span class="badge badge-primary"><?= htmlspecialchars($game['genre']) ?></span>
                        <?php if ($game['slug'] === 'persona-4'): ?>
                            <span class="badge badge-discount">Inclui Golden & Revival</span>
                        <?php endif; ?>
                    </div>

                    <h2 class="font-display" style="font-size: 28px; font-weight: 900; text-transform: uppercase; margin-bottom: 12px;">
                        <?= htmlspecialchars($game['name']) ?>
                    </h2>

                    <p style="font-size: 14px; color: var(--theme-muted); line-height: 1.6; margin-bottom: 24px;">
                        <?= htmlspecialchars($game['description']) ?>
                    </p>

                    <div style="display: flex; gap: 12px;">
                        <a href="<?= url('jogos/' . $game['slug']) ?>" 
                           class="btn btn-primary"
                           data-transition-theme="<?= htmlspecialchars($gameTheme) ?>"
                           data-url="<?= url('jogos/' . $game['slug']) ?>">
                            Explorar Universo & Personagens <i class="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
