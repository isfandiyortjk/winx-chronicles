// Winx Club 3D: Алфея и Сила Любви — Трёхмерный движок на Three.js (WebGL)
// Воссоздаёт аутентичный геймплей культовых игр Winx:
// 1. 3D бег от третьего лица по коридору замка Алфея с красным ковром (скриншот 2)
// 2. Сбор 3D розовых кристаллов и цветок жизни (скриншоты 3 и 4)
// 3. Открывание волшебных 3D сундуков с искрами (скриншот 4)
// 4. Сферический розовый щит с нотами (скриншот 1)
// 5. Модный салон с круглыми кнопками категорий (скриншот 5)

// Состояние сохранения
const SAVE_3D_KEY = 'winx_3d_save_v1';
let game3dState = {
  diamonds: 14,
  stars: 110,
  equipped: {
    hair: 'bloom_red',
    wings: 'enchantix_wings',
    tops: 'bloom_top',
    skirts: 'bloom_pants',
    shoes: 'fairy_boots',
    bags: 'shell_bag'
  }
};

// Загрузка сохранения
try {
  const raw = localStorage.getItem(SAVE_3D_KEY);
  if (raw) Object.assign(game3dState, JSON.parse(raw));
} catch (e) {}

function save3d() {
  try {
    localStorage.setItem(SAVE_3D_KEY, JSON.stringify(game3dState));
  } catch (e) {}
  updateHudValues();
}

function updateHudValues() {
  const dEl = document.getElementById('hud-diamonds-text');
  if (dEl) dEl.innerHTML = `<b>${game3dState.diamonds}</b> / 60`;
  const sEl = document.getElementById('hud-stars');
  if (sEl) sEl.textContent = game3dState.stars;
  const sVal = document.getElementById('salon-diamonds-val');
  if (sVal) sVal.textContent = game3dState.diamonds;
}

// -------------------------------------------------------------
// ИНИЦИАЛИЗАЦИЯ THREE.JS 3D СЦЕНЫ
// -------------------------------------------------------------
let scene, camera, renderer;
let playerGroup, fairyWingsLeft, fairyWingsRight;
let shieldMesh, shieldNotes = [];
let corridorSegments = [];
let gems3D = [];
let chest3D = null;
let chestLid = null;
let isChestOpen = false;

// Позиция игрока и физика
const LANES = [-2.4, 0, 2.4];
let currentLane = 1; // 0: левый, 1: центр, 2: правый
let targetX = 0;
let playerSpeedZ = 16.0; // скорость бега вперед
let playerVelocityY = 0;
let playerY = 0;
let isJumping = false;
let isShieldActive = false;
let isGameRunning = true;

function init3D() {
  const container = document.getElementById('viewport-3d');
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  // 1. Сцена и туман
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2a0845);
  scene.fog = new THREE.FogExp2(0x2a0845, 0.018);

  // 2. Камера (вид сзади от третьего лица)
  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200);
  camera.position.set(0, 4.2, 7.5);

  // 3. Рендерер
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // 4. Освещение
  const ambientLight = new THREE.AmbientLight(0xffebee, 0.75);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfff8e1, 1.2);
  sunLight.position.set(10, 25, 10);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  scene.add(sunLight);

  // Золотые точечные светильники вдоль зала
  const warmLight = new THREE.PointLight(0xffd700, 1.5, 30);
  warmLight.position.set(0, 6, -10);
  scene.add(warmLight);

  // 5. Создание игрока-феи
  createFairyCharacter();

  // 6. Создание магического сферического щита (скриншот 1)
  createMagicShield();

  // 7. Построение сегментов коридора Алфеи
  for (let i = 0; i < 5; i++) {
    createCorridorSegment(-i * 35);
  }

  // 8. Создание первого 3D сундука (скриншот 4)
  create3DChest(-75);

  // Слушатели событий окна
  window.addEventListener('resize', onWindowResize);
  setupTouchControls();
  updateHudValues();

  // Запуск цикла анимации
  animate3D(0);
}

// -------------------------------------------------------------
// СОЗДАНИЕ 3D ФЕИ (БЛУМ / ИГРОК)
// -------------------------------------------------------------
function createFairyCharacter() {
  playerGroup = new THREE.Group();

  // Материалы Winx
  const skinMat = new THREE.MeshPhongMaterial({ color: 0xffdfcf, shininess: 30 });
  const hairMat = new THREE.MeshPhongMaterial({ color: 0xff3d00, shininess: 80 }); // Огненные волосы Блум
  const topMat = new THREE.MeshPhongMaterial({ color: 0x00e5ff, shininess: 60 });  // Бирюзовый топ Блум
  const pantsMat = new THREE.MeshPhongMaterial({ color: 0x00bcd4, shininess: 60 }); // Брюки клеш
  const goldMat = new THREE.MeshPhongMaterial({ color: 0xffd700, shininess: 100 });

  // Голова
  const headGeo = new THREE.SphereGeometry(0.35, 16, 16);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.position.y = 2.1;
  playerGroup.add(headMesh);

  // Пышные волосы Блум (длинные развевающиеся локоны)
  const hairGeo = new THREE.ConeGeometry(0.5, 1.4, 8);
  const hairMesh = new THREE.Mesh(hairGeo, hairMat);
  hairMesh.position.set(0, 1.8, 0.45);
  hairMesh.rotation.x = 0.55;
  playerGroup.add(hairMesh);

  // Корона / диадема
  const crownGeo = new THREE.ConeGeometry(0.15, 0.25, 4);
  const crownMesh = new THREE.Mesh(crownGeo, goldMat);
  crownMesh.position.set(0, 2.5, 0);
  playerGroup.add(crownMesh);

  // Торс (модельная тонкая талия)
  const bodyGeo = new THREE.CylinderGeometry(0.18, 0.24, 0.7, 8);
  const bodyMesh = new THREE.Mesh(bodyGeo, topMat);
  bodyMesh.position.y = 1.45;
  playerGroup.add(bodyMesh);

  // Ноги в бирюзовых расклешенных брюках
  const legGeo = new THREE.CylinderGeometry(0.08, 0.16, 1.05, 8);
  const legLeft = new THREE.Mesh(legGeo, pantsMat);
  legLeft.position.set(-0.16, 0.65, 0);
  const legRight = new THREE.Mesh(legGeo, pantsMat);
  legRight.position.set(0.16, 0.65, 0);
  playerGroup.add(legLeft);
  playerGroup.add(legRight);

  // СИЯЮЩИЕ ВИТРАЖНЫЕ КРЫЛЬЯ (Анимированные)
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0);
  wingShape.quadraticCurveTo(0.8, 1.4, 1.6, 1.8);
  wingShape.quadraticCurveTo(1.9, 0.8, 1.2, 0.2);
  wingShape.quadraticCurveTo(1.6, -0.6, 0.9, -1.0);
  wingShape.quadraticCurveTo(0.3, -0.5, 0, 0);

  const wingGeo = new THREE.ShapeGeometry(wingShape);
  const wingMat = new THREE.MeshPhongMaterial({
    color: 0xff69b4,
    emissive: 0xff1493,
    emissiveIntensity: 0.35,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
    shininess: 100
  });

  fairyWingsLeft = new THREE.Mesh(wingGeo, wingMat);
  fairyWingsLeft.position.set(-0.1, 1.6, 0.15);
  fairyWingsLeft.scale.set(0.7, 0.7, 0.7);

  fairyWingsRight = new THREE.Mesh(wingGeo, wingMat);
  fairyWingsRight.position.set(0.1, 1.6, 0.15);
  fairyWingsRight.scale.set(-0.7, 0.7, 0.7);

  playerGroup.add(fairyWingsLeft);
  playerGroup.add(fairyWingsRight);

  scene.add(playerGroup);
}

// -------------------------------------------------------------
// МАГИЧЕСКИЙ СФЕРИЧЕСКИЙ ЩИТ С НОТАМИ (СКРИНШОТ 1)
// -------------------------------------------------------------
function createMagicShield() {
  const shieldGeo = new THREE.SphereGeometry(2.2, 24, 24);
  const shieldMat = new THREE.MeshPhongMaterial({
    color: 0xff4081,
    emissive: 0xff007f,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.4,
    wireframe: false,
    side: THREE.DoubleSide
  });

  shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
  shieldMesh.visible = false;
  playerGroup.add(shieldMesh);

  // Вращающиеся ноты вокруг щита
  for (let i = 0; i < 4; i++) {
    const noteCanvas = document.createElement('canvas');
    noteCanvas.width = 64;
    noteCanvas.height = 64;
    const nctx = noteCanvas.getContext('2d');
    nctx.font = '40px serif';
    nctx.fillStyle = '#ffffff';
    nctx.shadowColor = '#ff4081';
    nctx.shadowBlur = 10;
    nctx.fillText('🎶', 10, 48);

    const noteTex = new THREE.CanvasTexture(noteCanvas);
    const noteMat = new THREE.SpriteMaterial({ map: noteTex, transparent: true });
    const noteSprite = new THREE.Sprite(noteMat);
    noteSprite.scale.set(1.2, 1.2, 1.2);
    shieldNotes.push(noteSprite);
    shieldMesh.add(noteSprite);
  }
}

function triggerMagicShield() {
  if (isShieldActive) return;
  isShieldActive = true;
  shieldMesh.visible = true;
  if (window.magicAudio) window.magicAudio.playMagicShield();

  setTimeout(() => {
    isShieldActive = false;
    shieldMesh.visible = false;
  }, 4000);
}

// -------------------------------------------------------------
// ПОСТРОЕНИЕ 3D КОРИДОРА АЛФЕИ (В ТОЧНОСТИ СКРИНШОТ 2)
// -------------------------------------------------------------
function createCorridorSegment(startZ) {
  const segment = new THREE.Group();
  segment.position.z = startZ;

  // 1. Пол с красной ковровой дорожкой по центру
  // Мраморные боковые плиты
  const floorGeo = new THREE.PlaneGeometry(16, 35);
  const marbleMat = new THREE.MeshPhongMaterial({ color: 0x2e7d32, shininess: 40 }); // Зеленоватый королевский мрамор
  const floorMesh = new THREE.Mesh(floorGeo, marbleMat);
  floorMesh.rotation.x = -Math.PI / 2;
  segment.add(floorMesh);

  // Красная бархатная ковровая дорожка с золотыми узорами (скриншот 2)
  const carpetGeo = new THREE.PlaneGeometry(5.8, 35);
  const carpetMat = new THREE.MeshPhongMaterial({
    color: 0xc2185b, // Насыщенный малиново-красный бархат
    emissive: 0x880e4f,
    emissiveIntensity: 0.15,
    shininess: 20
  });
  const carpetMesh = new THREE.Mesh(carpetGeo, carpetMat);
  carpetMesh.rotation.x = -Math.PI / 2;
  carpetMesh.position.y = 0.02; // Чуть выше пола
  segment.add(carpetMesh);

  // Золотые бордюры ковра
  const borderGeo = new THREE.PlaneGeometry(0.3, 35);
  const goldBorderMat = new THREE.MeshPhongMaterial({ color: 0xffd700, shininess: 80 });
  const bLeft = new THREE.Mesh(borderGeo, goldBorderMat);
  bLeft.rotation.x = -Math.PI / 2;
  bLeft.position.set(-2.9, 0.03, 0);
  const bRight = new THREE.Mesh(borderGeo, goldBorderMat);
  bRight.rotation.x = -Math.PI / 2;
  bRight.position.set(2.9, 0.03, 0);
  segment.add(bLeft);
  segment.add(bRight);

  // 2. Золотые статуи крылатых рыцарей и колонны по бокам (скриншот 2)
  const colGeo = new THREE.CylinderGeometry(0.6, 0.7, 10, 16);
  const statueMat = new THREE.MeshPhongMaterial({
    color: 0xffd700,
    emissive: 0xff8f00,
    emissiveIntensity: 0.25,
    shininess: 100
  });

  for (let zOffset of [-10, 0, 10]) {
    // Левая золотая колонна
    const cL = new THREE.Mesh(colGeo, statueMat);
    cL.position.set(-5.5, 5, zOffset);
    segment.add(cL);

    // Правая золотая колонна
    const cR = new THREE.Mesh(colGeo, statueMat);
    cR.position.set(5.5, 5, zOffset);
    segment.add(cR);

    // Золотой щит-статуя на колонне (скриншот 2)
    const shieldGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.15, 16);
    const sL = new THREE.Mesh(shieldGeo, statueMat);
    sL.rotation.z = Math.PI / 2;
    sL.position.set(-4.7, 4.5, zOffset);
    const sR = new THREE.Mesh(shieldGeo, statueMat);
    sR.rotation.z = Math.PI / 2;
    sR.position.set(4.7, 4.5, zOffset);
    segment.add(sL);
    segment.add(sR);
  }

  // 3. Стены и арки зала
  const wallGeo = new THREE.BoxGeometry(0.8, 12, 35);
  const wallMat = new THREE.MeshPhongMaterial({ color: 0xfff9c4 }); // Теплый кремовый камень Алфеи
  const wL = new THREE.Mesh(wallGeo, wallMat);
  wL.position.set(-7.5, 6, 0);
  const wR = new THREE.Mesh(wallGeo, wallMat);
  wR.position.set(7.5, 6, 0);
  segment.add(wL);
  segment.add(wR);

  // 4. Спавн 3D розовых кристаллов в сегменте (скриншоты 2, 3, 4)
  spawnSegmentGems(segment);

  scene.add(segment);
  corridorSegments.push(segment);
}

// -------------------------------------------------------------
// СПАВН РОЗОВЫХ 3D КРИСТАЛЛОВ (СКРИНШОТЫ 2, 3, 4)
// -------------------------------------------------------------
function spawnSegmentGems(segment) {
  // Октаэдр — точная граненая форма кристалла из скриншота!
  const gemGeo = new THREE.OctahedronGeometry(0.55, 0);
  const gemMat = new THREE.MeshPhongMaterial({
    color: 0xff1493,
    emissive: 0xff4081,
    emissiveIntensity: 0.65,
    shininess: 100,
    transparent: true,
    opacity: 0.95
  });

  const rowPositions = [-12, -4, 4, 12];
  rowPositions.forEach(z => {
    // Выбираем случайную полосу из 3 (левая, центр, правая)
    const laneIndex = Math.floor(Math.random() * 3);
    const gem = new THREE.Mesh(gemGeo, gemMat);
    gem.position.set(LANES[laneIndex], 1.2, z);
    gem.userData = { baseY: 1.2, collected: false };
    segment.add(gem);
    gems3D.push(gem);
  });
}

// -------------------------------------------------------------
// ВОЛШЕБНЫЙ 3D СУНДУК (В ТОЧНОСТИ СКРИНШОТ 4)
// -------------------------------------------------------------
function create3DChest(zPos) {
  chest3D = new THREE.Group();
  chest3D.position.set(0, 0, zPos);

  const woodMat = new THREE.MeshPhongMaterial({ color: 0x6a1b9a, shininess: 30 }); // Фиолетовое дерево
  const goldTrim = new THREE.MeshPhongMaterial({ color: 0xffd700, shininess: 100 });

  // Основание сундука
  const baseGeo = new THREE.BoxGeometry(2.0, 1.1, 1.3);
  const baseMesh = new THREE.Mesh(baseGeo, woodMat);
  baseMesh.position.y = 0.55;
  chest3D.add(baseMesh);

  // Золотые уголки
  const trimGeo = new THREE.BoxGeometry(2.05, 0.2, 1.35);
  const trimMesh = new THREE.Mesh(trimGeo, goldTrim);
  trimMesh.position.y = 1.0;
  chest3D.add(trimMesh);

  // Крышка сундука (с вращением открытия!)
  chestLid = new THREE.Group();
  chestLid.position.set(0, 1.1, 0.65);

  const lidGeo = new THREE.CylinderGeometry(0.65, 0.65, 2.0, 16, 1, false, 0, Math.PI);
  const lidMesh = new THREE.Mesh(lidGeo, woodMat);
  lidMesh.rotation.z = Math.PI / 2;
  chestLid.add(lidMesh);

  chest3D.add(chestLid);
  scene.add(chest3D);
}

function openChest() {
  if (isChestOpen) return;
  isChestOpen = true;

  if (window.magicAudio) window.magicAudio.playEnchantixFanfare();

  // Анимация открывания крышки
  let openAngle = 0;
  const openInterval = setInterval(() => {
    openAngle += 0.08;
    if (chestLid) chestLid.rotation.x = -openAngle;
    if (openAngle >= 1.6) {
      clearInterval(openAngle);
      showChestModal();
    }
  }, 20);
}

function showChestModal() {
  game3dState.diamonds += 15;
  game3dState.stars += 50;
  save3d();

  const modal = document.getElementById('chest-modal');
  if (modal) modal.classList.remove('hidden');
}

// -------------------------------------------------------------
// СИСТЕМА УПРАВЛЕНИЯ СВАЙПАМИ НА IPHONE
// -------------------------------------------------------------
function setupTouchControls() {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
    touchStartTime = Date.now();
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;
    const elapsed = Date.now() - touchStartTime;

    // Свайп по горизонтали (смена полосы: влево / вправо)
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0 && currentLane < 2) {
        currentLane++; // Вправо
        if (window.magicAudio) window.magicAudio.playWingFlap();
      } else if (deltaX < 0 && currentLane > 0) {
        currentLane--; // Влево
        if (window.magicAudio) window.magicAudio.playWingFlap();
      }
    }
    // Свайп вверх (прыжок / взмах крыльев)
    else if (deltaY < -35 && Math.abs(deltaY) > Math.abs(deltaX)) {
      performJump();
    }
    // Простой короткий тап по экрану (включение щита)
    else if (elapsed < 250 && Math.abs(deltaX) < 15 && Math.abs(deltaY) < 15) {
      triggerMagicShield();
    }
  }, { passive: true });

  // Клавиатура для тестирования на ПК (стрелочки влево/вправо/вверх)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentLane > 0) currentLane--;
    if (e.key === 'ArrowRight' && currentLane < 2) currentLane++;
    if (e.key === 'ArrowUp' || e.key === ' ') performJump();
    if (e.key === 's') triggerMagicShield();
  });

  // Кнопка щита
  document.getElementById('btn-cast-shield').onclick = triggerMagicShield;

  // Кнопка моды / гардероба (скриншот 5)
  document.getElementById('btn-switch-mode').onclick = openSalon;
  document.getElementById('salon-back-btn').onclick = closeSalon;

  // Модалка сундука
  document.getElementById('close-chest-modal').onclick = () => {
    document.getElementById('chest-modal').classList.add('hidden');
  };
  document.getElementById('continue-running-btn').onclick = () => {
    document.getElementById('chest-modal').classList.add('hidden');
    // Перемещаем сундук дальше вперед
    if (chest3D) {
      chest3D.position.z = playerGroup.position.z - 90;
      isChestOpen = false;
      if (chestLid) chestLid.rotation.x = 0;
    }
  };

  // Звук
  document.getElementById('btn-toggle-sound').onclick = () => {
    if (window.magicAudio) {
      const en = window.magicAudio.toggleSound();
      document.getElementById('btn-toggle-sound').textContent = en ? '🔊' : '🔇';
    }
  };
}

function performJump() {
  if (isJumping) return;
  isJumping = true;
  playerVelocityY = 9.0;
  if (window.magicAudio) window.magicAudio.playWingFlap();
}

// -------------------------------------------------------------
// ГЛАВНЫЙ ИГРОВОЙ ЦИКЛ 3D (ANIMATE)
// -------------------------------------------------------------
let prevTime = 0;

function animate3D(timestamp) {
  requestAnimationFrame(animate3D);

  const delta = Math.min((timestamp - prevTime) / 1000, 0.1);
  prevTime = timestamp;
  const time = timestamp * 0.001;

  if (isGameRunning && playerGroup) {
    // 1. Движение вперед по коридору
    playerGroup.position.z -= playerSpeedZ * delta;

    // 2. Плавный переход на выбранную полосу (Left, Center, Right)
    targetX = LANES[currentLane];
    playerGroup.position.x += (targetX - playerGroup.position.x) * 12.0 * delta;

    // 3. Физика прыжка
    if (isJumping) {
      playerVelocityY -= 22.0 * delta; // гравитация
      playerY += playerVelocityY * delta;
      if (playerY <= 0) {
        playerY = 0;
        playerVelocityY = 0;
        isJumping = false;
      }
    }

    // Покачивание при беге
    const runBounce = isJumping ? 0 : Math.sin(time * 14) * 0.08;
    playerGroup.position.y = playerY + runBounce;

    // 4. Взмахи крыльев феи
    const wingFlap = Math.sin(time * (isJumping ? 25 : 12)) * 0.55;
    if (fairyWingsLeft) fairyWingsLeft.rotation.y = wingFlap;
    if (fairyWingsRight) fairyWingsRight.rotation.y = -wingFlap;

    // 5. Вращение щита и нот вокруг феи (скриншот 1)
    if (isShieldActive && shieldMesh) {
      shieldMesh.rotation.y += 2.0 * delta;
      shieldNotes.forEach((note, i) => {
        const angle = time * 2.5 + (i * Math.PI / 2);
        note.position.set(Math.cos(angle) * 2.4, Math.sin(time * 3 + i) * 0.4, Math.sin(angle) * 2.4);
      });
    }

    // 6. Камера плавно летит за спиной феи (как на скриншотах 2 и 3)
    camera.position.x = playerGroup.position.x * 0.45;
    camera.position.y = playerGroup.position.y + 3.8;
    camera.position.z = playerGroup.position.z + 6.8;
    camera.lookAt(playerGroup.position.x * 0.25, playerGroup.position.y + 1.6, playerGroup.position.z - 15);

    // 7. Вращение 3D кристаллов и проверка сбора (скриншоты 2 и 4)
    gems3D.forEach((gem) => {
      if (!gem.userData.collected) {
        gem.rotation.y += 2.5 * delta;
        gem.rotation.x = Math.sin(time * 2) * 0.2;
        gem.position.y = gem.userData.baseY + Math.sin(time * 3 + gem.position.x) * 0.15;

        // Расчет дистанции в мировых координатах
        const worldPos = new THREE.Vector3();
        gem.getWorldPosition(worldPos);

        const dist = playerGroup.position.distanceTo(worldPos);
        if (dist < 1.4) {
          // Кристалл собран!
          gem.userData.collected = true;
          gem.visible = false;
          game3dState.diamonds = Math.min(60, game3dState.diamonds + 1);
          save3d();

          if (window.magicAudio) window.magicAudio.playCollect(false);
        }
      }
    });

    // 8. Проверка приближения к 3D сундуку (скриншот 4)
    if (chest3D && !isChestOpen) {
      const distToChest = playerGroup.position.distanceTo(chest3D.position);
      if (distToChest < 3.5) {
        openChest();
      }
    }

    // 9. Бесконечная генерация коридора: если сегмент позади камеры, перемещаем вперед
    corridorSegments.forEach((seg) => {
      if (seg.position.z > playerGroup.position.z + 30) {
        // Находим самый дальний сегмент
        let minZ = 0;
        corridorSegments.forEach(s => { if (s.position.z < minZ) minZ = s.position.z; });
        seg.position.z = minZ - 35;

        // Обновляем кристаллы в сегменте
        seg.children.forEach(child => {
          if (child.userData && child.userData.baseY !== undefined) {
            child.userData.collected = false;
            child.visible = true;
          }
        });
      }
    });
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  const container = document.getElementById('viewport-3d');
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

// -------------------------------------------------------------
// МОДНЫЙ САЛОН / ГАРДЕРОБНАЯ (В ТОЧНОСТИ СКРИНШОТ 5)
// -------------------------------------------------------------
const SALON_ITEMS = {
  bags: [
    { id: 'shell_bag', name: 'Жемчужная ракушка', emoji: '🐚', cost: 0 },
    { id: 'violet_shell', name: 'Лиловая сумка', emoji: '👛', cost: 5 },
    { id: 'heart_pink', name: 'Розовое сердце', emoji: '💖', cost: 8 },
    { id: 'bow_yellow', name: 'Сумочка с бантом', emoji: '🎀', cost: 12 },
    { id: 'rainbow_bag', name: 'Радужный клатч', emoji: '🌈', cost: 15 },
    { id: 'leather_pack', name: 'Школьный ранец', emoji: '🎒', cost: 18 }
  ],
  shoes: [
    { id: 'fairy_boots', name: 'Хрустальные туфли', emoji: '👠', cost: 0 },
    { id: 'pink_heels', name: 'Розовые шпильки', emoji: '👡', cost: 6 },
    { id: 'glitter_boots', name: 'Сапожки Энчантикс', emoji: '👢', cost: 12 }
  ],
  hair: [
    { id: 'bloom_red', name: 'Локоны Блум', emoji: '🧡', cost: 0 },
    { id: 'stella_gold', name: 'Золото Стеллы', emoji: '💛', cost: 10 },
    { id: 'flora_curls', name: 'Кудри Флоры', emoji: '🤎', cost: 14 }
  ],
  wings: [
    { id: 'enchantix_wings', name: 'Крылья Энчантикс', emoji: '🧚‍♀️', cost: 0 },
    { id: 'believix_wings', name: 'Крылья Беливикс', emoji: '✨', cost: 20 },
    { id: 'sun_wings', name: 'Крылья Сияния', emoji: '☀️', cost: 25 }
  ],
  tops: [
    { id: 'bloom_top', name: 'Бирюзовый топ', emoji: '🎽', cost: 0 },
    { id: 'stella_top', name: 'Оранжевое сияние', emoji: '👚', cost: 8 },
    { id: 'ball_corset', name: 'Бальный корсет', emoji: '✨', cost: 15 }
  ],
  skirts: [
    { id: 'bloom_pants', name: 'Брюки клеш', emoji: '👖', cost: 0 },
    { id: 'stella_skirt', name: 'Юбочка с воланами', emoji: '👗', cost: 8 },
    { id: 'ball_skirt', name: 'Шёлковая юбка', emoji: '👑', cost: 15 }
  ]
};

let currentCat = 'bags';

function openSalon() {
  document.getElementById('screen-salon').classList.remove('hidden');
  document.getElementById('hud-3d').style.display = 'none';
  renderSalonCategories();
  renderSalonGrid(currentCat);
  renderSalonFairyPreview();
}

function closeSalon() {
  document.getElementById('screen-salon').classList.add('hidden');
  document.getElementById('hud-3d').style.display = 'flex';
}

function renderSalonCategories() {
  document.querySelectorAll('.circle-cat-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.circle-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.dataset.cat;
      renderSalonGrid(currentCat);
    };
  });
}

function renderSalonGrid(category) {
  const grid = document.getElementById('wardrobe-items-grid');
  grid.innerHTML = '';
  const items = SALON_ITEMS[category] || [];

  items.forEach(item => {
    const card = document.createElement('div');
    const isEquipped = game3dState.equipped[category] === item.id;
    card.className = `wardrobe-item-card ${isEquipped ? 'equipped' : ''}`;

    card.innerHTML = `
      <div class="witem-emoji-art">${item.emoji}</div>
      <b>${item.name}</b>
      <small>${isEquipped ? '✓ Надето' : (item.cost === 0 ? 'Бесплатно' : `💎 ${item.cost}`)}</small>
    `;

    card.onclick = () => {
      if (item.cost === 0 || game3dState.diamonds >= item.cost) {
        game3dState.equipped[category] = item.id;
        save3d();
        if (window.magicAudio) window.magicAudio.playSparkle();
        renderSalonGrid(category);
        renderSalonFairyPreview();
      } else {
        alert('Собери больше розовых кристаллов в 3D замке Алфея!');
      }
    };

    grid.appendChild(card);
  });
}

function renderSalonFairyPreview() {
  const box = document.getElementById('salon-fairy-preview');
  if (box && window.WINX_ASSETS) {
    box.innerHTML = WINX_ASSETS.characters.stella; // Полноразмерная Стелла из скриншота 5!
  }
}

// Запуск при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
  init3D();
});
