// ==========================================
// ESTAT GLOBAL DE LA CAMPANYA (Modularitat)
// ==========================================
let gameState = {
    gameId: "GAME_02",
    currentRoom: 1,
    survivors: ["Marcel", "Chishiya", "Niragi", "Kuina", "Aguni", "Ann"],
    eliminated: [],
    playerAlive: true
};

// ==========================================
// CONFIGURACIÓ DE LA SALA
// ==========================================
const TRACK_LENGTH = 3500;
const TRACK_WIDTH = 800;
const FINISH_Y = 200; 
const START_Y = TRACK_LENGTH - 200;

// Paràmetres NPCs (Velocitat, Risc/Tolerància, Temps Reacció ms)
const npcData = {
    Chishiya: { speed: 180, risk: 0.1, reaction: 100 },
    Niragi:   { speed: 250, risk: 0.7, reaction: 400 },
    Kuina:    { speed: 210, risk: 0.3, reaction: 250 },
    Aguni:    { speed: 200, risk: 0.2, reaction: 150 },
    Ann:      { speed: 190, risk: 0.05, reaction: 120 }
};

// ==========================================
// VARIABLES DEL JOC
// ==========================================
let canvas, ctx;
let lastTime = 0;
let isPlaying = false;
let timeRemaining = 300; // 5 minuts
let timerInterval;

// Fases de llum: "GREEN", "RED"
let lightState = "GREEN";
let nextLightChange = 0;
let timeSinceLightChange = 0;

let entities = [];
let player;

// Entrades
let keys = { w: false, a: false, s: false, d: false };
let joystick = { active: false, dx: 0, dy: 0 };
let camera = { x: 0, y: 0 };

// Diàlegs
let dialogueQueue = [];
let dialogueTimer = 0;
let eventFlags = { firstGreen: false, firstRed: false, halfTime: false, someoneDied: false };

// ==========================================
// INICIALITZACIÓ
// ==========================================
window.onload = () => {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    setupInputs();
    runIntro();
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// ==========================================
// INTRO CINEMATOGRÀFICA
// ==========================================
function runIntro() {
    setTimeout(() => { document.getElementById('intro-subtitle').classList.remove('hidden'); }, 1500);
    setTimeout(() => { document.getElementById('intro-name').classList.remove('hidden'); }, 3000);
    setTimeout(() => { 
        document.getElementById('intro-rules').classList.remove('hidden'); 
        document.getElementById('intro-rules').classList.add('fade-text');
    }, 4500);

    document.getElementById('btn-start').addEventListener('click', startGame);
    document.getElementById('btn-retry').addEventListener('click', () => location.reload());
    document.getElementById('btn-retry-time').addEventListener('click', () => location.reload());
    document.getElementById('btn-continue').addEventListener('click', goToNextRoom);
}

// ==========================================
// SISTEMA D'INPUTS (Desktop & Mobile)
// ==========================================
function setupInputs() {
    // Teclat
    window.addEventListener('keydown', e => {
        if(e.key === 'w' || e.key === 'ArrowUp') keys.w = true;
        if(e.key === 'a' || e.key === 'ArrowLeft') keys.a = true;
        if(e.key === 's' || e.key === 'ArrowDown') keys.s = true;
        if(e.key === 'd' || e.key === 'ArrowRight') keys.d = true;
    });
    window.addEventListener('keyup', e => {
        if(e.key === 'w' || e.key === 'ArrowUp') keys.w = false;
        if(e.key === 'a' || e.key === 'ArrowLeft') keys.a = false;
        if(e.key === 's' || e.key === 'ArrowDown') keys.s = false;
        if(e.key === 'd' || e.key === 'ArrowRight') keys.d = false;
    });

    // Joystick (Tàctil)
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if(isTouch) {
        document.getElementById('joystick-zone').classList.remove('hidden');
        const zone = document.getElementById('joystick-zone');
        const stick = document.getElementById('joystick-stick');
        let rect = zone.getBoundingClientRect();
        let baseR = 60;
        let stickR = 25;
        let centerX = rect.left + baseR;
        let centerY = rect.top + baseR;

        window.addEventListener('resize', () => {
            rect = zone.getBoundingClientRect();
            centerX = rect.left + baseR;
            centerY = rect.top + baseR;
        });

        zone.addEventListener('touchstart', handleTouch);
        zone.addEventListener('touchmove', handleTouch);
        zone.addEventListener('touchend', () => {
            joystick.active = false;
            joystick.dx = 0; joystick.dy = 0;
            stick.style.transform = `translate(0px, 0px)`;
        });

        function handleTouch(e) {
            e.preventDefault();
            joystick.active = true;
            let touch = e.touches[0];
            let dx = touch.clientX - centerX;
            let dy = touch.clientY - centerY;
            let distance = Math.sqrt(dx*dx + dy*dy);
            let maxDist = baseR - stickR;

            if(distance > maxDist) {
                dx = (dx / distance) * maxDist;
                dy = (dy / distance) * maxDist;
            }
            stick.style.transform = `translate(${dx}px, ${dy}px)`;
            joystick.dx = dx / maxDist;
            joystick.dy = dy / maxDist;
        }
    }
}

// ==========================================
// START GAME
// ==========================================
function startGame() {
    document.getElementById('screen-intro').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');

    // Inicialitzar Entitats
    entities = [];
    
    // Jugador (Marcel)
    player = {
        name: "Marcel", x: 0, y: START_Y, vx: 0, vy: 0,
        speed: 240, radius: 15, isPlayer: true, state: 'alive',
        color: '#ffffff'
    };
    entities.push(player);

    // Inicialitzar NPCs
    let startOffset = -150;
    for (let name of gameState.survivors) {
        if(name === "Marcel") continue;
        entities.push({
            name: name, x: startOffset, y: START_Y + (Math.random()*50 - 25), vx: 0, vy: 0,
            speed: npcData[name].speed, risk: npcData[name].risk, reaction: npcData[name].reaction,
            isPlayer: false, state: 'alive', stopTimer: 0,
            color: '#666666', radius: 14, targetX: startOffset + (Math.random()*100-50)
        });
        startOffset += 75;
    }

    updateSurvivorsHUD();
    lightState = "GREEN";
    scheduleLightChange();
    
    timeRemaining = 300;
    timerInterval = setInterval(tickTimer, 1000);
    
    queueDialogue("Chishiya", "No sembla complicat. Això és precisament el que em preocupa.");
    
    isPlaying = true;
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
    playSynth(300, 0.5, 'sine'); // So d'inici
}

// ==========================================
// BUCLE PRINCIPAL
// ==========================================
function gameLoop(timestamp) {
    if(!isPlaying) return;
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    updateGame(dt);
    drawGame();

    requestAnimationFrame(gameLoop);
}

function updateGame(dt) {
    timeSinceLightChange += dt * 1000;

    // Canvi de llum
    if(performance.now() > nextLightChange) {
        toggleLight();
    }

    // Actualitzar Entitats
    entities.forEach(ent => {
        if(ent.state !== 'alive') return;

        if(ent.isPlayer) {
            updatePlayer(ent, dt);
            checkDetection(ent);
            checkWin(ent);
        } else {
            updateNPC(ent, dt);
            checkDetection(ent);
        }
    });

    // Actualitzar Càmera (Segueix al jugador amb suavitat, orientada cap endavant)
    camera.x += (player.x - camera.x) * 5 * dt;
    let targetCamY = player.y - window.innerHeight * 0.25; // Mostrar més per davant
    camera.y += (targetCamY - camera.y) * 5 * dt;

    // Actualitzar Diàlegs
    updateDialogue(dt);
}

// ==========================================
// FÍSIQUES I DETECCIÓ DEL JUGADOR
// ==========================================
function updatePlayer(p, dt) {
    let inputX = 0; let inputY = 0;

    // Teclat
    if(keys.w) inputY -= 1;
    if(keys.s) inputY += 1;
    if(keys.a) inputX -= 1;
    if(keys.d) inputX += 1;

    // Joystick
    if(joystick.active) {
        inputX = joystick.dx;
        inputY = joystick.dy;
    }

    // Normalitzar diagonals
    let len = Math.sqrt(inputX*inputX + inputY*inputY);
    if(len > 1) { inputX /= len; inputY /= len; }

    // Aplicar forces
    const accel = 1500;
    const friction = 0.85; // Fricció (no frena instantàniament)

    p.vx += inputX * accel * dt;
    p.vy += inputY * accel * dt;

    p.vx *= friction;
    p.vy *= friction;

    // Limitar velocitat
    let currentSpeed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
    if(currentSpeed > p.speed) {
        p.vx = (p.vx / currentSpeed) * p.speed;
        p.vy = (p.vy / currentSpeed) * p.speed;
    }

    // Moviment real
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    // Límits pista
    if(p.x < -TRACK_WIDTH/2) p.x = -TRACK_WIDTH/2;
    if(p.x > TRACK_WIDTH/2) p.x = TRACK_WIDTH/2;
    if(p.y < FINISH_Y - 100) p.y = FINISH_Y - 100;
}

// ==========================================
// INTEL·LIGÈNCIA DELS NPCs
// ==========================================
function updateNPC(npc, dt) {
    let targetVx = 0;
    let targetVy = 0;

    if(lightState === "GREEN") {
        targetVy = -npc.speed;
        // Ajust lleuger cap al seu 'carril' per no apilar-se
        if(npc.x < npc.targetX - 5) targetVx = npc.speed * 0.3;
        else if(npc.x > npc.targetX + 5) targetVx = -npc.speed * 0.3;
        npc.stopTimer = 0; // Reseteja el timer d'aturada
    } else {
        // Està en RED. Calculem quan s'atura basat en reacció + risc
        npc.stopTimer += dt * 1000;
        let delayBeforeStop = npc.reaction + (Math.random() * npc.risk * 500); 
        
        // Micro risc aleatori: de vegades intenten avançar en vermell
        if(Math.random() < (npc.risk * 0.005)) delayBeforeStop += 1000;

        if(npc.stopTimer < delayBeforeStop) {
            targetVy = -npc.speed; // Continua movent-se (Risc!)
        }
    }

    // Aplicar
    npc.vx += (targetVx - npc.vx) * 10 * dt;
    npc.vy += (targetVy - npc.vy) * 10 * dt;

    npc.x += npc.vx * dt;
    npc.y += npc.vy * dt;
}

// ==========================================
// DETECCIÓ (RED LIGHT)
// ==========================================
function checkDetection(ent) {
    if(lightState === "GREEN") return;
    if(timeSinceLightChange < 300) return; // Gràcia de 300ms per inèrcia/reacció humana justa

    let movementThreshold = 25; // Sensibilitat (permet micro-moviment per frenada)
    let currentSpeed = Math.sqrt(ent.vx*ent.vx + ent.vy*ent.vy);

    if(currentSpeed > movementThreshold) {
        eliminate(ent);
    }
}

function eliminate(ent) {
    ent.state = 'dead';
    ent.vx = 0; ent.vy = 0;
    
    playSynth(150, 0.2, 'square'); // So de tret/eliminació

    if(ent.isPlayer) {
        isPlaying = false;
        clearInterval(timerInterval);
        
        // Micro fase DETECTED
        const detScreen = document.getElementById('screen-detected');
        detScreen.classList.remove('hidden');
        
        setTimeout(() => {
            detScreen.classList.add('hidden');
            gameState.playerAlive = false;
            document.getElementById('screen-gameover').classList.remove('hidden');
        }, 800);
    } else {
        // NPC Mor
        gameState.survivors = gameState.survivors.filter(name => name !== ent.name);
        gameState.eliminated.push(ent.name);
        updateSurvivorsHUD();
        
        if(!eventFlags.someoneDied) {
            eventFlags.someoneDied = true;
            queueDialogue("Ann", "No ha frenat a temps.");
        }
    }
}

// ==========================================
// CONTROL DE LLUMS (SISTEMA PROCEDURAL)
// ==========================================
function scheduleLightChange() {
    // Evitar patrons: randomitzar durada
    let dur = 0;
    if(lightState === "GREEN") {
        dur = Math.random() * 3000 + 2000; // 2s - 5s
    } else {
        dur = Math.random() * 3500 + 1500; // 1.5s - 5s
    }
    nextLightChange = performance.now() + dur;
}

function toggleLight() {
    timeSinceLightChange = 0;
    const indicator = document.getElementById('light-indicator');

    if(lightState === "GREEN") {
        lightState = "RED";
        indicator.textContent = "RED LIGHT";
        indicator.className = "light-indicator red";
        playSynth(400, 0.4, 'sawtooth'); // So aspre gir figura

        if(!eventFlags.firstRed) {
            eventFlags.firstRed = true;
            queueDialogue("Aguni", "Quiet.");
        }
    } else {
        lightState = "GREEN";
        indicator.textContent = "GREEN LIGHT";
        indicator.className = "light-indicator green";
        playSynth(800, 0.2, 'sine'); // So net

        if(!eventFlags.firstGreen) {
            eventFlags.firstGreen = true;
            queueDialogue("Niragi", "VINGA! MOVEU-VOS!");
        }
    }
    scheduleLightChange();
}

// ==========================================
// CONDICIONS DE VICTÒRIA I TEMPS
// ==========================================
function checkWin(p) {
    if(p.y <= FINISH_Y && p.state === 'alive') {
        isPlaying = false;
        clearInterval(timerInterval);
        document.getElementById('final-survivors').textContent = "SURVIVORS: " + gameState.survivors.length;
        document.getElementById('screen-win').classList.remove('hidden');
    }
}

function tickTimer() {
    if(!isPlaying) return;
    timeRemaining--;
    let m = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
    let s = (timeRemaining % 60).toString().padStart(2, '0');
    
    let timerEl = document.getElementById('timer');
    timerEl.textContent = `${m}:${s}`;

    if(timeRemaining <= 60 && !eventFlags.halfTime) {
        eventFlags.halfTime = true;
        timerEl.classList.add('timer-warning');
        queueDialogue("Kuina", "Vinga, ja gairebé hi som.");
    }
    if(timeRemaining <= 15) {
        timerEl.className = "hud-center timer-danger";
    }

    if(timeRemaining <= 0) {
        isPlaying = false;
        clearInterval(timerInterval);
        document.getElementById('screen-timeup').classList.remove('hidden');
    }
}

function updateSurvivorsHUD() {
    document.getElementById('survivors-count').textContent = "SURVIVORS: " + gameState.survivors.length;
}

// ==========================================
// RENDERITZAT (CANVAS)
// ==========================================
function drawGame() {
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // Translació Càmera (centre la pantalla a X i ajusta Y)
    ctx.translate(canvas.width / 2 - camera.x, canvas.height / 2 - camera.y);

    // 1. Terra i Límits Pista
    ctx.fillStyle = '#111';
    ctx.fillRect(-TRACK_WIDTH/2, FINISH_Y, TRACK_WIDTH, START_Y - FINISH_Y + 200);
    
    // Línies laterals (Neon subtil segons llum)
    ctx.strokeStyle = lightState === "GREEN" ? 'rgba(42, 255, 123, 0.2)' : 'rgba(255, 42, 42, 0.2)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-TRACK_WIDTH/2, FINISH_Y); ctx.lineTo(-TRACK_WIDTH/2, START_Y + 500);
    ctx.moveTo(TRACK_WIDTH/2, FINISH_Y); ctx.lineTo(TRACK_WIDTH/2, START_Y + 500);
    ctx.stroke();

    // 2. Línia de sortida / Meta
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(-TRACK_WIDTH/2, FINISH_Y, TRACK_WIDTH, 20);

    // 3. Figura / Controlador al fons
    drawController();

    // 4. Entitats (NPCs + Jugador)
    // Ordenar per Y per a correcta superposició (pseudo profunditat)
    entities.sort((a,b) => a.y - b.y);

    entities.forEach(ent => {
        ctx.beginPath();
        ctx.arc(ent.x, ent.y, ent.radius, 0, Math.PI * 2);
        
        if(ent.state === 'dead') {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        } else {
            ctx.fillStyle = ent.color;
            if(ent.isPlayer) {
                // Aura del jugador
                ctx.shadowColor = '#fff';
                ctx.shadowBlur = 10;
            }
        }
        ctx.fill();
        ctx.shadowBlur = 0; // Reset

        // Noms
        if(ent.state === 'alive') {
            ctx.fillStyle = ent.isPlayer ? '#fff' : '#888';
            ctx.font = '12px Courier Prime';
            ctx.textAlign = 'center';
            ctx.fillText(ent.name, ent.x, ent.y - 25);
        }
    });

    ctx.restore();

    // 5. Overlay FX (Vinyeta fosca / Boira de profunditat al top)
    let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, 'rgba(0,0,0,0.9)');
    grad.addColorStop(0.3, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawController() {
    let ctrlY = FINISH_Y - 100;
    ctx.save();
    
    // Aura / Focus de la figura
    if(lightState === "RED") {
        let alpha = Math.min(1, timeSinceLightChange / 200); // Apareix ràpid
        let grad = ctx.createRadialGradient(0, ctrlY, 10, 0, ctrlY, 400);
        grad.addColorStop(0, `rgba(255, 0, 0, ${0.4 * alpha})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(-400, ctrlY - 200, 800, 800);
    }
    
    // Figura física (simplificada)
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(0, ctrlY, 20, 0, Math.PI * 2);
    ctx.fill();

    // "Ulls" / Visió si és RED
    if(lightState === "RED") {
        ctx.fillStyle = '#ff2a2a';
        ctx.shadowColor = '#ff2a2a';
        ctx.shadowBlur = 15;
        ctx.fillRect(-10, ctrlY + 15, 20, 5); // Mira "cap a baix" (als jugadors)
    }

    ctx.restore();
}

// ==========================================
// SISTEMA DE DIÀLEGS
// ==========================================
function queueDialogue(name, text) {
    dialogueQueue.push({ name, text });
}

function updateDialogue(dt) {
    const container = document.getElementById('dialogue-container');
    const nameEl = document.getElementById('dialogue-name');
    const textEl = document.getElementById('dialogue-text');

    if(dialogueTimer > 0) {
        dialogueTimer -= dt;
        if(dialogueTimer <= 0) {
            container.classList.add('hidden');
        }
    } else if(dialogueQueue.length > 0) {
        let msg = dialogueQueue.shift();
        nameEl.textContent = msg.name;
        textEl.textContent = `«${msg.text}»`;
        container.classList.remove('hidden');
        dialogueTimer = 3.5; // Mostra 3.5 segons
    }
}

// ==========================================
// SO BÀSIC (Web Audio API)
// ==========================================
let actx;
function playSynth(freq, vol, type) {
    try {
        if(!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
        let osc = actx.createOscillator();
        let gain = actx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, actx.currentTime);
        
        // Attack/Decay ràpid
        gain.gain.setValueAtTime(0, actx.currentTime);
        gain.gain.linearRampToValueAtTime(vol, actx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.3);
        
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start();
        osc.stop(actx.currentTime + 0.35);
    } catch(e) {}
}

// ==========================================
// TRANSICIÓ A SALA 02
// ==========================================
function goToNextRoom() {
    alert("TRANSICIÓ AL GAME 02 - SALA 02.\nEstat de supervivents guardat:\n" + gameState.survivors.join(", "));
    // Aquí es llançaria la funció global del sistema principal.
}

