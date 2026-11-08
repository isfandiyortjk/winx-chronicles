// Winx Club 3D: Хроники Алфеи — Трёхмерное прохождение с уровнями и сюжетными миссиями
// Воссоздаёт настоящее прохождение культовой игры Winx Club 2006:
// - Уровень 1: Сад Алфеи с дорожкой, фонарями, коваными воротами и сундуком (скриншоты 3 и 4)
// - Уровень 2: Зал замка с красным ковром, колоннами и золотыми рыцарями (скриншот 2)
// - Уровень 3: Битва со сферическим розовым щитом и стрельбой магией (скриншот 1)
// - Уровень 4: Модный салон с выбором сумочек и обуви (скриншот 5)
// - Уровень 5: Финал с Золотым Ларцом и письмом Любви

const CAMPAIGN_SAVE_KEY = 'winx_campaign_progress_v2';

let campaignData = {
  unlockedLevel: 1,
  currentLevel: 1,
  levelStars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  diamondsTotal: 14,
  equipped: {
    hair: 'bloom_red',
    wings: 'enchantix_wings',
    tops: 'bloom_top',
    skirts: 'bloom_pants',
    shoes: 'fairy_boots',
    bags: 'shell_bag'
  }
};

// Загрузка прогресса
try {
  const raw = localStorage.getItem(CAMPAIGN_SAVE_KEY);
  if (raw) Object.assign(campaignData, JSON.parse(raw));
} catch (e) {}

function saveCampaign() {
  try {
    localStorage.setItem(CAMPAIGN_SAVE_KEY, JSON.stringify(campaignData));
  } catch (e) {}
  updateMapNodes();
}

// -------------------------------------------------------------
// 3D ДВИЖОК THREE.JS
// -------------------------------------------------------------
let scene, camera, renderer;
let playerGroup, fairyWingsLeft, fairyWingsRight;
let magicShieldMesh, shieldNotes = [];
let activeProjectiles = [];
let levelObjects = []; // Кристаллы, сундуки, ворота текущего уровня
let bossMonster = null;
let bossHp = 100;
let levelGemsCollected = 0;
let targetGemsCount = 10;
let hasGardenKey = false;
let activeInteractAction = null;

// Ввод управления (D-Pad и кнопки)
const inputState = {
  up: false,
  down: false,
  left: false,
  right: false
};

let playerVelocity = new THREE.Vector3();
let playerVelocityY = 0;
let isJumping = false;
let isShieldActive = false;
let isPlaying3D = false;

function initThreeEngine() {
  const container = document.getElementById('viewport-3d');
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2a0845);
  scene.fog = new THREE.FogExp2(0x2a0845, 0.015);

  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 250);
  camera.position.set(0, 4, 7);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Освещение
  const ambient = new THREE.AmbientLight(0xffebee, 0.85);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xfff8e1, 1.2);
  sun.position.set(15, 30, 20);
  scene.add(sun);

  // Создаем фею игрока
  buildPlayerFairy();

  // Создаем магический сферический щит (скриншот 1)
  buildMagicShield();

  // Слушатели сенсорного управления
  setupControls();

  // Обновляем карту уровней
  updateMapNodes();

  window.addEventListener('resize', () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // Цикл отрисовки
  animateLoop(0);
}

// -------------------------------------------------------------
// СОЗДАНИЕ ПЕРСОНАЖА ФЕИ
// -------------------------------------------------------------
function buildPlayerFairy() {
  playerGroup = new THREE.Group();

  const skinMat = new THREE.MeshPhongMaterial({ color: 0xffdfcf });
  const hairMat = new THREE.MeshPhongMaterial({ color: 0xff3d00, shininess: 80 });
  const topMat = new THREE.MeshPhongMaterial({ color: 0x00e5ff, shininess: 50 });
  const pantsMat = new THREE.MeshPhongMaterial({ color: 0x00bcd4, shininess: 50 });
  const goldMat = new THREE.MeshPhongMaterial({ color: 0xffd700, shininess: 90 });

  // Голова
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), skinMat);
  head.position.y = 2.1;
  playerGroup.add(head);

  // Волосы Блум с длинным хвостом
  const hair = new THREE.Mesh(new THREE.ConeGeometry(0.48, 1.3, 8), hairMat);
  hair.position.set(0, 1.8, 0.4);
  hair.rotation.x = 0.5;
  playerGroup.add(hair);

  // Диадема
  const tiara = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.22, 4), goldMat);
  tiara.position.set(0, 2.45, 0);
  playerGroup.add(tiara);

  // Топ
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.65, 8), topMat);
  body.position.y = 1.45;
  playerGroup.add(body);

  // Брючки
  const legGeo = new THREE.CylinderGeometry(0.08, 0.15, 1.05, 8);
  const legL = new THREE.Mesh(legGeo, pantsMat);
  legL.position.set(-0.16, 0.65, 0);
  const legR = new THREE.Mesh(legGeo, pantsMat);
  legR.position.set(0.16, 0.65, 0);
  playerGroup.add(legL);
  playerGroup.add(legR);

  // Крылья феи
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0);
  wingShape.quadraticCurveTo(0.7, 1.2, 1.4, 1.6);
  wingShape.quadraticCurveTo(1.7, 0.7, 1.1, 0.2);
  wingShape.quadraticCurveTo(1.4, -0.5, 0.8, -0.8);
  wingShape.quadraticCurveTo(0.2, -0.4, 0, 0);

  const wingGeo = new THREE.ShapeGeometry(wingShape);
  const wingMat = new THREE.MeshPhongMaterial({
    color: 0xff4081,
    emissive: 0xff1493,
    emissiveIntensity: 0.4,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85
  });

  fairyWingsLeft = new THREE.Mesh(wingGeo, wingMat);
  fairyWingsLeft.position.set(-0.1, 1.6, 0.1);
  fairyWingsLeft.scale.set(0.7, 0.7, 0.7);

  fairyWingsRight = new THREE.Mesh(wingGeo, wingMat);
  fairyWingsRight.position.set(0.1, 1.6, 0.1);
  fairyWingsRight.scale.set(-0.7, 0.7, 0.7);

  playerGroup.add(fairyWingsLeft);
  playerGroup.add(fairyWingsRight);

  scene.add(playerGroup);
}

// -------------------------------------------------------------
// РОЗОВЫЙ СФЕРИЧЕСКИЙ ЩИТ С НОТАМИ (СКРИНШОТ 1)
// -------------------------------------------------------------
function buildMagicShield() {
  const shieldGeo = new THREE.SphereGeometry(2.3, 24, 24);
  const shieldMat = new THREE.MeshPhongMaterial({
    color: 0xff4081,
    emissive: 0xff007f,
    emissiveIntensity: 0.65,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide
  });

  magicShieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
  magicShieldMesh.visible = false;
  playerGroup.add(magicShieldMesh);

  for (let i = 0; i < 4; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.font = '36px serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ff4081';
    ctx.shadowBlur = 10;
    ctx.fillText('🎶', 12, 45);

    const tex = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
    sprite.scale.set(1.2, 1.2, 1.2);
    shieldNotes.push(sprite);
    magicShieldMesh.add(sprite);
  }
}

function activateShield() {
  if (isShieldActive) return;
  isShieldActive = true;
  magicShieldMesh.visible = true;
  if (window.magicAudio) window.magicAudio.playMagicShield();

  setTimeout(() => {
    isShieldActive = false;
    magicShieldMesh.visible = false;
  }, 3500);
}

// -------------------------------------------------------------
// МАГИЧЕСКИЙ ВЫСТРЕЛ (ОГНЕННЫЙ ШАР / ЛУЧ СВЕТА)
// -------------------------------------------------------------
function castMagicShot() {
  if (window.magicAudio) window.magicAudio.playMagicSpell();

  const orbGeo = new THREE.SphereGeometry(0.35, 12, 12);
  const orbMat = new THREE.MeshBasicMaterial({ color: 0xff9100 });
  const projectile = new THREE.Mesh(orbGeo, orbMat);

  projectile.position.copy(playerGroup.position);
  projectile.position.y += 1.4;

  const dir = new THREE.Vector3(0, 0, -1).applyEuler(playerGroup.rotation);
  projectile.userData = { direction: dir, life: 2.0 };

  scene.add(projectile);
  activeProjectiles.push(projectile);
}

// -------------------------------------------------------------
// ЗАГРУЗКА И ПОСТРОЕНИЕ 3D УРОВНЕЙ С ПРОХОЖДЕНИЕМ
// -------------------------------------------------------------
function clearCurrentLevel() {
  levelObjects.forEach(obj => scene.remove(obj));
  levelObjects = [];
  activeProjectiles.forEach(p => scene.remove(p));
  activeProjectiles = [];
  if (bossMonster) {
    scene.remove(bossMonster);
    bossMonster = null;
  }
  levelGemsCollected = 0;
  hasGardenKey = false;
  isShieldActive = false;
  magicShieldMesh.visible = false;
}

function loadLevel(levelNum) {
  clearCurrentLevel();
  campaignData.currentLevel = levelNum;

  // Позиционируем игрока в начало уровня
  playerGroup.position.set(0, 0, 0);
  playerGroup.rotation.y = 0;

  if (levelNum === 1) {
    buildLevel1_Garden();
  } else if (levelNum === 2) {
    buildLevel2_Hall();
  } else if (levelNum === 3) {
    buildLevel3_Boss();
  } else if (levelNum === 4) {
    openFashionLevel();
    return;
  } else if (levelNum === 5) {
    buildLevel5_Throne();
  }

  show3dGameHUD();
}

// УРОВЕНЬ 1: САД АЛФЕИ С ВОРОТАМИ И СУНДУКОМ (СКРИНШОТЫ 3 И 4)
function buildLevel1_Garden() {
  scene.background = new THREE.Color(0x388e3c);
  scene.fog = new THREE.FogExp2(0x81c784, 0.012);

  targetGemsCount = 10;
  document.getElementById('quest-text').textContent = 'Собери 10 кристаллов, найди ключ в сундуке и открой ворота!';
  document.getElementById('hud-gems-count').textContent = `0 / ${targetGemsCount}`;

  // 1. Зелёный газон
  const lawnGeo = new THREE.PlaneGeometry(60, 100);
  const lawnMat = new THREE.MeshPhongMaterial({ color: 0x4caf50 });
  const lawn = new THREE.Mesh(lawnGeo, lawnMat);
  lawn.rotation.x = -Math.PI / 2;
  scene.add(lawn);
  levelObjects.push(lawn);

  // 2. Извилистая каменная дорожка к воротам (скриншот 3)
  const pathGeo = new THREE.PlaneGeometry(5, 80);
  const pathMat = new THREE.MeshPhongMaterial({ color: 0xd7ccc8, roughness: 0.9 });
  const stonePath = new THREE.Mesh(pathGeo, pathMat);
  stonePath.rotation.x = -Math.PI / 2;
  stonePath.position.set(0, 0.02, -35);
  scene.add(stonePath);
  levelObjects.push(stonePath);

  // 3. Фонарные столбы Алфеи вдоль дорожки (скриншоты 3 и 4)
  for (let z of [-10, -25, -45]) {
    createStreetLamp(-3.8, z);
    createStreetLamp(3.8, z);
  }

  // 4. Деревья и камни в саду
  createGardenTree(-8, -15);
  createGardenTree(9, -20);
  createGardenTree(-7, -40);
  createGardenTree(8, -50);

  // 5. Большой камень и сундук с ключом (скриншот 4)
  const rockGeo = new THREE.DodecahedronGeometry(2.2);
  const rockMat = new THREE.MeshPhongMaterial({ color: 0x78909c });
  const rock = new THREE.Mesh(rockGeo, rockMat);
  rock.position.set(-5, 1.2, -22);
  scene.add(rock);
  levelObjects.push(rock);

  createChestObject(-3.2, -22, 'chest_garden');

  // 6. Кованые железные ворота в конце дорожки с каменной аркой (скриншот 3)
  createGardenGate(0, -68);

  // 7. Розовые кристаллы по саду
  const gemPositions = [
    [0, -6], [-1.5, -12], [1.5, -16], [0, -24],
    [-2, -30], [2, -34], [0, -42], [-1.8, -48],
    [1.8, -52], [0, -60]
  ];

  gemPositions.forEach(([gx, gz]) => createPinkGem(gx, gz));
}

// УРОВЕНЬ 2: ЗАЛ С КРАСНЫМ КОВРОМ (СКРИНШОТ 2)
function buildLevel2_Hall() {
  scene.background = new THREE.Color(0x1a0a2a);
  scene.fog = new THREE.FogExp2(0x1a0a2a, 0.015);

  targetGemsCount = 15;
  document.getElementById('quest-text').textContent = 'Пройди по красной дорожке до королевской лестницы!';
  document.getElementById('hud-gems-count').textContent = `0 / ${targetGemsCount}`;

  // Пол и красный бархатный ковер
  const floorGeo = new THREE.PlaneGeometry(18, 90);
  const floorMat = new THREE.MeshPhongMaterial({ color: 0x1b5e20 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = -40;
  scene.add(floor);
  levelObjects.push(floor);

  const carpetGeo = new THREE.PlaneGeometry(6, 90);
  const carpetMat = new THREE.MeshPhongMaterial({ color: 0xc2185b, emissive: 0x880e4f, emissiveIntensity: 0.15 });
  const carpet = new THREE.Mesh(carpetGeo, carpetMat);
  carpet.rotation.x = -Math.PI / 2;
  carpet.position.set(0, 0.03, -40);
  scene.add(carpet);
  levelObjects.push(carpet);

  // Золотые статуи и колонны (скриншот 2)
  for (let z of [-10, -25, -40, -55, -70]) {
    createKnightStatue(-5.5, z);
    createKnightStatue(5.5, z);
  }

  // Роскошная лестница в конце (скриншот 2)
  for (let step = 0; step < 8; step++) {
    const stepGeo = new THREE.BoxGeometry(10, 0.4, 1.2);
    const stepMat = new THREE.MeshPhongMaterial({ color: 0xffd700 });
    const stepMesh = new THREE.Mesh(stepGeo, stepMat);
    stepMesh.position.set(0, 0.2 + step * 0.4, -78 - step * 1.2);
    scene.add(stepMesh);
    levelObjects.push(stepMesh);
  }

  // Кристаллы вдоль ковра
  for (let i = 0; i < 15; i++) {
    const laneX = (i % 3 === 0) ? -1.8 : (i % 3 === 1 ? 0 : 1.8);
    createPinkGem(laneX, -5 - i * 4.6);
  }
}

// УРОВЕНЬ 3: ЛЕДЯНАЯ БИТВА С МОНСТРОМ ТРИКС (СКРИНШОТ 1)
function buildLevel3_Boss() {
  scene.background = new THREE.Color(0x0a192f);
  scene.fog = new THREE.FogExp2(0x00e5ff, 0.018);

  targetGemsCount = 100; // Босс HP
  bossHp = 100;
  document.getElementById('quest-text').textContent = 'Битва! Отражай атаки щитом 🛡️ и стреляй магией ⚡!';
  document.getElementById('hud-gems-count').textContent = `Босс: ${bossHp} HP`;

  const arenaGeo = new THREE.CircleGeometry(25, 32);
  const arenaMat = new THREE.MeshPhongMaterial({ color: 0x006064 });
  const arena = new THREE.Mesh(arenaGeo, arenaMat);
  arena.rotation.x = -Math.PI / 2;
  arena.position.z = -15;
  scene.add(arena);
  levelObjects.push(arena);

  // Создаем 3D монстра Трикс (синее крылатое существо как на скриншоте 1)
  bossMonster = new THREE.Group();
  bossMonster.position.set(0, 0, -20);

  const monsterMat = new THREE.MeshPhongMaterial({ color: 0x1565c0, emissive: 0x0d47a1, emissiveIntensity: 0.4 });
  const bodyMesh = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3.5, 8), monsterMat);
  bodyMesh.position.y = 2.2;
  bossMonster.add(bodyMesh);

  // Голова монстра с светящимися зелеными глазами
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 12), monsterMat);
  headMesh.position.y = 4.2;
  bossMonster.add(headMesh);

  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00e676 });
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), eyeMat);
  eyeL.position.set(-0.25, 4.3, 0.6);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), eyeMat);
  eyeR.position.set(0.25, 4.3, 0.6);
  bossMonster.add(eyeL);
  bossMonster.add(eyeR);

  // Ледяные шипы монстра
  const spikeMat = new THREE.MeshPhongMaterial({ color: 0x00e5ff });
  for (let a = 0; a < 4; a++) {
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.8, 6), spikeMat);
    spike.position.set(Math.cos(a) * 1.5, 2.5, Math.sin(a) * 1.5);
    bossMonster.add(spike);
  }

  scene.add(bossMonster);

  // Периодическая атака босса ледяными снарядами
  let bossAttackTimer = setInterval(() => {
    if (!bossMonster || bossHp <= 0 || !isPlaying3D) {
      clearInterval(bossAttackTimer);
      return;
    }

    // Выстрел льдом
    const iceGeo = new THREE.DodecahedronGeometry(0.45);
    const iceMat = new THREE.MeshPhongMaterial({ color: 0x00e5ff, emissive: 0x00b0ff });
    const iceOrb = new THREE.Mesh(iceGeo, iceMat);
    iceOrb.position.copy(bossMonster.position);
    iceOrb.position.y = 3.0;

    const dir = new THREE.Vector3().subVectors(playerGroup.position, bossMonster.position).normalize();
    iceOrb.userData = { direction: dir, life: 3.0, isEnemy: true };
    scene.add(iceOrb);
    activeProjectiles.push(iceOrb);

    if (window.magicAudio) window.magicAudio.playMagicSpell();
  }, 2400);
}

// УРОВЕНЬ 5: ТРОННЫЙ ЗАЛ И ЗОЛОТОЙ ЛАРЕЦ
function buildLevel5_Throne() {
  scene.background = new THREE.Color(0x4a148c);
  scene.fog = new THREE.FogExp2(0x4a148c, 0.015);

  document.getElementById('quest-text').textContent = 'Подойди к Золотому Ларцу и открой послание Любви!';
  document.getElementById('hud-gems-count').textContent = `👑 Финал`;

  // Золотой ковер тронного зала
  const hallGeo = new THREE.PlaneGeometry(16, 50);
  const hallMat = new THREE.MeshPhongMaterial({ color: 0xffd700, shininess: 80 });
  const floor = new THREE.Mesh(hallGeo, hallMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = -20;
  scene.add(floor);
  levelObjects.push(floor);

  // Золотой Ларец в центре зала
  createChestObject(0, -25, 'chest_throne');
}

// Вспомогательные функции построения декораций
function createStreetLamp(x, z) {
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 4.5, 8), new THREE.MeshPhongMaterial({ color: 0x5d4037 }));
  post.position.set(x, 2.25, z);
  const lamp = new THREE.Mesh(new THREE.DodecahedronGeometry(0.45), new THREE.MeshBasicMaterial({ color: 0xffd54f }));
  lamp.position.set(x, 4.6, z);
  scene.add(post);
  scene.add(lamp);
  levelObjects.push(post, lamp);
}

function createGardenTree(x, z) {
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 3.5, 8), new THREE.MeshPhongMaterial({ color: 0x4e342e }));
  trunk.position.set(x, 1.75, z);
  const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2), new THREE.MeshPhongMaterial({ color: 0x2e7d32 }));
  crown.position.set(x, 4.5, z);
  scene.add(trunk);
  scene.add(crown);
  levelObjects.push(trunk, crown);
}

function createKnightStatue(x, z) {
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 9, 16), new THREE.MeshPhongMaterial({ color: 0xffd700, shininess: 100 }));
  col.position.set(x, 4.5, z);
  const shield = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.15, 16), new THREE.MeshPhongMaterial({ color: 0xffd700, shininess: 100 }));
  shield.rotation.z = Math.PI / 2;
  shield.position.set(x > 0 ? x - 0.7 : x + 0.7, 4.2, z);
  scene.add(col);
  scene.add(shield);
  levelObjects.push(col, shield);
}

function createGardenGate(x, z) {
  const arch = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.45, 8, 24, Math.PI), new THREE.MeshPhongMaterial({ color: 0x37474f }));
  arch.position.set(x, 4.5, z);
  const gateLeft = new THREE.Mesh(new THREE.BoxGeometry(2.5, 4.5, 0.15), new THREE.MeshPhongMaterial({ color: 0x263238, transparent: true, opacity: 0.9 }));
  gateLeft.position.set(x - 1.3, 2.25, z);
  const gateRight = new THREE.Mesh(new THREE.BoxGeometry(2.5, 4.5, 0.15), new THREE.MeshPhongMaterial({ color: 0x263238, transparent: true, opacity: 0.9 }));
  gateRight.position.set(x + 1.3, 2.25, z);

  scene.add(arch);
  scene.add(gateLeft);
  scene.add(gateRight);
  levelObjects.push(arch, gateLeft, gateRight);

  // Зона ворот
  arch.userData = { type: 'gate', z: z, open: false, leftWing: gateLeft, rightWing: gateRight };
}

function createChestObject(x, z, chestId) {
  const chestGroup = new THREE.Group();
  chestGroup.position.set(x, 0, z);

  const base = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.0, 1.2), new THREE.MeshPhongMaterial({ color: 0x6a1b9a }));
  base.position.y = 0.5;
  const trim = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.15, 1.25), new THREE.MeshPhongMaterial({ color: 0xffd700, shininess: 100 }));
  trim.position.y = 0.95;
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.8, 16, 1, false, 0, Math.PI), new THREE.MeshPhongMaterial({ color: 0x6a1b9a }));
  lid.rotation.z = Math.PI / 2;
  lid.position.set(0, 1.0, 0.6);

  chestGroup.add(base, trim, lid);
  chestGroup.userData = { type: 'chest', id: chestId, open: false, lid: lid };

  scene.add(chestGroup);
  levelObjects.push(chestGroup);
}

function createPinkGem(x, z) {
  const gem = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.55, 0),
    new THREE.MeshPhongMaterial({
      color: 0xff1493,
      emissive: 0xff4081,
      emissiveIntensity: 0.7,
      shininess: 100,
      transparent: true,
      opacity: 0.95
    })
  );
  gem.position.set(x, 1.2, z);
  gem.userData = { type: 'gem', collected: false, baseY: 1.2 };
  scene.add(gem);
  levelObjects.push(gem);
}

// -------------------------------------------------------------
// ИНТЕРАКТИВНОЕ ВЗАИМОДЕЙСТВИЕ (ОТКРЫВАНИЕ СУНДУКОВ И ВОРОТ)
// -------------------------------------------------------------
function handleInteractAction() {
  if (!activeInteractAction) return;

  const btn = document.getElementById('btn-interact');
  btn.classList.add('hidden');

  if (activeInteractAction.type === 'chest') {
    const chest = activeInteractAction.obj;
    chest.userData.open = true;
    if (chest.userData.lid) chest.userData.lid.rotation.x = -1.5;

    if (window.magicAudio) window.magicAudio.playCollect(true);

    if (chest.userData.id === 'chest_garden') {
      hasGardenKey = true;
      document.getElementById('quest-text').textContent = '🗝️ Ключ получен! Теперь открой Большие Ворота!';
      alert('Ты нашла Ключ от Ворот Алфеи! 🗝️✨');
    } else if (chest.userData.id === 'chest_throne') {
      showFinalLetterModal();
    }
  } else if (activeInteractAction.type === 'gate') {
    const gate = activeInteractAction.obj;
    if (hasGardenKey && levelGemsCollected >= targetGemsCount) {
      gate.userData.open = true;
      gate.userData.leftWing.position.x -= 2.0;
      gate.userData.rightWing.position.x += 2.0;
      if (window.magicAudio) window.magicAudio.playEnchantixFanfare();
      triggerLevelWin(1);
    } else {
      alert('Ворота заперты! Собери все 10 кристаллов и найди ключ в сундуке под камнем!');
    }
  }

  activeInteractAction = null;
}

function triggerLevelWin(levelNum) {
  isPlaying3D = false;
  if (campaignData.unlockedLevel <= levelNum && campaignData.unlockedLevel < 5) {
    campaignData.unlockedLevel = levelNum + 1;
  }
  campaignData.levelStars[levelNum] = 3;
  campaignData.diamondsTotal += 20;
  saveCampaign();

  if (window.magicAudio) window.magicAudio.playEnchantixFanfare();

  const winModal = document.getElementById('modal-level-win');
  if (winModal) {
    document.getElementById('win-desc-text').textContent = `Уровень ${levelNum} успешно пройден! Открыта следующая глава!`;
    winModal.classList.remove('hidden');
  }
}

// -------------------------------------------------------------
// СЕНСОРНОЕ УПРАВЛЕНИЕ И СЛУШАТЕЛИ КНОПОК
// -------------------------------------------------------------
function setupControls() {
  // D-Pad для ходьбы во все стороны (сенсорный ввод на мобильном)
  const dpadBtns = document.querySelectorAll('.dpad-btn');
  dpadBtns.forEach(btn => {
    const dir = btn.dataset.dir;

    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      inputState[dir] = true;
    });

    btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      inputState[dir] = false;
    });

    btn.addEventListener('mousedown', () => { inputState[dir] = true; });
    btn.addEventListener('mouseup', () => { inputState[dir] = false; });
  });

  // Кнопки действий
  document.getElementById('btn-spell-shoot').onclick = castMagicShot;
  document.getElementById('btn-spell-shield').onclick = activateShield;
  document.getElementById('btn-jump').onclick = () => {
    if (!isJumping) {
      isJumping = true;
      playerVelocityY = 9.5;
      if (window.magicAudio) window.magicAudio.playWingFlap();
    }
  };

  document.getElementById('btn-interact').onclick = handleInteractAction;

  // Клавиатура на ПК
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w') inputState.up = true;
    if (e.key === 'ArrowDown' || e.key === 's') inputState.down = true;
    if (e.key === 'ArrowLeft' || e.key === 'a') inputState.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') inputState.right = true;
    if (e.key === ' ' && !isJumping) {
      isJumping = true;
      playerVelocityY = 9.5;
      if (window.magicAudio) window.magicAudio.playWingFlap();
    }
    if (e.key === 'e') handleInteractAction();
    if (e.key === 'q') castMagicShot();
    if (e.key === 'f') activateShield();
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w') inputState.up = false;
    if (e.key === 'ArrowDown' || e.key === 's') inputState.down = false;
    if (e.key === 'ArrowLeft' || e.key === 'a') inputState.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') inputState.right = false;
  });

  // Кнопка возврата к Карте
  document.getElementById('btn-pause-map').onclick = () => {
    isPlaying3D = false;
    showCampaignMap();
  };

  // Кнопка старта с карты
  document.getElementById('btn-start-current-lvl').onclick = () => {
    loadLevel(campaignData.currentLevel);
  };

  // Кнопка следующего уровня в окне победы
  document.getElementById('btn-next-level').onclick = () => {
    document.getElementById('modal-level-win').classList.add('hidden');
    if (campaignData.currentLevel < 5) {
      loadLevel(campaignData.currentLevel + 1);
    } else {
      showFinalLetterModal();
    }
  };

  // Кнопка выхода из салона
  document.getElementById('salon-back-btn').onclick = () => {
    document.getElementById('screen-salon').classList.add('hidden');
    showCampaignMap();
  };

  document.getElementById('btn-salon-ready').onclick = () => {
    document.getElementById('screen-salon').classList.add('hidden');
    triggerLevelWin(4);
  };

  document.getElementById('btn-final-finish').onclick = () => {
    document.getElementById('modal-final-letter').classList.add('hidden');
    showCampaignMap();
  };
}

// -------------------------------------------------------------
// ГЛАВНЫЙ ЦИКЛ 3D (ANIMATE)
// -------------------------------------------------------------
let lastTime = 0;

function animateLoop(now) {
  requestAnimationFrame(animateLoop);

  const delta = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;
  const time = now * 0.001;

  if (isPlaying3D && playerGroup) {
    // 1. Движение феи по направлению D-Pad
    let moveX = 0;
    let moveZ = 0;
    const speed = 10.0;

    if (inputState.up) moveZ -= 1;
    if (inputState.down) moveZ += 1;
    if (inputState.left) moveX -= 1;
    if (inputState.right) moveX += 1;

    if (moveX !== 0 || moveZ !== 0) {
      const moveVec = new THREE.Vector2(moveX, moveZ).normalize();
      playerGroup.position.x += moveVec.x * speed * delta;
      playerGroup.position.z += moveVec.y * speed * delta;

      // Плавный поворот в сторону движения
      const targetAngle = Math.atan2(-moveVec.x, -moveVec.y);
      playerGroup.rotation.y = targetAngle;
    }

    // 2. Прыжок и гравитация
    if (isJumping) {
      playerVelocityY -= 24.0 * delta;
      playerGroup.position.y += playerVelocityY * delta;
      if (playerGroup.position.y <= 0) {
        playerGroup.position.y = 0;
        playerVelocityY = 0;
        isJumping = false;
      }
    } else {
      // Покачивание при ходьбе
      const walkBob = (moveX !== 0 || moveZ !== 0) ? Math.sin(time * 14) * 0.08 : 0;
      playerGroup.position.y = walkBob;
    }

    // Взмахи крыльев
    const flap = Math.sin(time * (isJumping ? 25 : 10)) * 0.55;
    if (fairyWingsLeft) fairyWingsLeft.rotation.y = flap;
    if (fairyWingsRight) fairyWingsRight.rotation.y = -flap;

    // Вращение щита (скриншот 1)
    if (isShieldActive && magicShieldMesh) {
      magicShieldMesh.rotation.y += 2.2 * delta;
      shieldNotes.forEach((note, i) => {
        const ang = time * 2.8 + (i * Math.PI / 2);
        note.position.set(Math.cos(ang) * 2.4, Math.sin(time * 3 + i) * 0.35, Math.sin(ang) * 2.4);
      });
    }

    // 3. Камера третьего лица (следит за феей)
    camera.position.x = playerGroup.position.x * 0.4;
    camera.position.y = playerGroup.position.y + 4.2;
    camera.position.z = playerGroup.position.z + 7.5;
    camera.lookAt(playerGroup.position.x * 0.2, playerGroup.position.y + 1.8, playerGroup.position.z - 12);

    // 4. Полет магических снарядов
    for (let i = activeProjectiles.length - 1; i >= 0; i--) {
      const p = activeProjectiles[i];
      p.position.addScaledVector(p.userData.direction, 22.0 * delta);
      p.userData.life -= delta;

      // Коллизия с боссом
      if (!p.userData.isEnemy && bossMonster && bossHp > 0) {
        if (p.position.distanceTo(bossMonster.position) < 2.5) {
          bossHp = Math.max(0, bossHp - 25);
          document.getElementById('hud-gems-count').textContent = `Босс: ${bossHp} HP`;
          scene.remove(p);
          activeProjectiles.splice(i, 1);

          if (bossHp <= 0) {
            triggerLevelWin(3);
          }
          continue;
        }
      }

      // Коллизия вражеского льда с щитом игрока
      if (p.userData.isEnemy) {
        if (p.position.distanceTo(playerGroup.position) < 2.5) {
          if (isShieldActive) {
            // Щит отразил атаку!
            scene.remove(p);
            activeProjectiles.splice(i, 1);
            if (window.magicAudio) window.magicAudio.playMagicShield();
          }
        }
      }

      if (p.userData.life <= 0) {
        scene.remove(p);
        activeProjectiles.splice(i, 1);
      }
    }

    // 5. Вращение кристаллов и сбор (скриншоты 2 и 4)
    levelObjects.forEach(obj => {
      if (obj.userData && obj.userData.type === 'gem' && !obj.userData.collected) {
        obj.rotation.y += 2.5 * delta;
        obj.position.y = obj.userData.baseY + Math.sin(time * 3 + obj.position.x) * 0.15;

        if (playerGroup.position.distanceTo(obj.position) < 1.4) {
          obj.userData.collected = true;
          obj.visible = false;
          levelGemsCollected++;
          document.getElementById('hud-gems-count').textContent = `${levelGemsCollected} / ${targetGemsCount}`;

          if (window.magicAudio) window.magicAudio.playCollect(false);

          if (campaignData.currentLevel === 2 && levelGemsCollected >= targetGemsCount) {
            triggerLevelWin(2);
          }
        }
      }
    });

    // 6. Проверка приближения к сундуку или воротам
    checkInteractions();
  }

  renderer.render(scene, camera);
}

function checkInteractions() {
  const interactBtn = document.getElementById('btn-interact');
  let found = false;

  levelObjects.forEach(obj => {
    if (obj.userData && obj.userData.type === 'chest' && !obj.userData.open) {
      if (playerGroup.position.distanceTo(obj.position) < 3.2) {
        found = true;
        activeInteractAction = { type: 'chest', obj: obj };
        interactBtn.querySelector('span').textContent = '✨ ОТКРЫТЬ СУНДУК ✨';
      }
    } else if (obj.userData && obj.userData.type === 'gate' && !obj.userData.open) {
      if (Math.abs(playerGroup.position.z - obj.userData.z) < 4.0 && Math.abs(playerGroup.position.x) < 4.0) {
        found = true;
        activeInteractAction = { type: 'gate', obj: obj };
        interactBtn.querySelector('span').textContent = '🗝️ ОТКРЫТЬ ВОРОТА 🗝️';
      }
    }
  });

  if (found) {
    interactBtn.classList.remove('hidden');
  } else {
    interactBtn.classList.add('hidden');
    activeInteractAction = null;
  }
}

// -------------------------------------------------------------
// ЭКРАНЫ И НАВИГАЦИЯ
// -------------------------------------------------------------
function showCampaignMap() {
  document.getElementById('screen-map').classList.remove('hidden');
  document.getElementById('hud-3d').classList.add('hidden');
  document.getElementById('screen-salon').classList.add('hidden');
  updateMapNodes();
}

function show3dGameHUD() {
  document.getElementById('screen-map').classList.add('hidden');
  document.getElementById('hud-3d').classList.remove('hidden');
  isPlaying3D = true;
}

function updateMapNodes() {
  const nodes = document.querySelectorAll('.level-node');
  nodes.forEach(node => {
    const lvl = parseInt(node.dataset.lvl);
    node.classList.remove('active', 'completed', 'locked');

    const starEl = document.getElementById(`lvl-stars-${lvl}`);

    if (lvl < campaignData.unlockedLevel) {
      node.classList.add('completed');
      if (starEl) starEl.textContent = '★★★';
    } else if (lvl === campaignData.unlockedLevel) {
      node.classList.add('active');
      if (starEl) starEl.textContent = 'В бой!';
    } else {
      node.classList.add('locked');
      if (starEl) starEl.textContent = '🔒';
    }

    node.onclick = () => {
      if (lvl <= campaignData.unlockedLevel) {
        campaignData.currentLevel = lvl;
        loadLevel(lvl);
      } else {
        alert('Сначала пройди предыдущие миссии!');
      }
    };
  });
}

// -------------------------------------------------------------
// МОДНЫЙ САЛОН (УРОВЕНЬ 4 / СКРИНШОТ 5)
// -------------------------------------------------------------
const SALON_ITEMS = {
  bags: [
    { id: 'shell_bag', name: 'Жемчужная ракушка', emoji: '🐚' },
    { id: 'violet_shell', name: 'Лиловая сумка', emoji: '👛' },
    { id: 'heart_pink', name: 'Розовое сердце', emoji: '💖' },
    { id: 'bow_yellow', name: 'Сумочка с бантом', emoji: '🎀' },
    { id: 'rainbow_bag', name: 'Радужный клатч', emoji: '🌈' },
    { id: 'leather_pack', name: 'Школьный ранец', emoji: '🎒' }
  ],
  shoes: [
    { id: 'fairy_boots', name: 'Хрустальные туфли', emoji: '👠' },
    { id: 'pink_heels', name: 'Розовые шпильки', emoji: '👡' },
    { id: 'glitter_boots', name: 'Сапожки Энчантикс', emoji: '👢' }
  ],
  hair: [
    { id: 'bloom_red', name: 'Локоны Блум', emoji: '🧡' },
    { id: 'stella_gold', name: 'Золото Стеллы', emoji: '💛' }
  ],
  wings: [
    { id: 'enchantix_wings', name: 'Крылья Энчантикс', emoji: '🧚‍♀️' },
    { id: 'sun_wings', name: 'Крылья Сияния', emoji: '☀️' }
  ],
  tops: [
    { id: 'bloom_top', name: 'Бирюзовый топ', emoji: '🎽' },
    { id: 'stella_top', name: 'Оранжевое сияние', emoji: '👚' }
  ],
  skirts: [
    { id: 'bloom_pants', name: 'Брюки клеш', emoji: '👖' },
    { id: 'stella_skirt', name: 'Юбочка с воланами', emoji: '👗' }
  ]
};

let activeCat = 'bags';

function openFashionLevel() {
  document.getElementById('screen-salon').classList.remove('hidden');
  document.getElementById('hud-3d').classList.add('hidden');
  document.getElementById('screen-map').classList.add('hidden');

  renderSalonCats();
  renderSalonItems(activeCat);
  const preview = document.getElementById('salon-fairy-preview');
  if (preview && window.WINX_ASSETS) {
    preview.innerHTML = WINX_ASSETS.characters.stella;
  }
}

function renderSalonCats() {
  document.querySelectorAll('.circle-cat-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.circle-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCat = btn.dataset.cat;
      renderSalonItems(activeCat);
    };
  });
}

function renderSalonItems(cat) {
  const grid = document.getElementById('wardrobe-items-grid');
  grid.innerHTML = '';
  const items = SALON_ITEMS[cat] || [];

  items.forEach(it => {
    const card = document.createElement('div');
    const isEq = campaignData.equipped[cat] === it.id;
    card.className = `wardrobe-item-card ${isEq ? 'equipped' : ''}`;
    card.innerHTML = `
      <div class="witem-emoji-art">${it.emoji}</div>
      <b>${it.name}</b>
      <small>${isEq ? '✓ Выбрано' : 'Надеть'}</small>
    `;

    card.onclick = () => {
      campaignData.equipped[cat] = it.id;
      saveCampaign();
      if (window.magicAudio) window.magicAudio.playSparkle();
      renderSalonItems(cat);
    };

    grid.appendChild(card);
  });
}

function showFinalLetterModal() {
  document.getElementById('modal-final-letter').classList.remove('hidden');
  if (window.magicAudio) window.magicAudio.playEnchantixFanfare();
}

// Запуск при старте
window.addEventListener('DOMContentLoaded', () => {
  initThreeEngine();
});
