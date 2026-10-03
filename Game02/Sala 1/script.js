"use strict";

// ==========================================
// 1. ESTAT GLOBAL 
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
const TRACK_LENGTH = 5000; // Representa ~50 metres
const TRACK_WIDTH = 1200;
const FINISH_Y = 300; 
const START_Y = TRACK_LENGTH - 300;

// Els personatges ara són més visibles
const npcData = {
    Chishiya: { speed: 280, risk: 0.1, reaction: 120, color: "#e0e0e0" },
    Niragi:   { speed: 360, risk: 0.8, reaction: 300, color: "#ff4444" },
    Ann:      { speed: 290, risk: 0.05, reaction: 100, color: "#88ccff" },
    Kuina:    { speed: 310, risk: 0.3, reaction: 200, color: "#ff88cc" },
    Aguni:    { speed: 300, risk: 0.15, reaction: 150, color: "#aaaaaa" }
};

// ==========================================
// 3. VARIABLES DEL MOTOR
// ==========================================
let canvas, ctx;
let lastTime = 0;
let isPlaying = false;
let timeRemaining = 300; 
let timerInterval;

let lightState = "GREEN";
let nextLightChange = 0;
let timeSinceLightChange = 0;
let cycleCount = 0;

let entities = [];
let player;
let figureRotation = 0; 

let keys = { w: false, a: false, s: false, d: false };
let joystick = { active: false, dx: 0, dy: 0 };
let camera = { x: 0, y: 0 };

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
    
    // NOU: El botó de retry ara reinicia directament a la pista sense passar per l'intro
    document.getElementById('btn-retry').addEventListener('click', quickRestart);
    
    document.getElementById('btn-continue').addEventListener('click', goToNextRoom);
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function startCinematic() {
    const startBtn = document.getElementById('btn-init');
    if (startBtn) startBtn.disabled = true;
    
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('intro-screen').classList.remove('hidden');
    
    setupEntities();
    camera.x = 0; 
    camera.y = START_Y - canvas.height * 0.4;
    drawGame(true); 

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
            cineText.innerHTML = `<span style="color:#aaa; font-size:1.1em;">${d.char}</span><br><br>«${d.text}»`;
        }, d.delay);
    });

    setTimeout(() => {
        cineText.innerHTML = "";
        document.getElementById('system-screen').classList.remove('hidden');
    }, 23000);

    setTimeout(() => {
        document.getElementById('system-screen').classList.add('hidden');
        document.getElementById('intro-screen').style.backgroundColor = "rgba(0,0,0,0.8)";
        playSystemVoice();
    }, 28000);
}

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
        let readTime = (text.length * 55) + 1000;

        setTimeout(() => {
            currentLine++;
            speakNext();
        }, readTime);
    }
    
    speakNext();
}

// NOU: Funció de Reinici Ràpid (sense intro)
function quickRestart() {
    document.getElementById('screen-gameover').classList.add('hidden');
    
    // Resetejar llista completa de supervivents
    gameState.survivors = ["Marcel", "Chishiya", "Niragi", "Kuina", "Aguni", "Ann"];
    gameState.eliminated = [];
    
    setupEntities(); // Recrea els personatges a la línia de sortida
    
    lightState = "GREEN";
    cycleCount = 0;
    updateLightHUD();
    nextLightChange = performance.now() + 4500; 
    
    timeRemaining = 300;
    updateStrikesHUD();
    updateSurvivorsHUD();
    
    clearInterval(timerInterval);
    timerInterval = setInterval(tickTimer, 1000);
    
    isPlaying = true;
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
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
        speed: 350, radius: 22, isPlayer: true, state: 'alive',
        color: '#ffffff', strikes: 0, detectedThisCycle: false, freezeTimer: 0
    };
    entities.push(player);

    let startOffset = -300;
    for (let name of gameState.survivors) {
        if(name === "Marcel") continue;
        entities.push({
            name: name, x: startOffset, y: START_Y + (Math.random()*60 - 30), vx: 0, vy: 0,
            speed: npcData[name].speed, risk: npcData[name].risk, reaction: npcData[name].reaction,
            isPlayer: false, state: 'alive', stopTimer: 0,
            color: npcData[name].color, radius: 22, targetX: startOffset + (Math.random()*100-50),
            strikes: 0, detectedThisCycle: false, freezeTimer: 0
        });
        startOffset += 150;
    }
}

function startGame() {
    document.getElementById('hud').classList.remove('hidden');
    updateSurvivorsHUD();
    
    lightState = "GREEN";
    updateLightHUD();
    nextLightChange = performance.now() + 4500; 
    
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

    let targetRot = (lightState === "RED") ? 1 : 0;
    figureRotation += (targetRot - figureRotation) * 15 * dt;

    entities.forEach(ent => {
        if(ent.state !== 'alive') return;
        if(ent.isPlayer) {
            updatePlayer(ent, dt);
            checkWin(ent);
            
            // NOU: Càlcul de distància a la meta (escala de 100 unitats = 1 metre)
            let distanceMeters = Math.max(0, Math.floor((ent.y - FINISH_Y) / 100));
            document.getElementById('distance-meter').textContent = `DISTÀNCIA: ${distanceMeters}m`;
            
        } else {
            updateNPC(ent, dt);
            checkNPCDialogue(ent);
        }
        checkDetection(ent);
    });

    camera.x += (player.x - camera.x) * 5 * dt;
    let targetCamY = player.y - window.innerHeight * 0.35; 
    camera.y += (targetCamY - camera.y) * 5 * dt;

    updateDialogues(dt);
}

// ==========================================
// 8. FÍSIQUES I IA
// ==========================================
function updatePlayer(p, dt) {
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
    const friction = 0.65; // ARREGLAT: Frena en sec més ràpidament per evitar morts injustes

    p.vx += inputX * accel * dt;
    p.vy += inputY * accel * dt;
    p.vx *= friction;
    p.vy *= friction;

    let currentSpeed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
    if(currentSpeed > p.speed) {
        p.vx = (p.vx / currentSpeed) * p.speed;
        p.vy = (p.vy / currentSpeed) * p.speed;
    }
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

    entities.forEach(e => e.detectedThisCycle = false);

    if(lightState === "GREEN") {
        lightState = "RED";
        let dur = 2000 + Math.random() * 2000; 
        if(cycleCount === 1) dur = 3000; 
        nextLightChange = performance.now() + dur;
        
        updateLightHUD();
        playBeep(300, 'sawtooth', 0.5); 
    } else {
        lightState = "GREEN";
        let dur = 3000 + Math.random() * 2000;
        if(cycleCount === 2) dur = 4000; 
        nextLightChange = performance.now() + dur;

        updateLightHUD();
        playBeep(600, 'sine', 0.2); 
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
    
    // ARREGLAT: Et dona un marge més generós (350ms) perquè tinguis temps humà per reaccionar.
    if(timeSinceLightChange < 350) return; 
    
    if(ent.detectedThisCycle) return; 

    let currentSpeed = Math.sqrt(ent.vx*ent.vx + ent.vy*ent.vy);
    
    if(currentSpeed > 30) {
        ent.detectedThisCycle = true;
        ent.strikes++;
        ent.freezeTimer = 1.0; 
        
        if(ent.isPlayer) {
            handlePlayerStrike();
        } else {
            handleNPCStrike(ent);
        }
    }
}

function handlePlayerStrike() {
    updateStrikesHUD();
    playBeep(150, 'square', 0.4); 
    
    if (player.strikes >= 3) {
        isPlaying = false;
        clearInterval(timerInterval);
        setTimeout(() => {
            document.getElementById('screen-gameover').classList.remove('hidden');
        }, 1000);
    } else {
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
        playBeep(100, 'square', 0.6); 

        if(Math.random() > 0.5) addFloatingDialogue("Kuina", "No...");
        else addFloatingDialogue("Ann", "No ha frenat a temps.");
    } else {
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
    let now = performance.now();
    if(now - lastDialogueTime[charName] < 5000) return;
    lastDialogueTime[charName] = now;

    floatingDialogues.push({
        charName: charName,
        text: text,
        timeLeft: 2.5 
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
    // ARREGLAT: El fons ara és gris fosc, no totalment negre, permetent veure molt millor el joc.
    ctx.fillStyle = '#181818';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2 - camera.x, canvas.height / 2 - camera.y);

    // Terra de la pista més clar
    ctx.fillStyle = '#252525';
    ctx.fillRect(-TRACK_WIDTH/2, FINISH_Y - 200, TRACK_WIDTH, START_Y - FINISH_Y + 600);
    
    ctx.strokeStyle = lightState === "GREEN" ? 'rgba(42, 255, 123, 0.6)' : 'rgba(255, 42, 42, 0.6)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-TRACK_WIDTH/2 + 20, FINISH_Y); ctx.lineTo(-TRACK_WIDTH/2 + 20, START_Y + 500);
    ctx.moveTo(TRACK_WIDTH/2 - 20, FINISH_Y); ctx.lineTo(TRACK_WIDTH/2 - 20, START_Y + 500);
    ctx.stroke();

    // La Meta ara destaca molt més visualment
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(-TRACK_WIDTH/2, FINISH_Y, TRACK_WIDTH, 60);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 50px Courier Prime';
    ctx.textAlign = 'center';
    ctx.fillText("SORTIDA", 0, FINISH_Y + 45);

    drawController();

    entities.sort((a,b) => a.y - b.y); 

    entities.forEach(ent => {
        // Ombra del personatge
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.beginPath(); ctx.ellipse(ent.x, ent.y + 15, 20, 8, 0, 0, Math.PI*2); ctx.fill();

        // Cos del personatge
        ctx.beginPath();
        ctx.arc(ent.x, ent.y, ent.radius, 0, Math.PI * 2);
        if(ent.state === 'dead') {
            ctx.fillStyle = 'rgba(100, 0, 0, 0.8)'; 
        } else {
            ctx.fillStyle = ent.color;
            if(ent.isPlayer) {
                ctx.shadowColor = '#fff'; ctx.shadowBlur = 15; 
            }
        }
        ctx.fill(); ctx.shadowBlur = 0;

        if(ent.state === 'alive' && ent.strikes > 0) {
            ctx.fillStyle = '#ff2a2a';
            ctx.font = '14px Courier Prime';
            ctx.fillText("X".repeat(ent.strikes), ent.x, ent.y - 30);
        }

        if(ent.state === 'alive') {
            ctx.fillStyle = ent.isPlayer ? '#ffffff' : '#aaaaaa';
            ctx.font = 'bold 14px Courier Prime';
            ctx.fillText(ent.name, ent.x, ent.y - 15);
        }
    });

    if (!isStatic) {
        floatingDialogues.forEach(dialogue => {
            let ent = entities.find(e => e.name === dialogue.charName);
            if (ent && ent.state === 'alive') {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 1;
                
                let textWidth = ctx.measureText("«" + dialogue.text + "»").width;
                let boxW = textWidth + 24;
                let boxH = 30;
                let boxX = ent.x - boxW/2;
                let boxY = ent.y - 65;

                ctx.fillRect(boxX, boxY, boxW, boxH);
                ctx.strokeRect(boxX, boxY, boxW, boxH);

                ctx.fillStyle = '#fff';
                ctx.font = '14px Courier Prime';
                ctx.fillText("«" + dialogue.text + "»", ent.x, boxY + 20);
            }
        });
    }

    ctx.restore();

    // ARREGLAT: S'ha eliminat la vinyeta negra asfixiant perquè puguis veure sempre l'objectiu
    if (lightState === "RED") {
        ctx.fillStyle = 'rgba(50,0,0,0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function drawController() {
    let ctrlY = FINISH_Y - 150;
    
    if(lightState === "RED") {
        let grad = ctx.createRadialGradient(0, ctrlY, 20, 0, ctrlY, 600);
        grad.addColorStop(0, `rgba(255, 0, 0, 0.4)`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(-600, ctrlY - 300, 1200, 1200);
    }

    ctx.fillStyle = '#333';
    ctx.fillRect(-40, ctrlY, 80, 50);

    ctx.fillStyle = '#222';
    ctx.beginPath(); ctx.arc(0, ctrlY, 35, 0, Math.PI*2); ctx.fill();

    if (figureRotation > 0.1) {
        ctx.fillStyle = `rgba(255, 42, 42, ${figureRotation})`;
        ctx.shadowColor = '#ff2a2a'; ctx.shadowBlur = 20;
        ctx.fillRect(-15, ctrlY + 5, 10, 5);
        ctx.fillRect(5, ctrlY + 5, 10, 5);
        ctx.shadowBlur = 0;
    }
}

// ==========================================
// 14. ÀUDIO SINTÈTIC
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
// 15. TRANSICIÓ
// ==========================================
function goToNextRoom() {
    localStorage.setItem("game02_state", JSON.stringify(gameState));
    alert(`Redirigint a SALA 02...\nSupervivents guardats: ${gameState.survivors.join(", ")}\nAquesta funció està llesta per connectar el següent arxiu.`);
}
