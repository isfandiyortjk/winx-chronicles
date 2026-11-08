// Моя Говорящая Фея: Алфея — Игровой движок с 3 комнатами и 5 мини-играми

const FAIRY_SAVE_KEY = 'talking_fairy_save_v2';

let fairyState = {
  coins: 150,
  level: 1,
  currentRoom: 'living', // 'living', 'kitchen', 'bedroom'
  needs: {
    food: 75,
    love: 85,
    energy: 80,
    sleep: 90
  },
  isSleeping: false,
  equipped: {
    dresses: 'bloom_dress',
    wings: 'enchantix_wings',
    hair: 'bloom_orange'
  }
};

try {
  const raw = localStorage.getItem(FAIRY_SAVE_KEY);
  if (raw) Object.assign(fairyState, JSON.parse(raw));
} catch (e) {}

function saveFairy() {
  try {
    localStorage.setItem(FAIRY_SAVE_KEY, JSON.stringify(fairyState));
  } catch (e) {}
  updateNeedsUI();
}

// -------------------------------------------------------------
// 1. ДЕТАЛИЗИРОВАННЫЕ КОМНАТЫ ФЕИ (РУЧНОЙ МУЛЬТЯШНЫЙ ВЕКТОРНЫЙ СТИЛЬ)
// -------------------------------------------------------------
function getLivingRoomSVG() {
  return `<svg class="hand-drawn-room-svg" viewBox="0 0 360 640" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="livingSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#b3e5fc"/>
        <stop offset="55%" stop-color="#e1f5fe"/>
        <stop offset="100%" stop-color="#ffe0b2"/>
      </linearGradient>
      <linearGradient id="livingWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fce4ec"/>
        <stop offset="100%" stop-color="#f8bbd0"/>
      </linearGradient>
      <linearGradient id="livingCurtain" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f48fb1"/>
        <stop offset="50%" stop-color="#ec407a"/>
        <stop offset="100%" stop-color="#c2185b"/>
      </linearGradient>
      <radialGradient id="livingRug" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ff80ab"/>
        <stop offset="70%" stop-color="#f50057"/>
        <stop offset="100%" stop-color="#ad1457"/>
      </radialGradient>
    </defs>

    <rect width="360" height="480" fill="url(#livingWall)"/>
    <g opacity="0.25" fill="#ad1457">
      <circle cx="60" cy="80" r="3"/><circle cx="180" cy="80" r="3"/><circle cx="300" cy="80" r="3"/>
      <circle cx="120" cy="140" r="3"/><circle cx="240" cy="140" r="3"/>
      <circle cx="60" cy="200" r="3"/><circle cx="180" cy="200" r="3"/><circle cx="300" cy="200" r="3"/>
      <circle cx="120" cy="260" r="3"/><circle cx="240" cy="260" r="3"/>
    </g>

    <rect x="0" y="380" width="360" height="100" fill="#fffde7" stroke="#d7ccc8" stroke-width="2"/>
    <line x1="0" y1="380" x2="360" y2="380" stroke="#bcaaa4" stroke-width="4"/>
    <rect x="15" y="395" width="65" height="70" fill="none" stroke="#d7ccc8" stroke-width="2" rx="4"/>
    <rect x="100" y="395" width="70" height="70" fill="none" stroke="#d7ccc8" stroke-width="2" rx="4"/>
    <rect x="190" y="395" width="70" height="70" fill="none" stroke="#d7ccc8" stroke-width="2" rx="4"/>
    <rect x="280" y="395" width="65" height="70" fill="none" stroke="#d7ccc8" stroke-width="2" rx="4"/>

    <rect x="0" y="480" width="360" height="160" fill="#d7ccc8"/>
    <g stroke="#a1887f" stroke-width="1.8">
      <line x1="0" y1="480" x2="360" y2="480" stroke="#8d6e63" stroke-width="3"/>
      <line x1="0" y1="520" x2="360" y2="520"/>
      <line x1="0" y1="560" x2="360" y2="560"/>
      <line x1="0" y1="600" x2="360" y2="600"/>
      <line x1="80" y1="480" x2="80" y2="520"/><line x1="220" y1="480" x2="220" y2="520"/>
      <line x1="150" y1="520" x2="150" y2="560"/><line x1="290" y1="520" x2="290" y2="560"/>
      <line x1="70" y1="560" x2="70" y2="600"/><line x1="210" y1="560" x2="210" y2="600"/>
    </g>

    <g id="balcony-window">
      <clipPath id="windowArchClip">
        <path d="M25,120 Q25,45 85,45 Q145,45 145,120 L145,250 L25,250 Z"/>
      </clipPath>
      <g clip-path="url(#windowArchClip)">
        <rect x="25" y="45" width="120" height="205" fill="url(#livingSky)"/>
        <circle cx="120" cy="80" r="18" fill="#fff59d" stroke="#fbc02d" stroke-width="2"/>
        <path d="M25,200 Q70,170 110,195 Q135,185 145,195 L145,250 L25,250 Z" fill="#81c784"/>
        <rect x="45" y="160" width="18" height="50" fill="#f48fb1"/>
        <polygon points="42,160 54,115 66,160" fill="#ffd54f" stroke="#fbc02d" stroke-width="1.2"/>
        <rect x="85" y="150" width="22" height="60" fill="#f06292"/>
        <polygon points="81,150 96,95 111,150" fill="#ffca28" stroke="#f57f17" stroke-width="1.2"/>
        <polygon points="96,95 108,102 96,108" fill="#e91e63"/>
        <path d="M35,100 Q45,90 55,100 Q65,95 72,102 Q75,110 65,112 L40,112 Z" fill="#ffffff" opacity="0.85"/>
      </g>
      <path d="M25,120 Q25,45 85,45 Q145,45 145,120 L145,250 L25,250 Z" fill="none" stroke="#ba68c8" stroke-width="6"/>
      <line x1="85" y1="45" x2="85" y2="250" stroke="#ffffff" stroke-width="3"/>
      <line x1="25" y1="140" x2="145" y2="140" stroke="#ffffff" stroke-width="3"/>
      <path d="M22,48 Q45,120 30,240 Q15,160 22,48 Z" fill="url(#livingCurtain)"/>
      <path d="M148,48 Q125,120 140,240 Q155,160 148,48 Z" fill="url(#livingCurtain)"/>
      <circle cx="28" cy="150" r="5" fill="#ffd700"/>
      <circle cx="142" cy="150" r="5" fill="#ffd700"/>
    </g>

    <g id="wall-painting">
      <rect x="215" y="65" width="115" height="135" rx="8" fill="#ffd54f" stroke="#ffb300" stroke-width="4"/>
      <rect x="223" y="73" width="99" height="119" rx="4" fill="#f3e5f5" stroke="#ce93d8" stroke-width="1.5"/>
      <path d="M230,150 Q270,120 315,150 L315,188 L230,188 Z" fill="#ce93d8" opacity="0.4"/>
      <text x="272" y="115" font-size="28" text-anchor="middle">🧚‍♀️✨</text>
      <text x="272" y="145" font-size="12" font-family="'Marck Script', cursive" fill="#7b1fa2" text-anchor="middle">Club Winx</text>
    </g>

    <g id="fairy-lights">
      <path d="M10,25 Q180,60 350,25" fill="none" stroke="#ffd700" stroke-width="2"/>
      <circle cx="45" cy="33" r="7" fill="#ff4081" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="95" cy="42" r="7" fill="#ffd700" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="145" cy="46" r="7" fill="#00e5ff" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="195" cy="46" r="7" fill="#e040fb" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="245" cy="42" r="7" fill="#76ff03" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="295" cy="35" r="7" fill="#ff9100" stroke="#ffffff" stroke-width="1.5"/>
    </g>

    <ellipse cx="180" cy="545" rx="145" ry="46" fill="url(#livingRug)" stroke="#ffffff" stroke-width="3" stroke-dasharray="8,5"/>
    <ellipse cx="180" cy="545" rx="120" ry="36" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2"/>
    <circle cx="180" cy="545" r="16" fill="rgba(255,255,255,0.3)"/>
  </svg>`;
}

function getKitchenRoomSVG() {
  return `<svg class="hand-drawn-room-svg" viewBox="0 0 360 640" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="kitchenTileGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#e0f2f1"/>
        <stop offset="100%" stop-color="#b2dfdb"/>
      </linearGradient>
      <linearGradient id="woodShelfGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#d7ccc8"/>
        <stop offset="100%" stop-color="#a1887f"/>
      </linearGradient>
    </defs>

    <rect width="360" height="480" fill="url(#kitchenTileGrad)"/>
    <g stroke="#80cbc4" stroke-width="1.5" opacity="0.65">
      <line x1="0" y1="60" x2="360" y2="60"/><line x1="0" y1="120" x2="360" y2="120"/>
      <line x1="0" y1="180" x2="360" y2="180"/><line x1="0" y1="240" x2="360" y2="240"/>
      <line x1="0" y1="300" x2="360" y2="300"/><line x1="0" y1="360" x2="360" y2="360"/>
      <line x1="0" y1="420" x2="360" y2="420"/>
      <line x1="60" y1="0" x2="60" y2="480"/><line x1="120" y1="0" x2="120" y2="480"/>
      <line x1="180" y1="0" x2="180" y2="480"/><line x1="240" y1="0" x2="240" y2="480"/>
      <line x1="300" y1="0" x2="300" y2="480"/>
    </g>
    <text x="30" y="95" font-size="16">🍓</text>
    <text x="150" y="215" font-size="16">🧁</text>
    <text x="270" y="95" font-size="16">🍯</text>

    <g id="kitchen-window">
      <rect x="225" y="45" width="110" height="155" rx="10" fill="#e1f5fe" stroke="#00897b" stroke-width="4"/>
      <rect x="230" y="50" width="100" height="145" rx="8" fill="#c8e6c9"/>
      <circle cx="280" cy="90" r="16" fill="#fff59d"/>
      <text x="250" y="140" font-size="20">🌸🦋</text>
      <path d="M225,45 Q255,90 225,130 L225,45 Z" fill="#ffcdd2" stroke="#e57373" stroke-width="1.2"/>
      <path d="M335,45 Q305,90 335,130 L335,45 Z" fill="#ffcdd2" stroke="#e57373" stroke-width="1.2"/>
    </g>

    <g id="kitchen-shelves">
      <rect x="25" y="100" width="180" height="12" rx="3" fill="url(#woodShelfGrad)" stroke="#6d4c41" stroke-width="1.5"/>
      <polygon points="45,112 55,130 50,130 40,112" fill="#6d4c41"/>
      <polygon points="175,112 185,130 180,130 170,112" fill="#6d4c41"/>
      <rect x="40" y="70" width="26" height="30" rx="4" fill="#ffb74d" stroke="#e65100" stroke-width="1.5"/>
      <rect x="38" y="65" width="30" height="7" rx="2" fill="#fff3e0" stroke="#e65100" stroke-width="1"/>
      <text x="53" y="88" font-size="10" text-anchor="middle">🍯</text>
      <rect x="80" y="68" width="28" height="32" rx="4" fill="#e91e63" stroke="#880e4f" stroke-width="1.5"/>
      <text x="94" y="88" font-size="10" text-anchor="middle">🍓</text>
      <ellipse cx="145" cy="84" r="16" fill="#f48fb1" stroke="#ad1457" stroke-width="1.8"/>
      <path d="M160,82 Q172,78 170,72" fill="none" stroke="#ad1457" stroke-width="2"/>
      <path d="M129,78 Q120,72 124,88" fill="none" stroke="#ad1457" stroke-width="2"/>
      <path d="M168,70 Q175,60 170,52 Q165,45 172,38" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8"/>
      <path d="M174,70 Q182,58 178,50" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
      <rect x="25" y="185" width="180" height="12" rx="3" fill="url(#woodShelfGrad)" stroke="#6d4c41" stroke-width="1.5"/>
      <polygon points="45,197 55,215 50,215 40,197" fill="#6d4c41"/>
      <polygon points="175,197 185,215 180,215 170,197" fill="#6d4c41"/>
      <text x="50" y="180" font-size="18">☕</text>
      <text x="85" y="180" font-size="18">🫖</text>
      <text x="125" y="180" font-size="18">🧁</text>
    </g>

    <rect x="0" y="480" width="360" height="160" fill="#ffccbc"/>
    <g stroke="#d84315" stroke-width="1.6" opacity="0.5">
      <line x1="0" y1="520" x2="360" y2="520"/><line x1="0" y1="560" x2="360" y2="560"/>
      <line x1="0" y1="600" x2="360" y2="600"/>
      <line x1="90" y1="480" x2="90" y2="640"/><line x1="180" y1="480" x2="180" y2="640"/>
      <line x1="270" y1="480" x2="270" y2="640"/>
    </g>

    <g id="dining-table">
      <ellipse cx="180" cy="535" rx="150" ry="35" fill="#ffffff" stroke="#ff80ab" stroke-width="3"/>
      <path d="M30,535 Q45,555 60,535 Q75,555 90,535 Q105,555 120,535 Q135,555 150,535 Q165,555 180,535 Q195,555 210,535 Q225,555 240,535 Q255,555 270,535 Q285,555 300,535 Q315,555 330,535" fill="none" stroke="#ff4081" stroke-width="2"/>
      <ellipse cx="180" cy="535" rx="125" ry="25" fill="#fff0f5"/>
    </g>
  </svg>`;
}

function getBedroomRoomSVG() {
  return `<svg class="hand-drawn-room-svg" viewBox="0 0 360 640" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="nightSkyWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1a153b"/>
        <stop offset="50%" stop-color="#2c1b5a"/>
        <stop offset="100%" stop-color="#4a148c"/>
      </linearGradient>
      <linearGradient id="bedCoverGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#e1bee7"/>
        <stop offset="100%" stop-color="#ba68c8"/>
      </linearGradient>
    </defs>

    <rect width="360" height="480" fill="url(#nightSkyWall)"/>
    <g stroke="#ffd700" stroke-width="1.2" fill="#ffd700" opacity="0.85">
      <line x1="40" y1="70" x2="70" y2="55"/><line x1="70" y1="55" x2="100" y2="80"/>
      <line x1="70" y1="55" x2="80" y2="110"/>
      <circle cx="40" cy="70" r="2.5"/><circle cx="70" cy="55" r="3.5"/><circle cx="100" cy="80" r="2.5"/><circle cx="80" cy="110" r="2.5"/>
      <line x1="220" y1="80" x2="245" y2="60"/><line x1="245" y1="60" x2="265" y2="90"/><line x1="265" y1="90" x2="290" y2="60"/><line x1="290" y1="60" x2="310" y2="85"/>
      <circle cx="220" cy="80" r="2.5"/><circle cx="245" cy="60" r="3.5"/><circle cx="265" cy="90" r="3"/><circle cx="290" cy="60" r="3.5"/><circle cx="310" cy="85" r="2.5"/>
      <text x="140" y="80" font-size="14">✨</text>
      <text x="180" y="130" font-size="12">⭐</text>
      <text x="60" y="170" font-size="14">🌙</text>
      <text x="320" y="140" font-size="12">✨</text>
    </g>

    <g id="bedroom-window">
      <clipPath id="bedWindowClip">
        <path d="M25,120 Q25,45 85,45 Q145,45 145,120 L145,230 L25,230 Z"/>
      </clipPath>
      <g clip-path="url(#bedWindowClip)">
        <rect x="25" y="45" width="120" height="185" fill="#0d0826"/>
        <path d="M90,75 A18,18 0 1,0 115,105 A22,22 0 1,1 90,75 Z" fill="#ffd700" filter="drop-shadow(0 0 8px #ffd700)"/>
        <circle cx="50" cy="90" r="1.5" fill="#ffffff"/>
        <circle cx="70" cy="130" r="1.2" fill="#ffffff"/>
        <circle cx="120" cy="160" r="1.8" fill="#ffffff"/>
        <polygon points="50,170 65,130 80,170" fill="#311b92"/>
      </g>
      <path d="M25,120 Q25,45 85,45 Q145,45 145,120 L145,230 L25,230 Z" fill="none" stroke="#7e57c2" stroke-width="5"/>
      <line x1="85" y1="45" x2="85" y2="230" stroke="#9575cd" stroke-width="2.5"/>
    </g>

    <rect x="0" y="480" width="360" height="160" fill="#3e2723"/>
    <g stroke="#271815" stroke-width="2">
      <line x1="0" y1="520" x2="360" y2="520"/><line x1="0" y1="560" x2="360" y2="560"/>
      <line x1="0" y1="600" x2="360" y2="600"/>
    </g>

    <g id="fairy-bed">
      <path d="M40,50 Q60,180 20,380 L60,380 Q80,200 40,50 Z" fill="rgba(206, 147, 216, 0.45)"/>
      <path d="M320,50 Q300,180 340,380 L300,380 Q280,200 320,50 Z" fill="rgba(206, 147, 216, 0.45)"/>
      <ellipse cx="180" cy="45" rx="55" ry="12" fill="#ffd700" stroke="#ff8f00" stroke-width="2"/>
      <path d="M60,380 Q100,280 180,310 Q260,280 300,380 Z" fill="#ffd54f" stroke="#ff8f00" stroke-width="3"/>
      <path d="M80,380 Q110,310 180,330 Q250,310 280,380 Z" fill="#b39ddb"/>
      <ellipse cx="130" cy="375" rx="35" ry="16" fill="#ffffff" stroke="#ce93d8" stroke-width="2"/>
      <ellipse cx="230" cy="375" rx="35" ry="16" fill="#ffffff" stroke="#ce93d8" stroke-width="2"/>
      <ellipse cx="180" cy="385" rx="28" ry="14" fill="#f8bbd0" stroke="#f06292" stroke-width="1.8"/>
      <path d="M50,395 Q180,375 310,395 L330,510 Q180,535 30,510 Z" fill="url(#bedCoverGrad)" stroke="#ffd700" stroke-width="2.5"/>
      <g stroke="rgba(255,255,255,0.4)" stroke-width="1.4">
        <line x1="80" y1="410" x2="280" y2="500"/><line x1="120" y1="400" x2="310" y2="480"/>
        <line x1="280" y1="410" x2="80" y2="500"/><line x1="240" y1="400" x2="50" y2="480"/>
      </g>
      <text x="100" y="450" font-size="14">⭐</text>
      <text x="180" y="470" font-size="16">✨</text>
      <text x="250" y="445" font-size="14">⭐</text>
    </g>

    <g id="nightstand">
      <rect x="270" y="420" width="60" height="70" rx="6" fill="#5d4037" stroke="#3e2723" stroke-width="2"/>
      <circle cx="300" cy="445" r="4" fill="#ffd700"/>
    </g>
  </svg>`;
}

function renderRoomDecorations(room) {
  const container = document.getElementById('room-scenery');
  if (!container) return;
  fairyState.currentRoom = room;

  // Обновляем активную кнопку переключателя комнат
  document.querySelectorAll('.room-pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.room === room);
  });

  const tray = document.getElementById('kitchen-food-tray');
  const lamp = document.getElementById('btn-lamp-sleep');

  if (room === 'living') {
    container.className = 'room-scenery-backdrop room-living-theme';
    container.innerHTML = getLivingRoomSVG();
    tray.classList.add('hidden');
    lamp.classList.add('hidden');
    speakPhrase('Добро пожаловать в мой уютный зал! Погладь меня! 💖');
  } else if (room === 'kitchen') {
    container.className = 'room-scenery-backdrop room-kitchen-theme';
    container.innerHTML = getKitchenRoomSVG();
    tray.classList.remove('hidden');
    lamp.classList.add('hidden');
    speakPhrase('Ура, мы на кухне! Покорми меня вкусняшкой на столике! 🧁');
  } else if (room === 'bedroom') {
    container.className = 'room-scenery-backdrop room-bedroom-theme';
    container.innerHTML = getBedroomRoomSVG();
    tray.classList.add('hidden');
    lamp.classList.remove('hidden');
    speakPhrase('Это моя спальня! Нажми на ночник 💡, если хочешь уложить меня спать.');
  }

  saveFairy();
}

// -------------------------------------------------------------
// 2. ЖИВАЯ АНИМИРОВАННАЯ ФЕЯ (РИСОВКА В РУЧНОМ МУЛЬТЯШНОМ СТИЛЕ ВИНКС)
// -------------------------------------------------------------
let fairyCanvas, fairyCtx;
let touchPos = { x: 150, y: 210 };
let fairyMood = 'normal';
let mouthOpenTimer = 0;
let wingAngle = 0;
let heartParticles = [];
let dustParticles = [];
let nextBlinkTime = 0;
let isBlinking = false;
let blinkProgress = 0;

function initFairyStage() {
  fairyCanvas = document.getElementById('fairy-canvas');
  fairyCtx = fairyCanvas.getContext('2d');

  // Четкие линии без размытия на экранах iPhone / Retina
  const dpr = Math.min(window.devicePixelRatio || 2, 3);
  fairyCanvas.width = 300 * dpr;
  fairyCanvas.height = 430 * dpr;
  fairyCtx.scale(dpr, dpr);

  window.addEventListener('mousemove', (e) => {
    const rect = fairyCanvas.getBoundingClientRect();
    touchPos.x = (e.clientX - rect.left) * (300 / (rect.width || 300));
    touchPos.y = (e.clientY - rect.top) * (430 / (rect.height || 430));
  });

  fairyCanvas.addEventListener('touchstart', (e) => {
    const rect = fairyCanvas.getBoundingClientRect();
    touchPos.x = (e.touches[0].clientX - rect.left) * (300 / (rect.width || 300));
    touchPos.y = (e.touches[0].clientY - rect.top) * (430 / (rect.height || 430));
    handleFairyTouch(touchPos.x, touchPos.y);
  }, { passive: true });

  fairyCanvas.addEventListener('mousedown', (e) => {
    const rect = fairyCanvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (300 / (rect.width || 300));
    const y = (e.clientY - rect.top) * (430 / (rect.height || 430));
    handleFairyTouch(x, y);
  });

  animateFairy(0);
}

function handleFairyTouch(x, y) {
  if (fairyState.isSleeping) {
    speakPhrase('Шшш... Фея спит! Включи ночник 💡, чтобы разбудить.');
    return;
  }

  if (y < 160) {
    fairyMood = 'happy';
    fairyState.needs.love = Math.min(100, fairyState.needs.love + 8);
    spawnHearts(x, y);
    if (window.magicAudio) window.magicAudio.playCollect(true);
    speakRandomCompliment();
    saveFairy();
  } else if (y >= 160 && y < 270) {
    fairyMood = 'laugh';
    fairyState.needs.love = Math.min(100, fairyState.needs.love + 5);
    spawnHearts(x, y);
    if (window.magicAudio) window.magicAudio.playSparkle();
    speakPhrase('Хи-хи-хи! Щекотно же! 🤭💖');
    saveFairy();
  } else {
    fairyMood = 'happy';
    wingAngle += 2.0;
    if (window.magicAudio) window.magicAudio.playWingFlap();
    spawnHearts(x, y);
  }

  setTimeout(() => {
    if (fairyMood !== 'sleep') fairyMood = 'normal';
  }, 1600);
}

function spawnHearts(x, y) {
  for (let i = 0; i < 4; i++) {
    heartParticles.push({
      x: x + (Math.random() - 0.5) * 40,
      y: y + (Math.random() - 0.5) * 40,
      vy: -(Math.random() * 2 + 1.5),
      vx: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 10 + 16,
      opacity: 1
    });
  }
}

function animateFairy(time) {
  requestAnimationFrame(animateFairy);

  const t = time * 0.003;
  fairyCtx.clearRect(0, 0, 300, 430);

  // Естественное моргание каждые несколько секунд
  if (time > nextBlinkTime) {
    isBlinking = true;
    blinkProgress += 0.2;
    if (blinkProgress >= 1) {
      isBlinking = false;
      blinkProgress = 0;
      nextBlinkTime = time + 2600 + Math.random() * 3200;
    }
  }

  // Центр персонажа с плавным дыханием
  const cx = 150;
  const cy = 220 + Math.sin(t * 2) * 5;

  const flap = Math.sin(t * 5 + wingAngle) * 0.45;
  const isSunWings = fairyState.equipped && fairyState.equipped.wings === 'sun_wings';
  const dressType = (fairyState.equipped && fairyState.equipped.dresses) || 'bloom_dress';
  const hairType = (fairyState.equipped && fairyState.equipped.hair) || 'bloom_orange';

  // 1. Крылья Энчантикс
  drawHandDrawnWings(fairyCtx, cx, cy - 25, flap, isSunWings);

  // 2. Роскошные волосы сзади
  drawBackHair(fairyCtx, cx, cy - 75, t, hairType);

  // 3. Стройное тело, изящные ручки и наряд
  drawHandDrawnBody(fairyCtx, cx, cy, t, dressType);

  // 4. Милое личико и выразительные глаза
  drawHandDrawnFace(fairyCtx, cx, cy - 75, touchPos, t, isBlinking);

  // 5. Передняя челка, пряди и королевская диадема
  drawFrontHair(fairyCtx, cx, cy - 75, hairType);

  // 6. Искрящаяся волшебная пыльца и сердечки
  updateAndDrawParticles(fairyCtx);
}

function drawHandDrawnWings(ctx, cx, cy, flap, isSun) {
  ctx.save();
  ctx.translate(cx, cy);

  const scaleX = 0.85 + flap * 0.3;

  ctx.save();
  ctx.scale(-scaleX, 1);
  drawSingleHandDrawnWing(ctx, isSun);
  ctx.restore();

  ctx.save();
  ctx.scale(scaleX, 1);
  drawSingleHandDrawnWing(ctx, isSun);
  ctx.restore();

  ctx.restore();
}

function drawSingleHandDrawnWing(ctx, isSun) {
  ctx.save();
  ctx.shadowBlur = 18;
  ctx.shadowColor = isSun ? 'rgba(255, 215, 0, 0.6)' : 'rgba(255, 64, 129, 0.6)';

  const gradTop = ctx.createLinearGradient(0, -90, 120, 40);
  if (isSun) {
    gradTop.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    gradTop.addColorStop(0.4, 'rgba(255, 238, 88, 0.7)');
    gradTop.addColorStop(0.8, 'rgba(255, 167, 38, 0.65)');
    gradTop.addColorStop(1, 'rgba(255, 112, 67, 0.5)');
  } else {
    gradTop.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    gradTop.addColorStop(0.35, 'rgba(0, 229, 255, 0.65)');
    gradTop.addColorStop(0.7, 'rgba(240, 98, 146, 0.65)');
    gradTop.addColorStop(1, 'rgba(255, 215, 0, 0.6)');
  }

  ctx.fillStyle = gradTop;
  ctx.strokeStyle = isSun ? '#ffa000' : '#d81b60';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(25, -55, 65, -100, 115, -95);
  ctx.bezierCurveTo(135, -50, 120, 10, 85, 30);
  ctx.bezierCurveTo(55, 45, 20, 20, 0, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(50, -55, 110, -90);
  ctx.moveTo(25, -20);
  ctx.quadraticCurveTo(60, -25, 115, -45);
  ctx.moveTo(35, -5);
  ctx.quadraticCurveTo(70, 0, 85, 25);
  ctx.stroke();

  const gradBot = ctx.createLinearGradient(0, 5, 80, 95);
  if (isSun) {
    gradBot.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradBot.addColorStop(0.6, 'rgba(255, 193, 7, 0.65)');
    gradBot.addColorStop(1, 'rgba(255, 112, 67, 0.45)');
  } else {
    gradBot.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradBot.addColorStop(0.5, 'rgba(240, 98, 146, 0.6)');
    gradBot.addColorStop(1, 'rgba(186, 104, 200, 0.45)');
  }

  ctx.fillStyle = gradBot;
  ctx.strokeStyle = isSun ? '#ffa000' : '#d81b60';
  ctx.lineWidth = 2.0;

  ctx.beginPath();
  ctx.moveTo(0, 8);
  ctx.bezierCurveTo(35, 25, 75, 55, 68, 88);
  ctx.bezierCurveTo(55, 108, 15, 65, 0, 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, 8);
  ctx.quadraticCurveTo(35, 45, 62, 85);
  ctx.stroke();

  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(115, -95, 3.5, 0, Math.PI * 2);
  ctx.arc(68, 88, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawBackHair(ctx, cx, cy, t, hairType) {
  const isStella = hairType === 'stella_gold';
  let hairBase = isStella ? '#e69500' : '#d84315';
  let hairMid = isStella ? '#ffb300' : '#ff5722';
  let hairLight = isStella ? '#ffe082' : '#ffab40';
  let inkStroke = isStella ? '#b26a00' : '#871c00';

  const swayLeft = Math.sin(t * 1.8) * 6;
  const swayRight = Math.cos(t * 1.8) * 6;

  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = inkStroke;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const gradL = ctx.createLinearGradient(cx - 60, cy + 20, cx - 20, cy + 180);
  gradL.addColorStop(0, hairBase);
  gradL.addColorStop(0.5, hairMid);
  gradL.addColorStop(1, hairLight);
  ctx.fillStyle = gradL;

  ctx.beginPath();
  ctx.moveTo(cx - 24, cy + 25);
  ctx.bezierCurveTo(cx - 75 + swayLeft, cy + 65, cx - 70, cy + 130, cx - 42, cy + 185);
  ctx.bezierCurveTo(cx - 28, cy + 150, cx - 18, cy + 95, cx - 15, cy + 30);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  const gradR = ctx.createLinearGradient(cx + 20, cy + 20, cx + 60, cy + 180);
  gradR.addColorStop(0, hairBase);
  gradR.addColorStop(0.5, hairMid);
  gradR.addColorStop(1, hairLight);
  ctx.fillStyle = gradR;

  ctx.beginPath();
  ctx.moveTo(cx + 24, cy + 25);
  ctx.bezierCurveTo(cx + 75 + swayRight, cy + 65, cx + 70, cy + 130, cx + 42, cy + 185);
  ctx.bezierCurveTo(cx + 28, cy + 150, cx + 18, cy + 95, cx + 15, cy + 30);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawHandDrawnBody(ctx, cx, cy, t, dressType) {
  ctx.save();
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = '#6d4c41';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const skinTone = '#ffeedb';
  const skinShadow = '#f2cca9';
  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.moveTo(cx - 7, cy - 42);
  ctx.lineTo(cx + 7, cy - 42);
  ctx.lineTo(cx + 9, cy - 23);
  ctx.lineTo(cx - 9, cy - 23);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = skinShadow;
  ctx.beginPath();
  ctx.moveTo(cx - 7, cy - 42);
  ctx.quadraticCurveTo(cx, cy - 36, cx + 7, cy - 42);
  ctx.lineTo(cx + 7, cy - 38);
  ctx.quadraticCurveTo(cx, cy - 32, cx - 7, cy - 38);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.moveTo(cx - 22, cy - 22);
  ctx.bezierCurveTo(cx - 36, cy - 5, cx - 40, cy + 25, cx - 32, cy + 55);
  ctx.bezierCurveTo(cx - 28, cy + 58, cx - 25, cy + 55, cx - 24, cy + 48);
  ctx.bezierCurveTo(cx - 32, cy + 22, cx - 28, cy - 2, cx - 18, cy - 20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 22, cy - 22);
  ctx.bezierCurveTo(cx + 36, cy - 5, cx + 40, cy + 25, cx + 32, cy + 55);
  ctx.bezierCurveTo(cx + 28, cy + 58, cx + 25, cy + 55, cx + 24, cy + 48);
  ctx.bezierCurveTo(cx + 32, cy + 22, cx + 28, cy - 2, cx + 18, cy - 20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffd700';
  ctx.strokeStyle = '#ff9800';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(cx - 28, cy + 46, 5, 2.5, 0.3, 0, Math.PI * 2);
  ctx.ellipse(cx + 28, cy + 46, 5, 2.5, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = '#6d4c41';
  ctx.lineWidth = 1.8;
  ctx.fillStyle = skinTone;

  ctx.beginPath();
  ctx.moveTo(cx - 15, cy + 65);
  ctx.lineTo(cx - 17, cy + 120);
  ctx.lineTo(cx - 8, cy + 120);
  ctx.lineTo(cx - 6, cy + 65);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 6, cy + 65);
  ctx.lineTo(cx + 8, cy + 120);
  ctx.lineTo(cx + 17, cy + 120);
  ctx.lineTo(cx + 15, cy + 65);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = '#d7a17a';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(cx - 11.5, cy + 92, 2.5, 0.3, Math.PI - 0.3);
  ctx.arc(cx + 11.5, cy + 92, 2.5, 0.3, Math.PI - 0.3);
  ctx.stroke();

  const isStellaDress = dressType === 'stella_sparkle';
  const isPinkDress = dressType === 'princess_pink';
  const bootColor = isStellaDress ? '#ff9800' : (isPinkDress ? '#ff4081' : '#00e5ff');
  const bootBorder = isStellaDress ? '#e65100' : (isPinkDress ? '#c2185b' : '#00838f');

  ctx.fillStyle = bootColor;
  ctx.strokeStyle = bootBorder;
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(cx - 17, cy + 118);
  ctx.lineTo(cx - 22, cy + 148);
  ctx.lineTo(cx - 7, cy + 148);
  ctx.lineTo(cx - 8, cy + 118);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 8, cy + 118);
  ctx.lineTo(cx + 7, cy + 148);
  ctx.lineTo(cx + 22, cy + 148);
  ctx.lineTo(cx + 17, cy + 118);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(cx - 17, cy + 124); ctx.lineTo(cx - 8, cy + 132);
  ctx.moveTo(cx - 8, cy + 124); ctx.lineTo(cx - 17, cy + 132);
  ctx.moveTo(cx + 8, cy + 124); ctx.lineTo(cx + 17, cy + 132);
  ctx.moveTo(cx + 17, cy + 124); ctx.lineTo(cx + 8, cy + 132);
  ctx.stroke();

  let topGrad = ctx.createLinearGradient(cx - 20, cy - 25, cx + 20, cy + 20);
  let skirtGrad = ctx.createLinearGradient(cx - 30, cy + 20, cx + 30, cy + 70);
  let dressInk = '#00838f';
  let jewelColor = '#ffd700';

  if (isStellaDress) {
    topGrad.addColorStop(0, '#ffa726');
    topGrad.addColorStop(1, '#ff7043');
    skirtGrad.addColorStop(0, '#ffd54f');
    skirtGrad.addColorStop(1, '#ffca28');
    dressInk = '#d84315';
    jewelColor = '#e91e63';
  } else if (isPinkDress) {
    topGrad.addColorStop(0, '#ff80ab');
    topGrad.addColorStop(1, '#f50057');
    skirtGrad.addColorStop(0, '#f48fb1');
    skirtGrad.addColorStop(1, '#ec407a');
    dressInk = '#ad1457';
    jewelColor = '#ffd700';
  } else {
    topGrad.addColorStop(0, '#18ffff');
    topGrad.addColorStop(0.5, '#00e5ff');
    topGrad.addColorStop(1, '#00b0ff');
    skirtGrad.addColorStop(0, '#80d8ff');
    skirtGrad.addColorStop(1, '#00b0ff');
    dressInk = '#00838f';
    jewelColor = '#ffd700';
  }

  ctx.fillStyle = topGrad;
  ctx.strokeStyle = dressInk;
  ctx.lineWidth = 1.8;

  ctx.beginPath();
  ctx.moveTo(cx - 20, cy - 22);
  ctx.quadraticCurveTo(cx - 10, cy - 14, cx, cy - 18);
  ctx.quadraticCurveTo(cx + 10, cy - 14, cx + 20, cy - 22);
  ctx.bezierCurveTo(cx + 25, cy, cx + 18, cy + 18, cx + 14, cy + 22);
  ctx.lineTo(cx - 14, cy + 22);
  ctx.bezierCurveTo(cx - 18, cy + 18, cx - 25, cy, cx - 20, cy - 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = jewelColor;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy - 17, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = skirtGrad;
  ctx.strokeStyle = dressInk;
  ctx.lineWidth = 1.8;

  ctx.beginPath();
  ctx.moveTo(cx - 15, cy + 22);
  ctx.bezierCurveTo(cx - 38, cy + 35, cx - 45, cy + 62, cx - 32, cy + 72);
  ctx.bezierCurveTo(cx - 15, cy + 80, cx, cy + 75, cx + 32, cy + 72);
  ctx.bezierCurveTo(cx + 45, cy + 62, cx + 38, cy + 35, cx + 15, cy + 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy + 25); ctx.quadraticCurveTo(cx - 16, cy + 48, cx - 18, cy + 74);
  ctx.moveTo(cx, cy + 25); ctx.quadraticCurveTo(cx, cy + 48, cx, cy + 76);
  ctx.moveTo(cx + 10, cy + 25); ctx.quadraticCurveTo(cx + 16, cy + 48, cx + 18, cy + 74);
  ctx.stroke();

  ctx.fillStyle = '#ffd700';
  ctx.strokeStyle = '#ff9800';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.rect(cx - 16, cy + 19, 32, 5);
  ctx.fill();
  ctx.stroke();

  ctx.font = '12px serif';
  ctx.fillText('💖', cx - 6, cy + 25);

  ctx.restore();
}

function drawHandDrawnFace(ctx, cx, cy, touchPos, t, isBlinking) {
  ctx.save();
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.fillStyle = '#ffeedb';
  ctx.strokeStyle = '#6d4c41';

  ctx.beginPath();
  ctx.moveTo(cx - 28, cy - 10);
  ctx.bezierCurveTo(cx - 30, cy + 12, cx - 18, cy + 28, cx, cy + 35);
  ctx.bezierCurveTo(cx + 18, cy + 28, cx + 30, cy + 12, cx + 28, cy - 10);
  ctx.bezierCurveTo(cx + 26, cy - 35, cx - 26, cy - 35, cx - 28, cy - 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  const blushGradL = ctx.createRadialGradient(cx - 16, cy + 12, 1, cx - 16, cy + 12, 12);
  blushGradL.addColorStop(0, 'rgba(255, 64, 129, 0.45)');
  blushGradL.addColorStop(1, 'rgba(255, 64, 129, 0)');
  ctx.fillStyle = blushGradL;
  ctx.beginPath();
  ctx.arc(cx - 16, cy + 12, 12, 0, Math.PI * 2);
  ctx.fill();

  const blushGradR = ctx.createRadialGradient(cx + 16, cy + 12, 1, cx + 16, cy + 12, 12);
  blushGradR.addColorStop(0, 'rgba(255, 64, 129, 0.45)');
  blushGradR.addColorStop(1, 'rgba(255, 64, 129, 0)');
  ctx.fillStyle = blushGradR;
  ctx.beginPath();
  ctx.arc(cx + 16, cy + 12, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffeedb';
  ctx.strokeStyle = '#6d4c41';
  ctx.beginPath();
  ctx.arc(cx - 28, cy + 3, 5, Math.PI * 0.5, Math.PI * 1.5);
  ctx.arc(cx + 28, cy + 3, 5, Math.PI * 1.5, Math.PI * 0.5);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(cx - 28, cy + 9, 2.5, 0, Math.PI * 2);
  ctx.arc(cx + 28, cy + 9, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#c48b68';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(cx, cy + 7);
  ctx.lineTo(cx - 1.5, cy + 11);
  ctx.lineTo(cx + 1.5, cy + 11);
  ctx.stroke();

  const isSleeping = fairyState.isSleeping || fairyMood === 'sleep';
  const isJoyful = fairyMood === 'happy' || fairyMood === 'laugh';

  if (isSleeping) {
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(cx - 13, cy - 2, 7, 0.2, Math.PI - 0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 18, cy + 1); ctx.lineTo(cx - 22, cy + 5);
    ctx.moveTo(cx - 15, cy + 4); ctx.lineTo(cx - 17, cy + 9);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx + 13, cy - 2, 7, 0.2, Math.PI - 0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 18, cy + 1); ctx.lineTo(cx + 22, cy + 5);
    ctx.moveTo(cx + 15, cy + 4); ctx.lineTo(cx + 17, cy + 9);
    ctx.stroke();
  } else if (isJoyful || isBlinking) {
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.arc(cx - 13, cy + 2, 8, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 13, cy + 2, 8, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - 19, cy - 1); ctx.lineTo(cx - 24, cy - 5);
    ctx.moveTo(cx + 19, cy - 1); ctx.lineTo(cx + 24, cy - 5);
    ctx.stroke();
  } else {
    drawHandDrawnAnimeEye(ctx, cx - 13, cy - 3, touchPos.x, touchPos.y, false);
    drawHandDrawnAnimeEye(ctx, cx + 13, cy - 3, touchPos.x, touchPos.y, true);
  }

  const isStella = fairyState.equipped && fairyState.equipped.hair === 'stella_gold';
  ctx.strokeStyle = isStella ? '#c67d00' : '#bf360c';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(cx - 13, cy - 13, 10, Math.PI * 1.15, Math.PI * 1.75);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + 13, cy - 13, 10, Math.PI * 1.25, Math.PI * 1.85);
  ctx.stroke();

  ctx.strokeStyle = '#ad1457';
  ctx.fillStyle = '#ff4081';
  ctx.lineWidth = 1.8;

  if (fairyMood === 'eat' || mouthOpenTimer > 0) {
    ctx.fillStyle = '#ad1457';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 21, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 3, cy + 13, 6, 3);
    ctx.fillStyle = '#ff80ab';
    ctx.beginPath();
    ctx.arc(cx, cy + 24, 4, Math.PI, 0);
    ctx.fill();
  } else if (fairyMood === 'laugh') {
    ctx.beginPath();
    ctx.arc(cx, cy + 18, 9, 0.1, Math.PI - 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 4, cy + 18, 8, 2.5);
  } else {
    ctx.beginPath();
    ctx.arc(cx, cy + 17, 7, 0.2, Math.PI - 0.2);
    ctx.stroke();

    ctx.fillStyle = '#ff80ab';
    ctx.beginPath();
    ctx.arc(cx, cy + 20, 3, 0, Math.PI);
    ctx.fill();
  }

  ctx.restore();
}

function drawHandDrawnAnimeEye(ctx, eyeX, eyeY, targetX, targetY, isRight) {
  ctx.save();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(eyeX, eyeY, 8.5, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  const dx = targetX - eyeX;
  const dy = targetY - eyeY;
  const dist = Math.hypot(dx, dy) || 1;
  const maxPupilOffset = 3.2;
  const irisX = eyeX + (dx / dist) * Math.min(dist, maxPupilOffset);
  const irisY = eyeY + (dy / dist) * Math.min(dist, maxPupilOffset);

  const isStella = fairyState.equipped && fairyState.equipped.hair === 'stella_gold';

  const irisGrad = ctx.createLinearGradient(irisX, irisY - 9, irisX, irisY + 9);
  if (isStella) {
    irisGrad.addColorStop(0, '#5d4037');
    irisGrad.addColorStop(0.35, '#ff8f00');
    irisGrad.addColorStop(0.75, '#ffca28');
    irisGrad.addColorStop(1, '#fff59d');
  } else {
    irisGrad.addColorStop(0, '#002f6c');
    irisGrad.addColorStop(0.35, '#0097a7');
    irisGrad.addColorStop(0.75, '#00e5ff');
    irisGrad.addColorStop(1, '#84ffff');
  }

  ctx.fillStyle = irisGrad;
  ctx.beginPath();
  ctx.ellipse(irisX, irisY, 6.2, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1a237e';
  ctx.beginPath();
  ctx.ellipse(irisX, irisY, 3.2, 4.8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(irisX - 2.2, irisY - 3.2, 2.5, 3.2, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(irisX + 2.5, irisY + 3.5, 1.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#261820';
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';

  ctx.beginPath();
  if (!isRight) {
    ctx.moveTo(eyeX - 8.5, eyeY - 2);
    ctx.quadraticCurveTo(eyeX, eyeY - 11, eyeX + 8, eyeY - 4);
    ctx.lineTo(eyeX - 12, eyeY - 7);
  } else {
    ctx.moveTo(eyeX - 8, eyeY - 4);
    ctx.quadraticCurveTo(eyeX, eyeY - 11, eyeX + 8.5, eyeY - 2);
    ctx.lineTo(eyeX + 12, eyeY - 7);
  }
  ctx.stroke();

  ctx.strokeStyle = '#5d4037';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(eyeX, eyeY + 7, 7, 0.2, Math.PI - 0.2);
  ctx.stroke();

  ctx.strokeStyle = '#bcaaa4';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.arc(eyeX, eyeY - 8, 8, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();

  ctx.restore();
}

function drawFrontHair(ctx, cx, cy, hairType) {
  const isStella = hairType === 'stella_gold';
  let hairBase = isStella ? '#e69500' : '#d84315';
  let hairMid = isStella ? '#ffb300' : '#ff5722';
  let hairLight = isStella ? '#ffe082' : '#ffab40';
  let inkStroke = isStella ? '#8c5000' : '#721900';

  ctx.save();
  ctx.lineWidth = 2.0;
  ctx.strokeStyle = inkStroke;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const hairGrad = ctx.createLinearGradient(cx, cy - 40, cx, cy + 80);
  hairGrad.addColorStop(0, hairMid);
  hairGrad.addColorStop(0.7, hairBase);
  hairGrad.addColorStop(1, hairLight);
  ctx.fillStyle = hairGrad;

  ctx.beginPath();
  ctx.arc(cx, cy - 10, 33, Math.PI * 0.78, Math.PI * 2.22);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - 26, cy - 15);
  ctx.bezierCurveTo(cx - 42, cy + 15, cx - 40, cy + 65, cx - 26, cy + 95);
  ctx.bezierCurveTo(cx - 22, cy + 70, cx - 25, cy + 25, cx - 20, cy);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 26, cy - 15);
  ctx.bezierCurveTo(cx + 42, cy + 15, cx + 40, cy + 65, cx + 26, cy + 95);
  ctx.bezierCurveTo(cx + 22, cy + 70, cx + 25, cy + 25, cx + 20, cy);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - 28, cy - 12);
  ctx.quadraticCurveTo(cx - 16, cy + 2, cx - 8, cy - 4);
  ctx.quadraticCurveTo(cx, cy + 4, cx + 6, cy - 3);
  ctx.quadraticCurveTo(cx + 18, cy + 3, cx + 28, cy - 12);
  ctx.quadraticCurveTo(cx + 15, cy - 26, cx, cy - 28);
  ctx.quadraticCurveTo(cx - 15, cy - 26, cx - 28, cy - 12);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(cx, cy - 16, 26, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();

  ctx.fillStyle = '#ffd700';
  ctx.strokeStyle = '#ff8f00';
  ctx.lineWidth = 1.6;

  ctx.beginPath();
  ctx.moveTo(cx - 16, cy - 28);
  ctx.lineTo(cx - 8, cy - 38);
  ctx.lineTo(cx, cy - 44);
  ctx.lineTo(cx + 8, cy - 38);
  ctx.lineTo(cx + 16, cy - 28);
  ctx.quadraticCurveTo(cx, cy - 32, cx - 16, cy - 28);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isStella ? '#e91e63' : '#00e5ff';
  ctx.beginPath();
  ctx.arc(cx, cy - 36, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function updateAndDrawParticles(ctx) {
  if (Math.random() < 0.35) {
    const side = Math.random() < 0.5 ? -1 : 1;
    dustParticles.push({
      x: 150 + side * (50 + Math.random() * 45),
      y: 180 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(Math.random() * 1.2 + 0.6),
      size: Math.random() * 8 + 8,
      opacity: 1,
      char: Math.random() < 0.5 ? '✨' : '✦'
    });
  }

  for (let i = dustParticles.length - 1; i >= 0; i--) {
    const d = dustParticles[i];
    d.x += d.vx;
    d.y += d.vy;
    d.opacity -= 0.015;

    ctx.save();
    ctx.globalAlpha = Math.max(0, d.opacity);
    ctx.font = `${d.size}px serif`;
    ctx.fillStyle = '#ffd700';
    ctx.fillText(d.char, d.x, d.y);
    ctx.restore();

    if (d.opacity <= 0) dustParticles.splice(i, 1);
  }

  for (let i = heartParticles.length - 1; i >= 0; i--) {
    const p = heartParticles[i];
    p.y += p.vy;
    p.x += p.vx;
    p.opacity -= 0.02;

    ctx.save();
    ctx.globalAlpha = Math.max(0, p.opacity);
    ctx.font = `${p.size}px serif`;
    ctx.fillText('💖', p.x, p.y);
    ctx.restore();

    if (p.opacity <= 0) heartParticles.splice(i, 1);
  }
}

// -------------------------------------------------------------
// ГОЛОС ФЕИ
// -------------------------------------------------------------
const COMPLIMENTS = [
  "Ты сегодня выглядишь просто восхитительно! ✨",
  "Я так рада, что ты со мной играешь! 💖",
  "Погладь меня по голове, мне так приятно! 🥰",
  "У тебя самый добрый взгляд во всей Алфее! 🌸",
  "Покорми меня вкусняшкой, пожалуйста, ням-ням! 🥐",
  "Ты моя самая любимая феечка на свете! 👑"
];

function speakPhrase(text) {
  const speechBubble = document.getElementById('speech-bubble');
  const speechText = document.getElementById('speech-text');
  speechText.textContent = text;
  speechBubble.style.display = 'block';

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.15;
    utter.pitch = 1.75;
    utter.lang = 'ru-RU';
    window.speechSynthesis.speak(utter);
  }

  if (window.magicAudio) window.magicAudio.playSparkle();

  setTimeout(() => {
    speechBubble.style.display = 'none';
  }, 4500);
}

function speakRandomCompliment() {
  const random = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
  speakPhrase(random);
}

// -------------------------------------------------------------
// КОРМЛЕНИЕ ФЕИ
// -------------------------------------------------------------
const FOOD_DATA = {
  croissant: { hunger: 25, cost: 10 },
  macaron: { hunger: 35, cost: 15 },
  icecream: { hunger: 40, cost: 20 },
  strawberry: { hunger: 15, cost: 5 }
};

function feedFairy(foodKey) {
  const item = FOOD_DATA[foodKey];
  if (!item) return;

  if (fairyState.coins < item.cost) {
    speakPhrase('У нас не хватает монеток 🪙! Сыграй в мини-игры, чтобы заработать!');
    return;
  }

  fairyState.coins -= item.cost;
  fairyState.needs.food = Math.min(100, fairyState.needs.food + item.hunger);
  fairyMood = 'eat';
  mouthOpenTimer = 10;

  if (window.magicAudio) window.magicAudio.playCollect(false);

  speakPhrase('Ммм... Как вкусно! Ням-ням-ням! 💖');
  saveFairy();

  setTimeout(() => {
    fairyMood = 'normal';
    mouthOpenTimer = 0;
  }, 1200);
}

// -------------------------------------------------------------
// МИНИ-ИГРА 1: ЛОПАЙ КРИСТАЛЛЫ (BUBBLE POP)
// -------------------------------------------------------------
let bubbleGameActive = false;
let bubbleTimer = 30;
let bubbleCoinsEarned = 0;
let bubbleCanvas, bubbleCtx;
let bubblesList = [];
let bubbleTimerInterval = null;

function startBubbleGame() {
  document.getElementById('screen-bubble-game').classList.remove('hidden');
  document.getElementById('modal-minigames').classList.add('hidden');

  bubbleCanvas = document.getElementById('bubble-canvas');
  bubbleCanvas.width = bubbleCanvas.clientWidth || window.innerWidth;
  bubbleCanvas.height = bubbleCanvas.clientHeight || window.innerHeight;
  bubbleCtx = bubbleCanvas.getContext('2d');

  bubbleGameActive = true;
  bubbleTimer = 30;
  bubbleCoinsEarned = 0;
  bubblesList = [];

  document.getElementById('bubble-coins-earned').textContent = `🪙 0`;
  document.getElementById('bubble-timer').textContent = `30s`;

  bubbleTimerInterval = setInterval(() => {
    bubbleTimer--;
    document.getElementById('bubble-timer').textContent = `${bubbleTimer}s`;
    if (bubbleTimer <= 0) endBubbleGame();
  }, 1000);

  bubbleCanvas.onpointerdown = (e) => {
    const rect = bubbleCanvas.getBoundingClientRect();
    const tx = e.clientX - rect.left;
    const ty = e.clientY - rect.top;

    for (let i = bubblesList.length - 1; i >= 0; i--) {
      const b = bubblesList[i];
      if (Math.hypot(b.x - tx, b.y - ty) < b.radius + 15) {
        bubblesList.splice(i, 1);
        bubbleCoinsEarned += b.points;
        document.getElementById('bubble-coins-earned').textContent = `🪙 ${bubbleCoinsEarned}`;
        if (window.magicAudio) window.magicAudio.playCollect(false);
        break;
      }
    }
  };

  loopBubbleGame();
}

function loopBubbleGame() {
  if (!bubbleGameActive) return;

  if (Math.random() < 0.08) {
    bubblesList.push({
      x: Math.random() * (bubbleCanvas.width - 60) + 30,
      y: -20,
      speed: Math.random() * 2 + 2,
      radius: 26,
      emoji: Math.random() > 0.4 ? '💎' : (Math.random() > 0.5 ? '💖' : '⭐'),
      points: Math.random() > 0.3 ? 5 : 10
    });
  }

  bubbleCtx.clearRect(0, 0, bubbleCanvas.width, bubbleCanvas.height);

  for (let i = bubblesList.length - 1; i >= 0; i--) {
    const b = bubblesList[i];
    b.y += b.speed;

    bubbleCtx.font = `${b.radius * 1.5}px serif`;
    bubbleCtx.textAlign = 'center';
    bubbleCtx.textBaseline = 'middle';
    bubbleCtx.fillText(b.emoji, b.x, b.y);

    if (b.y > bubbleCanvas.height + 40) bubblesList.splice(i, 1);
  }

  requestAnimationFrame(loopBubbleGame);
}

function endBubbleGame() {
  bubbleGameActive = false;
  clearInterval(bubbleTimerInterval);

  fairyState.coins += bubbleCoinsEarned;
  fairyState.needs.energy = Math.max(10, fairyState.needs.energy - 15);
  saveFairy();

  alert(`Отлично! Ты заработала 🪙 ${bubbleCoinsEarned} монет!`);
  document.getElementById('screen-bubble-game').classList.add('hidden');
}

// -------------------------------------------------------------
// МИНИ-ИГРА 2: ОБЛАЧНЫЙ ПРЫЖОК (CLOUD JUMP)
// -------------------------------------------------------------
let jumpGameActive = false;
let jumpCanvas, jumpCtx;
let jumpScore = 0;
let jumpCoins = 0;
let jumper = { x: 150, y: 300, vy: -10, size: 28 };
let clouds = [];

function startJumpGame() {
  document.getElementById('screen-jump-game').classList.remove('hidden');
  document.getElementById('modal-minigames').classList.add('hidden');

  jumpCanvas = document.getElementById('jump-canvas');
  jumpCanvas.width = jumpCanvas.clientWidth || window.innerWidth;
  jumpCanvas.height = jumpCanvas.clientHeight || window.innerHeight;
  jumpCtx = jumpCanvas.getContext('2d');

  jumpGameActive = true;
  jumpScore = 0;
  jumpCoins = 0;
  jumper.x = jumpCanvas.width / 2;
  jumper.y = jumpCanvas.height - 150;
  jumper.vy = -12;

  clouds = [];
  for (let i = 0; i < 7; i++) {
    clouds.push({
      x: Math.random() * (jumpCanvas.width - 80),
      y: jumpCanvas.height - i * 90,
      width: 75,
      height: 18,
      hasCoin: Math.random() > 0.4
    });
  }

  jumpCanvas.onpointerdown = (e) => {
    const rect = jumpCanvas.getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    if (tapX < jumpCanvas.width / 2) jumper.x -= 35;
    else jumper.x += 35;
  };

  loopJumpGame();
}

function loopJumpGame() {
  if (!jumpGameActive) return;

  jumper.vy += 0.45;
  jumper.y += jumper.vy;

  if (jumper.vy > 0) {
    clouds.forEach(c => {
      if (
        jumper.x > c.x - 15 && jumper.x < c.x + c.width + 15 &&
        jumper.y + jumper.size >= c.y && jumper.y + jumper.size <= c.y + 15
      ) {
        jumper.vy = -12;
        jumpScore += 10;
        if (c.hasCoin) {
          c.hasCoin = false;
          jumpCoins += 5;
        }
        if (window.magicAudio) window.magicAudio.playWingFlap();
      }
    });
  }

  if (jumper.y < 200) {
    const diff = 200 - jumper.y;
    jumper.y = 200;
    clouds.forEach(c => {
      c.y += diff;
      if (c.y > jumpCanvas.height) {
        c.y = 0;
        c.x = Math.random() * (jumpCanvas.width - 80);
        c.hasCoin = Math.random() > 0.4;
      }
    });
  }

  jumpCtx.clearRect(0, 0, jumpCanvas.width, jumpCanvas.height);

  clouds.forEach(c => {
    jumpCtx.fillStyle = '#ffffff';
    jumpCtx.beginPath();
    jumpCtx.roundRect(c.x, c.y, c.width, c.height, 10);
    jumpCtx.fill();

    if (c.hasCoin) {
      jumpCtx.font = '20px serif';
      jumpCtx.fillText('🪙', c.x + c.width / 2 - 8, c.y - 4);
    }
  });

  jumpCtx.font = '36px serif';
  jumpCtx.fillText('🧚‍♀️', jumper.x - 18, jumper.y + 18);

  document.getElementById('jump-score').textContent = jumpScore;
  document.getElementById('jump-coins').textContent = jumpCoins;

  if (jumper.y > jumpCanvas.height + 50) {
    endJumpGame();
    return;
  }

  requestAnimationFrame(loopJumpGame);
}

function endJumpGame() {
  jumpGameActive = false;
  fairyState.coins += jumpCoins;
  saveFairy();
  alert(`Игра окончена! Заработано 🪙 ${jumpCoins} монет!`);
  document.getElementById('screen-jump-game').classList.add('hidden');
}

// -------------------------------------------------------------
// МИНИ-ИГРА 3: СЛАДОСТИ В КОРЗИНКУ (CATCH FOOD)
// -------------------------------------------------------------
let catchGameActive = false;
let catchCanvas, catchCtx;
let catchScore = 0;
let catchCoins = 0;
let basket = { x: 150, y: 0, width: 85, height: 35 };
let fallingItems = [];

function startCatchGame() {
  document.getElementById('screen-catch-game').classList.remove('hidden');
  document.getElementById('modal-minigames').classList.add('hidden');

  catchCanvas = document.getElementById('catch-canvas');
  catchCanvas.width = catchCanvas.clientWidth || window.innerWidth;
  catchCanvas.height = catchCanvas.clientHeight || window.innerHeight;
  catchCtx = catchCanvas.getContext('2d');

  catchGameActive = true;
  catchScore = 0;
  catchCoins = 0;
  basket.x = catchCanvas.width / 2 - 40;
  basket.y = catchCanvas.height - 75;
  fallingItems = [];

  document.getElementById('catch-score').textContent = `0`;
  document.getElementById('catch-coins').textContent = `0`;

  catchCanvas.onpointermove = (e) => {
    const rect = catchCanvas.getBoundingClientRect();
    basket.x = e.clientX - rect.left - basket.width / 2;
  };
  catchCanvas.ontouchmove = (e) => {
    const rect = catchCanvas.getBoundingClientRect();
    basket.x = e.touches[0].clientX - rect.left - basket.width / 2;
  };

  loopCatchGame();
}

function loopCatchGame() {
  if (!catchGameActive) return;

  if (Math.random() < 0.05) {
    const isBad = Math.random() < 0.25;
    fallingItems.push({
      x: Math.random() * (catchCanvas.width - 50) + 25,
      y: -20,
      speed: Math.random() * 2 + 2.5,
      emoji: isBad ? '❄️' : (Math.random() > 0.5 ? '🥐' : '🍓'),
      isBad: isBad
    });
  }

  catchCtx.clearRect(0, 0, catchCanvas.width, catchCanvas.height);

  // Рисуем корзинку
  catchCtx.fillStyle = '#ff80ab';
  catchCtx.beginPath();
  catchCtx.roundRect(basket.x, basket.y, basket.width, basket.height, 12);
  catchCtx.fill();
  catchCtx.strokeStyle = '#fff';
  catchCtx.lineWidth = 3;
  catchCtx.stroke();
  catchCtx.font = '22px serif';
  catchCtx.fillText('🧺', basket.x + basket.width / 2 - 12, basket.y + 26);

  // Рисуем и проверяем падающие сладости
  for (let i = fallingItems.length - 1; i >= 0; i--) {
    const it = fallingItems[i];
    it.y += it.speed;

    catchCtx.font = '32px serif';
    catchCtx.fillText(it.emoji, it.x, it.y);

    // Попадание в корзину
    if (it.y >= basket.y && it.y <= basket.y + basket.height && it.x >= basket.x - 10 && it.x <= basket.x + basket.width + 10) {
      if (it.isBad) {
        // Заморозка! Конец игры
        endCatchGame();
        return;
      } else {
        catchScore++;
        catchCoins += 3;
        document.getElementById('catch-score').textContent = catchScore;
        document.getElementById('catch-coins').textContent = catchCoins;
        if (window.magicAudio) window.magicAudio.playCollect(false);
      }
      fallingItems.splice(i, 1);
      continue;
    }

    if (it.y > catchCanvas.height + 40) fallingItems.splice(i, 1);
  }

  requestAnimationFrame(loopCatchGame);
}

function endCatchGame() {
  catchGameActive = false;
  fairyState.coins += catchCoins;
  saveFairy();
  alert(`Ой, сосулька заморозила корзинку! Ты поймала ${catchScore} сладостей и заработала 🪙 ${catchCoins} монет!`);
  document.getElementById('screen-catch-game').classList.add('hidden');
}

// -------------------------------------------------------------
// МИНИ-ИГРА 4: МАГИЧЕСКИЕ ПАРОЧКИ (MEMORY MATCH)
// -------------------------------------------------------------
const MEMORY_ICONS = ['🌸', '☀️', '🔥', '🎶', '⚡', '🌊'];
let memoryFlipped = [];
let memoryMatchedCount = 0;

function startMemoryGame() {
  document.getElementById('screen-memory-game').classList.remove('hidden');
  document.getElementById('modal-minigames').classList.add('hidden');

  memoryMatchedCount = 0;
  document.getElementById('memory-pairs-found').textContent = `0 / 6`;

  const grid = document.getElementById('memory-cards-grid');
  grid.innerHTML = '';
  memoryFlipped = [];

  // Создаем 12 карточек (6 пар)
  const deck = [...MEMORY_ICONS, ...MEMORY_ICONS].sort(() => Math.random() - 0.5);

  deck.forEach((icon, index) => {
    const tile = document.createElement('div');
    tile.className = 'memory-card-tile';
    tile.dataset.icon = icon;
    tile.dataset.idx = index;
    tile.textContent = '✨';

    tile.onclick = () => {
      if (tile.classList.contains('flipped') || tile.classList.contains('matched') || memoryFlipped.length >= 2) return;

      tile.classList.add('flipped');
      tile.textContent = icon;
      memoryFlipped.push(tile);

      if (window.magicAudio) window.magicAudio.playSparkle();

      if (memoryFlipped.length === 2) {
        setTimeout(checkMemoryMatch, 600);
      }
    };

    grid.appendChild(tile);
  });
}

function checkMemoryMatch() {
  const [c1, c2] = memoryFlipped;
  if (c1.dataset.icon === c2.dataset.icon) {
    c1.classList.add('matched');
    c2.classList.add('matched');
    memoryMatchedCount++;
    document.getElementById('memory-pairs-found').textContent = `${memoryMatchedCount} / 6`;
    if (window.magicAudio) window.magicAudio.playCollect(true);

    if (memoryMatchedCount >= 6) {
      setTimeout(() => {
        fairyState.coins += 80;
        saveFairy();
        alert('Потрясающе! Все пары найдены! Заработано 🪙 80 монет!');
        document.getElementById('screen-memory-game').classList.add('hidden');
      }, 500);
    }
  } else {
    c1.classList.remove('flipped');
    c1.textContent = '✨';
    c2.classList.remove('flipped');
    c2.textContent = '✨';
  }
  memoryFlipped = [];
}

// -------------------------------------------------------------
// МИНИ-ИГРА 5: МУЗЫКАЛЬНЫЕ ПЛИТКИ (RHYTHM TILES)
// -------------------------------------------------------------
let rhythmActive = false;
let rhythmCanvas, rhythmCtx;
let rhythmScore = 0;
let rhythmCoins = 0;
let rhythmNotes = [];

function startRhythmGame() {
  document.getElementById('screen-rhythm-game').classList.remove('hidden');
  document.getElementById('modal-minigames').classList.add('hidden');

  rhythmCanvas = document.getElementById('rhythm-canvas');
  rhythmCanvas.width = rhythmCanvas.clientWidth || window.innerWidth;
  rhythmCanvas.height = rhythmCanvas.clientHeight || window.innerHeight;
  rhythmCtx = rhythmCanvas.getContext('2d');

  rhythmActive = true;
  rhythmScore = 0;
  rhythmCoins = 0;
  rhythmNotes = [];

  document.getElementById('rhythm-score').textContent = `0`;
  document.getElementById('rhythm-coins').textContent = `0`;

  const laneWidth = rhythmCanvas.width / 3;

  rhythmCanvas.onpointerdown = (e) => {
    const rect = rhythmCanvas.getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    const tapY = e.clientY - rect.top;
    const laneIndex = Math.floor(tapX / laneWidth);

    // Проверяем ноту в этой полосе внизу экрана
    for (let i = rhythmNotes.length - 1; i >= 0; i--) {
      const n = rhythmNotes[i];
      if (n.lane === laneIndex && Math.abs(n.y - (rhythmCanvas.height - 90)) < 70) {
        rhythmScore += 10;
        rhythmCoins += 2;
        document.getElementById('rhythm-score').textContent = rhythmScore;
        document.getElementById('rhythm-coins').textContent = rhythmCoins;
        if (window.magicAudio) window.magicAudio.playSparkle();
        rhythmNotes.splice(i, 1);
        break;
      }
    }
  };

  loopRhythmGame();
}

function loopRhythmGame() {
  if (!rhythmActive) return;

  const laneWidth = rhythmCanvas.width / 3;

  if (Math.random() < 0.04) {
    rhythmNotes.push({
      lane: Math.floor(Math.random() * 3),
      y: -30,
      speed: 4.2
    });
  }

  rhythmCtx.clearRect(0, 0, rhythmCanvas.width, rhythmCanvas.height);

  // Линии дорожек
  rhythmCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  rhythmCtx.lineWidth = 2;
  for (let l = 1; l < 3; l++) {
    rhythmCtx.beginPath();
    rhythmCtx.moveTo(l * laneWidth, 0);
    rhythmCtx.lineTo(l * laneWidth, rhythmCanvas.height);
    rhythmCtx.stroke();
  }

  // Зона нажатия внизу
  const targetY = rhythmCanvas.height - 90;
  rhythmCtx.fillStyle = 'rgba(255, 64, 129, 0.3)';
  rhythmCtx.fillRect(0, targetY - 40, rhythmCanvas.width, 80);
  rhythmCtx.strokeStyle = '#ffd700';
  rhythmCtx.strokeRect(0, targetY - 40, rhythmCanvas.width, 80);

  // Ноты
  for (let i = rhythmNotes.length - 1; i >= 0; i--) {
    const n = rhythmNotes[i];
    n.y += n.speed;

    rhythmCtx.font = '36px serif';
    rhythmCtx.fillText('🎵', n.lane * laneWidth + laneWidth / 2 - 18, n.y);

    if (n.y > rhythmCanvas.height + 40) rhythmNotes.splice(i, 1);
  }

  requestAnimationFrame(loopRhythmGame);
}

function endRhythmGame() {
  rhythmActive = false;
  fairyState.coins += rhythmCoins;
  saveFairy();
  alert(`Отличный ритм! Ты заработала 🪙 ${rhythmCoins} монет!`);
  document.getElementById('screen-rhythm-game').classList.add('hidden');
}

// -------------------------------------------------------------
// ОБНОВЛЕНИЕ ШКАЛ И СЛУШАТЕЛИ
// -------------------------------------------------------------
function updateNeedsUI() {
  document.getElementById('ui-coins').textContent = fairyState.coins;
  document.getElementById('ui-level').textContent = `Ур. ${fairyState.level}`;

  updateFillBar('fill-food', fairyState.needs.food);
  updateFillBar('fill-love', fairyState.needs.love);
  updateFillBar('fill-energy', fairyState.needs.energy);
  updateFillBar('fill-sleep', fairyState.needs.sleep);
}

function updateFillBar(elementId, value) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.style.height = `${value}%`;

  el.classList.remove('low', 'mid');
  if (value < 25) el.classList.add('low');
  else if (value < 55) el.classList.add('mid');
}

window.addEventListener('DOMContentLoaded', () => {
  initFairyStage();
  renderRoomDecorations('living');
  saveFairy();

  // Переключение комнат через верхние кнопки
  document.querySelectorAll('.room-pill-btn').forEach(btn => {
    btn.onclick = () => renderRoomDecorations(btn.dataset.room);
  });

  // Навигация нижних кнопок
  document.getElementById('nav-need-food').onclick = () => renderRoomDecorations('kitchen');
  document.getElementById('nav-need-love').onclick = () => renderRoomDecorations('living');
  document.getElementById('nav-need-sleep').onclick = () => renderRoomDecorations('bedroom');

  // Еда
  document.querySelectorAll('.food-item-slot').forEach(slot => {
    slot.onclick = () => feedFairy(slot.dataset.food);
  });

  // Игры
  document.getElementById('nav-need-games').onclick = () => {
    document.getElementById('modal-minigames').classList.remove('hidden');
  };
  document.getElementById('close-games-modal').onclick = () => {
    document.getElementById('modal-minigames').classList.add('hidden');
  };

  // Запуск 5 мини-игр
  document.getElementById('btn-play-bubbles').onclick = startBubbleGame;
  document.getElementById('btn-play-jump').onclick = startJumpGame;
  document.getElementById('btn-play-catch').onclick = startCatchGame;
  document.getElementById('btn-play-memory').onclick = startMemoryGame;
  document.getElementById('btn-play-rhythm').onclick = startRhythmGame;

  // Выходы из игр
  document.getElementById('exit-bubble-game').onclick = endBubbleGame;
  document.getElementById('exit-jump-game').onclick = () => {
    jumpGameActive = false;
    document.getElementById('screen-jump-game').classList.add('hidden');
  };
  document.getElementById('exit-catch-game').onclick = endCatchGame;
  document.getElementById('exit-memory-game').onclick = () => {
    document.getElementById('screen-memory-game').classList.add('hidden');
  };
  document.getElementById('exit-rhythm-game').onclick = endRhythmGame;

  // Сон
  const lampBtn = document.getElementById('btn-lamp-sleep');
  const nightFilter = document.getElementById('night-filter');

  function toggleSleep() {
    fairyState.isSleeping = !fairyState.isSleeping;
    if (fairyState.isSleeping) {
      nightFilter.classList.remove('hidden');
      lampBtn.querySelector('.lamp-icon').textContent = '🌙';
      fairyMood = 'sleep';
      speakPhrase('Спокойной ночи, любимая... Сладких снов! 💤');
      fairyState.needs.sleep = 100;
    } else {
      nightFilter.classList.add('hidden');
      lampBtn.querySelector('.lamp-icon').textContent = '💡';
      fairyMood = 'normal';
      speakPhrase('Доброе утро, солнышко! Я выспалась и полна сил! ✨');
    }
    saveFairy();
  }

  lampBtn.onclick = toggleSleep;

  // Гардероб
  document.getElementById('nav-need-closet').onclick = () => {
    document.getElementById('modal-closet').classList.remove('hidden');
    renderClosetItems('dresses');
  };
  document.getElementById('close-closet-modal').onclick = () => {
    document.getElementById('modal-closet').classList.add('hidden');
  };

  // Говорящая фея
  document.getElementById('btn-talk-fairy').onclick = speakRandomCompliment;

  // Звук
  document.getElementById('btn-sound-toggle').onclick = () => {
    if (window.magicAudio) {
      const en = window.magicAudio.toggleSound();
      document.getElementById('btn-sound-toggle').textContent = en ? '🔊' : '🔇';
    }
  };
});

// Гардероб
const CLOSET_DATA = {
  dresses: [
    { id: 'bloom_dress', name: 'Бирюзовый топ', emoji: '👗', cost: 0 },
    { id: 'stella_sparkle', name: 'Сияние Стеллы', emoji: '✨', cost: 50 },
    { id: 'princess_pink', name: 'Розовое платье', emoji: '👑', cost: 80 }
  ],
  wings: [
    { id: 'enchantix_wings', name: 'Энчантикс', emoji: '🧚‍♀️', cost: 0 },
    { id: 'sun_wings', name: 'Крылья Солнца', emoji: '☀️', cost: 60 }
  ],
  hair: [
    { id: 'bloom_orange', name: 'Огненные Блум', emoji: '🧡', cost: 0 },
    { id: 'stella_gold', name: 'Золотые Стеллы', emoji: '💛', cost: 40 }
  ]
};

function renderClosetItems(cat) {
  const grid = document.getElementById('closet-items-grid');
  grid.innerHTML = '';
  const items = CLOSET_DATA[cat] || [];

  items.forEach(it => {
    const card = document.createElement('div');
    const isEq = fairyState.equipped[cat] === it.id;
    card.className = `closet-item-card ${isEq ? 'equipped' : ''}`;
    card.innerHTML = `
      <div class="closet-icon">${it.emoji}</div>
      <b>${it.name}</b>
      <small>${isEq ? '✓ Надето' : (it.cost === 0 ? 'Бесплатно' : `🪙 ${it.cost}`)}</small>
    `;

    card.onclick = () => {
      if (it.cost === 0 || fairyState.coins >= it.cost) {
        fairyState.equipped[cat] = it.id;
        saveFairy();
        if (window.magicAudio) window.magicAudio.playSparkle();
        renderClosetItems(cat);
        speakPhrase('Вау! Какой красивый наряд! Мне так идёт! 💖');
      } else {
        speakPhrase('Не хватает монеток 🪙! Давай сыграем в мини-игру!');
      }
    };

    grid.appendChild(card);
  });
}
