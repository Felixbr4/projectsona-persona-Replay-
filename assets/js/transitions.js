/**
 * Persona Replay - Interactive Cinematic Game Transitions
 * - Persona 3 Reload: Controlled Clock (Blue -> Midnight Emerald Green Dark Hour)
 * - Persona 4 Revival: Authentic Vintage Yellow CRT TV with Rotating Yellow & Black Spiral and Subtle Noise
 * - Persona 5 Royal: Authentic Joker Mask with Organic Progressively Engulfing Blue Flames
 * - Accessibility: respects prefers-reduced-motion, safety timeout fallbacks to prevent navigation locks
 */

class PersonaTransitions {
    static isAnimating = false;

    static init() {
        this.createTransitionDOM();
        this.bindEvents();
    }

    static createTransitionDOM() {
        if (document.getElementById('persona-transition-overlay')) return;

        const baseUrl = document.body.getAttribute('data-base-url') || '';
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

            <!-- 2. Persona 4 Revival: Vintage Yellow CRT TV with Yellow & Black Spiral -->
            <div id="p4-tv-container" class="p4-transition-view hidden">
                <div class="p4-crt-tv" id="p4-crt-tv">
                    <!-- Antenas Vintage -->
                    <div class="p4-tv-antennas">
                        <div class="antenna antenna-left"></div>
                        <div class="antenna antenna-right"></div>
                    </div>

                    <!-- Corpo / Carcaça Amarela Volumosa -->
                    <div class="p4-tv-body">
                        <!-- Moldura da Tela CRT -->
                        <div class="p4-tv-bezel">
                            <div class="p4-crt-screen-wrap">
                                <!-- Curvatura de Vidro CRT e Linhas de Varredura -->
                                <div class="p4-crt-scanlines"></div>
                                <div class="p4-crt-glare"></div>
                                
                                <!-- Chiado Visual Leve (Estática/Interferência analógica sutil) -->
                                <div class="p4-crt-noise"></div>

                                <!-- Espiral Amarela e Preta com Rotação Contínua -->
                                <div class="p4-spiral-container">
                                    <svg viewBox="0 0 500 500" class="p4-spiral-svg" aria-hidden="true">
                                        <defs>
                                            <radialGradient id="p4SpiralCenter" cx="50%" cy="50%" r="50%">
                                                <stop offset="0%" stop-color="#facc15" />
                                                <stop offset="100%" stop-color="#0a0a0a" />
                                            </radialGradient>
                                        </defs>
                                        <g transform="translate(250, 250)">
                                            <!-- Listras alternadas amarelas e pretas em espiral hipnótica -->
                                            <!-- Braço 1 Amarelo -->
                                            <path d="M 0 0 C 40 -80, 160 -80, 200 0 C 240 80, 160 200, 0 220 C -160 240, -220 120, -220 0 C -220 -140, -100 -230, 0 -240 C 120 -250, 250 -140, 250 0 C 250 160, 120 270, -20 270 C -160 270, -260 160, -260 -10 C -260 -180, -140 -290, 0 -290 L 0 0 Z" fill="#facc15" />
                                            <!-- Braço 2 Preto -->
                                            <path d="M 0 0 C -40 80, -160 80, -200 0 C -240 -80, -160 -200, 0 -220 C 160 -240, 220 -120, 220 0 C 220 140, 100 230, 0 240 C -120 250, -250 140, -250 0 C -250 -160, -120 -270, 20 -270 C 160 -270, 260 -160, 260 10 C 260 180, 140 290, 0 290 L 0 0 Z" fill="#0a0a0a" />
                                            <!-- Braço 3 Amarelo Ouro -->
                                            <path d="M 0 0 C 80 40, 80 160, 0 200 C -80 240, -200 160, -220 0 C -240 -160, -120 -220, 0 -220 C 140 -220, 230 -100, 240 0 C 250 120, 140 250, 0 250 C -160 250, -270 120, -270 -20 C -270 -160, -160 -260, 10 -260 C 180 -260, 290 -140, 290 0 L 0 0 Z" fill="#eab308" opacity="0.9" />
                                            <!-- Braço 4 Preto Profundo -->
                                            <path d="M 0 0 C -80 -40, -80 -160, 0 -200 C 80 -240, 200 -160, 220 0 C 240 160, 120 220, 0 220 C -140 220, -230 100, -240 0 C -250 -120, -140 -250, 0 -250 C 160 -250, 270 -120, 270 20 C 270 160, 160 260, -10 260 C -180 260, -290 140, -290 0 L 0 0 Z" fill="#141414" />
                                            <!-- Centro de vórtice hipnótico -->
                                            <circle cx="0" cy="0" r="18" fill="#facc15" stroke="#000" stroke-width="4" />
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Painel de Controles Lateral da TV de Tubo -->
                        <div class="p4-tv-controls">
                            <div class="p4-tv-dial dial-channel"></div>
                            <div class="p4-tv-dial dial-volume"></div>
                            <div class="p4-tv-switch"></div>
                            <div class="p4-tv-speaker-grille">
                                <span></span><span></span><span></span><span></span>
                            </div>
                            <div class="p4-tv-badge">P4 REVIVAL</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 3. Persona 5 Royal: Authentic Joker Mask with Explosive Organic Blue Flames -->
            <div id="p5-mask-container" class="p5-transition-view hidden">
                <div class="p5-mask-stage" id="p5-mask-stage">
                    <div class="p5-joker-mask-wrap">
                        <!-- SVG Definições de Gradientes e Filtros de Chamas -->
                        <svg class="p5-flame-defs" width="0" height="0">
                            <defs>
                                <linearGradient id="p5BlueFlameDeep" x1="0%" y1="100%" x2="0%" y2="0%">
                                    <stop offset="0%" stop-color="#0f172a" stop-opacity="0" />
                                    <stop offset="20%" stop-color="#1e3a8a" stop-opacity="0.95" />
                                    <stop offset="55%" stop-color="#2563eb" stop-opacity="0.9" />
                                    <stop offset="85%" stop-color="#00f2fe" stop-opacity="0.95" />
                                    <stop offset="100%" stop-color="#ffffff" stop-opacity="1" />
                                </linearGradient>
                                <linearGradient id="p5BlueFlameMid" x1="0%" y1="100%" x2="0%" y2="0%">
                                    <stop offset="0%" stop-color="#1d4ed8" stop-opacity="0" />
                                    <stop offset="35%" stop-color="#3b82f6" stop-opacity="0.85" />
                                    <stop offset="70%" stop-color="#06b6d4" stop-opacity="0.95" />
                                    <stop offset="90%" stop-color="#38bdf8" stop-opacity="1" />
                                    <stop offset="100%" stop-color="#ffffff" stop-opacity="1" />
                                </linearGradient>
                                <linearGradient id="p5BlueFlameFront" x1="0%" y1="100%" x2="0%" y2="0%">
                                    <stop offset="0%" stop-color="#1e40af" stop-opacity="0" />
                                    <stop offset="30%" stop-color="#2563eb" stop-opacity="0.75" />
                                    <stop offset="65%" stop-color="#00f2fe" stop-opacity="0.9" />
                                    <stop offset="90%" stop-color="#e0f2fe" stop-opacity="0.95" />
                                    <stop offset="100%" stop-color="#ffffff" stop-opacity="1" />
                                </linearGradient>
                            </defs>
                        </svg>

                        <!-- Camada 1: Chamas Traseiras Amplas (Back Flames) que contornam a máscara e sobem bem alto -->
                        <div class="p5-flames-back-layer" id="p5-flames-back">
                            <!-- Labaredas Externas Silhuetadas (Asas e Topo) -->
                            <svg class="p5-flame-svg p5-flame-svg-back1" viewBox="0 0 1000 650" preserveAspectRatio="none">
                                <path class="flame-path-back1" d="M 50 620 C 30 520, 20 400, 60 300 C 90 220, 130 140, 170 30 C 185 130, 215 220, 240 280 C 270 190, 310 110, 350 45 C 370 140, 400 230, 430 290 C 460 170, 480 80, 500 10 C 520 80, 540 170, 570 290 C 600 230, 630 140, 650 45 C 690 110, 730 190, 760 280 C 785 220, 815 130, 830 30 C 870 140, 910 220, 940 300 C 980 400, 970 520, 950 620 Z" fill="url(#p5BlueFlameDeep)" />
                            </svg>

                            <!-- Labaredas Médias Intermediárias -->
                            <svg class="p5-flame-svg p5-flame-svg-back2" viewBox="0 0 1000 650" preserveAspectRatio="none">
                                <path class="flame-path-back2" d="M 90 600 C 70 490, 60 370, 100 270 C 130 190, 165 110, 195 60 C 215 150, 245 230, 275 300 C 300 210, 340 130, 375 75 C 395 160, 420 245, 450 310 C 475 200, 490 100, 500 35 C 510 100, 525 200, 550 310 C 580 245, 605 160, 625 75 C 660 130, 700 210, 725 300 C 755 230, 785 150, 805 60 C 835 110, 870 190, 900 270 C 940 370, 930 490, 910 600 Z" fill="url(#p5BlueFlameMid)" />
                            </svg>
                        </div>

                        <!-- Camada 2: A Máscara de Joker Autêntica Recortada -->
                        <div class="p5-mask-element-wrap">
                            <img src="${baseUrl}/assets/images/transitions/ed1cc11a-ebcc-4340-a8de-c73cfa7f2b91.png" 
                                 alt="Máscara de Joker" 
                                 class="p5-mask-img" 
                                 id="p5-mask-img"
                                 onerror="this.onerror=null; this.src='${baseUrl}/assets/images/transitions/joker-mask.png';">
                        </div>

                        <!-- Camada 3: Chamas Frontais que Cobrem a Máscara e Passam por Cima dela -->
                        <div class="p5-flames-front-layer" id="p5-flames-front">
                            <!-- Chamas Frontais que Lambem o Corpo da Máscara -->
                            <svg class="p5-flame-svg p5-flame-svg-front" viewBox="0 0 1000 650" preserveAspectRatio="none">
                                <path class="flame-path-front" d="M 140 580 C 160 460, 190 350, 230 250 C 255 180, 285 120, 310 80 C 330 160, 350 250, 380 320 C 410 230, 440 150, 470 95 C 488 60, 512 60, 530 95 C 560 150, 590 230, 620 320 C 650 250, 670 160, 690 80 C 715 120, 745 180, 770 250 C 810 350, 840 460, 860 580 Z" fill="url(#p5BlueFlameFront)" />
                            </svg>

                            <!-- Chamas Saindo dos Olhos (Eye Flames) -->
                            <div class="p5-eye-flame p5-eye-flame-left"></div>
                            <div class="p5-eye-flame p5-eye-flame-right"></div>

                            <!-- Línguas de Fogo Orgânicas Distribuídas ao Longo da Silhueta -->
                            <div class="p5-flame-tongues">
                                <span class="tongue t-wing-left"></span>
                                <span class="tongue t-eye-left"></span>
                                <span class="tongue t-crest-left"></span>
                                <span class="tongue t-crest-center"></span>
                                <span class="tongue t-crest-right"></span>
                                <span class="tongue t-eye-right"></span>
                                <span class="tongue t-wing-right"></span>
                            </div>

                            <!-- Faíscas Azuis Subindo Rapidamente -->
                            <div class="p5-blue-sparks">
                                <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
                            </div>
                        </div>

                        <!-- Brilho Radial do Metaverso -->
                        <div class="p5-flame-glow"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    static bindEvents() {
        // Intercept all game links/buttons marked with data-transition-theme
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
        // Prevent concurrent transitions
        if (this.isAnimating) return;
        this.isAnimating = true;

        const overlay = document.getElementById('persona-transition-overlay');
        if (!overlay) {
            this.completeTransition(null, targetUrl, callback);
            return;
        }

        // Respect prefers-reduced-motion: immediate navigation
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            this.completeTransition(overlay, targetUrl, callback);
            return;
        }

        const p3View = document.getElementById('p3-clock-container');
        const p4View = document.getElementById('p4-tv-container');
        const p5View = document.getElementById('p5-mask-container');

        // Reset all views
        p3View.classList.add('hidden');
        p4View.classList.add('hidden');
        p5View.classList.add('hidden');
        overlay.classList.remove('active');

        // Failsafe safety timer: ensure navigation happens after 4.5s no matter what
        const failsafe = setTimeout(() => {
            if (this.isAnimating) {
                this.completeTransition(overlay, targetUrl, callback);
            }
        }, 4500);

        overlay.classList.add('active');

        if (theme === 'persona3') {
            // =================================================================
            // 1. PERSONA 3 RELOAD: Controlled Midnight Clock
            // =================================================================
            p3View.classList.remove('hidden');
            const clockGlass = p3View.querySelector('.p3-clock-glass');
            const hourHand = p3View.querySelector('.p3-hour-hand');
            const minHand = p3View.querySelector('.p3-minute-hand');
            const timeText = p3View.querySelector('.p3-time-text');
            const midnightMsg = p3View.querySelector('.p3-midnight-msg');

            clockGlass.classList.remove('dark-hour-active');
            timeText.innerText = "11:58 PM";
            midnightMsg.innerText = "O TEMPO AVANÇA...";

            hourHand.style.transform = "rotate(350deg)";
            minHand.style.transform = "rotate(300deg)";

            setTimeout(() => {
                hourHand.style.transform = "rotate(360deg)";
                minHand.style.transform = "rotate(360deg)";
                timeText.innerText = "12:00 AM (00:00)";
            }, 600);

            setTimeout(() => {
                clockGlass.classList.add('dark-hour-active');
                midnightMsg.innerText = "DARK HOUR: TÁRTARO DESPERTO!";
            }, 1100);

            setTimeout(() => {
                clearTimeout(failsafe);
                this.completeTransition(overlay, targetUrl, callback);
            }, 2100);

        } else if (theme === 'persona4') {
            // =================================================================
            // 2. PERSONA 4 REVIVAL: Vintage Yellow CRT TV & Yellow/Black Spiral
            // Sequência:
            // 1. TV de tubo amarela aparece.
            // 2. Tela exibe espiral amarela e preta com chiado leve.
            // 3. Câmera se aproxima da tela (zoom CRT).
            // 4. Espiral cresce até preencher a área de transição.
            // 5. O efeito desaparece e revela a página.
            // =================================================================
            p4View.classList.remove('hidden');
            const tv = document.getElementById('p4-crt-tv');
            
            // Reset TV animation classes
            tv.classList.remove('tv-appear', 'tv-zooming', 'tv-fullscreen');
            
            // Step 1 & 2: TV appears and screen shows continuous spiral with subtle noise
            void tv.offsetWidth; // force reflow
            tv.classList.add('tv-appear');

            // Step 3: Camera zooms into the TV screen
            setTimeout(() => {
                tv.classList.add('tv-zooming');
            }, 850);

            // Step 4: Spiral expands to fill transition area
            setTimeout(() => {
                tv.classList.add('tv-fullscreen');
            }, 1450);

            // Step 5: Complete transition and reveal Persona 4 Revival
            setTimeout(() => {
                clearTimeout(failsafe);
                this.completeTransition(overlay, targetUrl, callback);
            }, 2100);

        } else if (theme === 'persona5') {
            // =================================================================
            // 3. PERSONA 5 ROYAL: Joker Mask Progressively Engulfed by Blue Flames
            // Sequência:
            // 1. A máscara de Joker aparece com seus detalhes claramente visíveis.
            // 2. Pequenas chamas azuis começam a surgir sobre ela.
            // 3. As chamas se espalham progressivamente até cobri-la com movimento orgânico.
            // 4. O efeito encerra a transição e revela Persona 5 Royal.
            // =================================================================
            p5View.classList.remove('hidden');
            const stage = document.getElementById('p5-mask-stage');
            const flames = document.getElementById('p5-flames-overlay');

            stage.classList.remove('mask-appear', 'flames-spark', 'flames-engulf', 'flames-flash');
            
            // Step 1: Mask appears with sharp, clear details
            void stage.offsetWidth;
            stage.classList.add('mask-appear');

            // Step 2: Small blue flames start emerging
            setTimeout(() => {
                stage.classList.add('flames-spark');
            }, 600);

            // Step 3: Flames progressively spread and engulf the entire mask
            setTimeout(() => {
                stage.classList.add('flames-engulf');
            }, 1200);

            // Step 4: Radiant flare finishes transition and reveals page
            setTimeout(() => {
                stage.classList.add('flames-flash');
            }, 1850);

            setTimeout(() => {
                clearTimeout(failsafe);
                this.completeTransition(overlay, targetUrl, callback);
            }, 2250);

        } else {
            // Standard / default fallback
            setTimeout(() => {
                clearTimeout(failsafe);
                this.completeTransition(overlay, targetUrl, callback);
            }, 500);
        }
    }

    static completeTransition(overlay, targetUrl, callback) {
        if (overlay) {
            overlay.classList.remove('active');
        }
        this.isAnimating = false;

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
