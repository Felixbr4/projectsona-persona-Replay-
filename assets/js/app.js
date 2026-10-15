/**
 * Persona Replay - Interactive Frontend Engine
 * - Independent Velvet Room Palette Controller
 * - Game Navigation Tabs
 * - Persona 5 Royal Dual-image Character Interactions (Mouse, Touch, Keyboard)
 * - UI Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = document.body.getAttribute('data-base-url') || '';

    // =========================================================================
    // 1. Independent Velvet Room Color Theme Controller
    // =========================================================================
    const velvetBtn = document.getElementById('velvet-toggle-btn');
    
    // Check initial preference from localStorage if cookie wasn't yet initialized
    const savedVelvet = localStorage.getItem('persona_velvet_mode');
    if (savedVelvet === 'true' && !document.body.classList.contains('velvet-mode')) {
        document.body.classList.add('velvet-mode');
        if (velvetBtn) {
            velvetBtn.classList.add('active');
            velvetBtn.setAttribute('aria-pressed', 'true');
        }
    } else if (savedVelvet === 'false' && document.body.classList.contains('velvet-mode')) {
        document.body.classList.remove('velvet-mode');
        if (velvetBtn) {
            velvetBtn.classList.remove('active');
            velvetBtn.setAttribute('aria-pressed', 'false');
        }
    }

    if (velvetBtn) {
        velvetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const isCurrentlyVelvet = document.body.classList.contains('velvet-mode');
            const newVelvetState = !isCurrentlyVelvet;

            if (newVelvetState) {
                document.body.classList.add('velvet-mode');
                velvetBtn.classList.add('active');
                velvetBtn.setAttribute('aria-pressed', 'true');
            } else {
                document.body.classList.remove('velvet-mode');
                velvetBtn.classList.remove('active');
                velvetBtn.setAttribute('aria-pressed', 'false');
            }

            // Persist preference in localStorage
            localStorage.setItem('persona_velvet_mode', newVelvetState ? 'true' : 'false');

            // Persist to server session/cookie via AJAX (does not reload or navigate)
            fetch(`${baseUrl}/api/theme.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `velvet=${newVelvetState ? 'true' : 'false'}`
            }).catch(err => console.log('Velvet sync warning:', err));
        });
    }

    // =========================================================================
    // 2. Persona 5 Royal Dual-Image Character Cards Interaction (Mouse, Touch, Keyboard)
    // =========================================================================
    const p5Cards = document.querySelectorAll('.p5-dual-card');
    p5Cards.forEach(card => {
        // Preload the transformed image to prevent empty flash
        const transformedImg = card.querySelector('.p5-img-transformed');
        if (transformedImg && transformedImg.src) {
            const preload = new Image();
            preload.src = transformedImg.src;
        }

        // Touch & Click toggle for touch devices
        card.addEventListener('click', (e) => {
            // Avoid triggering when clicking child links or buttons
            if (e.target.closest('a, button, input, form')) return;
            
            card.classList.toggle('transformed');
            const isTransformed = card.classList.contains('transformed');
            card.setAttribute('aria-pressed', isTransformed ? 'true' : 'false');
        });

        // Keyboard interaction (Enter / Space)
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.toggle('transformed');
                const isTransformed = card.classList.contains('transformed');
                card.setAttribute('aria-pressed', isTransformed ? 'true' : 'false');
            }
        });
    });

    // =========================================================================
    // 3. Copy Digital Key to Clipboard
    // =========================================================================
    const copyBtns = document.querySelectorAll('.btn-copy-key');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const keyText = btn.getAttribute('data-key');
            if (keyText) {
                navigator.clipboard.writeText(keyText).then(() => {
                    const originalText = btn.innerText;
                    btn.innerText = 'Copiado!';
                    btn.classList.add('btn-success');
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.classList.remove('btn-success');
                    }, 2000);
                });
            }
        });
    });

    // =========================================================================
    // 4. Cart Quantity Update
    // =========================================================================
    const qtyInputs = document.querySelectorAll('.cart-qty-input');
    qtyInputs.forEach(input => {
        input.addEventListener('change', () => {
            const form = input.closest('form');
            if (form) form.submit();
        });
    });

    // =========================================================================
    // 5. Auto Dismiss Alerts
    // =========================================================================
    const alerts = document.querySelectorAll('.alert-dismissible');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transition = 'opacity 0.5s ease';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    });
});
