// Winx: Хроники Алфеи и Сила Любви — Полный игровой движок с аутентичной мультяшной графикой

const SAVE_KEY = 'winx_chronicles_save_v2';

let saveData = {
  name: 'Любимая Фея',
  stars: 50,
  hearts: 25,
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

// 2. ДИНАМИЧЕСКАЯ СМЕНА МУЛЬТЯШНЫХ ФОНОВ
function updateLocationBackground(screenId) {
  const bg = document.getElementById('dynamic-bg');
  if (!bg || !window.WINX_ASSETS) return;

  if (screenId === 'screen-potion') {
    bg.innerHTML = WINX_ASSETS.backgrounds.palladiumLab;
  } else if (screenId === 'screen-battle') {
    bg.innerHTML = WINX_ASSETS.backgrounds.lakeRoccaluce;
  } else if (screenId === 'screen-dance') {
    bg.innerHTML = WINX_ASSETS.backgrounds.ballroomRedFountain;
  } else {
    bg.innerHTML = WINX_ASSETS.backgrounds.alfeaSunset;
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

  updateLocationBackground(screenId);

  const backBtn = document.getElementById('nav-hub-btn');
  if (screenId === 'screen-welcome' || screenId === 'screen-hub') {
    backBtn.classList.add('hidden');
  } else {
    backBtn.classList.remove('hidden');
  }

  renderScreenPortraits(screenId);
  saveGame();
}

// 4. РЕНДЕР АУТЕНТИЧНЫХ МУЛЬТЯШНЫХ ПОРТРЕТОВ WINX
function getPlayerSvg() {
  const wingDef = GAME_STORY.wardrobeShop.wings.find(w => w.id === saveData.equipped.wings) || GAME_STORY.wardrobeShop.wings[0];
  const outfitDef = GAME_STORY.wardrobeShop.outfits.find(o => o.id === saveData.equipped.outfit) || GAME_STORY.wardrobeShop.outfits[0];
  const hairDef = GAME_STORY.wardrobeShop.hair.find(h => h.id === saveData.equipped.hair) || GAME_STORY.wardrobeShop.hair[0];

  return WINX_ASSETS.renderPlayerFairySvg({
    wingColor: wingDef.color,
    outfitColor: outfitDef.color,
    hairColor: hairDef.color
  });
}

function renderScreenPortraits(screenId) {
  if (!window.WINX_ASSETS) return;

  if (screenId === 'screen-welcome') {
    const box = document.getElementById('welcome-portrait-container');
    if (box) box.innerHTML = WINX_ASSETS.characters.bloom;
  } else if (screenId === 'screen-hub') {
    const box = document.getElementById('hub-portrait-container');
    if (box) box.innerHTML = getPlayerSvg();
  } else if (screenId === 'screen-wardrobe') {
    const box = document.getElementById('wardrobe-portrait-container');
    if (box) box.innerHTML = getPlayerSvg();
  } else if (screenId === 'screen-final') {
    const box = document.getElementById('final-portrait-container');
    if (box) box.innerHTML = getPlayerSvg();
  }
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
    launchChapterGameplay();
    return;
  }

  const d = activeChapter.dialogues[currentDialogIndex];
  const speakerName = d.speaker.replace('{PLAYER}', saveData.name);
  const text = d.text.replace('{PLAYER}', saveData.name);

  document.getElementById('vn-speaker-name').textContent = speakerName;
  document.getElementById('vn-speech-text').textContent = text;

  // Отрисовка аутентичного мультяшного портрета
  const portraitBox = document.getElementById('vn-speaker-avatar');
  if (d.avatar === 'player') {
    portraitBox.innerHTML = getPlayerSvg();
  } else if (WINX_ASSETS.characters[d.avatar]) {
    portraitBox.innerHTML = WINX_ASSETS.characters[d.avatar];
  }

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

// 6. УРОК ЗЕЛЬЕВАРЕНИЯ (POTION)
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

    const liquid = document.getElementById('cauldron-liquid');
    liquid.style.background = potionState.currentRecipe.color;

    if (potionState.addedIngredients.length === potionState.currentRecipe.ingredients.length) {
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
    const liquid = document.getElementById('cauldron-liquid');
    liquid.style.background = '#212121';
  }
}

// 7. МАГИЧЕСКАЯ ДУЭЛЬ С АЙСИ (BATTLE)
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

  // Мультяшные аватары бойцов
  document.getElementById('battle-hero-portrait').innerHTML = getPlayerSvg();
  document.getElementById('battle-boss-portrait').innerHTML = WINX_ASSETS.characters.icy;

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
    document.getElementById('battle-log').textContent = '🛡️ Щит Света Алфеи полностью отразил ледяную атаку Айси!';
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
  document.getElementById('battle-log').textContent = '🛡️ Щит Алфеи защищает тебя от атак!';

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

// 8. БАЛЬНЫЙ ТАНЕЦ (DANCE RHYTHM)
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
  document.getElementById('dance-hero-avatar').innerHTML = getPlayerSvg();
  document.getElementById('dance-specialist-avatar').innerHTML = WINX_ASSETS.characters.specialist;

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
      size: 34
    });
    setTimeout(spawnItem, 650);
  }
  spawnItem();

  canvas.onpointerdown = (e) => {
    const rect = canvas.getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    const tapY = e.clientY - rect.top;

    danceState.items.forEach((item, idx) => {
      const dist = Math.hypot(item.x - tapX, item.y - tapY);
      if (dist < 50) {
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

// 9. МАГИЧЕСКИЙ ПОЛЁТ (FLIGHT 2.0)
let flightAnimId = null;

function startFlightGame(chapter) {
  const canvas = document.getElementById('flight-canvas');
  const ctx = canvas.getContext('2d');
  const manaFill = document.getElementById('mana-fill');
  const manaPercent = document.getElementById('mana-percent');
  const starsEl = document.getElementById('flight-stars-collected');

  canvas.width = canvas.clientWidth || window.innerWidth;
  canvas.height = canvas.clientHeight || window.innerHeight;

  let player = { x: 70, y: canvas.height / 2, velocityY: 0, gravity: 0.28, jump: -6.0, mana: 0, stars: 0, wingAngle: 0 };
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

    if (frame % 50 === 0) {
      items.push({
        x: canvas.width + 30,
        y: Math.random() * (canvas.height - 120) + 50,
        type: Math.random() > 0.4 ? 'heart' : 'star',
        speed: 3.2
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

    // Рисуем светящуюся фею в полете
    ctx.save();
    ctx.translate(player.x, player.y);
    const tilt = Math.max(-0.4, Math.min(0.4, player.velocityY * 0.05));
    ctx.rotate(tilt);
    ctx.font = '40px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ffd700';
    ctx.fillText('🧚‍♀️', 0, 0);
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
        renderScreenPortraits(currentScreenId);
      } else {
        if (saveData.stars >= item.costStars && saveData.hearts >= item.costHearts) {
          saveData.stars -= item.costStars;
          saveData.hearts -= item.costHearts;
          saveData.unlockedItems.push(item.id);
          saveData.equipped[activeWardrobeCategory] = item.id;
          window.magicAudio.playCollect(true);
          saveGame();
          renderWardrobeGrid();
          renderScreenPortraits(currentScreenId);
        } else {
          alert(`Не хватает звёзд или сердец! Проходи сюжетные задания и мини-игры ✨`);
        }
      }
    };

    grid.appendChild(card);
  });
}

// 12. ИНИЦИАЛИЗАЦИЯ И СЛУШАТЕЛИ
window.addEventListener('DOMContentLoaded', () => {
  loadGame();
  updateHUD();
  updateLocationBackground('screen-welcome');
  renderScreenPortraits('screen-welcome');

  // Фоновые частицы
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

  // Старт
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

  // Меню Хаба
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

  // Гардероб табы
  document.querySelectorAll('.wtab-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.wtab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeWardrobeCategory = btn.dataset.wcat;
      renderWardrobeGrid();
    };
  });

  // Финал
  document.getElementById('final-to-hub-btn').onclick = () => {
    showScreen('screen-hub');
  };
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
    const count = Math.floor(window.innerWidth / 18);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedY: -(Math.random() * 0.7 + 0.2),
        speedX: (Math.random() - 0.5) * 0.4,
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
