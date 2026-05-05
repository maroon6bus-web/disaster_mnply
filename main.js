const BOARD_SPACES = [
    { id: 0, name: 'GO', type: 'go', color: '#fff' },
    { id: 1, name: '鶴橋', type: 'property', price: 60, rent: 2, color: '#8b4513' },
    { id: 2, name: '土地行政', type: 'chest', color: '#fff' },
    { id: 3, name: '新世界', type: 'property', price: 60, rent: 4, color: '#8b4513' },
    { id: 4, name: '所得税', type: 'tax', price: 200, color: '#fff' },
    { id: 5, name: '大阪', type: 'railroad', price: 200, rent: 25, color: '#ccc' },
    { id: 6, name: '天王寺', type: 'property', price: 100, rent: 6, color: '#87ceeb' },
    { id: 7, name: 'チャンス', type: 'chance', color: '#fff' },
    { id: 8, name: '京橋', type: 'property', price: 100, rent: 6, color: '#87ceeb' },
    { id: 9, name: '十三', type: 'property', price: 120, rent: 8, color: '#87ceeb' },
    { id: 10, name: '刑務所', type: 'jail', color: '#fff' },
    { id: 11, name: '難波', type: 'property', price: 140, rent: 10, color: '#ffc0cb' },
    { id: 12, name: '関西電力', type: 'utility', price: 150, rent: 10, color: '#ccc' },
    { id: 13, name: '心斎橋', type: 'property', price: 140, rent: 10, color: '#ffc0cb' },
    { id: 14, name: '道頓堀', type: 'property', price: 160, rent: 12, color: '#ffc0cb' },
    { id: 15, name: '新大阪', type: 'railroad', price: 200, rent: 25, color: '#ccc' },
    { id: 16, name: '堀江', type: 'property', price: 180, rent: 14, color: '#ffa500' },
    { id: 17, name: '土地行政', type: 'chest', color: '#fff' },
    { id: 18, name: 'アメ村', type: 'property', price: 180, rent: 14, color: '#ffa500' },
    { id: 19, name: '南船場', type: 'property', price: 200, rent: 16, color: '#ffa500' },
    { id: 20, name: '駐車場', type: 'parking', color: '#fff' },
    { id: 21, name: '梅田', type: 'property', price: 220, rent: 18, color: '#ff0000' },
    { id: 22, name: 'チャンス', type: 'chance', color: '#fff' },
    { id: 23, name: '中津', type: 'property', price: 220, rent: 18, color: '#ff0000' },
    { id: 24, name: '中崎町', type: 'property', price: 240, rent: 20, color: '#ff0000' },
    { id: 25, name: '南海難波', type: 'railroad', price: 200, rent: 25, color: '#ccc' },
    { id: 26, name: '北新地', type: 'property', price: 260, rent: 22, color: '#ffff00' },
    { id: 27, name: '堂島', type: 'property', price: 260, rent: 22, color: '#ffff00' },
    { id: 28, name: '水道局', type: 'utility', price: 150, rent: 10, color: '#ccc' },
    { id: 29, name: '淀屋橋', type: 'property', price: 280, rent: 24, color: '#ffff00' },
    { id: 30, name: '刑務所へ', type: 'gotojail', color: '#fff' },
    { id: 31, name: '御堂筋', type: 'property', price: 300, rent: 26, color: '#008000' },
    { id: 32, name: '本町', type: 'property', price: 300, rent: 26, color: '#008000' },
    { id: 33, name: '災害', type: 'disaster', color: '#000' },
    { id: 34, name: '中之島', type: 'property', price: 320, rent: 28, color: '#008000' },
    { id: 35, name: 'あべの', type: 'railroad', price: 200, rent: 25, color: '#ccc' },
    { id: 36, name: 'チャンス', type: 'chance', color: '#fff' },
    { id: 37, name: '万博公園', type: 'property', price: 350, rent: 35, color: '#00008b' },
    { id: 38, name: '物品税', type: 'tax', price: 100, color: '#fff' },
    { id: 39, name: '大阪城', type: 'property', price: 400, rent: 50, color: '#00008b' }
];

// 初期価格（基準値）と家の数を保存しておく
BOARD_SPACES.forEach(space => {
    if (space.price !== undefined) {
        space.basePrice = space.price;
        if (space.rent !== undefined) space.rent *= 2; space.baseRent = space.rent;
        if (space.type === 'property') {
            space.houses = 0;
        }
    }
});

const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308'];
let players = [];
let gameEnded = false;
let currentPlayerIndex = 0;
let diceValue = 0;
let doubleCount = 0;
let assetChart;
let landChart, buildingChart;
let roundHistory = {
    labels: [],
    datasets: []
};

// 新機能の状態
const INSURANCE_PRICE = 50;
let activeEvent = null; // { name, text, multiplier, color, duration }
const OSAKA_EVENTS = [
    { name: '天神祭', text: '梅田・北新地エリアの活気が最高潮！賃貸料が3倍に。', color: '#ff0000', multiplier: 3, targetColors: ['#ff0000', '#ffff00'], duration: 3 },
    { name: '万博開催決定', text: '万博公園エリアへの注目度アップ！賃貸料が3倍に。', color: '#00008b', multiplier: 3, targetColors: ['#00008b'], duration: 4 },
    { name: 'くいだおれ大売出し', text: '難波・道頓堀エリアが食通で溢れる！賃貸料が3倍に。', color: '#ffc0cb', multiplier: 3, targetColors: ['#ffc0cb'], duration: 3 },
    { name: 'タイガース優勝', text: '大阪全体がお祭り騒ぎ！すべての土地の賃貸料が1.5倍に。', color: '#eab308', multiplier: 1.5, targetColors: 'all', duration: 2 }
];


function saveGame() {
    if (gameEnded) return;
    const saveData = {
        players: players,
        boardSpaces: BOARD_SPACES.map(s => ({
            owner: s.owner,
            houses: s.houses,
            price: s.price,
            rent: s.rent,
            disasterEffect: s.disasterEffect,
            disasterOwner: s.disasterOwner
        })),
        currentPlayerIndex: currentPlayerIndex,
        roundHistory: roundHistory
    };
    localStorage.setItem("monopoly_save", JSON.stringify(saveData));
}

function loadGame() {
    const saved = localStorage.getItem("monopoly_save");
    if (!saved) return;
    const data = JSON.parse(saved);

    players = data.players;
    currentPlayerIndex = data.currentPlayerIndex;
    roundHistory = data.roundHistory;

    data.boardSpaces.forEach((s, i) => {
        BOARD_SPACES[i].owner = s.owner;
        BOARD_SPACES[i].houses = s.houses || 0;
        BOARD_SPACES[i].price = s.price;
        BOARD_SPACES[i].rent = s.rent;
        BOARD_SPACES[i].disasterEffect = s.disasterEffect;
        BOARD_SPACES[i].disasterOwner = s.disasterOwner;
    });

    document.getElementById("start-screen").classList.remove("active");
    document.getElementById("game-screen").classList.add("active");

    initBoard();
    updatePlayerStats();
    initChart(true);
    startTurn();
}

window.addEventListener("DOMContentLoaded", () => {
    const saveData = localStorage.getItem("monopoly_save");
    if (saveData) {
        const continueSection = document.getElementById("continue-section");
        if (continueSection) {
            continueSection.style.display = "block";
            document.getElementById("continue-btn").addEventListener("click", () => {
                initAudio();
                playClickSound();
                loadGame();
            });
        }
    }
});

// Web Audio API Setup
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Ensure audio context starts on first interaction
document.body.addEventListener('click', initAudio, { once: true });

function playTone(freq, type, duration, vol = 0.1) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playClickSound() {
    playTone(600, 'sine', 0.1, 0.05);
}

function playDiceSound() {
    if (!audioCtx) return;
    let time = audioCtx.currentTime;
    for (let i = 0; i < 8; i++) {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.value = 400 + Math.random() * 400;
        gainNode.gain.setValueAtTime(0.05, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + 0.05);
        time += 0.06;
    }
}

function playMoveSound() {
    playTone(800, 'triangle', 0.1, 0.03);
}

function playBuySound() {
    if (!audioCtx) return;
    const time = audioCtx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C E G C
    freqs.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gainNode.gain.setValueAtTime(0.1, time + i * 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + i * 0.1 + 0.2);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start(time + i * 0.1);
        osc.stop(time + i * 0.1 + 0.2);
    });
}

function playPaySound() {
    if (!audioCtx) return;
    const time = audioCtx.currentTime;
    const freqs = [300, 250, 200];
    freqs.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        gainNode.gain.setValueAtTime(0.1, time + i * 0.15);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + i * 0.15 + 0.15);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start(time + i * 0.15);
        osc.stop(time + i * 0.15 + 0.15);
    });
}

// UI Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const boardElement = document.getElementById('board');
const playerStatsElement = document.getElementById('player-stats');
const currentTurnDisplay = document.getElementById('current-turn-display');
const rollBtn = document.getElementById('roll-btn');
const buildBtn = document.getElementById('build-btn');
const endTurnBtn = document.getElementById('end-turn-btn');
const dice1El = document.getElementById('dice1');
const dice2El = document.getElementById('dice2');
const logMessages = document.getElementById('log-messages');
const propertyModal = document.getElementById('property-modal');
const modalPropertyName = document.getElementById('modal-property-name');
const modalPropertyPrice = document.getElementById('modal-property-price');
const buyBtn = document.getElementById('buy-btn');
const skipBtn = document.getElementById('skip-btn');
const insuranceBtn = document.getElementById('insurance-btn');
const activeEventDisplay = document.getElementById('active-event-display');
const eventText = document.getElementById('event-text');

// Build Modal Elements
const buildModal = document.getElementById('build-modal');
const buildList = document.getElementById('build-list');
const closeBuildBtn = document.getElementById('close-build-btn');

closeBuildBtn.addEventListener('click', () => {
    playClickSound();
    buildModal.classList.remove('active');
});

// Chance Card Elements
const chanceModal = document.getElementById('chance-card-modal');
const chanceText = document.getElementById('chance-card-text');

let chanceTimeout;
let currentChanceAction;

chanceModal.addEventListener('click', () => {
    if (chanceModal.classList.contains('active')) {
        playClickSound();
        clearTimeout(chanceTimeout);
        chanceModal.classList.remove('active');
        if (currentChanceAction) currentChanceAction();
    }
});

// Disaster Card Elements
const disasterModal = document.getElementById('disaster-modal');
const disasterTypeEl = document.getElementById('disaster-type');
const disasterTextEl = document.getElementById('disaster-text');
const disasterIconEl = disasterModal.querySelector('.disaster-icon');

let disasterTimeout;
let currentDisasterAction;

disasterModal.addEventListener('click', () => {
    if (disasterModal.classList.contains('active')) {
        playClickSound();
        clearTimeout(disasterTimeout);
        disasterModal.classList.remove('active');
        if (currentDisasterAction) currentDisasterAction();
    }
});

// Land Administration Elements
const landAdminModal = document.getElementById('land-admin-modal');
const landAdminType = document.getElementById('land-admin-type');
const landAdminText = document.getElementById('land-admin-text');
const landAdminInteraction = document.getElementById('land-admin-interaction');

let landAdminTimeout;
let currentLandAdminAction;

landAdminModal.addEventListener('click', (e) => {
    // ボタンや入力をクリックしたときはモーダルを閉じないようにする
    if (e.target !== landAdminModal && !e.target.classList.contains('land-admin-card') && e.target.closest('.land-admin-interaction')) {
        return;
    }

    if (landAdminModal.classList.contains('active')) {
        playClickSound();
        closeLandAdmin();
    }
});

function closeLandAdmin() {
    clearTimeout(landAdminTimeout);
    if (landAdminModal.classList.contains('active')) {
        landAdminModal.classList.remove('active');
        if (currentLandAdminAction) {
            currentLandAdminAction();
            currentLandAdminAction = null;
        }
    }
}

// Start Game Setup
document.querySelectorAll('.player-select .menu-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        initAudio();
        playClickSound();
        const humanCount = parseInt(e.target.dataset.players);
        startGame(humanCount);
    });
});

function resetBoardState() {
    BOARD_SPACES.forEach(space => {
        delete space.owner;
        if (space.houses !== undefined) space.houses = 0;
        if (space.basePrice !== undefined) space.price = space.basePrice;
        if (space.baseRent !== undefined) space.rent = space.baseRent;
        delete space.disasterEffect;
        delete space.disasterOwner;
    });
}

function startGame(humanCount) {
    resetBoardState();
    players = [];
    for (let i = 0; i < 4; i++) {
        players.push({
            id: i,
            name: i < humanCount ? `Player ${i + 1}` : `CPU ${i + 1}`,
            isCPU: i >= humanCount,
            money: 1500,
            position: 0,
            color: COLORS[i],
            inJail: false,
            jailTurns: 0,
            properties: [],
            hasInsurance: false
        });
    }

    startScreen.classList.remove('active');
    gameScreen.classList.add('active');

    initBoard();
    updatePlayerStats();
    initChart(); // Initialize Chart
    startTurn();
}
function initChart(isLoad = false) {
    const canvasAsset = document.getElementById("asset-chart");
    const canvasLand = document.getElementById("land-chart");
    const canvasBuilding = document.getElementById("building-chart");

    if (!canvasAsset || !canvasLand || !canvasBuilding) return;

    const ctxAsset = canvasAsset.getContext("2d");
    const ctxLand = canvasLand.getContext("2d");
    const ctxBuilding = canvasBuilding.getContext("2d");

    if (!isLoad) {
        roundHistory = {
            labels: ["開始"],
            datasets: players.map((p, i) => ({
                label: p.name, data: [p.money], borderColor: p.color, backgroundColor: p.color + "33", tension: 0.3, borderWidth: 2, pointRadius: 2
            }))
        };
    }

    if (assetChart) assetChart.destroy();
    if (landChart) landChart.destroy();
    if (buildingChart) buildingChart.destroy();

    assetChart = new Chart(ctxAsset, {
        type: 'line', data: roundHistory, options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { ticks: { color: '#94a3b8', font: { size: 9 } } }, x: { ticks: { color: '#94a3b8', font: { size: 9 } } } },
            plugins: { legend: { labels: { color: '#f8fafc', font: { size: 9 } } } }
        }
    });

    landChart = new Chart(ctxLand, {
        type: 'bar', data: { labels: players.map(p => p.name), datasets: [{ label: '土地', data: players.map(p => p.properties.length), backgroundColor: players.map(p => p.color) }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1, color: '#94a3b8', font: { size: 9 } } }, x: { ticks: { color: '#94a3b8', font: { size: 8 } } } }, plugins: { legend: { display: false }, title: { display: true, text: '土地数', color: '#fff', font: { size: 10 } } } }
    });

    buildingChart = new Chart(ctxBuilding, {
        type: 'bar', data: { labels: players.map(p => p.name), datasets: [{ label: '建物', data: players.map(p => p.properties.reduce((sum, id) => sum + (BOARD_SPACES[id].houses || 0), 0)), backgroundColor: players.map(p => p.color) }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1, color: '#94a3b8', font: { size: 9 } } }, x: { ticks: { color: '#94a3b8', font: { size: 8 } } } }, plugins: { legend: { display: false }, title: { display: true, text: '建物数', color: '#fff', font: { size: 10 } } } }
    });
}

// Board Initialization
function initBoard() {
    boardElement.innerHTML = '';

    // Create spaces
    BOARD_SPACES.forEach((space, index) => {
        const spaceEl = document.createElement('div');
        spaceEl.className = `space ${space.type}`;
        spaceEl.id = `space-${index}`;

        // Determine grid position (11x11 grid)
        // Bottom row: 10-0
        if (index <= 10) {
            spaceEl.style.gridRow = '11';
            spaceEl.style.gridColumn = `${11 - index}`;
            if (index > 0 && index < 10) spaceEl.classList.add('rotate-top');
        }
        // Left col: 20-10
        else if (index <= 20) {
            spaceEl.style.gridColumn = '1';
            spaceEl.style.gridRow = `${21 - index}`;
            if (index > 10 && index < 20) spaceEl.classList.add('rotate-right');
        }
        // Top row: 20-30
        else if (index <= 30) {
            spaceEl.style.gridRow = '1';
            spaceEl.style.gridColumn = `${index - 19}`;
        }
        // Right col: 30-39
        else {
            spaceEl.style.gridColumn = '11';
            spaceEl.style.gridRow = `${index - 29}`;
            if (index > 30) spaceEl.classList.add('rotate-left');
        }

        if (index % 10 === 0) spaceEl.classList.add('corner');

        let innerHTML = '';
        if (['property', 'railroad', 'utility'].includes(space.type)) {
            if (space.type !== 'utility') innerHTML += `<div class="space-color" style="background-color: ${space.color}"></div>`;

            // 建物（家・ホテル）の状態を復元
            let housesHTML = '';
            if (space.type === 'property' && space.houses > 0) {
                if (space.houses === 5) {
                    housesHTML = '<div class="hotel-icon"></div>';
                } else {
                    for (let i = 0; i < space.houses; i++) {
                        housesHTML += '<div class="house-icon"></div>';
                    }
                }
            }
            if (space.type === 'property') {
                innerHTML += `<div class="house-container" id="houses-${index}">${housesHTML}</div>`;
            }

            innerHTML += `<div class="space-name">${space.name}</div>`;
            innerHTML += `<div class="space-price">$${space.price}</div>`;

            // 所有者の状態を復元
            const ownerColor = (space.owner !== undefined && players[space.owner]) ? players[space.owner].color : 'transparent';
            innerHTML += `<div class="owner-indicator" id="owner-${index}" style="background-color: ${ownerColor}"></div>`;
        } else if (space.type === 'disaster') {
            innerHTML += `<div class="space-name" style="margin: auto;">${space.name}</div>`;
            innerHTML += `<div class="disaster-badge">⚠️</div>`;
        } else {
            innerHTML += `<div class="space-name" style="margin: auto;">${space.name}</div>`;
            if (space.type === 'tax') innerHTML += `<div class="space-price">-$${space.price}</div>`;
        }

        spaceEl.innerHTML = innerHTML;
        boardElement.appendChild(spaceEl);
    });

    // Create tokens
    players.forEach(player => {
        const token = document.createElement('div');
        token.className = 'token';
        token.id = `token-${player.id}`;
        token.style.backgroundColor = player.color;
        boardElement.appendChild(token);
    });

    updateTokenPositions();
}

function updateTokenPositions() {
    players.forEach(player => {
        const spaceEl = document.getElementById(`space-${player.position}`);
        const token = document.getElementById(`token-${player.id}`);

        if (spaceEl && token) {
            const rect = spaceEl.getBoundingClientRect();
            const boardRect = boardElement.getBoundingClientRect();

            // Adjust position slightly based on player ID to prevent overlap
            const offsetX = (player.id % 2) * 15 + 10;
            const offsetY = Math.floor(player.id / 2) * 15 + 10;

            token.style.left = `${spaceEl.offsetLeft + offsetX}px`;
            token.style.top = `${spaceEl.offsetTop + offsetY}px`;
        }
    });
}

function updatePlayerStats() {
    updatePropertyChart();
    saveGame();
    playerStatsElement.innerHTML = '';
    players.forEach((player, i) => {
        const card = document.createElement('div');
        card.className = `player-card ${i === currentPlayerIndex ? 'active' : ''}`;
        card.style.borderLeftColor = player.color;

        card.innerHTML = `
            <div class="player-info">
                <div class="player-icon" style="background-color: ${player.color}"></div>
                <div class="player-name">${player.name}</div>
            </div>
            <div class="player-money">$${player.money}</div>
        `;
        playerStatsElement.appendChild(card);
    });
}

function log(msg) {
    const p = document.createElement('div');
    p.innerText = msg;
    logMessages.appendChild(p);
    logMessages.scrollTop = logMessages.scrollHeight;
}

// Monopoly & Building Logic
function hasMonopoly(playerId, color) {
    const group = BOARD_SPACES.filter(s => s.type === 'property' && s.color === color);
    return group.every(s => s.owner === playerId);
}

function getBuildableSpaces(player) {
    const buildable = [];
    // プレイヤーが所有する土地から色ごとのグループを抽出
    const ownedProperties = player.properties.map(id => BOARD_SPACES[id]).filter(s => s.type === 'property');
    const colors = [...new Set(ownedProperties.map(s => s.color))];

    colors.forEach(color => {
        if (hasMonopoly(player.id, color)) {
            const group = BOARD_SPACES.filter(s => s.type === 'property' && s.color === color);
            const minHouses = Math.min(...group.map(s => s.houses));
            group.forEach(s => {
                if (s.houses === minHouses && s.houses < 5) {
                    buildable.push(s);
                }
            });
        }
    });
    return buildable;
}

function updateBuildButtonVisibility() {
    const player = players[currentPlayerIndex];
    if (player.isCPU) {
        buildBtn.style.display = 'none';
        return;
    }
    const buildable = getBuildableSpaces(player);
    if (buildable.length > 0 && rollBtn.style.display !== 'none') {
        buildBtn.style.display = 'block';
    } else {
        buildBtn.style.display = 'none';
    }
}

function updateInsuranceButtonVisibility() {
    const player = players[currentPlayerIndex];
    if (player.isCPU) {
        insuranceBtn.style.display = 'none';
        return;
    }
    if (!player.hasInsurance && player.money >= INSURANCE_PRICE && rollBtn.style.visibility === 'visible') {
        insuranceBtn.style.display = 'block';
    } else {
        insuranceBtn.style.display = 'none';
    }
}

function triggerOsakaEvent() {
    const event = OSAKA_EVENTS[Math.floor(Math.random() * OSAKA_EVENTS.length)];
    activeEvent = { ...event };
    
    eventText.innerText = `【${activeEvent.name}】${activeEvent.text} (あと${activeEvent.duration}ターン)`;
    activeEventDisplay.style.display = 'block';
    activeEventDisplay.style.borderColor = activeEvent.color;
    activeEventDisplay.style.color = activeEvent.color;
    activeEventDisplay.style.background = `${activeEvent.color}22`;
    
    log(`!! イベント発生 !! 「${activeEvent.name}」が始まりました！`);
    playTone(600, 'sine', 0.3, 0.1);
    setTimeout(() => playTone(800, 'sine', 0.3, 0.1), 150);
}

function updateActiveEvent() {
    if (!activeEvent) return;
    
    activeEvent.duration--;
    if (activeEvent.duration <= 0) {
        log(`「${activeEvent.name}」が終了しました。`);
        activeEvent = null;
        activeEventDisplay.style.display = 'none';
    } else {
        eventText.innerText = `【${activeEvent.name}】${activeEvent.text} (あと${activeEvent.duration}ターン)`;
    }
}

buildBtn.addEventListener('click', () => {
    playClickSound();
    openBuildModal();
});

function openBuildModal() {
    const player = players[currentPlayerIndex];
    const buildable = getBuildableSpaces(player);
    buildList.innerHTML = '';

    if (buildable.length === 0) {
        buildList.innerHTML = '<p>現在建築可能な土地はありません。</p>';
    } else {
        buildable.forEach(space => {
            const cost = space.basePrice;
            const canAfford = player.money >= cost;
            const nextLevel = space.houses === 4 ? 'ホテル' : `家${space.houses + 1}軒目`;

            const item = document.createElement('div');
            item.className = 'build-item';
            item.innerHTML = `
                <div class="build-item-info">
                    <div class="build-item-color" style="background-color: ${space.color}"></div>
                    <span>${space.name} (${nextLevel})</span>
                    <span style="color: #4ade80; margin-left: 10px;">-$${cost}</span>
                </div>
                <button class="build-action-btn" ${!canAfford ? 'disabled' : ''}>建築する</button>
            `;

            const btn = item.querySelector('.build-action-btn');
            btn.addEventListener('click', () => {
                playClickSound();
                buildHouse(player, space);
                openBuildModal(); // Refresh modal
            });
            buildList.appendChild(item);
        });
    }
    buildModal.classList.add('active');
}

function buildHouse(player, space) {
    if (player.money < space.basePrice || space.houses >= 5) return;

    player.money -= space.basePrice;
    space.houses++;

    // 家賃の更新 (家1軒につき初期価格の50%分増加、ホテルはさらに倍増などの簡易計算)
    const increase = space.basePrice * 0.5;
    space.rent = Math.round(space.baseRent + (space.houses * increase));
    if (space.houses === 5) space.rent += space.basePrice; // ホテルボーナス

    // UI更新
    const container = document.getElementById(`houses-${space.id}`);
    if (container) {
        container.innerHTML = '';
        if (space.houses === 5) {
            container.innerHTML = '<div class="hotel-icon"></div>';
        } else {
            for (let i = 0; i < space.houses; i++) {
                container.innerHTML += '<div class="house-icon"></div>';
            }
        }
    }

    playBuySound();
    log(`${player.name} は ${space.name} に建物を建築した！`);
    updatePlayerStats();
    updateBuildButtonVisibility();
}

function tryCPUBuild(player) {
    let buildable = getBuildableSpaces(player);
    while (buildable.length > 0) {
        // CPUはランダムな候補に、所持金が(建築費+500)以上あれば建てる
        const space = buildable[Math.floor(Math.random() * buildable.length)];
        if (player.money >= space.basePrice + 500) {
            buildHouse(player, space);
            buildable = getBuildableSpaces(player); // 再計算
        } else {
            break;
        }
    }
}

function tryCPUInsurance(player) {
    if (!player.hasInsurance && player.money >= INSURANCE_PRICE + 800) { // ある程度余裕があるときだけ加入
        player.money -= INSURANCE_PRICE;
        player.hasInsurance = true;
        log(`${player.name} は災害保険に加入しました。`);
        updatePlayerStats();
    }
}

// Turn Logic
function startTurn() {
    updatePlayerStats();
    const player = players[currentPlayerIndex];
    currentTurnDisplay.innerText = `${player.name} のターン`;
    currentTurnDisplay.style.color = player.color;

    rollBtn.style.visibility = 'visible';
    endTurnBtn.style.display = 'none';

    updateBuildButtonVisibility();
    updateInsuranceButtonVisibility();

    // プレイヤー1のターン開始時にイベントの期間を更新
    if (player.id === 0) {
        updateActiveEvent();
    }

    if (player.inJail) {
        log(`${player.name} は刑務所にいます。`);
        // Simple jail logic: stay for 3 turns or pay 50. Here we just force stay for simple logic.
        player.jailTurns++;
        if (player.jailTurns > 2) {
            log(`${player.name} は出所しました。`);
            player.inJail = false;
            player.jailTurns = 0;
        } else {
            endTurn();
            return;
        }
    }

    if (player.isCPU) {
        rollBtn.disabled = true;
        buildBtn.style.display = 'none';
        insuranceBtn.style.display = 'none';
        setTimeout(() => {
            tryCPUBuild(player);
            tryCPUInsurance(player);
            setTimeout(handleRoll, 500);
        }, 1000);
    } else {
        rollBtn.disabled = false;
    }
}

rollBtn.addEventListener('click', () => {
    playClickSound();
    rollBtn.disabled = true;
    buildBtn.style.display = 'none';
    insuranceBtn.style.display = 'none';
    handleRoll();
});

insuranceBtn.addEventListener('click', () => {
    playClickSound();
    const player = players[currentPlayerIndex];
    if (player.money >= INSURANCE_PRICE && !player.hasInsurance) {
        player.money -= INSURANCE_PRICE;
        player.hasInsurance = true;
        log(`${player.name} は災害保険に加入しました。`);
        playBuySound();
        updatePlayerStats();
        updateInsuranceButtonVisibility();
    }
});

function handleRoll() {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;

    // Animation
    playDiceSound();
    dice1El.classList.add('rolling');
    dice2El.classList.add('rolling');

    // 高速で数値を切り替える
    let rollInterval = setInterval(() => {
        dice1El.innerText = Math.floor(Math.random() * 6) + 1;
        dice2El.innerText = Math.floor(Math.random() * 6) + 1;
    }, 50);

    setTimeout(() => {
        clearInterval(rollInterval);
        dice1El.classList.remove('rolling');
        dice2El.classList.remove('rolling');
        dice1El.innerText = d1;
        dice2El.innerText = d2;

        const total = d1 + d2; diceValue = total; if (d1 === d2) { doubleCount++; log('ゾロ目！もう一度振れます。'); } else { doubleCount = 0; }
        const player = players[currentPlayerIndex];
        log(`${player.name} は ${total} を出した。`);

        movePlayer(player, total);
    }, 600); // 0.6秒間アニメーション
}

function movePlayerTo(player, targetIndex) {
    let current = player.position;
    if (targetIndex < current && targetIndex !== 10) { // if moving forward past GO (excluding direct to jail)
        player.money += 200;
        log(`${player.name} がGOを通過し、$200受け取った。`);
        playBuySound();
        updatePlayerStats();
        clearDisasterEffects(player);
    }
    player.position = targetIndex;
    updateTokenPositions();
    playMoveSound();

    setTimeout(() => {
        resolveSpace(player, BOARD_SPACES[targetIndex]);
    }, 500);
}

function movePlayer(player, amount) {
    let newPos = player.position + amount;
    if (newPos >= 40) {
        newPos -= 40;
        player.money += 200;
        log(`${player.name} がGOを通過し、$200受け取った。`);
        playBuySound(); // GOマスのボーナス音
        updatePlayerStats();
        clearDisasterEffects(player);

        // プレイヤー1（先頭）がGOを通過したら地価変動または大阪名物イベントを発生
        if (player.id === 0) {
            if (Math.random() < 0.5) {
                triggerMarketCrash();
            } else {
                triggerOsakaEvent();
            }
        }
    }

    player.position = newPos;
    playMoveSound();
    updateTokenPositions();

    setTimeout(() => {
        resolveSpace(player, BOARD_SPACES[newPos]);
    }, 500);
}

function resolveSpace(player, space) {
    log(`${player.name} は ${space.name} に止まった。`);

    if (['property', 'railroad', 'utility'].includes(space.type)) {
        if (space.owner === undefined) {
            handleUnownedProperty(player, space);
            return; // Wait for async action
        } else if (space.owner !== player.id) {
            // Pay rent
            let rent = space.rent;
            if (space.type === "utility") {
                const owner = players[space.owner];
                const utilities = owner.properties.filter(id => BOARD_SPACES[id].type === "utility");
                const multiplier = utilities.length === 2 ? 10 : 4;
                rent = diceValue * multiplier;
                log(`${owner.name} は公共事業を ${utilities.length} つ所有しているため、ダイスの目(${diceValue})の ${multiplier} 倍を請求。`);
            }

            // 大阪名物イベントによる賃料倍率
            if (activeEvent) {
                if (activeEvent.targetColors === 'all' || activeEvent.targetColors.includes(space.color)) {
                    const originalRent = rent;
                    rent = Math.round(rent * activeEvent.multiplier);
                    log(`【${activeEvent.name}】の影響でレンタル料が $${originalRent} から $${rent} にアップ！`);
                }
            }
            if (space.disasterEffect === "rent-free") {
                rent = 0;
            }

            if (rent > 0) {
                player.money -= rent;
                players[space.owner].money += rent;
                playPaySound();
                log(`${player.name} は ${players[space.owner].name} にレンタル料 $${rent} を支払った。`);
                updatePlayerStats();
            } else if (space.disasterEffect === "rent-free") {
                log(`${player.name} は災害の影響でレンタル料を支払わずに済んだ！`);
            }
        }
    } else if (space.type === 'tax') {
        player.money -= space.price;
        playPaySound();
        log(`${player.name} は税金 $${space.price} を支払った。`);
        updatePlayerStats();
    } else if (space.type === 'gotojail') {
        playPaySound();
        log(`${player.name} は刑務所行き！`);
        player.position = 10;
        player.inJail = true;
        updateTokenPositions();
    } else if (space.type === "chance") {
        handleChance(player);
        return;
    } else if (space.type === "chest") {
        handleLandAdmin(player);
        return;
    } else if (space.type === 'disaster') {
        handleDisaster(player);
        return;
    }

    checkBankrupt(player);
    showEndTurn();
}

const CHANCE_CARDS = [
    { type: 'move', text: "GOへ進む\n（$200を受け取る）", action: (p) => { movePlayerTo(p, 0); } },
    { type: 'move', text: "刑務所へ行く", action: (p) => { p.position = 10; p.inJail = true; updateTokenPositions(); playPaySound(); checkBankrupt(p); showEndTurn(); } },
    { type: 'income', text: "銀行から配当金\n$50を受け取る", action: (p) => { p.money += 50; updatePlayerStats(); playBuySound(); checkBankrupt(p); showEndTurn(); } },
    { type: 'pay', text: "スピード違反\n罰金$15を支払う", action: (p) => { p.money -= 15; updatePlayerStats(); playPaySound(); checkBankrupt(p); showEndTurn(); } },
    { type: 'move', text: "3マス戻る", action: (p) => { movePlayer(p, -3); } },
    { type: 'move', text: "梅田へ進む", action: (p) => { movePlayerTo(p, 21); } },
    { type: 'move', text: "新大阪へ進む", action: (p) => { movePlayerTo(p, 15); } },
    { type: 'move', text: "北新地へ進む", action: (p) => { movePlayerTo(p, 26); } },
    { type: 'move', text: "万博公園へ進む", action: (p) => { movePlayerTo(p, 37); } },
    { type: 'pay', text: "新幹線に乗った。\n$100払う", action: (p) => { p.money -= 100; updatePlayerStats(); playPaySound(); checkBankrupt(p); showEndTurn(); } },
    { type: 'pay', text: "大阪城を観光\n$20払う", action: (p) => { p.money -= 20; updatePlayerStats(); playPaySound(); checkBankrupt(p); showEndTurn(); } },
    { type: 'pay', text: "アメ村でたこ焼きを食べる。\n$5払う", action: (p) => { p.money -= 5; updatePlayerStats(); playPaySound(); checkBankrupt(p); showEndTurn(); } },
    { type: 'income', text: "宝くじに当たる。\n$20を受け取る", action: (p) => { p.money += 20; updatePlayerStats(); playBuySound(); checkBankrupt(p); showEndTurn(); } },
    { type: 'income', text: "TV出演。\n$100を受け取る", action: (p) => { p.money += 100; updatePlayerStats(); playBuySound(); checkBankrupt(p); showEndTurn(); } },
    { type: 'income', text: "ポケモンカードを交番に届ける。\n$5を受け取る", action: (p) => { p.money += 5; updatePlayerStats(); playBuySound(); checkBankrupt(p); showEndTurn(); } }
];

function handleChance(player) {
    const card = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
    chanceText.innerText = card.text;

    const cardEl = chanceModal.querySelector('.chance-card');
    cardEl.className = 'chance-card'; // reset
    if (card.type === 'move') cardEl.classList.add('chance-move');
    if (card.type === 'pay') cardEl.classList.add('chance-pay');
    if (card.type === 'income') cardEl.classList.add('chance-income');

    chanceModal.classList.add('active');

    playTone(600, 'sine', 0.2, 0.1);
    setTimeout(() => playTone(800, 'sine', 0.4, 0.1), 200);

    log(`${player.name} はカードを引いた：「${card.text.replace(/\\n/g, ' ')}」`);

    currentChanceAction = () => {
        card.action(player);
    };

    // 15秒後に自動進行
    chanceTimeout = setTimeout(() => {
        if (chanceModal.classList.contains('active')) {
            chanceModal.classList.remove('active');
            if (currentChanceAction) currentChanceAction();
        }
    }, 15000);
}

const DISASTER_TYPES = [
    { name: '停電', weight: 10, icon: '🌑', text: '所有者がGOに行くまで賃貸料無料。$20x建物の数を受け取る', action: (p, s) => applyRentFreeDisaster(p, s, 20) },
    { name: '断水', weight: 8, icon: '💧', text: '所有者がGOに行くまで賃貸料無料。$30x建物の数を受け取る', action: (p, s) => applyRentFreeDisaster(p, s, 30) },
    { name: 'ガス漏れ', weight: 6, icon: '🔥', text: '所有者がGOに行くまで賃貸料無料。$50x建物の数を受け取る', action: (p, s) => applyRentFreeDisaster(p, s, 50) },
    { name: '火事', weight: 4, icon: '🚒', text: 'ひとつの土地のすべての建物がなくなる。', action: (p, s) => applyDestructionDisaster(p, s, 'single') },
    { name: '洪水', weight: 2, icon: '🌊', text: '同一色のすべての建物がなくなる。さらに30%の確率で土地も失う。', action: (p, s) => applyDestructionDisaster(p, s, 'color', 0.3) },
    { name: '地震', weight: 1, icon: '🌋', text: '同一色のすべての建物がなくなる。土地も没収される。', action: (p, s) => applyDestructionDisaster(p, s, 'color', 1.0) }
];

function handleDisaster(player) {
    const totalWeight = DISASTER_TYPES.reduce((sum, d) => sum + d.weight, 0);
    let random = Math.random() * totalWeight;
    let disaster;
    for (const d of DISASTER_TYPES) {
        if (random < d.weight) {
            disaster = d;
            break;
        }
        random -= d.weight;
    }

    disasterTypeEl.innerText = disaster.name;
    disasterTextEl.innerText = disaster.text;
    disasterIconEl.innerText = disaster.icon;
    disasterModal.classList.add('active');

    // 災害用の効果音
    playTone(100, 'sawtooth', 0.5, 0.2);
    setTimeout(() => playTone(80, 'sawtooth', 0.8, 0.2), 300);

    log(`!! 災害発生 !! ${player.name} はカードを引いた：「${disaster.name}」`);

    currentDisasterAction = () => {
        // 全ての所有されている土地からランダムに選ぶ
        const ownedSpaces = BOARD_SPACES.filter(s => s.owner !== undefined && (s.type === 'property' || s.type === 'railroad' || s.type === 'utility'));
        if (ownedSpaces.length === 0) {
            log("幸いなことに、被害を受ける土地がありませんでした。");
            showEndTurn();
            return;
        }
        const targetSpace = ownedSpaces[Math.floor(Math.random() * ownedSpaces.length)];
        const targetOwner = players[targetSpace.owner];

        if (targetOwner.hasInsurance) {
            log(`【災害保険】が発動！ ${targetOwner.name} の所有する ${targetSpace.name} は守られました。`);
            targetOwner.hasInsurance = false; // 保険を消費
            updatePlayerStats();
            showEndTurn();
        } else {
            disaster.action(player, targetSpace);
        }
    };

    disasterTimeout = setTimeout(() => {
        if (disasterModal.classList.contains('active')) {
            disasterModal.classList.remove('active');
            if (currentDisasterAction) currentDisasterAction();
        }
    }, 15000);
}

function applyRentFreeDisaster(player, space, moneyPerBuilding) {
    const owner = players[space.owner];
    const bonus = (space.houses || 0) * moneyPerBuilding;
    owner.money += bonus;
    space.disasterEffect = 'rent-free';
    space.disasterOwner = owner.id;

    log(`${owner.name} の所有する ${space.name} で${space.disasterEffect === 'rent-free' ? 'インフラ障害' : '災害'}が発生！`);
    log(`${owner.name} は補償金 $${bonus} を受け取ったが、賃貸料が無料になった。`);

    updateSpaceUI(space);
    updatePlayerStats();
    showEndTurn();
}

function applyDestructionDisaster(player, space, mode, lossChance = 0) {
    let targets = [];
    if (mode === 'single') {
        targets = [space];
    } else {
        targets = BOARD_SPACES.filter(s => s.color === space.color && s.owner !== undefined);
    }

    targets.forEach(s => {
        const owner = players[s.owner];
        s.houses = 0;
        s.rent = s.baseRent;
        log(`${s.name} の建物がすべて失われた！`);

        if (Math.random() < lossChance) {
            log(`${owner.name} は ${s.name} の所有権を失った！`);
            delete s.owner;
            const idx = owner.properties.indexOf(s.id);
            if (idx > -1) owner.properties.splice(idx, 1);
            const ownerIndicator = document.getElementById(`owner-${s.id}`);
            if (ownerIndicator) ownerIndicator.style.backgroundColor = 'transparent';
        }
        updateSpaceUI(s);
    });

    playPaySound();
    updatePlayerStats();
    showEndTurn();
}

function updateSpaceUI(space) {
    updatePropertyChart();
    saveGame();
    const container = document.getElementById(`houses-${space.id}`);
    if (container) {
        container.innerHTML = '';
        if (space.houses === 5) {
            container.innerHTML = '<div class="hotel-icon"></div>';
        } else if (space.houses > 0) {
            for (let i = 0; i < space.houses; i++) {
                container.innerHTML += '<div class="house-icon"></div>';
            }
        }
    }

    const spaceEl = document.getElementById(`space-${space.id}`);
    if (spaceEl) {
        const existingIndicator = spaceEl.querySelector('.rent-free-indicator');
        if (existingIndicator) existingIndicator.remove();

        if (space.disasterEffect === 'rent-free') {
            const indicator = document.createElement('div');
            indicator.className = 'rent-free-indicator';
            spaceEl.appendChild(indicator);
        }
    }
}

function clearDisasterEffects(player) {
    BOARD_SPACES.forEach(s => {
        if (s.disasterEffect === 'rent-free' && s.disasterOwner === player.id) {
            delete s.disasterEffect;
            delete s.disasterOwner;
            log(`${player.name} がGOを通過したため、${s.name} のインフラが復旧した。`);
            updateSpaceUI(s);
        }
    });
}

let currentBuyHandler = null;
let currentSkipHandler = null;

function handleUnownedProperty(player, space) {
    if (player.money >= space.price) {
        if (player.isCPU) {
            // CPU always buys if it has enough money
            buyProperty(player, space);
            showEndTurn();
        } else {
            // Show Modal for player
            modalPropertyName.innerText = space.name;
            modalPropertyPrice.innerText = `価格: $${space.price}`;
            propertyModal.classList.add('active');

            const dynamicBuyBtn = document.getElementById('buy-btn');
            const dynamicSkipBtn = document.getElementById('skip-btn');

            if (currentBuyHandler) dynamicBuyBtn.removeEventListener('click', currentBuyHandler);
            if (currentSkipHandler) dynamicSkipBtn.removeEventListener('click', currentSkipHandler);

            currentBuyHandler = () => {
                playClickSound();
                propertyModal.classList.remove('active');
                buyProperty(player, space);
                showEndTurn();
            };

            currentSkipHandler = () => {
                playClickSound();
                propertyModal.classList.remove("active");
                log(`${player.name} は ${space.name} の購入を見送った。`);
                if (space.type === "utility") {
                    log(`${space.name} は公共事業のため、自動的に競売にかけられます。`);
                    landAdminModal.classList.add("active");
                    handleCompetitiveBidding(player, space);
                } else {
                    showEndTurn();
                }
            };

            dynamicBuyBtn.addEventListener('click', currentBuyHandler);
            dynamicSkipBtn.addEventListener('click', currentSkipHandler);
        }
    } else {
        log(`${player.name} はお金が足りず買えない。`);
        if (space.type === "utility") {
            log(`${space.name} は公共事業のため、自動的に競売にかけられます。`);
            landAdminModal.classList.add("active");
            handleCompetitiveBidding(player, space);
        } else {
            showEndTurn();
        }
    }
}

function buyProperty(player, space) {
    player.money -= space.price;
    space.owner = player.id;
    player.properties.push(space.id);

    // Update Board UI
    const ownerIndicator = document.getElementById(`owner-${space.id}`);
    if (ownerIndicator) {
        ownerIndicator.style.backgroundColor = player.color;
    }

    playBuySound();
    log(`${player.name} は ${space.name} を購入した！`);
    updatePlayerStats();
}
function checkBankrupt(player) {
    if (player.money < 0 && !gameEnded) {
        log(`${player.name} は資金不足です。資産を売却して返済を試みます。`);

        // 1. 建物をランダムに売却
        while (player.money < 0) {
            const spacesWithHouses = player.properties
                .map(id => BOARD_SPACES[id])
                .filter(s => s.houses > 0);

            if (spacesWithHouses.length === 0) break;

            const target = spacesWithHouses[Math.floor(Math.random() * spacesWithHouses.length)];
            target.houses--;
            const sellPrice = Math.floor(target.basePrice * 0.5);
            player.money += sellPrice;

            // 家賃の更新
            const increase = target.basePrice * 0.5;
            target.rent = Math.round(target.baseRent + (target.houses * increase));
            if (target.houses === 5) target.rent += target.basePrice;

            log(`${player.name} は ${target.name} の建物を売却して $${sellPrice} を得た。 (残金: $${player.money})`);
            updateSpaceUI(target);
            updatePlayerStats();
        }

        // 2. 土地をランダムに売却
        while (player.money < 0) {
            if (player.properties.length === 0) break;

            const propIndex = Math.floor(Math.random() * player.properties.length);
            const propId = player.properties[propIndex];
            const target = BOARD_SPACES[propId];

            const sellPrice = Math.floor(target.basePrice * 0.5);
            player.money += sellPrice;

            log(`${player.name} は ${target.name} を売却して $${sellPrice} を得た。 (残金: $${player.money})`);

            // 所有権の解除
            player.properties.splice(propIndex, 1);
            delete target.owner;
            const ownerIndicator = document.getElementById(`owner-${target.id}`);
            if (ownerIndicator) ownerIndicator.style.backgroundColor = "transparent";

            updateSpaceUI(target);
            updatePlayerStats();
        }

        if (player.money < 0) {
            gameEnded = true;
            log(`!! ${player.name} はすべての資産を失い破産した !!`);
            setTimeout(endGame, 1000);
        } else {
            log(`${player.name} は負債を完済した。 (残金: $${player.money})`);
        }
    }
}
function showEndTurn() {
    rollBtn.style.visibility = "hidden";
    buildBtn.style.display = "none";
    endTurnBtn.style.display = "none";
    setTimeout(endTurn, 1500);
}

function endTurn() {
    saveGame();
    if (gameEnded) return;
    if (doubleCount === 0) {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        if (currentPlayerIndex === 0) {
            updateChartData();
        }
    } else {
        log(`${players[currentPlayerIndex].name} はゾロ目だったので継続します。`);
    }
    startTurn();
}

function updateChartData() {
    if (!assetChart) return;
    const roundNumber = roundHistory.labels.length;
    roundHistory.labels.push(`R${roundNumber}`);
    players.forEach((p, i) => {
        const propertyValue = p.properties.reduce((sum, id) => sum + BOARD_SPACES[id].price, 0);
        const totalAssets = p.money + propertyValue;
        roundHistory.datasets[i].data.push(totalAssets);
    });
    assetChart.update();
    updatePropertyChart();
}


// 地価変動イベント
function triggerMarketCrash() {
    const colorGroups = [
        { color: "#8b4513", name: "茶色" },
        { color: "#87ceeb", name: "水色" },
        { color: "#ffc0cb", name: "ピンク" },
        { color: "#ffa500", name: "オレンジ" },
        { color: "#ff0000", name: "赤色" },
        { color: "#ffff00", name: "黄色" },
        { color: "#008000", name: "緑色" },
        { color: "#00008b", name: "紺色" }
    ];

    const group = colorGroups[Math.floor(Math.random() * colorGroups.length)];
    const isUp = Math.random() > 0.3;
    const multiplier = isUp ? 1.5 : 0.5;

    log(`【市場変動】${group.name} の地価が${isUp ? "上昇" : "下落"}しました！`);

    BOARD_SPACES.forEach(space => {
        if (space.type === "property") {
            const spaceEl = document.getElementById(`space-${space.id}`);

            if (space.color === group.color) {
                // 選ばれた色は基準値から変動
                space.price = Math.round(space.basePrice * multiplier);
                space.rent = Math.round(space.baseRent * multiplier);

                // 枠線の色を更新
                if (spaceEl) {
                    if (multiplier > 1) {
                        spaceEl.classList.add('price-up');
                        spaceEl.classList.remove('price-down');
                    } else if (multiplier < 1) {
                        spaceEl.classList.add('price-down');
                        spaceEl.classList.remove('price-up');
                    } else {
                        spaceEl.classList.remove('price-up', 'price-down');
                    }
                }
            } else {
                // それ以外の色は基準値に戻す
                space.price = space.basePrice;
                space.rent = space.baseRent;

                // 枠線を解除
                if (spaceEl) {
                    spaceEl.classList.remove('price-up', 'price-down');
                }
            }

            // UI上の価格表示を更新
            if (spaceEl) {
                const priceEl = spaceEl.querySelector('.space-price');
                if (priceEl) priceEl.innerText = `$${space.price}`;
            }
        }
    });

    const msgBox = document.getElementById('center-message');
    const msgText = document.getElementById('center-message-text');

    let trend = multiplier > 1 ? '高騰' : (multiplier < 1 ? '暴落' : '変化なし');
    let sign = multiplier > 1 ? '📈' : (multiplier < 1 ? '📉' : '➡️');
    let colorStyle = multiplier > 1 ? '#ef4444' : (multiplier < 1 ? '#3b82f6' : '#fff');

    msgText.innerHTML = `<span style="color:${group.color}; text-shadow: 0 0 2px #fff;">${group.name}</span>の土地が<br><span style="color:${colorStyle}; font-size:2rem;">${multiplier}倍</span> に${trend}！ ${sign}`;

    msgBox.classList.add('active');
    setTimeout(() => msgBox.classList.remove('active'), 5000);
}

// BGM Manager
class BGMManager {
    constructor() {
        this.isPlaying = false;
        this.schedulerTimer = null;
        this.nextNoteTime = 0;
        this.beat = 0;
        this.tempo = 110;
        this.lookahead = 25.0;
        this.scheduleAheadTime = 0.1;
        this.gainNode = null;

        // C G Am F progression
        this.progression = [
            [261.63, 329.63, 392.00], // C
            [196.00, 246.94, 293.66], // G
            [220.00, 261.63, 329.63], // Am
            [174.61, 220.00, 261.63]  // F
        ];
    }

    init() {
        if (!audioCtx) initAudio();
        if (!this.gainNode) {
            this.gainNode = audioCtx.createGain();
            this.gainNode.gain.value = 0.4; // Further increased from 0.2
            this.gainNode.connect(audioCtx.destination);
        }
    }

    start() {
        if (this.isPlaying) return;
        this.init();
        this.isPlaying = true;
        this.nextNoteTime = audioCtx.currentTime + 0.1; // Add small delay
        this.scheduler();
        log("BGMを再生します。");
    }

    stop() {
        this.isPlaying = false;
        clearTimeout(this.schedulerTimer);
        log("BGMを停止しました。");
    }

    toggle() {
        const btn = document.getElementById('bgm-toggle');
        if (this.isPlaying) {
            this.stop();
            btn.classList.add('muted');
        } else {
            this.start();
            btn.classList.remove('muted');
        }
    }

    scheduler() {
        while (this.nextNoteTime < audioCtx.currentTime + this.scheduleAheadTime) {
            this.scheduleNote(this.beat, this.nextNoteTime);
            this.nextNote();
        }
        this.schedulerTimer = setTimeout(() => this.scheduler(), this.lookahead);
    }

    nextNote() {
        const secondsPerBeat = 60.0 / (this.tempo * 2); // 8th notes
        this.nextNoteTime += secondsPerBeat;
        this.beat = (this.beat + 1) % 32;
    }

    scheduleNote(beat, time) {
        const chordIndex = Math.floor(beat / 8) % 4;
        const chord = this.progression[chordIndex];

        // Bass
        if (beat % 4 === 0) {
            this.playSynth(chord[0] / 2, 'sine', time, 0.4, 0.3); // Increased from 0.1
        }

        // Arpeggio
        const noteIndex = beat % 3;
        this.playSynth(chord[noteIndex], 'triangle', time, 0.2, 0.25); // Increased from 0.1

        // Simple "hi-hat" noise
        if (beat % 2 === 0) {
            this.playNoise(time, 0.01, 0.05); // Increased from 0.03
        }
    }

    playSynth(freq, type, time, duration, vol) {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, time);
        g.gain.setValueAtTime(vol, time);
        g.gain.exponentialRampToValueAtTime(0.01, time + duration);
        osc.connect(g);
        g.connect(this.gainNode);
        osc.start(time);
        osc.stop(time + duration);
    }

    playNoise(time, duration, vol) {
        const bufferSize = audioCtx.sampleRate * duration;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(vol, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + duration);
        noise.connect(g);
        g.connect(this.gainNode);
        noise.start(time);
        noise.stop(time + duration);
    }
}

const bgm = new BGMManager();
document.getElementById('bgm-toggle').addEventListener('click', () => {
    initAudio();
    bgm.toggle();
    playClickSound();
});


// --- 土地行政 (Land Administration) Logic ---

function handleLandAdmin(player) {
    const cardIndex = Math.floor(Math.random() * 7);
    landAdminInteraction.innerHTML = '';
    landAdminModal.classList.add('active');

    playTone(400, 'sine', 0.2, 0.1);
    setTimeout(() => playTone(600, 'sine', 0.4, 0.1), 200);

    log(`${player.name} は土地行政カードを引いた。`);

    currentLandAdminAction = () => {
        showEndTurn();
    };

    switch (cardIndex) {
        case 0: handleLandSale(player); break;
        case 1: handleLandConsolidation(player); break;
        case 2: handleCompetitiveBidding(player); break;
        case 3: handleLandExchange(player); break;
        case 4: handleRegionalDev(player, '高速道路', 0.1, 1.1); break;
        case 5: handleRegionalDev(player, '港湾設備', 0.2, 1.2); break;
        case 6: handleNewTown(player); break;
    }

    // 15秒後に自動進行
    clearTimeout(landAdminTimeout);
    landAdminTimeout = setTimeout(() => {
        if (landAdminModal.classList.contains('active')) {
            landAdminModal.classList.remove('active');
            if (currentLandAdminAction) currentLandAdminAction();
        }
    }, 15000);
}

function handleLandSale(player) {
    landAdminType.innerText = "土地の払い下げ";
    const unowned = BOARD_SPACES.filter(s => s.owner === undefined && (s.type === 'property' || s.type === 'railroad' || s.type === 'utility'));

    if (unowned.length === 0) {
        landAdminText.innerText = "現在、払い下げ可能な土地はありません。";
        return;
    }

    const target = unowned[Math.floor(Math.random() * unowned.length)];
    const price = Math.floor(Math.random() * 91) + 10;

    landAdminText.innerText = `${target.name} を $${price} で購入しますか？`;

    const yesBtn = document.createElement('button');
    yesBtn.className = 'yes-btn';
    yesBtn.innerText = 'はい';
    const noBtn = document.createElement('button');
    noBtn.className = 'no-btn';
    noBtn.innerText = 'いいえ';

    if (player.isCPU) {
        setTimeout(() => {
            if (player.money >= price) buyPropertyAtPrice(player, target, price);
            closeLandAdmin();
        }, 2000);
    } else {
        yesBtn.onclick = () => {
            if (player.money >= price) {
                buyPropertyAtPrice(player, target, price);
                closeLandAdmin();
            } else alert("お金が足りません！");
        };
        noBtn.onclick = () => {
            closeLandAdmin();
        };
        landAdminInteraction.appendChild(yesBtn);
        landAdminInteraction.appendChild(noBtn);
    }
}

function buyPropertyAtPrice(player, space, price) {
    player.money -= price;
    space.owner = player.id;
    player.properties.push(space.id);
    const ownerIndicator = document.getElementById(`owner-${space.id}`);
    if (ownerIndicator) ownerIndicator.style.backgroundColor = player.color;
    playBuySound();
    log(`${player.name} は払い下げにより ${space.name} を $${price} で取得した！`);
    updatePlayerStats();
}

function handleLandConsolidation(player) {
    landAdminType.innerText = "区画整理";
    const colorGroups = [...new Set(BOARD_SPACES.filter(s => s.type === 'property').map(s => s.color))];
    const targetColor = colorGroups[Math.floor(Math.random() * colorGroups.length)];

    const colorName = getColorName(targetColor);
    landAdminText.innerText = `対象の色: ${colorName} の土地が更地になります。`;

    BOARD_SPACES.filter(s => s.color === targetColor).forEach(s => {
        if (s.owner !== undefined) {
            const owner = players[s.owner];
            owner.money += s.price;
            const idx = owner.properties.indexOf(s.id);
            if (idx > -1) owner.properties.splice(idx, 1);
            delete s.owner;
            s.houses = 0;
            s.rent = s.baseRent;
            const ownerIndicator = document.getElementById(`owner-${s.id}`);
            if (ownerIndicator) ownerIndicator.style.backgroundColor = 'transparent';
            updateSpaceUI(s);
        }
    });

    log(`区画整理により ${colorName} の土地がすべて空き地になりました。`);
    updatePlayerStats();
}

async function handleCompetitiveBidding(player, specificTarget = null) {
    landAdminType.innerText = "競争入札";
    let target = specificTarget;
    if (!target) {
        const possible = BOARD_SPACES.filter(s => (s.type === 'property' || s.type === 'railroad') && s.name !== 'GO' && s.name !== '刑務所' && s.name !== '関西電力' && s.name !== '水道局');
        target = possible[Math.floor(Math.random() * possible.length)];
    }

    const buildingPrice = target.houses ? target.houses * target.basePrice : 0;
    const baseValue = target.price + buildingPrice;

    let minBid = Math.floor(baseValue * 1.1);
    let currentHighBid = 0;
    let currentWinner = null;

    // Round 1
    log(`${target.name} の入札開始 (最低 $${minBid})`);
    for (const p of players) {
        const bid = await getPlayerBid(p, target, minBid);
        if (bid >= minBid && bid > currentHighBid) {
            currentHighBid = bid;
            currentWinner = p;
        }
    }

    if (!currentWinner) {
        minBid = baseValue;
        log("第2回入札開始 (最低 $${minBid})");
        for (const p of players) {
            const bid = await getPlayerBid(p, target, minBid);
            if (bid >= minBid && bid > currentHighBid) {
                currentHighBid = bid;
                currentWinner = p;
            }
        }
    }

    if (currentWinner) {
        if (target.owner !== undefined) {
            players[target.owner].money += currentHighBid;
            const idx = players[target.owner].properties.indexOf(target.id);
            if (idx > -1) players[target.owner].properties.splice(idx, 1);
        }
        currentWinner.money -= currentHighBid;
        target.owner = currentWinner.id;
        currentWinner.properties.push(target.id);
        const ownerIndicator = document.getElementById(`owner-${target.id}`);
        if (ownerIndicator) ownerIndicator.style.backgroundColor = currentWinner.color;
        playBuySound();
        log(`${currentWinner.name} が ${target.name} を $${currentHighBid} で落札！`);
        await handleBuildingTransfer(currentWinner, target);
    } else {
        log("入札なし。");
    }

    updatePlayerStats();
    landAdminModal.classList.remove('active');
    showEndTurn();
}

function getPlayerBid(player, space, minBid) {
    return new Promise(resolve => {
        if (player.isCPU) {
            setTimeout(() => {
                if (player.money >= minBid + 100 && Math.random() < 0.4) resolve(minBid + Math.floor(Math.random() * 100));
                else resolve(0);
            }, 600);
        } else {
            landAdminInteraction.innerHTML = '';
            landAdminText.innerText = `${player.name} の入札番です (最低: $${minBid})\n対象: ${space.name}`;
            const container = document.createElement('div');
            container.className = 'bid-input-container';
            const input = document.createElement('input');
            input.type = 'number'; input.value = minBid;
            const bidBtn = document.createElement('button');
            bidBtn.className = 'bid-btn'; bidBtn.innerText = '入札';
            const passBtn = document.createElement('button');
            passBtn.className = 'pass-btn'; passBtn.innerText = '辞退';
            bidBtn.onclick = () => {
                const v = parseInt(input.value);
                if (v >= minBid && v <= player.money) resolve(v);
                else alert("金額が正しくありません。");
            };
            passBtn.onclick = () => resolve(0);
            container.appendChild(input); container.appendChild(bidBtn);
            landAdminInteraction.appendChild(container); landAdminInteraction.appendChild(passBtn);
        }
    });
}

async function handleLandExchange(player) {
    landAdminType.innerText = "土地交換";
    if (player.properties.length === 0) {
        landAdminText.innerText = "交換できる土地がありません。";
        return;
    }

    const othersProps = BOARD_SPACES.filter(s => s.owner !== undefined && s.owner !== player.id);
    if (othersProps.length === 0) {
        landAdminText.innerText = "相手が土地を持っていません。";
        return;
    }

    if (player.isCPU) {
        landAdminText.innerText = "CPUは交換を見送った。";
        return;
    }

    const myProp = await selectProperty(player, "自分の土地を選択");
    if (!myProp) { landAdminModal.classList.remove('active'); showEndTurn(); return; }

    const otherProp = await selectPropertyFromOthers(player, "相手の土地を選択");
    if (!otherProp) { landAdminModal.classList.remove('active'); showEndTurn(); return; }

    const myVal = myProp.price + (myProp.houses ? myProp.houses * myProp.basePrice : 0);
    const otherVal = otherProp.price + (otherProp.houses ? otherProp.houses * otherProp.basePrice : 0);
    const otherPlayer = players[otherProp.owner];

    if (myVal < otherVal) {
        const diff = otherVal - myVal;
        player.money -= diff; otherPlayer.money += diff;
        log(`${player.name} が差額 $${diff} を支払った。`);
    } else if (myVal > otherVal) {
        const diff = myVal - otherVal;
        otherPlayer.money -= diff; player.money += diff;
        log(`${otherPlayer.name} が差額 $${diff} を支払った。`);
    }

    const fee = Math.floor(Math.max(myVal, otherVal) * 0.1);
    player.money -= fee;
    log(`銀行に手数料 $${fee} を支払った。`);

    const myIdx = player.properties.indexOf(myProp.id);
    const otherIdx = otherPlayer.properties.indexOf(otherProp.id);
    player.properties.splice(myIdx, 1); otherPlayer.properties.splice(otherIdx, 1);
    player.properties.push(otherProp.id); otherPlayer.properties.push(myProp.id);
    myProp.owner = otherPlayer.id; otherProp.owner = player.id;

    document.getElementById(`owner-${myProp.id}`).style.backgroundColor = otherPlayer.color;
    document.getElementById(`owner-${otherProp.id}`).style.backgroundColor = player.color;

    await handleBuildingTransfer(player, otherProp);
    await handleBuildingTransfer(otherPlayer, myProp);
    log(`${myProp.name} と ${otherProp.name} を交換した！`);
    updatePlayerStats();
    landAdminModal.classList.remove('active');
    showEndTurn();
}

function handleRegionalDev(player, name, payRate, priceRate) {
    landAdminType.innerText = name + "の作成";
    const colors = [...new Set(BOARD_SPACES.filter(s => s.type === 'property').map(s => s.color))];
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    const colorName = getColorName(targetColor);
    landAdminText.innerText = `${colorName} に ${name} を建設。基準価格 ${Math.round((priceRate - 1) * 100)}% UP！`;

    BOARD_SPACES.filter(s => s.color === targetColor).forEach(s => {
        if (s.owner !== undefined) {
            const pay = Math.floor(s.basePrice * payRate);
            players[s.owner].money -= pay;
        }
        s.basePrice = Math.round(s.basePrice * priceRate);
        s.baseRent = Math.round(s.baseRent * priceRate);
        s.price = Math.round(s.price * priceRate);
        s.rent = Math.round(s.rent * priceRate);
        const el = document.getElementById(`space-${s.id}`);
        if (el) {
            const pEl = el.querySelector('.space-price');
            if (pEl) pEl.innerText = `$${s.price}`;
        }
    });
    updatePlayerStats();
}

function handleNewTown(player) {
    landAdminType.innerText = "ニュータウンの作成";
    const colors = [...new Set(BOARD_SPACES.filter(s => s.type === 'property').map(s => s.color))];
    const vacantColors = colors.filter(c => BOARD_SPACES.filter(s => s.color === c).every(s => s.owner === undefined));

    if (vacantColors.length === 0) {
        landAdminText.innerText = "空き地域がありません。";
        setTimeout(() => { landAdminModal.classList.remove('active'); showEndTurn(); }, 1500);
        return;
    }

    const targetColor = vacantColors[Math.floor(Math.random() * vacantColors.length)];
    const group = BOARD_SPACES.filter(s => s.color === targetColor);
    const discountPrice = Math.floor(group.reduce((sum, s) => sum + s.basePrice, 0) * 0.5);

    const colorName = getColorName(targetColor);
    landAdminText.innerText = `${colorName} の土地を一括購入しますか？ ($${discountPrice})`;
    const yesBtn = document.createElement('button'); yesBtn.className = 'yes-btn'; yesBtn.innerText = 'はい';
    const noBtn = document.createElement('button'); noBtn.className = 'no-btn'; noBtn.innerText = 'いいえ';

    const buy = () => {
        if (player.money >= discountPrice) {
            player.money -= discountPrice;
            group.forEach(s => {
                s.owner = player.id; player.properties.push(s.id);
                document.getElementById(`owner-${s.id}`).style.backgroundColor = player.color;
            });
            const colorName = getColorName(targetColor);
            playBuySound(); log(`ニュータウン開発で ${colorName} を取得！`);
            updatePlayerStats(); closeLandAdmin();
        } else alert("お金が足りません。");
    };

    if (player.isCPU) {
        setTimeout(() => {
            if (player.money >= discountPrice + 500) buy();
            else { closeLandAdmin(); }
        }, 2000);
    } else {
        yesBtn.onclick = buy; noBtn.onclick = () => { closeLandAdmin(); };
        landAdminInteraction.appendChild(yesBtn); landAdminInteraction.appendChild(noBtn);
    }
}

function selectProperty(player, title) {
    return new Promise(resolve => {
        landAdminText.innerText = title;
        landAdminInteraction.innerHTML = '';
        const list = document.createElement('div');
        list.className = 'land-admin-property-list';
        player.properties.forEach(id => {
            const s = BOARD_SPACES[id];
            const item = document.createElement('div');
            item.className = 'land-admin-property-item';
            item.innerText = s.name;
            item.onclick = () => resolve(s);
            list.appendChild(item);
        });
        landAdminInteraction.appendChild(list);
        const skip = document.createElement('button');
        skip.className = 'no-btn'; skip.innerText = 'キャンセル';
        skip.onclick = () => resolve(null);
        landAdminInteraction.appendChild(skip);
    });
}

function selectPropertyFromOthers(player, title) {
    return new Promise(resolve => {
        landAdminText.innerText = title;
        landAdminInteraction.innerHTML = '';
        const list = document.createElement('div');
        list.className = 'land-admin-property-list';
        BOARD_SPACES.forEach(s => {
            if (s.owner !== undefined && s.owner !== player.id && (s.type === 'property' || s.type === 'railroad' || s.type === 'utility')) {
                const item = document.createElement('div');
                item.className = 'land-admin-property-item';
                item.innerText = `${s.name} (${players[s.owner].name})`;
                item.onclick = () => resolve(s);
                list.appendChild(item);
            }
        });
        landAdminInteraction.appendChild(list);
        const skip = document.createElement('button');
        skip.className = 'no-btn'; skip.innerText = 'キャンセル';
        skip.onclick = () => resolve(null);
        landAdminInteraction.appendChild(skip);
    });
}

function getColorName(color) {
    const names = {
        '#8b4513': '茶色',
        '#87ceeb': '水色',
        '#ffc0cb': 'ピンク',
        '#ffa500': 'オレンジ',
        '#ff0000': '赤色',
        '#ffff00': '黄色',
        '#008000': '緑色',
        '#00008b': '紺色'
    };
    return names[color] || color;
}

async function handleBuildingTransfer(player, space) {
    if (space.houses > 0) {
        if (player.isCPU) {
            if (player.money >= 700) {
                player.money -= 200;
                log(`${player.name} は $200 を支払い、${space.name} の建物を引き継いだ。`);
            } else {
                space.houses = 0;
                space.rent = space.baseRent;
                log(`${player.name} は ${space.name} の建物を解体した。`);
            }
        } else {
            const keep = await new Promise(resolve => {
                landAdminInteraction.innerHTML = '';
                landAdminText.innerText = `${space.name} には建物があります。\n$200 を支払って引き継ぎますか？\n(いいえ を選ぶと解体されます)`;
                const yesBtn = document.createElement('button');
                yesBtn.className = 'yes-btn'; yesBtn.innerText = 'はい ($200)';
                const noBtn = document.createElement('button');
                noBtn.className = 'no-btn'; noBtn.innerText = 'いいえ (解体)';
                yesBtn.onclick = () => resolve(true);
                noBtn.onclick = () => resolve(false);
                landAdminInteraction.appendChild(yesBtn);
                landAdminInteraction.appendChild(noBtn);
            });
            if (keep) {
                if (player.money >= 200) {
                    player.money -= 200;
                    log(`${player.name} は $200 を支払い、${space.name} の建物を引き継いだ。`);
                } else {
                    alert("お金が足りないため、建物は解体されました。");
                    space.houses = 0;
                    space.rent = space.baseRent;
                }
            } else {
                space.houses = 0;
                space.rent = space.baseRent;
                log(`${player.name} は ${space.name} の建物を解体した。`);
            }
        }
        updateSpaceUI(space);
        updatePlayerStats();
    }
}

function endGame() {
    localStorage.removeItem('monopoly_save');
    const resultModal = document.getElementById('result-modal');
    const resultList = document.getElementById('result-list');
    resultList.innerHTML = '';

    const results = players.map(p => {
        const propertyValue = p.properties.reduce((sum, id) => sum + BOARD_SPACES[id].price, 0);
        return {
            name: p.name,
            money: p.money,
            propertyValue: propertyValue,
            totalAssets: p.money + propertyValue,
            color: p.color
        };
    });

    results.sort((a, b) => {
        if (a.money < 0 && b.money >= 0) return 1;
        if (b.money < 0 && a.money >= 0) return -1;
        return b.totalAssets - a.totalAssets;
    });

    results.forEach((r, i) => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.padding = '1rem';
        item.style.margin = '0.5rem 0';
        item.style.background = 'rgba(255,255,255,0.05)';
        item.style.borderRadius = '0.5rem';
        item.style.borderLeft = `6px solid ${r.color}`;
        item.style.fontSize = '1.2rem';
        item.style.fontWeight = 'bold';

        item.innerHTML = `
            <span>${i + 1}位: ${r.name} ${r.money < 0 ? '<span style="color:#ef4444">(破産)</span>' : ''}</span>
            <span style="color:#4ade80">$${r.totalAssets}</span>
        `;
        resultList.appendChild(item);
    });

    resultModal.classList.add('active');
    playBuySound();
}

function updatePropertyChart() {
    if (!landChart || !buildingChart) return;
    landChart.data.datasets[0].data = players.map(p => p.properties.length);
    buildingChart.data.datasets[0].data = players.map(p => p.properties.reduce((sum, id) => sum + (BOARD_SPACES[id].houses || 0), 0));
    landChart.update();
    buildingChart.update();
}
