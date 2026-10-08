/**
 * Persona Replay - Interactive Cinematic Game Transitions
 * - Persona 3 Reload: Controlled Clock (Blue -> Midnight Emerald Green)
 * - Persona 4: Midnight Channel CRT TV Tuning
 * - Persona 5 Royal: Authentic Flying Calling Card with Phantom Thieves Logo
 */

class PersonaTransitions {
    static init() {
        this.createTransitionDOM();
        this.bindEvents();
    }

    static createTransitionDOM() {
        if (document.getElementById('persona-transition-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'persona-transition-overlay';
        overlay.className = 'persona-transition-overlay';
        overlay.innerHTML = `
            <!-- 1. Persona 3 Reload: Midnight Clock Transition -->
            <div id="p3-clock-container" class="p3-transition-view hidden">
                <div class="p3-clock-glass">
                    <div class="p3-clock-face">
                        <div class="p3-clock-center"></div>
                        <div class="p3-hand p3-hour-hand"></div>
                        <div class="p3-hand p3-minute-hand"></div>
                        <div class="p3-hand p3-second-hand"></div>
                        <div class="p3-clock-marks">
                            <span class="mark mark-12">XII</span>
                            <span class="mark mark-3">III</span>
                            <span class="mark mark-6">VI</span>
                            <span class="mark mark-9">IX</span>
                        </div>
                    </div>
                    <div class="p3-dark-hour-badge">
                        <span class="p3-time-text">11:58 PM</span>
                        <span class="p3-midnight-msg">A HORA SOMBRIA SE APROXIMA...</span>
                    </div>
                </div>
            </div>

            <!-- 2. Persona 4: Midnight Channel CRT TV Transition -->
            <div id="p4-tv-container" class="p4-transition-view hidden">
                <div class="p4-tv-frame">
                    <div class="p4-tv-screen">
                        <div class="p4-tv-static"></div>
                        <div class="p4-tv-fog"></div>
                        <div class="p4-tv-logo">
                            <div class="p4-tv-badge">MIDNIGHT CHANNEL</div>
                            <div class="p4-tv-text">SINTONIZANDO INABA...</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 3. Persona 5 Royal: 3D Flying Calling Card Transition -->
            <div id="p5-card-container" class="p5-transition-view hidden">
                <div class="p5-calling-card">
                    <div class="p5-card-inner">
                        <div class="p5-card-header">
                            <div class="p5-card-logo">
                                <svg viewBox="0 0 100 100" class="p5-flame-mask">
                                    <path d="M50 5 C30 25 15 45 15 65 C15 85 30 95 50 95 C70 95 85 85 85 65 C85 45 70 25 50 5 Z" fill="#ef4444" />
                                    <!-- Stylized Mask Cutouts -->
                                    <path d="M30 50 Q40 40 48 55 Q35 60 30 50 Z" fill="#000" />
                                    <path d="M70 50 Q60 40 52 55 Q65 60 70 50 Z" fill="#000" />
                                    <path d="M50 15 L52 35 L48 35 Z" fill="#fff" />
                                </svg>
                            </div>
                            <div class="p5-card-title">TAKE YOUR HEART</div>
                        </div>
                        <div class="p5-card-body">
                            <p class="p5-card-target">AVISO AOS CORAÇÕES CORROMPIDOS</p>
                            <p class="p5-card-msg">
                                "Nós sabemos dos seus desejos distorcidos. Esta noite, os Phantom Thieves of Hearts roubarão seu tesouro para que você confesse todos os seus crimes!"
                            </p>
                        </div>
                        <div class="p5-card-footer">
                            <span>PHANTOM THIEVES OF HEARTS</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    static bindEvents() {
        // Intercept game switches and card clicks
        document.querySelectorAll('[data-transition-theme]').forEach(el => {
            el.addEventListener('click', (e) => {
                const targetTheme = el.getAttribute('data-transition-theme');
                const targetUrl = el.getAttribute('href') || el.getAttribute('data-url');
                if (targetTheme && targetUrl) {
                    e.preventDefault();
                    this.playTransition(targetTheme, targetUrl);
                }
            });
        });
    }

    static playTransition(theme, targetUrl = null, callback = null) {
        const overlay = document.getElementById('persona-transition-overlay');
        if (!overlay) return;

        const p3View = document.getElementById('p3-clock-container');
        const p4View = document.getElementById('p4-tv-container');
        const p5View = document.getElementById('p5-card-container');

        // Reset views
        p3View.classList.add('hidden');
        p4View.classList.add('hidden');
        p5View.classList.add('hidden');
        overlay.classList.remove('active');

        overlay.classList.add('active');

        if (theme === 'persona3') {
            // Persona 3: Clock Accelerating & Reaching Midnight
            p3View.classList.remove('hidden');
            const clockGlass = p3View.querySelector('.p3-clock-glass');
            const hourHand = p3View.querySelector('.p3-hour-hand');
            const minHand = p3View.querySelector('.p3-minute-hand');
            const timeText = p3View.querySelector('.p3-time-text');
            const midnightMsg = p3View.querySelector('.p3-midnight-msg');

            // Initial Blue state
            clockGlass.classList.remove('dark-hour-active');
            timeText.innerText = "11:58 PM";
            midnightMsg.innerText = "O TEMPO AVANÇA...";

            // Hands movement
            hourHand.style.transform = "rotate(350deg)";
            minHand.style.transform = "rotate(300deg)";

            setTimeout(() => {
                // Accelerating to Midnight
                hourHand.style.transform = "rotate(360deg)";
                minHand.style.transform = "rotate(360deg)";
                timeText.innerText = "12:00 AM (00:00)";
            }, 600);

            // Reached Midnight -> TURN EMERALD GREEN (DARK HOUR)
            setTimeout(() => {
                clockGlass.classList.add('dark-hour-active');
                midnightMsg.innerText = "DARK HOUR: TÁRTARO DESPERTO!";
            }, 1100);

            setTimeout(() => {
                this.completeTransition(overlay, targetUrl, callback);
            }, 2200);

        } else if (theme === 'persona4') {
            // Persona 4: Midnight Channel TV
            p4View.classList.remove('hidden');
            setTimeout(() => {
                this.completeTransition(overlay, targetUrl, callback);
            }, 2000);

        } else if (theme === 'persona5') {
            // Persona 5: 3D Flying Calling Card
            p5View.classList.remove('hidden');
            const card = p5View.querySelector('.p5-calling-card');
            card.classList.add('card-flying');

            setTimeout(() => {
                this.completeTransition(overlay, targetUrl, callback);
            }, 2100);
        } else {
            // Velvet / standard
            setTimeout(() => {
                this.completeTransition(overlay, targetUrl, callback);
            }, 800);
        }
    }

    static completeTransition(overlay, targetUrl, callback) {
        overlay.classList.remove('active');
        if (typeof callback === 'function') {
            callback();
        }
        if (targetUrl) {
            window.location.href = targetUrl;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    PersonaTransitions.init();
});
