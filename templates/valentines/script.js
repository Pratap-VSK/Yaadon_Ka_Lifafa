const CONFIG = {
    GF_NAME: "My Love",
    MUSIC_FILE: "terabanjaunga.mp3",

    LOVE_LETTER: `Some stories don't begin with a hello.
They begin with a feeling you can't name,
one that lingers a little longer every single day.

You became that feeling for me.

We may not be perfect,
and that is exactly why we are perfect together.

Wherever this road takes us,
you will always be my favourite place❤️`
};

/* =============================================
   STATE
   ============================================= */

let currentPage = 0;
const totalPages = 8; // 0-7
let musicPlaying = false;
let particleSystems = {};
let treeAnimationState = 'waiting';
let cursorTrailActive = window.innerWidth > 768;
let currentMemoryIndex = 0;
const totalMemories = 4;
let isVaultUnlocked = false;
const AUTO_PLAY = false; // auto-advance pages for reel/recording

/* =============================================
   INIT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    buildPageIndicator();
    buildLetterContent();
    buildWordReveal();
    initCursorTrail();
    initParticles('lockCanvas', 'hearts');
    startLoadingScreen();
});

/* =============================================
   PASSWORD VAULT VERIFICATION
   ============================================= */

function checkPasscode(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('passcodeInput');
    const val = (input.value || '').trim().replace(/[\s\-_]/g, '');
    const validCodes = ['forever', 'iloveyou'];

    const errorEl = document.getElementById('passwordError');

    if (validCodes.includes(val)) {
        isVaultUnlocked = true;
        const overlay = document.getElementById('passwordOverlay');
        overlay.classList.add('unlocked');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 850);

        const toggle = document.getElementById('musicToggle');
        if (toggle) toggle.classList.add('visible');

        // Auto start romantic music on unlock
        playMusic();
    } else {
        errorEl.classList.remove('hidden');
        input.classList.add('error-shake');
        input.value = '';
        setTimeout(() => {
            input.classList.remove('error-shake');
        }, 500);
    }
}

function togglePassVisibility() {
    const input = document.getElementById('passcodeInput');
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

function playMusic() {
    const music = document.getElementById('bgMusic');
    const toggle = document.getElementById('musicToggle');
    if (!music) return;

    music.volume = 0.85;
    const playPromise = music.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            musicPlaying = true;
            if (toggle) toggle.textContent = '❚❚';
        }).catch(() => {
            // Browser policy fallback
            musicPlaying = false;
            if (toggle) toggle.textContent = '♫';
        });
    }
}

/* =============================================
   LOADING SCREEN
   ============================================= */

function startLoadingScreen() {
    initParticles('loadingCanvas', 'stars');
    const fill = document.getElementById('heartProgressFill');
    const icon = document.getElementById('heartProgressIcon');
    const subtext = document.getElementById('loadingSubtext');
    const messages = [
        "Gathering all my love",
        "Adding heartbeats and sparkles",
        "Sprinkling some sunshine magic",
        "Almost ready, my love..."
    ];

    let progress = 0;
    let msgIndex = 0;
    const interval = setInterval(() => {
        progress += 0.9 + Math.random() * 1.3;
        if (progress > 100) progress = 100;
        fill.style.width = progress + '%';
        icon.style.left = progress + '%';

        const newMsgIndex = Math.min(Math.floor(progress / 25), messages.length - 1);
        if (newMsgIndex !== msgIndex) {
            msgIndex = newMsgIndex;
            subtext.style.opacity = '0';
            setTimeout(() => {
                subtext.textContent = messages[msgIndex];
                subtext.style.opacity = '1';
            }, 300);
        }

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => goToPage(1), 700);
        }
    }, 45);
}

/* =============================================
   CURSOR TRAIL
   ============================================= */

function initCursorTrail() {
    if (!cursorTrailActive) return;
    const trail = document.getElementById('cursorTrail');
    let mouseX = 0, mouseY = 0;
    let heartTimer = 0;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    trail.appendChild(dot);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';

        heartTimer++;
        if (heartTimer % 7 === 0) {
            const heart = document.createElement('div');
            heart.className = 'cursor-heart';
            heart.textContent = Math.random() > 0.4 ? '❤️' : '✨';
            heart.style.left = (mouseX + (Math.random() - 0.5) * 12) + 'px';
            heart.style.top = mouseY + 'px';
            trail.appendChild(heart);
            setTimeout(() => heart.remove(), 1100);
        }
    });
}

/* =============================================
   WORD-BY-WORD REVEAL
   ============================================= */

function buildWordReveal() {
    document.querySelectorAll('.word-reveal').forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        text.split(' ').forEach((word, i) => {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = word;
            span.style.transitionDelay = (2.2 + i * 0.08) + 's';
            el.appendChild(span);
        });
    });
}

function revealWords(pageNum) {
    const page = document.getElementById('page' + pageNum);
    if (!page) return;
    page.querySelectorAll('.word-reveal .word').forEach(w => {
        w.classList.add('visible');
    });
}

/* =============================================
   PAGE NAVIGATION
   ============================================= */

function goToPage(num) {
    if (num < 0 || num >= totalPages || num === currentPage) return;

    const oldPage = document.getElementById('page' + currentPage);
    const newPage = document.getElementById('page' + num);

    oldPage.classList.add('exiting');
    oldPage.classList.remove('active');

    setTimeout(() => {
        oldPage.classList.remove('exiting');
        newPage.classList.add('active');
        currentPage = num;
        updatePageIndicator();
        onPageEnter(num);
    }, 550);
}

function onPageEnter(num) {
    animatePageContent(num);
    revealWords(num);

    // Auto-trigger music on reaching Page 1 if already unlocked
    if (num >= 1 && isVaultUnlocked && !musicPlaying) {
        playMusic();
    }

    const canvasMap = {
        0: ['loadingCanvas', null],
        1: ['starsCanvas1', null],
        2: ['heartsCanvas2', 'hearts'],
        3: ['treeCanvas', null],
        4: ['starsCanvas4', null],
        5: ['starsCanvas5', null],
        6: ['heartsCanvas6', 'hearts'],
        7: ['finalCanvas', null]
    };

    Object.keys(particleSystems).forEach(k => {
        if (particleSystems[k]) particleSystems[k].active = false;
    });

    const entry = canvasMap[num];
    if (entry && entry[1]) initParticles(entry[0], entry[1]);

    setTimeout(() => {
        const page = document.getElementById('page' + num);
        if (page) {
            page.querySelectorAll('.glass-card').forEach((card, i) => {
                setTimeout(() => card.classList.add('shimmer-active'), i * 150);
            });
        }
    }, 350);

    if (num === 2) {
        setTimeout(() => {
            revealLetterLines('letterContent');
        }, 400);
    }

    if (num === 4) {
        setTimeout(() => {
            const line = document.getElementById('timelineLine');
            if (line) line.classList.add('drawn');
        }, 300);
    }

    if (num === 3 && treeAnimationState === 'waiting') {
        setTimeout(() => startHeartToTreeAnimation(), 600);
    }

    scheduleAutoNext(num);
}

function scheduleAutoNext(num) {
    if (!AUTO_PLAY) return;
    const active = () => {
        const el = document.getElementById('page' + num);
        return el && el.classList.contains('active');
    };

    if (num === 1) {
        setTimeout(() => { if (active()) { const b = document.getElementById('openSurpriseBtn'); if (b) b.click(); } }, 4300);
    } else if (num === 2) {
        setTimeout(() => { if (active()) { const b = document.querySelector('#page2 .btn-glow'); if (b) b.click(); } }, 2500);
    } else if (num === 4) {
        setTimeout(() => { if (active()) { const b = document.querySelector('#page4 .btn-glow'); if (b) b.click(); } }, 2700);
    } else if (num === 5) {
        setTimeout(() => { if (active()) { const b = document.querySelector('#page5 .btn-glow'); if (b) b.click(); } }, 3000);
    } else if (num === 6) {
        setTimeout(() => { if (active()) { const b = document.getElementById('calcLoveBtn'); if (b) b.click(); } }, 1800);
        setTimeout(() => { if (active()) { const b = document.getElementById('loveMeterNext'); if (b && !b.classList.contains('hidden')) b.click(); } }, 5200);
    } else if (num === 7) {
        setTimeout(() => { if (active()) { const b = document.getElementById('finalSurpriseBtn'); if (b) b.click(); } }, 2600);
    }
}

function animatePageContent(num) {
    const page = document.getElementById('page' + num);
    if (!page) return;
    const items = page.querySelectorAll('[data-anim]');
    items.forEach((el, i) => {
        setTimeout(() => el.classList.add('anim-visible'), 250 + i * 180);
    });
}

function revealLetterLines(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const lines = container.querySelectorAll('.letter-line');
    lines.forEach((l, i) => {
        setTimeout(() => l.classList.add('visible'), i * 90);
    });
}

/* =============================================
   PAGE INDICATOR
   ============================================= */

function buildPageIndicator() {
    const container = document.getElementById('pageIndicator');
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('div');
        dot.className = 'page-dot' + (i === 0 ? ' active' : '');
        dot.dataset.page = i;
        dot.addEventListener('click', () => {
            if (i <= currentPage + 1 || i === 0) goToPage(i);
        });
        container.appendChild(dot);
    }
}

function updatePageIndicator() {
    document.querySelectorAll('.page-dot').forEach(dot => {
        dot.classList.toggle('active', parseInt(dot.dataset.page) === currentPage);
    });
}

/* =============================================
   3D TILT WITH LIGHT GLARE
   ============================================= */

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;
    document.querySelectorAll('.page.active .tilt-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const maxDeg = 14;
        const rotateX = ((y - centerY) / centerY) * -maxDeg;
        const rotateY = ((x - centerX) / centerX) * maxDeg;

        card.style.transform = `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(12px)`;

        const glare = card.querySelector('.photo-glare');
        if (glare) {
            glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)`;
        }
    });
});

document.addEventListener('mouseleave', () => {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
});

/* =============================================
   PAGE 4: 3D MEMORY CAROUSEL LOGIC
   ============================================= */

function updateMemorySlide(newIndex) {
    const slides = document.querySelectorAll('.memory-slide');
    const thumbs = document.querySelectorAll('.thumb-item');

    if (newIndex < 0) newIndex = totalMemories - 1;
    if (newIndex >= totalMemories) newIndex = 0;

    currentMemoryIndex = newIndex;

    slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === currentMemoryIndex);
    });

    thumbs.forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === currentMemoryIndex);
    });

    // Sparkle effect on change
    const activeSlide = slides[currentMemoryIndex];
    if (activeSlide) {
        const card = activeSlide.querySelector('.glass-card');
        if (card) {
            card.classList.remove('shimmer-active');
            void card.offsetWidth;
            card.classList.add('shimmer-active');
        }
    }
}

function nextMemory() {
    updateMemorySlide(currentMemoryIndex + 1);
}

function prevMemory() {
    updateMemorySlide(currentMemoryIndex - 1);
}

function jumpToMemory(idx) {
    updateMemorySlide(idx);
}

/* =============================================
   OPENING / SURPRISE
   ============================================= */

function openSurprise(btn) {
    burstHeartsFromButton(btn);

    if (!musicPlaying) {
        playMusic();
    }
    const toggle = document.getElementById('musicToggle');
    if (toggle) toggle.classList.add('visible');

    setTimeout(() => goToPage(2), 650);
}

function burstHeartsFromButton(btn) {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < 40; i++) {
        const heart = document.createElement('div');
        heart.textContent = Math.random() > 0.4 ? '❤️' : (Math.random() > 0.5 ? '☀️' : '✨');
        heart.style.cssText = `
            position:fixed; left:${cx}px; top:${cy}px;
            font-size:${10 + Math.random() * 18}px;
            pointer-events:none; z-index:9999;
            transition: all ${0.9 + Math.random() * 1.3}s cubic-bezier(0.2, 0.8, 0.2, 1);
            opacity:1;
        `;
        document.body.appendChild(heart);
        requestAnimationFrame(() => {
            heart.style.left = (cx + (Math.random() - 0.5) * 450) + 'px';
            heart.style.top = (cy - 90 - Math.random() * 380) + 'px';
            heart.style.opacity = '0';
            heart.style.transform = `scale(${0.3 + Math.random() * 0.9}) rotate(${(Math.random()-0.5)*120}deg)`;
        });
        setTimeout(() => heart.remove(), 2500);
    }
}

/* =============================================
   MUSIC TOGGLE
   ============================================= */

document.getElementById('musicToggle').addEventListener('click', () => {
    const music = document.getElementById('bgMusic');
    const toggle = document.getElementById('musicToggle');
    if (musicPlaying) {
        music.pause();
        toggle.textContent = '♫';
        musicPlaying = false;
    } else {
        music.play();
        toggle.textContent = '❚❚';
        musicPlaying = true;
    }
});

/* =============================================
   LETTER BUILDER
   ============================================= */

function buildLetterContent() {
    const container = document.getElementById('letterContent');
    CONFIG.LOVE_LETTER.split('\n').forEach((line, i) => {
        const p = document.createElement('p');
        p.className = 'letter-line';
        p.textContent = line || ' ';
        p.style.transitionDelay = (i * 0.1) + 's';
        container.appendChild(p);
    });
}

/* =============================================
   PARTICLES (Stars & Floating Hearts)
   ============================================= */

function initParticles(canvasId, type) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (particleSystems[canvasId]) particleSystems[canvasId].active = false;

    const system = { active: true, particles: [] };
    particleSystems[canvasId] = system;

    const count = window.innerWidth < 768 ? 40 : 80;
    for (let i = 0; i < count; i++) {
        system.particles.push(createParticle(canvas, type));
    }

    function animate() {
        if (!system.active) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        system.particles.forEach(p => {
            updateParticle(p, canvas, type);
            drawParticle(ctx, p, type);
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function createParticle(canvas, type) {
    const depth = Math.random();
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: type === 'hearts' ? (5 + Math.random() * 9) : (0.6 + depth * 2.2),
        speedX: (Math.random() - 0.5) * (0.15 + depth * 0.35),
        speedY: type === 'hearts' ? -(0.25 + Math.random() * 0.55) : (Math.random() - 0.5) * (0.05 + depth * 0.15),
        opacity: type === 'hearts' ? (0.35 + Math.random() * 0.5) : (0.2 + depth * 0.6),
        pulse: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        depth: depth
    };
}

function updateParticle(p, canvas, type) {
    p.x += p.speedX;
    p.y += p.speedY;
    p.pulse += 0.02;
    p.rotation += 0.004;

    if (type === 'hearts') {
        if (p.y < -20) { p.y = canvas.height + 20; p.x = Math.random() * canvas.width; }
    } else {
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;
        if (p.y < -5) p.y = canvas.height + 5;
        if (p.y > canvas.height + 5) p.y = -5;
    }
}

function drawParticle(ctx, p, type) {
    const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

    if (type === 'hearts') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `hsl(${340 + Math.random() * 25}, 85%, 68%)`;
        drawHeart(ctx, 0, 0, p.size);
        ctx.restore();
    } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
        if (p.size > 1.4) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.12})`;
            ctx.fill();
        }
    }
}

function drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    const s = size / 2;
    ctx.moveTo(x, y + s * 0.3);
    ctx.bezierCurveTo(x, y - s * 0.5, x - s, y - s * 0.5, x - s, y + s * 0.1);
    ctx.bezierCurveTo(x - s, y + s * 0.6, x, y + s, x, y + s * 1.2);
    ctx.bezierCurveTo(x, y + s, x + s, y + s * 0.6, x + s, y + s * 0.1);
    ctx.bezierCurveTo(x + s, y - s * 0.5, x, y - s * 0.5, x, y + s * 0.3);
    ctx.fill();
}

/* =============================================
   HEART TO TREE ANIMATION (Page 3)
   ============================================= */

function startHeartToTreeAnimation() {
    treeAnimationState = 'running';
    const canvas = document.getElementById('treeCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const isMobile = canvas.width < 768;
    const HEART_SIZE = isMobile ? 58 : 86;

    let phase = 'heart';
    let heartBeat = 0;
    let crackProgress = 0;
    let phaseTimer = 0;
    let flyingHearts = [];
    let fireflies = [];
    let treeGrowth = 0;
    let interactiveReady = false;

    const baseX = cx;
    const baseY = cy + (isMobile ? 110 : 150);
    const treeH = isMobile ? 250 : 355;

    const treeBranches = [
        { x1: 0, y1: 0, x2: 0, y2: -0.4, w: isMobile ? 7 : 10 },
        { x1: 0, y1: -0.25, x2: -0.25, y2: -0.55, w: isMobile ? 5 : 7 },
        { x1: 0, y1: -0.25, x2: 0.28, y2: -0.5, w: isMobile ? 5 : 7 },
        { x1: 0, y1: -0.4, x2: -0.15, y2: -0.7, w: isMobile ? 3 : 5 },
        { x1: 0, y1: -0.4, x2: 0.18, y2: -0.68, w: isMobile ? 3 : 5 },
        { x1: -0.25, y1: -0.55, x2: -0.38, y2: -0.72, w: 3 },
        { x1: 0.28, y1: -0.5, x2: 0.4, y2: -0.7, w: 3 },
        { x1: -0.25, y1: -0.55, x2: -0.18, y2: -0.72, w: 3 },
        { x1: 0.28, y1: -0.5, x2: 0.2, y2: -0.68, w: 3 },
    ];

    const leafPositions = [
        [-0.38,-0.72],[-0.3,-0.78],[-0.2,-0.83],[-0.1,-0.79],
        [0,-0.86],[0.1,-0.81],[0.2,-0.83],[0.3,-0.77],[0.4,-0.7],
        [-0.35,-0.65],[-0.15,-0.76],[0.15,-0.74],[0.35,-0.64],
        [-0.25,-0.6],[0.05,-0.73],[0.25,-0.62],
        [-0.42,-0.58],[0.42,-0.55],[-0.1,-0.69],[0.12,-0.67],
        [-0.32,-0.48],[0.3,-0.46],[0,-0.66],[-0.2,-0.53],[0.2,-0.51],
        [-0.18,-0.72],[0.08,-0.80],[-0.05,-0.75],[0.32,-0.60],[-0.28,-0.68],
        [-0.40,-0.62],[0.40,-0.62],[-0.22,-0.70],[0.24,-0.70],[-0.10,-0.85],[0.12,-0.84],
        [-0.34,-0.54],[0.34,-0.52],[-0.16,-0.66],[0.18,-0.64],[0,-0.76],[-0.06,-0.82]
    ].map(([lx, ly]) => ({
        x: baseX + lx * treeH,
        y: baseY + ly * treeH,
        size: (isMobile ? 6 : 9) + Math.random() * (isMobile ? 4 : 7),
        hue: 340 + Math.random() * 25,
        pulse: Math.random() * Math.PI * 2,
        sway: Math.random() * Math.PI * 2,
        fallVy: 0,
        falling: false,
        life: 999
    }));

    for (let i = 0; i < (isMobile ? 14 : 26); i++) {
        fireflies.push({
            x: baseX + (Math.random() - 0.5) * treeH * 0.95,
            y: baseY - Math.random() * treeH * 0.85,
            size: 1.6 + Math.random() * 2.2,
            angle: Math.random() * Math.PI * 2,
            speed: 0.003 + Math.random() * 0.006,
            radius: 18 + Math.random() * 28,
            baseX: 0, baseY: 0,
            pulse: Math.random() * Math.PI * 2
        });
        fireflies[i].baseX = fireflies[i].x;
        fireflies[i].baseY = fireflies[i].y;
    }

    function animate() {
        if (treeAnimationState === 'stopped') return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        phaseTimer++;

        if (phase === 'heart') {
            heartBeat += 0.045;
            const beat = 1 + 0.12 * Math.sin(heartBeat * 2);
            ctx.save();
            ctx.translate(cx, cy);
            ctx.scale(beat, beat);
            ctx.fillStyle = '#ff3377';
            ctx.shadowColor = '#ff3377';
            ctx.shadowBlur = 45;
            drawHeart(ctx, 0, 0, HEART_SIZE);
            ctx.shadowBlur = 0;
            ctx.restore();

            if (phaseTimer > 105) { phase = 'crack'; phaseTimer = 0; }
        }

        if (phase === 'crack') {
            heartBeat += 0.045;
            const beat = 1 + 0.06 * Math.sin(heartBeat * 2);
            ctx.save();
            ctx.translate(cx, cy);
            ctx.scale(beat, beat);
            ctx.fillStyle = '#ff3377';
            ctx.shadowColor = '#ff3377';
            ctx.shadowBlur = 40;
            drawHeart(ctx, 0, 0, HEART_SIZE);
            ctx.shadowBlur = 0;

            crackProgress += 0.014;
            if (crackProgress <= 1) {
                ctx.strokeStyle = '#ffd700';
                ctx.lineWidth = 2.5;
                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur = 18;
                ctx.beginPath();
                const cp = crackProgress;
                ctx.moveTo(0, -HEART_SIZE * 0.3);
                if (cp > 0) ctx.lineTo(-4, -HEART_SIZE * 0.1 * Math.min(cp * 3, 1));
                if (cp > 0.3) ctx.lineTo(5, HEART_SIZE * 0.15 * Math.min((cp - 0.3) * 3, 1));
                if (cp > 0.6) ctx.lineTo(-2, HEART_SIZE * 0.4 * Math.min((cp - 0.6) * 2.5, 1));
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
            ctx.restore();

            if (crackProgress >= 1.25) {
                phase = 'explode';
                phaseTimer = 0;
                const count = isMobile ? 42 : 62;
                for (let i = 0; i < count; i++) {
                    const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
                    const speed = 2.2 + Math.random() * 4;
                    flyingHearts.push({
                        x: cx, y: cy,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed - 1.5,
                        size: 5 + Math.random() * 13,
                        opacity: 1,
                        hue: 340 + Math.random() * 25,
                        trail: [],
                        rotation: Math.random() * Math.PI * 2,
                        rotSpeed: (Math.random() - 0.5) * 0.08
                    });
                }
                document.getElementById('treeText1').style.opacity = '0';
            }
        }

        if (phase === 'explode') {
            flyingHearts.forEach(h => {
                h.trail.push({ x: h.x, y: h.y, o: h.opacity * 0.4, s: h.size * 0.3 });
                if (h.trail.length > 10) h.trail.shift();

                if (phaseTimer < 50) {
                    h.x += h.vx;
                    h.y += h.vy;
                    h.vy -= 0.015;
                    h.rotation += h.rotSpeed;
                } else {
                    const idx = Math.floor(Math.random() * leafPositions.length);
                    const target = leafPositions[idx];
                    h.x += (target.x - h.x) * 0.03;
                    h.y += (target.y - h.y) * 0.03;
                    const dist = Math.hypot(target.x - h.x, target.y - h.y);
                    if (dist < 30) h.opacity *= 0.975;
                }

                ctx.save();
                ctx.translate(h.x, h.y);
                ctx.rotate(h.rotation);
                ctx.globalAlpha = h.opacity;
                ctx.fillStyle = `hsl(${h.hue}, 85%, 65%)`;
                ctx.shadowColor = `hsl(${h.hue}, 85%, 65%)`;
                ctx.shadowBlur = 14;
                drawHeart(ctx, 0, 0, h.size);
                ctx.shadowBlur = 0;
                ctx.restore();
            });

            if (phaseTimer > 110) {
                treeGrowth = Math.min(treeGrowth + 0.007, 1);
                drawTreeOrganic(ctx, treeGrowth);
            }

            if (phaseTimer > 320) {
                phase = 'tree';
                document.getElementById('treeText2').classList.remove('hidden');
                document.getElementById('treeText2').style.opacity = '1';
                document.getElementById('treeNextBtn').classList.remove('hidden');
                if (AUTO_PLAY) {
                    setTimeout(() => {
                        const b = document.getElementById('treeNextBtn');
                        const p3 = document.getElementById('page3');
                        if (b && p3 && p3.classList.contains('active')) b.click();
                    }, 900);
                }
                interactiveReady = true;
                treeAnimationState = 'complete';
            }
        }

        if (phase === 'tree') {
            treeGrowth = Math.min(treeGrowth + 0.005, 1);
            drawTreeOrganic(ctx, treeGrowth);

            fireflies.forEach(f => {
                f.angle += f.speed;
                f.pulse += 0.035;
                f.x = f.baseX + Math.cos(f.angle) * f.radius;
                f.y = f.baseY + Math.sin(f.angle * 0.7) * f.radius * 0.65;
                const glow = 0.35 + 0.65 * Math.abs(Math.sin(f.pulse));
                ctx.beginPath();
                ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 215, 0, ${glow})`;
                ctx.shadowColor = 'rgba(255, 215, 0, 0.7)';
                ctx.shadowBlur = 16;
                ctx.fill();
                ctx.shadowBlur = 0;
            });
        }

        requestAnimationFrame(animate);
    }

    function drawTreeOrganic(ctx, growth) {
        ctx.globalAlpha = Math.min(growth * 2, 1);

        const branchCount = Math.ceil(growth * treeBranches.length);
        for (let i = 0; i < branchCount; i++) {
            const b = treeBranches[i];
            const branchGrowth = i < branchCount - 1 ? 1 : (growth * treeBranches.length) % 1;

            const x1 = baseX + b.x1 * treeH;
            const y1 = baseY + b.y1 * treeH;
            const x2 = x1 + (baseX + b.x2 * treeH - x1) * branchGrowth;
            const y2 = y1 + (baseY + b.y2 * treeH - y1) * branchGrowth;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(160, 95, 45, ${Math.min(growth * 2, 0.95)})`;
            ctx.lineWidth = b.w;
            ctx.lineCap = 'round';
            ctx.shadowColor = 'rgba(255, 215, 0, 0.15)';
            ctx.shadowBlur = 8;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        if (growth > 0.45) {
            const leafAlpha = (growth - 0.45) * 1.8;
            const time = Date.now() / 1000;
            const visibleLeaves = Math.ceil(leafAlpha * leafPositions.length);

            for (let i = 0; i < visibleLeaves && i < leafPositions.length; i++) {
                const l = leafPositions[i];
                l.pulse += 0.018;
                const sway = Math.sin(time + l.sway) * 2.8;
                const scaleIn = Math.min((leafAlpha * leafPositions.length - i) * 2, 1);

                ctx.save();
                ctx.translate(l.x + sway, l.y);
                ctx.scale(scaleIn, scaleIn);
                ctx.globalAlpha = Math.min(leafAlpha, 1) * (0.7 + 0.3 * Math.sin(l.pulse));
                ctx.fillStyle = `hsl(${l.hue}, 80%, 62%)`;
                ctx.shadowColor = `hsl(${l.hue}, 85%, 65%)`;
                ctx.shadowBlur = 15;
                drawHeart(ctx, 0, 0, l.size);
                ctx.shadowBlur = 0;
                ctx.restore();
            }
        }

        ctx.globalAlpha = 1;
    }

    canvas.style.pointerEvents = 'auto';
    canvas.addEventListener('click', (e) => {
        if (!interactiveReady) return;

        for (let i = 0; i < 12; i++) {
            const spark = document.createElement('div');
            spark.textContent = i % 3 === 0 ? '☀️' : (i % 2 === 0 ? '❤️' : '✨');
            spark.style.cssText = `
                position:fixed; left:${e.clientX}px; top:${e.clientY}px;
                font-size:${8 + Math.random() * 14}px;
                pointer-events:none; z-index:9999;
                transition: all ${0.7 + Math.random() * 0.7}s ease-out;
                opacity:1;
            `;
            document.body.appendChild(spark);
            requestAnimationFrame(() => {
                spark.style.left = (e.clientX + (Math.random() - 0.5) * 150) + 'px';
                spark.style.top = (e.clientY - 50 - Math.random() * 130) + 'px';
                spark.style.opacity = '0';
            });
            setTimeout(() => spark.remove(), 1600);
        }

        const t3 = document.getElementById('treeText3');
        t3.classList.remove('hidden');
        t3.style.opacity = '1';
        setTimeout(() => { t3.style.opacity = '0'; }, 3500);
    });

    animate();
}

/* =============================================
   LOVE METER (Smooth Infinity Counter)
   ============================================= */

function calculateLove() {
    const fill = document.getElementById('loveMeterFill');
    const text = document.getElementById('loveMeterText');
    const btn = document.getElementById('calcLoveBtn');
    const result = document.getElementById('loveMeterResult');
    const nextBtn = document.getElementById('loveMeterNext');

    btn.style.display = 'none';
    let progress = 0;
    let displayed = 0;

    const interval = setInterval(() => {
        progress += 0.6 + Math.random() * 0.9;
        if (progress > 100) progress = 100;

        displayed += (progress - displayed) * 0.16;
        fill.style.width = progress + '%';
        text.textContent = Math.round(displayed) + '%';

        if (progress >= 100) {
            clearInterval(interval);
            text.textContent = '100%';

            setTimeout(() => {
                text.textContent = '∞%';
                setTimeout(() => {
                    result.classList.remove('hidden');
                    result.style.animation = 'fadeInUp 0.8s ease forwards';
                    nextBtn.classList.remove('hidden');
                }, 600);
            }, 500);
        }
    }, 35);
}

/* =============================================
   FINAL SURPRISE (Fireworks + Constellation)
   ============================================= */

function finalSurprise() {
    const btn = document.getElementById('finalSurpriseBtn');
    const msg = document.getElementById('finalMessage');
    btn.classList.add('hidden');

    // Cupid's arrow → shattered heart → spells a word
    startCupidSurprise();

    setTimeout(() => {
        msg.classList.remove('hidden');
        msg.style.animation = 'fadeInUp 1.2s ease forwards';
    }, 2500);

    // After "I LOVE YOU" is fully written (+ ~3s), burst fireworks right here on the final page
    setTimeout(() => {
        const p7 = document.getElementById('page7');
        if (p7 && p7.classList.contains('active')) {
            startFireworks();
        }
    }, 6200);
}

/* =============================================
   FINAL SURPRISE — Cupid's Arrow → Shattered Heart → Word
   ============================================= */

function startCupidSurprise() {
    const canvas = document.getElementById('fireworksCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.zIndex = '55';

    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2 - 26;
    const isMobile = W < 768;
    const HEART_R = Math.min(W, H) * (isMobile ? 0.20 : 0.17);

    // --- heart silhouette (parametric) ---
    const OUTLINE = 72;
    const outline = [];
    for (let i = 0; i < OUTLINE; i++) {
        const t = (i / OUTLINE) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        outline.push({ x: cx + hx * (HEART_R / 17), y: cy - hy * (HEART_R / 17) });
    }

    // --- word target points ---
    const line1 = "I LOVE";
    const line2 = "YOU";
    const fontPx = isMobile ? 92 : 150;
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const octx = off.getContext('2d');
    octx.font = `bold ${fontPx}px 'Playfair Display', serif`;
    octx.textAlign = 'center'; octx.textBaseline = 'middle';
    octx.fillStyle = '#fff';
    octx.fillText(line1, W / 2, cy - fontPx * 0.62);
    octx.fillText(line2, W / 2, cy + fontPx * 0.62);
    const imgData = octx.getImageData(0, 0, W, H).data;
    const step = Math.max(3, Math.floor(fontPx / 18));
    const targets = [];
    for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
            const i = (y * W + x) * 4;
            if (imgData[i + 3] > 128) targets.push({ x, y });
        }
    }
    while (targets.length > 720) targets.splice(Math.floor(Math.random() * targets.length), 1);

    // --- shards start on the heart outline, burst out, then settle on the word ---
    const shards = [];
    for (let i = 0; i < targets.length; i++) {
        const p = outline[i % outline.length];
        const ang = Math.atan2(p.y - cy, p.x - cx);
        const sp = (isMobile ? 5 : 6) + Math.random() * 4;
        shards.push({
            x: p.x + (Math.random() - 0.5) * 8,
            y: p.y + (Math.random() - 0.5) * 8,
            vx: Math.cos(ang) * sp * (0.6 + Math.random()),
            vy: Math.sin(ang) * sp * (0.6 + Math.random()) - 1.5,
            tx: targets[i].x,
            ty: targets[i].y,
            size: (1.4 + Math.random() * 2.4),
            phase: 'burst',
            pulse: Math.random() * Math.PI * 2
        });
    }

    const arrow = { x: -70, y: cy, target: cx + HEART_R * 0.05, done: false };
    let t = 0;
    const BURST = 44;

    function drawHeartGlow(x, y, s, beat) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(beat, beat);
        const grad = ctx.createLinearGradient(0, -s * 1.3, 0, s * 1.3);
        grad.addColorStop(0, '#ffc9de');
        grad.addColorStop(0.45, '#ff80ad');
        grad.addColorStop(1, '#ff4d8b');
        ctx.shadowColor = '#ff7fb0';
        ctx.shadowBlur = 70;
        ctx.fillStyle = grad;
        drawHeart(ctx, 0, 0, s * 2.2);
        ctx.shadowBlur = 0;
        // glossy inner highlight for a charming shine
        ctx.globalAlpha = 0.45;
        ctx.fillStyle = '#ffe1ee';
        drawHeart(ctx, -s * 0.5, -s * 0.75, s * 0.45);
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    function drawArrow(x, y, scale) {
        ctx.save();
        ctx.translate(x, y);
        // shaft
        ctx.strokeStyle = 'rgba(255,225,236,0.95)';
        ctx.lineWidth = 2.6;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#ffb3c6';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(-scale * 1.6, 0);
        ctx.lineTo(scale * 1.3, 0);
        ctx.stroke();
        ctx.shadowBlur = 0;
        // arrowhead
        ctx.fillStyle = '#ffe3ec';
        ctx.beginPath();
        ctx.moveTo(scale * 1.7, 0);
        ctx.lineTo(scale * 0.9, -scale * 0.42);
        ctx.lineTo(scale * 1.05, 0);
        ctx.lineTo(scale * 0.9, scale * 0.42);
        ctx.closePath();
        ctx.fill();
        // feathers
        ctx.fillStyle = 'rgba(255,120,150,0.9)';
        ctx.beginPath();
        ctx.moveTo(-scale * 1.6, 0);
        ctx.lineTo(-scale * 2.3, -scale * 0.55);
        ctx.lineTo(-scale * 1.55, -scale * 0.25);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-scale * 1.6, 0);
        ctx.lineTo(-scale * 2.3, scale * 0.55);
        ctx.lineTo(-scale * 1.55, scale * 0.25);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function sparkBurst(x, y) {
        for (let i = 0; i < 18; i++) {
            const h = document.createElement('div');
            h.textContent = i % 3 === 0 ? '💘' : (i % 2 ? '❤️' : '✨');
            h.style.cssText = `position:fixed;left:${x}px;top:${y}px;font-size:${12 + Math.random() * 14}px;pointer-events:none;z-index:9999;transition:all ${0.8 + Math.random() * 0.7}s ease-out;opacity:1;`;
            document.body.appendChild(h);
            requestAnimationFrame(() => {
                h.style.left = (x + (Math.random() - 0.5) * 220) + 'px';
                h.style.top = (y - 60 - Math.random() * 150) + 'px';
                h.style.opacity = '0';
            });
            setTimeout(() => h.remove(), 1600);
        }
    }

    function animate() {
        t++;

        if (!arrow.done) {
            // draw the heart + incoming arrow
            ctx.clearRect(0, 0, W, H);
            const beat = 1 + 0.07 * Math.sin(t * 0.07);
            drawHeartGlow(cx, cy, HEART_R, beat);

            if (t > 26) {
                arrow.x += (arrow.target - arrow.x) * 0.09;
                drawArrow(arrow.x, arrow.y + Math.sin(t * 0.2) * 3, (isMobile ? 26 : 34));
                if (arrow.x >= arrow.target - 4) {
                    arrow.done = true;
                    sparkBurst(arrow.target, cy);
                }
            }
        } else {
            ctx.fillStyle = 'rgba(5,2,10,0.10)';
            ctx.fillRect(0, 0, W, H);

            // burst outward, then converge to spell the word
            shards.forEach(s => {
                s.pulse += 0.05;
                if (s.phase === 'burst' && t > 26 + BURST) s.phase = 'settle';
                if (s.phase === 'burst') {
                    s.x += s.vx;
                    s.y += s.vy;
                    s.vy += 0.12;
                } else {
                    s.x += (s.tx - s.x) * 0.045;
                    s.y += (s.ty - s.y) * 0.045;
                }
                const settle = s.phase === 'settle';
                const alpha = settle ? (0.92 + 0.08 * Math.sin(s.pulse)) : Math.max(0.2, 1 - (t - 26) / BURST);
                const r = settle ? s.size * 1.3 : s.size;
                ctx.beginPath();
                ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, ${settle ? '203' : '89'}, ${settle ? '226' : '150'}, ${alpha})`;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(s.x, s.y, r * 2.4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, ${settle ? '222' : '120'}, 238, ${alpha * 0.22})`;
                ctx.fill();
            });
        }

        if (t < 300) requestAnimationFrame(animate);
    }

    animate();
}

/* =============================================
   FIREWORKS (Canvas)
   ============================================= */

function startFireworks(canvasId = 'fireworksCanvas') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.zIndex = '60';

    let fireworks = [];
    let particles = [];
    let spawnTimer = 0;
    let totalTime = 0;

    function spawnFirework() {
        const x = canvas.width * (0.2 + Math.random() * 0.6);
        const targetY = canvas.height * (0.15 + Math.random() * 0.35);
        fireworks.push({
            x: x,
            y: canvas.height,
            targetY: targetY,
            vy: -(9 + Math.random() * 4),
            hue: 330 + Math.random() * 50,
            exploded: false,
            trail: []
        });
    }

    function explode(fw) {
        const count = 45 + Math.floor(Math.random() * 35);
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const speed = 2.5 + Math.random() * 4.5;
            particles.push({
                x: fw.x, y: fw.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                hue: fw.hue + (Math.random() - 0.5) * 25,
                life: 1,
                decay: 0.012 + Math.random() * 0.01,
                size: 1.8 + Math.random() * 2.2
            });
        }
    }

    function animate() {
        totalTime++;
        if (totalTime > 320) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,0.16)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';

        spawnTimer++;
        if (spawnTimer > 18 + Math.random() * 25 && totalTime < 220) {
            spawnFirework();
            spawnTimer = 0;
        }

        fireworks.forEach((fw) => {
            if (!fw.exploded) {
                fw.y += fw.vy;
                fw.vy += 0.05;
                fw.trail.push({ x: fw.x, y: fw.y });
                if (fw.trail.length > 8) fw.trail.shift();

                fw.trail.forEach((t, ti) => {
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, 1.6, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${fw.hue}, 85%, 70%, ${ti / fw.trail.length * 0.6})`;
                    ctx.fill();
                });

                if (fw.y <= fw.targetY) {
                    fw.exploded = true;
                    explode(fw);
                }
            }
        });

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.04;
            p.vx *= 0.98;
            p.life -= p.decay;

            if (p.life > 0) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 85%, 65%, ${p.life})`;
                ctx.fill();
            }
        });

        particles = particles.filter(p => p.life > 0);
        requestAnimationFrame(animate);
    }

    animate();
}

/* =============================================
   CONSTELLATION ("Forever Yours")
   ============================================= */

function startConstellation() {
    const canvas = document.getElementById('constellationCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const name = "Forever Yours";
    const fontSize = Math.min(canvas.width / (name.length * 1.15), 115);

    const offscreen = document.createElement('canvas');
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const offCtx = offscreen.getContext('2d');
    offCtx.font = `bold ${fontSize}px 'Playfair Display', serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#fff';
    offCtx.fillText(name, canvas.width / 2, canvas.height * 0.35);

    const imageData = offCtx.getImageData(0, 0, canvas.width, canvas.height);
    const starPoints = [];
    const step = Math.max(4, Math.floor(fontSize / 15));

    for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
            const i = (y * canvas.width + x) * 4;
            if (imageData.data[i + 3] > 128) {
                starPoints.push({
                    targetX: x,
                    targetY: y,
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: 1.2 + Math.random() * 2.2,
                    arrived: false,
                    pulse: Math.random() * Math.PI * 2
                });
            }
        }
    }

    while (starPoints.length > 220) {
        starPoints.splice(Math.floor(Math.random() * starPoints.length), 1);
    }

    let frame = 0;
    function animate() {
        frame++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        starPoints.forEach(s => {
            s.x += (s.targetX - s.x) * 0.035;
            s.y += (s.targetY - s.y) * 0.035;
            s.pulse += 0.025;

            const alpha = 0.5 + 0.5 * Math.sin(s.pulse);
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.12})`;
            ctx.fill();
        });

        if (frame > 50) {
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.08)';
            ctx.lineWidth = 0.6;
            for (let i = 0; i < starPoints.length; i++) {
                for (let j = i + 1; j < starPoints.length; j++) {
                    const d = Math.hypot(starPoints[i].x - starPoints[j].x, starPoints[i].y - starPoints[j].y);
                    if (d < step * 2.6) {
                        ctx.beginPath();
                        ctx.moveTo(starPoints[i].x, starPoints[i].y);
                        ctx.lineTo(starPoints[j].x, starPoints[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        if (frame < 500) requestAnimationFrame(animate);
    }

    animate();
}

/* =============================================
   WINDOW RESIZE
   ============================================= */

window.addEventListener('resize', () => {
    document.querySelectorAll('.particle-canvas').forEach(c => {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
    });
});