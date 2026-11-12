/**
 * Persona Replay - Gerenciador de Consentimento de Cookies (LGPD)
 * Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018)
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'persona_lgpd_consent';
    const CONSENT_VERSION = '1.0';

    // Utilitário para ler consentimento gravado
    function getStoredConsent() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (parsed && parsed.version === CONSENT_VERSION) {
                return parsed;
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    // Utilitário para persistir consentimento
    function saveConsent(preferences) {
        const payload = {
            necessary: true,
            preferences: !!preferences.preferences,
            analytics: !!preferences.analytics,
            marketing: !!preferences.marketing,
            timestamp: new Date().toISOString(),
            version: CONSENT_VERSION
        };

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
            // Grava cookie para interoperabilidade com o servidor
            const consentVal = (payload.preferences && payload.analytics && payload.marketing) ? 'all' : (payload.preferences || payload.analytics || payload.marketing ? 'custom' : 'essential');
            document.cookie = `lgpd_consent=${consentVal}; path=/; max-age=31536000; SameSite=Lax`;
        } catch (e) {
            console.warn('Erro ao salvar preferências de cookies:', e);
        }

        return payload;
    }

    // Exibe notificação temporária sutil (Toast)
    function showNotification(message) {
        let toast = document.getElementById('lgpd-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'lgpd-toast';
            toast.className = 'lgpd-toast';
            document.body.appendChild(toast);
        }

        toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const banner = document.getElementById('lgpd-cookie-banner');
        const modal = document.getElementById('lgpd-cookie-modal');
        const floatingBtn = document.getElementById('lgpd-floating-btn');

        if (!banner || !modal) return;

        const btnAcceptAll = document.getElementById('lgpd-btn-accept-all');
        const btnRejectOptional = document.getElementById('lgpd-btn-reject-optional');
        const btnOpenModal = document.getElementById('lgpd-btn-open-modal');
        const btnCloseModal = document.getElementById('lgpd-modal-close-btn');

        const btnModalAcceptAll = document.getElementById('lgpd-btn-modal-accept-all');
        const btnModalRejectOptional = document.getElementById('lgpd-btn-modal-reject-optional');
        const btnModalSave = document.getElementById('lgpd-btn-modal-save-custom');

        const checkPreferences = document.getElementById('cookie-cat-preferences');
        const checkAnalytics = document.getElementById('cookie-cat-analytics');
        const checkMarketing = document.getElementById('cookie-cat-marketing');

        const stored = getStoredConsent();

        // Atualiza os toggles com os valores atuais ou padrão
        function syncToggles(consent) {
            if (checkPreferences) checkPreferences.checked = consent ? consent.preferences : true;
            if (checkAnalytics) checkAnalytics.checked = consent ? consent.analytics : false;
            if (checkMarketing) checkMarketing.checked = consent ? consent.marketing : false;
        }

        // Abre o modal de preferências granulares
        function openModal() {
            const current = getStoredConsent();
            syncToggles(current);
            modal.style.display = 'flex';
            // Trigger reflow para animação
            void modal.offsetWidth;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Fecha o modal de preferências granulares
        function closeModal() {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 250);
        }

        // Fecha o banner com animação suave
        function hideBanner() {
            banner.classList.remove('active');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
            if (floatingBtn) {
                floatingBtn.style.display = 'flex';
            }
        }

        // Mostra o banner na tela
        function showBanner() {
            banner.style.display = 'block';
            void banner.offsetWidth;
            banner.classList.add('active');
            if (floatingBtn) {
                floatingBtn.style.display = 'none';
            }
        }

        // Exporta função global para reabrir preferências via link no rodapé ou na página LGPD
        window.openCookieConsentModal = function () {
            openModal();
        };

        // Verifica consentimento prévio
        if (!stored) {
            // Se o usuário ainda não decidiu, exibe o popup após 600ms de carregamento
            setTimeout(() => {
                showBanner();
            }, 600);
        } else {
            // Se já consentiu, mantém banner oculto e habilita botão flutuante discreto
            syncToggles(stored);
            if (floatingBtn) {
                floatingBtn.style.display = 'flex';
            }
        }

        // Ações do Banner
        if (btnAcceptAll) {
            btnAcceptAll.addEventListener('click', () => {
                saveConsent({ preferences: true, analytics: true, marketing: true });
                hideBanner();
                showNotification('Todos os cookies foram aceitos conforme a LGPD.');
            });
        }

        if (btnRejectOptional) {
            btnRejectOptional.addEventListener('click', () => {
                saveConsent({ preferences: false, analytics: false, marketing: false });
                hideBanner();
                showNotification('Apenas cookies essenciais de segurança e compras permanecem ativos.');
            });
        }

        if (btnOpenModal) {
            btnOpenModal.addEventListener('click', () => {
                openModal();
            });
        }

        // Ações do Modal
        if (btnCloseModal) {
            btnCloseModal.addEventListener('click', () => {
                closeModal();
            });
        }

        // Fecha modal ao clicar fora do card
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Fechar com tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        if (btnModalAcceptAll) {
            btnModalAcceptAll.addEventListener('click', () => {
                saveConsent({ preferences: true, analytics: true, marketing: true });
                closeModal();
                hideBanner();
                showNotification('Todos os cookies foram aceitos.');
            });
        }

        if (btnModalRejectOptional) {
            btnModalRejectOptional.addEventListener('click', () => {
                saveConsent({ preferences: false, analytics: false, marketing: false });
                syncToggles({ preferences: false, analytics: false, marketing: false });
                closeModal();
                hideBanner();
                showNotification('Apenas cookies essenciais de segurança estão ativos.');
            });
        }

        if (btnModalSave) {
            btnModalSave.addEventListener('click', () => {
                const prefs = {
                    preferences: checkPreferences ? checkPreferences.checked : false,
                    analytics: checkAnalytics ? checkAnalytics.checked : false,
                    marketing: checkMarketing ? checkMarketing.checked : false
                };
                saveConsent(prefs);
                closeModal();
                hideBanner();
                showNotification('Suas preferências de privacidade foram atualizadas.');
            });
        }

        // Botão flutuante
        if (floatingBtn) {
            floatingBtn.addEventListener('click', () => {
                openModal();
            });
        }

        // Vincular qualquer elemento com data-open-cookie-modal
        document.querySelectorAll('[data-open-cookie-modal]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        });
    });
})();

