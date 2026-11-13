// =========================================================================
// 1. PENCEGAH FLASH OF UNSTYLED TEXT (FOUT)
// =========================================================================
if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
        document.body.classList.remove('fonts-loading');
    });
    setTimeout(() => document.body.classList.remove('fonts-loading'), 500);
} else {
    document.body.classList.remove('fonts-loading');
}

// =========================================================================
// 2. INTRO MAILBOX, PIN & TIUP LILIN
// =========================================================================
function openMailbox() {
    const mailboxEl = document.getElementById('mailbox');
    if (mailboxEl) mailboxEl.classList.add('open');
    
    if (!isPlaying && !musicInitialized) {
        musicInitialized = true;
        selectAndPlayTrack(1);
    }
    setTimeout(() => { goTo('screen-pin'); }, 750);
}

// Verifikasi PIN Tanggal Pacaran (080424) - Jika salah layar digelapkan & kembali ke awal seperti Bubu Dudu
window.enteredPinString = "";
window.CORRECT_ANNIVERSARY_PIN = "080424";

window.addPin = function(num) {
    const dots = document.querySelectorAll('#screen-pin .dot');
    const maxPin = 6;
    if (window.enteredPinString.length < maxPin) {
        window.enteredPinString += String(num);
        const idx = window.enteredPinString.length - 1;
        if (dots[idx]) dots[idx].classList.add('filled');

        if (window.enteredPinString.length === maxPin) {
            const attempt = window.enteredPinString;
            if (attempt === window.CORRECT_ANNIVERSARY_PIN) {
                setTimeout(() => {
                    window.enteredPinString = "";
                    dots.forEach(d => d.classList.remove('filled'));
                    goTo('screen-cake');
                }, 350);
            } else {
                setTimeout(() => {
                    window.enteredPinString = "";
                    dots.forEach(d => d.classList.remove('filled'));
                    if (typeof window.kickAndReturnToMailbox === 'function') {
                        window.kickAndReturnToMailbox("PASSCODE SALAH! TANGGAL PACARAN KITA 080424 KOK LUPA?!");
                    }
                }, 250);
            }
        }
    }
};

window.clearPin = function() {
    const dots = document.querySelectorAll('#screen-pin .dot');
    if (window.enteredPinString.length > 0) {
        const idx = window.enteredPinString.length - 1;
        if (dots[idx]) dots[idx].classList.remove('filled');
        window.enteredPinString = window.enteredPinString.slice(0, -1);
    }
};

let candleBlown = false;
function blowCandle() {
    if (candleBlown) return;
    candleBlown = true;
    const fireEl = document.getElementById('candle-fire');
    const maskEl = document.getElementById('flame-mask');
    const smokeEl = document.getElementById('smoke-elem');
    const textEl = document.getElementById('blow-text');
    const hintEl = document.getElementById('blow-hint-box');

    if (fireEl) fireEl.classList.add('blown');
    if (maskEl) maskEl.classList.add('show');
    if (smokeEl) smokeEl.classList.add('show');
    if (textEl) textEl.innerText = 'Yeay! Happy Birthday!';
    if (hintEl) hintEl.style.display = 'none';

    setTimeout(() => {
        goTo('screen-menu');
    }, 1400);
}

// =========================================================================
// 3. NAVIGASI LAYAR
// =========================================================================
function switchMenuTab(tabName) {
    document.getElementById('btn-tab-story').classList.toggle('active', tabName === 'story');
    document.getElementById('btn-tab-games').classList.toggle('active', tabName === 'games');
    document.getElementById('tab-story').classList.toggle('active-tab', tabName === 'story');
    document.getElementById('tab-games').classList.toggle('active-tab', tabName === 'games');
}

function goTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        target.style.display = 'flex';
    }

    const isGame = screenId.startsWith('screen-game-') || screenId === 'screen-quiz';
    if (isGame) {
        if (isPlaying) {
            wasPlayingBeforeGame = true;
            pauseActiveMusicOnly();
        }
    } else {
        if (wasPlayingBeforeGame) {
            wasPlayingBeforeGame = false;
            resumeActiveMusicOnly();
        }
    }

    if (screenId === 'screen-flowers') initFlowerShop();
    if (screenId === 'screen-game-block') initBlockBlast();
    if (screenId === 'screen-game-birds') initBirdGame();
    if (screenId === 'screen-game-catch') initCatchGame();
    if (screenId === 'screen-coupons') renderLoveCouponsScreen();
    if (screenId !== 'screen-game-catch') catchGameRunning = false;
}

function closeWinOverlayAndGoToMenu() {
    document.getElementById('bb-win-overlay').classList.remove('show');
    goTo('screen-menu');
}
function closeWinOverlayAndGoToCoupons() {
    document.getElementById('bb-win-overlay').classList.remove('show');
    goTo('screen-coupons');
}
function closeMatchOverlayAndGoToMenu() {
    document.getElementById('match-win-overlay').classList.remove('show');
    goTo('screen-menu');
}
function closeMatchOverlayAndGoToCoupons() {
    document.getElementById('match-win-overlay').classList.remove('show');
    goTo('screen-coupons');
}
function closeBirdOverlayAndGoToMenu() {
    document.getElementById('bird-win-overlay').classList.remove('show');
    goTo('screen-menu');
}
function closeBirdOverlayAndGoToCoupons() {
    document.getElementById('bird-win-overlay').classList.remove('show');
    goTo('screen-coupons');
}
function closeCatchOverlayAndGoToMenu() {
    document.getElementById('catch-win-overlay').classList.remove('show');
    goTo('screen-menu');
}
function closeCatchOverlayAndGoToCoupons() {
    document.getElementById('catch-win-overlay').classList.remove('show');
    goTo('screen-coupons');
}

// =========================================================================
// 4. PETAL POST (TOKO BUNGA + KEJUTAN GAYA YUPI BERDAMPINGAN)
// =========================================================================
const flowerCatalog = [
    { id: 'redrose', name: 'Bunga Mawar Merah', price: 15000, potColor: '#d90429', potDark: '#9b001a' },
    { id: 'sunflower', name: 'Bunga Matahari', price: 20000, potColor: '#f48c06', potDark: '#c46d00' },
    { id: 'pinkrose', name: 'Mawar Pink Pastel', price: 15000, potColor: '#e83e8c', potDark: '#b82568' },
    { id: 'tulip', name: 'Raspberry Tulip', price: 18000, potColor: '#9b9b7a', potDark: '#707053' },
    { id: 'cosmos', name: 'Ivory Cosmos', price: 15000, potColor: '#d9468f', potDark: '#a62666' },
    { id: 'delphinium', name: 'Blue Delphinium', price: 18000, potColor: '#a3b18a', potDark: '#74825c' }
];

function formatRupiah(num) {
    return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

let pickedFlowers = [];
const wrapPalettes = [
    { main: '#f6d04d', inner: '#e2b62c', stroke: '#4a2c1d' },
    { main: '#f9bec7', inner: '#e598a6', stroke: '#4a2c1d' },
    { main: '#bde0fe', inner: '#90dbf4', stroke: '#1c4b82' },
    { main: '#d8f3dc', inner: '#b7e4c7', stroke: '#2d6a4f' },
    { main: '#f5ebe0', inner: '#e3d5ca', stroke: '#5c4033' }
];
const ribbonPalettes = ['#e0458b', '#d62828', '#3a86ff', '#8338ec', '#f77f00'];
let currentWrapIdx = 0;
let currentRibbonIdx = 0;
let penCanvas, penCtx, isPenDrawing = false, hasPenDrawn = false;

function renderSaniaCleanCutout() {
    const imgEl = document.getElementById('sania-clean-img');
    if (!imgEl) return;
    imgEl.style.transform = 'none';
}

function drawSingleBloomSVG(type, x, y, scale = 1, rot = 0) {
    let bloom = '';
    if (type === 'redrose') {
        bloom = `
            <circle cx="0" cy="0" r="12.5" fill="#d90429" stroke="#4a2c1d" stroke-width="1.4"/>
            <circle cx="-4" cy="-3" r="8.5" fill="#ef233c"/>
            <circle cx="4" cy="-2" r="8.5" fill="#b8001f"/>
            <circle cx="0" cy="4" r="8.5" fill="#d90429"/>
            <path d="M-5 -1 C-2 -6, 4 -6, 5 0 C4 5, -3 5, -3 1 C-2 -2, 2 -2, 2 0" fill="none" stroke="#660708" stroke-width="1.8" stroke-linecap="round"/>
        `;
    } else if (type === 'sunflower') {
        bloom = `
            <g fill="#ffb703" stroke="#4a2c1d" stroke-width="1.1">
                <ellipse cx="0" cy="-10" rx="3.2" ry="6"/>
                <ellipse cx="0" cy="10" rx="3.2" ry="6"/>
                <ellipse cx="-10" cy="0" rx="6" ry="3.2"/>
                <ellipse cx="10" cy="0" rx="6" ry="3.2"/>
                <ellipse cx="-7" cy="-7" rx="3.2" ry="6" transform="rotate(-45 -7 -7)"/>
                <ellipse cx="7" cy="-7" rx="3.2" ry="6" transform="rotate(45 7 -7)"/>
                <ellipse cx="-7" cy="7" rx="3.2" ry="6" transform="rotate(45 -7 7)"/>
                <ellipse cx="7" cy="7" rx="3.2" ry="6" transform="rotate(-45 7 7)"/>
            </g>
            <g fill="#ffd166" stroke="#ca6702" stroke-width="0.9" transform="rotate(22.5)">
                <ellipse cx="0" cy="-9.5" rx="2.8" ry="5.5"/>
                <ellipse cx="0" cy="9.5" rx="2.8" ry="5.5"/>
                <ellipse cx="-9.5" cy="0" rx="5.5" ry="2.8"/>
                <ellipse cx="9.5" cy="0" rx="5.5" ry="2.8"/>
                <ellipse cx="-6.8" cy="-6.8" rx="2.8" ry="5.5" transform="rotate(-45 -6.8 -6.8)"/>
                <ellipse cx="6.8" cy="-6.8" rx="2.8" ry="5.5" transform="rotate(45 6.8 -6.8)"/>
                <ellipse cx="-6.8" cy="6.8" rx="2.8" ry="5.5" transform="rotate(45 -6.8 6.8)"/>
                <ellipse cx="6.8" cy="6.8" rx="2.8" ry="5.5" transform="rotate(-45 6.8 6.8)"/>
            </g>
            <circle cx="0" cy="0" r="6.2" fill="#4a2c1d" stroke="#2b1d16" stroke-width="1.2"/>
            <circle cx="-2" cy="-2" r="0.9" fill="#d97706"/>
            <circle cx="2" cy="-1" r="0.9" fill="#d97706"/>
            <circle cx="0" cy="2" r="0.9" fill="#d97706"/>
            <circle cx="-2" cy="1.5" r="0.9" fill="#d97706"/>
            <circle cx="2" cy="2" r="0.9" fill="#d97706"/>
        `;
    } else if (type === 'pinkrose') {
        bloom = `
            <circle cx="0" cy="0" r="12" fill="#ff8fa3" stroke="#4a2c1d" stroke-width="1.4"/>
            <circle cx="-4" cy="-3" r="8" fill="#ffb3c1"/>
            <circle cx="4" cy="-2" r="8" fill="#ff758f"/>
            <circle cx="0" cy="4" r="8" fill="#ff8fa3"/>
            <path d="M-5 -1 C-2 -6, 4 -6, 5 0 C4 5, -3 5, -3 1 C-2 -2, 2 -2, 2 0" fill="none" stroke="#a4133c" stroke-width="1.6" stroke-linecap="round"/>
        `;
    } else if (type === 'tulip') {
        bloom = `
            <path d="M-10 2 C-12 -11, -3 -14, 0 -6 C3 -14, 12 -11, 10 2 C8 10, -8 10, -10 2 Z" fill="#c9184a" stroke="#4a2c1d" stroke-width="1.4"/>
            <path d="M-5 0 C-5 -10, 5 -10, 5 0" fill="#ff4d6d" stroke="#800f2f" stroke-width="1.1"/>
        `;
    } else if (type === 'cosmos') {
        bloom = `
            <g fill="#fffdf7" stroke="#4a2c1d" stroke-width="1.2">
                <ellipse cx="0" cy="-8" rx="4" ry="7"/>
                <ellipse cx="0" cy="8" rx="4" ry="7"/>
                <ellipse cx="-8" cy="0" rx="7" ry="4"/>
                <ellipse cx="8" cy="0" rx="7" ry="4"/>
                <ellipse cx="-6" cy="-6" rx="4" ry="6" transform="rotate(-45 -6 -6)"/>
                <ellipse cx="6" cy="-6" rx="4" ry="6" transform="rotate(45 6 -6)"/>
                <ellipse cx="-6" cy="6" rx="4" ry="6" transform="rotate(45 -6 6)"/>
                <ellipse cx="6" cy="6" rx="4" ry="6" transform="rotate(-45 6 6)"/>
            </g>
            <circle cx="0" cy="0" r="4.5" fill="#f4a261" stroke="#4a2c1d" stroke-width="1.2"/>
        `;
    } else {
        bloom = `
            <g fill="#4895ef" stroke="#1c4b82" stroke-width="1.2">
                <circle cx="0" cy="-9" r="5.5"/>
                <circle cx="-6" cy="-3" r="6"/>
                <circle cx="6" cy="-3" r="6"/>
                <circle cx="-4" cy="5" r="6"/>
                <circle cx="4" cy="5" r="6"/>
            </g>
            <circle cx="0" cy="-2" r="3" fill="#fffdf7"/>
        `;
    }
    return `<g transform="translate(${x}, ${y}) scale(${scale}) rotate(${rot})">${bloom}</g>`;
}

function createPotBunchSVG(f) {
    return `<svg viewBox="0 0 100 92" width="100%" height="100%">
        <g stroke="#2d6a4f" stroke-width="2.2" fill="none" stroke-linecap="round">
            <path d="M32 58 Q 22 36 24 22"/>
            <path d="M44 58 Q 40 30 38 16"/>
            <path d="M50 58 L 50 14"/>
            <path d="M58 58 Q 62 30 64 18"/>
            <path d="M68 58 Q 78 36 76 24"/>
        </g>
        <g fill="#52b788" stroke="#1b4332" stroke-width="1.2">
            <ellipse cx="22" cy="40" rx="8" ry="4" transform="rotate(-30 22 40)"/>
            <ellipse cx="78" cy="40" rx="8" ry="4" transform="rotate(30 78 40)"/>
            <ellipse cx="36" cy="46" rx="7" ry="4" transform="rotate(-15 36 46)"/>
            <ellipse cx="64" cy="46" rx="7" ry="4" transform="rotate(15 64 46)"/>
        </g>
        ${drawSingleBloomSVG(f.id, 26, 28, 0.95, -18)}
        ${drawSingleBloomSVG(f.id, 74, 30, 0.95, 18)}
        ${drawSingleBloomSVG(f.id, 38, 19, 1.0, -8)}
        ${drawSingleBloomSVG(f.id, 62, 20, 1.0, 10)}
        ${drawSingleBloomSVG(f.id, 50, 32, 1.05, 0)}
        <polygon points="26,52 74,52 67,88 33,88" fill="${f.potColor}" stroke="#3a2218" stroke-width="2"/>
        <rect x="23" y="48" width="54" height="6" rx="2" fill="${f.potDark}" stroke="#3a2218" stroke-width="1.8"/>
        <line x1="38" y1="56" x2="40" y2="85" stroke="${f.potDark}" stroke-width="1.5"/>
        <line x1="50" y1="56" x2="50" y2="85" stroke="${f.potDark}" stroke-width="1.5"/>
        <line x1="62" y1="56" x2="60" y2="85" stroke="${f.potDark}" stroke-width="1.5"/>
        <line x1="30" y1="68" x2="70" y2="68" stroke="${f.potDark}" stroke-width="1.4"/>
    </svg>`;
}

function initFlowerShop() {
    const row1 = document.getElementById('shelf-row-1');
    const row2 = document.getElementById('shelf-row-2');
    if (!row1 || !row2) return;
    row1.innerHTML = '';
    row2.innerHTML = '';

    flowerCatalog.forEach((f, idx) => {
        const count = pickedFlowers.filter(item => item.id === f.id).length;
        const st = document.createElement('div');
        st.className = 'flower-station';
        st.onclick = () => addFlowerToBouquet(idx);
        st.innerHTML = `
            ${count > 0 ? `<div class="stem-counter-pill">${count}</div>` : ''}
            <div class="bunch-svg-wrap">${createPotBunchSVG(f)}</div>
            <div class="station-placard">
                <div class="placard-name">${f.name}</div>
                <div class="placard-price">${formatRupiah(f.price)}</div>
            </div>
        `;
        if (idx < 3) row1.appendChild(st);
        else row2.appendChild(st);
    });

    renderBouquetStage();
}

function addFlowerToBouquet(idx) {
    if (pickedFlowers.length >= 12) {
        document.getElementById('petal-status-msg').innerText = 'Buket sudah penuh & rimbun! Siap dikirim.';
        return;
    }
    pickedFlowers.push(flowerCatalog[idx]);
    initFlowerShop();
    document.getElementById('petal-status-msg').innerText = `${flowerCatalog[idx].name} ditambahkan ke buket!`;
}

function buildBouquetSVGMarkup() {
    const wrap = wrapPalettes[currentWrapIdx];
    const ribbon = ribbonPalettes[currentRibbonIdx];

    const slots = [
        { x: 54, y: 54, rot: -16, sc: 1.12 },
        { x: 104, y: 56, rot: 16, sc: 1.12 },
        { x: 78, y: 42, rot: -4, sc: 1.18 },
        { x: 40, y: 72, rot: -24, sc: 1.08 },
        { x: 118, y: 72, rot: 22, sc: 1.08 },
        { x: 66, y: 68, rot: -8, sc: 1.15 },
        { x: 94, y: 68, rot: 10, sc: 1.15 },
        { x: 80, y: 56, rot: 0, sc: 1.22 },
        { x: 52, y: 40, rot: -12, sc: 1.05 },
        { x: 108, y: 42, rot: 14, sc: 1.05 },
        { x: 64, y: 34, rot: -6, sc: 1.05 },
        { x: 96, y: 34, rot: 8, sc: 1.05 }
    ];

    let stemsHTML = '';
    let bloomsHTML = '';
    pickedFlowers.forEach((f, i) => {
        const pos = slots[i % slots.length];
        stemsHTML += `<path d="M80 140 Q ${pos.x} 95 ${pos.x} ${pos.y}" stroke="#2d6a4f" stroke-width="3" fill="none"/>`;
        bloomsHTML += drawSingleBloomSVG(f.id, pos.x, pos.y, pos.sc, pos.rot);
    });

    const foliageHTML = pickedFlowers.length > 0 ? `
        <g fill="#40916c" stroke="#1b4332" stroke-width="1.3">
            <ellipse cx="42" cy="60" rx="14" ry="6" transform="rotate(-28 42 60)"/>
            <ellipse cx="118" cy="60" rx="14" ry="6" transform="rotate(28 118 60)"/>
            <ellipse cx="64" cy="44" rx="12" ry="5" transform="rotate(-10 64 44)"/>
            <ellipse cx="96" cy="44" rx="12" ry="5" transform="rotate(10 96 44)"/>
        </g>
    ` : '';

    const bottomStemsHTML = pickedFlowers.length > 0 ? `
        <path d="M72 156 L 70 166 M80 156 L 80 167 M88 156 L 90 166" stroke="#2d6a4f" stroke-width="3" stroke-linecap="round"/>
    ` : '';

    return `
        <path d="M18 66 L 80 24 L 142 66 L 96 156 L 64 156 Z" fill="${wrap.inner}" stroke="${wrap.stroke}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M26 68 Q 52 42 80 50 Q 108 42 134 68 L 94 148 L 66 148 Z" fill="#fffdf9" stroke="#e2d9c8" stroke-width="1.5"/>
        ${foliageHTML}
        ${stemsHTML}
        ${bloomsHTML}
        <path d="M18 66 L 84 102 L 94 156 L 64 156 Z" fill="${wrap.main}" stroke="${wrap.stroke}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M142 66 L 72 104 L 64 156 L 96 156 Z" fill="${wrap.main}" stroke="${wrap.stroke}" stroke-width="2" stroke-linejoin="round"/>
        ${bottomStemsHTML}
        <g transform="translate(80, 134)">
            <rect x="-17" y="-5" width="34" height="8" rx="3" fill="${ribbon}" stroke="#3a2218" stroke-width="1.6"/>
            <path d="M-2 0 C-18 -14, -28 6, -4 4 Z" fill="${ribbon}" stroke="#3a2218" stroke-width="1.6"/>
            <path d="M2 0 C18 -14, 28 6, 4 4 Z" fill="${ribbon}" stroke="#3a2218" stroke-width="1.6"/>
            <path d="M-3 3 Q -12 18 -18 26" stroke="${ribbon}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
            <path d="M3 3 Q 12 18 18 26" stroke="${ribbon}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
            <circle cx="0" cy="0" r="4.5" fill="${ribbon}" stroke="#3a2218" stroke-width="1.6"/>
        </g>
    `;
}

function renderBouquetStage() {
    const svgEl = document.getElementById('bouquet-svg-stage');
    if (!svgEl) return;
    let total = 0;
    pickedFlowers.forEach(f => total += f.price);
    document.getElementById('register-total').innerText = formatRupiah(total);
    document.getElementById('stem-total-label').innerText = `${pickedFlowers.length} tangkai`;
    svgEl.innerHTML = buildBouquetSVGMarkup();
}

function cycleWrapColor() {
    currentWrapIdx = (currentWrapIdx + 1) % wrapPalettes.length;
    renderBouquetStage();
}

function cycleRibbonColor() {
    currentRibbonIdx = (currentRibbonIdx + 1) % ribbonPalettes.length;
    renderBouquetStage();
}

function clearBouquet() {
    pickedFlowers = [];
    document.getElementById('tucked-note-card').classList.remove('show');
    initFlowerShop();
    document.getElementById('petal-status-msg').innerText = 'Ketuk bunga di rak atas untuk mulai merangkai buket!';
}

function openNoteModal() {
    document.getElementById('note-modal').classList.add('show');
    setTimeout(initFlowerPenCanvas, 50);
}

function closeNoteModal() {
    document.getElementById('note-modal').classList.remove('show');
}

function initFlowerPenCanvas() {
    if (!penCanvas) {
        penCanvas = document.getElementById('flower-pen-canvas');
        if (!penCanvas) return;
        penCtx = penCanvas.getContext('2d');
        penCanvas.width = penCanvas.parentElement.clientWidth || 280;
        penCanvas.height = penCanvas.parentElement.clientHeight || 140;
        penCtx.strokeStyle = '#6e473b';
        penCtx.lineWidth = 2.4;
        penCtx.lineCap = 'round';
        penCtx.lineJoin = 'round';

        function getPenPos(e) {
            const rect = penCanvas.getBoundingClientRect();
            const cx = e.clientX || (e.touches && e.touches[0].clientX);
            const cy = e.clientY || (e.touches && e.touches[0].clientY);
            return { x: cx - rect.left, y: cy - rect.top };
        }
        function startPen(e) {
            isPenDrawing = true;
            hasPenDrawn = true;
            document.getElementById('pen-hint-text').style.display = 'none';
            const pos = getPenPos(e);
            penCtx.beginPath();
            penCtx.moveTo(pos.x, pos.y);
        }
        function movePen(e) {
            if (!isPenDrawing) return;
            e.preventDefault();
            const pos = getPenPos(e);
            penCtx.lineTo(pos.x, pos.y);
            penCtx.stroke();
        }
        function endPen() { isPenDrawing = false; }

        penCanvas.onmousedown = startPen;
        penCanvas.onmousemove = movePen;
        window.addEventListener('mouseup', endPen);
        penCanvas.ontouchstart = startPen;
        penCanvas.ontouchmove = movePen;
        window.addEventListener('touchend', endPen);
    }
}

function clearFlowerPen() {
    if (!penCtx) return;
    penCtx.clearRect(0, 0, penCanvas.width, penCanvas.height);
    hasPenDrawn = false;
    document.getElementById('pen-hint-text').style.display = 'flex';
}

function tuckInNote() {
    const msg = document.getElementById('flower-note-input').value.trim() || 'Love, Sania';
    const previewCard = document.getElementById('tucked-note-card');
    const previewImg = document.getElementById('tucked-note-img');
    const previewTxt = document.getElementById('tucked-note-txt');

    if (penCanvas && hasPenDrawn) {
        previewImg.src = penCanvas.toDataURL();
        previewImg.style.display = 'block';
    } else {
        previewImg.style.display = 'none';
    }
    previewTxt.innerText = msg;
    previewCard.classList.add('show');
    closeNoteModal();
    document.getElementById('petal-status-msg').innerText = 'Kartu ucapan manis berhasil diselipkan ke buket!';
}

function sendBouquetNow() {
    if (pickedFlowers.length === 0) {
        document.getElementById('petal-status-msg').innerText = 'Pilih minimal 1 bunga di rak atas dulu ya!';
        return;
    }
    renderSaniaCleanCutout();
    document.getElementById('giant-bouquet-svg').innerHTML = buildBouquetSVGMarkup();

    const msg = document.getElementById('flower-note-input').value.trim() || 'Happy Birthday, Sayangku Noval! ♡';
    document.getElementById('giant-note-text').innerText = msg;
    const giantSign = document.getElementById('giant-note-sign');
    if (penCanvas && hasPenDrawn) {
        giantSign.src = penCanvas.toDataURL();
        giantSign.style.display = 'block';
    } else {
        giantSign.style.display = 'none';
    }

    goTo('bouquet-delivery-screen');
}

function closeDeliveryOverlay() {
    goTo('screen-flowers');
}

// =========================================================================
// 5. PLAYLIST SPOTIFY 4 LAGU
// =========================================================================
const playlistData = [
    {
        title: "Anugerah Terindah",
        artist: "Andmesh Kamaleng",
        duration: "4:21",
        src: "audio/AnugrahTerindah.mp3",
        altSrc: "audio/anugrahterindah.mp3",
        ytId: "sCEZ32GGv2A",
        cover: "img/bubu1.jpeg"
    },
    {
        title: "Orang Yang Sama",
        artist: "Virgoun",
        duration: "4:12",
        src: "audio/OrangYangSama.mp3",
        altSrc: "audio/orangyangsama.mp3",
        ytId: "c1vca1sI5j0",
        cover: "img/dudu1.jpeg"
    },
    {
        title: "Sempurna",
        artist: "Andra & The BackBone",
        duration: "4:28",
        src: "audio/sempurna.mp3",
        altSrc: "audio/Sempurna.mp3",
        ytId: "jStT3dc6LQo",
        cover: "img/bubu2.jpeg"
    },
    {
        title: "2001x",
        artist: "Special Track",
        duration: "3:35",
        src: "audio/2001x.mp3",
        altSrc: "audio/2001x.mp3",
        ytId: "sCEZ32GGv2A",
        cover: "img/dudu2.jpeg"
    }
];

let currentTrackIdx = 1;
let isPlaying = false;
let musicInitialized = false;
let wasPlayingBeforeGame = false;
let audioEl = document.getElementById('real-audio-player');
let ytPlayer = null;
let ytReady = false;
let usingYouTube = false;
let ytProgressInterval = null;

function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('yt-hidden-player', {
        height: '10',
        width: '10',
        videoId: playlistData[1].ytId,
        playerVars: { 'autoplay': 0, 'controls': 0, 'rel': 0, 'playsinline': 1 },
        events: {
            'onReady': () => { ytReady = true; },
            'onStateChange': (event) => {
                if (event.data === YT.PlayerState.ENDED) nextTrack();
            }
        }
    });
}

function renderPlaylistUI() {
    const listEl = document.getElementById('sp-playlist-list');
    if (!listEl) return;
    listEl.innerHTML = '';
    playlistData.forEach((track, idx) => {
        const item = document.createElement('div');
        item.className = 'sp-track-item' + (idx === currentTrackIdx ? ' active' : '');
        item.onclick = () => selectAndPlayTrack(idx);
        item.innerHTML = `
            <div class="sp-item-left">
                <div class="sp-item-num">${idx + 1}</div>
                <div>
                    <div class="sp-item-title">${track.title}</div>
                    <div class="sp-item-artist">${track.artist}</div>
                </div>
            </div>
            <div class="sp-item-dur">
                <i class="ph-fill ${idx === currentTrackIdx && isPlaying ? 'ph-pause-circle' : 'ph-play-circle'}" style="font-size: 16px; color: var(--mailbox-red);"></i>
                <span>${track.duration}</span>
            </div>
        `;
        listEl.appendChild(item);
    });
    const cur = playlistData[currentTrackIdx];
    document.getElementById('sp-title').innerText = cur.title;
    document.getElementById('sp-artist').innerText = cur.artist;
    document.getElementById('sp-total-time').innerText = cur.duration;
    document.getElementById('sp-cover-img').src = cur.cover;
    document.getElementById('sp-play-icon').className = isPlaying ? 'ph-fill ph-pause' : 'ph-fill ph-play';
    document.getElementById('sp-vinyl-badge').classList.toggle('spin', isPlaying);

    const menuNowPlaying = document.getElementById('menu-now-playing');
    const menuMiniDisc = document.getElementById('menu-mini-disc');
    if (menuNowPlaying) {
        menuNowPlaying.innerText = (isPlaying ? 'Now Playing: ' : 'Paused: ') + cur.title;
    }
    if (menuMiniDisc) {
        menuMiniDisc.classList.toggle('spin', isPlaying);
    }
}

function startYouTubeStream(ytId) {
    usingYouTube = true;
    document.getElementById('sp-status-hint').innerText = 'Memutar Musik Asli...';
    if (ytReady && ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
        ytPlayer.loadVideoById(ytId);
        ytPlayer.playVideo();
        if (ytProgressInterval) clearInterval(ytProgressInterval);
        ytProgressInterval = setInterval(() => {
            if (!isPlaying || !usingYouTube || !ytPlayer.getCurrentTime) return;
            const cur = ytPlayer.getCurrentTime() || 0;
            const dur = ytPlayer.getDuration() || 260;
            const pct = Math.min(100, (cur / dur) * 100);
            document.getElementById('sp-progress-fill').style.width = pct + '%';
            const mins = Math.floor(cur / 60);
            const secs = Math.floor(cur % 60);
            document.getElementById('sp-current-time').innerText = mins + ':' + (secs < 10 ? '0' : '') + secs;
        }, 500);
    } else {
        setTimeout(() => startYouTubeStream(ytId), 400);
    }
}

function pauseActiveMusicOnly() {
    isPlaying = false;
    if (audioEl) audioEl.pause();
    if (ytReady && ytPlayer && typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();
    renderPlaylistUI();
}

function resumeActiveMusicOnly() {
    isPlaying = true;
    if (usingYouTube && ytReady && ytPlayer) {
        ytPlayer.playVideo();
    } else if (audioEl) {
        audioEl.play().catch(() => {});
    }
    renderPlaylistUI();
}

function stopAllMusic() {
    if (audioEl) audioEl.pause();
    if (ytReady && ytPlayer && typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();
    if (ytProgressInterval) clearInterval(ytProgressInterval);
}

function selectAndPlayTrack(idx) {
    currentTrackIdx = idx;
    document.getElementById('sp-progress-fill').style.width = '0%';
    document.getElementById('sp-current-time').innerText = '0:00';
    stopAllMusic();

    const track = playlistData[currentTrackIdx];
    audioEl.src = track.src;
    isPlaying = true;
    renderPlaylistUI();

    audioEl.play().then(() => {
        usingYouTube = false;
        document.getElementById('sp-status-hint').innerText = 'Memutar Lagu...';
    }).catch(() => {
        audioEl.src = track.altSrc;
        audioEl.play().then(() => {
            usingYouTube = false;
            document.getElementById('sp-status-hint').innerText = 'Memutar Lagu...';
        }).catch(() => {
            startYouTubeStream(track.ytId);
        });
    });
}

function toggleMusic() {
    if (!isPlaying) {
        if (usingYouTube && ytReady && ytPlayer) {
            isPlaying = true;
            ytPlayer.playVideo();
            renderPlaylistUI();
        } else if (audioEl && audioEl.src) {
            isPlaying = true;
            audioEl.play().catch(() => selectAndPlayTrack(currentTrackIdx));
            renderPlaylistUI();
        } else {
            selectAndPlayTrack(currentTrackIdx);
        }
    } else {
        wasPlayingBeforeGame = false;
        pauseActiveMusicOnly();
        document.getElementById('sp-status-hint').innerText = 'Musik Dijeda';
    }
}

function nextTrack() { selectAndPlayTrack((currentTrackIdx + 1) % playlistData.length); }
function prevTrack() { selectAndPlayTrack((currentTrackIdx - 1 + playlistData.length) % playlistData.length); }

if (audioEl) {
    audioEl.addEventListener('timeupdate', () => {
        if (usingYouTube || !audioEl.duration) return;
        const pct = (audioEl.currentTime / audioEl.duration) * 100;
        document.getElementById('sp-progress-fill').style.width = pct + '%';
        const mins = Math.floor(audioEl.currentTime / 60);
        const secs = Math.floor(audioEl.currentTime % 60);
        document.getElementById('sp-current-time').innerText = mins + ':' + (secs < 10 ? '0' : '') + secs;
    });
    audioEl.addEventListener('ended', nextTrack);
}

function seekAudio(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    document.getElementById('sp-progress-fill').style.width = (pct * 100) + '%';
    if (!usingYouTube && audioEl && audioEl.duration) audioEl.currentTime = pct * audioEl.duration;
    else if (usingYouTube && ytReady && ytPlayer && ytPlayer.getDuration) ytPlayer.seekTo(pct * ytPlayer.getDuration(), true);
}

// =========================================================================
// 6. QUIZ LOGIC + ULAR TANGGA INTERAKTIF (STEP-BY-STEP)
// =========================================================================
// Logika Pergerakan Pion Ular Tangga Step-by-Step (Benar = Maju & Naik Tangga, Salah = MUNDUR & Turun Ular)
window.currentUlarTanggaPos = 1;
window.isUlarTanggaMoving = false;

window.getUlarTanggaCoords = function(num) {
    const idx = num - 1;
    const rowFromBottom = Math.floor(idx / 5);
    const colInRow = idx % 5;
    const col = (rowFromBottom % 2 === 1) ? (4 - colInRow) : colInRow;
    const rowFromTop = 4 - rowFromBottom;
    return { x: col * 52 + 26, y: rowFromTop * 42 + 21 };
};

window.setUlarTanggaTokenImmediate = function(num, transitionSec) {
    const token = document.getElementById('ulartangga-token');
    const posText = document.getElementById('ulartangga-pos-text');
    if (!token) return;
    token.style.transition = `transform ${transitionSec || 0.22}s cubic-bezier(0.34, 1.56, 0.64, 1)`;
    const pt = window.getUlarTanggaCoords(num);
    token.setAttribute('transform', `translate(${pt.x}, ${pt.y})`);
    window.currentUlarTanggaPos = num;
    if (posText) posText.innerText = `Kotak: ${num} / 25`;
};

window.walkUlarTanggaSteps = function(targetNum, onDone) {
    window.isUlarTanggaMoving = true;
    const stepOnce = () => {
        if (window.currentUlarTanggaPos === targetNum) {
            if (onDone) onDone();
            else window.isUlarTanggaMoving = false;
            return;
        }
        const nextNum = window.currentUlarTanggaPos < targetNum
            ? window.currentUlarTanggaPos + 1
            : window.currentUlarTanggaPos - 1;
        window.setUlarTanggaTokenImmediate(nextNum, 0.2);
        setTimeout(stepOnce, 210);
    };
    stepOnce();
};

window.walkAndClimbLadder = function(baseNum, topNum, climbMsg, finalMsg, onComplete) {
    const statusEl = document.getElementById('ulartangga-status');
    if (statusEl) statusEl.innerHTML = climbMsg;
    window.walkUlarTanggaSteps(baseNum, () => {
        setTimeout(() => {
            if (statusEl) statusEl.innerHTML = `Naik tangga dari kotak ${baseNum} ke kotak ${topNum}! <img src="https://emojicdn.elk.sh/🪜?style=apple" width="14" height="14" style="vertical-align:middle;">`;
            window.setUlarTanggaTokenImmediate(topNum, 0.55);
            setTimeout(() => {
                if (statusEl && finalMsg) statusEl.innerHTML = finalMsg;
                window.isUlarTanggaMoving = false;
                if (onComplete) onComplete();
            }, 600);
        }, 220);
    });
};

window.stepBackAndSlideSnake = function(headNum, tailNum, fallbackMinNum, snakeMsg, fallbackMsg) {
    const statusEl = document.getElementById('ulartangga-status');
    // Hanya kena kepala ular jika posisi saat ini di atas kepala ular (jadi mundur ke kepala ular, TIDAK PERNAH maju mengejar ular!)
    if (window.currentUlarTanggaPos > headNum) {
        if (statusEl) statusEl.innerHTML = `Jawaban salah! Mundur ke kotak ${headNum}...`;
        window.walkUlarTanggaSteps(headNum, () => {
            setTimeout(() => {
                if (statusEl) statusEl.innerHTML = snakeMsg;
                window.setUlarTanggaTokenImmediate(tailNum, 0.55);
                setTimeout(() => {
                    window.isUlarTanggaMoving = false;
                }, 550);
            }, 220);
        });
    } else if (window.currentUlarTanggaPos > fallbackMinNum) {
        const backTarget = Math.max(fallbackMinNum, window.currentUlarTanggaPos - 1);
        if (statusEl) statusEl.innerHTML = fallbackMsg;
        window.walkUlarTanggaSteps(backTarget, () => {
            window.isUlarTanggaMoving = false;
        });
    } else {
        if (statusEl) statusEl.innerHTML = fallbackMsg;
        window.isUlarTanggaMoving = false;
    }
};

window.answerQuiz = function(btn, qNum, isCorrect) {
    if (window.isUlarTanggaMoving) return;
    const statusEl = document.getElementById('ulartangga-status');

    if (isCorrect) {
        btn.classList.add('correct');
        if (qNum === 1) {
            window.walkAndClimbLadder(
                2, 9,
                'Jawaban benar! Maju ke kaki tangga di kotak 2...',
                'Mantap! Naik tangga ke kotak 9! Lanjut soal ke-2 <img src="https://emojicdn.elk.sh/🔥?style=apple" width="14" height="14" style="vertical-align:middle;">',
                () => {
                    document.getElementById('q1-box').style.display = 'none';
                    document.getElementById('q2-box').style.display = 'block';
                }
            );
        } else if (qNum === 2) {
            window.walkAndClimbLadder(
                13, 18,
                'Jawaban benar! Maju menuju kaki tangga di kotak 13...',
                'Yeay! Naik tangga ke kotak 18! Lanjut soal ke-3 <img src="https://emojicdn.elk.sh/🎉?style=apple" width="14" height="14" style="vertical-align:middle;">',
                () => {
                    document.getElementById('q2-box').style.display = 'none';
                    document.getElementById('q3-box').style.display = 'block';
                }
            );
        } else if (qNum === 3) {
            window.walkAndClimbLadder(
                20, 22,
                'Hahaha bener brot brot brot! Maju ke kotak 20...',
                'Naik tangga ke kotak 22! Tinggal 1 soal terakhir! <img src="https://emojicdn.elk.sh/🤣?style=apple" width="14" height="14" style="vertical-align:middle;">',
                () => {
                    document.getElementById('q3-box').style.display = 'none';
                    document.getElementById('q4-box').style.display = 'block';
                }
            );
        }
    } else {
        btn.classList.add('wrong');
        setTimeout(() => btn.classList.remove('wrong'), 600);

        if (qNum === 1) {
            if (statusEl) statusEl.innerHTML = 'Tetot! Jawaban salah, tetap di kotak 1! Pilih jawaban yang benar ya <img src="https://emojicdn.elk.sh/😜?style=apple" width="14" height="14" style="vertical-align:middle;">';
        } else if (qNum === 2) {
            window.stepBackAndSlideSnake(
                8, 3, 1,
                'Yah salah! Mundur ke kotak 8 & kena ular turun ke kotak 3! <img src="https://emojicdn.elk.sh/🐍?style=apple" width="14" height="14" style="vertical-align:middle;">',
                'Tetot! Jawaban salah, pionmu mundur lagi! <img src="https://emojicdn.elk.sh/🐍?style=apple" width="14" height="14" style="vertical-align:middle;">'
            );
        } else if (qNum === 3) {
            window.stepBackAndSlideSnake(
                17, 14, 9,
                'Yah salah! Mundur ke kotak 17 & kena ular turun ke kotak 14! <img src="https://emojicdn.elk.sh/🐍?style=apple" width="14" height="14" style="vertical-align:middle;">',
                'Tetot! Jawaban salah, pionmu mundur lagi! <img src="https://emojicdn.elk.sh/🐍?style=apple" width="14" height="14" style="vertical-align:middle;">'
            );
        }
    }
};

window.submitEssay = function() {
    if (window.isUlarTanggaMoving) return;
    const essayEl = document.getElementById('essay-input');
    if (!essayEl || essayEl.value.trim() === '') {
        alert('Tuliskan harapanmu terlebih dahulu ya sayang!');
        return;
    }
    const statusEl = document.getElementById('ulartangga-status');
    if (statusEl) statusEl.innerHTML = 'Melangkah menuju garis Finish...';
    window.walkUlarTanggaSteps(25, () => {
        window.isUlarTanggaMoving = false;
        if (statusEl) statusEl.innerHTML = 'FINISH! Pionmu sampai di puncak kotak 25! <img src="https://emojicdn.elk.sh/🏆?style=apple" width="15" height="15" style="vertical-align:middle;">';
        setTimeout(() => {
            const q4 = document.getElementById('q4-box');
            if (q4) q4.style.display = 'none';
            document.getElementById('quiz-result-box').style.display = 'block';
            window.unlockGameMission('quiz');
        }, 300);
    });
};

window.resetQuiz = function() {
    window.isUlarTanggaMoving = false;
    document.querySelectorAll('.quiz-opt-btn').forEach(b => b.classList.remove('correct', 'wrong'));
    const essayEl = document.getElementById('essay-input');
    if (essayEl) essayEl.value = '';
    document.getElementById('quiz-result-box').style.display = 'none';
    document.getElementById('q2-box').style.display = 'none';
    document.getElementById('q3-box').style.display = 'none';
    const q4 = document.getElementById('q4-box');
    if (q4) q4.style.display = 'none';
    document.getElementById('q1-box').style.display = 'block';
    window.setUlarTanggaTokenImmediate(1, 0.3);
    const statusEl = document.getElementById('ulartangga-status');
    if (statusEl) statusEl.innerHTML = 'Jawab benar supaya pionmu naik tangga ke kotak 25! <img src="https://emojicdn.elk.sh/🚀?style=apple" width="14" height="14" style="vertical-align:middle;">';
};

// =========================================================================
// 7. ANGRY BIRDS
// =========================================================================
let birdCanvas, birdCtx;
let sling = { x: 50, y: 150, radius: 20 };
let birdsLeft = 10;
let bird = { x: 50, y: 150, vx: 0, vy: 0, radius: 13, isDragging: false, isFlying: false };
let targets = [];
let birdGameRunning = false;

function initBirdGame() {
    birdCanvas = document.getElementById('bird-canvas');
    if (!birdCanvas) return;
    birdCtx = birdCanvas.getContext('2d');
    birdCanvas.width = 280; birdCanvas.height = 200;
    birdsLeft = 10;
    targets = [
        { x: 180, y: 55, w: 26, h: 26, alive: true },
        { x: 205, y: 100, w: 26, h: 26, alive: true },
        { x: 180, y: 145, w: 26, h: 26, alive: true }
    ];
    resetBirdShot();
    birdGameRunning = true;
    birdCanvas.onmousedown = startDrag;
    birdCanvas.onmousemove = dragMove;
    window.onmouseup = releaseDrag;
    birdCanvas.ontouchstart = startDrag;
    birdCanvas.ontouchmove = dragMove;
    window.ontouchend = releaseDrag;
    requestAnimationFrame(updateBirdGame);
}

function resetBirdShot() {
    bird = { x: 50, y: 150, vx: 0, vy: 0, radius: 13, isDragging: false, isFlying: false };
    document.getElementById('bird-count').innerText = birdsLeft;
    document.getElementById('bird-status').innerText = 'Tarik burung & hancurkan target!';
    document.getElementById('bird-win-overlay').classList.remove('show');
}

function getCanvasPos(e) {
    const rect = birdCanvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    return { x: clientX - rect.left, y: clientY - rect.top };
}

function startDrag(e) {
    if (bird.isFlying || birdsLeft <= 0) return;
    const pos = getCanvasPos(e);
    if (Math.hypot(pos.x - sling.x, pos.y - sling.y) < 35) bird.isDragging = true;
}

function dragMove(e) {
    if (!bird.isDragging) return;
    e.preventDefault();
    const pos = getCanvasPos(e);
    let dx = pos.x - sling.x, dy = pos.y - sling.y;
    let dist = Math.hypot(dx, dy);
    if (dist > 55) { dx = (dx / dist) * 55; dy = (dy / dist) * 55; }
    bird.x = sling.x + dx; bird.y = sling.y + dy;
}

function releaseDrag() {
    if (!bird.isDragging) return;
    bird.isDragging = false; bird.isFlying = true;
    birdsLeft--;
    document.getElementById('bird-count').innerText = birdsLeft;
    bird.vx = (sling.x - bird.x) * 0.28;
    bird.vy = (sling.y - bird.y) * 0.28;
}

function updateBirdGame() {
    if (!birdGameRunning) return;
    if (bird.isFlying) {
        bird.x += bird.vx; bird.y += bird.vy; bird.vy += 0.25;
        targets.forEach(t => {
            if (t.alive && bird.x > t.x && bird.x < t.x + t.w && bird.y > t.y && bird.y < t.y + t.h) t.alive = false;
        });
        if (targets.every(t => !t.alive)) {
            unlockGameMission('birds');
            document.getElementById('bird-win-overlay').classList.add('show');
            document.getElementById('bird-status').innerText = 'Hebat! Semua hati hancur!';
            bird.isFlying = false;
        } else if (bird.x > 280 || bird.y > 200 || bird.x < 0) {
            if (birdsLeft > 0) {
                document.getElementById('bird-status').innerText = 'Lanjut burung berikutnya...';
                setTimeout(resetBirdShot, 600);
            } else {
                document.getElementById('bird-status').innerText = 'Kesempatan habis! Mengulang...';
                setTimeout(initBirdGame, 1200);
            }
        }
    }
    drawBirdGame();
    requestAnimationFrame(updateBirdGame);
}

function drawBirdGame() {
    birdCtx.clearRect(0, 0, birdCanvas.width, birdCanvas.height);
    birdCtx.fillStyle = '#c8e1f5';
    birdCtx.fillRect(0, 180, birdCanvas.width, 20);
    birdCtx.strokeStyle = '#8b5a2b';
    birdCtx.lineWidth = 5;
    birdCtx.beginPath();
    birdCtx.moveTo(sling.x, sling.y + 20);
    birdCtx.lineTo(sling.x, sling.y);
    birdCtx.lineTo(sling.x - 8, sling.y - 12);
    birdCtx.moveTo(sling.x, sling.y);
    birdCtx.lineTo(sling.x + 8, sling.y - 12);
    birdCtx.stroke();

    if (bird.isDragging) {
        birdCtx.strokeStyle = '#333';
        birdCtx.lineWidth = 2;
        birdCtx.beginPath();
        birdCtx.moveTo(sling.x - 8, sling.y - 12);
        birdCtx.lineTo(bird.x, bird.y);
        birdCtx.lineTo(sling.x + 8, sling.y - 12);
        birdCtx.stroke();
    }

    birdCtx.fillStyle = '#e06d6d';
    birdCtx.beginPath();
    birdCtx.arc(bird.x - 3, bird.y - bird.radius - 2, 4, 0, Math.PI * 2);
    birdCtx.fill();
    birdCtx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    birdCtx.fill();
    birdCtx.strokeStyle = '#1c4b82';
    birdCtx.lineWidth = 2;
    birdCtx.stroke();

    birdCtx.fillStyle = '#fdebd0';
    birdCtx.beginPath();
    birdCtx.arc(bird.x, bird.y + 5, bird.radius * 0.6, 0, Math.PI);
    birdCtx.fill();

    birdCtx.strokeStyle = '#111';
    birdCtx.lineWidth = 2.5;
    birdCtx.beginPath();
    birdCtx.moveTo(bird.x - 6, bird.y - 6);
    birdCtx.lineTo(bird.x + 4, bird.y - 2);
    birdCtx.stroke();

    birdCtx.fillStyle = '#f0ad4e';
    birdCtx.beginPath();
    birdCtx.moveTo(bird.x + 8, bird.y - 2);
    birdCtx.lineTo(bird.x + 18, bird.y + 2);
    birdCtx.lineTo(bird.x + 8, bird.y + 6);
    birdCtx.closePath();
    birdCtx.fill();
    birdCtx.strokeStyle = '#1c4b82';
    birdCtx.lineWidth = 1.5;
    birdCtx.stroke();

    birdCtx.fillStyle = 'white';
    birdCtx.beginPath();
    birdCtx.arc(bird.x + 4, bird.y - 4, 4, 0, Math.PI * 2);
    birdCtx.fill();
    birdCtx.stroke();
    birdCtx.fillStyle = 'black';
    birdCtx.beginPath();
    birdCtx.arc(bird.x + 5, bird.y - 4, 1.5, 0, Math.PI * 2);
    birdCtx.fill();

    targets.forEach(t => {
        if (t.alive) {
            birdCtx.fillStyle = '#ffb6c1';
            birdCtx.fillRect(t.x, t.y, t.w, t.h);
            birdCtx.strokeStyle = '#1c4b82';
            birdCtx.lineWidth = 2;
            birdCtx.strokeRect(t.x, t.y, t.w, t.h);
            birdCtx.fillStyle = '#1c4b82';
            birdCtx.font = "15px 'Comic Sans MS','Chalkboard SE',sans-serif";
            birdCtx.textAlign = 'center';
            birdCtx.textBaseline = 'middle';
            birdCtx.fillText('♥', t.x + t.w/2, t.y + t.h/2);
        }
    });
}

// =========================================================================
// 8. CATCH LOVE GAME
// =========================================================================
let catchCanvas, catchCtx, basketX = 110, fallingHearts = [], catchScore = 0, catchGameRunning = false;
function initCatchGame() {
    catchCanvas = document.getElementById('catch-canvas');
    if (!catchCanvas) return;
    catchCtx = catchCanvas.getContext('2d');
    catchCanvas.width = 280; catchCanvas.height = 220;
    catchScore = 0; fallingHearts = []; catchGameRunning = true;
    document.getElementById('catch-score').innerText = catchScore;
    document.getElementById('catch-win-overlay').classList.remove('show');
    function moveBasket(e) {
        const rect = catchCanvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        if (clientX) basketX = Math.max(0, Math.min(catchCanvas.width - 55, (clientX - rect.left) - 27));
    }
    catchCanvas.onmousemove = moveBasket;
    catchCanvas.ontouchmove = (e) => { e.preventDefault(); moveBasket(e); };
    requestAnimationFrame(updateCatchGame);
}

function updateCatchGame() {
    if (!catchGameRunning) return;
    if (Math.random() < 0.04) fallingHearts.push({ x: Math.random() * 240 + 20, y: -10, speed: 2.2 });
    catchCtx.clearRect(0, 0, catchCanvas.width, catchCanvas.height);
    catchCtx.fillStyle = '#ffb6c1'; catchCtx.fillRect(basketX, 188, 55, 18);
    catchCtx.strokeStyle = '#1c4b82'; catchCtx.lineWidth = 2; catchCtx.strokeRect(basketX, 188, 55, 18);
    for (let i = fallingHearts.length - 1; i >= 0; i--) {
        let h = fallingHearts[i]; h.y += h.speed;
        catchCtx.fillStyle = '#e06d6d'; catchCtx.font = "20px 'Comic Sans MS','Chalkboard SE',sans-serif"; catchCtx.fillText('♥', h.x, h.y);
        if (h.y >= 182 && h.y <= 208 && h.x >= basketX - 8 && h.x <= basketX + 55) {
            catchScore++; document.getElementById('catch-score').innerText = catchScore;
            fallingHearts.splice(i, 1);
            if (catchScore >= 10) {
                catchGameRunning = false;
                unlockGameMission('catch');
                document.getElementById('catch-win-overlay').classList.add('show');
                return;
            }
        } else if (h.y > 230) fallingHearts.splice(i, 1);
    }
    requestAnimationFrame(updateCatchGame);
}

// =========================================================================
// 9. SCRATCH CARD ENGINE
// =========================================================================
function initScratchCard(canvasId, btnId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 260; canvas.height = 95;
    const totalPixels = canvas.width * canvas.height;
    let isScratching = false;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#c0c0c0'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#555'; ctx.font = "bold 16px 'Comic Sans MS','Chalkboard SE',sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('Gesek / Gosok Disini', canvas.width / 2, canvas.height / 2);

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        return { x: clientX - rect.left, y: clientY - rect.top };
    }
    function scratchMove(e) {
        if (!isScratching) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath(); ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2); ctx.fill();
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let transparent = 0;
        for (let i = 3; i < imgData.data.length; i += 4) if (imgData.data[i] === 0) transparent++;
        if (transparent > totalPixels * 0.40) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            isScratching = false;
            if (canvasId === 'scratch-canvas-master') window.masterCouponScratched = true;
            const targetBtn = document.getElementById(btnId);
            if (targetBtn) targetBtn.style.display = (canvasId === 'scratch-canvas-master') ? 'block' : 'flex';
        }
    }
    canvas.onmousedown = (e) => { isScratching = true; scratchMove(e); };
    canvas.onmousemove = scratchMove;
    window.onmouseup = () => isScratching = false;
    canvas.ontouchstart = (e) => { isScratching = true; scratchMove(e); };
    canvas.ontouchmove = scratchMove;
    window.ontouchend = () => isScratching = false;
}

function claimCoupon(el) { el.classList.add('claimed'); }

// =========================================================================
// 9B. LOVE COUPONS GAME MISSIONS & MASTER SCRATCH SYSTEM (iOS EMOJIS)
// =========================================================================
const GAME_MISSIONS_CONFIG = [
    {
        id: 'block',
        title: 'Block Blast',
        sub: 'Capai 500 Poin di Block Blast Love',
        screen: 'screen-game-block',
        emojiUrl: 'https://emojicdn.elk.sh/🧩?style=apple'
    },
    {
        id: 'match',
        title: 'Match Card',
        sub: 'Cocokkan semua pasang kartu Bubu & Dudu',
        screen: 'screen-game-match',
        emojiUrl: 'https://emojicdn.elk.sh/🃏?style=apple'
    },
    {
        id: 'quiz',
        title: 'Quiz Sania',
        sub: 'Jawab kuis & tulis harapan spesialmu',
        screen: 'screen-quiz',
        emojiUrl: 'https://emojicdn.elk.sh/💌?style=apple'
    },
    {
        id: 'birds',
        title: 'Love Catapult',
        sub: 'Hancurkan semua target hati dengan ketapel',
        screen: 'screen-game-birds',
        emojiUrl: 'https://emojicdn.elk.sh/🏹?style=apple'
    },
    {
        id: 'catch',
        title: 'Catch Love',
        sub: 'Tangkap 10 hati Sania di keranjang',
        screen: 'screen-game-catch',
        emojiUrl: 'https://emojicdn.elk.sh/💖?style=apple'
    }
];

window.unlockedGamesState = {
    block: false,
    match: false,
    quiz: false,
    birds: false,
    catch: false
};
window.masterCouponScratched = false;

function unlockGameMission(gameId) {
    if (window.unlockedGamesState.hasOwnProperty(gameId)) {
        window.unlockedGamesState[gameId] = true;
    }
    renderLoveCouponsScreen();
}

function renderLoveCouponsScreen() {
    let unlockedCount = 0;
    ['block', 'match', 'quiz', 'birds', 'catch'].forEach(id => {
        const isUnlocked = !!(window.unlockedGamesState && window.unlockedGamesState[id]);
        if (isUnlocked) unlockedCount++;

        const card = document.getElementById('mission-card-' + id);
        const badge = document.getElementById('mission-badge-' + id);

        if (card) {
            card.style.background = isUnlocked ? '#f0fdf4' : '#f8f9fa';
            card.style.borderColor = isUnlocked ? '#16a34a' : '#1c4b82';
        }
        if (badge) {
            badge.style.background = isUnlocked ? '#dcfce7' : '#fee2e2';
            badge.style.color = isUnlocked ? '#15803d' : '#b91c1c';
            badge.style.borderColor = isUnlocked ? '#16a34a' : '#ef4444';
            badge.innerHTML = isUnlocked
                ? '<img src="https://emojicdn.elk.sh/🔓?style=apple" width="15" height="15" style="vertical-align:middle;"><span>UNLOCKED</span>'
                : '<img src="https://emojicdn.elk.sh/🔒?style=apple" width="15" height="15" style="vertical-align:middle;"><span>LOCKED</span>';
        }
    });

    const subEl = document.getElementById('coupons-progress-subtitle');
    if (subEl) {
        if (unlockedCount < 5) {
            subEl.innerHTML = 'Progress: <strong>' + unlockedCount + ' / 5 Game</strong> <img src="https://emojicdn.elk.sh/🎮?style=apple" width="16" height="16" style="vertical-align:middle;">';
        } else {
            subEl.innerHTML = '<strong>5 / 5 Game Selesai!</strong> <img src="https://emojicdn.elk.sh/🥳?style=apple" width="16" height="16" style="vertical-align:middle;">';
        }
    }

    const lockedMsg = document.getElementById('final-coupon-locked-msg');
    const unlockedArea = document.getElementById('final-coupon-unlocked-area');
    if (unlockedCount === 5) {
        if (lockedMsg) lockedMsg.style.display = 'none';
        if (unlockedArea) {
            unlockedArea.style.display = 'block';
            if (!window.masterCouponScratched && typeof initScratchCard === 'function') {
                initScratchCard('scratch-canvas-master', 'master-coupon-done-msg');
            }
        }
    } else {
        if (lockedMsg) lockedMsg.style.display = 'block';
        if (unlockedArea) unlockedArea.style.display = 'none';
    }
}

// =========================================================================
// 10. MEMORY MATCH
// =========================================================================
let flippedCards = [], matchedPairs = 0, lockBoard = false;
function flipMemoryCard(card) {
    if (lockBoard || card === flippedCards[0] || card.classList.contains('matched')) return;
    card.classList.add('flipped'); flippedCards.push(card);
    if (flippedCards.length === 2) {
        if (flippedCards[0].dataset.img === flippedCards[1].dataset.img) {
            flippedCards[0].classList.add('matched'); flippedCards[1].classList.add('matched');
            matchedPairs++; flippedCards = [];
            if (matchedPairs === 6) {
                unlockGameMission('match');
                document.getElementById('match-win-overlay').classList.add('show');
            }
        } else {
            lockBoard = true;
            setTimeout(() => {
                flippedCards[0].classList.remove('flipped'); flippedCards[1].classList.remove('flipped');
                flippedCards = []; lockBoard = false;
            }, 700);
        }
    }
}

// =========================================================================
// 11. BLOCK BLAST
// =========================================================================
const BOARD_SIZE = 8;
const WIN_SCORE = 500;
let bbGrid = [];
let bbScore = 0;
let currentPieces = [null, null, null];
let selectedSlot = null;
let isGameEnded = false;

const SHAPES = [
    [[1]], [[1, 1]], [[1], [1]], [[1, 1, 1]], [[1], [1], [1]], [[1, 1], [1, 1]], [[1, 0], [1, 1]], [[0, 1], [1, 1]], [[1, 1, 1], [0, 1, 0]]
];

function initBlockBlast() {
    const boardEl = document.getElementById('bb-board');
    if (!boardEl) return;
    bbGrid = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
    bbScore = 0;
    selectedSlot = null;
    isGameEnded = false;

    document.getElementById('bb-win-overlay').classList.remove('show');
    document.getElementById('bb-gameover-overlay').classList.remove('show');
    document.getElementById('win-action-btns').style.display = 'flex';

    updateScoreUI();
    document.getElementById('bb-status').innerText = 'Pilih balok di bawah, lalu klik area kosong di papan!';
    
    boardEl.innerHTML = '';
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const cell = document.createElement('div');
            cell.className = 'bb-cell';
            cell.dataset.r = r;
            cell.dataset.c = c;
            cell.addEventListener('click', () => placePieceAtClick(r, c));
            cell.addEventListener('mouseenter', () => previewPieceAtClick(r, c));
            boardEl.appendChild(cell);
        }
    }
    boardEl.addEventListener('mouseleave', clearPreview);

    const startHeart = [
        [2,2], [2,5], [3,1], [3,2], [3,3], [3,4], [3,5], [3,6], [4,2], [4,3], [4,4], [4,5], [5,3], [5,4]
    ];
    startHeart.forEach(([r, c]) => { bbGrid[r][c] = 1; });

    renderBoard();
    spawnNewTray();
}

function updateScoreUI() {
    document.getElementById('bb-score').innerText = bbScore;
    const pct = Math.min(100, Math.round((bbScore / WIN_SCORE) * 100));
    document.getElementById('bb-progress').style.width = pct + '%';
}

function renderBoard() {
    const cells = document.querySelectorAll('#bb-board .bb-cell');
    cells.forEach(cell => {
        const r = parseInt(cell.dataset.r);
        const c = parseInt(cell.dataset.c);
        cell.classList.remove('preview-valid', 'preview-invalid');
        if (bbGrid[r][c] === 1) {
            cell.classList.add('filled');
            cell.innerHTML = '<i class="ph-fill ph-heart"></i>';
        } else {
            cell.classList.remove('filled');
            cell.innerHTML = '';
        }
    });
}

function spawnNewTray() {
    if (isGameEnded) return;
    for (let i = 0; i < 3; i++) {
        const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        currentPieces[i] = randomShape;
        renderSlot(i, randomShape);
    }
    updateTrayPlayability();
    const firstPlayable = currentPieces.findIndex(p => p !== null && canPieceFitAnywhere(p));
    if (firstPlayable !== -1) {
        selectPiece(firstPlayable);
    } else {
        checkGameState();
    }
}

function renderSlot(slotIdx, shape) {
    const slotEl = document.getElementById('slot-' + slotIdx);
    slotEl.innerHTML = '';
    slotEl.classList.remove('used', 'selected', 'unplayable');

    if (!shape) {
        slotEl.classList.add('used');
        return;
    }

    const rows = shape.length;
    const cols = shape[0].length;
    const miniGrid = document.createElement('div');
    miniGrid.className = 'mini-grid';
    miniGrid.style.gridTemplateColumns = `repeat(${cols}, 12px)`;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const mCell = document.createElement('div');
            mCell.className = 'mini-cell' + (shape[r][c] ? ' on' : '');
            miniGrid.appendChild(mCell);
        }
    }
    slotEl.appendChild(miniGrid);
}

function selectPiece(slotIdx) {
    if (isGameEnded || !currentPieces[slotIdx]) return;
    selectedSlot = slotIdx;
    for (let i = 0; i < 3; i++) {
        const el = document.getElementById('slot-' + i);
        el.classList.toggle('selected', i === slotIdx);
    }
    clearPreview();
}

function canPlace(shape, startR, startC) {
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[0].length; c++) {
            if (shape[r][c] === 1) {
                const tr = startR + r;
                const tc = startC + c;
                if (tr < 0 || tc < 0 || tr >= BOARD_SIZE || tc >= BOARD_SIZE || bbGrid[tr][tc] === 1) {
                    return false;
                }
            }
        }
    }
    return true;
}

function canPieceFitAnywhere(shape) {
    if (!shape) return false;
    for (let r = 0; r <= BOARD_SIZE - shape.length; r++) {
        for (let c = 0; c <= BOARD_SIZE - shape[0].length; c++) {
            if (canPlace(shape, r, c)) return true;
        }
    }
    return false;
}

function updateTrayPlayability() {
    for (let i = 0; i < 3; i++) {
        const slotEl = document.getElementById('slot-' + i);
        if (currentPieces[i]) {
            const fits = canPieceFitAnywhere(currentPieces[i]);
            slotEl.classList.toggle('unplayable', !fits);
        }
    }
}

function findBestAnchor(shape, clickR, clickC) {
    let centerR = clickR - Math.floor(shape.length / 2);
    let centerC = clickC - Math.floor(shape[0].length / 2);
    centerR = Math.max(0, Math.min(BOARD_SIZE - shape.length, centerR));
    centerC = Math.max(0, Math.min(BOARD_SIZE - shape[0].length, centerC));

    if (canPlace(shape, centerR, centerC)) return { r: centerR, c: centerC, valid: true };
    if (canPlace(shape, clickR, clickC)) return { r: clickR, c: clickC, valid: true };

    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            let nr = centerR + dr;
            let nc = centerC + dc;
            if (canPlace(shape, nr, nc)) {
                return { r: nr, c: nc, valid: true };
            }
        }
    }
    return { r: centerR, c: centerC, valid: false };
}

function clearPreview() {
    document.querySelectorAll('#bb-board .bb-cell').forEach(cell => {
        cell.classList.remove('preview-valid', 'preview-invalid');
    });
}

function previewPieceAtClick(clickR, clickC) {
    clearPreview();
    if (isGameEnded || selectedSlot === null || !currentPieces[selectedSlot]) return;
    const shape = currentPieces[selectedSlot];
    const anchor = findBestAnchor(shape, clickR, clickC);

    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[0].length; c++) {
            if (shape[r][c] === 1) {
                const tr = anchor.r + r;
                const tc = anchor.c + c;
                if (tr >= 0 && tc >= 0 && tr < BOARD_SIZE && tc < BOARD_SIZE) {
                    const cell = document.querySelector(`#bb-board .bb-cell[data-r="${tr}"][data-c="${tc}"]`);
                    if (cell) cell.classList.add(anchor.valid ? 'preview-valid' : 'preview-invalid');
                }
            }
        }
    }
}

function placePieceAtClick(clickR, clickC) {
    if (isGameEnded) return;
    if (selectedSlot === null || !currentPieces[selectedSlot]) return;

    const shape = currentPieces[selectedSlot];
    const anchor = findBestAnchor(shape, clickR, clickC);

    if (!anchor.valid) {
        document.getElementById('bb-status').innerText = 'Tidak muat di situ, pilih area kosong lainnya!';
        return;
    }

    document.getElementById('bb-status').innerText = '';
    let placedCount = 0;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[0].length; c++) {
            if (shape[r][c] === 1) {
                bbGrid[anchor.r + r][anchor.c + c] = 1;
                placedCount++;
            }
        }
    }

    bbScore += placedCount * 10;
    currentPieces[selectedSlot] = null;
    document.getElementById('slot-' + selectedSlot).classList.remove('selected');
    document.getElementById('slot-' + selectedSlot).classList.add('used');
    selectedSlot = null;

    renderBoard();
    checkAndClearLines();
}

function checkAndClearLines() {
    let rowsToClear = [];
    let colsToClear = [];

    for (let r = 0; r < BOARD_SIZE; r++) {
        if (bbGrid[r].every(val => val === 1)) rowsToClear.push(r);
    }

    for (let c = 0; c < BOARD_SIZE; c++) {
        let fullCol = true;
        for (let r = 0; r < BOARD_SIZE; r++) {
            if (bbGrid[r][c] === 0) { fullCol = false; break; }
        }
        if (fullCol) colsToClear.push(c);
    }

    if (rowsToClear.length === 0 && colsToClear.length === 0) {
        updateScoreUI();
        proceedNextTurn();
        return;
    }

    rowsToClear.forEach(r => {
        for (let c = 0; c < BOARD_SIZE; c++) {
            bbGrid[r][c] = 0;
            const cell = document.querySelector(`#bb-board .bb-cell[data-r="${r}"][data-c="${c}"]`);
            if (cell) cell.classList.add('blasting');
        }
    });

    colsToClear.forEach(c => {
        for (let r = 0; r < BOARD_SIZE; r++) {
            bbGrid[r][c] = 0;
            const cell = document.querySelector(`#bb-board .bb-cell[data-r="${r}"][data-c="${c}"]`);
            if (cell) cell.classList.add('blasting');
        }
    });

    const totalLines = rowsToClear.length + colsToClear.length;
    bbScore += totalLines * 100;
    updateScoreUI();
    document.getElementById('bb-status').innerText = 'BLAST! +' + (totalLines * 100) + ' Love Points!';

    setTimeout(() => {
        document.querySelectorAll('#bb-board .bb-cell.blasting').forEach(c => c.classList.remove('blasting'));
        renderBoard();
        proceedNextTurn();
    }, 350);
}

function proceedNextTurn() {
    if (bbScore >= WIN_SCORE) {
        isGameEnded = true;
        unlockGameMission('block');
        document.getElementById('bb-win-overlay').classList.add('show');
        return;
    }

    const remainingPieces = currentPieces.filter(p => p !== null);
    if (remainingPieces.length === 0) {
        spawnNewTray();
        return;
    }

    updateTrayPlayability();
    checkGameState();
}

function checkGameState() {
    if (bbScore >= WIN_SCORE) {
        isGameEnded = true;
        unlockGameMission('block');
        document.getElementById('bb-win-overlay').classList.add('show');
        return;
    }

    let anyCanFit = false;
    let firstFitIndex = -1;
    for (let i = 0; i < 3; i++) {
        if (currentPieces[i] && canPieceFitAnywhere(currentPieces[i])) {
            anyCanFit = true;
            if (firstFitIndex === -1) firstFitIndex = i;
        }
    }

    if (!anyCanFit) {
        isGameEnded = true;
        document.getElementById('bb-status').innerText = 'Game Over! Tidak ada ruang tersisa.';
        setTimeout(() => {
            document.getElementById('bb-gameover-overlay').classList.add('show');
        }, 300);
    } else {
        if (selectedSlot === null || !currentPieces[selectedSlot]) {
            selectPiece(firstFitIndex);
        }
    }
}
// =========================================================================
// 12. BOLD MART 3D: EXACT UI + DEDICATED "LONCAT" BUTTON RIGHT BETWEEN MAJU & MUNDUR
// =========================================================================
let bmPhotos = [
    { url: 'img/bareng1.jpeg',  title: 'First Picture Together', desc: 'Foto pertama kita berdua.', pack: 'pack-red' },
    { url: 'img/bareng2.jpeg',  title: 'First Date at Toha',     desc: 'First date bikin pengen ulang lagi.', pack: 'pack-yellow' },
    { isEmpty: true, slotNumber: 1, title: 'Kosong #1' },
    { url: 'img/bareng3.jpeg',  title: 'Healing to the Beach',   desc: 'Pertama kali ke Pantai bareng sayangkuu.', pack: 'pack-blue' },
    { url: 'img/bareng4.jpeg',  title: 'Shopping for My Shop',   desc: 'Belanja stok jualanku di Asia.', pack: 'pack-green' },
    { url: 'img/bareng5.jpeg',  title: "Noval's Birthday",       desc: 'Hari spesialmu sayangkuu.', pack: 'pack-yellow' },
    { url: 'img/bareng6.jpeg',  title: 'UAS Reward',             desc: 'Hadiah buat diri sendiri setelah berjuang lewati UAS.', pack: 'pack-red' },
    { url: 'img/bareng7.jpeg',  title: 'Gacoan After Work',      desc: 'Capek kerja langsung terobati pas makan Gacoan.', pack: 'pack-blue' },
    { url: 'img/bareng8.jpeg',  title: 'My Sales Helper',        desc: 'Kamu yang selalu siap bantu jualan tanpa pernah ngeluh.', pack: 'pack-green' },

    { url: 'img/bareng9.jpeg',  title: 'Our Anniversary',        desc: 'Satu tahun sama sayangkuu.', pack: 'pack-red' },
    { isEmpty: true, slotNumber: 2, title: 'Kosong #2' },
    { url: 'img/bareng10.jpeg', title: 'After Class Date',       desc: 'Habis matkul, kita lanjut date.', pack: 'pack-yellow' },
    { url: 'img/bareng11.jpeg', title: 'UKM Radio Demo',         desc: 'Halo SRTV!', pack: 'pack-blue' },
    { isEmpty: true, slotNumber: 3, title: 'Kosong #3' },
    { url: 'img/bareng12.jpeg', title: 'Us, Lately',             desc: 'Foto terbaru kitaaaa.', pack: 'pack-green' },
    { url: 'img/bareng13.jpeg', title: 'Still Us',               desc: 'Foto terbaru kitaaaa.', pack: 'pack-red' },
    { url: 'img/bareng14.jpeg', title: 'Happy Together',         desc: 'Foto terbaru kitaaaa.', pack: 'pack-yellow' },
    { url: 'img/bareng15.jpeg', title: 'Supermarket',            desc: 'Malinggg.', pack: 'pack-blue' }
];

const BM_PERSPECTIVE = 600; 
let bmCamX = 0;      
let bmCamZ = -320;   
let bmCamYaw = 0;    

let isDragging = false;
let startX = 0;
let hasMoved = false;
let walkAnimTimer = null;
let videoStream = null;
let targetEmptySlotIdx = -1;
let currentAvatar = 'bubu';

let bmCart = []; 
let previewingPhotoIdx = -1;
let selectedPolaroidTheme = 'pink';
let selectedDiySticker = 'hearts';
let customPolaroidText = 'LOVE MART · BUBU & DUDU';
let hasPrintedPolaroid = false;

const POLAROID_THEMES = {
    pink:   { name: 'Sweet Pink',    bg: '#ffc2d4', border: '#3a2314', text: '#3a2314' },
    butter: { name: 'Retro Butter',  bg: '#ffe57f', border: '#3a2314', text: '#3a2314' },
    sky:    { name: 'Sky Soda',      bg: '#bde0fe', border: '#3a2314', text: '#3a2314' },
    cream:  { name: 'Classic White', bg: '#fffdf9', border: '#3a2314', text: '#3a2314' }
};

const DIY_STICKERS_SVG = {
    none: '',
    hearts: `
        <svg viewBox="0 0 170 330" style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:5;">
            <g transform="translate(85, 10)">
                <path d="M0 0 L-14 -7 L-14 7 Z" fill="#ff4d79" stroke="#3a2314" stroke-width="2"/>
                <path d="M0 0 L14 -7 L14 7 Z" fill="#ff4d79" stroke="#3a2314" stroke-width="2"/>
                <circle cx="0" cy="0" r="4" fill="#ffd15c" stroke="#3a2314" stroke-width="2"/>
            </g>
            <path d="M 16 112 C 12 106, 4 108, 4 115 C 4 122, 16 128, 16 128 C 16 128, 28 122, 28 115 C 28 108, 20 106, 16 112 Z" fill="#ff4d79" stroke="#3a2314" stroke-width="2" transform="rotate(-15 16 118)"/>
            <path d="M 154 212 C 150 206, 142 208, 142 215 C 142 222, 154 228, 154 228 C 154 228, 166 222, 166 215 C 166 208, 158 206, 154 212 Z" fill="#ff4d79" stroke="#3a2314" stroke-width="2" transform="rotate(15 154 218)"/>
            <circle cx="152" cy="24" r="5" fill="#ffd15c" stroke="#3a2314" stroke-width="1.8"/>
            <circle cx="18" cy="295" r="5" fill="#ffd15c" stroke="#3a2314" stroke-width="1.8"/>
        </svg>
    `,
    stars: `
        <svg viewBox="0 0 170 330" style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:5;">
            <polygon points="18,6 21,14 29,14 23,19 25,27 18,22 11,27 13,19 7,14 15,14" fill="#ffd15c" stroke="#3a2314" stroke-width="2" stroke-linejoin="round"/>
            <polygon points="154,104 157,112 165,112 159,117 161,125 154,120 147,125 149,117 143,112 151,112" fill="#ffd15c" stroke="#3a2314" stroke-width="2" stroke-linejoin="round"/>
            <path d="M 16 205 Q 16 217 4 217 Q 16 217 16 229 Q 16 217 28 217 Q 16 217 16 205 Z" fill="#ffffff" stroke="#3a2314" stroke-width="2"/>
            <polygon points="152,285 154,291 160,291 155,295 157,301 152,297 147,301 149,295 144,291 150,291" fill="#ff8da1" stroke="#3a2314" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>
    `,
    paws: `
        <svg viewBox="0 0 170 330" style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:5;">
            <g transform="translate(6, 4) scale(0.75)">
                <circle cx="6" cy="7" r="4.5" fill="#3b2314"/><circle cx="26" cy="7" r="4.5" fill="#3b2314"/>
                <ellipse cx="16" cy="16" rx="12" ry="10" fill="#ffffff" stroke="#3a2314" stroke-width="2.5"/>
                <circle cx="11.5" cy="15.5" r="1.8" fill="#3b2314"/><circle cx="20.5" cy="15.5" r="1.8" fill="#3b2314"/>
            </g>
            <g transform="translate(140, 102) scale(0.75)">
                <circle cx="6" cy="7" r="4.5" fill="#b88458" stroke="#3a2314" stroke-width="2"/><circle cx="26" cy="7" r="4.5" fill="#b88458" stroke="#3a2314" stroke-width="2"/>
                <ellipse cx="16" cy="16" rx="12" ry="10" fill="#b88458" stroke="#3a2314" stroke-width="2.5"/>
                <circle cx="11.5" cy="15.5" r="1.8" fill="#3b2314"/><circle cx="20.5" cy="15.5" r="1.8" fill="#3b2314"/>
            </g>
            <g transform="translate(16, 212) rotate(-18)">
                <circle cx="0" cy="2" r="5.5" fill="#ffffff" stroke="#3a2314" stroke-width="2"/>
                <circle cx="-5" cy="-5" r="2.2" fill="#3a2314"/><circle cx="0" cy="-7" r="2.2" fill="#3a2314"/><circle cx="5" cy="-5" r="2.2" fill="#3a2314"/>
            </g>
        </svg>
    `
};

const SVG_ICON_CAMERA = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2b1e16" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="display:block; margin:2px auto; pointer-events:none;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="#ffd15c"/><circle cx="12" cy="13" r="4" fill="#ffffff"/></svg>`;
const SVG_ICON_CART = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#2b1e16" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px; margin-right:3px; pointer-events:none;"><circle cx="9" cy="21" r="1.5" fill="#2b1e16"/><circle cx="20" cy="21" r="1.5" fill="#2b1e16"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" fill="#ffd15c"/></svg>`;
const SVG_ICON_RESET = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#2b1e16" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px; pointer-events:none;"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`;
const SVG_MINI_BUBU = `<svg viewBox="0 0 32 30" width="16" height="15" style="vertical-align:-2px; margin-right:4px; pointer-events:none;"><circle cx="6" cy="7" r="4.5" fill="#3b2314"/><circle cx="26" cy="7" r="4.5" fill="#3b2314"/><ellipse cx="16" cy="16" rx="12" ry="10" fill="#ffffff" stroke="#3a2314" stroke-width="2.5"/><circle cx="11.5" cy="15.5" r="1.8" fill="#3b2314"/><circle cx="20.5" cy="15.5" r="1.8" fill="#3b2314"/><ellipse cx="8" cy="18" rx="2.5" ry="1.6" fill="#ff8da1"/><ellipse cx="24" cy="18" rx="2.5" ry="1.6" fill="#ff8da1"/></svg>`;
const SVG_MINI_DUDU = `<svg viewBox="0 0 32 30" width="16" height="15" style="vertical-align:-2px; margin-right:4px; pointer-events:none;"><circle cx="6" cy="7" r="4.5" fill="#b88458" stroke="#3a2314" stroke-width="2"/><circle cx="26" cy="7" r="4.5" fill="#b88458" stroke="#3a2314" stroke-width="2"/><ellipse cx="16" cy="16" rx="12" ry="10" fill="#b88458" stroke="#3a2314" stroke-width="2.5"/><circle cx="11.5" cy="15.5" r="1.8" fill="#3b2314"/><circle cx="20.5" cy="15.5" r="1.8" fill="#3b2314"/><ellipse cx="8" cy="18" rx="2.5" ry="1.6" fill="#f08070"/><ellipse cx="24" cy="18" rx="2.5" ry="1.6" fill="#f08070"/></svg>`;

function initAuthenticStylesAndAvatars() {
    ['bm-true3d-styles', 'bm-master-css', 'bm-anticlip-fix', 'bm-pov-walk-css'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });

    const style = document.createElement('style');
    style.id = 'bm-pov-walk-css';
    style.innerHTML = `
        #bm-viewport, #bm-viewport * {
            user-select: none !important;
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            cursor: pointer;
        }
        #bm-viewport input[type="text"] {
            user-select: text !important;
            -webkit-user-select: text !important;
            cursor: text !important;
        }

        #bm-viewport {
            perspective: ${BM_PERSPECTIVE}px !important;
            overflow: hidden !important;
            font-family: 'Fredoka', 'Comic Sans MS', system-ui, -apple-system, sans-serif !important;
        }
        #bm-scene {
            transform-style: preserve-3d !important;
            transition: transform 0.08s ease-out !important;
        }
        #bm-world {
            transform-style: preserve-3d !important;
            transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1) !important;
        }

        #bm-tab-end,
        #bm-tab-checkout,
        button[onclick*="bmSetCameraPreset('end')"],
        button[onclick*="bmSetCameraPreset('checkout')"],
        #bm-product-modal,
        #roblox-nametag,
        .roblox-nametag,
        .bm-char-nametag {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }

        .bm-3d-wall-side {
            pointer-events: none !important;
        }
        #bm-left-shelf, #bm-right-shelf {
            pointer-events: auto !important;
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            grid-template-rows: repeat(3, 1fr) !important;
            width: 100% !important;
            height: calc(100% - 48px) !important;
            margin: 0 !important;
            padding: 0 !important;
            gap: 0 !important;
            place-items: center !important;
            align-items: center !important;
            justify-items: center !important;
            box-sizing: border-box !important;
            z-index: 25 !important;
        }

        .bm-product-box {
            width: 78% !important;
            height: 80% !important;
            max-width: 132px !important;
            max-height: 122px !important;
            margin: auto !important;
            padding: 6px 6px 5px 6px !important;
            background: #ffffff !important;
            border: 3px solid #2b1e16 !important;
            border-radius: 14px !important;
            box-shadow: 0 4px 0 #2b1e16 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: space-between !important;
            position: relative !important;
            transform: none !important;
            box-sizing: border-box !important;
            cursor: pointer !important;
            pointer-events: auto !important;
            z-index: 30 !important;
            transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease !important;
        }
        .bm-product-box:hover {
            transform: scale(1.04) !important;
            background: #fffdf7 !important;
        }
        .bm-product-box.in-cart {
            border: 3.5px solid #ff3b6b !important;
            background: #fff0f5 !important;
            box-shadow: 0 4px 0 #ff3b6b !important;
        }
        .bm-product-box img {
            width: 100% !important;
            height: 74% !important;
            object-fit: cover !important;
            border-radius: 9px !important;
            border: 2px solid #2b1e16 !important;
            display: block !important;
            pointer-events: none !important;
        }
        .bm-product-box.empty-slot {
            background: repeating-linear-gradient(-45deg, #fff5f7, #fff5f7 7px, #ffe3ec 7px, #ffe3ec 14px) !important;
            border: 2.5px dashed #d92b2b !important;
            justify-content: center !important;
            gap: 3px !important;
        }
        .bm-price-tag {
            position: absolute !important;
            top: 4px !important;
            right: 5px !important;
            background: #ffd15c !important;
            color: #2b1e16 !important;
            font-size: 10px !important;
            font-weight: 900 !important;
            padding: 1px 6px !important;
            border-radius: 999px !important;
            border: 1.8px solid #2b1e16 !important;
            line-height: 1.2 !important;
            z-index: 2 !important;
            pointer-events: none !important;
        }
        .bm-product-box.in-cart .bm-price-tag {
            background: #ff3b6b !important;
            color: #ffffff !important;
            border-color: #2b1e16 !important;
        }
        .bm-pack-label {
            font-size: 11px !important;
            font-weight: 900 !important;
            color: #2b1e16 !important;
            text-align: center !important;
            width: 100% !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            line-height: 1.1 !important;
            pointer-events: none !important;
        }

        #roblox-rig {
            position: absolute !important;
            bottom: 92px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: 35 !important;
            pointer-events: none !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
        }

        .bm-char-shadow {
            width: 86px;
            height: 16px;
            background: radial-gradient(ellipse at center, rgba(43, 30, 22, 0.42) 0%, rgba(43, 30, 22, 0) 72%);
            border-radius: 50%;
            margin-top: -9px;
        }

        .bm-exact-svg {
            width: 132px;
            height: 134px;
            overflow: visible;
            animation: bmIdleBob 2.2s ease-in-out infinite;
        }

        /* ANIMASI LOMPAT KARAKTER DI TENGAH */
        @keyframes bmJumpAnim {
            0%, 100% { transform: translateY(0) scale(1, 1); }
            30% { transform: translateY(-32px) scale(0.92, 1.08); }
            50% { transform: translateY(-40px) scale(1.05, 0.95); }
            70% { transform: translateY(-14px) scale(0.96, 1.04); }
        }
        .bm-jump-action {
            animation: bmJumpAnim 0.45s cubic-bezier(0.28, 0.84, 0.42, 1) !important;
        }

        /* STYLING TOMBOL "Loncat" DI BAWAH (PERSIS SEPERTI TOMBOL LAINNYA) */
        .bm-btn-loncat {
            background: #ffd15c !important;
            color: #2b1e16 !important;
            font-family: inherit !important;
            font-size: 11px !important;
            font-weight: 900 !important;
            border: 2.5px solid #2b1e16 !important;
            border-radius: 999px !important;
            padding: 6px 12px !important;
            box-shadow: 0 3px 0 #2b1e16 !important;
            cursor: pointer !important;
            outline: none !important;
            transition: transform 0.1s ease !important;
            white-space: nowrap !important;
        }
        .bm-btn-loncat:active {
            transform: translateY(2px);
            box-shadow: 0 1px 0 #2b1e16 !important;
        }

        #bm-held-polaroid {
            position: absolute;
            right: -34px;
            top: 40px;
            width: 44px;
            padding: 3px 3px 7px 3px;
            background: #ffc2d4;
            border: 2.5px solid #3a2314;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.28);
            transform: rotate(12deg);
            transform-origin: bottom left;
            z-index: 40;
            display: none;
            flex-direction: column;
            gap: 2.5px;
            pointer-events: auto !important;
            cursor: pointer;
            animation: bmHeldFloat 2.2s ease-in-out infinite;
        }
        #bm-held-polaroid.show { display: flex !important; }
        #bm-held-polaroid:hover { transform: rotate(4deg) scale(1.12); }
        #bm-held-polaroid img {
            width: 100%;
            height: 23px;
            object-fit: cover;
            border: 1.2px solid #3a2314;
            border-radius: 2px;
            display: block;
            background: #fff;
            pointer-events: none;
        }
        #bm-held-polaroid .bm-held-caption {
            font-size: 5px !important;
            font-weight: 900 !important;
            text-align: center;
            color: #3a2314;
            letter-spacing: 0.2px;
            margin-top: 1px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            pointer-events: none;
        }
        #bm-held-badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background: #ffd15c;
            color: #2b1e16;
            border: 1.5px solid #2b1e16;
            font-size: 7.5px !important;
            font-weight: 900 !important;
            padding: 1px 4px;
            border-radius: 999px;
            white-space: nowrap;
            z-index: 6;
            pointer-events: none;
        }

        @keyframes bmHeldFloat {
            0%, 100% { transform: rotate(12deg) translateY(0px); }
            50% { transform: rotate(15deg) translateY(-3px); }
        }
        #roblox-rig.walking #bm-held-polaroid {
            animation: bmHeldWalk 0.25s ease-in-out infinite alternate !important;
        }
        @keyframes bmHeldWalk {
            0% { transform: rotate(6deg) translateY(-6px); }
            100% { transform: rotate(18deg) translateY(2px); }
        }

        #bm-cart-bar {
            position: absolute;
            bottom: 48px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 45;
            background: #fffdf7;
            border: 2.8px solid #2b1e16;
            border-radius: 999px;
            padding: 5px 10px;
            box-shadow: 0 4px 0 #2b1e16;
            display: flex;
            align-items: center;
            gap: 7px;
            pointer-events: auto;
            white-space: nowrap;
        }
        .bm-cart-slots { display: flex; gap: 4px; }
        .bm-cart-slot {
            width: 26px;
            height: 26px;
            border-radius: 6px;
            border: 2px dashed #b89f80;
            background: #f5ebd6;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px !important;
            font-weight: 900 !important;
            color: #8c7355;
            overflow: hidden;
            cursor: pointer;
        }
        .bm-cart-slot.filled { border: 2px solid #2b1e16; background: #fff; }
        .bm-cart-slot img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
        #bm-btn-reset-cart {
            background: #ffe57f;
            color: #2b1e16;
            border: 2px solid #2b1e16;
            border-radius: 999px;
            padding: 4px 8px;
            font-size: 11px !important;
            font-weight: 900 !important;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 3px;
            box-shadow: 0 2px 0 #2b1e16;
        }
        #bm-btn-reset-cart:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        #bm-btn-open-polaroid {
            background: #ff3b6b;
            color: #ffffff;
            border: 2px solid #2b1e16;
            border-radius: 999px;
            padding: 5px 11px;
            font-size: 11px !important;
            font-weight: 900 !important;
            cursor: pointer;
            box-shadow: 0 2px 0 #2b1e16;
        }
        #bm-btn-open-polaroid:disabled { background: #e2d2b5; color: #7a6855; cursor: not-allowed; box-shadow: none; }

        #bm-photo-detail-modal,
        #bm-polaroid-modal {
            position: absolute;
            inset: 0;
            background: rgba(28, 18, 12, 0.72);
            backdrop-filter: blur(3px);
            z-index: 80;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 14px;
            pointer-events: auto;
        }
        #bm-photo-detail-modal.open,
        #bm-polaroid-modal.open { display: flex !important; }

        .bm-modal-card {
            width: 100%;
            max-width: 310px;
            background: #fffdf7;
            border: 3.5px solid #2b1e16;
            border-radius: 22px;
            box-shadow: 0 8px 0 #2b1e16;
            padding: 14px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            position: relative;
        }
        .bm-detail-img-wrap {
            width: 100%;
            height: 200px;
            border-radius: 12px;
            border: 3px solid #2b1e16;
            overflow: hidden;
            background: #f5ebd6;
        }
        .bm-detail-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }
        
        .bm-detail-badge {
            font-size: 11.5px !important;
            font-weight: 900 !important;
            color: #d92b2b !important;
            background: #ffd15c !important;
            padding: 3px 10px !important;
            border-radius: 999px !important;
            border: 2px solid #2b1e16 !important;
            letter-spacing: 0.5px;
        }
        .bm-detail-title {
            font-size: 18px !important;
            font-weight: 900 !important;
            color: #2b1e16 !important;
            margin: 0 !important;
            text-align: center !important;
            letter-spacing: 0.3px;
        }
        .bm-detail-desc {
            font-size: 13px !important;
            font-weight: 900 !important;
            color: #3a2314 !important;
            text-align: center !important;
            line-height: 1.4 !important;
            margin: 0 !important;
        }
        .bm-detail-btn {
            width: 100%;
            padding: 10px 12px;
            border-radius: 12px;
            border: 2.5px solid #2b1e16;
            font-size: 12.5px !important;
            font-weight: 900 !important;
            cursor: pointer;
            box-shadow: 0 3px 0 #2b1e16;
            background: #ff3b6b;
            color: #ffffff;
            letter-spacing: 0.3px;
        }
        .bm-detail-btn.remove { background: #ffe57f; color: #2b1e16; }

        /* STUDIO DIY POLAROID */
        .bm-pol-dialog {
            width: 100%;
            max-width: 345px;
            background: #fdf6e6;
            border: 3.5px solid #2b1e16;
            border-radius: 22px;
            box-shadow: 0 8px 0 #2b1e16;
            padding: 16px 16px 14px 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            max-height: 96%;
            overflow-y: auto;
            box-sizing: border-box;
            margin-top: 24px;
        }
        .bm-pol-header {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px dashed #b89f80;
            padding-bottom: 6px;
            margin-bottom: 2px;
        }
        .bm-pol-title {
            font-size: 13px !important;
            font-weight: 900 !important;
            color: #2b1e16 !important;
            letter-spacing: 0.3px;
            text-align: center;
            flex: 1;
        }
        .bm-pol-close {
            width: 26px; height: 26px; border-radius: 50%;
            background: #d92b2b; color: #fff; border: 2px solid #2b1e16;
            font-weight: 900; cursor: pointer; line-height: 1;
            flex-shrink: 0;
        }

        #bm-polaroid-strip-preview {
            width: 152px;
            padding: 8px 8px 12px 8px;
            background: #ffc2d4;
            border: 3px solid #3a2314;
            border-radius: 10px;
            box-shadow: 0 5px 12px rgba(0,0,0,0.18);
            display: flex;
            flex-direction: column;
            gap: 5px;
            position: relative;
            transition: background 0.2s ease;
        }
        .bm-pol-grid-item {
            width: 100%; height: 78px; background: #ffffff;
            border: 2.2px solid #3a2314; border-radius: 4px; overflow: hidden; position: relative;
        }
        .bm-pol-grid-item img { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }
        .bm-pol-strip-footer {
            text-align: center;
            font-size: 9.5px !important;
            font-weight: 900 !important;
            color: #3a2314 !important;
            letter-spacing: 0.5px;
            margin-top: 2px;
            z-index: 6;
            word-break: break-word;
        }

        .bm-diy-section {
            width: 100%; display: flex; flex-direction: column; gap: 5px;
            background: #fffdf7; border: 2px solid #2b1e16; border-radius: 12px; padding: 7px 9px; box-sizing: border-box;
        }
        .bm-diy-label { font-size: 11px !important; font-weight: 900 !important; color: #2b1e16 !important; }
        .bm-theme-picker { display: flex; gap: 5px; flex-wrap: wrap; }
        .bm-theme-btn, .bm-sticker-btn {
            padding: 4px 8px; border-radius: 999px; border: 1.8px solid #2b1e16;
            font-size: 11px !important; font-weight: 900 !important; cursor: pointer; color: #2b1e16; background: #fff;
        }
        .bm-theme-btn.active, .bm-sticker-btn.active { box-shadow: 0 2px 0 #2b1e16; background: #ffd15c; transform: translateY(-1px); }
        #bm-diy-text-input {
            width: 100%; padding: 6px 9px; border: 2px solid #2b1e16; border-radius: 8px;
            font-size: 12px !important; font-weight: 900 !important; color: #2b1e16 !important; box-sizing: border-box; outline: none; background: #fff;
        }

        .bm-pol-actions { display: flex; gap: 8px; width: 100%; }
        .bm-pol-btn {
            flex: 1; padding: 9px 10px; border-radius: 12px; border: 2.5px solid #2b1e16;
            font-size: 12px !important; font-weight: 900 !important; cursor: pointer; box-shadow: 0 3px 0 #2b1e16; text-align: center;
        }
        .bm-pol-btn-carry { background: #7db856; color: #ffffff; }
        .bm-pol-btn-dl { background: #ffd15c; color: #2b1e16; }

        @keyframes bmIdleBob {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-2px); }
        }
        #roblox-rig.walking .bm-exact-svg { animation: bmBodyWalk 0.25s ease-in-out infinite !important; }
        #roblox-rig.walking .bm-foot-l { animation: bmFootLeft 0.25s ease-in-out infinite alternate !important; }
        #roblox-rig.walking .bm-foot-r { animation: bmFootRight 0.25s ease-in-out infinite alternate !important; }
        #roblox-rig.walking .bm-hand-l { animation: bmHandLeft 0.25s ease-in-out infinite alternate !important; }
        #roblox-rig.walking .bm-hand-r { animation: bmHandRight 0.25s ease-in-out infinite alternate !important; }
        #roblox-rig.walking .bm-char-shadow { animation: bmShadowStep 0.25s ease-in-out infinite !important; }

        @keyframes bmBodyWalk {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-6px) rotate(-2.5deg); }
            50% { transform: translateY(0px) rotate(0deg); }
            75% { transform: translateY(-6px) rotate(3deg); }
        }
        @keyframes bmFootLeft {
            0% { transform: translateY(0px) rotate(10deg); }
            100% { transform: translateY(-9px) rotate(-12deg); }
        }
        @keyframes bmFootRight {
            0% { transform: translateY(-9px) rotate(12deg); }
            100% { transform: translateY(0px) rotate(-10deg); }
        }
        @keyframes bmHandLeft {
            0% { transform: rotate(-12deg) translateY(1px); }
            100% { transform: rotate(14deg) translateY(-2px); }
        }
        @keyframes bmHandRight {
            0% { transform: rotate(-14deg) translateY(-2px); }
            100% { transform: rotate(16deg) translateY(1px); }
        }
        @keyframes bmShadowStep {
            0%, 50%, 100% { transform: scale(1); opacity: 0.9; }
            25%, 75% { transform: scale(0.84); opacity: 0.6; }
        }
    `;
    document.head.appendChild(style);

    const btnBubu = document.getElementById('btn-char-bubu');
    const btnDudu = document.getElementById('btn-char-dudu');
    if (btnBubu) btnBubu.innerHTML = `${SVG_MINI_BUBU}<span>Bubu (Sania)</span>`;
    if (btnDudu) btnDudu.innerHTML = `${SVG_MINI_DUDU}<span>Dudu (Noval)</span>`;

    const viewport = document.getElementById('bm-viewport');
    if (viewport) {
        viewport.querySelectorAll('#roblox-nametag, .roblox-nametag, .bm-char-nametag').forEach(el => el.remove());
        viewport.querySelectorAll('#bm-cart-bar, #bm-polaroid-modal, #bm-photo-detail-modal, #bm-custom-jump-btn').forEach(el => el.remove());
    }

    const leftShelf = document.getElementById('bm-left-shelf');
    const rightShelf = document.getElementById('bm-right-shelf');
    if (leftShelf && leftShelf.parentElement) {
        leftShelf.parentElement.style.backfaceVisibility = 'hidden';
        leftShelf.parentElement.style.webkitBackfaceVisibility = 'hidden';
    }
    if (rightShelf && rightShelf.parentElement) {
        rightShelf.parentElement.style.backfaceVisibility = 'hidden';
        rightShelf.parentElement.style.webkitBackfaceVisibility = 'hidden';
    }

    const rig = document.getElementById('roblox-rig');
    if (rig && !document.getElementById('bm-held-polaroid')) {
        rig.innerHTML = `
            <!-- BUBU (PANDA PUTIH ASLI DUDUSBUBUSWORLD) -->
            <svg id="svg-char-bubu" class="bm-exact-svg" viewBox="0 0 160 155" style="display:block;">
                <g class="bm-foot-l" style="transform-origin: 62px 124px;">
                    <path d="M 50 120 C 48 134, 50 143, 60 143 C 70 143, 71 134, 69 120 Z" fill="#ffffff" stroke="#3a2314" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <g class="bm-foot-r" style="transform-origin: 98px 124px;">
                    <path d="M 91 120 C 89 134, 90 143, 100 143 C 110 143, 112 134, 110 120 Z" fill="#ffffff" stroke="#3a2314" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <path d="M 49 95 C 45 110, 48 131, 80 131 C 112 131, 115 110, 111 95 Z" fill="#ffffff" stroke="#3a2314" stroke-width="4.6" stroke-linejoin="round"/>
                <g class="bm-hand-l" style="transform-origin: 50px 100px;">
                    <path d="M 50 96 C 35 98, 28 105, 31 112 C 34 118, 44 115, 51 107 Z" fill="#ffffff" stroke="#3a2314" stroke-width="4.6" stroke-linejoin="round"/>
                </g>
                <g class="bm-hand-r" style="transform-origin: 110px 100px;">
                    <path d="M 110 96 C 125 98, 132 105, 129 112 C 126 118, 116 115, 109 107 Z" fill="#ffffff" stroke="#3a2314" stroke-width="4.6" stroke-linejoin="round"/>
                </g>
                <path d="M 65 98 C 62 106, 71 109, 80 103 C 89 109, 98 106, 95 98 Z" fill="#3a2314"/>
                <ellipse cx="35" cy="31" rx="14.5" ry="12.5" transform="rotate(-24 35 31)" fill="#3a2314"/>
                <ellipse cx="125" cy="31" rx="14.5" ry="12.5" transform="rotate(24 125 31)" fill="#3a2314"/>
                <path d="M 80 17 C 35 17, 13 42, 13 71 C 13 94, 36 101, 80 101 C 124 101, 147 94, 147 71 C 147 42, 125 17, 80 17 Z" fill="#ffffff" stroke="#3a2314" stroke-width="4.8" stroke-linejoin="round"/>
                <ellipse cx="33" cy="77" rx="11.5" ry="8.5" fill="#ff94a8"/>
                <ellipse cx="127" cy="77" rx="11.5" ry="8.5" fill="#ff94a8"/>
                <circle cx="57" cy="67" r="5.6" fill="#3a2314"/>
                <circle cx="103" cy="67" r="5.6" fill="#3a2314"/>
                <path d="M 73 65 Q 76.5 69 80 65 Q 83.5 69 87 65" fill="none" stroke="#3a2314" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M 75 67 C 75 77, 85 77, 85 67 Z" fill="#ff758f" stroke="#3a2314" stroke-width="3.5" stroke-linejoin="round"/>
            </svg>

            <!-- DUDU (BERUANG COKELAT ASLI DUDUSBUBUSWORLD) -->
            <svg id="svg-char-dudu" class="bm-exact-svg" viewBox="0 0 160 155" style="display:none;">
                <g class="bm-foot-l" style="transform-origin: 62px 124px;">
                    <path d="M 50 120 C 48 134, 50 143, 60 143 C 70 143, 71 134, 69 120 Z" fill="#b88458" stroke="#3a2314" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <g class="bm-foot-r" style="transform-origin: 98px 124px;">
                    <path d="M 91 120 C 89 134, 90 143, 100 143 C 110 143, 112 134, 110 120 Z" fill="#b88458" stroke="#3a2314" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <path d="M 49 95 C 45 110, 48 131, 80 131 C 112 131, 115 110, 111 95 Z" fill="#b88458" stroke="#3a2314" stroke-width="4.6" stroke-linejoin="round"/>
                <g class="bm-hand-l" style="transform-origin: 50px 100px;">
                    <path d="M 50 96 C 35 98, 28 105, 31 112 C 34 118, 44 115, 51 107 Z" fill="#b88458" stroke="#3a2314" stroke-width="4.6" stroke-linejoin="round"/>
                </g>
                <g class="bm-hand-r" style="transform-origin: 110px 100px;">
                    <path d="M 110 96 C 125 98, 132 105, 129 112 C 126 118, 116 115, 109 107 Z" fill="#b88458" stroke="#3a2314" stroke-width="4.6" stroke-linejoin="round"/>
                </g>
                <circle cx="35" cy="31" r="14" fill="#b88458" stroke="#3a2314" stroke-width="4.6"/>
                <circle cx="35" cy="31" r="7.5" fill="#4a2c18"/>
                <circle cx="125" cy="31" r="14" fill="#b88458" stroke="#3a2314" stroke-width="4.6"/>
                <circle cx="125" cy="31" r="7.5" fill="#4a2c18"/>
                <path d="M 80 17 C 35 17, 13 42, 13 71 C 13 94, 36 101, 80 101 C 124 101, 147 94, 147 71 C 147 42, 125 17, 80 17 Z" fill="#b88458" stroke="#3a2314" stroke-width="4.8" stroke-linejoin="round"/>
                <ellipse cx="33" cy="77" rx="11.5" ry="8.5" fill="#f28472"/>
                <ellipse cx="127" cy="77" rx="11.5" ry="8.5" fill="#f28472"/>
                <circle cx="57" cy="67" r="5.6" fill="#3a2314"/>
                <circle cx="103" cy="67" r="5.6" fill="#3a2314"/>
                <path d="M 73 65 Q 76.5 69 80 65 Q 83.5 69 87 65" fill="none" stroke="#3a2314" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M 75 67 C 75 77, 85 77, 85 67 Z" fill="#ff758f" stroke="#3a2314" stroke-width="3.5" stroke-linejoin="round"/>
            </svg>

            <!-- CETAKAN POLAROID DI TANGAN -->
            <div id="bm-held-polaroid" onclick="openPolaroidStudioModal()" title="Klik untuk edit / lihat Polaroid">
                <span id="bm-held-badge">CETAK 3</span>
                <div id="bm-held-stickers"></div>
                <div id="bm-held-photos" style="display:flex; flex-direction:column; gap:2.5px;"></div>
                <div id="bm-held-caption" class="bm-held-caption">LOVE MART</div>
            </div>

            <div class="bm-char-shadow"></div>
        `;
    }

    if (viewport) {
        // Bar Keranjang di bawah
        const cartBar = document.createElement('div');
        cartBar.id = 'bm-cart-bar';
        cartBar.innerHTML = `
            <div style="font-size:11px; font-weight:900; color:#2b1e16;">
                ${SVG_ICON_CART}<span id="bm-cart-count">0/3</span>
            </div>
            <div id="bm-cart-slots" class="bm-cart-slots"></div>
            <button id="bm-btn-reset-cart" onclick="resetPolaroidCart()" title="Kosongkan Keranjang" disabled>
                ${SVG_ICON_RESET}<span>Reset</span>
            </button>
            <button id="bm-btn-open-polaroid" onclick="openPolaroidStudioModal()" disabled>Cetak (0/3)</button>
        `;
        viewport.appendChild(cartBar);

        // SISIPKAN TOMBOL "Loncat" TEPAT DI TENGAH (DI ANTARA TOMBOL "Maju" DAN "Mundur") DI PANEL BAWAH
        const bottomNav = viewport.querySelector('div[style*="position: absolute; bottom"]') || viewport.querySelector('.bm-bottom-controls');
        if (bottomNav && !document.getElementById('bm-custom-jump-btn')) {
            const jumpBtn = document.createElement('button');
            jumpBtn.id = 'bm-custom-jump-btn';
            jumpBtn.className = 'bm-btn-loncat';
            jumpBtn.innerText = 'Loncat';
            jumpBtn.onclick = () => triggerCharacterJump();

            // Cari tombol Mundur untuk menyisipkan tombol Loncat tepat di tengah-tengah antara Maju & Mundur
            const majuBtn = bottomNav.querySelector('button[onclick*="1"]') || bottomNav.children[1];
            if (majuBtn && majuBtn.nextSibling) {
                bottomNav.insertBefore(jumpBtn, majuBtn.nextSibling);
            } else {
                bottomNav.appendChild(jumpBtn);
            }
        }

        const detailModal = document.createElement('div');
        detailModal.id = 'bm-photo-detail-modal';
        detailModal.innerHTML = `
            <div class="bm-modal-card">
                <div class="bm-pol-header">
                    <span id="bm-prev-badge" class="bm-detail-badge">ITEM #1</span>
                    <button class="bm-pol-close" onclick="closePhotoDetailModal()">×</button>
                </div>
                <div class="bm-detail-img-wrap">
                    <img id="bm-prev-img" src="" onerror="this.src='img/bubu1.jpeg'">
                </div>
                <h4 id="bm-prev-title" class="bm-detail-title">Judul Foto</h4>
                <p id="bm-prev-desc" class="bm-detail-desc">Keterangan momen spesial di Love Mart.</p>
                <button id="bm-prev-cart-btn" class="bm-detail-btn" onclick="togglePreviewPhotoInCart()">
                    + Masukkan ke Keranjang Polaroid (0/3)
                </button>
            </div>
        `;
        viewport.appendChild(detailModal);

        const polModal = document.createElement('div');
        polModal.id = 'bm-polaroid-modal';
        polModal.innerHTML = `
            <div class="bm-pol-dialog">
                <div class="bm-pol-header">
                    <span class="bm-pol-title">DIY POLAROID GRID 3 STUDIO</span>
                    <button class="bm-pol-close" onclick="closePolaroidStudioModal()">×</button>
                </div>

                <div id="bm-polaroid-strip-preview">
                    <div id="bm-pol-sticker-layer"></div>
                    <div id="bm-pol-slot-0" class="bm-pol-grid-item"></div>
                    <div id="bm-pol-slot-1" class="bm-pol-grid-item"></div>
                    <div id="bm-pol-slot-2" class="bm-pol-grid-item"></div>
                    <div id="bm-pol-footer-text" class="bm-pol-strip-footer">LOVE MART · BUBU & DUDU</div>
                </div>

                <div class="bm-diy-section">
                    <span class="bm-diy-label">1. Pilih Warna Frame:</span>
                    <div class="bm-theme-picker" id="bm-theme-picker">
                        <button class="bm-theme-btn active" style="background:#ffc2d4;" onclick="selectPolaroidTheme('pink')">Pink</button>
                        <button class="bm-theme-btn" style="background:#ffe57f;" onclick="selectPolaroidTheme('butter')">Butter</button>
                        <button class="bm-theme-btn" style="background:#bde0fe;" onclick="selectPolaroidTheme('sky')">Sky</button>
                        <button class="bm-theme-btn" style="background:#fffdf9;" onclick="selectPolaroidTheme('cream')">White</button>
                    </div>

                    <span class="bm-diy-label" style="margin-top:2px;">2. Tambah Elemen Dekorasi DIY:</span>
                    <div class="bm-theme-picker" id="bm-sticker-picker">
                        <button class="bm-sticker-btn active" onclick="selectDiySticker('hearts')">Pita & Hati</button>
                        <button class="bm-sticker-btn" onclick="selectDiySticker('stars')">Bintang</button>
                        <button class="bm-sticker-btn" onclick="selectDiySticker('paws')">Bubu & Dudu</button>
                        <button class="bm-sticker-btn" onclick="selectDiySticker('none')">Polos</button>
                    </div>

                    <span class="bm-diy-label" style="margin-top:2px;">3. Tulis Teks / Caption DIY:</span>
                    <input id="bm-diy-text-input" type="text" maxlength="28" value="LOVE MART · BUBU & DUDU" placeholder="Ketik teks polaroid..." oninput="updateDiyCaptionText(this.value)">
                </div>

                <div class="bm-pol-actions">
                    <button class="bm-pol-btn bm-pol-btn-dl" onclick="downloadPolaroidStrip()">Simpan PNG</button>
                    <button class="bm-pol-btn bm-pol-btn-carry" onclick="confirmCarryPolaroid()">Bawa Polaroid</button>
                </div>
            </div>
        `;
        viewport.appendChild(polModal);
    }
}

// Tambahkan keyframes efek tuing-tuing di style secara otomatis jika belum ada
if (!document.getElementById('bm-tuing-style')) {
    const tuingStyle = document.createElement('style');
    tuingStyle.id = 'bm-tuing-style';
    tuingStyle.innerHTML = `
        @keyframes tuingJump {
            0% { transform: translateY(0px) scale(1, 1); }
            30% { transform: translateY(-55px) scale(0.82, 1.22); }  /* Melompat ke atas sambil memanjang */
            50% { transform: translateY(-62px) scale(1.12, 0.88); }  /* Titik puncak membal */
            70% { transform: translateY(-15px) scale(0.92, 1.08); }  /* Mendarat awal membal */
            85% { transform: translateY(0px) scale(1.18, 0.82); }   /* Efek injak tanah / squash kenyal */
            100% { transform: translateY(0px) scale(1, 1); }         /* Kembali normal */
        }
    `;
    document.head.appendChild(tuingStyle);
}
function triggerCharacterJump() {
    const activeSvg = currentAvatar === 'bubu' ? document.getElementById('svg-char-bubu') : document.getElementById('svg-char-dudu');
    const targetSvg = activeSvg || document.querySelector('.bm-exact-svg');
    const heldPolaroid = document.getElementById('bm-held-polaroid');
    
    if (!targetSvg) return;

    // Reset animasi karakter
    targetSvg.style.animation = 'none';
    if (heldPolaroid) heldPolaroid.classList.remove('jump-active');
    
    void targetSvg.offsetWidth; // Trigger reflow

    // Jalankan animasi lompat di karakter DAN Polaroid secara bersamaan
    targetSvg.style.animation = 'tuingJump 0.55s cubic-bezier(0.28, 0.84, 0.42, 1.25) forwards';
    if (heldPolaroid) heldPolaroid.classList.add('jump-active');

    setTimeout(() => {
        targetSvg.style.animation = 'bmIdleBob 2.2s ease-in-out infinite';
        if (heldPolaroid) heldPolaroid.classList.remove('jump-active');
    }, 550);
}
function switchRobloxAvatar(charName) {
    currentAvatar = charName;
    const svgBubu = document.getElementById('svg-char-bubu');
    const svgDudu = document.getElementById('svg-char-dudu');
    
    const btnBubu = document.getElementById('btn-char-bubu');
    const btnDudu = document.getElementById('btn-char-dudu');
    if (btnBubu) btnBubu.classList.toggle('active', charName === 'bubu');
    if (btnDudu) btnDudu.classList.toggle('active', charName === 'dudu');

    if (svgBubu && svgDudu) {
        svgBubu.style.display = charName === 'bubu' ? 'block' : 'none';
        svgDudu.style.display = charName === 'dudu' ? 'block' : 'none';
    }
}

function renderGallery() {
    initAuthenticStylesAndAvatars();

    const leftShelf = document.getElementById('bm-left-shelf');
    const rightShelf = document.getElementById('bm-right-shelf');
    if (!leftShelf || !rightShelf) return;

    leftShelf.innerHTML = '';
    rightShelf.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        leftShelf.appendChild(createCard(bmPhotos[i], i));
    }
    for (let i = 9; i < 18; i++) {
        rightShelf.appendChild(createCard(bmPhotos[i], i));
    }
    switchRobloxAvatar(currentAvatar);
    updateCartUI();
    updateTransform();
}

function createCard(item, index) {
    const card = document.createElement('div');
    if (item.isEmpty) {
        card.className = 'bm-product-box empty-slot';
        card.onclick = () => {
            if (hasMoved) return;
            targetEmptySlotIdx = index;
            openCameraModal();
        };
        card.innerHTML = `<span class="bm-price-tag">KOSONG</span>${SVG_ICON_CAMERA}<div class="bm-pack-label">Klik Isi Foto</div>`;
        return card;
    }

    const cartPos = bmCart.findIndex(c => c.index === index);
    const isSelected = cartPos !== -1;

    card.className = `bm-product-box ${item.pack || 'pack-red'} ${isSelected ? 'in-cart' : ''}`;
    card.onclick = () => {
        if (hasMoved) return;
        openPhotoDetailModal(item, index);
    };

    const badgeText = isSelected ? `PILIH #${cartPos + 1}` : `#${index + 1}`;
    card.innerHTML = `<span class="bm-price-tag">${badgeText}</span><img src="${item.url}" onerror="this.src='img/bubu1.jpeg'"><div class="bm-pack-label">${item.title}</div>`;
    return card;
}

function openPhotoDetailModal(item, index) {
    previewingPhotoIdx = index;
    const modal = document.getElementById('bm-photo-detail-modal');
    if (!modal) return;

    document.getElementById('bm-prev-badge').innerText = `AISLE 01 · BINGKAI #${index + 1}`;
    document.getElementById('bm-prev-img').src = item.url;
    document.getElementById('bm-prev-title').innerText = item.title || `Kenangan #${index + 1}`;
    document.getElementById('bm-prev-desc').innerText = item.desc || 'Koleksi foto kenangan manis pilihan di Love Mart.';

    const btn = document.getElementById('bm-prev-cart-btn');
    const inCartIdx = bmCart.findIndex(c => c.index === index);

    if (inCartIdx !== -1) {
        btn.className = 'bm-detail-btn remove';
        btn.innerText = `Hapus dari Keranjang (Terpilih #${inCartIdx + 1})`;
    } else if (bmCart.length >= 3) {
        btn.className = 'bm-detail-btn';
        btn.innerText = 'Keranjang Penuh (3/3) · Lanjut Cetak Polaroid';
    } else {
        btn.className = 'bm-detail-btn';
        btn.innerText = `+ Masukkan ke Keranjang Polaroid (${bmCart.length}/3)`;
    }

    modal.classList.add('open');
}

function closePhotoDetailModal() {
    const modal = document.getElementById('bm-photo-detail-modal');
    if (modal) modal.classList.remove('open');
    previewingPhotoIdx = -1;
}

function togglePreviewPhotoInCart() {
    if (previewingPhotoIdx === -1) return;
    const item = bmPhotos[previewingPhotoIdx];
    const index = previewingPhotoIdx;

    const existingIdx = bmCart.findIndex(c => c.index === index);
    if (existingIdx !== -1) {
        bmCart.splice(existingIdx, 1);
        closePhotoDetailModal();
        renderGallery();
        return;
    }

    if (bmCart.length >= 3) {
        closePhotoDetailModal();
        openPolaroidStudioModal();
        return;
    }

    bmCart.push({ index: index, url: item.url, title: item.title });
    closePhotoDetailModal();
    playWalkCycle();
    renderGallery();

    if (bmCart.length === 3) {
        setTimeout(() => {
            openPolaroidStudioModal();
        }, 180);
    }
}

function resetPolaroidCart() {
    bmCart = [];
    hasPrintedPolaroid = false;
    const heldEl = document.getElementById('bm-held-polaroid');
    if (heldEl) heldEl.classList.remove('show');
    playWalkCycle();
    renderGallery();
}

function updateCartUI() {
    const countEl = document.getElementById('bm-cart-count');
    const slotsEl = document.getElementById('bm-cart-slots');
    const btnOpen = document.getElementById('bm-btn-open-polaroid');
    const btnReset = document.getElementById('bm-btn-reset-cart');
    if (!countEl || !slotsEl || !btnOpen) return;

    countEl.innerText = `${bmCart.length}/3`;
    slotsEl.innerHTML = '';

    for (let i = 0; i < 3; i++) {
        const slot = document.createElement('div');
        if (bmCart[i]) {
            slot.className = 'bm-cart-slot filled';
            slot.title = 'Klik untuk hapus foto ini dari keranjang';
            slot.onclick = () => {
                bmCart.splice(i, 1);
                renderGallery();
            };
            slot.innerHTML = `<img src="${bmCart[i].url}" onerror="this.src='img/bubu1.jpeg'">`;
        } else {
            slot.className = 'bm-cart-slot';
            slot.innerText = i + 1;
        }
        slotsEl.appendChild(slot);
    }

    if (btnReset) btnReset.disabled = (bmCart.length === 0 && !hasPrintedPolaroid);
    btnOpen.disabled = bmCart.length === 0;
    btnOpen.innerText = bmCart.length === 3 ? 'Cetak Polaroid!' : `Cetak (${bmCart.length}/3)`;

    if (hasPrintedPolaroid && bmCart.length > 0) {
        renderHeldPolaroidOnCharacter();
    }
}

function openPolaroidStudioModal() {
    if (bmCart.length === 0) return;
    const modal = document.getElementById('bm-polaroid-modal');
    if (!modal) return;
    renderPolaroidPreviewStrip();
    modal.classList.add('open');
}

function closePolaroidStudioModal() {
    const modal = document.getElementById('bm-polaroid-modal');
    if (modal) modal.classList.remove('open');
}

function selectPolaroidTheme(themeKey) {
    selectedPolaroidTheme = themeKey;
    const buttons = document.querySelectorAll('#bm-theme-picker .bm-theme-btn');
    const keys = ['pink', 'butter', 'sky', 'cream'];
    buttons.forEach((btn, idx) => {
        btn.classList.toggle('active', keys[idx] === themeKey);
    });
    renderPolaroidPreviewStrip();
    if (hasPrintedPolaroid) renderHeldPolaroidOnCharacter();
}

function selectDiySticker(stickerKey) {
    selectedDiySticker = stickerKey;
    const buttons = document.querySelectorAll('#bm-sticker-picker .bm-sticker-btn');
    const keys = ['hearts', 'stars', 'paws', 'none'];
    buttons.forEach((btn, idx) => {
        btn.classList.toggle('active', keys[idx] === stickerKey);
    });
    renderPolaroidPreviewStrip();
    if (hasPrintedPolaroid) renderHeldPolaroidOnCharacter();
}

function updateDiyCaptionText(val) {
    customPolaroidText = val.trim() || 'LOVE MART';
    const footer = document.getElementById('bm-pol-footer-text');
    if (footer) footer.innerText = customPolaroidText;
    if (hasPrintedPolaroid) renderHeldPolaroidOnCharacter();
}

function renderPolaroidPreviewStrip() {
    const theme = POLAROID_THEMES[selectedPolaroidTheme] || POLAROID_THEMES.pink;
    const strip = document.getElementById('bm-polaroid-strip-preview');
    const footer = document.getElementById('bm-pol-footer-text');
    const stickerLayer = document.getElementById('bm-pol-sticker-layer');

    if (strip) strip.style.background = theme.bg;
    if (footer) {
        footer.innerText = customPolaroidText;
        footer.style.color = theme.text;
    }
    if (stickerLayer) {
        stickerLayer.innerHTML = DIY_STICKERS_SVG[selectedDiySticker] || '';
    }

    for (let i = 0; i < 3; i++) {
        const slot = document.getElementById('bm-pol-slot-' + i);
        if (!slot) continue;
        const item = bmCart[i] || bmCart[0];
        if (item) {
            slot.innerHTML = `<img src="${item.url}" onerror="this.src='img/bubu1.jpeg'">`;
        }
    }
}

function confirmCarryPolaroid() {
    hasPrintedPolaroid = true;
    renderHeldPolaroidOnCharacter();
    closePolaroidStudioModal();
    updateCartUI();
    playWalkCycle();
}

function renderHeldPolaroidOnCharacter() {
    const heldEl = document.getElementById('bm-held-polaroid');
    const heldPhotos = document.getElementById('bm-held-photos');
    const heldCaption = document.getElementById('bm-held-caption');
    const heldStickers = document.getElementById('bm-held-stickers');
    if (!heldEl || !heldPhotos || bmCart.length === 0) return;

    const theme = POLAROID_THEMES[selectedPolaroidTheme] || POLAROID_THEMES.pink;
    heldEl.style.background = theme.bg;
    heldPhotos.innerHTML = '';
    if (heldCaption) heldCaption.innerText = customPolaroidText;
    if (heldStickers) heldStickers.innerHTML = DIY_STICKERS_SVG[selectedDiySticker] || '';

    for (let i = 0; i < 3; i++) {
        const item = bmCart[i] || bmCart[0];
        const img = document.createElement('img');
        img.src = item.url;
        img.onerror = function() { this.src = 'img/bubu1.jpeg'; };
        heldPhotos.appendChild(img);
    }

    heldEl.classList.add('show');
}

function downloadPolaroidStrip() {
    const theme = POLAROID_THEMES[selectedPolaroidTheme] || POLAROID_THEMES.pink;
    const canvas = document.createElement('canvas');
    canvas.width = 420;
    canvas.height = 960;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#3a2314';
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

    let loadedCount = 0;
    const items = [bmCart[0], bmCart[1] || bmCart[0], bmCart[2] || bmCart[0]];

    items.forEach((item, idx) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const x = 30;
            const y = 30 + idx * 280;
            const w = 360;
            const h = 255;

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x, y, w, h);
            ctx.drawImage(img, x, y, w, h);
            ctx.strokeStyle = '#3a2314';
            ctx.lineWidth = 6;
            ctx.strokeRect(x, y, w, h);

            loadedCount++;
            if (loadedCount === 3) {
                ctx.fillStyle = theme.text;
                ctx.font = "900 22px 'Comic Sans MS','Chalkboard SE',sans-serif";
                ctx.textAlign = 'center';
                ctx.fillText(customPolaroidText, canvas.width / 2, 915);

                const link = document.createElement('a');
                link.download = 'DIY_Polaroid_BubuDudu.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        };
        img.onerror = () => { loadedCount++; };
        img.src = item.url;
    });

    confirmCarryPolaroid();
}

function openBmProductModal(item, index) {
    openPhotoDetailModal(item, index);
}

function closeBmProductModal() {
    closePhotoDetailModal();
}

function updateTransform() {
    const scene = document.getElementById('bm-scene');
    const world = document.getElementById('bm-world');
    if (!scene || !world) return;

    bmCamYaw = Math.max(-85, Math.min(85, bmCamYaw));

    const leftShelf = document.getElementById('bm-left-shelf');
    const rightShelf = document.getElementById('bm-right-shelf');
    const leftWall = leftShelf ? leftShelf.parentElement : null;
    const rightWall = rightShelf ? rightShelf.parentElement : null;

    if (leftWall) {
        leftWall.style.visibility = (bmCamYaw > 28) ? 'hidden' : 'visible';
    }
    if (rightWall) {
        rightWall.style.visibility = (bmCamYaw < -28) ? 'hidden' : 'visible';
    }

    scene.style.transform = `translateZ(${BM_PERSPECTIVE}px) rotateY(${bmCamYaw}deg)`;
    world.style.transform = `translate3d(${-bmCamX}px, 0px, ${bmCamZ}px)`;
}

function bmStepWalk(delta) {
    const dir = delta > 0 ? 1 : -1;
    const stepSize = 75;
    const rad = (bmCamYaw * Math.PI) / 180;

    bmCamX += Math.sin(rad) * (dir * stepSize);
    bmCamZ += Math.cos(rad) * (dir * stepSize);

    bmCamX = Math.max(-185, Math.min(185, bmCamX));
    bmCamZ = Math.max(-650, Math.min(380, bmCamZ));

    playWalkCycle();
    updateTransform();
}

function bmTurnCamera(yawDelta) {
    bmCamYaw += yawDelta;
    playWalkCycle();
    updateTransform();
}

function playWalkCycle() {
    const rig = document.getElementById('roblox-rig');
    if (!rig) return;
    rig.classList.add('walking');
    if (walkAnimTimer) clearTimeout(walkAnimTimer);
    walkAnimTimer = setTimeout(() => {
        rig.classList.remove('walking');
    }, 300);
}

function bmSetCameraPreset(mode) {
    document.querySelectorAll('.bm-tab').forEach(b => b.classList.remove('active'));
    const tab = document.getElementById('bm-tab-' + mode);
    if (tab) tab.classList.add('active');
    
    if (mode === 'aisle') {
        bmCamX = 0; bmCamZ = -320; bmCamYaw = 0;
    } else if (mode === 'left') {
        bmCamX = -75; bmCamZ = -120; bmCamYaw = -65;
    } else if (mode === 'right') {
        bmCamX = 75; bmCamZ = -120; bmCamYaw = 65;
    }
    
    playWalkCycle();
    updateTransform();
}

function initDragLook() {
    const viewport = document.getElementById('bm-viewport');
    if (!viewport) return;

    viewport.addEventListener('mousedown', (e) => {
        if (e.target.closest('button') || e.target.closest('input') || e.target.closest('#bm-polaroid-modal') || e.target.closest('#bm-photo-detail-modal') || e.target.closest('#bm-cart-bar') || e.target.closest('#bm-held-polaroid')) return;
        isDragging = true;
        hasMoved = false;
        startX = e.clientX;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        if (Math.abs(deltaX) > 3) hasMoved = true;
        bmCamYaw += deltaX * 0.28; 
        startX = e.clientX;
        updateTransform();
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    viewport.addEventListener('touchstart', (e) => {
        if (e.target.closest('button') || e.target.closest('input') || e.target.closest('#bm-polaroid-modal') || e.target.closest('#bm-photo-detail-modal') || e.target.closest('#bm-cart-bar') || e.target.closest('#bm-held-polaroid')) return;
        isDragging = true;
        hasMoved = false;
        startX = e.touches[0].clientX;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaX = e.touches[0].clientX - startX;
        if (Math.abs(deltaX) > 3) hasMoved = true;
        bmCamYaw += deltaX * 0.28;
        startX = e.touches[0].clientX;
        updateTransform();
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });
}

async function openCameraModal() {
    const modal = document.getElementById('camera-modal');
    if (modal) modal.classList.add('open');
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        document.getElementById('webcam-stream').srcObject = videoStream;
    } catch(e) { console.log('Kamera tidak aktif'); }
}

function closeCameraModal() {
    const modal = document.getElementById('camera-modal');
    if (modal) modal.classList.remove('open');
    if (videoStream) { videoStream.getTracks().forEach(t => t.stop()); videoStream = null; }
}

function captureWebcamPhoto() {
    const video = document.getElementById('webcam-stream');
    const canvas = document.getElementById('snapshot-canvas');
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 400; 
    canvas.height = video.videoHeight || 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        savePhoto(canvas.toDataURL('image/jpeg'));
    }
}

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => savePhoto(evt.target.result);
        reader.readAsDataURL(file);
    }
}

function savePhoto(url) {
    let idx = targetEmptySlotIdx !== -1 ? targetEmptySlotIdx : bmPhotos.findIndex(p => p.isEmpty);
    if (idx === -1) idx = 2;
    bmPhotos[idx] = { isEmpty: false, url: url, title: 'My Snap!', desc: 'Foto baru hasil tangkapan langsung di Love Mart!', pack: 'pack-red' };
    targetEmptySlotIdx = -1;
    closeCameraModal();
    renderGallery();
}

window.addEventListener('DOMContentLoaded', () => { 
    renderGallery(); 
    initDragLook();
    renderLoveCouponsScreen();
});

// === PENGATURAN PASSWORD ULANG TAHUN NOVAL ===
const KUNCI_ULTAH = "21"; 
window.isNovalVerified = false; 

// Gambar Emoji Resmi Gaya Apple (iOS)
const APPLE_EMOJIS = {
    sparkles: '<img src="https://emojicdn.elk.sh/✨?style=apple" width="18" height="18" style="vertical-align:middle;margin-left:4px;">',
    thinking: '<img src="https://emojicdn.elk.sh/🤔?style=apple" width="18" height="18" style="vertical-align:middle;margin-left:4px;">',
    cake: '<img src="https://emojicdn.elk.sh/🎂?style=apple" width="18" height="18" style="vertical-align:middle;margin-left:4px;">',
    heart: '<img src="https://emojicdn.elk.sh/💖?style=apple" width="18" height="18" style="vertical-align:middle;margin-left:4px;">',
    camera: '<img src="https://emojicdn.elk.sh/📸?style=apple" width="18" height="18" style="vertical-align:middle;margin-left:4px;">',
    warning: '<img src="https://emojicdn.elk.sh/🚨?style=apple" width="52" height="52" style="margin-bottom:6px;">',
    lock: '<img src="https://emojicdn.elk.sh/🔒?style=apple" width="18" height="18" style="vertical-align:middle;margin-right:4px;">'
};

// 1. Injeksi CSS Komik, Foto Kasir Sania Full, & Efek Animasi
(function initComicLockSystem() {
    const oldShield = document.getElementById('bm-store-shield');
    if (oldShield) oldShield.remove();
    const oldHotspot = document.getElementById('bm-sania-hotspot');
    if (oldHotspot) oldHotspot.remove();
    const oldComicStyle = document.getElementById('bm-comic-styles');
    if (oldComicStyle) oldComicStyle.remove();

    const style = document.createElement('style');
    style.id = 'bm-comic-styles';
    style.innerHTML = `
        /* Hanya foto sania2 di kasir yang bisa diklik */
        img[src*="sania2"]:not(.comic-avatar-large), #checkout-avatar {
            pointer-events: auto !important;
            cursor: pointer !important;
            position: relative !important;
            z-index: 99999 !important;
        }

       /* FOTO SANIA DI DALAM CHAT: Bingkai ngepas & proporsional dengan bentuk foto */
        .comic-avatar-large {
            width: 120px !important;
            height: 160px !important;
            border-radius: 18px !important;
            border: 4px solid #3a2314 !important;
            object-fit: cover !important;
            object-position: center top !important;
            flex-shrink: 0 !important;
            box-shadow: 4px 4px 0px #3a2314 !important;
            pointer-events: none !important;
            margin-top: -10px !important;
            margin-bottom: 6px !important;
        }

        /* Efek berkedip di foto kasir selama belum verifikasi */
        .sania-glow-unverified {
            box-shadow: 0 0 0 4px #ffbe0b, 0 0 18px #d62828 !important;
            animation: pulseSaniaAvatar 1s infinite alternate !important;
        }
        @keyframes pulseSaniaAvatar {
            from { transform: scale(0.96); }
            to { transform: scale(1.08); }
        }

        /* Toast Peringatan Fitur Terkunci */
       /* Toast Peringatan Fitur Terkunci (Pas di dalam layar HP) */
        #bm-lock-toast {
            position: absolute !important;
            top: 60px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            background: #d62828 !important;
            color: #ffffff !important;
            border: 3px solid #3a2314 !important;
            padding: 8px 14px !important;
            border-radius: 12px !important;
            font-family: 'Comic Sans MS', sans-serif !important;
            font-weight: 900 !important;
            font-size: 11.5px !important;
            box-shadow: 4px 4px 0px #3a2314 !important;
            z-index: 9999999 !important;
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
            text-align: left !important;
            width: 88% !important;
            max-width: 280px !important;
            box-sizing: border-box !important;
            pointer-events: none !important;
            animation: toastBounce 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        }
        @keyframes toastBounce {
            from { transform: translateX(-50%) scale(0.7); opacity: 0; }
            to { transform: translateX(-50%) scale(1); opacity: 1; }
        }

        .comic-dialog-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.6);
            z-index: 999998;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .comic-dialog-box {
            background: #ffffff;
            border: 4px solid #3a2314;
            border-radius: 20px;
            padding: 20px;
            width: 340px;
            box-shadow: 6px 6px 0px #3a2314;
            font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
            animation: comicPopIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            position: relative;
            z-index: 999999;
            text-align: center;
        }
        @keyframes comicPopIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .comic-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
            border-bottom: 2px dashed #3a2314;
            padding-bottom: 12px;
        }
        .comic-header-title {
            font-weight: 900;
            color: #d62828;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .comic-bubble {
            background: #fff8e7;
            border: 3px solid #3a2314;
            border-radius: 14px;
            padding: 14px;
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 16px;
            color: #3a2314;
            font-weight: 700;
            text-align: left;
        }
        .comic-input {
            width: 100%;
            box-sizing: border-box;
            padding: 10px;
            border: 3px solid #3a2314;
            border-radius: 10px;
            font-family: inherit;
            font-size: 16px;
            font-weight: 900;
            text-align: center;
            margin-bottom: 12px;
            background: #fff;
            color: #3a2314;
            outline: none;
        }
        .comic-buttons {
            display: flex;
            gap: 10px;
        }
        .comic-btn {
            flex: 1;
            padding: 10px;
            font-weight: 900;
            font-size: 13.5px;
            border: 3px solid #3a2314;
            border-radius: 10px;
            cursor: pointer;
            box-shadow: 3px 3px 0px #3a2314;
        }
        .comic-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 1px 1px 0px #3a2314;
        }
        .btn-yes { background: #4caf50; color: #fff; }
        .btn-no { background: #e63946; color: #fff; }
        .btn-ok { background: #ffb703; color: #3a2314; }

        /* Animasi Karakter Ditendang Terbang Keluar Layar */
        @keyframes kickedOutAnim {
            0% { transform: translateX(-50%) translateY(0) rotate(0deg) scale(1); opacity: 1; }
            20% { transform: translateX(-30%) translateY(-120px) rotate(140deg) scale(1.15); opacity: 1; }
            100% { transform: translateX(420px) translateY(-550px) rotate(1080deg) scale(0.1); opacity: 0; }
        }
        .char-kicked-flying {
            animation: kickedOutAnim 0.85s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards !important;
        }

        .kick-pow-badge {
            position: fixed;
            bottom: 180px;
            left: 50%;
            transform: translateX(-50%) scale(0);
            background: #ffbe0b;
            color: #d62828;
            border: 4px solid #3a2314;
            padding: 10px 22px;
            font-family: 'Comic Sans MS', sans-serif;
            font-weight: 900;
            font-size: 26px;
            border-radius: 50%;
            box-shadow: 5px 5px 0 #3a2314;
            z-index: 9999999;
            animation: powPop 0.7s ease-out forwards;
            pointer-events: none;
        }
        @keyframes powPop {
            0% { transform: translateX(-50%) scale(0) rotate(-15deg); opacity: 1; }
            40% { transform: translateX(-50%) scale(1.3) rotate(10deg); opacity: 1; }
            100% { transform: translateX(-50%) scale(1.5) rotate(0deg); opacity: 0; }
        }

        #dark-override-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(5, 0, 0, 0.97);
            z-index: 9999999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #ff3b30;
            font-family: 'Comic Sans MS', sans-serif;
            text-align: center;
            padding: 24px;
            animation: darkFadeIn 0.35s ease forwards;
        }
        @keyframes darkFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .warning-box {
            border: 4px solid #ff3b30;
            background: #1a0000;
            padding: 24px 20px;
            border-radius: 18px;
            max-width: 330px;
            box-shadow: 0 0 35px rgba(255, 59, 48, 0.6);
            animation: alarmPulse 1s infinite alternate;
        }
        @keyframes alarmPulse {
            from { box-shadow: 0 0 15px rgba(255, 59, 48, 0.4); transform: scale(0.98); }
            to { box-shadow: 0 0 40px rgba(255, 59, 48, 0.9); transform: scale(1.02); }
        }
    `;
    document.head.appendChild(style);
})();

// Fungsi notifikasi (Tombol bersih tanpa emoji)
function showLockedToast() {
    const oldToast = document.getElementById('bm-lock-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.id = 'bm-lock-toast';
    toast.innerHTML = `${APPLE_EMOJIS.lock} <span>Fitur masih dikunci! Klik foto Sania di kasir biru dulu ya.</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 2200);
}

// 2. Pasang efek kedip dan klik HANYA pada foto sania2.jpeg di kasir
function bindSaniaCashierClick() {
    const cashierImgs = document.querySelectorAll('img[src*="sania2"]:not(.comic-avatar-large), #checkout-avatar:not(.comic-avatar-large)');
    cashierImgs.forEach(img => {
        if (img.closest('#comic-dialog-overlay')) return;

        if (!window.isNovalVerified) {
            img.classList.add('sania-glow-unverified');
        } else {
            img.classList.remove('sania-glow-unverified');
        }

        if (!img.dataset.comicBound) {
            img.dataset.comicBound = "true";
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                if (!window.isNovalVerified) {
                    window.startComicSequence();
                }
            });
        }
    });
}
setInterval(bindSaniaCashierClick, 300);

// 3. Fungsi Membuka Percakapan Komik (Tombol Bersih Tanpa Emoji, Teks "SANIA:")
window.startComicSequence = function() {
    if (window.isNovalVerified) return;

    const oldDialog = document.getElementById('comic-dialog-overlay');
    if (oldDialog) oldDialog.remove();

    const cashierImg = document.querySelector('img[src*="sania2"]:not(.comic-avatar-large)') || document.getElementById('checkout-avatar');
    const sania2Src = (cashierImg && cashierImg.getAttribute('src').includes('sania2')) ? cashierImg.src : 'sania2.jpeg';

    const overlay = document.createElement('div');
    overlay.className = 'comic-dialog-overlay';
    overlay.id = 'comic-dialog-overlay';
    
    overlay.innerHTML = `
        <div class="comic-dialog-box">
            <div class="comic-header">
                <img src="${sania2Src}" alt="Sania" class="comic-avatar-large">
                <div class="comic-header-title">SANIA (KASIR SNAP LOVE) ${APPLE_EMOJIS.sparkles}</div>
            </div>
            <div class="comic-bubble" id="dialog-text">
                <strong>SANIA:</strong><br>"APAKAH ANDA NOVAL RIZKY PRATAMA? ${APPLE_EMOJIS.thinking}"
            </div>
            <div id="dialog-extra"></div>
            <div class="comic-buttons" id="dialog-actions">
                <button type="button" class="comic-btn btn-yes" id="btn-comic-yes">IYA</button>
                <button type="button" class="comic-btn btn-no" id="btn-comic-no">TIDAK</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Jika pilih IYA -> Tanya Password Umur (21)
    document.getElementById('btn-comic-yes').addEventListener('click', function(e) {
        e.stopPropagation();
        const dialogText = document.getElementById('dialog-text');
        const dialogExtra = document.getElementById('dialog-extra');
        const dialogActions = document.getElementById('dialog-actions');

        dialogText.innerHTML = `
            <strong>SANIA:</strong><br>"Hmm coba buktikan dulu! Kalau beneran Noval, sekarang kamu ulang tahun yang ke berapa? ${APPLE_EMOJIS.cake}"
        `;
        dialogExtra.innerHTML = `
            <input type="number" id="input-ultah-noval" class="comic-input" placeholder="Ketik angka ultah..." autofocus>
        `;
        dialogActions.innerHTML = `
            <button type="button" class="comic-btn btn-yes" id="btn-verify-ultah">CEK PASSWORD</button>
        `;

        const inputEl = document.getElementById('input-ultah-noval');
        setTimeout(() => inputEl.focus(), 50);

        const verifyPassword = () => {
            const val = inputEl.value.trim();
            const numericVal = val.replace(/[^0-9]/g, '');

            if (numericVal === KUNCI_ULTAH) {
                window.isNovalVerified = true;
                bindSaniaCashierClick();

                dialogExtra.innerHTML = '';
                dialogText.innerHTML = `
                    <strong>SANIA:</strong><br>"Yeay, 100% beneran Noval! Selamat ulang tahun ke-21 sayangku! ${APPLE_EMOJIS.heart} Di sini kamu bisa pilih foto-foto di rak dan ambil foto, terus dijadikan cetakan Polaroid! Yuk cobain! ${APPLE_EMOJIS.camera}"
                `;
                dialogActions.innerHTML = `
                    <button type="button" class="comic-btn btn-ok" id="btn-comic-close">SIAP, AYO!</button>
                `;
                document.getElementById('btn-comic-close').addEventListener('click', function(ev) {
                    ev.stopPropagation();
                    overlay.remove();
                });
            } else {
                overlay.remove();
                window.kickAndReturnToMailbox("PASSWORD SALAH! KAMU BUKAN NOVAL YA?!");
            }
        };

        document.getElementById('btn-verify-ultah').addEventListener('click', function(ev) {
            ev.stopPropagation();
            verifyPassword();
        });

        inputEl.addEventListener('keydown', function(ev) {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                verifyPassword();
            }
        });
    });

    // Jika pilih TIDAK -> Ditendang, gelap, & balik ke menu kotak surat awal!
    document.getElementById('btn-comic-no').addEventListener('click', function(e) {
        e.stopPropagation();
        overlay.remove();
        window.kickAndReturnToMailbox("BUKAN NOVAL DILARANG MASUK!");
    });
};

// 4. Fungsi Menendang Bubu/Dudu + Gelap + Kembali ke Menu Kotak Surat Paling Awal
window.kickAndReturnToMailbox = function(alasan) {
    const rig = document.getElementById('roblox-rig');
    
    // Badge komik tendangan dengan gaya Apple Emoji & teks komik
    const pow = document.createElement('div');
    pow.className = 'kick-pow-badge';
    pow.innerHTML = 'DUAGH!! <img src="https://emojicdn.elk.sh/💥?style=apple" width="28" height="28" style="vertical-align:middle;margin-left:4px;">';
    document.body.appendChild(pow);
    setTimeout(() => pow.remove(), 800);

    if (rig) {
        rig.classList.remove('char-kicked-flying');
        void rig.offsetWidth;
        rig.classList.add('char-kicked-flying');
    }

    setTimeout(() => {
        const oldDark = document.getElementById('dark-override-overlay');
        if (oldDark) oldDark.remove();

        const appWrap = document.getElementById('app-container') || document.body;
        appWrap.style.filter = 'brightness(0.1) contrast(1.2)';

        const darkOverlay = document.createElement('div');
        darkOverlay.id = 'dark-override-overlay';
        darkOverlay.innerHTML = `
            <div class="warning-box">
                ${APPLE_EMOJIS.warning}
                <h2 style="font-size: 20px; font-weight: 900; margin: 0 0 10px 0; color: #ff3b30; letter-spacing: 1px;">
                    ${alasan || 'PERINGATAN: KELUAR SEKARANG!'}
                </h2>
                <p style="font-size: 13.5px; color: #ffffff; line-height: 1.5; margin-bottom: 16px;">
                    Kamu telah <strong>DITENDANG KELUAR</strong> dan ruangan <strong>DIGELAPKAN</strong>! Mengembalikan kamu ke menu kotak surat paling awal...
                </p>
                <div style="font-size: 12px; color: #ffbe0b; font-weight: bold;">
                    ⏳ Melempar keluar...
                </div>
            </div>
        `;
        document.body.appendChild(darkOverlay);

        setTimeout(() => {
            const backBtns = Array.from(document.querySelectorAll('button, a, div')).filter(
                el => el.textContent && el.textContent.trim().includes('Back')
            );
            if (backBtns.length > 0) backBtns[0].click();

            sessionStorage.clear();
            localStorage.removeItem('bm_current_view');
            window.location.href = window.location.pathname;
        }, 2200);
    }, 750);
};

// 5. FILTER KLIK CERDAS: Hanya Foto Kasir sania2 yang Memicu Chat
document.addEventListener('click', function(e) {
    if (window.isNovalVerified) return;

    const target = e.target;
    if (!target) return;

    if (document.getElementById('comic-dialog-overlay') || document.getElementById('dark-override-overlay')) {
        return;
    }

    const cashierImgs = document.querySelectorAll('img[src*="sania2"]:not(.comic-avatar-large), #checkout-avatar:not(.comic-avatar-large)');
    let isClickingCashierSania = false;

    cashierImgs.forEach(img => {
        if (img.closest('#comic-dialog-overlay')) return;
        const rect = img.getBoundingClientRect();
        if (
            rect.width > 0 &&
            e.clientX >= rect.left - 6 &&
            e.clientX <= rect.right + 6 &&
            e.clientY >= rect.top - 6 &&
            e.clientY <= rect.bottom + 6
        ) {
            isClickingCashierSania = true;
        }
    });

    if (
        target.tagName === 'IMG' &&
        !target.classList.contains('comic-avatar-large') &&
        (target.getAttribute('src') || '').toLowerCase().includes('sania2')
    ) {
        isClickingCashierSania = true;
    }

    if (isClickingCashierSania) {
        e.stopPropagation();
        e.preventDefault();
        window.startComicSequence();
        return;
    }

    const rigEl = document.getElementById('roblox-rig');
    const isInsideStore = rigEl && rigEl.getBoundingClientRect().width > 0;
    if (!isInsideStore) return;

    const clickedBtn = target.closest('button, div, a, span');
    const text = (clickedBtn ? clickedBtn.textContent : target.textContent || '').trim();

    const allowedTexts = [
        'Putar Kiri', 'Maju', 'Loncat', 'Mundur', 'Putar Kanan',
        'Back', 'Bubu', 'Dudu', 'Aisle', 'Left Rack', 'Right Rack'
    ];

    const isAllowedControl = allowedTexts.some(allowed => text.includes(allowed));

    if (isAllowedControl && !text.includes('Snap') && !text.includes('Cetak') && !text.includes('Reset')) {
        return;
    }

    const isRackItem = target.closest('[class*="frame"], [class*="slot"], [class*="rack"], [class*="item"], [onclick*="Frame"], [onclick*="Slot"], [onclick*="Modal"], [onclick*="Snap"], [onclick*="Photo"]');
    const isRestrictedBtn = text.includes('Snap') || text.includes('Cetak') || text.includes('Reset') || text.includes('AMBIL FOTO') || text.includes('PILIH #') || text.includes('#');

    if (isRackItem || isRestrictedBtn || clickedBtn) {
        e.stopPropagation();
        e.preventDefault();
        showLockedToast();
    }
}, true);

// Fungsi Interaktif Buka Kotak Kado (di Secret Letter & di Love Coupons)
window.isCouponKadoOpened = false;

window.openSurpriseKadoBox = function() {
    const closedEl = document.getElementById('surprise-kado-closed-stage');
    const openedEl = document.getElementById('surprise-kado-opened-stage');
    if (!closedEl || !openedEl) return;
    closedEl.classList.add('opening');
    setTimeout(() => {
        closedEl.style.display = 'none';
        closedEl.classList.remove('opening');
        openedEl.style.display = 'block';
    }, 480);
};

window.resetSurpriseKadoBox = function() {
    const closedEl = document.getElementById('surprise-kado-closed-stage');
    const openedEl = document.getElementById('surprise-kado-opened-stage');
    if (!closedEl || !openedEl) return;
    openedEl.style.display = 'none';
    closedEl.style.display = 'flex';
};

window.openCouponKadoBox = function() {
    const closedEl = document.getElementById('coupon-kado-closed-stage');
    const openedEl = document.getElementById('coupon-kado-opened-stage');
    if (!closedEl || !openedEl) return;
    closedEl.classList.add('opening');
    window.isCouponKadoOpened = true;
    setTimeout(() => {
        closedEl.style.display = 'none';
        closedEl.classList.remove('opening');
        openedEl.style.display = 'block';
        if (!window.masterCouponScratched && typeof initScratchCard === 'function') {
            initScratchCard('scratch-canvas-master', 'master-coupon-done-msg');
        }
    }, 480);
};


// =========================================================================
// 99. KADO 3D RAHASIA (Jar, Keyboard, Webcam)
//     Terbuka kalau 5 game selesai (unlockedGamesState) DAN kupon final
//     sudah digosok (masterCouponScratched). Markup ada di index.php (#gx-section).
// =========================================================================
(function () {
    const GAME_IDS = ['block', 'match', 'quiz', 'birds', 'catch'];
    let giftOpened = false;
    const gxSetEnd = (on) => { const b = document.getElementById('gx-end'); if (b) b.disabled = !on; };
    const $ = (id) => document.getElementById(id);

    function getProgress() {
        const st = window.unlockedGamesState || {};
        const games = GAME_IDS.filter((id) => st[id]).length;
        const coupon = !!window.masterCouponScratched;
        return { games, coupon, ready: games === GAME_IDS.length && coupon };
    }

    function renderGiftBox() {
        const sec = $('gx-section');
        if (!sec) return;
        const p = getProgress();
        const fill = $('gx-meter-fill');
        if (fill) fill.style.width = ((p.games + (p.coupon ? 1 : 0)) / (GAME_IDS.length + 1) * 100) + '%';

        if (giftOpened && !p.ready) {          // progres di-reset -> kunci lagi
            giftOpened = false;
            sec.classList.remove('is-open');
            gxSetEnd(false);
        }
        if (giftOpened) return;

        sec.classList.toggle('is-ready', p.ready);
        sec.classList.toggle('is-locked', !p.ready);
        $('gx-title').textContent = p.ready ? 'Kado Rahasia Siap Dibuka!' : 'Kado Rahasia';
        $('gx-sub').textContent = p.ready
            ? 'Semua game & kupon sudah selesai'
            : p.games + '/' + GAME_IDS.length + ' game \u2022 kupon ' + (p.coupon ? 'terbuka' : 'belum dibuka');
        const hint = $('gx-hint');
        if (hint && (p.ready || /terkunci/i.test(hint.textContent) || !hint.textContent)) {
            hint.textContent = p.ready ? 'Ketuk kotak kadonya!' : 'Masih terkunci\u2026';
        }
    }

    window.gxTap = function () {
        const sec = $('gx-section');
        if (!sec || giftOpened) return;
        const p = getProgress();
        if (!p.ready) {
            sec.classList.remove('gx-shake');
            void sec.offsetWidth;
            sec.classList.add('gx-shake');
            setTimeout(() => sec.classList.remove('gx-shake'), 520);
            $('gx-hint').textContent = p.games < GAME_IDS.length
                ? 'Selesaikan dulu ' + (GAME_IDS.length - p.games) + ' game lagi ya'
                : 'Buka kupon final di Love Coupons dulu ya';
            return;
        }
        giftOpened = true;
        sec.classList.remove('is-ready', 'is-locked');
        sec.classList.add('is-open');
        $('gx-title').textContent = 'Selamat Ulang Tahun, Sayangkuu!';
        $('gx-sub').textContent = 'Ini kado dari Sania untukmu';
        gxSetEnd(true);
        $('gx-hint').textContent = '';
    };

    document.addEventListener('keydown', (e) => {
        const stage = $('gx-stage');
        if (stage && document.activeElement === stage && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            window.gxTap();
        }
    });

    // Tes cepat tanpa main semua game: buka Console (F12), ketik previewGiftBox()
    // Untuk mengunci lagi: previewGiftBox(false)
    window.previewGiftBox = function (on = true) {
        window.unlockedGamesState = window.unlockedGamesState || {};
        GAME_IDS.forEach((id) => { window.unlockedGamesState[id] = !!on; });
        window.masterCouponScratched = !!on;
        renderGiftBox();
    };

    document.addEventListener('DOMContentLoaded', renderGiftBox);
    setInterval(renderGiftBox, 600);
    renderGiftBox();
})();


// =========================================================================
// 99B. OBJEK 3D KADO: Jar, Keyboard, Webcam (gaya Rexus) - murni CSS 3D
// =========================================================================
(function () {
    const NAVY = '#1c4b82';
    const HEART = '<svg viewBox="0 0 30 28" width="30" height="28"><path d="M15 26C3 17 0 10 4 5c4-4 9-2 11 2 2-4 7-6 11-2 4 5 1 12-11 21z" fill="#ff4d6d" stroke="#1c4b82" stroke-width="2" stroke-linejoin="round"/></svg>';
    const mk = (p, css) => { const e = document.createElement('div'); e.style.cssText = css; p.appendChild(e); return e; };
    const shade = (s) => s ? `linear-gradient(rgba(${s < 0 ? '255,255,255' : '0,0,0'},${Math.abs(s)}),rgba(${s < 0 ? '255,255,255' : '0,0,0'},${Math.abs(s)})),` : '';

    // balok 3D (pusat di x,y,z), 6 sisi dengan bayangan + garis tepi kartun
    function box(p, w, h, d, x, y, z, col, rad) {
        const g = mk(p, `position:absolute;left:${x - w / 2}px;top:${y - h / 2}px;width:${w}px;height:${h}px;transform-style:preserve-3d;transform:translateZ(${z}px)`);
        [[w, h, `translateZ(${d / 2}px)`, 0, rad], [w, h, `rotateY(180deg) translateZ(${d / 2}px)`, .3, rad],
         [d, h, `rotateY(90deg) translateZ(${w / 2}px)`, .15], [d, h, `rotateY(-90deg) translateZ(${w / 2}px)`, .08],
         [w, d, `rotateX(90deg) translateZ(${h / 2}px)`, -.15], [w, d, `rotateX(-90deg) translateZ(${h / 2}px)`, .35]]
            .forEach(([fw, fh, tr, s, r]) => mk(g, `position:absolute;box-sizing:border-box;left:${(w - fw) / 2}px;top:${(h - fh) / 2}px;width:${fw}px;height:${fh}px;border:1.5px solid ${NAVY};border-radius:${r || 0}px;background:${shade(s)}${col};transform:${tr}`));
        return g;
    }

    // silinder tegak dari n sisi + tutup atas/bawah
    function cyl(p, o) {
        const g = mk(p, `position:absolute;left:0;top:${o.y}px;width:0;height:0;transform-style:preserve-3d`);
        const w = 2 * o.r * Math.tan(Math.PI / o.n) + .6;
        for (let i = 0; i < o.n; i++) {
            const a = i * 360 / o.n, l = o.l + 14 * Math.cos((a - 50) * Math.PI / 180);
            mk(g, `position:absolute;left:${-w / 2}px;top:0;width:${w}px;height:${o.h}px;background:hsla(${o.hue},${o.s}%,${l}%,${o.a});transform:rotateY(${a}deg) translateZ(${o.r}px)`);
        }
        [0, o.h].forEach((yy, k) => mk(g, `position:absolute;left:${-o.r}px;top:${yy - o.r}px;width:${2 * o.r}px;height:${2 * o.r}px;border-radius:50%;background:hsla(${o.hue},${o.s}%,${o.l + (k ? -8 : 10)}%,${o.a});transform:rotateX(90deg)`));
    }

    function jar(o) {
        cyl(o, { r: 24, h: 46, n: 14, y: -16, hue: 200, s: 90, l: 82, a: .5 });
        [['#ff8fab', -10, 0], ['#ffe08a', 8, 6], ['#9bdcff', 2, -9]].forEach(([c, x, z]) => box(o, 11, 9, 11, x, 24, z, c));
        [-2, 2].forEach((z) => { mk(o, `position:absolute;left:-15px;top:-4px;width:30px;height:28px;transform:translateZ(${z}px)`).innerHTML = HEART; });
        cyl(o, { r: 26, h: 10, n: 14, y: -26, hue: 345, s: 100, l: 70, a: 1 });
    }

    function keyboard(o) {
        box(o, 112, 8, 46, 0, 6, 0, '#cdb4ff');
        const pl = mk(o, 'position:absolute;left:-56px;top:-21px;width:112px;height:46px;transform:rotateX(90deg) translateZ(.6px)');
        const K = [];
        for (let i = 0; i < 11; i++) K.push([6 + i * 9, 4, 7]);
        for (let i = 0; i < 10; i++) K.push([6 + i * 9, 14, 7]);
        K.push([96, 14, 10, 1], [6, 24, 12]);
        for (let i = 0; i < 8; i++) K.push([20 + i * 9, 24, 7]);
        K.push([92, 24, 14], [6, 34, 10], [18, 34, 10], [30, 34, 50], [82, 34, 10], [94, 34, 10, 1]);
        K.forEach(([x, y, w, c]) => mk(pl, `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:8px;border-radius:2px;background:${c ? '#ff8fab' : '#fff'};box-shadow:0 0 0 1.5px ${NAVY},0 3px 0 1.5px ${NAVY}`));
    }

    function webcam(o) {
        box(o, 34, 5, 28, 0, 36, 0, '#2a2d38');                      // klip monitor
        box(o, 11, 22, 8, 0, 22, -2, '#3a3e4c');                     // leher
        const h = box(o, 66, 34, 22, 0, -4, 0, '#1b1d25', 7);        // badan hitam
        [[26, '#4a4f62', 12.5], [20, '#0b0c10', 13.5], [13, 'radial-gradient(circle at 35% 30%,#8fe3ff,#2a7fd6 60%,#0b2c63)', 14.5]]
            .forEach(([d, bg, z]) => mk(h, `position:absolute;left:${33 - d / 2}px;top:${17 - d / 2}px;width:${d}px;height:${d}px;border-radius:50%;background:${bg};transform:translateZ(${z}px)`));
        mk(h, 'position:absolute;left:54px;top:5px;width:4px;height:4px;border-radius:50%;background:#ff3b3b;transform:translateZ(12px)');
        mk(h, "position:absolute;left:0;right:0;bottom:2px;text-align:center;font:700 6px/1 Quicksand,sans-serif;letter-spacing:.16em;color:#ff4d4d;transform:translateZ(12px)").textContent = 'REXUS';
    }

    function build() {
        [['gx-o-jar', jar], ['gx-o-kb', keyboard], ['gx-o-cam', webcam]].forEach(([id, fn]) => {
            const c = document.getElementById(id);
            if (!c || c.firstChild) return;
            const o3 = mk(c, ''); o3.className = 'o3'; if (id === 'gx-o-kb') o3.style.setProperty('--tx', '-50deg'); fn(o3);
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();

// =========================================================================
// 99C. TOMBOL END -> ending ala video, tampil DI ATAS menu (hati berisi lirik, sinkron dgn audio/shapeof)
//      Waktu animasi mengikuti audio.currentTime. Atur s (muncul), d (lama naik),
//      w0-w1 (teks keluar) di LINES bila ingin lebih pas.
// =========================================================================
(function () {
    const $ = (id) => document.getElementById(id);
    const DUR = 40.6;
    const LINES = [
        { t: 'Got nothing to hide no more',               s: -1.0, d: 8.2,  w0: 0.6,  w1: 3.2,  x: 28, w: 170, c: 0 },
        { t: "I don't know where to start",               s: 4.4,  d: 8.2,  w0: 5.0,  w1: 8.2,  x: 68, w: 160, c: 0 },
        { t: 'But to show you the shape of my heart',     s: 9.4,  d: 8.8,  w0: 10.2, w1: 15.8, x: 45, w: 210, c: 0 },
        { t: "I'm lookin' back on things I've done",      s: 19.2, d: 8.8,  w0: 21.3, w1: 25.0, x: 60, w: 235, c: 1 },
        { t: 'I never wanna play the same old part',      s: 26.6, d: 7.2,  w0: 26.9, w1: 29.4, x: 36, w: 200, c: 1 },
        { t: "I'll keep you in the dark",                 s: 30.8, d: 7.6,  w0: 31.3, w1: 33.2, x: 50, w: 175, c: 0 },
        { t: 'Now let me show you the shape of my heart', s: 34.8, d: 11.0, w0: 35.7, w1: 38.9, x: 62, w: 230, c: 1 }
    ];
    let raf = 0, t0 = 0, built = false, wasMusic = false;

    // pasang overlay tepat di atas frame aplikasi (#app-container) supaya menu tetap terlihat
    window.gxPlace = function (el) {
        const c = document.getElementById('app-container');
        const r = c ? c.getBoundingClientRect() : { left: 0, top: 0, width: innerWidth, height: innerHeight };
        el.style.left = r.left + 'px'; el.style.top = r.top + 'px';
        el.style.width = r.width + 'px'; el.style.height = r.height + 'px';
    };
    window.addEventListener('resize', () => { const o = $('gx-ending'); if (o && o.classList.contains('on')) window.gxPlace(o); });

    function build() {
        if (built) return;
        built = true;
        const P = $('ge-parts'), cols = ['#ff8fab', '#ff4d6d', '#ffb3c6', '#9bdcff', '#ffd166'];
        for (let i = 0; i < 34; i++) {
            const e = document.createElement('i');
            e.textContent = '\u2665';
            e.style.cssText = `--x:${Math.random() * 100}%;--sz:${6 + Math.random() * 9}px;--c:${cols[i % cols.length]};--d:${6 + Math.random() * 7}s;--del:${-Math.random() * 12}s`;
            P.appendChild(e);
        }
        LINES.forEach((L) => {
            const h = document.createElement('div');
            h.className = 'ge-h';
            h.style.width = L.w + 'px';
            h.innerHTML = `<svg viewBox="0 0 100 90"><path d="M50 88C8 56-4 30 14 12 28-2 46 6 50 20 54 6 72-2 86 12 104 30 92 56 50 88Z" fill="url(#ge-g${L.c})"/></svg><span class="ge-t" style="font-size:${L.w / 11.5}px"></span>`;
            $('ge-hearts').appendChild(h);
            L.el = h; L.tx = h.querySelector('.ge-t'); L.words = L.t.split(' ');
        });
    }

    function tick() {
        const a = $('ge-audio'), st = $('ge-stage'), ov = $('gx-ending'), fade = $('ge-fade');
        const t = (a.currentTime > 0 && !a.error) ? a.currentTime : (performance.now() - t0) / 1000;
        const H = st.clientHeight, W = st.clientWidth;
        LINES.forEach((L) => {
            const p = (t - L.s) / L.d;
            if (p < 0 || p > 1) { L.el.style.display = 'none'; return; }
            const hh = L.w * .9;
            const y = H * 1.02 - p * (H * 1.02 + hh * 1.1);
            const x = W * L.x / 100 + Math.sin(t * .9 + L.s) * 10 - L.w / 2;
            L.el.style.display = 'block';
            L.el.style.transform = `translate(${x}px,${y}px) rotate(${Math.sin(t * .7 + L.s) * 4}deg)`;
            const k = Math.max(0, Math.min(1, (t - L.w0) / (L.w1 - L.w0)));
            L.tx.textContent = L.words.slice(0, Math.ceil(k * L.words.length)).join(' ');
        });
        fade.style.opacity = Math.max(0, Math.min(1, (t - 38.0) / 2.4));   // gradasi layar jadi hitam di akhir
        if (a.ended || t >= DUR) {                                          // selesai: layar tetap hitam, tanpa tombol
            fade.style.opacity = 1;
            ov.classList.add('done');
            return;
        }
        raf = requestAnimationFrame(tick);
    }

    window.gxEnd = function () {
        const b = $('gx-end');
        if (!b || b.disabled) return;           // hanya bisa setelah kado terbuka
        build();
        const a = $('ge-audio'), ov = $('gx-ending');
        try { if (typeof isPlaying !== 'undefined' && isPlaying) { wasMusic = true; pauseActiveMusicOnly(); } } catch (e) {}
        window.gxPlace(ov);
        $('ge-fade').style.opacity = 0;
        ov.classList.remove('done');
        ov.classList.add('on');
        a.currentTime = 0; t0 = performance.now();
        const pr = a.play(); if (pr && pr.catch) pr.catch(() => {});
        cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
    };

    window.gxEndClose = function () {
        const a = $('ge-audio');
        a.pause(); a.currentTime = 0;
        cancelAnimationFrame(raf);
        $('gx-ending').classList.remove('on', 'done');
        try { if (wasMusic) { wasMusic = false; resumeActiveMusicOnly(); } } catch (e) {}
    };

    // setelah layar hitam: ketuk di mana saja (atau tekan Esc) untuk kembali ke menu
    window.gxEndTap = function () { const ov = $('gx-ending'); if (ov && ov.classList.contains('done')) window.gxEndClose(); };
    document.addEventListener('keydown', (e) => { const ov = $('gx-ending'); if (e.key === 'Escape' && ov && ov.classList.contains('on')) window.gxEndClose(); });
})();

// =========================================================================
// 99D. PETAL POST: klik "Terima Bunga" -> buket membesar di tengah layar
// =========================================================================
(function () {
    let ov = null;
    window.acceptBouquetBig = function () {
        if (!ov) {
            ov = document.createElement('div');
            ov.className = 'bq-big';
            document.body.appendChild(ov);
            window.addEventListener('resize', () => { if (ov.classList.contains('on')) window.gxPlace(ov); });
        }
        const src = document.getElementById('giant-bouquet-svg');
        const note = document.getElementById('giant-note-text');
        const sign = document.getElementById('giant-note-sign');
        const cols = ['#ff8fab', '#ff4d6d', '#ffb3c6', '#ffd166'];
        let parts = '';
        for (let i = 0; i < 24; i++) parts += `<i style="--x:${Math.random() * 100}%;--sz:${8 + Math.random() * 10}px;--c:${cols[i % 4]};--d:${5 + Math.random() * 6}s;--del:${-Math.random() * 9}s">\u2665</i>`;
        const hasSign = sign && sign.style.display !== 'none' && sign.src;
        ov.innerHTML = `<div class="bq-parts">${parts}</div>` +
            `<div class="bq-wrap"><svg class="bq-svg" viewBox="0 0 160 170">${src ? src.innerHTML : ''}</svg>` +
            `<div class="bq-note">${hasSign ? '<img src="' + sign.src + '" alt="">' : ''}<span></span></div></div>` +
            `<button type="button" class="bq-btn" onclick="closeBigBouquet()">Ke Menu</button>`;
        ov.querySelector('.bq-note span').textContent = note ? note.textContent : '';
        window.gxPlace(ov);
        ov.classList.remove('on'); void ov.offsetWidth; ov.classList.add('on');
    };
    window.closeBigBouquet = function () {
        if (ov) ov.classList.remove('on');
        goTo('screen-menu');
    };
})();


// =========================================================================
// 99E. FONT SERAGAM (gaya dialog kasir Love Mart) + judul modal DIY Polaroid tidak tertutup
// =========================================================================
(function () {
    // Caveat itu sempit, Comic Sans lebih lebar -> elemen yang tadinya Caveat dikecilkan sedikit supaya tetap muat
    try {
        // layar Love Receipt: hanya judul & tombol Back yang ikut font seragam (isi struk tetap font awal)
        document.querySelectorAll('#screen-notes .back-btn, #screen-notes .pin-title').forEach((el) => el.classList.add('gx-force-comic'));
        document.querySelectorAll('body *:not(i):not([class*="ph-"])').forEach((el) => {
            if (el.closest('[data-keepfont]') && !el.classList.contains('gx-force-comic')) return;
            const cs = getComputedStyle(el);
            if (/^["']?caveat/i.test(cs.fontFamily)) {
                el.style.setProperty('--gx-fs', (parseFloat(cs.fontSize) * 0.74).toFixed(1) + 'px');
                el.classList.add('gx-fs-adj');
            }
        });
    } catch (e) {}
    document.documentElement.classList.add('gx-comic');

    // modal DIY Polaroid: turunkan dialog sampai tepat di bawah pill Bubu/Dudu
    const openPol = window.openPolaroidStudioModal;
    if (typeof openPol === 'function') {
        window.openPolaroidStudioModal = function () {
            const r = openPol.apply(this, arguments);
            const m = document.getElementById('bm-polaroid-modal'), p = document.querySelector('.bm-avatar-switcher');
            if (m && p) {
                const pad = Math.max(14, p.getBoundingClientRect().bottom - m.getBoundingClientRect().top + 10);
                m.style.setProperty('padding-top', pad + 'px', 'important');
                const d = m.querySelector('.bm-pol-dialog');
                if (d) { d.style.setProperty('margin-top', '0', 'important'); d.style.setProperty('max-height', '100%', 'important'); }
            }
            return r;
        };
    }
})();

// =========================================================================
// 100. PERBAIKAN MOBILE: LOVE CATAPULT + SCRATCH COUPON
//     Ditambahkan tanpa menghapus fungsi lama.
// =========================================================================
(function () {
    const birdFix = {
        rafId: 0,
        resetTimer: 0,
        boundCanvas: null,
        listenersBound: false,
        activePointerId: null
    };

    function stopBirdAnimation() {
        birdGameRunning = false;

        if (birdFix.rafId) {
            cancelAnimationFrame(birdFix.rafId);
            birdFix.rafId = 0;
        }

        if (birdFix.resetTimer) {
            clearTimeout(birdFix.resetTimer);
            birdFix.resetTimer = 0;
        }

        birdFix.activePointerId = null;
        if (bird && bird.isDragging) bird.isDragging = false;
    }

    function readBirdPointerPosition(e) {
        if (!birdCanvas) return null;

        const rect = birdCanvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return null;

        let clientX;
        let clientY;

        if (e.touches && e.touches.length) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else if (e.changedTouches && e.changedTouches.length) {
            clientX = e.changedTouches[0].clientX;
            clientY = e.changedTouches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        if (typeof clientX !== 'number' || typeof clientY !== 'number') return null;

        // Koordinat sentuhan disesuaikan dengan ukuran asli canvas,
        // bukan hanya posisi CSS canvas di layar HP.
        return {
            x: (clientX - rect.left) * (birdCanvas.width / rect.width),
            y: (clientY - rect.top) * (birdCanvas.height / rect.height)
        };
    }

    function bindBirdPointerEvents() {
        if (!birdCanvas || birdFix.boundCanvas === birdCanvas) return;

        birdFix.boundCanvas = birdCanvas;
        birdCanvas.style.touchAction = 'none';

        if ('PointerEvent' in window) {
            birdCanvas.addEventListener('pointerdown', startDrag, { passive: false });

            if (!birdFix.listenersBound) {
                window.addEventListener('pointermove', dragMove, { passive: false });
                window.addEventListener('pointerup', releaseDrag, { passive: true });
                window.addEventListener('pointercancel', function () {
                    if (bird && bird.isDragging) {
                        bird.isDragging = false;
                        birdFix.activePointerId = null;
                        resetBirdShot();
                    }
                }, { passive: true });
                birdFix.listenersBound = true;
            }
        } else {
            birdCanvas.addEventListener('mousedown', startDrag);
            birdCanvas.addEventListener('touchstart', startDrag, { passive: false });

            if (!birdFix.listenersBound) {
                window.addEventListener('mousemove', dragMove, { passive: false });
                window.addEventListener('mouseup', releaseDrag);
                window.addEventListener('touchmove', dragMove, { passive: false });
                window.addEventListener('touchend', releaseDrag, { passive: true });
                birdFix.listenersBound = true;
            }
        }
    }

    // Override fungsi lama agar setiap pengulangan hanya memiliki SATU loop animasi.
    window.initBirdGame = function () {
        stopBirdAnimation();

        birdCanvas = document.getElementById('bird-canvas');
        if (!birdCanvas) return;

        birdCtx = birdCanvas.getContext('2d');
        if (!birdCtx) return;

        birdCanvas.width = 280;
        birdCanvas.height = 200;

        birdsLeft = 10;
        targets = [
            { x: 180, y: 55, w: 26, h: 26, alive: true },
            { x: 205, y: 100, w: 26, h: 26, alive: true },
            { x: 180, y: 145, w: 26, h: 26, alive: true }
        ];

        bindBirdPointerEvents();
        resetBirdShot();

        birdGameRunning = true;
        birdFix.rafId = requestAnimationFrame(updateBirdGame);
    };

    window.resetBirdShot = function () {
        bird = {
            x: 50, y: 150, vx: 0, vy: 0,
            radius: 13, isDragging: false, isFlying: false
        };

        birdFix.activePointerId = null;

        const countEl = document.getElementById('bird-count');
        const statusEl = document.getElementById('bird-status');
        const overlayEl = document.getElementById('bird-win-overlay');

        if (countEl) countEl.innerText = birdsLeft;
        if (statusEl) statusEl.innerText = 'Tarik burung & hancurkan target!';
        if (overlayEl) overlayEl.classList.remove('show');
    };

    window.getCanvasPos = readBirdPointerPosition;

    window.startDrag = function (e) {
        if (!birdGameRunning || bird.isFlying || birdsLeft <= 0) return;

        const pos = readBirdPointerPosition(e);
        if (!pos) return;

        if (Math.hypot(pos.x - sling.x, pos.y - sling.y) < 35) {
            if (e.cancelable) e.preventDefault();
            bird.isDragging = true;
            birdFix.activePointerId = (typeof e.pointerId === 'number') ? e.pointerId : null;
        }
    };

    window.dragMove = function (e) {
        if (!birdGameRunning || !bird.isDragging) return;

        if (
            birdFix.activePointerId !== null &&
            typeof e.pointerId === 'number' &&
            e.pointerId !== birdFix.activePointerId
        ) return;

        const pos = readBirdPointerPosition(e);
        if (!pos) return;

        if (e.cancelable) e.preventDefault();

        let dx = pos.x - sling.x;
        let dy = pos.y - sling.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 55) {
            dx = (dx / dist) * 55;
            dy = (dy / dist) * 55;
        }

        bird.x = sling.x + dx;
        bird.y = sling.y + dy;
    };

    window.releaseDrag = function (e) {
        if (!bird || !bird.isDragging) return;

        if (
            birdFix.activePointerId !== null &&
            e && typeof e.pointerId === 'number' &&
            e.pointerId !== birdFix.activePointerId
        ) return;

        bird.isDragging = false;
        bird.isFlying = true;
        birdFix.activePointerId = null;

        birdsLeft = Math.max(0, birdsLeft - 1);

        const countEl = document.getElementById('bird-count');
        if (countEl) countEl.innerText = birdsLeft;

        bird.vx = (sling.x - bird.x) * 0.28;
        bird.vy = (sling.y - bird.y) * 0.28;
    };

    window.updateBirdGame = function () {
        if (!birdGameRunning || !birdCanvas || !birdCtx) {
            birdFix.rafId = 0;
            return;
        }

        if (bird.isFlying) {
            bird.x += bird.vx;
            bird.y += bird.vy;
            bird.vy += 0.25;

            targets.forEach(t => {
                if (
                    t.alive &&
                    bird.x + bird.radius > t.x &&
                    bird.x - bird.radius < t.x + t.w &&
                    bird.y + bird.radius > t.y &&
                    bird.y - bird.radius < t.y + t.h
                ) {
                    t.alive = false;
                }
            });

            if (targets.length && targets.every(t => !t.alive)) {
                bird.isFlying = false;
                birdGameRunning = false;
                birdFix.rafId = 0;

                if (typeof window.unlockGameMission === 'function') {
                    window.unlockGameMission('birds');
                }

                const overlayEl = document.getElementById('bird-win-overlay');
                const statusEl = document.getElementById('bird-status');
                if (overlayEl) overlayEl.classList.add('show');
                if (statusEl) statusEl.innerText = 'Hebat! Semua hati hancur!';
                return;
            }

            const margin = bird.radius + 8;
            const birdLeftPlayfield =
                bird.x > birdCanvas.width + margin ||
                bird.x < -margin ||
                bird.y > birdCanvas.height + margin ||
                bird.y < -margin;

            if (birdLeftPlayfield) {
                bird.isFlying = false;

                const statusEl = document.getElementById('bird-status');

                if (birdsLeft > 0) {
                    if (statusEl) statusEl.innerText = 'Lanjut burung berikutnya...';

                    if (birdFix.resetTimer) clearTimeout(birdFix.resetTimer);
                    birdFix.resetTimer = setTimeout(() => {
                        birdFix.resetTimer = 0;
                        if (birdGameRunning) resetBirdShot();
                    }, 500);
                } else {
                    birdGameRunning = false;
                    birdFix.rafId = 0;
                    if (statusEl) statusEl.innerText = 'Kesempatan habis! Mengulang...';

                    if (birdFix.resetTimer) clearTimeout(birdFix.resetTimer);
                    birdFix.resetTimer = setTimeout(() => {
                        birdFix.resetTimer = 0;
                        const screen = document.getElementById('screen-game-birds');
                        if (screen && screen.classList.contains('active')) {
                            initBirdGame();
                        }
                    }, 1100);
                    return;
                }
            }
        }

        drawBirdGame();

        if (birdGameRunning) {
            birdFix.rafId = requestAnimationFrame(updateBirdGame);
        } else {
            birdFix.rafId = 0;
        }
    };

    // Hentikan loop ketika pemain keluar dari layar Love Catapult.
    const previousGoToForBirdFix = window.goTo;
    if (typeof previousGoToForBirdFix === 'function' && !window.__birdGoToWrapped) {
        window.__birdGoToWrapped = true;
        window.goTo = function (screenId) {
            if (screenId !== 'screen-game-birds') {
                stopBirdAnimation();
            }
            return previousGoToForBirdFix.apply(this, arguments);
        };
    }
})();


// =========================================================================
// 101. SCRATCH CARD RAMAH HP
//     Pointer Events, koordinat responsif, dan tidak menimpa handler global.
// =========================================================================
window.initScratchCard = function (canvasId, btnId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const targetBtn = document.getElementById(btnId);

    // Jangan menggambar ulang lapisan kupon setiap kali layar dirender.
    if (canvas.dataset.scratchInitialized === 'true') {
        if (canvas.dataset.scratchDone === 'true' && targetBtn) {
            targetBtn.style.display = (canvasId === 'scratch-canvas-master') ? 'block' : 'flex';
        }
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.dataset.scratchInitialized = 'true';
    canvas.width = 260;
    canvas.height = 95;
    canvas.style.touchAction = 'none';

    const totalSamples = Math.ceil((canvas.width * canvas.height * 4) / 32);
    let isScratching = false;
    let moveCounter = 0;
    let lastPoint = null;

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#555';
    ctx.font = "bold 16px 'Comic Sans MS','Chalkboard SE',sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Gesek / Gosok Disini', canvas.width / 2, canvas.height / 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 44;

    function getScratchPoint(e) {
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return null;

        let clientX;
        let clientY;

        if (e.touches && e.touches.length) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else if (e.changedTouches && e.changedTouches.length) {
            clientX = e.changedTouches[0].clientX;
            clientY = e.changedTouches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        if (typeof clientX !== 'number' || typeof clientY !== 'number') return null;

        return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height)
        };
    }

    function finishScratch() {
        if (canvas.dataset.scratchDone === 'true') return;

        canvas.dataset.scratchDone = 'true';
        isScratching = false;
        lastPoint = null;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.pointerEvents = 'none';

        if (canvasId === 'scratch-canvas-master') {
            window.masterCouponScratched = true;
        }

        if (targetBtn) {
            targetBtn.style.display = (canvasId === 'scratch-canvas-master') ? 'block' : 'flex';
        }

        // Perbarui daftar misi/kupon dan biarkan indikator kado ikut terbarui.
        if (typeof window.renderLoveCouponsScreen === 'function') {
            window.renderLoveCouponsScreen();
        }

        window.dispatchEvent(new Event('loveCouponScratchComplete'));
    }

    function checkScratchProgress() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let transparentSamples = 0;
        let sampleCount = 0;

        // Baca setiap 8 piksel agar tetap ringan di Safari iPhone.
        for (let i = 3; i < imageData.length; i += 32) {
            sampleCount++;
            if (imageData[i] < 10) transparentSamples++;
        }

        if (sampleCount && transparentSamples / Math.min(sampleCount, totalSamples) > 0.40) {
            finishScratch();
        }
    }

    function scratchStart(e) {
        if (canvas.dataset.scratchDone === 'true') return;

        const point = getScratchPoint(e);
        if (!point) return;

        if (e.cancelable) e.preventDefault();

        isScratching = true;
        lastPoint = point;
        moveCounter = 0;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 22, 0, Math.PI * 2);
        ctx.fill();

        checkScratchProgress();

        if (e.pointerId !== undefined && canvas.setPointerCapture) {
            try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
        }
    }

    function scratchMove(e) {
        if (!isScratching || canvas.dataset.scratchDone === 'true') return;

        const point = getScratchPoint(e);
        if (!point) return;

        if (e.cancelable) e.preventDefault();

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();

        if (lastPoint) {
            ctx.moveTo(lastPoint.x, lastPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        } else {
            ctx.arc(point.x, point.y, 22, 0, Math.PI * 2);
            ctx.fill();
        }

        lastPoint = point;
        moveCounter++;

        if (moveCounter % 4 === 0) checkScratchProgress();
    }

    function scratchEnd() {
        isScratching = false;
        lastPoint = null;
    }

    if ('PointerEvent' in window) {
        canvas.addEventListener('pointerdown', scratchStart, { passive: false });
        canvas.addEventListener('pointermove', scratchMove, { passive: false });
        canvas.addEventListener('pointerup', scratchEnd, { passive: true });
        canvas.addEventListener('pointercancel', scratchEnd, { passive: true });
        canvas.addEventListener('lostpointercapture', scratchEnd, { passive: true });
    } else {
        canvas.addEventListener('mousedown', scratchStart);
        canvas.addEventListener('mousemove', scratchMove);
        window.addEventListener('mouseup', scratchEnd);

        canvas.addEventListener('touchstart', scratchStart, { passive: false });
        canvas.addEventListener('touchmove', scratchMove, { passive: false });
        window.addEventListener('touchend', scratchEnd, { passive: true });
        window.addEventListener('touchcancel', scratchEnd, { passive: true });
    }
};


// =========================================================================
// 102. SAMAKAN FONT SEMUA TOMBOL BACK DENGAN FONT KOMIK APLIKASI
// =========================================================================
(function () {
    function restoreBackButtonFont() {
        document.querySelectorAll('#app-container .back-btn, #app-container .bm-back-pill').forEach((button) => {
            button.style.setProperty('font-family', "'Comic Sans MS', 'Chalkboard SE', 'Quicksand', sans-serif", 'important');
            button.style.setProperty('font-weight', '900', 'important');
            button.style.setProperty('letter-spacing', '0.2px', 'important');
        });
    }

    restoreBackButtonFont();
    document.addEventListener('DOMContentLoaded', restoreBackButtonFont);
    window.addEventListener('pageshow', restoreBackButtonFont);
})();

// =========================================================================
// END PERBAIKAN MOBILE
// =========================================================================

// =========================================================================
// 103. PERBAIKAN MUSIK HP: MULAI DARI LAGU PERTAMA & DETEKSI AUTOPLAY
//     Ditambahkan tanpa menghapus fungsi playlist yang sudah ada.
// =========================================================================
(function () {
    const FIRST_TRACK_INDEX = 0;
    const isMobileMusicDevice = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');

    function setMusicHint(message) {
        const hint = document.getElementById('sp-status-hint');
        if (hint) hint.textContent = message;
    }

    function refreshMusicUI() {
        if (typeof renderPlaylistUI === 'function') {
            try { renderPlaylistUI(); } catch (err) { console.warn('Music UI could not refresh:', err); }
        }
    }

    function markMusicPlaying() {
        isPlaying = true;
        musicInitialized = true;
        usingYouTube = false;
        setMusicHint('Memutar Lagu...');
        refreshMusicUI();
    }

    function markMusicBlocked(error) {
        isPlaying = false;
        musicInitialized = false;
        usingYouTube = false;

        if (error && error.name === 'NotAllowedError') {
            setMusicHint('Musik diblokir browser HP. Buka menu Musik, lalu tekan tombol Play sekali.');
        } else {
            setMusicHint('File lagu belum bisa dimuat. Periksa nama file MP3 di folder audio GitHub.');
        }
        refreshMusicUI();
    }

    function playTrackSource(track, useAlternate) {
        if (!audioEl || !track) {
            markMusicBlocked(new Error('Audio player atau data lagu tidak ditemukan.'));
            return;
        }

        const source = useAlternate && track.altSrc ? track.altSrc : track.src;
        if (!source) {
            markMusicBlocked(new Error('Alamat file audio kosong.'));
            return;
        }

        audioEl.pause();
        audioEl.preload = 'auto';
        audioEl.src = source;
        audioEl.load();
        try { audioEl.currentTime = 0; } catch (err) { /* metadata mungkin belum tersedia */ }

        isPlaying = true; // ikon play/pause mencerminkan proses mulai; akan dikoreksi jika browser menolak.
        usingYouTube = false;
        refreshMusicUI();

        let playRequest;
        try {
            // play() dipanggil langsung dari sentuhan pengguna (amplop atau tombol Play).
            playRequest = audioEl.play();
        } catch (error) {
            handleMusicPlayError(error, track, useAlternate);
            return;
        }

        if (playRequest && typeof playRequest.then === 'function') {
            playRequest.then(markMusicPlaying).catch((error) => {
                handleMusicPlayError(error, track, useAlternate);
            });
        } else {
            markMusicPlaying();
        }
    }

    function handleMusicPlayError(error, track, usedAlternate) {
        // NotAllowedError berarti browser meminta tindakan Play langsung dari pengguna.
        if (error && error.name === 'NotAllowedError') {
            markMusicBlocked(error);
            return;
        }

        // Jika nama file utama tidak cocok huruf besar/kecil, coba nama alternatif yang sudah ada.
        if (!usedAlternate && track.altSrc && track.altSrc !== track.src) {
            playTrackSource(track, true);
            return;
        }

        isPlaying = false;
        musicInitialized = false;
        usingYouTube = false;
        refreshMusicUI();

        // Pemutar YouTube tersembunyi tetap menjadi cadangan di desktop.
        // Pada browser HP, utamakan tombol Play pada file MP3 agar izin sentuhan tidak hilang.
        if (!isMobileMusicDevice && track.ytId && typeof startYouTubeStream === 'function') {
            isPlaying = true;
            usingYouTube = true;
            setMusicHint('Mencoba pemutar musik alternatif...');
            refreshMusicUI();
            startYouTubeStream(track.ytId);
        } else {
            markMusicBlocked(error);
        }
    }

    function playTrackFromBeginning(index) {
        if (!Array.isArray(playlistData) || !playlistData.length) return;
        const safeIndex = ((Number(index) || 0) % playlistData.length + playlistData.length) % playlistData.length;
        currentTrackIdx = safeIndex;

        if (typeof stopAllMusic === 'function') stopAllMusic();
        if (audioEl) {
            audioEl.pause();
            try { audioEl.currentTime = 0; } catch (err) {}
        }

        const progress = document.getElementById('sp-progress-fill');
        const currentTime = document.getElementById('sp-current-time');
        if (progress) progress.style.width = '0%';
        if (currentTime) currentTime.textContent = '0:00';

        playTrackSource(playlistData[safeIndex], false);
    }

    // Fungsi playlist tetap bisa dipakai tombol Next, Previous, dan daftar lagu.
    window.selectAndPlayTrack = playTrackFromBeginning;

    // Lagu pertama (bukan lagu kedua) mulai dari detik 00:00 saat amplop pertama kali disentuh.
    window.openMailbox = function () {
        const mailboxEl = document.getElementById('mailbox');
        if (mailboxEl) mailboxEl.classList.add('open');

        if (!musicInitialized && !isPlaying) {
            playTrackFromBeginning(FIRST_TRACK_INDEX);
        }

        setTimeout(() => {
            if (typeof goTo === 'function') goTo('screen-pin');
        }, 750);
    };

    // Tombol Play di layar Musik menjadi cara retry yang sah saat autoplay HP ditolak.
    window.toggleMusic = function () {
        if (isPlaying) {
            wasPlayingBeforeGame = false;
            if (typeof pauseActiveMusicOnly === 'function') pauseActiveMusicOnly();
            setMusicHint('Musik Dijeda');
            return;
        }

        if (usingYouTube && ytReady && ytPlayer) {
            try {
                isPlaying = true;
                ytPlayer.playVideo();
                setMusicHint('Memutar Musik Asli...');
                refreshMusicUI();
            } catch (error) {
                markMusicBlocked(error);
            }
            return;
        }

        if (audioEl && audioEl.getAttribute('src')) {
            // Melanjutkan dari posisi jeda. Jika sudah di ujung lagu, mulai lagi dari 00:00.
            try {
                if (audioEl.ended || (Number.isFinite(audioEl.duration) && audioEl.duration > 0 && audioEl.currentTime >= audioEl.duration)) {
                    audioEl.currentTime = 0;
                }
            } catch (err) {}

            let request;
            try { request = audioEl.play(); }
            catch (error) { markMusicBlocked(error); return; }

            isPlaying = true;
            refreshMusicUI();
            if (request && typeof request.then === 'function') {
                request.then(markMusicPlaying).catch(markMusicBlocked);
            } else {
                markMusicPlaying();
            }
            return;
        }

        playTrackFromBeginning(currentTrackIdx || FIRST_TRACK_INDEX);
    };

    // Siapkan tampilan playlist dengan lagu pertama terpilih sebelum pengguna membuka layar Musik.
    currentTrackIdx = FIRST_TRACK_INDEX;
    if (audioEl) {
        audioEl.preload = 'auto';
        audioEl.setAttribute('playsinline', '');
    }
    refreshMusicUI();
    setMusicHint('Sentuh amplop untuk memulai musik. Jika belum terdengar, tekan Play di menu Musik.');
})();

// =========================================================================
// END PERBAIKAN MUSIK HP
// =========================================================================


// =========================================================================
// 104. FINAL FIX: ARAH JALAN 3D DI IPHONE + MUSIK MULAI DARI DETIK 00:00
//      Tambahan ini mempertahankan seluruh fitur sebelumnya.
// =========================================================================
(function () {
    // ---------- 3D LOVE MART: gerak maju/mundur mengikuti arah kamera ----------
    // #bm-scene sudah diputar sesuai yaw kamera. Karena itu, translasi dunia
    // harus memakai sumbu Z lokal saja; menghitung sin/cos yaw lagi membuat
    // rotasi terhitung dua kali dan karakter tampak bergerak menyamping.
    window.bmStepWalk = function (delta) {
        const direction = Number(delta) >= 0 ? 1 : -1;
        const stepSize = 75;
        bmCamZ += direction * stepSize;
        bmCamZ = Math.max(-650, Math.min(380, bmCamZ));
        playWalkCycle();
        updateTransform();
    };

    // Drag untuk memutar pandangan hanya dimulai dari area ruangan, bukan
    // ketika jari menyentuh tombol Maju/Mundur, Back, rak, atau kontrol lain.
    window.initDragLook = function () {
        const viewport = document.getElementById('bm-viewport');
        if (!viewport || viewport.dataset.bmPointerLookReady === '1') return;
        viewport.dataset.bmPointerLookReady = '1';
        viewport.style.touchAction = 'none';

        const ignored = 'button, input, select, textarea, a, .bm-hud-controls, .bm-back-pill, .bm-char-btn, #bm-cart-bar, #bm-held-polaroid, .bm-modal-backdrop, .bm-product-box, .bm-counter-action';
        let activePointerId = null;
        let lastPointerX = 0;

        viewport.addEventListener('pointerdown', function (event) {
            if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
            if (event.target && event.target.closest && event.target.closest(ignored)) return;
            activePointerId = event.pointerId;
            lastPointerX = event.clientX;
            isDragging = true;
            hasMoved = false;
            try { viewport.setPointerCapture(event.pointerId); } catch (err) {}
        }, { passive: true });

        viewport.addEventListener('pointermove', function (event) {
            if (!isDragging || activePointerId !== event.pointerId) return;
            const deltaX = event.clientX - lastPointerX;
            if (Math.abs(deltaX) > 2) {
                hasMoved = true;
                bmCamYaw += deltaX * 0.28;
                lastPointerX = event.clientX;
                updateTransform();
            }
        }, { passive: true });

        function finishPointer(event) {
            if (activePointerId === null) return;
            if (event && event.pointerId !== undefined && event.pointerId !== activePointerId) return;
            isDragging = false;
            activePointerId = null;
        }
        viewport.addEventListener('pointerup', finishPointer, { passive: true });
        viewport.addEventListener('pointercancel', finishPointer, { passive: true });
        viewport.addEventListener('lostpointercapture', finishPointer, { passive: true });
    };

    // ---------- AUDIO: first track benar-benar mulai dari 00:00 ----------
    const FIRST_TRACK_INDEX = 0;
    let activeAudioTrack = false;
    let startingTrack = false;
    let activeAudioSources = [];

    function setMusicMessage(message) {
        const hint = document.getElementById('sp-status-hint');
        if (hint) hint.textContent = message;
    }

    function updateMusicDisplay() {
        if (typeof renderPlaylistUI === 'function') {
            try { renderPlaylistUI(); } catch (err) { console.warn('Playlist UI:', err); }
        }
    }

    function getAudioCandidates(track, trackIndex) {
        // Gunakan nama file yang benar-benar ada di folder audio milik pengguna.
        // Jangan kirim beberapa <source> sekaligus: Safari/iPhone dapat berhenti
        // pada sumber pertama yang 404 dan event error lama menandai lagu gagal.
        const exactFiles = [
            'audio/anugrahterindah.mp3',
            'audio/orangyangsama.mp3',
            'audio/sempurna.mp3',
            'audio/2001x.mp3'
        ];
        const exactPath = exactFiles[trackIndex];
        return [exactPath || (track && (track.altSrc || track.src))].filter(Boolean);
    }

    function finishMusicStart(trackIndex) {
        if (trackIndex !== currentTrackIdx) return;
        startingTrack = false;
        activeAudioTrack = true;
        isPlaying = true;
        musicInitialized = true;
        usingYouTube = false;
        wasPlayingBeforeGame = false;
        setMusicMessage('Memutar ' + playlistData[trackIndex].title + ' dari 00:00');
        updateMusicDisplay();
    }

    function musicStartFailed(error) {
        startingTrack = false;
        isPlaying = false;
        musicInitialized = false;
        activeAudioTrack = false;
        updateMusicDisplay();
        if (error && error.name === 'NotAllowedError') {
            setMusicMessage('iPhone memerlukan sentuhan langsung. Buka Musik lalu tekan Play.');
        } else {
            setMusicMessage('File lagu tidak ditemukan/format tidak didukung. Periksa nama MP3 di folder audio.');
        }
    }

    function playTrackAtZero(index) {
        if (!Array.isArray(playlistData) || !playlistData.length || !audioEl) {
            musicStartFailed(new Error('Pemutar audio atau playlist tidak ditemukan.'));
            return;
        }
        const safeIndex = ((Number(index) || 0) % playlistData.length + playlistData.length) % playlistData.length;
        const track = playlistData[safeIndex];
        currentTrackIdx = safeIndex;
        startingTrack = true;
        activeAudioTrack = true;
        isPlaying = true;
        usingYouTube = false;

        if (typeof stopAllMusic === 'function') stopAllMusic();
        audioEl.pause();
        audioEl.preload = 'auto';
        audioEl.setAttribute('playsinline', '');
        activeAudioSources = getAudioCandidates(track, safeIndex);

        // Pasang SATU URL MP3 yang telah dipastikan benar, bukan daftar source
        // dengan beberapa nama tebakan. Ini menghindari Safari berhenti di 404.
        audioEl.src = activeAudioSources[0];

        const progress = document.getElementById('sp-progress-fill');
        const current = document.getElementById('sp-current-time');
        if (progress) progress.style.width = '0%';
        if (current) current.textContent = '0:00';
        updateMusicDisplay();

        // load() me-reset waktu media ke awal. Tidak perlu menunggu event metadata
        // sebelum play(), agar izin sentuhan iOS Safari tidak hilang.
        audioEl.load();
        try { audioEl.currentTime = 0; } catch (err) {}

        let request;
        try {
            request = audioEl.play();
        } catch (error) {
            musicStartFailed(error);
            return;
        }
        if (request && typeof request.then === 'function') {
            request.then(function () {
                finishMusicStart(safeIndex);
            }).catch(musicStartFailed);
        } else {
            finishMusicStart(safeIndex);
        }
    }

    // Pastikan posisi benar-benar 00:00 setiap kali lagu baru dimulai.
    if (audioEl && !audioEl.dataset.bmMusicEventsReady) {
        audioEl.dataset.bmMusicEventsReady = '1';
        audioEl.addEventListener('loadedmetadata', function () {
            if (startingTrack) {
                try { audioEl.currentTime = 0; } catch (err) {}
            }
        });
        audioEl.addEventListener('playing', function () {
            if (startingTrack) finishMusicStart(currentTrackIdx);
        });
        audioEl.addEventListener('error', function () {
            if (startingTrack) musicStartFailed(audioEl.error || new Error('Audio gagal dimuat.'));
        });
    }

    window.selectAndPlayTrack = playTrackAtZero;
    window.nextTrack = function () { playTrackAtZero((currentTrackIdx + 1) % playlistData.length); };
    window.prevTrack = function () { playTrackAtZero((currentTrackIdx - 1 + playlistData.length) % playlistData.length); };

    // Memanggil fungsi ini dari klik amplop (gesture pengguna) adalah titik awal
    // pemutaran yang diizinkan iOS. Autoplay saat halaman baru dibuka tetap diblokir
    // oleh kebijakan browser dan tidak bisa dipaksa oleh JavaScript.
    window.openMailbox = function () {
        const mailboxEl = document.getElementById('mailbox');
        if (mailboxEl) mailboxEl.classList.add('open');
        if (!musicInitialized && !isPlaying) playTrackAtZero(FIRST_TRACK_INDEX);
        setTimeout(function () {
            if (typeof goTo === 'function') goTo('screen-pin');
        }, 750);
    };

    window.toggleMusic = function () {
        if (isPlaying) {
            wasPlayingBeforeGame = false;
            if (typeof pauseActiveMusicOnly === 'function') pauseActiveMusicOnly();
            isPlaying = false;
            setMusicMessage('Musik dijeda');
            updateMusicDisplay();
            return;
        }

        if (usingYouTube && ytReady && ytPlayer) {
            try {
                isPlaying = true;
                ytPlayer.playVideo();
                setMusicMessage('Memutar Musik Asli...');
                updateMusicDisplay();
            } catch (error) { musicStartFailed(error); }
            return;
        }

        if (activeAudioTrack && audioEl && activeAudioSources.length) {
            let request;
            try { request = audioEl.play(); }
            catch (error) { musicStartFailed(error); return; }
            if (request && typeof request.then === 'function') {
                request.then(function () {
                    isPlaying = true;
                    musicInitialized = true;
                    setMusicMessage('Melanjutkan ' + playlistData[currentTrackIdx].title);
                    updateMusicDisplay();
                }).catch(musicStartFailed);
            } else {
                isPlaying = true;
                musicInitialized = true;
                updateMusicDisplay();
            }
            return;
        }

        // Ketuk Play ketika lagu belum pernah berhasil dimuat: mulai lagu pertama.
        playTrackAtZero(FIRST_TRACK_INDEX);
    };

    // Reset pilihan lagu ke track pertama untuk kunjungan baru; belum diputar
    // sampai amplop disentuh agar sesuai aturan autoplay iPhone.
    currentTrackIdx = FIRST_TRACK_INDEX;
    if (audioEl) {
        audioEl.pause();
        audioEl.removeAttribute('src');
        audioEl.replaceChildren();
        audioEl.preload = 'auto';
        audioEl.setAttribute('playsinline', '');
    }
    isPlaying = false;
    musicInitialized = false;
    activeAudioTrack = false;
    updateMusicDisplay();
    setMusicMessage('Lagu pertama siap. Sentuh amplop untuk memulai dari 00:00.');
})();

// =========================================================================
// END FINAL FIX
// =========================================================================


// =========================================================================
// 105. OVERRIDE FINAL PEMUTAR MUSIK - PATH AUDIO SESUAI NAMA FILE ASLI
//     Patch ini sengaja memakai satu URL MP3 yang pasti, bukan daftar sumber
//     alternatif. play() dipanggil langsung dari klik pengguna agar ramah iOS.
// =========================================================================
(function () {
    const exactAudioPaths = [
        'audio/anugrahterindah.mp3',
        'audio/orangyangsama.mp3',
        'audio/sempurna.mp3',
        'audio/2001x.mp3'
    ];

    if (!Array.isArray(playlistData) || !audioEl) {
        console.error('Pemutar musik tidak menemukan playlist atau elemen audio.');
        return;
    }

    // Samakan sumber playlist dengan nama file yang tampak pada folder audio.
    playlistData.forEach(function (track, index) {
        if (exactAudioPaths[index]) {
            track.src = exactAudioPaths[index];
            track.altSrc = exactAudioPaths[index];
        }
    });

    const firstTrackIndex = 0;
    let musicRequestId = 0;

    function musicHint(message) {
        const hint = document.getElementById('sp-status-hint');
        if (hint) hint.textContent = message;
    }

    function refreshMusic() {
        try {
            if (typeof renderPlaylistUI === 'function') renderPlaylistUI();
        } catch (error) {
            console.warn('Playlist UI tidak dapat diperbarui:', error);
        }
    }

    function pauseOtherMusic() {
        if (ytProgressInterval) {
            clearInterval(ytProgressInterval);
            ytProgressInterval = null;
        }
        try {
            if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();
        } catch (error) {}
        usingYouTube = false;
    }

    function playExactTrack(index) {
        const safeIndex = ((Number(index) || 0) % playlistData.length + playlistData.length) % playlistData.length;
        const track = playlistData[safeIndex];
        const requestId = ++musicRequestId;
        currentTrackIdx = safeIndex;

        pauseOtherMusic();
        audioEl.pause();
        audioEl.preload = 'auto';
        audioEl.setAttribute('playsinline', '');
        audioEl.setAttribute('webkit-playsinline', '');
        audioEl.removeAttribute('crossorigin');

        // Jangan memakai load() atau banyak elemen <source> sebelum play().
        // Pada Safari iPhone, play() harus tetap dipanggil langsung dalam gesture.
        audioEl.src = exactAudioPaths[safeIndex] || track.src;
        try { audioEl.currentTime = 0; } catch (error) {}

        const progress = document.getElementById('sp-progress-fill');
        const current = document.getElementById('sp-current-time');
        if (progress) progress.style.width = '0%';
        if (current) current.textContent = '0:00';

        isPlaying = false;
        musicInitialized = false;
        wasPlayingBeforeGame = false;
        refreshMusic();
        musicHint('Memuat ' + track.title + '...');

        let request;
        try {
            // Panggilan ini berlangsung langsung dari klik amplop/playlist/Play.
            request = audioEl.play();
        } catch (error) {
            handlePlayFailure(error, track, requestId);
            return;
        }

        if (request && typeof request.then === 'function') {
            request.then(function () {
                if (requestId !== musicRequestId) return;
                isPlaying = true;
                musicInitialized = true;
                usingYouTube = false;
                refreshMusic();
                musicHint('Memutar ' + track.title + ' dari 00:00');
            }).catch(function (error) {
                handlePlayFailure(error, track, requestId);
            });
        } else {
            if (requestId === musicRequestId) {
                isPlaying = true;
                musicInitialized = true;
                refreshMusic();
                musicHint('Memutar ' + track.title + ' dari 00:00');
            }
        }
    }

    function handlePlayFailure(error, track, requestId) {
        if (requestId !== musicRequestId) return;
        isPlaying = false;
        musicInitialized = false;
        refreshMusic();
        if (error && error.name === 'NotAllowedError') {
            musicHint('Browser HP menahan audio. Ketuk tombol Play sekali untuk memulai.');
        } else {
            const code = audioEl && audioEl.error ? audioEl.error.code : '';
            musicHint('Gagal memutar ' + track.title + ' (' + (error && error.name ? error.name : 'audio error') + (code ? ', kode ' + code : '') + '). Periksa file: ' + track.src);
            console.error('Gagal memutar audio:', track.src, error, audioEl ? audioEl.error : null);
        }
    }

    function resumeCurrentTrack() {
        if (!audioEl || !audioEl.getAttribute('src')) {
            playExactTrack(currentTrackIdx);
            return;
        }
        let request;
        try {
            request = audioEl.play();
        } catch (error) {
            handlePlayFailure(error, playlistData[currentTrackIdx], ++musicRequestId);
            return;
        }
        const requestId = ++musicRequestId;
        if (request && typeof request.then === 'function') {
            request.then(function () {
                if (requestId !== musicRequestId) return;
                isPlaying = true;
                musicInitialized = true;
                refreshMusic();
                musicHint('Melanjutkan ' + playlistData[currentTrackIdx].title);
            }).catch(function (error) {
                handlePlayFailure(error, playlistData[currentTrackIdx], requestId);
            });
        } else {
            isPlaying = true;
            musicInitialized = true;
            refreshMusic();
        }
    }

    // Ganti fungsi global yang dipakai tombol, playlist, dan tombol Next/Previous.
    window.selectAndPlayTrack = playExactTrack;
    window.nextTrack = function () {
        playExactTrack((currentTrackIdx + 1) % playlistData.length);
    };
    window.prevTrack = function () {
        playExactTrack((currentTrackIdx - 1 + playlistData.length) % playlistData.length);
    };
    window.toggleMusic = function () {
        if (isPlaying) {
            musicRequestId++;
            if (typeof pauseActiveMusicOnly === 'function') pauseActiveMusicOnly();
            else audioEl.pause();
            isPlaying = false;
            musicHint('Musik dijeda');
            refreshMusic();
            return;
        }
        resumeCurrentTrack();
    };

    // Amplop disentuh: mulai dari lagu pertama, detik 00:00.
    window.openMailbox = function () {
        const mailboxEl = document.getElementById('mailbox');
        if (mailboxEl) mailboxEl.classList.add('open');
        if (!musicInitialized && !isPlaying) playExactTrack(firstTrackIndex);
        setTimeout(function () {
            if (typeof goTo === 'function') goTo('screen-pin');
        }, 750);
    };

    // Listener ended bawaan app.js tetap dipakai; tidak menambah listener kedua
    // agar lagu tidak lompat dua nomor sekaligus setelah selesai.

    // Tampilkan lagu pertama pada UI, tetapi jangan autoplay sebelum sentuhan.
    currentTrackIdx = firstTrackIndex;
    isPlaying = false;
    musicInitialized = false;
    usingYouTube = false;
    refreshMusic();
    musicHint('Lagu pertama siap. Sentuh amplop atau tekan Play untuk memulai.');
})();

// =========================================================================
// END OVERRIDE FINAL PEMUTAR MUSIK
// =========================================================================

// =========================================================================
// 105. POLAROID GALLERY HOTFIX - CLICK STABLE + RENDER RINGAN
//      Mempertahankan alur foto, keranjang, modal, dan seluruh fitur lama.
//      CSS/avatar/modal hanya diinisialisasi sekali. Klik foto tidak dibatalkan
//      oleh flag drag kamera yang tertinggal.
// =========================================================================
(function () {
    const STYLE_ID = 'bm-gallery-click-fix-style';

    function itemKey(item, index) {
        if (!item) return 'missing:' + index;
        if (item.isEmpty) return 'empty:' + index;
        return 'photo:' + String(item.url || '') + '|' + String(item.title || '');
    }

    function updateCard(card, item, index) {
        if (!card || !item) return;
        if (item.isEmpty) {
            card.className = 'bm-product-box empty-slot';
            const badge = card.querySelector('.bm-price-tag');
            if (badge) badge.textContent = 'KOSONG';
            const label = card.querySelector('.bm-pack-label');
            if (label) label.textContent = 'Klik Isi Foto';
            return;
        }

        const cartPos = bmCart.findIndex(entry => entry.index === index);
        const selected = cartPos !== -1;
        card.className = `bm-product-box ${item.pack || 'pack-red'} ${selected ? 'in-cart' : ''}`;
        const badge = card.querySelector('.bm-price-tag');
        if (badge) badge.textContent = selected ? `PILIH #${cartPos + 1}` : `#${index + 1}`;
    }

    // Kartu dibuat dengan alur klik asli. Tidak memakai hasMoved sebagai
    // syarat klik karena flag itu hanya untuk drag kamera, bukan untuk foto.
    window.createCard = function (item, index) {
        const card = document.createElement('div');
        card.dataset.bmPhotoIndex = String(index);
        card.dataset.bmItemKey = itemKey(item, index);
        card.style.touchAction = 'manipulation';
        card.style.cursor = 'pointer';

        if (item.isEmpty) {
            card.className = 'bm-product-box empty-slot';
            card.innerHTML = `<span class="bm-price-tag">KOSONG</span>${SVG_ICON_CAMERA}<div class="bm-pack-label">Klik Isi Foto</div>`;
        } else {
            const cartPos = bmCart.findIndex(entry => entry.index === index);
            const selected = cartPos !== -1;
            card.className = `bm-product-box ${item.pack || 'pack-red'} ${selected ? 'in-cart' : ''}`;
            card.innerHTML = `
                <span class="bm-price-tag">${selected ? `PILIH #${cartPos + 1}` : `#${index + 1}`}</span>
                <img src="${item.url}" alt="${item.title || `Kenangan #${index + 1}`}" decoding="async" draggable="false" onerror="this.onerror=null;this.src='img/bubu1.jpeg'">
                <div class="bm-pack-label">${item.title || `Kenangan #${index + 1}`}</div>
            `;
        }

        // Gunakan onclick langsung agar perilakunya tetap sama seperti versi
        // awal yang sudah pernah bekerja di perangkat pengguna.
        card.onclick = function () {
            const currentItem = bmPhotos[index];
            if (!currentItem) return;
            if (currentItem.isEmpty) {
                targetEmptySlotIdx = index;
                openCameraModal();
            } else {
                openPhotoDetailModal(currentItem, index);
            }
        };
        return card;
    };

    // Inisialisasi ruangan 3D, modal dan style hanya sekali. Saat memilih foto,
    // cukup perbarui badge/kartu yang berubah; modal tidak dibongkar ulang.
    window.renderGallery = function () {
        const leftShelf = document.getElementById('bm-left-shelf');
        const rightShelf = document.getElementById('bm-right-shelf');
        if (!leftShelf || !rightShelf) return;

        if (window.__bmGalleryInitializedOnce !== true) {
            initAuthenticStylesAndAvatars();
            window.__bmGalleryInitializedOnce = true;
        }

        if (!document.getElementById(STYLE_ID)) {
            const style = document.createElement('style');
            style.id = STYLE_ID;
            style.textContent = `
                #bm-left-shelf, #bm-right-shelf, .bm-shelf-unit { pointer-events: auto !important; }
                .bm-product-box { pointer-events: auto !important; touch-action: manipulation !important; cursor: pointer !important; }
                .bm-product-box > img, .bm-product-box > .bm-price-tag, .bm-product-box > .bm-pack-label,
                .bm-product-box > svg { pointer-events: none !important; }
            `;
            document.head.appendChild(style);
        }

        function syncShelf(shelf, startIndex, endIndex) {
            for (let index = startIndex; index < endIndex; index++) {
                const localIndex = index - startIndex;
                const item = bmPhotos[index];
                if (!item) continue;

                let card = shelf.children[localIndex];
                const key = itemKey(item, index);
                if (!card || card.dataset.bmItemKey !== key) {
                    const replacement = window.createCard(item, index);
                    if (card) shelf.replaceChild(replacement, card);
                    else shelf.appendChild(replacement);
                    card = replacement;
                } else {
                    updateCard(card, item, index);
                }
            }
            while (shelf.children.length > endIndex - startIndex) {
                shelf.removeChild(shelf.lastElementChild);
            }
        }

        syncShelf(leftShelf, 0, 9);
        syncShelf(rightShelf, 9, 18);
        switchRobloxAvatar(currentAvatar);
        updateCartUI();
        updateTransform();
    };

    // Drag kamera hanya mulai dari lantai/dinding kosong. Sentuhan pada foto,
    // tombol, rak, avatar, keranjang atau modal tidak pernah mengambil gesture.
    // pan-y membiarkan scroll vertikal HP dan tetap menerima geser horizontal.
    window.initDragLook = function () {
        const viewport = document.getElementById('bm-viewport');
        if (!viewport || viewport.dataset.bmGalleryDragReady === '1') return;
        viewport.dataset.bmGalleryDragReady = '1';
        viewport.style.touchAction = 'pan-y';

        const ignored = [
            'button', 'input', 'select', 'textarea', 'a',
            '.bm-product-box', '#bm-left-shelf', '#bm-right-shelf', '.bm-shelf-unit',
            '.bm-hud-controls', '.bm-top-nav', '.bm-avatar-switcher', '.bm-char-btn',
            '#bm-cart-bar', '#bm-held-polaroid', '#bm-polaroid-modal',
            '#bm-photo-detail-modal', '#bm-product-modal', '.bm-modal-backdrop',
            '.bm-counter-action'
        ].join(',');

        let activePointerId = null;
        let lastX = 0;

        viewport.addEventListener('pointerdown', function (event) {
            if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
            if (event.target && event.target.closest && event.target.closest(ignored)) return;
            activePointerId = event.pointerId;
            lastX = event.clientX;
            isDragging = true;
            hasMoved = false;
            try { viewport.setPointerCapture(event.pointerId); } catch (err) {}
        }, { passive: true });

        viewport.addEventListener('pointermove', function (event) {
            if (activePointerId === null || activePointerId !== event.pointerId) return;
            const deltaX = event.clientX - lastX;
            if (Math.abs(deltaX) < 3) return;
            hasMoved = true;
            lastX = event.clientX;
            bmCamYaw += deltaX * 0.28;
            updateTransform();
        }, { passive: true });

        function finishPointer(event) {
            if (activePointerId === null) return;
            if (event && event.pointerId !== undefined && event.pointerId !== activePointerId) return;
            isDragging = false;
            activePointerId = null;
            hasMoved = false;
        }
        viewport.addEventListener('pointerup', finishPointer, { passive: true });
        viewport.addEventListener('pointercancel', finishPointer, { passive: true });
        viewport.addEventListener('lostpointercapture', finishPointer, { passive: true });
    };
})();

// =========================================================================
// END POLAROID GALLERY HOTFIX
// =========================================================================
