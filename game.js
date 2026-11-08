// Winx: Хроники Алфеи и Сила Любви — Полный игровой движок

// 1. СИСТЕМА СОХРАНЕНИЯ (LOCALSTORAGE)
const SAVE_KEY = 'winx_chronicles_save_v1';

let saveData = {
  name: 'Любимая Фея',
  stars: 50,
  hearts: 20,
  currentChapter: 1,
  completedChapters: [],
  equipped: {
    wings: 'wings_basic',
    outfit: 'outfit_school',
    hair: 'hair_bloom',
    pet: 'pet_none'
  },
  unlockedItems: ['wings_basic', 'outfit_school', 'hair_bloom', 'pet_none'],
  readLetters: []
};

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      saveData = Object.assign(saveData, parsed);
    }
  } catch (e) {
    console.error('Ошибка загрузки сохранения', e);
  }
}

function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    updateHUD();
  } catch (e) {
    console.error('Ошибка записи сохранения', e);
  }
}

// 2. ОБНОВЛЕНИЕ ВЕРХНЕЙ ПАНЕЛИ
function updateHUD() {
  const starsEl = document.getElementById('ui-stars');
  const heartsEl = document.getElementById('ui-hearts');
  if (starsEl) starsEl.textContent = saveData.stars;
  if (heartsEl) heartsEl.textContent = saveData.hearts;

  const chapStatus = document.getElementById('hub-chapter-status');
  if (chapStatus) {
    const chap = GAME_STORY.chapters.find(c => c.id === saveData.currentChapter);
    chapStatus.textContent = chap ? `${chap.title}` : 'Все главы пройдены! 👑';
  }

  const petTag = document.getElementById('hub-pet-tag');
  if (petTag) {
    const petItem = GAME_STORY.wardrobeShop.pets.find(p => p.id === saveData.equipped.pet);
    if (petItem && petItem.id !== 'pet_none') {
      petTag.textContent = `${petItem.icon} ${petItem.name} с тобой`;
      petTag.classList.remove('hidden');
    } else {
      petTag.classList.add('hidden');
    }
  }
}

// 3. ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ
let currentScreenId = 'screen-welcome';

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    currentScreenId = screenId;
  }

  const backBtn = document.getElementById('nav-hub-btn');
  if (screenId === 'screen-welcome' || screenId === 'screen-hub') {
    backBtn.classList.add('hidden');
  } else {
    backBtn.classList.remove('hidden');
  }

  saveGame();
}

// 4. ПРОЦЕДУРНЫЙ РЕНДЕР ПЕРСОНАЖЕЙ (CANVAS)
function drawCharacter(ctx, x, y, scale = 1, charType = 'player', wingAngle = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  if (charType === 'player') {
    drawPlayerFairy(ctx, wingAngle);
  } else if (charType === 'bloom') {
    drawPresetFairy(ctx, '#ff5722', '#00b0ff', '#ff69b4', 'bloom', wingAngle);
  } else if (charType === 'stella') {
    drawPresetFairy(ctx, '#ffca28', '#ff9800', '#ffd700', 'stella', wingAngle);
  } else if (charType === 'flora') {
    drawPresetFairy(ctx, '#6d4c41', '#e91e63', '#69f0ae', 'flora', wingAngle);
  } else if (charType === 'palladium') {
    drawProfessorPalladium(ctx);
  } else if (charType === 'icy') {
    drawWitchIcy(ctx);
  } else if (charType === 'specialist') {
    drawSpecialist(ctx);
  } else if (charType === 'faragonda') {
    drawFaragonda(ctx);
  }

  ctx.restore();
}

function drawPlayerFairy(ctx, wingAngle) {
  const wingDef = GAME_STORY.wardrobeShop.wings.find(w => w.id === saveData.equipped.wings) || GAME_STORY.wardrobeShop.wings[0];
  const outfitDef = GAME_STORY.wardrobeShop.outfits.find(o => o.id === saveData.equipped.outfit) || GAME_STORY.wardrobeShop.outfits[0];
  const hairDef = GAME_STORY.wardrobeShop.hair.find(h => h.id === saveData.equipped.hair) || GAME_STORY.wardrobeShop.hair[0];

  drawWingsGeneric(ctx, wingDef.color, wingAngle);
  drawBodyGeneric(ctx, outfitDef.color);
  drawFaceGeneric(ctx);
  drawHairGeneric(ctx, hairDef.style, hairDef.color);
  drawCrownGeneric(ctx, '#ffd700');
}

function drawPresetFairy(ctx, hairColor, outfitColor, wingColor, hairStyle, wingAngle) {
  drawWingsGeneric(ctx, wingColor, wingAngle);
  drawBodyGeneric(ctx, outfitColor);
  drawFaceGeneric(ctx);
  drawHairGeneric(ctx, hairStyle, hairColor);
  drawCrownGeneric(ctx, wingColor);
}

function drawWingsGeneric(ctx, color, wingFlapAngle) {
  ctx.save();
  const flap = Math.sin(wingFlapAngle);
  const scaleX = 0.75 + flap * 0.25;

  ctx.save();
  ctx.translate(-8, -15);
  ctx.scale(-scaleX, 1);
  renderWingPath(ctx, color);
  ctx.restore();

  ctx.save();
  ctx.translate(8, -15);
  ctx.scale(scaleX, 1);
  renderWingPath(ctx, color);
  ctx.restore();

  ctx.restore();
}

function renderWingPath(ctx, color) {
  ctx.shadowBlur = 18;
  ctx.shadowColor = color;

  const grad = ctx.createLinearGradient(0, 0, 70, -60);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  grad.addColorStop(0.4, color);
  grad.addColorStop(1, 'rgba(255, 255, 255, 0.2)');

  ctx.fillStyle = grad;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.8;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(20, -50, 70, -75, 80, -40);
  ctx.bezierCurveTo(85, -15, 55, 10, 0, 0);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 5);
  ctx.bezierCurveTo(25, 15, 50, 35, 45, 55);
  ctx.bezierCurveTo(35, 65, 10, 35, 0, 5);
  ctx.fill();
  ctx.stroke();
}

function drawBodyGeneric(ctx, dressColor) {
  ctx.fillStyle = '#ffdfcf';
  ctx.fillRect(-5, 0, 10, 15);

  ctx.fillStyle = dressColor;
  ctx.shadowBlur = 6;
  ctx.shadowColor = dressColor;
  ctx.beginPath();
  ctx.moveTo(-14, 12);
  ctx.lineTo(14, 12);
  ctx.lineTo(18, 38);
  ctx.lineTo(-18, 38);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-18, 38);
  ctx.quadraticCurveTo(-26, 65, -20, 75);
  ctx.quadraticCurveTo(0, 85, 20, 75);
  ctx.quadraticCurveTo(26, 65, 18, 38);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffd700';
  ctx.shadowBlur = 0;
  ctx.fillRect(-17, 36, 34, 4);

  ctx.fillStyle = '#ffdfcf';
  ctx.beginPath();
  ctx.arc(-14, 16, 4, 0, Math.PI * 2);
  ctx.arc(14, 16, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawFaceGeneric(ctx) {
  ctx.fillStyle = '#ffdfcf';
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(0, -14, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 99, 132, 0.45)';
  ctx.beginPath();
  ctx.arc(-11, -8, 5, 0, Math.PI * 2);
  ctx.arc(11, -8, 5, 0, Math.PI * 2);
  ctx.fill();

  drawAnimeEye(ctx, -8, -14);
  drawAnimeEye(ctx, 8, -14);

  ctx.strokeStyle = '#c2185b';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(0, -5, 6, 0.2, Math.PI - 0.2);
  ctx.stroke();
}

function drawAnimeEye(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(0, 0, 5, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#00bcd4';
  ctx.beginPath();
  ctx.ellipse(0, 0.5, 3.8, 5.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#004d40';
  ctx.beginPath();
  ctx.arc(0, 1, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-1.2, -1.8, 1.8, 0, Math.PI * 2);
  ctx.arc(1.5, 2, 1, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#3e2723';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, -3.5, 5.5, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();

  ctx.restore();
}

function drawHairGeneric(ctx, style, color) {
  ctx.fillStyle = color;
  ctx.shadowBlur = 4;
  ctx.shadowColor = color;

  if (style === 'bloom') {
    ctx.beginPath();
    ctx.arc(0, -18, 24, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-20, -12);
    ctx.quadraticCurveTo(-34, 15, -24, 75);
    ctx.quadraticCurveTo(-15, 45, -15, 5);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(20, -12);
    ctx.quadraticCurveTo(34, 15, 24, 75);
    ctx.quadraticCurveTo(15, 45, 15, 5);
    ctx.fill();
  } else if (style === 'stella') {
    ctx.beginPath();
    ctx.arc(0, -18, 23, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-18, -25);
    ctx.quadraticCurveTo(-45, -10, -38, 70);
    ctx.quadraticCurveTo(-25, 40, -18, -15);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(18, -25);
    ctx.quadraticCurveTo(45, -10, 38, 70);
    ctx.quadraticCurveTo(25, 40, 18, -15);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(0, -18, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-22, -10);
    ctx.bezierCurveTo(-40, 15, -28, 50, -35, 80);
    ctx.bezierCurveTo(-20, 65, -15, 30, -15, 5);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(22, -10);
    ctx.bezierCurveTo(40, 15, 28, 50, 35, 80);
    ctx.bezierCurveTo(20, 65, 15, 30, 15, 5);
    ctx.fill();
  }
}

function drawCrownGeneric(ctx, glowColor) {
  ctx.fillStyle = '#ffd700';
  ctx.shadowBlur = 8;
  ctx.shadowColor = glowColor;

  ctx.beginPath();
  ctx.moveTo(-10, -34);
  ctx.lineTo(-6, -42);
  ctx.lineTo(0, -36);
  ctx.lineTo(6, -42);
  ctx.lineTo(10, -34);
  ctx.closePath();
  ctx.fill();
}

// Рендер Специалиста
function drawSpecialist(ctx) {
  // Доспехи
  ctx.fillStyle = '#1e88e5';
  ctx.beginPath();
  ctx.moveTo(-18, 10);
  ctx.lineTo(18, 10);
  ctx.lineTo(14, 55);
  ctx.lineTo(-14, 55);
  ctx.closePath();
  ctx.fill();

  // Наплечники и плащ
  ctx.fillStyle = '#0d47a1';
  ctx.fillRect(-22, 10, 8, 15);
  ctx.fillRect(14, 10, 8, 15);

  // Голова
  ctx.fillStyle = '#ffdfcf';
  ctx.beginPath();
  ctx.arc(0, -14, 20, 0, Math.PI * 2);
  ctx.fill();

  // Волосы (русые / золотистые)
  ctx.fillStyle = '#d4a373';
  ctx.beginPath();
  ctx.arc(0, -18, 22, Math.PI * 0.9, Math.PI * 2.1);
  ctx.fill();
  ctx.fillRect(-18, -25, 36, 12);

  // Глаза
  drawAnimeEye(ctx, -7, -13);
  drawAnimeEye(ctx, 7, -13);

  // Улыбка
  ctx.strokeStyle = '#5d4037';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(0, -4, 5, 0.2, Math.PI - 0.2);
  ctx.stroke();
}

// Рендер ведьмы Айси
function drawWitchIcy(ctx) {
  // Ледяное тёмное платье
  ctx.fillStyle = '#1a237e';
  ctx.shadowBlur = 12;
  ctx.shadowColor = '#00e5ff';
  ctx.beginPath();
  ctx.moveTo(-16, 12);
  ctx.lineTo(16, 12);
  ctx.lineTo(20, 65);
  ctx.lineTo(-20, 65);
  ctx.closePath();
  ctx.fill();

  // Лицо
  ctx.fillStyle = '#f0f4c3';
  ctx.beginPath();
  ctx.arc(0, -14, 20, 0, Math.PI * 2);
  ctx.fill();

  // Ледяные белые волосы (высокий хвост)
  ctx.fillStyle = '#e0f7fa';
  ctx.beginPath();
  ctx.arc(0, -18, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, -35);
  ctx.lineTo(25, -70);
  ctx.lineTo(35, -50);
  ctx.closePath();
  ctx.fill();

  // Ледяная диадема
  ctx.fillStyle = '#00e5ff';
  ctx.fillRect(-10, -32, 20, 5);

  // Глаза (холодные фиолетовые)
  drawAnimeEye(ctx, -7, -13);
  drawAnimeEye(ctx, 7, -13);
}

function drawProfessorPalladium(ctx) {
  // Мантия
  ctx.fillStyle = '#2e7d32';
  ctx.fillRect(-16, 12, 32, 55);

  // Лицо эльфа
  ctx.fillStyle = '#ffdfcf';
  ctx.beginPath();
  ctx.arc(0, -14, 20, 0, Math.PI * 2);
  ctx.fill();

  // Длинные эльфийские уши
  ctx.beginPath();
  ctx.moveTo(-18, -14);
  ctx.lineTo(-32, -24);
  ctx.lineTo(-18, -8);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(18, -14);
  ctx.lineTo(32, -24);
  ctx.lineTo(18, -8);
  ctx.fill();

  // Волосы
  ctx.fillStyle = '#b0bec5';
  ctx.beginPath();
  ctx.arc(0, -18, 22, 0, Math.PI * 2);
  ctx.fill();

  drawAnimeEye(ctx, -7, -13);
  drawAnimeEye(ctx, 7, -13);
}

function drawFaragonda(ctx) {
  ctx.fillStyle = '#4a148c';
  ctx.fillRect(-18, 12, 36, 55);

  ctx.fillStyle = '#ffdfcf';
  ctx.beginPath();
  ctx.arc(0, -14, 21, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#cfd8dc';
  ctx.beginPath();
  ctx.arc(0, -20, 24, 0, Math.PI * 2);
  ctx.fill();

  // Очки
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-12, -18, 9, 8);
  ctx.strokeRect(3, -18, 9, 8);

  drawAnimeEye(ctx, -7, -14);
  drawAnimeEye(ctx, 7, -14);
}

// 5. ДВИЖОК СЮЖЕТНЫХ ДИАЛОГОВ (VISUAL NOVEL)
let activeChapter = null;
let currentDialogIndex = 0;

function startChapter(chapterId) {
  activeChapter = GAME_STORY.chapters.find(c => c.id === chapterId) || GAME_STORY.chapters[0];
  currentDialogIndex = 0;
  showScreen('screen-dialog');

  document.getElementById('vn-chap-title').textContent = activeChapter.title;
  showCurrentDialogue();
}

function showCurrentDialogue() {
  if (!activeChapter || currentDialogIndex >= activeChapter.dialogues.length) {
    // Диалоги закончились — запускаем геймплей главы!
    launchChapterGameplay();
    return;
  }

  const d = activeChapter.dialogues[currentDialogIndex];
  const speakerName = d.speaker.replace('{PLAYER}', saveData.name);
  const text = d.text.replace('{PLAYER}', saveData.name);

  document.getElementById('vn-speaker-name').textContent = speakerName;
  document.getElementById('vn-speech-text').textContent = text;

  // Отрисовка говорящего
  const canvas = document.getElementById('vn-char-canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const charType = d.avatar === 'player' ? 'player' : d.avatar;
  drawCharacter(ctx, canvas.width / 2, canvas.height / 2 + 10, 1.3, charType, 0);

  window.magicAudio.playSparkle();
}

function launchChapterGameplay() {
  const type = activeChapter.gameplayType;

  if (type === 'flight') {
    showScreen('screen-flight');
    startFlightGame(activeChapter);
  } else if (type === 'potion') {
    showScreen('screen-potion');
    startPotionGame(activeChapter);
  } else if (type === 'battle') {
    showScreen('screen-battle');
    startBattleGame(activeChapter);
  } else if (type === 'dance') {
    showScreen('screen-dance');
    startDanceGame(activeChapter);
  } else if (type === 'final') {
    showScreen('screen-final');
    document.getElementById('final-fairy-name').textContent = saveData.name;
    completeChapter(activeChapter);
  }
}

function completeChapter(chapter) {
  if (!saveData.completedChapters.includes(chapter.id)) {
    saveData.completedChapters.push(chapter.id);
  }

  saveData.stars += chapter.reward.stars;
  saveData.hearts += chapter.reward.hearts;

  if (chapter.reward.item && !saveData.unlockedItems.includes(chapter.reward.item)) {
    saveData.unlockedItems.push(chapter.reward.item);
  }

  if (saveData.currentChapter <= chapter.id && saveData.currentChapter < 5) {
    saveData.currentChapter = chapter.id + 1;
  }

  saveGame();
  window.magicAudio.playEnchantixFanfare();
}

// 6. МИНИ-ИГРА: УРОК ЗЕЛЬЕВАРЕНИЯ (POTION)
let potionState = {
  score: 0,
  targetScore: 3,
  currentRecipe: null,
  addedIngredients: []
};

const ALL_INGREDIENTS = [
  "🌸 Цветок Алфеи",
  "☀️ Солнечная Пыльца",
  "💧 Роса Роккалуче",
  "✨ Пыльца Кометы",
  "💎 Кристалл Магикса",
  "🌙 Лунный Камень"
];

function startPotionGame(chapter) {
  potionState.score = 0;
  potionState.targetScore = chapter ? chapter.targetScore : 3;
  loadNextPotionRecipe();
  renderIngredientsShelf();
}

function loadNextPotionRecipe() {
  const recipes = GAME_STORY.potionRecipes;
  potionState.currentRecipe = recipes[potionState.score % recipes.length];
  potionState.addedIngredients = [];

  document.getElementById('potion-recipe-title').textContent = `Рецепт: ${potionState.currentRecipe.name}`;
  document.getElementById('potion-score').textContent = `${potionState.score} / ${potionState.targetScore}`;

  const liquid = document.getElementById('cauldron-liquid');
  liquid.style.background = '#424242';

  renderRecipeTargetPills();
}

function renderRecipeTargetPills() {
  const container = document.getElementById('recipe-needed-list');
  container.innerHTML = '';
  potionState.currentRecipe.ingredients.forEach(ing => {
    const pill = document.createElement('div');
    pill.className = 'target-ing-pill';
    if (potionState.addedIngredients.includes(ing)) {
      pill.classList.add('added');
      pill.textContent = `✓ ${ing}`;
    } else {
      pill.textContent = ing;
    }
    container.appendChild(pill);
  });
}

function renderIngredientsShelf() {
  const shelf = document.getElementById('ingredients-shelf');
  shelf.innerHTML = '';

  ALL_INGREDIENTS.forEach(ing => {
    const btn = document.createElement('button');
    btn.className = 'ing-btn';
    btn.textContent = ing;
    btn.onclick = () => handleAddIngredient(ing);
    shelf.appendChild(btn);
  });
}

function handleAddIngredient(ing) {
  window.magicAudio.playPotionBubble();

  if (potionState.currentRecipe.ingredients.includes(ing) && !potionState.addedIngredients.includes(ing)) {
    potionState.addedIngredients.push(ing);
    renderRecipeTargetPills();

    // Меняем цвет жижи в котле
    const liquid = document.getElementById('cauldron-liquid');
    liquid.style.background = potionState.currentRecipe.color;

    if (potionState.addedIngredients.length === potionState.currentRecipe.ingredients.length) {
      // Зелье сварено успешно!
      potionState.score++;
      window.magicAudio.playSparkle();

      if (potionState.score >= potionState.targetScore) {
        completeChapter(activeChapter);
        setTimeout(() => {
          showScreen('screen-hub');
        }, 1200);
      } else {
        setTimeout(loadNextPotionRecipe, 800);
      }
    }
  } else {
    // Ошибка
    const liquid = document.getElementById('cauldron-liquid');
    liquid.style.background = '#212121';
  }
}

// 7. МИНИ-ИГРА: МАГИЧЕСКАЯ ДУЭЛЬ (BATTLE С АЙСИ)
let battleState = {
  playerHp: 100,
  bossHp: 100,
  isShieldActive: false,
  bossInterval: null,
  active: false
};

function startBattleGame(chapter) {
  battleState.playerHp = 100;
  battleState.bossHp = 100;
  battleState.isShieldActive = false;
  battleState.active = true;

  updateBattleHud();
  document.getElementById('battle-player-name').textContent = saveData.name;
  document.getElementById('battle-log').textContent = 'Айси готовит ледяной шторм! Используй щит и заклинания!';

  // Рендер участников
  const heroCanvas = document.getElementById('battle-hero-canvas');
  const heroCtx = heroCanvas.getContext('2d');
  heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
  drawCharacter(heroCtx, heroCanvas.width / 2, heroCanvas.height / 2 + 10, 1.2, 'player', 0);

  const bossCanvas = document.getElementById('battle-boss-canvas');
  const bossCtx = bossCanvas.getContext('2d');
  bossCtx.clearRect(0, 0, bossCanvas.width, bossCanvas.height);
  drawCharacter(bossCtx, bossCanvas.width / 2, bossCanvas.height / 2 + 10, 1.2, 'icy', 0);

  if (battleState.bossInterval) clearInterval(battleState.bossInterval);
  battleState.bossInterval = setInterval(bossAttackStep, 2600);
}

function updateBattleHud() {
  document.getElementById('player-hp-bar').style.width = Math.max(0, battleState.playerHp) + '%';
  document.getElementById('boss-hp-bar').style.width = Math.max(0, battleState.bossHp) + '%';
}

function bossAttackStep() {
  if (!battleState.active) return;

  if (battleState.isShieldActive) {
    document.getElementById('battle-log').textContent = '🛡️ Твой Щит Света полностью отразил ледяную стрелу Айси!';
    window.magicAudio.playMagicShield();
  } else {
    battleState.playerHp = Math.max(0, battleState.playerHp - 22);
    document.getElementById('battle-log').textContent = '❄️ Айси попала ледяным осколком (-22 HP)! Включи щит!';
    window.magicAudio.playMagicSpell();
    updateBattleHud();

    if (battleState.playerHp <= 0) {
      battleState.active = false;
      clearInterval(battleState.bossInterval);
      document.getElementById('battle-log').textContent = 'Специалист прикрыл тебя мечом! Попробуй снова!';
      setTimeout(() => startBattleGame(activeChapter), 2000);
    }
  }
}

// Кнопки заклинаний
document.getElementById('spell-attack-btn').onclick = () => {
  if (!battleState.active) return;
  window.magicAudio.playMagicSpell();
  battleState.bossHp = Math.max(0, battleState.bossHp - 28);
  document.getElementById('battle-log').textContent = '⚡ Ты поразила Айси лучом солнечного света (-28 HP)!';
  updateBattleHud();

  if (battleState.bossHp <= 0) {
    battleState.active = false;
    clearInterval(battleState.bossInterval);
    document.getElementById('battle-log').textContent = '🎉 Победа! Ледяные чары Айси растаяли!';
    completeChapter(activeChapter);
    setTimeout(() => showScreen('screen-hub'), 1500);
  }
};

document.getElementById('spell-shield-btn').onclick = () => {
  if (!battleState.active || battleState.isShieldActive) return;
  window.magicAudio.playMagicShield();
  battleState.isShieldActive = true;
  document.getElementById('player-shield-fx').classList.remove('hidden');
  document.getElementById('battle-log').textContent = '🛡️ Щит Света активирован на 2.5 секунды!';

  setTimeout(() => {
    battleState.isShieldActive = false;
    document.getElementById('player-shield-fx').classList.add('hidden');
  }, 2500);
};

document.getElementById('spell-heal-btn').onclick = () => {
  if (!battleState.active) return;
  window.magicAudio.playCollect(true);
  battleState.playerHp = Math.min(100, battleState.playerHp + 30);
  battleState.bossHp = Math.max(0, battleState.bossHp - 12);
  document.getElementById('battle-log').textContent = '💖 Сила Любви восстановила +30 HP и ослепила ведьму!';
  updateBattleHud();
};

// 8. МИНИ-ИГРА: ТАНЕЦ НА БАЛУ (DANCE RHYTHM)
let danceState = {
  score: 0,
  targetScore: 15,
  active: false,
  items: []
};

function startDanceGame(chapter) {
  danceState.score = 0;
  danceState.targetScore = chapter ? chapter.targetScore : 15;
  danceState.active = true;
  danceState.items = [];

  document.getElementById('dance-score').textContent = `0 / ${danceState.targetScore}`;

  const canvas = document.getElementById('dance-canvas');
  canvas.width = canvas.clientWidth || window.innerWidth;
  canvas.height = canvas.clientHeight || window.innerHeight;
  const ctx = canvas.getContext('2d');

  function spawnItem() {
    if (!danceState.active) return;
    danceState.items.push({
      x: Math.random() * (canvas.width - 60) + 30,
      y: -20,
      speed: Math.random() * 2 + 2.5,
      type: Math.random() > 0.4 ? '💖' : '⭐',
      size: 32
    });
    setTimeout(spawnItem, 700);
  }
  spawnItem();

  canvas.onpointerdown = (e) => {
    const rect = canvas.getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    const tapY = e.clientY - rect.top;

    danceState.items.forEach((item, idx) => {
      const dist = Math.hypot(item.x - tapX, item.y - tapY);
      if (dist < 45) {
        danceState.score++;
        window.magicAudio.playCollect(item.type === '💖');
        danceState.items.splice(idx, 1);
        document.getElementById('dance-score').textContent = `${danceState.score} / ${danceState.targetScore}`;

        if (danceState.score >= danceState.targetScore) {
          danceState.active = false;
          completeChapter(activeChapter);
          setTimeout(() => showScreen('screen-hub'), 1400);
        }
      }
    });
  };

  function updateDance() {
    if (!danceState.active) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    danceState.items.forEach((it, idx) => {
      it.y += it.speed;
      ctx.font = `${it.size}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(it.type, it.x, it.y);

      if (it.y > canvas.height + 30) {
        danceState.items.splice(idx, 1);
      }
    });

    requestAnimationFrame(updateDance);
  }
  updateDance();
}

// 9. МИНИ-ИГРА: ПОЛЁТ (FLIGHT 2.0)
let flightAnimId = null;

function startFlightGame(chapter) {
  const canvas = document.getElementById('flight-canvas');
  const ctx = canvas.getContext('2d');
  const manaFill = document.getElementById('mana-fill');
  const manaPercent = document.getElementById('mana-percent');
  const starsEl = document.getElementById('flight-stars-collected');

  canvas.width = canvas.clientWidth || window.innerWidth;
  canvas.height = canvas.clientHeight || window.innerHeight;

  let player = { x: 60, y: canvas.height / 2, velocityY: 0, gravity: 0.28, jump: -6.0, mana: 0, stars: 0, wingAngle: 0 };
  let items = [];
  let running = true;

  canvas.onpointerdown = (e) => {
    e.preventDefault();
    if (!running) return;
    player.velocityY = player.jump;
    window.magicAudio.playWingFlap();
  };

  let frame = 0;
  function loop() {
    if (!running) return;
    frame++;

    player.velocityY += player.gravity;
    player.y += player.velocityY;
    player.wingAngle += 0.15;

    if (player.y < 25) { player.y = 25; player.velocityY = 0; }
    if (player.y > canvas.height - 45) { player.y = canvas.height - 45; player.velocityY = 0; }

    if (frame % 55 === 0) {
      items.push({
        x: canvas.width + 30,
        y: Math.random() * (canvas.height - 120) + 50,
        type: Math.random() > 0.4 ? 'heart' : 'star',
        speed: 3
      });
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    items.forEach((it, idx) => {
      it.x -= it.speed;
      const dist = Math.hypot(it.x - player.x, it.y - player.y);
      if (dist < 45) {
        items.splice(idx, 1);
        player.stars++;
        player.mana = Math.min(100, player.mana + 15);
        window.magicAudio.playCollect(it.type === 'heart');

        manaFill.style.width = player.mana + '%';
        manaPercent.textContent = player.mana + '%';
        starsEl.textContent = player.stars;

        if (player.mana >= 100) {
          running = false;
          completeChapter(activeChapter);
          setTimeout(() => showScreen('screen-hub'), 1400);
        }
      } else {
        ctx.font = '28px serif';
        ctx.textAlign = 'center';
        ctx.fillText(it.type === 'heart' ? '💖' : '⭐', it.x, it.y);
      }
    });

    // Рисуем фею игрока
    ctx.save();
    ctx.translate(player.x, player.y);
    drawCharacter(ctx, 0, 0, 0.9, 'player', player.wingAngle);
    ctx.restore();

    flightAnimId = requestAnimationFrame(loop);
  }
  loop();
}

// 10. КОМНАТА И ПОЧТОВЫЙ ЯЩИК
function renderRoomLetters() {
  const container = document.getElementById('room-tab-content');
  container.innerHTML = '';

  const list = document.createElement('div');
  list.className = 'letters-list';

  GAME_STORY.letters.forEach(letter => {
    const isUnlocked = saveData.completedChapters.includes(letter.unlockedAtChapter);
    const card = document.createElement('div');
    card.className = `letter-card ${isUnlocked ? '' : 'locked'}`;

    if (isUnlocked) {
      card.innerHTML = `
        <div class="letter-card-header">
          <span>${letter.title}</span>
          <span class="letter-card-date">${letter.date}</span>
        </div>
        <div class="letter-card-preview">${letter.preview}</div>
      `;
      card.onclick = () => openLetterModal(letter);
    } else {
      card.innerHTML = `
        <div class="letter-card-header">
          <span>🔒 Запечатанное письмо</span>
          <span class="letter-card-date">Глава ${letter.unlockedAtChapter}</span>
        </div>
        <div class="letter-card-preview">Пройди Главу ${letter.unlockedAtChapter}, чтобы прочитать это признание...</div>
      `;
    }

    list.appendChild(card);
  });

  container.appendChild(list);
}

function openLetterModal(letter) {
  window.magicAudio.playSparkle();
  document.getElementById('m-letter-title').textContent = letter.title;
  document.getElementById('m-letter-date').textContent = letter.date;
  document.getElementById('m-letter-body').textContent = letter.text;
  document.getElementById('letter-modal').classList.remove('hidden');
}

document.getElementById('close-letter-btn').onclick = () => {
  document.getElementById('letter-modal').classList.add('hidden');
};

// 11. ГАРДЕРОБ И МАГАЗИН
let activeWardrobeCategory = 'wings';

function renderWardrobeGrid() {
  const grid = document.getElementById('wardrobe-items-grid');
  grid.innerHTML = '';

  const items = GAME_STORY.wardrobeShop[activeWardrobeCategory] || [];
  const equippedId = saveData.equipped[activeWardrobeCategory];

  items.forEach(item => {
    const isUnlocked = saveData.unlockedItems.includes(item.id);
    const isEquipped = equippedId === item.id;

    const card = document.createElement('div');
    card.className = `witem-card ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'buyable' : ''}`;

    let statusText = isEquipped ? '✓ Надето' : (isUnlocked ? 'Надеть' : `🌟 ${item.costStars}`);

    card.innerHTML = `
      <div class="witem-icon">${item.icon}</div>
      <b>${item.name}</b>
      <small>${statusText}</small>
    `;

    card.onclick = () => {
      if (isUnlocked) {
        saveData.equipped[activeWardrobeCategory] = item.id;
        window.magicAudio.playSparkle();
        saveGame();
        renderWardrobeGrid();
      } else {
        // Покупка
        if (saveData.stars >= item.costStars && saveData.hearts >= item.costHearts) {
          saveData.stars -= item.costStars;
          saveData.hearts -= item.costHearts;
          saveData.unlockedItems.push(item.id);
          saveData.equipped[activeWardrobeCategory] = item.id;
          window.magicAudio.playCollect(true);
          saveGame();
          renderWardrobeGrid();
        } else {
          alert(`Не хватает звёзд или сердец! Проходи сюжетные задания и мини-игры ✨`);
        }
      }
    };

    grid.appendChild(card);
  });
}

// 12. ИНИЦИАЛИЗАЦИЯ И ОБРАБОТЧИКИ
window.addEventListener('DOMContentLoaded', () => {
  loadGame();
  updateHUD();

  // Фоновый блеск
  const bgCanvas = document.getElementById('bg-canvas');
  new BackgroundSparkles(bgCanvas);

  // Кнопки звука
  const soundBtn = document.getElementById('sound-btn');
  const musicBtn = document.getElementById('music-btn');

  soundBtn.onclick = () => {
    const enabled = window.magicAudio.toggleSound();
    soundBtn.textContent = enabled ? '🔊' : '🔇';
    if (enabled) window.magicAudio.playSparkle();
  };

  musicBtn.onclick = () => {
    const enabled = window.magicAudio.toggleMusic();
    musicBtn.textContent = enabled ? '🎶' : '🎵';
  };

  // Кнопка возврата в Хаб
  document.getElementById('nav-hub-btn').onclick = () => {
    window.magicAudio.playSparkle();
    showScreen('screen-hub');
  };

  // Старт игры (Приветствие)
  const nameInput = document.getElementById('player-name-input');
  if (saveData.name && saveData.name !== 'Любимая Фея') {
    nameInput.value = saveData.name;
  }

  document.getElementById('start-adventure-btn').onclick = () => {
    window.magicAudio.playSparkle();
    const entered = nameInput.value.trim();
    if (entered) {
      saveData.name = entered;
    }
    saveGame();
    document.getElementById('hub-greeting').textContent = `Здравствуй, ${saveData.name}! 🌸`;
    showScreen('screen-hub');
  };

  // Навигация Хаба
  document.getElementById('hub-to-story').onclick = () => {
    window.magicAudio.playSparkle();
    startChapter(saveData.currentChapter);
  };

  document.getElementById('hub-to-wardrobe').onclick = () => {
    window.magicAudio.playSparkle();
    showScreen('screen-wardrobe');
    renderWardrobeGrid();
  };

  document.getElementById('hub-to-potion').onclick = () => {
    window.magicAudio.playSparkle();
    showScreen('screen-potion');
    startPotionGame(null);
  };

  document.getElementById('hub-to-battle').onclick = () => {
    window.magicAudio.playSparkle();
    showScreen('screen-battle');
    startBattleGame(null);
  };

  document.getElementById('hub-to-room').onclick = () => {
    window.magicAudio.playSparkle();
    showScreen('screen-room');
    renderRoomLetters();
  };

  document.getElementById('hub-to-flight').onclick = () => {
    window.magicAudio.playSparkle();
    showScreen('screen-flight');
    startFlightGame(null);
  };

  // Диалоги
  document.getElementById('vn-next-btn').onclick = () => {
    currentDialogIndex++;
    showCurrentDialogue();
  };

  // Вкладки комнаты
  document.querySelectorAll('.room-tab-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.room-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderRoomLetters();
    };
  });

  // Вкладки гардероба
  document.querySelectorAll('.wtab-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.wtab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeWardrobeCategory = btn.dataset.wcat;
      renderWardrobeGrid();
    };
  });

  // Кнопка финала
  document.getElementById('final-to-hub-btn').onclick = () => {
    showScreen('screen-hub');
  };

  // Анимация феи в Хабе и Гардеробе
  const hubCanvas = document.getElementById('hub-fairy-canvas');
  const hubCtx = hubCanvas.getContext('2d');
  const wardCanvas = document.getElementById('wardrobe-fairy-canvas');
  const wardCtx = wardCanvas.getContext('2d');
  const welcomeCanvas = document.getElementById('welcome-canvas');
  const welcomeCtx = welcomeCanvas.getContext('2d');
  const finalCanvas = document.getElementById('final-fairy-canvas');
  const finalCtx = finalCanvas.getContext('2d');

  function renderHubCycle() {
    const flap = Date.now() * 0.007;

    if (currentScreenId === 'screen-hub') {
      hubCtx.clearRect(0, 0, hubCanvas.width, hubCanvas.height);
      drawCharacter(hubCtx, hubCanvas.width / 2, hubCanvas.height / 2 + 10, 1.45, 'player', flap);
    } else if (currentScreenId === 'screen-wardrobe') {
      wardCtx.clearRect(0, 0, wardCanvas.width, wardCanvas.height);
      drawCharacter(wardCtx, wardCanvas.width / 2, wardCanvas.height / 2 + 10, 1.45, 'player', flap);
    } else if (currentScreenId === 'screen-welcome') {
      welcomeCtx.clearRect(0, 0, welcomeCanvas.width, welcomeCanvas.height);
      drawCharacter(welcomeCtx, welcomeCanvas.width / 2, welcomeCanvas.height / 2 + 10, 1.3, 'player', flap);
    } else if (currentScreenId === 'screen-final') {
      finalCtx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
      drawCharacter(finalCtx, finalCanvas.width / 2, finalCanvas.height / 2 + 10, 1.25, 'player', flap);
    }

    requestAnimationFrame(renderHubCycle);
  }
  renderHubCycle();
});

// Фоновые блестки
class BackgroundSparkles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.createParticles();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    const count = Math.floor(window.innerWidth / 16);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedY: -(Math.random() * 0.8 + 0.2),
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        isHeart: Math.random() > 0.75
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;

      if (p.y < -10) {
        p.y = this.canvas.height + 10;
        p.x = Math.random() * this.canvas.width;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.opacity;
      if (p.isHeart) {
        this.ctx.font = `${p.size * 3 + 6}px serif`;
        this.ctx.fillText('💖', p.x, p.y);
      } else {
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    });

    requestAnimationFrame(() => this.animate());
  }
}
