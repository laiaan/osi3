"use strict";

/* =========================================================
   JACK OF HEARTS - MARCEL IN BORDERLAND DEFINITIU
========================================================= */

const SOLUTION = {
    truth: "usagi",
    suit: "♥"
};

const characters = {
    chishiya: {
        name: "CHISHIYA", suit: "♣", truth: false,
        statements: ["És ♣. Ja tens quatre respostes. Una és correcta. No necessites que jo et faci la feina."],
        observe: "Roman assegut i relaxat. Els seus ulls van d'un jugador a l'altre. Quan et mira, et sosté la mirada amb total calma, sense mostrar cap indici d'urgència tot i que el temps s'acaba.",
        investigate: "Manté el ♣. No ha donat cap detall per justificar per què ho sap. Quan se li demana més informació, respon amb una altra pregunta o dirigeix l'atenció cap al comportament dels altres jugadors.",
        questions: [
            { id: "q1", q: "Per què t'hauria de creure?", a: "Tots tenim un motiu per mentir per salvar-nos. Pregunta't quin és el meu. Jo no hi guanyo res si tu mors ara." },
            { id: "q2", q: "Qui et sembla més sospitós?", a: "No és la pregunta correcta. Hauries de preguntar-te qui necessita que desconfiïs dels altres." },
            { id: "q3", q: "Què estàs intentant fer?", a: "Sobreviure, com tots. Però jo no necessito posar-me a tremolar o fingir pena per aconseguir-ho." }
        ]
    },
    arisu: {
        name: "ARISU", suit: "♦", truth: false,
        statements: ["És ♦. Ho sento. Sé que no és gaire útil dir-t'ho així, però és el que estic veient."],
        observe: "Es frega les mans i evita el contacte visual prolongat amb tu. Té la respiració agitada. Quan els altres parlen, obre la boca com si volgués intervenir, però es mossega el llavi i s'atura.",
        investigate: "Reafirma el ♦ molt ràpid quan se li pregunta directament. No obstant, en explicar la situació, s'ha entrebancat i ha corregit una paraula de la seva pròpia frase. Sembla estar sota una pressió emocional immensa.",
        questions: [
            { id: "q1", q: "Per què estàs tan nerviós?", a: "Em posa dels nervis saber que la teva vida depèn del que jo et digui ara mateix. És massa pressió, d'acord?" },
            { id: "q2", q: "Per què hauria de creure't?", a: "Mira els meus ulls. Si t'estigués mentint a la cara sabent que t'explotarà el coll d'aquí a uns minuts... creus que podria suportar-ho?" },
            { id: "q3", q: "Què creus que està passant aquí?", a: "No ho entenc. Si tots veiem el mateix, per què donen respostes diferents? Què hi guanyen? No té cap sentit!" }
        ]
    },
    kuina: {
        name: "KUINA", suit: "♠", truth: false,
        statements: ["És ♠. No sé si et servirà de res que t'ho digui, però és el que veig."],
        observe: "Manté una postura oberta i et dedica somriures lleus per tranquil·litzar-te. Quan la tensió puja a l'habitació, el seu to de veu és el més suau. Et busca constantment amb la mirada.",
        investigate: "No es mou del ♠. En lloc de donar arguments clars sobre el que veu al teu coll, centra les seves intervencions en preguntar com et sents o en assenyalar l'estat de nervis de la resta del grup.",
        questions: [
            { id: "q1", q: "Com sé que no m'enganyes?", a: "(Somriu i respira fons). Jo no jugo amb les vides de la gent. Concentra't i confia en el teu instint." },
            { id: "q2", q: "Qui et sembla més sospitós?", a: "El Chishiya. Perquè sembla que ja sap què faràs abans que ho facis." },
            { id: "q3", q: "Què creus que està fent l'Arisu?", a: "Pateix molt per la pressió. Però alerta... a vegades els que semblen més inofensius són els que tenen més por a dir la veritat." }
        ]
    },
    usagi: {
        name: "USAGI", truth: true, suit: "♥",
        statements: ["És ♥. (Pausa). Això és el que veig."],
        observe: "Es manté al marge de les discussions. Fa un petit pas enrere si et veu molt angoixat, deixant-te espai personal. Et mira de manera directa i fixa als ulls, però sense fer cap gest per acostar-se.",
        investigate: "Continua dient ♥. No ha afegit cap explicació addicional ni ha posat cap excusa per donar suport a la seva resposta. Dóna frases molt curtes i no entra a valorar què diuen els seus companys.",
        questions: [
            { id: "q1", q: "Per què hauria de creure't?", a: "Creure'm és la teva responsabilitat, no la meva. Jo no m'esforçaré en convèncer-te si decideixes dubtar de la meva paraula." },
            { id: "q2", q: "I si t'estàs equivocant?", a: "Llavors m'hauré equivocat. Però no et diré que he vist una altra cosa només perquè soni més segur." },
            { id: "q3", q: "Qui et sembla més difícil de llegir?", a: "Cadascú té la seva pròpia estratègia de supervivència basada en la por. Cap d'ells m'inspira una confiança cega, la veritat." }
        ]
    }
};

/* =========================================================
   STATE
========================================================= */
const state = {
    timeLeft: 15 * 60,
    timer: null,
    secondChanceTimer: null,
    secondChanceActive: false,
    firstAttemptFinished: false,
    truthChoice: null,
    suitChoice: null,
    evidence: {
        chishiya: [], arisu: [], kuina: [], usagi: []
    }
};

const characterStates = {
    chishiya: { observed: false, questionsAskedCount: 0, askedQuestions: [], investigated: false },
    arisu: { observed: false, questionsAskedCount: 0, askedQuestions: [], investigated: false },
    kuina: { observed: false, questionsAskedCount: 0, askedQuestions: [], investigated: false },
    usagi: { observed: false, questionsAskedCount: 0, askedQuestions: [], investigated: false }
};

/* =========================================================
   DOM ELEMENTS
========================================================= */
const $ = (id) => document.getElementById(id);

const openingScreen = $("opening-screen");
const rulesScreen = $("rules-screen");
const gameScreen = $("game-screen");
const decisionScreen = $("decision-screen");
const secondChanceScreen = $("second-chance-screen");
const resultScreen = $("result-screen");

const startButton = $("start-button");
const beginInvestigationButton = $("begin-investigation-button");
const timer = $("timer");

const characterPanel = $("character-panel");
const characterPanelContent = $("character-panel-content");
const characterPanelClose = $("character-panel-close");

const finalDecisionButton = $("final-decision-button");
const submitDecisionButton = $("submit-decision");
const secondChanceTimer = $("second-chance-timer");
const reviewEvidenceButton = $("review-evidence");
const changeDecisionButton = $("change-decision");

const modalLayer = $("modal-layer");
const modalContent = $("modal-content");
const modalClose = $("modal-close");

const resultSymbol = $("result-symbol");
const resultTitle = $("result-title");
const resultText = $("result-text");
const restartButton = $("restart-button");
const playerCollar = $("player-collar");

/* =========================================================
   SCREEN MANAGEMENT
========================================================= */
function showScreen(screen) {
    document.querySelectorAll(".screen").forEach((element) => {
        element.classList.remove("active");
    });
    screen.classList.add("active");
    window.scrollTo({ top: 0, behavior: "instant" });
}

/* =========================================================
   CHARACTER ART & HAIR (CSS INJECTION)
========================================================= */
function characterHair(key) {
    if (key === "chishiya") return `<div class="hair chishiya-hair"><span class="hair-main"></span><span class="hair-left"></span><span class="hair-right"></span></div>`;
    if (key === "arisu") return `<div class="hair arisu-hair"><span class="hair-main"></span><span class="spike spike-1"></span><span class="spike spike-2"></span><span class="spike spike-3"></span><span class="spike spike-4"></span></div>`;
    if (key === "kuina") return `<div class="hair kuina-hair"><span class="kuina-top"></span><span class="kuina-front-strand"></span><span class="braid braid-1"></span><span class="braid braid-2"></span><span class="braid braid-3"></span><span class="braid braid-4"></span><span class="braid braid-5"></span><span class="braid braid-6"></span><span class="braid braid-7"></span></div>`;
    if (key === "usagi") return `<div class="hair usagi-hair"><span class="usagi-bob"></span><span class="usagi-bang bang-left"></span><span class="usagi-bang bang-center"></span><span class="usagi-bang bang-right"></span></div>`;
    return "";
}

function characterArt(key) {
    const mouthClass = { chishiya: "calm", arisu: "nervous", kuina: "smile", usagi: "neutral" }[key];
    return `
        <div class="stick-person ${key}-person">
            <div class="head">
                ${characterHair(key)}
                <div class="face">
                    <span class="eye left"></span><span class="eye right"></span>
                    <span class="nose"></span><span class="mouth ${mouthClass}"></span>
                </div>
            </div>
            <div class="neck"></div>
            <div class="body"><div class="shirt-detail"></div></div>
            <div class="arm arm-left"></div><div class="arm arm-right"></div>
            <div class="hand hand-left"></div><div class="hand hand-right"></div>
            <div class="leg leg-left"></div><div class="leg leg-right"></div>
        </div>`;
}

function renderCharacters() {
    document.querySelectorAll("[data-character-stage]").forEach((stage) => {
        const key = stage.dataset.characterStage;
        const character = characters[key];
        if (!character) return;

        stage.innerHTML = `
            <div class="speech-bubble">
                <div class="bubble-name">${character.name} Diu:</div>
                <div class="bubble-text">“${character.statements[0]}”</div>
            </div>
            <div class="character-art">${characterArt(key)}</div>
        `;
    });
}

/* =========================================================
   TIMERS & FLOW
========================================================= */
function resetState() {
    clearInterval(state.timer);
    clearInterval(state.secondChanceTimer);

    state.timeLeft = 15 * 60;
    state.secondChanceActive = false;
    state.firstAttemptFinished = false;
    state.truthChoice = null;
    state.suitChoice = null;

    Object.keys(characterStates).forEach(key => {
        characterStates[key] = { observed: false, questionsAskedCount: 0, askedQuestions: [], investigated: false };
        state.evidence[key] = [];
    });

    playerCollar.textContent = "?";
    submitDecisionButton.disabled = true;

    document.querySelectorAll("#truth-choice button, #suit-choice button").forEach(btn => btn.classList.remove("selected"));
    timer.className = "timer";
}

function startMainTimer() {
    clearInterval(state.timer);
    state.timeLeft = 15 * 60;
    updateTimer();

    state.timer = setInterval(() => {
        state.timeLeft--;
        updateTimer();

        if (state.timeLeft <= 0) {
            clearInterval(state.timer);
            if (!state.firstAttemptFinished) {
                state.firstAttemptFinished = true;
                enterSecondChance();
            } else {
                showGameOver();
            }
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.max(0, Math.floor(state.timeLeft / 60));
    const seconds = Math.max(0, state.timeLeft % 60);
    timer.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    timer.classList.remove("timer-warning", "timer-danger", "timer-critical");
    if (state.timeLeft <= 30) timer.classList.add("timer-critical");
    else if (state.timeLeft <= 120) timer.classList.add("timer-danger");
    else if (state.timeLeft <= 300) timer.classList.add("timer-warning");
}

/* =========================================================
   CHARACTER MODAL (PANEL INVESTIGACIÓN)
========================================================= */
function openCharacterPanel(key) {
    const isReadOnly = state.secondChanceActive;
    const character = characters[key];
    const cState = characterStates[key];
    
    if (!character) return;

    // Mostrar les preguntes que ja ha fet (màxim 2)
    let askedQuestionsHTML = cState.askedQuestions.map(q => `
        <div class="action-result visible" style="margin-bottom:8px;">
            <strong>Tu:</strong> ${q.q}<br>
            <strong>${character.name}:</strong> ${q.a}
        </div>
    `).join('');

    // Controls per seguir preguntant si no n'ha fet 2 encara
    let askControlsHTML = '';
    if (cState.questionsAskedCount < 2 && !isReadOnly) {
        let availableOptions = character.questions.filter(q => !cState.askedQuestions.some(aq => aq.id === q.id));
        let optionsHTML = availableOptions.map(q => `<option value="${q.id}">${q.q}</option>`).join('');

        askControlsHTML = `
            <select id="question-select-${key}" class="action-select">
                <option value="" disabled selected>Escull una pregunta... (${2 - cState.questionsAskedCount} restants)</option>
                ${optionsHTML}
            </select>
            <button class="action-button" data-action="ask" data-character="${key}">💬 PREGUNTAR</button>
        `;
    } else if (cState.questionsAskedCount >= 2) {
        askControlsHTML = `<button class="action-button completed" disabled>💬 PREGUNTES ESGOTADES</button>`;
    } else if (isReadOnly) {
        askControlsHTML = `<button class="action-button completed" disabled>💬 PREGUNTAR</button>`;
    }

    characterPanelContent.innerHTML = `
        <div class="panel-character-art">${characterArt(key)}</div>
        <div class="panel-character-name">${character.name}</div>
        <div class="panel-character-suit">Afirma veure: ${character.suit}</div>
        
        <div class="panel-statements">
            <h3>ACCIONS D'INVESTIGACIÓ</h3>
            
            <div class="action-group">
                <button class="action-button ${cState.observed || isReadOnly ? 'completed' : ''}" data-action="observe" data-character="${key}" ${cState.observed || isReadOnly ? 'disabled' : ''}>
                    👁 OBSERVAR
                </button>
                <div id="result-observe-${key}" class="action-result ${cState.observed ? 'visible' : 'hidden'}">${character.observe}</div>
            </div>

            <div class="action-group">
                ${askedQuestionsHTML}
                ${askControlsHTML}
            </div>

            <div class="action-group">
                <button class="action-button ${cState.investigated || isReadOnly ? 'completed' : ''}" data-action="investigate" data-character="${key}" ${cState.investigated || isReadOnly ? 'disabled' : ''}>
                    🔎 INVESTIGAR
                </button>
                <div id="result-investigate-${key}" class="action-result ${cState.investigated ? 'visible' : 'hidden'}">${character.investigate}</div>
            </div>
        </div>
    `;

    characterPanelContent.querySelectorAll('.action-button:not(.completed)').forEach(btn => {
        btn.addEventListener('click', (e) => executeCharacterAction(e.target, key));
    });

    characterPanel.classList.add("active");
}

function executeCharacterAction(button, key) {
    const action = button.dataset.action;
    const cState = characterStates[key];
    const character = characters[key];

    if (action === 'observe') {
        cState.observed = true;
        document.getElementById(`result-observe-${key}`).classList.replace('hidden', 'visible');
        state.evidence[key].push(`👁 OBSERVACIÓ: ${character.observe}`);
        button.disabled = true;
        button.classList.add('completed');
    } 
    else if (action === 'investigate') {
        cState.investigated = true;
        document.getElementById(`result-investigate-${key}`).classList.replace('hidden', 'visible');
        state.evidence[key].push(`🔎 INVESTIGACIÓ: ${character.investigate}`);
        button.disabled = true;
        button.classList.add('completed');
    }
    else if (action === 'ask') {
        const select = document.getElementById(`question-select-${key}`);
        if (!select.value) return; 
        
        cState.questionsAskedCount++;
        const askedQ = character.questions.find(q => q.id === select.value);
        cState.askedQuestions.push(askedQ);
        state.evidence[key].push(`💬 PREGUNTA: ${askedQ.q} -> R: ${askedQ.a}`);
        
        openCharacterPanel(key); 
    }
}

function closeCharacterPanel() {
    characterPanel.classList.remove("active");
}

/* =========================================================
   DECISION SCREEN
========================================================= */
function showDecisionScreen() {
    closeCharacterPanel();
    closeModal();
    showScreen(decisionScreen);
    checkDecisionReady();
}

function checkDecisionReady() {
    submitDecisionButton.disabled = !(state.truthChoice && state.suitChoice);
}

document.querySelectorAll("#truth-choice button").forEach((button) => {
    button.addEventListener("click", () => {
        state.truthChoice = button.dataset.character;
        document.querySelectorAll("#truth-choice button").forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
        checkDecisionReady();
    });
});

document.querySelectorAll("#suit-choice button").forEach((button) => {
    button.addEventListener("click", () => {
        state.suitChoice = button.dataset.suit;
        document.querySelectorAll("#suit-choice button").forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
        checkDecisionReady();
    });
});

function submitDecision() {
    const correct = (state.truthChoice === SOLUTION.truth && state.suitChoice === SOLUTION.suit);

    if (correct) {
        showSuccess();
    } else {
        if (state.secondChanceActive) {
            showGameOver();
        } else {
            state.firstAttemptFinished = true;
            enterSecondChance();
        }
    }
}

/* =========================================================
   SECOND CHANCE
========================================================= */
function enterSecondChance() {
    clearInterval(state.timer);
    state.secondChanceActive = true;
    state.timeLeft = 120; // 02:00

    closeModal();
    closeCharacterPanel();
    showScreen(secondChanceScreen);
    
    updateSecondChanceTimer();
    clearInterval(state.secondChanceTimer);

    state.secondChanceTimer = setInterval(() => {
        state.timeLeft--;
        updateSecondChanceTimer();

        if (state.timeLeft <= 0) {
            clearInterval(state.secondChanceTimer);
            showGameOver();
        }
    }, 1000);
}

function updateSecondChanceTimer() {
    const minutes = Math.max(0, Math.floor(state.timeLeft / 60));
    const seconds = Math.max(0, state.timeLeft % 60);
    secondChanceTimer.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    secondChanceTimer.classList.remove("timer-danger", "timer-critical");
    if (state.timeLeft <= 30) secondChanceTimer.classList.add("timer-critical");
    else if (state.timeLeft <= 60) secondChanceTimer.classList.add("timer-danger");
}

function changeDecision() {
    closeModal();
    showDecisionScreen();
}

/* =========================================================
   REVIEW EVIDENCE (MODAL)
========================================================= */
function reviewEvidence() {
    let html = `<div class="modal-title">EVIDÈNCIES RECOPILADES</div>`;
    const allEvidence = Object.entries(state.evidence).flatMap(([key, evs]) => 
        evs.map(text => ({ character: characters[key].name, text }))
    );

    if (allEvidence.length === 0) {
        html += `<p class="modal-dialogue">No has recopilat cap prova.</p>`;
    } else {
        html += `<div class="evidence-list">`;
        allEvidence.forEach(item => {
            html += `<div class="evidence-item"><strong>${item.character}</strong><span>${item.text}</span></div>`;
        });
        html += `</div>`;
    }
    openModal(html);
}

function openModal(content) {
    modalContent.innerHTML = content;
    modalLayer.classList.add("active");
    document.body.classList.add("modal-open");
}
function closeModal() {
    modalLayer.classList.remove("active");
    document.body.classList.remove("modal-open");
}

/* =========================================================
   SUCCESS & GAME OVER
========================================================= */
function showSuccess() {
    clearInterval(state.timer);
    clearInterval(state.secondChanceTimer);
    closeModal();
    closeCharacterPanel();

    playerCollar.textContent = SOLUTION.suit;
    resultScreen.classList.remove("game-over");
    resultSymbol.textContent = "♥";
    resultTitle.textContent = "GAME CLEAR";
    resultText.innerHTML = `
        <strong>L'Usagi</strong> deia la veritat.<br>El teu collar és el <strong>♥</strong>.<br><br>
        Has superat el joc...<br><br>
        <span style="letter-spacing: 0.1em; color: #fff; font-size: 15px;">TIME WAS NEVER ON YOUR SIDE.</span>
    `;
    showScreen(resultScreen);
}

function showGameOver() {
    clearInterval(state.timer);
    clearInterval(state.secondChanceTimer);
    closeModal();
    closeCharacterPanel();

    resultScreen.classList.add("game-over");
    resultSymbol.textContent = "×";
    resultTitle.textContent = "GAME OVER";
    resultText.innerHTML = `No has aconseguit identificar correctament qui deia la veritat. El temps s'ha acabat.`;
    showScreen(resultScreen);
}

/* =========================================================
   EVENT LISTENERS INITIALIZATION
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    startButton.addEventListener("click", () => showScreen(rulesScreen));
    beginInvestigationButton.addEventListener("click", () => {
        resetState();
        showScreen(gameScreen);
        startMainTimer();
    });

    document.querySelectorAll(".character-card").forEach((card) => {
        card.addEventListener("click", () => openCharacterPanel(card.dataset.character));
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openCharacterPanel(card.dataset.character);
            }
        });
    });

    finalDecisionButton.addEventListener("click", showDecisionScreen);
    submitDecisionButton.addEventListener("click", submitDecision);
    reviewEvidenceButton.addEventListener("click", reviewEvidence);
    changeDecisionButton.addEventListener("click", changeDecision);
    characterPanelClose.addEventListener("click", closeCharacterPanel);
    modalClose.addEventListener("click", closeModal);
    
    restartButton.addEventListener("click", () => {
        resetState();
        showScreen(openingScreen);
    });

    modalLayer.addEventListener("click", (e) => {
        if (e.target === modalLayer) closeModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
            closeCharacterPanel();
        }
    });

    renderCharacters();
    showScreen(openingScreen);
}); 
