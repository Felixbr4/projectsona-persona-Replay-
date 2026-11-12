<?php
/**
 * Persona Replay - Banner e Modal de Consentimento de Cookies (LGPD)
 * Lei Federal nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais)
 */
?>
<!-- LGPD Cookie Banner Flutuante -->
<div id="lgpd-cookie-banner" class="lgpd-cookie-banner" role="dialog" aria-modal="true" aria-labelledby="lgpd-banner-title" style="display: none;">
    <div class="container lgpd-banner-inner">
        <div class="lgpd-banner-content">
            <div class="lgpd-banner-header">
                <div class="lgpd-banner-icon">
                    <i class="fa-solid fa-cookie-bite"></i>
                </div>
                <div>
                    <span class="badge badge-primary lgpd-badge">LGPD • Lei nº 13.709/2018</span>
                    <h3 id="lgpd-banner-title" class="lgpd-banner-title">Controle de Privacidade & Cookies</h3>
                </div>
            </div>
            <p class="lgpd-banner-desc">
                Utilizamos cookies e tecnologias similares para garantir o funcionamento seguro da loja, personalizar sua experiência com os temas dinâmicos da franquia Persona e viabilizar pedidos com chaves protegidas por criptografia militar (AES-256). Você tem controle integral sobre seus dados conforme a <strong>LGPD</strong>.
                <a href="<?= url('lgpd') ?>" class="lgpd-link">Leia nossos Termos de Privacidade & LGPD</a>.
            </p>
        </div>

        <div class="lgpd-banner-actions">
            <button type="button" class="btn btn-primary lgpd-btn" id="lgpd-btn-accept-all">
                <i class="fa-solid fa-check-double"></i> Aceitar Todos
            </button>
            <button type="button" class="btn btn-secondary lgpd-btn" id="lgpd-btn-reject-optional">
                <i class="fa-solid fa-shield-halved"></i> Apenas Essenciais
            </button>
            <button type="button" class="btn btn-secondary lgpd-btn" id="lgpd-btn-open-modal" style="border-style: dashed;">
                <i class="fa-solid fa-sliders"></i> Personalizar
            </button>
        </div>
    </div>
</div>

<!-- Modal Detalhado de Preferências de Cookies (LGPD) -->
<div id="lgpd-cookie-modal" class="lgpd-modal-overlay" style="display: none;" role="dialog" aria-modal="true" aria-labelledby="lgpd-modal-title">
    <div class="lgpd-modal-card">
        <div class="lgpd-modal-header">
            <div>
                <span class="badge badge-primary lgpd-badge">Consentimento Granular • Arts. 7º, 8º e 9º da LGPD</span>
                <h2 id="lgpd-modal-title" class="lgpd-modal-title">Gerenciar Preferências de Cookies</h2>
            </div>
            <button type="button" class="lgpd-modal-close" id="lgpd-modal-close-btn" aria-label="Fechar painel de cookies">&times;</button>
        </div>

        <div class="lgpd-modal-body">
            <p class="lgpd-modal-intro">
                Em observância ao princípio da transparência e do livre consentimento previsto na <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</strong>, você tem a liberdade de habilitar ou desabilitar cada categoria de cookies. Cookies estritamente necessários permanecem sempre ativos para assegurar a autenticação e a integridade de compras e chaves digitais.
            </p>

            <!-- Categorias Granulares -->
            <div class="lgpd-category-list">
                <!-- Categoria 1: Essenciais (Obrigatórios) -->
                <div class="lgpd-category-card">
                    <div class="lgpd-category-top">
                        <div class="lgpd-category-info">
                            <span class="lgpd-category-name">
                                <i class="fa-solid fa-lock" style="color: var(--theme-primary);"></i>
                                Cookies Estritamente Necessários
                            </span>
                            <span class="badge badge-stock">Sempre Ativo • Obrigatório</span>
                        </div>
                        <label class="lgpd-switch">
                            <input type="checkbox" id="cookie-cat-necessary" checked disabled aria-label="Cookies Necessários (Sempre Ativos)">
                            <span class="lgpd-slider disabled"></span>
                        </label>
                    </div>
                    <p class="lgpd-category-text">
                        Indispensáveis para a segurança operacional da loja Persona Replay. Atuam na sessão de usuário, proteção contra ataques CSRF, persistência do carrinho de compras e entrega protegida de chaves Steam via criptografia AES-256. Não realizam rastreamento para fins de publicidade.
                    </p>
                </div>

                <!-- Categoria 2: Preferências & Temas -->
                <div class="lgpd-category-card">
                    <div class="lgpd-category-top">
                        <div class="lgpd-category-info">
                            <span class="lgpd-category-name">
                                <i class="fa-solid fa-palette" style="color: var(--theme-primary);"></i>
                                Cookies de Preferências & Temas Visuais
                            </span>
                            <span class="badge badge-primary">Experiência</span>
                        </div>
                        <label class="lgpd-switch">
                            <input type="checkbox" id="cookie-cat-preferences" checked aria-label="Cookies de Preferências e Temas">
                            <span class="lgpd-slider"></span>
                        </label>
                    </div>
                    <p class="lgpd-category-text">
                        Salvam a sua preferência de tema da franquia (Persona 3 Reload, Persona 4 Revival, Persona 5 Royal e paleta Velvet Room), preservando o estilo visual escolhido durante toda a sua navegação na loja.
                    </p>
                </div>

                <!-- Categoria 3: Desempenho e Estatísticas -->
                <div class="lgpd-category-card">
                    <div class="lgpd-category-top">
                        <div class="lgpd-category-info">
                            <span class="lgpd-category-name">
                                <i class="fa-solid fa-chart-line" style="color: var(--theme-primary);"></i>
                                Cookies Analíticos & Desempenho
                            </span>
                            <span class="badge badge-primary">Estatísticas</span>
                        </div>
                        <label class="lgpd-switch">
                            <input type="checkbox" id="cookie-cat-analytics" aria-label="Cookies Analíticos">
                            <span class="lgpd-slider"></span>
                        </label>
                    </div>
                    <p class="lgpd-category-text">
                        Coletam dados estatísticos anônimos sobre tempo de resposta das páginas, rotas mais acessadas e estabilidade do sistema, permitindo melhorias técnicas contínuas na plataforma.
                    </p>
                </div>

                <!-- Categoria 4: Marketing e Promoções -->
                <div class="lgpd-category-card">
                    <div class="lgpd-category-top">
                        <div class="lgpd-category-info">
                            <span class="lgpd-category-name">
                                <i class="fa-solid fa-tag" style="color: var(--theme-primary);"></i>
                                Cookies de Ofertas & Lojas Parceiras
                            </span>
                            <span class="badge badge-primary">Ofertas</span>
                        </div>
                        <label class="lgpd-switch">
                            <input type="checkbox" id="cookie-cat-marketing" aria-label="Cookies de Marketing e Ofertas">
                            <span class="lgpd-slider"></span>
                        </label>
                    </div>
                    <p class="lgpd-category-text">
                        Permitem personalizar os alertas de promoções no comparador de preços e sugerir as edições dos jogos Persona com maior desconto entre as lojas oficiais parceiras (Steam, Nuuvem e Green Man Gaming).
                    </p>
                </div>
            </div>
        </div>

        <div class="lgpd-modal-footer">
            <button type="button" class="btn btn-secondary lgpd-modal-btn" id="lgpd-btn-modal-reject-optional">
                Rejeitar Opcionais
            </button>
            <button type="button" class="btn btn-secondary lgpd-modal-btn" id="lgpd-btn-modal-save-custom">
                Salvar Preferências
            </button>
            <button type="button" class="btn btn-primary lgpd-modal-btn" id="lgpd-btn-modal-accept-all">
                Aceitar Todos
            </button>
        </div>
    </div>
</div>

<!-- Botão Flutuante Discreto de Reabertura das Preferências de Cookies (LGPD) -->
<button type="button" id="lgpd-floating-btn" class="lgpd-floating-trigger" title="Gerenciar Cookies & Privacidade (LGPD)" aria-label="Gerenciar preferências de cookies">
    <i class="fa-solid fa-cookie-bite"></i>
    <span class="lgpd-floating-tooltip">Privacidade & Cookies</span>
</button>

