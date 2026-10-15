<?php
/**
 * Persona Replay - Layout Footer
 */
?>
    </main>

    <!-- Global Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <a href="<?= url('/') ?>" class="logo-brand-wrap" style="margin-bottom: 8px;">
                        <img src="<?= asset('images/logo.png') ?>" alt="Persona Replay Logo" style="height: 44px; width: auto; object-fit: contain;">
                    </a>
                    <p>A loja definitiva dedicada aos fãs da franquia Persona. Chaves Steam oficiais com entrega instantânea e comparador de ofertas em tempo real.</p>
                </div>

                <div class="footer-col">
                    <h4>Jogos Persona</h4>
                    <ul>
                        <li><a href="<?= url('jogos/persona-3-reload') ?>">Persona 3 Reload</a></li>
                        <li><a href="<?= url('jogos/persona-4') ?>">Persona 4 Revival</a></li>
                        <li><a href="<?= url('jogos/persona-5-royal') ?>">Persona 5 Royal</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h4>Navegação</h4>
                    <ul>
                        <li><a href="<?= url('catalogo') ?>">Catálogo Completo</a></li>
                        <li><a href="<?= url('ofertas') ?>">Comparador de Preços</a></li>
                        <li><a href="<?= url('carrinho') ?>">Meu Carrinho</a></li>
                        <li><a href="<?= url('conta') ?>">Minha Conta</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h4>Segurança & Privacidade</h4>
                    <ul>
                        <li><a href="<?= url('lgpd') ?>" style="color: var(--theme-primary); font-weight: 700;">Termos da LGPD & Privacidade</a></li>
                        <li><span style="color: var(--theme-muted); font-size: 13px;">Criptografia AES-256</span></li>
                        <li><span style="color: var(--theme-muted); font-size: 13px;">Chaves Oficiais Steam</span></li>
                        <li><a href="<?= url('install.php') ?>">Painel de Instalação</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; <?= date('Y') ?> Persona Replay. Todos os direitos reservados. Persona é marca registrada da ATLUS / SEGA.</p>
            </div>
        </div>
    </footer>

    <!-- App Scripts & Transitions -->
    <script src="<?= asset('js/transitions.js') ?>"></script>
    <script src="<?= asset('js/app.js') ?>"></script>
</body>
</html>
