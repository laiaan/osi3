"use strict";

// ==========================================
// 1. GESTIÓ D'ESTAT (Persistència de la campanya)
// ==========================================
let gameState = {
    currentRoom: 2,
    survivors: ["Marcel", "Chishiya", "Niragi", "Kuina", "Aguni", "Ann"], // Fallback si no hi ha dades
    eliminated: [],
    roomHistory: []
};

// Intentar carregar l'estat de la Sala 01
const savedState = localStorage.getItem("game02_state");
if (savedState) {
    try {
        const parsed = JSON.parse(savedState);
        gameState.survivors = parsed.survivors || gameState.survivors;
        gameState.eliminated = parsed.eliminated || gameState.eliminated;
        gameState.roomHistory = parsed.roomHistory || [];
    } catch (e) { console.error("Error carregant estat", e); }
}

// ==========================================
// 2. CONFIGURACIÓ DE L'ESCENARI (MAPA FÍSIC)
// ==========================================
// Escenari de 2400x1800 píxels.
// A - Vestíbul (centre-baix)
// B - Passadís (esquerra a dreta)
// C - Oficines (dalt a l'esquerra)
// D - Magatzem (baix a la dreta)
// E - Sortida (dalt a la dreta)

const mapBounds = { w: 2400, h: 1800 };

const rooms = [
    { id: "A", x: 1000, y: 1200, w: 400, h: 400, color: "#222" }, // Vestíbul
    { id: "B", x: 400, y: 800, w: 1600, h: 250, color: "#1e1e24" }, // Passadís
    { id: "C1", x: 400, y: 400, w: 300, h: 300, color: "#2a2a30" }, // Oficina 1
    { id: "C2", x: 750, y: 400, w: 300, h: 300, color: "#2a2a30" }, // Oficina 2
    { id: "D", x: 1600, y: 1200, w: 600, h: 500, color: "#1c1c1c" }, // Magatzem
    { id: "E", x: 1500, y: 200, w: 500, h: 500, color: "#151e24" }  // Zona Sortida
];

// Parets físiques per col·lisions i visió
const walls = [
    // Límits exteriors
    { x: 0, y: 0, w: 2400, h: 50 }, { x: 0, y: 1750, w: 2400, h: 50 },
    { x: 0, y: 0, w: 50, h: 1800 }, { x: 2350, y: 0, w: 50, h: 1800 },
    // Divisòries
    { x: 350, y: 700, w: 1700, h: 100 }, // Paret dalt passadís
    { x: 350, y: 1050, w: 650, h: 150 }, // Paret baix passadís esq
    { x: 1400, y: 1050, w: 650, h: 150 }, // Paret baix passadís dreta
    { x: 700, y: 350, w: 50, h: 350 }, // Separació Oficines
    { x: 1050, y: 350, w: 50, h: 350 }, // Fi Oficines
    { x: 1550, y: 1200, w: 50, h: 550 }, // Separació Magatzem
    { x: 1450, y: 150, w: 50, h: 550 }, // Separació Sortida
    // Obstacles interiors (Amagatalls)
    { x: 450, y: 450, w: 150, h: 50 }, // Taula Ofi 1
    { x: 800, y: 450, w: 50, h: 150 }, // Prestatge Ofi 2
    { x: 1700, y: 1300, w: 200, h: 100 }, // Caixes Magatzem
    { x: 2000, y: 1500, w: 100, h: 200 } // Caixes Magatzem
];

const exitZone = { x: 1600, y: 250, w: 300, h: 300 };
let exitActive = false;
let exitTimer = 10;
let exitOpen = false;
let exitInterval = null;

// Punts de navegació per la IA
const waypoints = [
    { x: 1200, y: 1400 }, { x: 1200, y: 1100 }, { x: 1200, y: 925 }, // Vestíbul a Passadís
    { x: 550, y: 925 }, { x: 1800, y: 925 }, // Passadís
    { x: 550, y: 600 }, { x: 900, y: 600 }, // Oficines
    { x: 1800, y: 1150 }, { x: 1900, y: 1400 }, // Magatzem
    { x: 1750, y: 550 } // Zona Sortida
];

// ==========================================
// 3. MOTOR DEL JOC
// ==========================================
let canvas, ctx;
let lastTime = 0;
let isPlaying = false;
let gameTime = 300; // 5 minuts
let timerInterval;

let entities = [];
let player;
let hunterEntity = null;
let secretHunterName = "";

// Controls
let keys = { w: false, a: false, s: false, d: false, shift: false };
let joystick = { active: false, dx: 0, dy: 0 };
let isSneaking = false;
let camera = { x: 1200, y: 1400 };

let floatingDialogues = [];

// ==========================================
// 4. INICIALITZACIÓ I INTRODUCCIÓ
// ==========================================
window.onload = () => {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    setupInputs();

    document.getElementById('btn-init').addEventListener('click', startCinematic);
    document.getElementById('btn-retry').addEventListener('click', restartGame);
    document.getElementById('btn-continue').addEventListener('click', () => alert("PROVA 03 no implementada encara."));
};

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }

function startCinematic() {
    document.getElementById('btn-init').disabled = true;
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('intro-screen').classList.remove('hidden');
    
    setupEntities();
    camera.x = 1200; camera.y = 1400; // Centre vestíbul
    drawGame(true);

    const dialogues = [
        { char: "Kuina", text: "On coi ens han portat ara?", delay: 2000 },
        { char: "Niragi", text: "Fa olor de lloc abandonat.", delay: 4000 },
        { char: "Ann", text: "No sembla que siguem aquí per casualitat.", delay: 6000 },
        { char: "Aguni", text: "Estigueu alerta.", delay: 8000 },
        { char: "Chishiya", text: "Jo que vosaltres no m'allunyaria gaire.", delay: 11000 }
    ];

    const cineText = document.getElementById('cinematic-text');
    dialogues.forEach(d => {
        setTimeout(() => {
            cineText.innerHTML = `<span style="color:#aaa; font-size:1.1em;">${d.char}</span><br><br>«${d.text}»`;
        }, d.delay);
    });

    setTimeout(() => {
        cineText.innerHTML = "";
        document.getElementById('system-screen').classList.remove('hidden');
        playSystemVoice();
    }, 15000);
}

function playSystemVoice() {
    const lines = [
        "PROVA 02.",
        "ENTRE VOSALTRES HI HA UN CAÇADOR.",
        "EL CAÇADOR HA D'ELIMINAR ELS ALTRES JUGADORS.",
        "ELS SUPERVIVENTS HAN D'ARRIBAR A LA SORTIDA.",
        "EL MOVIMENT RÀPID PRODUEIX SOROLL.",
        "EL MOVIMENT LENT REDUEIX EL SOROLL.",
        "SI EL CAÇADOR US PERCEP, CORREU O AMAGUEU-VOS.",
        "LA SORTIDA NECESSITA DEU SEGONS PER ACTIVAR-SE.",
        "TEMPS DISPONIBLE: CINC MINUTS.",
        "SOBREVIVIU."
    ];

    const subEl = document.getElementById('system-subtitles');
    let currentLine = 0;
    
    function speakNext() {
        if (currentLine >= lines.length) {
            document.getElementById('intro-screen').classList.add('hidden');
            startGame();
            return;
        }

        let text = lines[currentLine];
        subEl.textContent = text;
        
        let readTime = (text.length * 60) + 800;

        // Intentar veu sintètica si disponible
        if ('speechSynthesis' in window) {
            let ut = new SpeechSynthesisUtterance(text);
            ut.lang = 'ca-ES'; ut.pitch = 0.5; ut.rate = 0.9;
            window.speechSynthesis.speak(ut);
        }

        setTimeout(() => { currentLine++; speakNext(); }, readTime);
    }
    speakNext();
}

// ==========================================
// 5. ENTITATS I IA
// ==========================================
function setupEntities() {
    entities = [];
    
    player = {
        name: "Marcel", x: 1200, y: 1500, vx: 0, vy: 0,
        radius: 14, isPlayer: true, state: 'alive', color: '#fff',
        speed: 250, noise: 0, isHunter: false
    };
    entities.push(player);

    const npcProps = {
        Chishiya: { color: "#ddd" }, Niragi: { color: "#ff4444" },
        Ann: { color: "#88ccff" }, Kuina: { color: "#ff88cc" }, Aguni: { color: "#aaa" }
    };

    let startX = 1100;
    let possibleHunters = [];

    gameState.survivors.forEach(name => {
        if(name === "Marcel") return;
        possibleHunters.push(name);
        entities.push({
            name: name, x: startX, y: 1400 + Math.random()*100, vx: 0, vy: 0,
            radius: 14, isPlayer: false, state: 'alive', color: npcProps[name].color,
            speed: 200 + Math.random()*50, isHunter: false,
            aiState: 'patrol', targetWp: waypoints[Math.floor(Math.random()*waypoints.length)],
            waitTimer: 0
        });
        startX += 50;
    });

    // Escollir el caçador secretament
    if (possibleHunters.length > 0) {
        secretHunterName = possibleHunters[Math.floor(Math.random() * possibleHunters.length)];
        hunterEntity = entities.find(e => e.name === secretHunterName);
        hunterEntity.isHunter = true;
        hunterEntity.speed = 265; // Lleugerament més ràpid que el jugador caminant, però més lent que corrent
        hunterEntity.aiState = 'hunter_patrol';
    }
}

// ==========================================
// 6. INICI DEL BUCLE
// ==========================================
function startGame() {
    document.getElementById('hud').classList.remove('hidden');
    document.getElementById('survivors-count').textContent = `SUPERVIVENTS: ${gameState.survivors.length}`;
    
    gameTime = 300;
    timerInterval = setInterval(tickTimer, 1000);
    
    isPlaying = true;
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

function restartGame() {
    document.getElementById('screen-gameover').classList.add('hidden');
    setupEntities();
    exitActive = false; exitOpen = false; exitTimer = 10;
    document.getElementById('exit-timer-container').classList.add('hidden');
    clearInterval(exitInterval);
    startGame();
}

function gameLoop(timestamp) {
    if(!isPlaying) return;
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    updateGame(dt);
    drawGame();
    requestAnimationFrame(gameLoop);
}

// ==========================================
// 7. LÒGICA DE JOC I COL·LISIONS
// ==========================================
function updateGame(dt) {
    // Jugador
    updatePlayer(dt);
    
    // IA
    entities.forEach(ent => {
        if(ent.isPlayer || ent.state === 'dead') return;
        if(ent.isHunter) updateHunterAI(ent, dt);
        else updateNPCAI(ent, dt);
        
        handleWallCollisions(ent);
    });

    handleWallCollisions(player);

    // Càmera
    camera.x += (player.x - camera.x) * 5 * dt;
    camera.y += (player.y - camera.y) * 5 * dt;

    updateDialogues(dt);
    checkExit();
}

function updatePlayer(dt) {
    let inputX = 0; let inputY = 0;
    if(keys.w) inputY -= 1; if(keys.s) inputY += 1;
    if(keys.a) inputX -= 1; if(keys.d) inputX += 1;

    if(joystick.active) { inputX = joystick.dx; inputY = joystick.dy; }
    let len = Math.sqrt(inputX*inputX + inputY*inputY);
    if(len > 1) { inputX /= len; inputY /= len; }

    isSneaking = keys.shift || document.getElementById('btn-stealth').classList.contains('active');
    
    if (isSneaking) {
        document.getElementById('stealth-indicator').classList.remove('hidden');
    } else {
        document.getElementById('stealth-indicator').classList.add('hidden');
    }

    let currentSpeed = isSneaking ? player.speed * 0.5 : player.speed;
    
    player.vx = inputX * currentSpeed;
    player.vy = inputY * currentSpeed;
    
    player.x += player.vx * dt;
    player.y += player.vy * dt;

    // Soroll
    player.noise = (len > 0.1 && !isSneaking) ? 150 : (len > 0.1 ? 30 : 0);
}

function handleWallCollisions(ent) {
    for (let w of walls) {
        // AABB Collision
        if (ent.x + ent.radius > w.x && ent.x - ent.radius < w.x + w.w &&
            ent.y + ent.radius > w.y && ent.y - ent.radius < w.y + w.h) {
            
            // Empènyer cap a fora
            let overlapX = Math.min(ent.x + ent.radius - w.x, w.x + w.w - (ent.x - ent.radius));
            let overlapY = Math.min(ent.y + ent.radius - w.y, w.y + w.h - (ent.y - ent.radius));
            
            if (overlapX < overlapY) {
                if (ent.x < w.x + w.w/2) ent.x -= overlapX; else ent.x += overlapX;
            } else {
                if (ent.y < w.y + w.h/2) ent.y -= overlapY; else ent.y += overlapY;
            }
        }
    }
}

// Raycast bàsic per Línia de Visió
function hasLineOfSight(x1, y1, x2, y2) {
    for (let w of walls) {
        if (lineIntersectsRect(x1, y1, x2, y2, w.x, w.y, w.w, w.h)) return false;
    }
    return true;
}

function lineIntersectsRect(x1, y1, x2, y2, rx, ry, rw, rh) {
    let left = lineIntersectsLine(x1, y1, x2, y2, rx, ry, rx, ry+rh);
    let right = lineIntersectsLine(x1, y1, x2, y2, rx+rw, ry, rx+rw, ry+rh);
    let top = lineIntersectsLine(x1, y1, x2, y2, rx, ry, rx+rw, ry);
    let bottom = lineIntersectsLine(x1, y1, x2, y2, rx, ry+rh, rx+rw, ry+rh);
    return left || right || top || bottom;
}

function lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
    let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1);
}

// ==========================================
// 8. INTEL·LIGÈNCIA ARTIFICIAL
// ==========================================
function updateHunterAI(h, dt) {
    // 1. Comprovar Visió sobre el jugador i NPCs
    let seesPlayer = false;
    let distToPlayer = Math.hypot(player.x - h.x, player.y - h.y);
    
    if (distToPlayer < 600 && hasLineOfSight(h.x, h.y, player.x, player.y)) {
        seesPlayer = true;
    }

    // Comprovar si escolta soroll del jugador
    let hearsPlayer = (distToPlayer < 300 && player.noise > 50 && !seesPlayer && hasLineOfSight(h.x, h.y, player.x, player.y)); // El so passa per portes obertes

    // ESTAM A LA VISTA
    if (seesPlayer) {
        if (h.aiState !== 'chasing_player') {
            h.aiState = 'chasing_player';
            playBeep(200, 'sawtooth', 0.5); // So d'alerta
            if(Math.random() > 0.5) showNotification("EL CAÇADOR T'HA VIST!");
        }
        moveToTarget(h, player.x, player.y, dt, 1.2); // Corre un 20% més ràpid
        
        // Captura
        if (distToPlayer < h.radius + player.radius + 10) {
            handlePlayerCaught();
        }
    } 
    // ESCOLTA SOROLL
    else if (hearsPlayer) {
        h.aiState = 'investigating';
        h.targetX = player.x; h.targetY = player.y;
        moveToTarget(h, h.targetX, h.targetY, dt, 1.0);
    }
    // INVESTIGANT O CERCA
    else if (h.aiState === 'chasing_player' && !seesPlayer) {
        h.aiState = 'searching';
        h.waitTimer = 3.0; // Busca durant 3 segons al lloc on l'ha perdut
    }
    else if (h.aiState === 'searching') {
        h.waitTimer -= dt;
        if (h.waitTimer <= 0) {
            h.aiState = 'hunter_patrol';
            h.targetWp = waypoints[Math.floor(Math.random()*waypoints.length)];
        }
    }
    // PATRULLA STANDARD
    else {
        h.aiState = 'hunter_patrol';
        let distWp = Math.hypot(h.targetWp.x - h.x, h.targetWp.y - h.y);
        if (distWp < 30) {
            h.targetWp = waypoints[Math.floor(Math.random()*waypoints.length)];
        }
        moveToTarget(h, h.targetWp.x, h.targetWp.y, dt, 0.8);
    }
}

function updateNPCAI(npc, dt) {
    if (npc.waitTimer > 0) {
        npc.waitTimer -= dt; return;
    }

    // Fugir si el caçador és a prop
    if (hunterEntity && Math.hypot(hunterEntity.x - npc.x, hunterEntity.y - npc.y) < 400 && hasLineOfSight(npc.x, npc.y, hunterEntity.x, hunterEntity.y)) {
        // Fugir en direcció contrària
        let dx = npc.x - hunterEntity.x;
        let dy = npc.y - hunterEntity.y;
        let len = Math.hypot(dx, dy);
        moveToTarget(npc, npc.x + (dx/len)*200, npc.y + (dy/len)*200, dt, 1.2);
        
        if (Math.random() < 0.01) addFloatingDialogue(npc.name, "JA VE!");

        // Si el caçador l'atrapa
        if (len < npc.radius + hunterEntity.radius + 10 && hunterEntity.aiState === 'hunter_patrol') {
            killNPC(npc);
        }
    } 
    // Patrulla normal (buscant la sortida teòricament)
    else {
        let distWp = Math.hypot(npc.targetWp.x - npc.x, npc.targetWp.y - npc.y);
        if (distWp < 30) {
            npc.targetWp = waypoints[Math.floor(Math.random()*waypoints.length)];
            npc.waitTimer = Math.random() * 2; // S'atura una mica
        }
        moveToTarget(npc, npc.targetWp.x, npc.targetWp.y, dt, 0.7); // Camina a poc a poc
    }
}

function moveToTarget(ent, tx, ty, dt, speedMult) {
    let dx = tx - ent.x; let dy = ty - ent.y;
    let dist = Math.hypot(dx, dy);
    if (dist > 1) {
        ent.vx = (dx/dist) * ent.speed * speedMult;
        ent.vy = (dy/dist) * ent.speed * speedMult;
        ent.x += ent.vx * dt;
        ent.y += ent.vy * dt;
    }
}

function killNPC(npc) {
    npc.state = 'dead';
    gameState.survivors = gameState.survivors.filter(n => n !== npc.name);
    gameState.eliminated.push(npc.name);
    document.getElementById('survivors-count').textContent = `SUPERVIVENTS: ${gameState.survivors.length}`;
    playBeep(100, 'square', 0.6);
    addFloatingDialogue(npc.name, "NO!");
}

function handlePlayerCaught() {
    isPlaying = false;
    clearInterval(timerInterval);
    clearInterval(exitInterval);
    playBeep(100, 'square', 0.8);
    setTimeout(() => {
        document.getElementById('screen-gameover').classList.remove('hidden');
    }, 1000);
}

// ==========================================
// 9. MECÀNICA DE LA SORTIDA
// ==========================================
function checkExit() {
    let inExit = (player.x > exitZone.x && player.x < exitZone.x + exitZone.w &&
                  player.y > exitZone.y && player.y < exitZone.y + exitZone.h);

    if (inExit && !exitActive && !exitOpen) {
        exitActive = true;
        document.getElementById('exit-timer-container').classList.remove('hidden');
        showNotification("MANTINGUES LA POSICIÓ!");
        
        exitInterval = setInterval(() => {
            exitTimer--;
            document.getElementById('exit-timer-text').textContent = exitTimer;
            
            // Soroll per atraure el caçador!
            playBeep(500, 'sine', 0.3);
            player.noise = 200; 

            if (exitTimer <= 0) {
                clearInterval(exitInterval);
                exitOpen = true;
                document.getElementById('exit-timer-container').classList.add('hidden');
                showNotification("SORTIDA OBERTA!");
            }
        }, 1000);
    } 
    else if (!inExit && exitActive && !exitOpen) {
        // Surt de la zona abans que s'obri
        clearInterval(exitInterval);
        exitActive = false; exitTimer = 10;
        document.getElementById('exit-timer-container').classList.add('hidden');
        document.getElementById('exit-timer-text').textContent = "10";
    }

    if (exitOpen && inExit) {
        triggerWin();
    }
}

function triggerWin() {
    isPlaying = false;
    clearInterval(timerInterval);
    
    // Guardar Estat
    gameState.roomHistory.push({
        room: 2, completed: true, playerAlive: true,
        survivors: [...gameState.survivors], eliminated: [...gameState.eliminated],
        hunter: secretHunterName, timeRemaining: gameTime
    });
    localStorage.setItem("game02_state", JSON.stringify(gameState));

    document.getElementById('final-survivors').textContent = `SUPERVIVENTS: ${gameState.survivors.length}`;
    document.getElementById('final-eliminated').textContent = `ELIMINATS: ${gameState.eliminated.length}`;
    document.getElementById('screen-win').classList.remove('hidden');
}

// ==========================================
// 10. INTERFÍCIE I TEMPS
// ==========================================
function tickTimer() {
    if(!isPlaying) return;
    gameTime--;
    let m = Math.floor(gameTime / 60).toString().padStart(2, '0');
    let s = (gameTime % 60).toString().padStart(2, '0');
    let tEl = document.getElementById('timer');
    tEl.textContent = `${m}:${s}`;

    if (gameTime === 60) {
        tEl.classList.add('timer-danger');
        showNotification("UN MINUT RESTANT");
    }
    if (gameTime <= 0) {
        isPlaying = false; clearInterval(timerInterval);
        showNotification("TEMPS ESGOTAT");
        setTimeout(() => document.getElementById('screen-gameover').classList.remove('hidden'), 1500);
    }
}

function showNotification(text) {
    const notif = document.getElementById('center-notification');
    document.getElementById('notification-text').textContent = text;
    notif.classList.remove('hidden');
    setTimeout(() => notif.classList.add('hidden'), 3000);
}

function addFloatingDialogue(charName, text) {
    let now = performance.now();
    if(now - (lastDialogueTime[charName]||0) < 5000) return;
    lastDialogueTime[charName] = now;
    floatingDialogues.push({ charName: charName, text: text, timeLeft: 2.5 });
}

function updateDialogues(dt) {
    for (let i = floatingDialogues.length - 1; i >= 0; i--) {
        floatingDialogues[i].timeLeft -= dt;
        if (floatingDialogues[i].timeLeft <= 0) floatingDialogues.splice(i, 1);
    }
}

// ==========================================
// 11. RENDERITZAT (CANVAS)
// ==========================================
function drawGame(isStatic = false) {
    // Fons base (Gris fosc de formigó, no negre)
    ctx.fillStyle = '#0f1115';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2 - camera.x, canvas.height / 2 - camera.y);

    // Dibuixar Habitacions (Terra)
    rooms.forEach(r => {
        ctx.fillStyle = r.color;
        ctx.fillRect(r.x, r.y, r.w, r.h);
    });

    // Zona Sortida Especial
    ctx.fillStyle = exitActive ? 'rgba(102, 252, 241, 0.2)' : 'rgba(255,255,255,0.05)';
    ctx.fillRect(exitZone.x, exitZone.y, exitZone.w, exitZone.h);
    ctx.fillStyle = exitOpen ? '#66fcf1' : '#fff';
    ctx.font = 'bold 30px Courier Prime';
    ctx.fillText("SORTIDA", exitZone.x + 90, exitZone.y + 150);

    // Dibuixar Parets amb profunditat (2.5D fals)
    walls.forEach(w => {
        // Ombra lateral dreta/baix
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(w.x + 10, w.y + 10, w.w, w.h);
        
        // Frontal fosc
        ctx.fillStyle = '#101015';
        ctx.fillRect(w.x, w.y, w.w, w.h);
        
        // Part superior de la paret (dona l'efecte de profunditat)
        ctx.fillStyle = '#2a2a35';
        ctx.fillRect(w.x, w.y - 20, w.w, 20);
        
        // Línia de relleu
        ctx.fillStyle = '#111';
        ctx.fillRect(w.x, w.y, w.w, 2);
    });

    // Dibuixar Entitats
    entities.sort((a,b) => a.y - b.y); 

    entities.forEach(ent => {
        // Ombra
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.beginPath(); ctx.ellipse(ent.x, ent.y + 12, 12, 6, 0, 0, Math.PI*2); ctx.fill();

        ctx.beginPath();
        ctx.arc(ent.x, ent.y, ent.radius, 0, Math.PI * 2);
        
        if (ent.state === 'dead') {
            ctx.fillStyle = 'rgba(100, 0, 0, 0.7)'; 
        } else {
            ctx.fillStyle = ent.color;
            // Indicador subtil si és el caçador (només visual estilístic per tensió, els ulls)
            if (ent.isHunter) {
                ctx.shadowColor = '#ff3333'; ctx.shadowBlur = 10;
            }
        }
        ctx.fill(); ctx.shadowBlur = 0;

        // Dibuixar només els vius
        if(ent.state === 'alive') {
            ctx.fillStyle = '#aaa';
            ctx.font = '12px Courier Prime';
            // No posar el nom del jugador a ell mateix constantment si no fa falta, però ho deixem per coherència
            ctx.fillText(ent.isHunter ? "" : ent.name, ent.x - 15, ent.y - 20);
        }
    });

    // Diàlegs
    if (!isStatic) {
        floatingDialogues.forEach(dialogue => {
            let ent = entities.find(e => e.name === dialogue.charName);
            if (ent && ent.state === 'alive') {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
                
                let textWidth = ctx.measureText("«" + dialogue.text + "»").width;
                let boxW = textWidth + 20; let boxH = 25;
                let boxX = ent.x - boxW/2; let boxY = ent.y - 50;

                ctx.fillRect(boxX, boxY, boxW, boxH);
                ctx.strokeRect(boxX, boxY, boxW, boxH);

                ctx.fillStyle = '#fff';
                ctx.font = '12px Courier Prime';
                ctx.fillText("«" + dialogue.text + "»", ent.x - textWidth/2, boxY + 16);
            }
        });
    }

    ctx.restore();

    // IL·LUMINACIÓ GLOBAL (Foscor atmosfèrica)
    // Dibuixem una capa fosca sobre tota la pantalla, però foradem la llum al voltant del jugador
    if (!isStatic) {
        let grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 50, canvas.width/2, canvas.height/2, 500);
        grad.addColorStop(0, 'rgba(11, 12, 16, 0.1)'); // Llum clara a prop
        grad.addColorStop(1, 'rgba(11, 12, 16, 0.8)'); // Foscor als extrems
        
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Si el caçador persegueix, to vermellós
        if (hunterEntity && hunterEntity.aiState === 'chasing_player') {
            ctx.fillStyle = 'rgba(255,0,0,0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }
}

// ==========================================
// 12. ÀUDIO SINTÈTIC I INPUTS EXTRAS
// ==========================================
let actx;
function playBeep(freq, type, vol) {
    try {
        if(!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
        let osc = actx.createOscillator();
        let gain = actx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, actx.currentTime);
        gain.gain.setValueAtTime(0, actx.currentTime);
        gain.gain.linearRampToValueAtTime(vol, actx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.3);
        osc.connect(gain); gain.connect(actx.destination);
        osc.start(); osc.stop(actx.currentTime + 0.35);
    } catch(e) {}
}

function setupInputs() {
    window.addEventListener('keydown', e => {
        if(e.key.toLowerCase() === 'w' || e.key === 'ArrowUp') keys.w = true;
        if(e.key.toLowerCase() === 'a' || e.key === 'ArrowLeft') keys.a = true;
        if(e.key.toLowerCase() === 's' || e.key === 'ArrowDown') keys.s = true;
        if(e.key.toLowerCase() === 'd' || e.key === 'ArrowRight') keys.d = true;
        if(e.key === 'Shift') keys.shift = true;
    });
    window.addEventListener('keyup', e => {
        if(e.key.toLowerCase() === 'w' || e.key === 'ArrowUp') keys.w = false;
        if(e.key.toLowerCase() === 'a' || e.key === 'ArrowLeft') keys.a = false;
        if(e.key.toLowerCase() === 's' || e.key === 'ArrowDown') keys.s = false;
        if(e.key.toLowerCase() === 'd' || e.key === 'ArrowRight') keys.d = false;
        if(e.key === 'Shift') keys.shift = false;
    });

    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if(isTouch) {
        document.getElementById('touch-controls').classList.remove('hidden');
        const zone = document.getElementById('joystick-zone');
        const stick = document.getElementById('joystick-stick');
        const stealthBtn = document.getElementById('btn-stealth');
        
        let rect, centerX, centerY, maxDist = 35;
        const updateCenter = () => {
            rect = zone.getBoundingClientRect();
            centerX = rect.left + 60; centerY = rect.top + 60;
        };
        updateCenter(); window.addEventListener('resize', updateCenter);

        zone.addEventListener('touchstart', (e) => { e.preventDefault(); updateCenter(); handleTouch(e); }, {passive: false});
        zone.addEventListener('touchmove', (e) => { e.preventDefault(); handleTouch(e); }, {passive: false});
        zone.addEventListener('touchend', () => {
            joystick.active = false; joystick.dx = 0; joystick.dy = 0;
            stick.style.transform = `translate(0px, 0px)`;
        });

        function handleTouch(e) {
            joystick.active = true;
            let touch = e.touches[0];
            let dx = touch.clientX - centerX; let dy = touch.clientY - centerY;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if(distance > maxDist) { dx = (dx / distance) * maxDist; dy = (dy / distance) * maxDist; }
            stick.style.transform = `translate(${dx}px, ${dy}px)`;
            joystick.dx = dx / maxDist; joystick.dy = dy / maxDist;
        }

        stealthBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            stealthBtn.classList.toggle('active');
            if(stealthBtn.classList.contains('active')) stealthBtn.style.background = 'rgba(102, 252, 241, 0.5)';
            else stealthBtn.style.background = 'rgba(0,0,0,0.5)';
        });
    }
}

