/**
 * ProjecSona - Frontend Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Switcher Handler
    const themePills = document.querySelectorAll('.theme-pill');
    themePills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            const theme = pill.getAttribute('data-theme');
            
            // Remove previous theme classes
            document.body.classList.remove('theme-persona3', 'theme-persona4', 'theme-persona5');
            
            if (theme !== 'velvet') {
                document.body.classList.add(`theme-${theme}`);
            }

            // Update active pill state
            themePills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            // Save to session via AJAX
            const baseUrl = document.body.getAttribute('data-base-url') || '';
            fetch(`${baseUrl}/api/theme.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `theme=${encodeURIComponent(theme)}`
            }).catch(err => console.log('Theme sync error:', err));
        });
    });

    // 2. Copy Digital Key to Clipboard
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

    // 3. Cart Quantity Update
    const qtyInputs = document.querySelectorAll('.cart-qty-input');
    qtyInputs.forEach(input => {
        input.addEventListener('change', () => {
            const form = input.closest('form');
            if (form) {
                form.submit();
            }
        });
    });

    // 4. Auto dismiss alert messages after 5 seconds
    const alerts = document.querySelectorAll('.alert-dismissible');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transition = 'opacity 0.5s ease';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    });
});
