/* ==========================================================================
   GAME 02 — LA PARTIDA | PROVA 02: LA TAULA
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'laPartida_gameState';

    // Estat Global de la Partida
    let gameState = {
        currentChapter: 2,
        survivors: ['Chishiya', 'Niragi', 'Kuina', 'Aguni', 'Ann', 'Mira'],
        eliminated: [],
        decisions: { door: null, token: null, box: null, finalChoice: null },
        consequences: [],
        advantages: [],
        completedChapters: [7]
    };

    function loadState() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                gameState = { ...gameState, ...parsed, currentChapter: 2 };
            } catch (e) {
                console.warn('Estat corromput. Utilitzant l’estat per defecte.');
            }
        }
    }

    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }

    loadState();

    // Sintetitzador d'Àudio (Web Audio API - Sense dependències externs)
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) audioCtx = new AudioCtx();
    }

    function playSound(type) {
        initAudio();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === 'bell') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, now);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
            osc.start(now);
            osc.stop(now + 1.2);
        } else if (type === 'click') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'voice') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
        } else if (type === 'tension') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(60, now);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 2.0);
            osc.start(now);
            osc.stop(now + 2.0);
        }
    }

    // Elements DOM
    const chairsContainer = document.getElementById('chairs-container');
    const screenText = document.getElementById('screen-text');
    const systemVoiceBox = document.getElementById('system-voice-container');
    const systemVoiceText = document.getElementById('system-voice-text');
    const tokensGroup = document.getElementById('tokens-group');
    const boxObject = document.getElementById('box-object');
    const photoEvidence = document.getElementById('photo-evidence');
    const bellObject = document.getElementById('bell-object');
    
    const dialogueBox = document.getElementById('dialogue-box');
    const dialogueSpeaker = document.getElementById('dialogue-speaker');
    const dialogueText = document.getElementById('dialogue-text');
    const dialogueNextBtn = document.getElementById('dialogue-next');
    
    const actionPanel = document.getElementById('action-panel');
    const btnActionA = document.getElementById('btn-action-a');
    const btnActionB = document.getElementById('btn-action-b');

    const blackoutOverlay = document.getElementById('blackout-overlay');
    const btnReset = document.getElementById('btn-reset');
    const resetModal = document.getElementById('reset-modal');
    const btnConfirmReset = document.getElementById('btn-confirm-reset');
    const btnCancelReset = document.getElementById('btn-cancel-reset');

    let dialogueQueue = [];
    let onDialogueFinished = null;

    // Render de Cadires
    function renderChairs() {
        chairsContainer.innerHTML = '';
        const allPossible = ['Chishiya', 'Niragi', 'Kuina', 'Aguni', 'Ann', 'Mira'];
        
        allPossible.forEach((person, idx) => {
            const isAlive = gameState.survivors.includes(person);
            const chairDiv = document.createElement('div');
            chairDiv.className = `chair chair-${idx} ${isAlive ? '' : 'empty'}`;
            chairDiv.dataset.person = person;

            chairDiv.innerHTML = `
                <div class="chair-avatar">${person.charAt(0)}</div>
                <div class="chair-name">${isAlive ? person.toUpperCase() : 'BUIDA'}</div>
            `;
            chairsContainer.appendChild(chairDiv);
        });
    }

    function highlightSpeaker(speakerName) {
        document.querySelectorAll('.chair').forEach(c => c.classList.remove('speaking'));
        if (speakerName) {
            const target = document.querySelector(`.chair[data-person="${speakerName}"]`);
            if (target && !target.classList.contains('empty')) {
                target.classList.add('speaking');
            }
        }
    }

    // Gestió de Diàlegs
    function showDialogues(lines, callback) {
        dialogueQueue = lines.filter(line => gameState.survivors.includes(line.speaker) || line.speaker === 'SISTEMA');
        onDialogueFinished = callback;
        nextDialogue();
    }

    function nextDialogue() {
        if (dialogueQueue.length === 0) {
            dialogueBox.classList.add('hidden');
            highlightSpeaker(null);
            if (onDialogueFinished) onDialogueFinished();
            return;
        }

        const current = dialogueQueue.shift();
        highlightSpeaker(current.speaker);
        
        dialogueSpeaker.textContent = current.speaker.toUpperCase();
        dialogueText.textContent = `"${current.text}"`;
        dialogueBox.classList.remove('hidden');
        playSound('click');
    }

    dialogueNextBtn.addEventListener('click', nextDialogue);

    function speakSystem(text, duration = 3000, callback = null) {
        systemVoiceText.textContent = text;
        systemVoiceBox.classList.remove('hidden');
        playSound('voice');

        setTimeout(() => {
            systemVoiceBox.classList.add('hidden');
            if (callback) callback();
        }, duration);
    }

    // Flux Principal
    function startTrial02() {
        renderChairs();
        screenText.textContent = "PROVA 02 — LA TAULA";
        
        speakSystem("AQUESTA PROVA NO COMENÇA QUAN PARLEU. COMENÇA QUAN DECIDIU.", 4000, () => {
            startRound1();
        });
    }

    // Ronda 1
    function startRound1() {
        screenText.textContent = "UNA FITXA GARANTEIX PROTECCIÓ.";
        
        const linesRound1 = [
            { speaker: 'Ann', text: "No sabem què significa exactament 'protecció'." },
            { speaker: 'Chishiya', text: "Això és precisament el que volen que ens preocupi." },
            { speaker: 'Niragi', text: "Agafa'n una i acabem d'una vegada." }
        ];

        showDialogues(linesRound1, () => {
            tokensGroup.classList.remove('hidden');
        });
    }

    document.querySelectorAll('.token-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tokenType = e.currentTarget.dataset.token;
            gameState.decisions.token = tokenType;
            saveState();

            playSound('click');
            tokensGroup.classList.add('hidden');

            speakSystem(`FITXA ${tokenType.toUpperCase()} SELECCIONADA.`, 2500, () => {
                startRound2();
            });
        });
    });

    // Ronda 2
    function startRound2() {
        screenText.textContent = "RONDA 2 — LA REVELACIÓ";
        
        boxObject.classList.remove('closed');
        photoEvidence.classList.remove('hidden');
        playSound('bell');

        speakSystem("UN DE VOSALTRES NO ARRIBARÀ AL FINAL.", 3500, () => {
            const linesRound2 = [
                { speaker: 'Kuina', text: "No penso deixar que decideixin qui queda fora." },
                { speaker: 'Aguni', text: "Si no decidim nosaltres, decidiran per nosaltres." },
                { speaker: 'Mira', text: "Potser aquesta és exactament la decisió que volen que prenguem." }
            ];

            showDialogues(linesRound2, () => {
                actionPanel.classList.remove('hidden');
            });
        });
    }

    btnActionA.addEventListener('click', () => handleBoxDecision('open'));
    btnActionB.addEventListener('click', () => handleBoxDecision('keep_closed'));

    function handleBoxDecision(choice) {
        gameState.decisions.box = choice;
        saveState();

        playSound('click');
        actionPanel.classList.add('hidden');

        speakSystem("DECISIÓ REGISTRADA.", 2000, () => {
            startRound3();
        });
    }

    // Ronda 3: Apagada de Llums i Conseqüències Deterministes
    function startRound3() {
        blackoutOverlay.classList.remove('hidden');
        playSound('tension');

        setTimeout(() => {
            applyConsequences();
            renderChairs();

            blackoutOverlay.classList.add('hidden');

            speakSystem("LA VOSTRA DECISIÓ HA TINGUT CONSEQÜÈNCIES.", 3500, () => {
                let reactionLines = [];
                if (gameState.eliminated.length > 0) {
                    reactionLines.push({ speaker: 'Chishiya', text: "Tal com havia previst... la cadira és buida." });
                    reactionLines.push({ speaker: 'Kuina', text: "On ha anat? Com ha pogut passar tan ràpid?" });
                } else {
                    reactionLines.push({ speaker: 'Ann', text: "Tots continuem aquí, però hem perdut una oportunitat valuosa." });
                }

                showDialogues(reactionLines, () => {
                    finishTrial02();
                });
            });
        }, 2200);
    }

    // Lògica Determinista (Sense Math.random)
    function applyConsequences() {
        const token = gameState.decisions.token;
        const box = gameState.decisions.box;

        if (token === 'negra' && box === 'keep_closed') {
            const target = gameState.survivors.includes('Niragi') ? 'Niragi' : 'Aguni';
            if (gameState.survivors.includes(target)) {
                gameState.survivors = gameState.survivors.filter(s => s !== target);
                gameState.eliminated.push(target);
                gameState.consequences.push(`Eliminació de ${target} per pressió en la Prova 02`);
            }
        } else if (token === 'vermella' && box === 'open') {
            gameState.advantages.push('Clau de la Prova 03');
            gameState.consequences.push('Revelació completa de la fotografia');
        } else {
            gameState.consequences.push('Pèrdua d’avantatge tàctic per a la Prova 03');
        }

        saveState();
    }

    function finishTrial02() {
        gameState.completedChapters.push(2);
        gameState.currentChapter = 3;
        saveState();

        screenText.textContent = "PROVA 02 COMPLETA.";
        
        const linesEnd = [
            { speaker: 'Aguni', text: "Això no s'ha acabat. La següent cambra serà la definitiva." },
            { speaker: 'Mira', text: "Heu jugat molt bé... de moment." }
        ];

        showDialogues(linesEnd, () => {
            speakSystem("PROVA 02 SUPERADA. PORTES DE LA SALA 03 OBERTES.", 4000);
        });
    }

    // Interaccions Extres
    bellObject.addEventListener('click', () => {
        playSound('bell');
        bellObject.style.transform = 'scale(1.2)';
        setTimeout(() => bellObject.style.transform = 'scale(1)', 200);
    });

    btnReset.addEventListener('click', () => resetModal.classList.remove('hidden'));
    btnCancelReset.addEventListener('click', () => resetModal.classList.add('hidden'));
    btnConfirmReset.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    });

    startTrial02();
});
