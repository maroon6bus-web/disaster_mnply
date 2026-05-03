const BOARD_SPACES = [
    { id: 0, name: 'GO', type: 'go', color: '#fff' },
    { id: 1, name: '鶴橋', type: 'property', price: 60, rent: 2, color: '#8b4513' },
    { id: 2, name: '共同基金', type: 'chest', color: '#fff' },
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
    { id: 17, name: '共同基金', type: 'chest', color: '#fff' },
    { id: 18, name: 'アメ村', type: 'property', price: 180, rent: 14, color: '#ffa500' },
    { id: 19, name: '南船場', type: 'property', price: 200, rent: 16, color: '#ffa500' },
    { id: 20, name: '駐車場', type: 'parking', color: '#fff' },
    { id: 21, name: '梅田', type: 'property', price: 220, rent: 18, color: '#ff0000' },
    { id: 22, name: 'チャンス', type: 'chance', color: '#fff' },
    { id: 23, name: '中津', type: 'property', price: 220, rent: 18, color: '#ff0000' },
    { id: 24, name: '中崎町', type: 'property', price: 240, rent: 20, color: '#ff0000' },
    { id: 25, name: '難波', type: 'railroad', price: 200, rent: 25, color: '#ccc' },
    { id: 26, name: '北新地', type: 'property', price: 260, rent: 22, color: '#ffff00' },
    { id: 27, name: '堂島', type: 'property', price: 260, rent: 22, color: '#ffff00' },
    { id: 28, name: '水道局', type: 'utility', price: 150, rent: 10, color: '#ccc' },
    { id: 29, name: '淀屋橋', type: 'property', price: 280, rent: 24, color: '#ffff00' },
    { id: 30, name: '刑務所へ', type: 'gotojail', color: '#fff' },
    { id: 31, name: '御堂筋', type: 'property', price: 300, rent: 26, color: '#008000' },
    { id: 32, name: '本町', type: 'property', price: 300, rent: 26, color: '#008000' },
    { id: 33, name: '共同基金', type: 'chest', color: '#fff' },
    { id: 34, name: '中之島', type: 'property', price: 320, rent: 28, color: '#008000' },
    { id: 35, name: '天王寺', type: 'railroad', price: 200, rent: 25, color: '#ccc' },
    { id: 36, name: 'チャンス', type: 'chance', color: '#fff' },
    { id: 37, name: '万博公園', type: 'property', price: 350, rent: 35, color: '#00008b' },
    { id: 38, name: '物品税', type: 'tax', price: 100, color: '#fff' },
    { id: 39, name: '大阪城', type: 'property', price: 400, rent: 50, color: '#00008b' }
];

// 初期価格（基準値）と家の数を保存しておく
BOARD_SPACES.forEach(space => {
    if (space.price !== undefined) {
        space.basePrice = space.price;
        space.baseRent = space.rent;
        if (space.type === 'property') {
            space.houses = 0;
        }
    }
});

const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308'];
let players = [];
let currentPlayerIndex = 0;
let diceValue = 0;
let doubleCount = 0;
let assetChart;
let roundHistory = {
    labels: [],
    datasets: []
};

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

// Start Game Setup
document.querySelectorAll('.select-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        initAudio();
        playClickSound();
        const humanCount = parseInt(e.target.dataset.players);
        startGame(humanCount);
    });
});

function startGame(humanCount) {
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
            properties: []
        });
    }

    startScreen.classList.remove('active');
    gameScreen.classList.add('active');

    initBoard();
    updatePlayerStats();
    initChart(); // Initialize Chart
    startTurn();
}

function initChart() {
    const ctx = document.getElementById('asset-chart').getContext('2d');
    
    // Reset history
    roundHistory = {
        labels: ['開始'],
        datasets: players.map((p, i) => ({
            label: p.name,
            data: [p.money],
            borderColor: p.color,
            backgroundColor: p.color + '33',
            tension: 0.3,
            borderWidth: 3,
            pointRadius: 4
        }))
    };

    if (assetChart) assetChart.destroy();
    
    assetChart = new Chart(ctx, {
        type: 'line',
        data: roundHistory,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: { color: '#f8fafc', font: { weight: 'bold' } }
                }
            }
        }
    });
}

// Board Initialization
function initBoard() {
    boardElement.innerHTML = '';

    // Create spaces
    BOARD_SPACES.forEach((space, index) => {
        const spaceEl = document.createElement('div');
        spaceEl.className = 'space';
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
            innerHTML += `<div class="space-color" style="background-color: ${space.color}"></div>`;
            if (space.type === 'property') {
                innerHTML += `<div class="house-container" id="houses-${index}"></div>`;
            }
            innerHTML += `<div class="space-name">${space.name}</div>`;
            innerHTML += `<div class="space-price">$${space.price}</div>`;
            innerHTML += `<div class="owner-indicator" id="owner-${index}"></div>`;
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

// Turn Logic
function startTurn() {
    updatePlayerStats();
    const player = players[currentPlayerIndex];
    currentTurnDisplay.innerText = `${player.name} のターン`;
    currentTurnDisplay.style.color = player.color;

    rollBtn.style.visibility = 'visible';
    endTurnBtn.style.display = 'none';

    updateBuildButtonVisibility();

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
        setTimeout(() => {
            tryCPUBuild(player);
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
    handleRoll();
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

        const total = d1 + d2;
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

        // プレイヤー1（先頭）がGOを通過したら地価変動イベントを発生
        if (player.id === 0) {
            triggerMarketCrash();
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
            const rent = space.rent; // Simplification: fixed rent
            player.money -= rent;
            players[space.owner].money += rent;
            playPaySound();
            log(`${player.name} は ${players[space.owner].name} に家賃 $${rent} を支払った。`);
            updatePlayerStats();
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
    } else if (space.type === 'chance' || space.type === 'chest') {
        handleChance(player);
        return; // handleChance の中でターン終了などのフローを制御します
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
                propertyModal.classList.remove('active');
                log(`${player.name} は ${space.name} の購入を見送った。`);
                showEndTurn();
            };

            dynamicBuyBtn.addEventListener('click', currentBuyHandler);
            dynamicSkipBtn.addEventListener('click', currentSkipHandler);
        }
    } else {
        log(`${player.name} はお金が足りず買えない。`);
        showEndTurn();
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
    if (player.money < 0) {
        log(`!! ${player.name} は破産した !!`);
        // Basic bankruptcy handling
    }
}

function showEndTurn() {
    rollBtn.style.visibility = 'hidden';
    buildBtn.style.display = 'none';
    endTurnBtn.style.display = 'none';

    // 1.5秒待ってから自動で次のターンへ
    setTimeout(endTurn, 1500);
}

function endTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    
    // ラウンドが一周（currentPlayerIndexが0に戻る）したらチャートを更新
    if (currentPlayerIndex === 0) {
        updateChartData();
    }
    
    startTurn();
}

function updateChartData() {
    if (!assetChart) return;

    const roundNumber = roundHistory.labels.length;
    roundHistory.labels.push(`R${roundNumber}`);

    players.forEach((p, i) => {
        // 総資産 = 所持金 + 所有している土地の現在価格の合計
        const propertyValue = p.properties.reduce((sum, id) => sum + BOARD_SPACES[id].price, 0);
        const totalAssets = p.money + propertyValue;
        roundHistory.datasets[i].data.push(totalAssets);
    });

    assetChart.update();
}

// 地価変動イベント
function triggerMarketCrash() {
    const colorGroups = [
        { color: '#8b4513', name: '茶色' },
        { color: '#87ceeb', name: '水色' },
        { color: '#ffc0cb', name: 'ピンク' },
        { color: '#ffa500', name: 'オレンジ' },
        { color: '#ff0000', name: '赤色' },
        { color: '#ffff00', name: '黄色' },
        { color: '#008000', name: '緑色' },
        { color: '#00008b', name: '紺色' }
    ];

    const group = colorGroups[Math.floor(Math.random() * colorGroups.length)];

    // 0.5倍 〜 2.0倍 (0.1刻み)
    const multiplier = (Math.floor(Math.random() * 16) + 5) / 10;

    BOARD_SPACES.forEach(space => {
        if (space.type === 'property') {
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

