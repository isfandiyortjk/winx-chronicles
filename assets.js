// Winx: Хроники Алфеи — Библиотека аутентичной мультяшной графики и фонов в стиле Winx Club
// Все персонажи и фоны выполнены в высоком разрешении (векторный SVG), передающем классический стиль мультсериала:
// вытянутые пропорции, фирменные глаза с ресницами, пышные многослойные волосы и сияющие витражные крылья.

const WINX_ASSETS = {
  // ФОНЫ ЛОКАЦИЙ
  backgrounds: {
    // 1. Замок Алфея на закате (розовые шпили, парящие башни, волшебные облака)
    alfeaSunset: `
      <svg viewBox="0 0 500 700" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#4a148c"/>
            <stop offset="35%" stop-color="#880e4f"/>
            <stop offset="70%" stop-color="#ff4081"/>
            <stop offset="100%" stop-color="#ffb74d"/>
          </linearGradient>
          <radialGradient id="sunGlow" cx="0.5" cy="0.6" r="0.5">
            <stop offset="0%" stop-color="#fff9c4" stop-opacity="0.9"/>
            <stop offset="50%" stop-color="#ffd54f" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#ff4081" stop-opacity="0"/>
          </radialGradient>
          <filter id="castleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>
        <!-- Небо и сияние заката -->
        <rect width="500" height="700" fill="url(#skyGrad)"/>
        <circle cx="250" cy="420" r="160" fill="url(#sunGlow)"/>
        
        <!-- Силуэты парящих островов -->
        <path d="M -20,380 Q 80,350 140,390 Q 90,440 -20,410 Z" fill="#311b92" opacity="0.6"/>
        <path d="M 360,340 Q 440,320 520,360 Q 480,410 380,380 Z" fill="#311b92" opacity="0.6"/>
        
        <!-- Главный замок Алфея -->
        <g filter="url(#castleGlow)">
          <!-- Центральная цитадель -->
          <path d="M 210,340 L 290,340 L 280,520 L 220,520 Z" fill="#ffd1dc" stroke="#ad1457" stroke-width="2"/>
          <path d="M 210,340 Q 250,220 290,340 Z" fill="#ff4081" stroke="#880e4f" stroke-width="2"/>
          <circle cx="250" cy="270" r="12" fill="#ffd700" stroke="#fff" stroke-width="2"/>
          
          <!-- Левая башня со шпилем -->
          <path d="M 140,380 L 190,380 L 185,550 L 145,550 Z" fill="#f8bbd0" stroke="#ad1457" stroke-width="2"/>
          <path d="M 135,380 L 165,260 L 195,380 Z" fill="#e91e63" stroke="#880e4f" stroke-width="2"/>
          <path d="M 165,260 L 165,230" stroke="#ffd700" stroke-width="3"/>
          <polygon points="165,230 155,240 165,245" fill="#ffd700"/>

          <!-- Правая башня со шпилем -->
          <path d="M 310,380 L 360,380 L 355,550 L 315,550 Z" fill="#f8bbd0" stroke="#ad1457" stroke-width="2"/>
          <path d="M 305,380 L 335,260 L 365,380 Z" fill="#e91e63" stroke="#880e4f" stroke-width="2"/>
          <path d="M 335,260 L 335,230" stroke="#ffd700" stroke-width="3"/>
          <polygon points="335,230 325,240 335,245" fill="#ffd700"/>

          <!-- Арочный мост и парадные ворота -->
          <path d="M 120,520 Q 250,470 380,520 L 420,700 L 80,700 Z" fill="#fce4ec" stroke="#ad1457" stroke-width="2"/>
          <path d="M 220,580 Q 250,540 280,580 L 280,680 L 220,680 Z" fill="#880e4f"/>
        </g>

        <!-- Розовые сакуровые облака у подножия -->
        <path d="M -30,620 Q 60,570 160,610 Q 260,560 370,600 Q 460,570 530,620 L 530,700 L -30,700 Z" fill="#f48fb1" opacity="0.8"/>
      </svg>
    `,

    // 2. Лаборатория Зелий Палладиума
    palladiumLab: `
      <svg viewBox="0 0 500 700" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="labBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1b5e20"/>
            <stop offset="60%" stop-color="#0a2a0a"/>
            <stop offset="100%" stop-color="#051405"/>
          </linearGradient>
        </defs>
        <rect width="500" height="700" fill="url(#labBg)"/>
        <!-- Волшебные полки с книгами и светящимися колбами -->
        <rect x="20" y="80" width="460" height="15" fill="#4e342e" rx="4"/>
        <rect x="20" y="200" width="460" height="15" fill="#4e342e" rx="4"/>
        <!-- Колбы -->
        <path d="M 60,70 L 60,55 L 75,55 L 75,70 Q 90,80 75,90 Q 60,80 60,70 Z" fill="#00e5ff" opacity="0.85"/>
        <path d="M 120,68 L 120,50 L 135,50 L 135,68 Q 150,78 135,88 Q 120,78 120,68 Z" fill="#ff4081" opacity="0.85"/>
        <path d="M 380,65 Q 400,45 420,65 L 420,80 L 380,80 Z" fill="#ffd700" opacity="0.85"/>
      </svg>
    `,

    // 3. Замерзшее озеро Роккалуче (Арена Битвы с Айси)
    lakeRoccaluce: `
      <svg viewBox="0 0 500 700" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="iceSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0d47a1"/>
            <stop offset="40%" stop-color="#1565c0"/>
            <stop offset="80%" stop-color="#00bcd4"/>
            <stop offset="100%" stop-color="#e0f7fa"/>
          </linearGradient>
        </defs>
        <rect width="500" height="700" fill="url(#iceSky)"/>
        <!-- Полярное сияние -->
        <path d="M -20,120 Q 150,50 300,140 Q 420,70 520,110 L 520,240 Q 380,180 240,230 Q 100,170 -20,220 Z" fill="#80deea" opacity="0.35"/>
        <!-- Ледяные пики -->
        <polygon points="40,480 110,260 170,480" fill="#b2ebf2" stroke="#00acc1" stroke-width="2"/>
        <polygon points="330,500 400,280 470,500" fill="#b2ebf2" stroke="#00acc1" stroke-width="2"/>
        <polygon points="180,510 250,330 320,510" fill="#e0f7fa" stroke="#00acc1" stroke-width="2"/>
        <!-- Ледяное плато -->
        <rect x="0" y="470" width="500" height="230" fill="#e0f7fa" opacity="0.95"/>
      </svg>
    `,

    // 4. Золотой Бал в Красном Фонтане
    ballroomRedFountain: `
      <svg viewBox="0 0 500 700" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ballSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1a102f"/>
            <stop offset="50%" stop-color="#4a154b"/>
            <stop offset="100%" stop-color="#1f0a24"/>
          </linearGradient>
        </defs>
        <rect width="500" height="700" fill="url(#ballSky)"/>
        <!-- Золотые витражные арки -->
        <path d="M 40,700 L 40,250 Q 150,140 260,250 L 260,700 Z" fill="none" stroke="#ffd700" stroke-width="4" opacity="0.6"/>
        <path d="M 240,700 L 240,250 Q 350,140 460,250 L 460,700 Z" fill="none" stroke="#ffd700" stroke-width="4" opacity="0.6"/>
        <!-- Люстра -->
        <circle cx="250" cy="120" r="35" fill="#fff9c4" opacity="0.9"/>
        <path d="M 250,40 L 250,90 M 215,120 L 285,120 M 225,145 L 275,145" stroke="#ffd700" stroke-width="3"/>
      </svg>
    `
  },

  // МУЛЬТЯШНЫЕ ИЛЛЮСТРАЦИИ ГЛАВНЫХ ГЕРОЕВ (СТИЛЬ WINX CLUB)
  characters: {
    // 1. БЛУМ (Огненные локоны, сияющие голубые глаза, топ Энчантикс и витражные крылья)
    bloom: `
      <svg viewBox="0 0 300 380" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Градиент фирменных волос Блум -->
          <linearGradient id="bloomHair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ff7043"/>
            <stop offset="40%" stop-color="#ff3d00"/>
            <stop offset="100%" stop-color="#d50000"/>
          </linearGradient>
          <!-- Градиент крыльев Огня Дракона -->
          <linearGradient id="bloomWings" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.9"/>
            <stop offset="50%" stop-color="#ff4081" stop-opacity="0.85"/>
            <stop offset="100%" stop-color="#ffd700" stop-opacity="0.8"/>
          </linearGradient>
          <filter id="winxGlow">
            <feGaussianBlur stdDeviation="3" result="glow"/>
            <feComposite in="SourceGraphic" in2="glow" operator="over"/>
          </filter>
        </defs>

        <!-- КРЫЛЬЯ ЭНЧАНТИКС БЛУМ (Широкие, витражные, переливающиеся) -->
        <g filter="url(#winxGlow)">
          <!-- Левое крыло -->
          <path d="M 140,150 Q 80,60 15,40 Q -15,90 20,180 Q 70,240 135,190 Z" fill="url(#bloomWings)" stroke="#ffffff" stroke-width="2.5"/>
          <path d="M 20,180 Q -10,230 35,280 Q 90,270 135,210 Z" fill="url(#bloomWings)" stroke="#ffffff" stroke-width="2"/>
          <circle cx="18" cy="42" r="5" fill="#ffd700"/>
          <circle cx="34" cy="278" r="4" fill="#ffd700"/>
          <!-- Правое крыло -->
          <path d="M 160,150 Q 220,60 285,40 Q 315,90 280,180 Q 230,240 165,190 Z" fill="url(#bloomWings)" stroke="#ffffff" stroke-width="2.5"/>
          <path d="M 280,180 Q 310,230 265,280 Q 210,270 165,210 Z" fill="url(#bloomWings)" stroke="#ffffff" stroke-width="2"/>
          <circle cx="282" cy="42" r="5" fill="#ffd700"/>
          <circle cx="266" cy="278" r="4" fill="#ffd700"/>
        </g>

        <!-- ПЫШНЫЕ ЗАДНИЕ ВОЛОСЫ БЛУМ -->
        <path d="M 100,120 Q 40,180 30,300 Q 80,340 110,240 Q 150,330 190,240 Q 220,340 270,300 Q 260,180 200,120 Z" fill="url(#bloomHair)"/>

        <!-- ТЕЛО И ШЕЯ (Изящные модельные пропорции Winx) -->
        <path d="M 142,130 L 142,165 L 130,175 L 130,280 L 170,280 L 170,175 L 158,165 L 158,130 Z" fill="#ffe0b2"/>
        <!-- Голубой топ Энчантикс с розовыми лентами -->
        <path d="M 130,175 Q 150,195 170,175 L 174,225 Q 150,240 126,225 Z" fill="#00e5ff" stroke="#ff4081" stroke-width="2"/>
        <path d="M 140,178 L 160,178 L 150,225 Z" fill="#ff4081"/>

        <!-- ФИРМЕННОЕ ЛИЦО WINX (Сердечко, точёный подбородок) -->
        <path d="M 120,95 Q 115,130 150,145 Q 185,130 180,95 Q 180,65 150,65 Q 120,65 120,95 Z" fill="#ffe0b2"/>
        <ellipse cx="132" cy="118" rx="6" ry="3.5" fill="#ff8a80" opacity="0.6"/>
        <ellipse cx="168" cy="118" rx="6" ry="3.5" fill="#ff8a80" opacity="0.6"/>

        <!-- МУЛЬТЯШНЫЕ ГЛАЗА БЛУМ (Большие, бирюзовые, стрелки с длинными ресницами) -->
        <!-- Левый глаз -->
        <path d="M 125,104 Q 135,93 146,104" fill="none" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
        <path d="M 126,104 Q 135,115 145,105 L 145,103 Q 135,94 126,103 Z" fill="#ffffff"/>
        <ellipse cx="137" cy="104" rx="5.5" ry="6.5" fill="#00bcd4"/>
        <ellipse cx="137" cy="105" rx="3.5" ry="4.5" fill="#006064"/>
        <circle cx="135" cy="101" r="2.2" fill="#ffffff"/>
        <circle cx="139" cy="107" r="1.2" fill="#ffffff"/>
        <!-- Стрелка -->
        <path d="M 144,101 L 149,97" stroke="#212121" stroke-width="2" stroke-linecap="round"/>

        <!-- Правый глаз -->
        <path d="M 154,104 Q 165,93 175,104" fill="none" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
        <path d="M 155,104 Q 165,115 174,105 L 174,103 Q 165,94 155,103 Z" fill="#ffffff"/>
        <ellipse cx="163" cy="104" rx="5.5" ry="6.5" fill="#00bcd4"/>
        <ellipse cx="163" cy="105" rx="3.5" ry="4.5" fill="#006064"/>
        <circle cx="161" cy="101" r="2.2" fill="#ffffff"/>
        <circle cx="165" cy="107" r="1.2" fill="#ffffff"/>
        <!-- Стрелка -->
        <path d="M 173,101 L 178,97" stroke="#212121" stroke-width="2" stroke-linecap="round"/>

        <!-- Маленький носик и кокетливые губки -->
        <path d="M 148,116 L 150,119 L 152,118" fill="none" stroke="#d7ccc8" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M 142,128 Q 150,135 158,128" fill="none" stroke="#d81b60" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M 144,129 Q 150,132 156,129" fill="#ff4081"/>

        <!-- ФИРМЕННАЯ ЧЁЛКА И ПРЯДИ БЛУМ СВЕРХУ -->
        <path d="M 118,80 Q 90,110 95,190 Q 110,180 115,130 Z" fill="url(#bloomHair)"/>
        <path d="M 182,80 Q 210,110 205,190 Q 190,180 185,130 Z" fill="url(#bloomHair)"/>
        <!-- Центральные лепестки волос -->
        <path d="M 150,55 Q 120,65 125,95 Q 140,85 150,92 Q 160,85 175,95 Q 180,65 150,55 Z" fill="url(#bloomHair)"/>
        <path d="M 146,70 Q 135,100 130,112 Q 140,95 146,70 Z" fill="#ffab91"/>

        <!-- ДИАДЕМА ЭНЧАНТИКС С СЕРДЕЧКОМ -->
        <path d="M 136,65 Q 150,50 164,65 L 160,68 Q 150,57 140,68 Z" fill="#ffd700"/>
        <circle cx="150" cy="58" r="4.5" fill="#00e5ff" stroke="#ffffff" stroke-width="1"/>
      </svg>
    `,

    // 2. СТЕЛЛА (Золотые локоны, лучистые янтарные глаза, солнце и сияние)
    stella: `
      <svg viewBox="0 0 300 380" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="stellaHair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fff59d"/>
            <stop offset="40%" stop-color="#fdd835"/>
            <stop offset="100%" stop-color="#f57f17"/>
          </linearGradient>
          <linearGradient id="stellaWings" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fff59d" stop-opacity="0.95"/>
            <stop offset="50%" stop-color="#ffb74d" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#ff4081" stop-opacity="0.8"/>
          </linearGradient>
        </defs>
        <!-- КРЫЛЬЯ СОЛНЦА -->
        <g>
          <path d="M 140,150 Q 70,40 10,60 Q -10,130 40,200 Q 80,240 135,190 Z" fill="url(#stellaWings)" stroke="#ffd700" stroke-width="2.5"/>
          <path d="M 160,150 Q 230,40 290,60 Q 310,130 260,200 Q 220,240 165,190 Z" fill="url(#stellaWings)" stroke="#ffd700" stroke-width="2.5"/>
        </g>
        <!-- ДЛИННЫЕ ЗОЛОТЫЕ ХВОСТЫ СТЕЛЛЫ -->
        <path d="M 90,90 Q 20,150 25,320 Q 55,330 65,220 Q 85,150 115,120 Z" fill="url(#stellaHair)"/>
        <path d="M 210,90 Q 280,150 275,320 Q 245,330 235,220 Q 215,150 185,120 Z" fill="url(#stellaHair)"/>
        <!-- ТЕЛО И ОРАНЖЕВЫЙ ТОП СОЛНЦА -->
        <path d="M 142,130 L 142,165 L 130,175 L 130,280 L 170,280 L 170,175 L 158,165 L 158,130 Z" fill="#ffe0b2"/>
        <path d="M 130,175 Q 150,195 170,175 L 174,225 Q 150,240 126,225 Z" fill="#ff9800" stroke="#ffd700" stroke-width="2"/>
        <!-- ЛИЦО СТЕЛЛЫ -->
        <path d="M 120,95 Q 115,130 150,145 Q 185,130 180,95 Q 180,65 150,65 Q 120,65 120,95 Z" fill="#ffe0b2"/>
        <ellipse cx="132" cy="118" rx="6" ry="3.5" fill="#ffab91" opacity="0.6"/>
        <ellipse cx="168" cy="118" rx="6" ry="3.5" fill="#ffab91" opacity="0.6"/>
        <!-- ЯНТАРНЫЕ ГЛАЗА -->
        <path d="M 125,104 Q 135,93 146,104" fill="none" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="137" cy="104" rx="5.5" ry="6.5" fill="#ffb300"/>
        <circle cx="135" cy="101" r="2.2" fill="#ffffff"/>
        <path d="M 154,104 Q 165,93 175,104" fill="none" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="163" cy="104" rx="5.5" ry="6.5" fill="#ffb300"/>
        <circle cx="161" cy="101" r="2.2" fill="#ffffff"/>
        <!-- ГУБКИ -->
        <path d="M 142,128 Q 150,135 158,128" fill="none" stroke="#e91e63" stroke-width="2.5" stroke-linecap="round"/>
        <!-- ЧЕЛКА И КОРОНА СОЛНЦА -->
        <path d="M 115,75 Q 150,60 185,75 Q 165,95 150,88 Q 135,95 115,75 Z" fill="url(#stellaHair)"/>
        <polygon points="150,45 143,58 157,58" fill="#ffd700"/>
      </svg>
    `,

    // 3. ФЛОРА (Каштановые локоны, медовые пряди, цветочный наряд, добрые изумрудные глаза)
    flora: `
      <svg viewBox="0 0 300 380" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="floraHair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#8d6e63"/>
            <stop offset="50%" stop-color="#5d4037"/>
            <stop offset="100%" stop-color="#3e2723"/>
          </linearGradient>
          <linearGradient id="floraWings" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#b9f6ca" stop-opacity="0.95"/>
            <stop offset="60%" stop-color="#f48fb1" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#ff80ab" stop-opacity="0.85"/>
          </linearGradient>
        </defs>
        <g>
          <!-- КРЫЛЬЯ-ЛЕПЕСТКИ ЦВЕТОВ -->
          <path d="M 140,150 Q 60,60 15,90 Q 5,160 50,220 Q 95,240 135,190 Z" fill="url(#floraWings)" stroke="#81c784" stroke-width="2.5"/>
          <path d="M 160,150 Q 240,60 285,90 Q 295,160 250,220 Q 205,240 165,190 Z" fill="url(#floraWings)" stroke="#81c784" stroke-width="2.5"/>
        </g>
        <!-- ВОЛОСЫ ФЛОРЫ -->
        <path d="M 90,110 Q 30,170 40,320 Q 80,330 90,220 Q 150,330 210,220 Q 220,330 260,320 Q 270,170 210,110 Z" fill="url(#floraHair)"/>
        <!-- ТЕЛО И РОЗОВО-ЗЕЛЕНЫЙ ТОП -->
        <path d="M 142,130 L 142,165 L 130,175 L 130,280 L 170,280 L 170,175 L 158,165 L 158,130 Z" fill="#d7ccc8"/>
        <path d="M 130,175 Q 150,195 170,175 L 174,225 Q 150,240 126,225 Z" fill="#f06292" stroke="#81c784" stroke-width="2"/>
        <!-- ЛИЦО -->
        <path d="M 120,95 Q 115,130 150,145 Q 185,130 180,95 Q 180,65 150,65 Q 120,65 120,95 Z" fill="#d7ccc8"/>
        <!-- ИЗУМРУДНЫЕ ГЛАЗА -->
        <ellipse cx="137" cy="104" rx="5.5" ry="6.5" fill="#43a047"/>
        <circle cx="135" cy="101" r="2.2" fill="#ffffff"/>
        <ellipse cx="163" cy="104" rx="5.5" ry="6.5" fill="#43a047"/>
        <circle cx="161" cy="101" r="2.2" fill="#ffffff"/>
        <path d="M 142,128 Q 150,135 158,128" fill="none" stroke="#ad1457" stroke-width="2.5" stroke-linecap="round"/>
        <!-- СВЕТЛЫЕ ПРЯДИ У ЛИЦА -->
        <path d="M 120,80 Q 110,120 115,160 L 122,150 Q 125,110 130,85 Z" fill="#ffe082"/>
        <path d="M 180,80 Q 190,120 185,160 L 178,150 Q 175,110 170,85 Z" fill="#ffe082"/>
      </svg>
    `,

    // 4. СПЕЦИАЛИСТ СКАЙ / ТВОЙ СПЕЦИАЛИСТ (Красавец-воин: синяя броня, плащ, мужественный мультяшный взгляд)
    specialist: `
      <svg viewBox="0 0 300 380" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="armorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#42a5f5"/>
            <stop offset="50%" stop-color="#1e88e5"/>
            <stop offset="100%" stop-color="#0d47a1"/>
          </linearGradient>
          <linearGradient id="skyHair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ffe082"/>
            <stop offset="50%" stop-color="#ffd54f"/>
            <stop offset="100%" stop-color="#ffb300"/>
          </linearGradient>
        </defs>
        <!-- СИНИЙ ПЛАЩ КРАСНОГО ФОНТАНА -->
        <path d="M 90,160 L 70,350 L 230,350 L 210,160 Z" fill="#1565c0" stroke="#0d47a1" stroke-width="2"/>
        <!-- ТЕЛО И СТАЛЬНЫЕ НАПЛЕЧНИКИ -->
        <path d="M 110,150 L 190,150 L 180,300 L 120,300 Z" fill="url(#armorGrad)" stroke="#ffffff" stroke-width="2"/>
        <polygon points="90,150 120,135 125,175 85,170" fill="#90caf9" stroke="#0d47a1" stroke-width="2"/>
        <polygon points="210,150 180,135 175,175 215,170" fill="#90caf9" stroke="#0d47a1" stroke-width="2"/>
        <!-- ЗОЛОТАЯ БРОШЬ СЕРДЦА -->
        <polygon points="150,155 142,165 150,175 158,165" fill="#ffd700"/>

        <!-- ШЕЯ И МУЖЕСТВЕННОЕ ЛИЦО СПЕЦИАЛИСТА -->
        <path d="M 138,125 L 138,155 L 162,155 L 162,125 Z" fill="#ffe0b2"/>
        <path d="M 120,85 Q 115,125 150,140 Q 185,125 180,85 Q 180,55 150,55 Q 120,55 120,85 Z" fill="#ffe0b2"/>

        <!-- ВЫРАЗИТЕЛЬНЫЕ СИНИЕ ГЛАЗА СПЕЦИАЛИСТА -->
        <path d="M 125,92 L 142,92" stroke="#37474f" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="134" cy="98" rx="4.5" ry="5.5" fill="#1976d2"/>
        <circle cx="132" cy="96" r="1.8" fill="#ffffff"/>

        <path d="M 158,92 L 175,92" stroke="#37474f" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="166" cy="98" rx="4.5" ry="5.5" fill="#1976d2"/>
        <circle cx="164" cy="96" r="1.8" fill="#ffffff"/>

        <!-- МУЖЕСТВЕННЫЙ НОС И УВЕРЕННАЯ ТЁПЛАЯ УЛЫБКА -->
        <path d="M 148,102 L 152,112 L 147,114" fill="none" stroke="#bcaaa4" stroke-width="2"/>
        <path d="M 140,124 Q 150,130 160,124" fill="none" stroke="#8d6e63" stroke-width="2.5" stroke-linecap="round"/>

        <!-- СТИЛЬНАЯ ПРИЧЁСКА СПЕЦИАЛИСТА С ПРЯДЯМИ НАБОК -->
        <path d="M 115,75 Q 95,95 105,120 Q 120,110 120,85 Z" fill="url(#skyHair)"/>
        <path d="M 185,75 Q 205,95 195,120 Q 180,110 180,85 Z" fill="url(#skyHair)"/>
        <path d="M 110,65 Q 150,35 190,65 Q 170,50 150,52 Q 130,50 110,65 Z" fill="url(#skyHair)"/>
        <path d="M 125,65 Q 155,75 165,95 Q 150,75 125,65 Z" fill="#fff59d"/>
      </svg>
    `,

    // 5. ВЕДЬМА АЙСИ (Холодная королева льда: высокий снежный хвост, ледяная диадема, яростные глаза)
    icy: `
      <svg viewBox="0 0 300 380" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="icyHair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="60%" stop-color="#e0f7fa"/>
            <stop offset="100%" stop-color="#80deea"/>
          </linearGradient>
          <linearGradient id="icyDress" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1a237e"/>
            <stop offset="60%" stop-color="#0d47a1"/>
            <stop offset="100%" stop-color="#311b92"/>
          </linearGradient>
        </defs>
        <!-- ЛЕДЯНОЙ ШЛЕЙФ И ПЛАТЬЕ -->
        <path d="M 120,170 L 100,350 L 200,350 L 180,170 Z" fill="url(#icyDress)" stroke="#00e5ff" stroke-width="2"/>
        <path d="M 125,175 L 150,210 L 175,175 Z" fill="#00e5ff"/>
        <!-- ОСТРЫЕ ЛЕДЯНЫЕ НАПЛЕЧНИКИ -->
        <polygon points="110,165 70,135 115,145" fill="#80deea" stroke="#00e5ff" stroke-width="2"/>
        <polygon points="190,165 230,135 185,145" fill="#80deea" stroke="#00e5ff" stroke-width="2"/>

        <!-- ШЕЯ С ЛЕДЯНЫМ ЧОКЕРОМ И ЛИЦО -->
        <path d="M 140,125 L 140,155 L 160,155 L 160,125 Z" fill="#f9fbe7"/>
        <rect x="138" y="140" width="24" height="6" fill="#00e5ff"/>
        <path d="M 120,85 Q 115,125 150,140 Q 185,125 180,85 Q 180,55 150,55 Q 120,55 120,85 Z" fill="#f9fbe7"/>

        <!-- ЗЛОВЕЩИЕ КРАСИВЫЕ ГЛАЗА АЙСИ (Синие стрелки, холодный взгляд) -->
        <path d="M 124,96 L 144,92" stroke="#1a237e" stroke-width="3.5" stroke-linecap="round"/>
        <ellipse cx="136" cy="98" rx="5" ry="6" fill="#00e5ff"/>
        <circle cx="134" cy="96" r="1.8" fill="#ffffff"/>

        <path d="M 156,92 L 176,96" stroke="#1a237e" stroke-width="3.5" stroke-linecap="round"/>
        <ellipse cx="164" cy="98" rx="5" ry="6" fill="#00e5ff"/>
        <circle cx="162" cy="96" r="1.8" fill="#ffffff"/>

        <!-- НАСМЕШЛИВАЯ УЛЫБКА ТРИКС -->
        <path d="M 142,122 Q 150,127 158,120" fill="none" stroke="#311b92" stroke-width="2.5" stroke-linecap="round"/>

        <!-- ВЫСОКИЙ ЛЕДЯНОЙ ХВОСТ АЙСИ -->
        <path d="M 150,55 Q 170,-20 220,-10 Q 250,50 180,65 Z" fill="url(#icyHair)" stroke="#80deea" stroke-width="2"/>
        <!-- ЛЕДЯНАЯ ДИАДЕМА С ОСТРЫМИ КРИСТАЛЛАМИ -->
        <polygon points="135,65 142,40 150,55 158,35 165,65" fill="#00e5ff" stroke="#ffffff" stroke-width="1.5"/>
      </svg>
    `,

    // 6. ДИРЕКТРИСА ФАРАГОНДА (Мудрая фея в королевском фиолетовом одеянии и очках)
    faragonda: `
      <svg viewBox="0 0 300 380" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="faraDress" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#6a1b9a"/>
            <stop offset="60%" stop-color="#4a148c"/>
            <stop offset="100%" stop-color="#311b92"/>
          </linearGradient>
        </defs>
        <!-- КОРОЛЕВСКОЕ ПЛАТЬЕ -->
        <path d="M 115,160 L 90,350 L 210,350 L 185,160 Z" fill="url(#faraDress)" stroke="#ffd700" stroke-width="2"/>
        <path d="M 125,160 Q 150,185 175,160 L 170,220 Q 150,230 130,220 Z" fill="#ffd700"/>
        <!-- ЛИЦО И СЕРЕБРЯНЫЕ КУДРИ -->
        <path d="M 120,95 Q 115,130 150,145 Q 185,130 180,95 Q 180,65 150,65 Q 120,65 120,95 Z" fill="#ffe0b2"/>
        <!-- ОЧКИ ДИРЕКТРИСЫ -->
        <circle cx="135" cy="102" r="9" fill="none" stroke="#ffd700" stroke-width="2"/>
        <circle cx="165" cy="102" r="9" fill="none" stroke="#ffd700" stroke-width="2"/>
        <line x1="144" y1="102" x2="156" y2="102" stroke="#ffd700" stroke-width="2"/>
        <!-- ГЛАЗА -->
        <ellipse cx="135" cy="102" rx="4" ry="5" fill="#5c6bc0"/>
        <circle cx="134" cy="100" r="1.5" fill="#ffffff"/>
        <ellipse cx="165" cy="102" rx="4" ry="5" fill="#5c6bc0"/>
        <circle cx="164" cy="100" r="1.5" fill="#ffffff"/>
        <!-- СЕРЕБРЯНЫЕ ВОЛОСЫ -->
        <path d="M 110,90 Q 80,110 90,160 Q 115,150 115,120 Z" fill="#cfd8dc"/>
        <path d="M 190,90 Q 220,110 210,160 Q 185,150 185,120 Z" fill="#cfd8dc"/>
        <path d="M 110,75 Q 150,40 190,75 Q 170,60 150,62 Q 130,60 110,75 Z" fill="#eceff1"/>
      </svg>
    `,

    // 7. ПРОФЕССОР ПАЛЛАДИУМ (Эльф-учитель зельеварения: длинные эльфийские уши, зеленый камзол)
    palladium: `
      <svg viewBox="0 0 300 380" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="palHair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#cfd8dc"/>
            <stop offset="100%" stop-color="#90a4ae"/>
          </linearGradient>
        </defs>
        <!-- ЗЕЛЕНЫЙ КАМЗОЛ АЛФЕИ -->
        <path d="M 115,160 L 95,350 L 205,350 L 185,160 Z" fill="#2e7d32" stroke="#ffd700" stroke-width="2"/>
        <rect x="145" y="160" width="10" height="190" fill="#ffd700"/>
        <!-- ЛИЦО ЭЛЬФА -->
        <path d="M 125,95 Q 120,130 150,145 Q 180,130 175,95 Q 175,65 150,65 Q 125,65 125,95 Z" fill="#ffe0b2"/>
        <!-- ДЛИННЫЕ ЭЛЬФИЙСКИЕ УШИ -->
        <polygon points="120,95 75,70 120,110" fill="#ffe0b2" stroke="#bcaaa4" stroke-width="1.5"/>
        <polygon points="180,95 225,70 180,110" fill="#ffe0b2" stroke="#bcaaa4" stroke-width="1.5"/>
        <!-- СЕРЕБРЯНЫЕ ВОЛОСЫ -->
        <path d="M 120,70 Q 150,45 180,70 Q 170,85 150,80 Q 130,85 120,70 Z" fill="url(#palHair)"/>
        <!-- ГЛАЗА -->
        <ellipse cx="138" cy="102" rx="4.5" ry="5.5" fill="#43a047"/>
        <circle cx="136" cy="100" r="1.8" fill="#ffffff"/>
        <ellipse cx="162" cy="102" rx="4.5" ry="5.5" fill="#43a047"/>
        <circle cx="160" cy="100" r="1.8" fill="#ffffff"/>
      </svg>
    `
  },

  // ГЕНЕРАТОР КАСТОМНОЙ ФЕИ ИГРОКА (СТИЛЬ WINX)
  // Собирает из векторных слоев аутентичную фею с выбранными крыльями, прической и нарядом!
  renderPlayerFairySvg(options) {
    const wingColor = options.wingColor || '#ff4081';
    const hairColor = options.hairColor || '#ff3d00';
    const outfitColor = options.outfitColor || '#00e5ff';

    return `
      <svg viewBox="0 0 300 380" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pWings" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
            <stop offset="45%" stop-color="${wingColor}" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#ffd700" stop-opacity="0.85"/>
          </linearGradient>
          <filter id="pGlow">
            <feGaussianBlur stdDeviation="3.5" result="glow"/>
            <feComposite in="SourceGraphic" in2="glow" operator="over"/>
          </filter>
        </defs>

        <!-- СИЯЮЩИЕ ВИТРАЖНЫЕ КРЫЛЬЯ -->
        <g filter="url(#pGlow)">
          <path d="M 140,150 Q 75,50 10,40 Q -20,100 20,185 Q 70,245 135,190 Z" fill="url(#pWings)" stroke="#ffffff" stroke-width="2.5"/>
          <path d="M 20,185 Q -10,235 35,285 Q 90,270 135,210 Z" fill="url(#pWings)" stroke="#ffffff" stroke-width="2"/>
          <circle cx="12" cy="40" r="5" fill="#ffd700"/>
          <circle cx="34" cy="285" r="4" fill="#ffd700"/>

          <path d="M 160,150 Q 225,50 290,40 Q 320,100 280,185 Q 230,245 165,190 Z" fill="url(#pWings)" stroke="#ffffff" stroke-width="2.5"/>
          <path d="M 280,185 Q 310,235 265,285 Q 210,270 165,210 Z" fill="url(#pWings)" stroke="#ffffff" stroke-width="2"/>
          <circle cx="288" cy="40" r="5" fill="#ffd700"/>
          <circle cx="266" cy="285" r="4" fill="#ffd700"/>
        </g>

        <!-- ЗАДНИЕ ВОЛОСЫ -->
        <path d="M 100,110 Q 35,170 30,300 Q 80,340 110,230 Q 150,330 190,230 Q 220,340 270,300 Q 265,170 200,110 Z" fill="${hairColor}"/>

        <!-- ТЕЛО WINX И НАРЯД -->
        <path d="M 142,130 L 142,165 L 130,175 L 130,280 L 170,280 L 170,175 L 158,165 L 158,130 Z" fill="#ffe0b2"/>
        <path d="M 130,175 Q 150,195 170,175 L 174,235 Q 150,250 126,235 Z" fill="${outfitColor}" stroke="#ffffff" stroke-width="2"/>
        <path d="M 126,235 Q 150,270 174,235 L 180,280 Q 150,295 120,280 Z" fill="${outfitColor}" opacity="0.9"/>
        <!-- ЗОЛОТОЙ ПОЯС -->
        <rect x="128" y="230" width="44" height="5" fill="#ffd700"/>

        <!-- ЛИЦО С ОГРОМНЫМИ АНИМЕ ГЛАЗАМИ WINX -->
        <path d="M 120,95 Q 115,130 150,145 Q 185,130 180,95 Q 180,65 150,65 Q 120,65 120,95 Z" fill="#ffe0b2"/>
        <ellipse cx="132" cy="118" rx="6" ry="3.5" fill="#ff8a80" opacity="0.6"/>
        <ellipse cx="168" cy="118" rx="6" ry="3.5" fill="#ff8a80" opacity="0.6"/>

        <!-- ГЛАЗА -->
        <path d="M 125,104 Q 135,93 146,104" fill="none" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="137" cy="104" rx="5.5" ry="6.5" fill="#00e5ff"/>
        <circle cx="135" cy="101" r="2.2" fill="#ffffff"/>
        <path d="M 144,101 L 149,97" stroke="#212121" stroke-width="2" stroke-linecap="round"/>

        <path d="M 154,104 Q 165,93 175,104" fill="none" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="163" cy="104" rx="5.5" ry="6.5" fill="#00e5ff"/>
        <circle cx="161" cy="101" r="2.2" fill="#ffffff"/>
        <path d="M 173,101 L 178,97" stroke="#212121" stroke-width="2" stroke-linecap="round"/>

        <path d="M 148,116 L 150,119 L 152,118" fill="none" stroke="#d7ccc8" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M 142,128 Q 150,135 158,128" fill="none" stroke="#d81b60" stroke-width="2.5" stroke-linecap="round"/>

        <!-- ПЕРЕДНЯЯ ЧЁЛКА -->
        <path d="M 115,75 Q 150,60 185,75 Q 165,95 150,88 Q 135,95 115,75 Z" fill="${hairColor}"/>
        <!-- ДИАДЕМА С СЕРДЕЧКОМ -->
        <polygon points="150,48 142,60 158,60" fill="#ffd700"/>
        <circle cx="150" cy="56" r="3" fill="#ff4081"/>
      </svg>
    `;
  }
};

window.WINX_ASSETS = WINX_ASSETS;
