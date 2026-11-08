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
// 1. ДЕТАЛИЗИРОВАННЫЕ КОМНАТЫ ФЕИ (ВИЗУАЛЬНЫЙ РЕНДЕР)
// -------------------------------------------------------------
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
    // ГОСТИНАЯ: Окно с видом на замок Алфея, пушистый ковер, гирлянда
    container.className = 'room-scenery-backdrop room-living-theme';
    container.innerHTML = `
      <div class="garland-lights">✨ 💖 ✨ 💖 ✨ 💖 ✨</div>
      <div class="room-arch-window">
        <div class="window-view-sky">
          <div class="window-sun">☀️</div>
          <div class="window-spire"></div>
        </div>
      </div>
      <div class="room-cozy-rug"></div>
    `;
    tray.classList.add('hidden');
    lamp.classList.add('hidden');
    speakPhrase('Добро пожаловать в мой уютный зал! Погладь меня! 💖');
  } else if (room === 'kitchen') {
    // КУХНЯ: Мятная плитка, обеденный столик со скатертью, полочки
    container.className = 'room-scenery-backdrop room-kitchen-theme';
    container.innerHTML = `
      <div class="garland-lights">🍯 🫖 🍓 🧁 🍯 🫖</div>
      <div class="room-arch-window">
        <div class="window-view-sky">
          <div class="window-sun">🌤️</div>
        </div>
      </div>
      <div class="kitchen-table-decor"></div>
    `;
    tray.classList.remove('hidden');
    lamp.classList.add('hidden');
    speakPhrase('Ура, мы на кухне! Покорми меня вкусняшкой на столике! 🧁');
  } else if (room === 'bedroom') {
    // СПАЛЬНЯ: Звёздные обои, роскошная кровать с подушками, ночник
    container.className = 'room-scenery-backdrop room-bedroom-theme';
    container.innerHTML = `
      <div class="garland-lights">⭐ 🌙 ⭐ 🌙 ⭐ 🌙</div>
      <div class="room-arch-window">
        <div class="window-view-sky" style="background: linear-gradient(180deg, #1a237e 0%, #311b92 100%);">
          <div class="window-sun" style="color: #ffd700;">🌙</div>
        </div>
      </div>
      <div class="room-bed-decor">
        <div class="bed-pillow"></div>
      </div>
    `;
    tray.classList.add('hidden');
    lamp.classList.remove('hidden');
    speakPhrase('Это моя спальня! Нажми на ночник 💡, если хочешь уложить меня спать.');
  }

  saveFairy();
}

// -------------------------------------------------------------
// 2. АНИМИРОВАННАЯ ФЕЯ (CANVAS С ОТСЛЕЖИВАНИЕМ ПАЛЬЦА)
// -------------------------------------------------------------
let fairyCanvas, fairyCtx;
let touchPos = { x: 140, y: 190 };
let fairyMood = 'normal';
let mouthOpenTimer = 0;
let wingAngle = 0;
let heartParticles = [];

function initFairyStage() {
  fairyCanvas = document.getElementById('fairy-canvas');
  fairyCtx = fairyCanvas.getContext('2d');

  window.addEventListener('mousemove', (e) => {
    const rect = fairyCanvas.getBoundingClientRect();
    touchPos.x = e.clientX - rect.left;
    touchPos.y = e.clientY - rect.top;
  });

  fairyCanvas.addEventListener('touchstart', (e) => {
    const rect = fairyCanvas.getBoundingClientRect();
    touchPos.x = e.touches[0].clientX - rect.left;
    touchPos.y = e.touches[0].clientY - rect.top;
    handleFairyTouch(touchPos.x, touchPos.y);
  }, { passive: true });

  fairyCanvas.addEventListener('mousedown', (e) => {
    const rect = fairyCanvas.getBoundingClientRect();
    handleFairyTouch(e.clientX - rect.left, e.clientY - rect.top);
  });

  animateFairy(0);
}

function handleFairyTouch(x, y) {
  if (fairyState.isSleeping) {
    speakPhrase('Шшш... Фея спит! Включи ночник 💡, чтобы разбудить.');
    return;
  }

  if (y < 150) {
    fairyMood = 'happy';
    fairyState.needs.love = Math.min(100, fairyState.needs.love + 8);
    spawnHearts(x, y);
    if (window.magicAudio) window.magicAudio.playCollect(true);
    speakRandomCompliment();
    saveFairy();
  } else if (y >= 150 && y < 240) {
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
  fairyCtx.clearRect(0, 0, fairyCanvas.width, fairyCanvas.height);

  const cx = 140;
  const cy = 200 + Math.sin(t * 2) * 4;

  const flap = Math.sin(t * 5 + wingAngle) * 0.45;
  drawFairyWings(fairyCtx, cx, cy - 20, flap);
  drawFairyBody(fairyCtx, cx, cy);
  drawFairyFace(fairyCtx, cx, cy - 70);
  drawFairyHair(fairyCtx, cx, cy - 70);

  for (let i = heartParticles.length - 1; i >= 0; i--) {
    const p = heartParticles[i];
    p.y += p.vy;
    p.x += p.vx;
    p.opacity -= 0.02;

    fairyCtx.save();
    fairyCtx.globalAlpha = Math.max(0, p.opacity);
    fairyCtx.font = `${p.size}px serif`;
    fairyCtx.fillText('💖', p.x, p.y);
    fairyCtx.restore();

    if (p.opacity <= 0) heartParticles.splice(i, 1);
  }
}

function drawFairyWings(ctx, cx, cy, flap) {
  ctx.save();
  ctx.translate(cx, cy);

  const scaleX = 0.8 + flap * 0.25;

  ctx.save();
  ctx.scale(-scaleX, 1);
  drawSingleWing(ctx);
  ctx.restore();

  ctx.save();
  ctx.scale(scaleX, 1);
  drawSingleWing(ctx);
  ctx.restore();

  ctx.restore();
}

function drawSingleWing(ctx) {
  ctx.shadowBlur = 15;
  const isSun = fairyState.equipped && fairyState.equipped.wings === 'sun_wings';
  ctx.shadowColor = isSun ? '#ffd700' : '#ff4081';

  const grad = ctx.createLinearGradient(0, -60, 90, 40);
  if (isSun) {
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#ffa726');
    grad.addColorStop(1, '#ffeb3b');
  } else {
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#ff4081');
    grad.addColorStop(1, '#ffd700');
  }

  ctx.fillStyle = grad;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(30, -70, 95, -80, 105, -30);
  ctx.bezierCurveTo(115, 15, 60, 45, 0, 0);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 5);
  ctx.bezierCurveTo(35, 20, 65, 55, 55, 80);
  ctx.bezierCurveTo(40, 95, 10, 40, 0, 5);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
}

function drawFairyBody(ctx, cx, cy) {
  // Шея
  ctx.fillStyle = '#ffe0b2';
  ctx.fillRect(cx - 7, cy - 40, 14, 20);

  const dress = (fairyState.equipped && fairyState.equipped.dresses) || 'bloom_dress';
  let topColor = '#00e5ff';
  let skirtColor = '#00bcd4';
  let glowColor = '#00e5ff';
  let beltColor = '#ffd700';

  if (dress === 'stella_sparkle') {
    topColor = '#ff9800';
    skirtColor = '#ffb300';
    glowColor = '#ffd700';
    beltColor = '#e91e63';
  } else if (dress === 'princess_pink') {
    topColor = '#ff4081';
    skirtColor = '#f06292';
    glowColor = '#ff80ab';
    beltColor = '#ffd700';
  }

  // Топ наряда
  ctx.fillStyle = topColor;
  ctx.shadowBlur = 8;
  ctx.shadowColor = glowColor;
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy - 25);
  ctx.lineTo(cx + 20, cy - 25);
  ctx.lineTo(cx + 25, cy + 20);
  ctx.lineTo(cx - 25, cy + 20);
  ctx.closePath();
  ctx.fill();

  // Юбочка
  ctx.fillStyle = skirtColor;
  ctx.beginPath();
  ctx.moveTo(cx - 25, cy + 20);
  ctx.quadraticCurveTo(cx - 40, cy + 55, cx - 30, cy + 70);
  ctx.quadraticCurveTo(cx, cy + 85, cx + 30, cy + 70);
  ctx.quadraticCurveTo(cx + 40, cy + 55, cx + 25, cy + 20);
  ctx.closePath();
  ctx.fill();

  // Поясок с сердечком
  ctx.fillStyle = beltColor;
  ctx.fillRect(cx - 22, cy + 18, 44, 5);
  ctx.font = '14px serif';
  ctx.fillText('💖', cx - 7, cy + 24);

  // Ножки
  ctx.fillStyle = '#ffe0b2';
  ctx.fillRect(cx - 16, cy + 70, 10, 50);
  ctx.fillRect(cx + 6, cy + 70, 10, 50);

  // Туфельки
  ctx.fillStyle = (dress === 'stella_sparkle') ? '#ff9800' : '#ff4081';
  ctx.beginPath();
  ctx.arc(cx - 11, cy + 120, 8, 0, Math.PI * 2);
  ctx.arc(cx + 11, cy + 120, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawFairyFace(ctx, cx, cy) {
  ctx.fillStyle = '#ffe0b2';
  ctx.beginPath();
  ctx.arc(cx, cy, 32, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 64, 129, 0.45)';
  ctx.beginPath();
  ctx.arc(cx - 16, cy + 8, 7, 0, Math.PI * 2);
  ctx.arc(cx + 16, cy + 8, 7, 0, Math.PI * 2);
  ctx.fill();

  if (fairyState.isSleeping || fairyMood === 'sleep') {
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx - 13, cy - 2, 7, 0.2, Math.PI - 0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 13, cy - 2, 7, 0.2, Math.PI - 0.2);
    ctx.stroke();
  } else {
    drawTrackingEye(ctx, cx - 13, cy - 3, touchPos.x, touchPos.y);
    drawTrackingEye(ctx, cx + 13, cy - 3, touchPos.x, touchPos.y);
  }

  ctx.fillStyle = '#d7ccc8';
  ctx.beginPath();
  ctx.arc(cx, cy + 7, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#c2185b';
  ctx.fillStyle = '#ff4081';
  ctx.lineWidth = 2.5;

  if (fairyMood === 'eat' || mouthOpenTimer > 0) {
    ctx.beginPath();
    ctx.ellipse(cx, cy + 16, 7, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (fairyMood === 'laugh') {
    ctx.beginPath();
    ctx.arc(cx, cy + 14, 10, 0.1, Math.PI - 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(cx, cy + 13, 8, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }
}

function drawTrackingEye(ctx, eyeX, eyeY, targetX, targetY) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(eyeX, eyeY, 8, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  const dx = targetX - eyeX;
  const dy = targetY - eyeY;
  const dist = Math.hypot(dx, dy) || 1;
  const maxPupilOffset = 3.5;
  const pupilX = eyeX + (dx / dist) * Math.min(dist, maxPupilOffset);
  const pupilY = eyeY + (dy / dist) * Math.min(dist, maxPupilOffset);

  ctx.fillStyle = '#00bcd4';
  ctx.beginPath();
  ctx.arc(pupilX, pupilY, 5.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#004d40';
  ctx.beginPath();
  ctx.arc(pupilX, pupilY, 3.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(pupilX - 1.8, pupilY - 2, 2.2, 0, Math.PI * 2);
  ctx.arc(pupilX + 2, pupilY + 2, 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#212121';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(eyeX, eyeY - 7, 8, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
}

function drawFairyHair(ctx, cx, cy) {
  const hair = (fairyState.equipped && fairyState.equipped.hair) || 'bloom_orange';
  let hairColor = '#ff3d00';
  let crownColor = '#ffd700';

  if (hair === 'stella_gold') {
    hairColor = '#ffb300';
    crownColor = '#ff4081';
  }

  ctx.fillStyle = hairColor;

  ctx.beginPath();
  ctx.moveTo(cx - 30, cy);
  ctx.quadraticCurveTo(cx - 55, cy + 50, cx - 35, cy + 120);
  ctx.quadraticCurveTo(cx - 20, cy + 70, cx - 22, cy + 20);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx + 30, cy);
  ctx.quadraticCurveTo(cx + 55, cy + 50, cx + 35, cy + 120);
  ctx.quadraticCurveTo(cx + 20, cy + 70, cx + 22, cy + 20);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy - 10, 34, Math.PI * 0.8, Math.PI * 2.2);
  ctx.fill();

  ctx.fillStyle = crownColor;
  ctx.beginPath();
  ctx.moveTo(cx - 16, cy - 30);
  ctx.lineTo(cx, cy - 42);
  ctx.lineTo(cx + 16, cy - 30);
  ctx.lineTo(cx, cy - 34);
  ctx.closePath();
  ctx.fill();
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
