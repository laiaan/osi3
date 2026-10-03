"use strict";

// ==========================================
// 1. ESTAT GLOBAL (Preparat per Sala 02)
// ==========================================
const gameState = {
    gameId: "GAME_02",
    currentRoom: 1,
    survivors: ["Marcel", "Chishiya", "Niragi", "Kuina", "Aguni", "Ann"],
    eliminated: [],
    playerAlive: true,
    roomHistory: []
};

// ==========================================
// 2. CONFIGURACIÓ DE LA SALA I NPCs
// ==========================================
const TRACK_LENGTH = 6000; // Pista llarga, 45-50 metres equivalents
const TRACK_WIDTH = 1200;
const FINISH_Y = 300; 
const START_Y = TRACK_LENGTH - 300;

const npcData = {
    Chishiya: { speed: 280, risk: 0.1, reaction: 120, color: "#e0e0e0" },
    Niragi:   { speed: 360, risk: 0.8, reaction: 300, color: "#8b0000" },
    Ann:      { speed: 290, risk: 0.05, reaction: 100, color: "#88ccff" },
    Kuina:    { speed: 310, risk: 0.3, reaction: 200, color: "#ff88cc" },
    Aguni:    { speed: 300, risk: 0.15, reaction: 150, color: "#555555" }
};

// ==========================================
// 3. VARIABLES DEL MOTOR
// ==========================================
let canvas, ctx;
let lastTime = 0;
let isPlaying = false;
let timeRemaining = 300; // 05:00
let timerInterval;

let lightState = "GREEN";
let nextLightChange = 0;
let timeSinceLightChange = 0;
let cycleCount = 0;

let entities = [];
let player;
let figureRotation = 0; // 0 = esquena (Verd), 1 = girada (Vermell)

// Inputs i Càmera
let keys = { w: false, a: false, s: false, d: false };
let joystick = { active: false, dx: 0, dy: 0 };
let camera = { x: 0, y: 0 };

// Diàlegs flotants
let floatingDialogues = []; 
let lastDialogueTime = { Chishiya: 0, Niragi: 0, Ann: 0, Kuina: 0, Aguni: 0 };

// ==========================================
// 4. INICIALITZACIÓ I CINEMÀTICA
// ==========================================
window.onload = () => {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    setupInputs();

    document.getElementById('btn-init').addEventListener('click', startCinematic);
    document.getElementById('btn-retry').addEventListener('click', () => location.reload());
    document.getElementById('btn-continue').addEventListener('click', goToNextRoom);
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function startCinematic() {
    document.getElementById('start-screen').classList.remove('active');
    document.getElementById('intro-screen').classList.remove('hidden');
    
    // Configurar els personatges per a la visualització de fons
    setupEntities();
    camera.x = 0; 
    camera.y = START_Y - canvas.height * 0.4;
    drawGame(true); // Dibuixar un frame estàtic de fons

    const dialogues = [
        { char: "Kuina", text: "On som?", delay: 2000 },
        { char: "Aguni", text: "No ho sé.", delay: 4000 },
        { char: "Ann", text: "No hi ha cap sortida visible, excepte aquella porta.", delay: 6000 },
        { char: "Niragi", text: "Perfecte. Una altra habitació tancada.", delay: 9000 },
        { char: "Chishiya", text: "Mireu les càmeres.", delay: 12000 },
        { char: "Kuina", text: "Això… jo ho he vist abans. Un joc semblant. El del Calamar.", delay: 15000 },
        { char: "Chishiya", text: "Llum verda. Llum vermella.", delay: 19000 }
    ];

    const cineText = document.getElementById('cinematic-text');
    
    dialogues.forEach(d => {
        setTimeout(() => {
            cineText.innerHTML = `<span style="color:#aaa; font-size:0.9em;">${d.char}</span><br>«${d.text}»`;
        }, d.delay);
    });

    // Pantalla del sistema
    setTimeout(() => {
        cineText.innerHTML = "";
        document.getElementById('system-screen').classList.remove('hidden');
    }, 23000);

    // Veu del sistema (Versió Corregida amb subtítols basats en temps)
    setTimeout(() => {
        document.getElementById('system-screen').classList.add('hidden');
        document.getElementById('intro-screen').style.backgroundColor = "rgba(0,0,0,0.8)";
        playSystemVoice();
    }, 28000);
}

// ARREGLAT: Ara utilitza temps infal·lible en comptes de l'API de veu que bloquejava el joc.
function playSystemVoice() {
    const lines = [
        "Benvinguts a la primera prova.",
        "Disposeu de cinc minuts per arribar fins a la porta de sortida.",
        "Quan la llum sigui verda, podreu avançar.",
        "Quan la llum sigui vermella, haureu de quedar completament immòbils.",
        "Qualsevol moviment detectat durant la llum vermella comptarà com una infracció.",
        "Tres infraccions comportaran la vostra eliminació.",
        "Sobreviviu a aquesta prova i podreu accedir a la següent sala.",
        "La prova començarà ara."
    ];

    const subtitleEl = document.getElementById('voice-subtitles');
    subtitleEl.classList.remove('hidden');

    let currentLine = 0;
    
    function speakNext() {
        if (currentLine >= lines.length) {
            subtitleEl.classList.add('hidden');
            document.getElementById('intro-screen').classList.add('hidden');
            startGame();
            return;
        }

        let text = lines[currentLine];
        subtitleEl.textContent = text;

        // Calculem el temps de lectura (Més curt per donar dinamisme, no es bloqueja mai)
        let readTime = (text.length * 60) + 1000;

        setTimeout(() => {
            currentLine++;
            speakNext();
        }, readTime);
    }
    
    speakNext();
}

// ==========================================
// 5. SISTEMA D'INPUTS
// ==========================================
function setupInputs() {
    window.addEventListener('keydown', e => {
        if(e.key.toLowerCase() === 'w' || e.key === 'ArrowUp') keys.w = true;
        if(e.key.toLowerCase() === 'a' || e.key === 'ArrowLeft') keys.a = true;
        if(e.key.toLowerCase() === 's' || e.key === 'ArrowDown') keys.s = true;
        if(e.key.toLowerCase() === 'd' || e.key === 'ArrowRight') keys.d = true;
    });
    window.addEventListener('keyup', e => {
        if(e.key.toLowerCase() === 'w' || e.key === 'ArrowUp') keys.w = false;
        if(e.key.toLowerCase() === 'a' || e.key === 'ArrowLeft') keys.a = false;
        if(e.key.toLowerCase() === 's' || e.key === 'ArrowDown') keys.s = false;
        if(e.key.toLowerCase() === 'd' || e.key === 'ArrowRight') keys.d = false;
    });

    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if(isTouch) {
        document.getElementById('joystick-zone').classList.remove('hidden');
        const zone = document.getElementById('joystick-zone');
        const stick = document.getElementById('joystick-stick');
        let rect, centerX, centerY, maxDist = 35;

        const updateCenter = () => {
            rect = zone.getBoundingClientRect();
            centerX = rect.left + 60;
            centerY = rect.top + 60;
        };
        updateCenter();
        window.addEventListener('resize', updateCenter);

        zone.addEventListener('touchstart', (e) => { e.preventDefault(); updateCenter(); handleTouch(e); }, {passive: false});
        zone.addEventListener('touchmove', (e) => { e.preventDefault(); handleTouch(e); }, {passive: false});
        zone.addEventListener('touchend', () => {
            joystick.active = false; joystick.dx = 0; joystick.dy = 0;
            stick.style.transform = `translate(0px, 0px)`;
        });

        function handleTouch(e) {
            joystick.active = true;
            let touch = e.touches[0];
            let dx = touch.clientX - centerX;
            let dy = touch.clientY - centerY;
            let distance = Math.sqrt(dx*dx + dy*dy);

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
// 6. INICI DEL JOC
// ==========================================
function setupEntities() {
    entities = [];
    player = {
        name: "Marcel", x: 0, y: START_Y, vx: 0, vy: 0,
        speed: 350, radius: 16, isPlayer: true, state: 'alive',
        color: '#ffffff', strikes: 0, detectedThisCycle: false
    };
    entities.push(player);

    let startOffset = -300;
    for (let name of gameState.survivors) {
        if(name === "Marcel") continue;
        entities.push({
            name: name, x: startOffset, y: START_Y + (Math.random()*60 - 30), vx: 0, vy: 0,
            speed: npcData[name].speed, risk: npcData[name].risk, reaction: npcData[name].reaction,
            isPlayer: false, state: 'alive', stopTimer: 0,
            color: npcData[name].color, radius: 15, targetX: startOffset + (Math.random()*100-50),
            strikes: 0, detectedThisCycle: false
        });
        startOffset += 150;
    }
}

function startGame() {
    document.getElementById('hud').classList.remove('hidden');
    updateSurvivorsHUD();
    
    // Primer cicle fixat per aprendre
    lightState = "GREEN";
    updateLightHUD();
    nextLightChange = performance.now() + 4500; // 4.5s de Verd
    
    timeRemaining = 300;
    timerInterval = setInterval(tickTimer, 1000);
    
    addFloatingDialogue("Chishiya", "No sembla complicat. Això és precisament el que em preocupa.");
    
    isPlaying = true;
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

// ==========================================
// 7. BUCLE PRINCIPAL
// ==========================================
function gameLoop(timestamp) {
    if(!isPlaying) return;
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    updateGame(dt);
    drawGame(false);

    requestAnimationFrame(gameLoop);
}

function updateGame(dt) {
    timeSinceLightChange += dt * 1000;

    if(performance.now() > nextLightChange) toggleLight();

    // Transició suau de la figura
    let targetRot = (lightState === "RED") ? 1 : 0;
    figureRotation += (targetRot - figureRotation) * 15 * dt;

    entities.forEach(ent => {
        if(ent.state !== 'alive') return;
        if(ent.isPlayer) {
            updatePlayer(ent, dt);
            checkWin(ent);
        } else {
            updateNPC(ent, dt);
            checkNPCDialogue(ent);
        }
        checkDetection(ent);
    });

    // Càmera: segueix al jugador però mira cap amunt (porta)
    camera.x += (player.x - camera.x) * 5 * dt;
    let targetCamY = player.y - window.innerHeight * 0.35; // Deixa un 65% de visió per davant
    camera.y += (targetCamY - camera.y) * 5 * dt;

    updateDialogues(dt);
}

// ==========================================
// 8. FÍSIQUES I IA
// ==========================================
function updatePlayer(p, dt) {
    // Si està rebent una infracció, congelat 1 segon
    if (p.freezeTimer > 0) {
        p.freezeTimer -= dt;
        p.vx = 0; p.vy = 0;
        return;
    }

    let inputX = 0; let inputY = 0;

    if(keys.w) inputY -= 1;
    if(keys.s) inputY += 1;
    if(keys.a) inputX -= 1;
    if(keys.d) inputX += 1;

    if(joystick.active) {
        inputX = joystick.dx;
        inputY = joystick.dy;
    }

    let len = Math.sqrt(inputX*inputX + inputY*inputY);
    if(len > 1) { inputX /= len; inputY /= len; }

    const accel = 2500;
    const friction = 0.80; // Frena molt ràpid al deixar l'input (Important per la mecànica)

    p.vx += inputX * accel * dt;
    p.vy += inputY * accel * dt;
    p.vx *= friction;
    p.vy *= friction;

    let currentSpeed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
    if(currentSpeed > p.speed) {
        p.vx = (p.vx / currentSpeed) * p.speed;
        p.vy = (p.vy / currentSpeed) * p.speed;
    }
    // Parada absoluta si la velocitat és molt baixa
    if(currentSpeed < 5 && inputX === 0 && inputY === 0) { p.vx = 0; p.vy = 0; }

    p.x += p.vx * dt;
    p.y += p.vy * dt;

    if(p.x < -TRACK_WIDTH/2) p.x = -TRACK_WIDTH/2;
    if(p.x > TRACK_WIDTH/2) p.x = TRACK_WIDTH/2;
    if(p.y < FINISH_Y - 50) p.y = FINISH_Y - 50;
}

function updateNPC(npc, dt) {
    if (npc.freezeTimer > 0) {
        npc.freezeTimer -= dt;
        npc.vx = 0; npc.vy = 0;
        return;
    }

    let targetVx = 0; let targetVy = 0;

    if(lightState === "GREEN") {
        targetVy = -npc.speed;
        if(npc.x < npc.targetX - 10) targetVx = npc.speed * 0.4;
        else if(npc.x > npc.targetX + 10) targetVx = -npc.speed * 0.4;
        npc.stopTimer = 0; 
    } else {
        npc.stopTimer += dt * 1000;
        let delayBeforeStop = npc.reaction + (Math.random() * npc.risk * 400); 
        
        // Risc d'error
        if(Math.random() < (npc.risk * 0.003)) delayBeforeStop += 800;

        if(npc.stopTimer < delayBeforeStop) {
            targetVy = -npc.speed;
        }
    }

    npc.vx += (targetVx - npc.vx) * 15 * dt;
    npc.vy += (targetVy - npc.vy) * 15 * dt;

    let currentSpeed = Math.sqrt(npc.vx*npc.vx + npc.vy*npc.vy);
    if(currentSpeed < 5 && targetVy === 0) { npc.vx = 0; npc.vy = 0; }

    npc.x += npc.vx * dt;
    npc.y += npc.vy * dt;
}

// ==========================================
// 9. MECÀNICA DE LLUMS
// ==========================================
function toggleLight() {
    timeSinceLightChange = 0;
    cycleCount++;

    // Resetear deteccions per cicle
    entities.forEach(e => e.detectedThisCycle = false);

    if(lightState === "GREEN") {
        lightState = "RED";
        // Durada Vermell: 2 a 4 segons
        let dur = 2000 + Math.random() * 2000; 
        if(cycleCount === 1) dur = 3000; // Primer cicle fix
        nextLightChange = performance.now() + dur;
        
        updateLightHUD();
        playBeep(300, 'sawtooth', 0.5); // So aspre
    } else {
        lightState = "GREEN";
        // Durada Verd: 3 a 5 segons
        let dur = 3000 + Math.random() * 2000;
        if(cycleCount === 2) dur = 4000; 
        nextLightChange = performance.now() + dur;

        updateLightHUD();
        playBeep(600, 'sine', 0.2); // So net
    }
}

function updateLightHUD() {
    const ind = document.getElementById('light-indicator');
    if(lightState === "GREEN") {
        ind.textContent = "🟢 LLUM VERDA";
        ind.className = "light-indicator green";
    } else {
        ind.textContent = "🔴 LLUM VERMELLA";
        ind.className = "light-indicator red";
    }
}

// ==========================================
// 10. MOTOR DE DETECCIÓ I INFRACCIONS
// ==========================================
function checkDetection(ent) {
    if(lightState === "GREEN") return;
    
    // Finestra de reacció (0.20 segons)
    if(timeSinceLightChange < 200) return; 
    
    if(ent.detectedThisCycle) return; // Només 1 infracció per fase vermella

    let currentSpeed = Math.sqrt(ent.vx*ent.vx + ent.vy*ent.vy);
    
    // Llindar estricte però just
    if(currentSpeed > 30) {
        ent.detectedThisCycle = true;
        ent.strikes++;
        ent.freezeTimer = 1.0; // Es queda parat pel xoc
        
        if(ent.isPlayer) {
            handlePlayerStrike();
        } else {
            handleNPCStrike(ent);
        }
    }
}

function handlePlayerStrike() {
    updateStrikesHUD();
    playBeep(150, 'square', 0.4); // So elèctric
    
    if (player.strikes >= 3) {
        isPlaying = false;
        clearInterval(timerInterval);
        setTimeout(() => {
            document.getElementById('screen-gameover').classList.remove('hidden');
        }, 1000);
    } else {
        // Flash visual d'advertència
        const flash = document.getElementById('detection-flash');
        document.getElementById('detection-text').textContent = `${player.strikes}/3 — DETECTAT`;
        flash.classList.remove('hidden');
        setTimeout(() => flash.classList.add('hidden'), 800);
    }
}

function handleNPCStrike(npc) {
    if (npc.strikes >= 3) {
        npc.state = 'dead';
        gameState.survivors = gameState.survivors.filter(n => n !== npc.name);
        gameState.eliminated.push(npc.name);
        updateSurvivorsHUD();
        playBeep(100, 'square', 0.6); // So de mort pesat

        // Reacció d'altres
        if(Math.random() > 0.5) addFloatingDialogue("Kuina", "No...");
        else addFloatingDialogue("Ann", "No ha frenat a temps.");
    } else {
        // Reacció a la pròpia infracció
        if(npc.name === "Niragi" && npc.strikes === 1) addFloatingDialogue("Niragi", "Només ha estat un error.");
    }
}

function updateStrikesHUD() {
    document.getElementById('strikes-count').textContent = `INFRACCIONS: ${player.strikes}/3`;
}

function updateSurvivorsHUD() {
    document.getElementById('survivors-count').textContent = `SUPERVIVENTS: ${gameState.survivors.length}`;
}

// ==========================================
// 11. SISTEMA DE DIÀLEGS FLOTANTS
// ==========================================
function addFloatingDialogue(charName, text) {
    // Evitar spam del mateix personatge
    let now = performance.now();
    if(now - lastDialogueTime[charName] < 5000) return;
    lastDialogueTime[charName] = now;

    floatingDialogues.push({
        charName: charName,
        text: text,
        timeLeft: 2.5 // Dura 2.5 segons
    });
}

function updateDialogues(dt) {
    for (let i = floatingDialogues.length - 1; i >= 0; i--) {
        floatingDialogues[i].timeLeft -= dt;
        if (floatingDialogues[i].timeLeft <= 0) {
            floatingDialogues.splice(i, 1);
        }
    }
}

function checkNPCDialogue(npc) {
    // Diàlegs contextuals esporàdics
    if(Math.random() < 0.001) {
        if(npc.name === "Chishiya" && cycleCount > 2) addFloatingDialogue("Chishiya", "Els intervals estan canviant.");
        if(npc.name === "Niragi" && lightState === "GREEN") addFloatingDialogue("Niragi", "VINGA! MOVEU-VOS!");
        if(npc.name === "Aguni" && lightState === "RED") addFloatingDialogue("Aguni", "Quiet.");
    }
}

// ==========================================
// 12. CONDICIONS DE FINAL
// ==========================================
function checkWin(p) {
    if(p.y <= FINISH_Y && p.state === 'alive') {
        isPlaying = false;
        clearInterval(timerInterval);
        document.getElementById('final-survivors').textContent = `SUPERVIVENTS: ${gameState.survivors.length}`;
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

    if(timeRemaining === 60) {
        addFloatingDialogue("Chishiya", "Ara sí que tenim pressa.");
        timerEl.classList.add('timer-warning');
    }
    if(timeRemaining <= 30) {
        timerEl.className = "hud-center timer-danger";
    }

    if(timeRemaining <= 0) {
        isPlaying = false;
        clearInterval(timerInterval);
        document.getElementById('detection-text').textContent = "TEMPS ESGOTAT";
        document.getElementById('detection-flash').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('detection-flash').classList.add('hidden');
            document.getElementById('screen-gameover').classList.remove('hidden');
        }, 1500);
    }
}

// ==========================================
// 13. RENDERITZAT (CANVAS)
// ==========================================
function drawGame(isStatic = false) {
    ctx.fillStyle = '#070707';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // Centrar càmera en X, i col·locar Y segons el jugador
    ctx.translate(canvas.width / 2 - camera.x, canvas.height / 2 - camera.y);

    // Dibuixar Pista (Terra)
    ctx.fillStyle = '#111111';
    ctx.fillRect(-TRACK_WIDTH/2, FINISH_Y - 200, TRACK_WIDTH, START_Y - FINISH_Y + 600);
    
    // Línies laterals (canvien de color segons la llum)
    ctx.strokeStyle = lightState === "GREEN" ? 'rgba(42, 255, 123, 0.3)' : 'rgba(255, 42, 42, 0.3)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-TRACK_WIDTH/2 + 20, FINISH_Y); ctx.lineTo(-TRACK_WIDTH/2 + 20, START_Y + 500);
    ctx.moveTo(TRACK_WIDTH/2 - 20, FINISH_Y); ctx.lineTo(TRACK_WIDTH/2 - 20, START_Y + 500);
    ctx.stroke();

    // Dibuixar Meta (Porta / Línia)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(-TRACK_WIDTH/2, FINISH_Y, TRACK_WIDTH, 40);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 40px Courier Prime';
    ctx.textAlign = 'center';
    ctx.fillText("SORTIDA", 0, FINISH_Y - 20);

    // Dibuixar Figura de Control
    drawController();

    // Dibuixar Entitats
    entities.sort((a,b) => a.y - b.y); // Profunditat Z

    entities.forEach(ent => {
        // Ombra
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath(); ctx.ellipse(ent.x, ent.y + 10, 15, 5, 0, 0, Math.PI*2); ctx.fill();

        // Cos
        ctx.beginPath();
        ctx.arc(ent.x, ent.y, ent.radius, 0, Math.PI * 2);
        if(ent.state === 'dead') {
            ctx.fillStyle = 'rgba(150, 0, 0, 0.5)'; // Cadàver fosc
        } else {
            ctx.fillStyle = ent.color;
            if(ent.isPlayer) {
                ctx.shadowColor = '#fff'; ctx.shadowBlur = 10; // Destacar Marcel
            }
        }
        ctx.fill(); ctx.shadowBlur = 0;

        // Indicador d'infraccions a sobre del personatge (opcional per feedback)
        if(ent.state === 'alive' && ent.strikes > 0) {
            ctx.fillStyle = '#ff2a2a';
            ctx.font = '10px Courier Prime';
            ctx.fillText("X".repeat(ent.strikes), ent.x, ent.y - 25);
        }

        // Nom
        if(ent.state === 'alive') {
            ctx.fillStyle = ent.isPlayer ? '#fff' : '#666';
            ctx.font = '12px Courier Prime';
            ctx.fillText(ent.name, ent.x, ent.y - 12);
        }
    });

    // Dibuixar Diàlegs Flotants
    if (!isStatic) {
        floatingDialogues.forEach(dialogue => {
            let ent = entities.find(e => e.name === dialogue.charName);
            if (ent && ent.state === 'alive') {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.strokeStyle = '#555';
                ctx.lineWidth = 1;
                
                let textWidth = ctx.measureText("«" + dialogue.text + "»").width;
                let boxW = textWidth + 20;
                let boxH = 25;
                let boxX = ent.x - boxW/2;
                let boxY = ent.y - 55;

                ctx.fillRect(boxX, boxY, boxW, boxH);
                ctx.strokeRect(boxX, boxY, boxW, boxH);

                ctx.fillStyle = '#fff';
                ctx.font = '12px Courier Prime';
                ctx.fillText("«" + dialogue.text + "»", ent.x, boxY + 16);
            }
        });
    }

    ctx.restore();

    // Vinyeta visual (foscor a les vores)
    let grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, canvas.height*0.3, canvas.width/2, canvas.height/2, canvas.height);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, lightState === "RED" ? 'rgba(50,0,0,0.5)' : 'rgba(0,0,0,0.8)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawController() {
    let ctrlY = FINISH_Y - 150;
    
    // Focus de llum
    if(lightState === "RED") {
        let grad = ctx.createRadialGradient(0, ctrlY, 20, 0, ctrlY, 600);
        grad.addColorStop(0, `rgba(255, 0, 0, 0.4)`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(-600, ctrlY - 300, 1200, 1200);
    }

    // Base figura
    ctx.fillStyle = '#222';
    ctx.fillRect(-30, ctrlY, 60, 40);

    // Cap (Gira segons figureRotation: 0 = amagat, 1 = mira endavant)
    ctx.fillStyle = '#111';
    ctx.beginPath(); ctx.arc(0, ctrlY, 25, 0, Math.PI*2); ctx.fill();

    if (figureRotation > 0.1) {
        ctx.fillStyle = `rgba(255, 42, 42, ${figureRotation})`;
        ctx.shadowColor = '#ff2a2a'; ctx.shadowBlur = 15;
        // Ulls mecànics
        ctx.fillRect(-12, ctrlY + 5, 8, 4);
        ctx.fillRect(4, ctrlY + 5, 8, 4);
        ctx.shadowBlur = 0;
    }
}

// ==========================================
// 14. ÀUDIO SINTÈTIC (Sense dependències)
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
        
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start(); osc.stop(actx.currentTime + 0.35);
    } catch(e) {}
}

// ==========================================
// 15. TRANSICIÓ (Preparat per al futur)
// ==========================================
function goToNextRoom() {
    // Guarda l'estat en localStorage per recuperar-lo a la Sala 02
    localStorage.setItem("game02_state", JSON.stringify(gameState));
    
    // Quan existeixi la Sala 02, l'enllaç anirà aquí:
    // window.location.href = "../sala02/index.html";
    
    alert(`Redirigint a SALA 02...\nSupervivents guardats: ${gameState.survivors.join(", ")}\nAquesta funció està llesta per connectar el següent arxiu.`);
}
