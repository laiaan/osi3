"use strict";

/* =========================================================
   JACK OF HEARTS - STRICT LOGIC DOSSIER
========================================================= */

const SOLUTION = {
    truth: "usagi",
    suit: "♥"
};

const characters = {
    chishiya: {
        name: "CHISHIYA", suit: "♣", truth: false,
        statements: ["El teu pal és ♣."],
        observe: "Mostra calma absoluta, observa als altres. Mira l'Arisu al parlar, i mira el collar de la Usagi quan diu ♥ sense immutar-se.",
        investigate: "Manté que veu ♣. No pregunta què veuen els altres i redirigeix la conversa hàbilment.",
        questions: [
            { id: "q1", q: "Per què t'hauria de creure?", a: "No ho facis. Confiar en algú aquí és el primer pas per morir." },
            { id: "q2", q: "Quin interès tens en què jo visqui?", a: "Cap ni un. Només m'avorreixo i vull veure com reaccioneu." },
            { id: "q3", q: "Qui creus que menteix dels altres?", a: "Tothom menteix, només has de descobrir qui ho fa pitjor." }
        ]
    },
    arisu: {
        name: "ARISU", suit: "♦", truth: false,
        statements: ["El teu pal és ♦."],
        observe: "Té gestos nerviosos. Es frega les mans, mira a terra i mira breument a la Usagi per apartar la mirada ràpidament.",
        investigate: "S'atura en parlar i corregeix algunes paraules. Manté el ♦. Deixa el dubte obert sobre si menteix o simplement té por.",
        questions: [
            { id: "q1", q: "Per què estàs tan nerviós?", a: "Perquè si t'equivoques, et maten. I si jo m'equivoco, també em maten." },
            { id: "q2", q: "Estàs segur del que veus al meu coll?", a: "I tant... (empassa saliva) no jugaria pas amb la vida d'un altre." },
            { id: "q3", q: "Creus que l'Usagi diu la veritat?", a: "No ho sé! Això és una bogeria, no puc pensar amb claredat!" }
        ]
    },
    kuina: {
        name: "KUINA", suit: "♠", truth: false,
        statements: ["El teu pal és ♠."],
        observe: "Fa gestos de suport cap a l'Arisu i cap a tu quan sembles bloquejat. Manté una postura segura.",
        investigate: "Manté el ♠. Es revela que anteriorment va preguntar a l'Arisu què faria si algú estigués mentint, fet ambigu.",
        questions: [
            { id: "q1", q: "Com sé que no m'enganyes?", a: "Si vols saber què faria jo... miraria qui canvia més la seva història." },
            { id: "q2", q: "Què hi guanyes tu mentint?", a: "Res. Jo només vull sortir d'aquí amb vida, igual que tu." },
            { id: "q3", q: "Notes alguna cosa estranya en el Chishiya?", a: "Sempre té la mateixa cara. És impossible saber què pensa." }
        ]
    },
    usagi: {
        name: "USAGI", truth: true, suit: "♥",
        statements: ["El teu pal és ♥."],
        observe: "Postura controlada, precisa. S'allunya lleugerament quan et veu confós sense intentar convèncer-te a la força.",
        investigate: "Manté ♥ des de l'inici. Respon de manera directa, sense inventar dades addicionals i no acusa ni defensa a ningú.",
        questions: [
            { id: "q1", q: "M'estàs dient la veritat?", a: "No ho hauries de fer perquè t'ho digui jo. Mira què fa cadascú i decideix-ho tu." },
            { id: "q2", q: "Per què no intentes convèncer-me més?", a: "Si t'obligo a creure'm i et mors, serà culpa meva. La decisió és teva." },
            { id: "q3", q: "Tens por de morir?", a: "Tothom en té. Però no deixaré que la por em faci mentir per matar un innocent." }
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
    chishiya: { observed: false, questionAsked: false, selectedQuestionId: null, investigated: false },
    arisu: { observed: false, questionAsked: false, selectedQuestionId: null, investigated: false },
    kuina: { observed: false, questionAsked: false, selectedQuestionId: null, investigated: false },
    usagi: { observed: false, questionAsked: false, selectedQuestionId: null, investigated: false }
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
        characterStates[key] = { observed: false, questionAsked: false, selectedQuestionId: null, investigated: false };
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

    let questionHTML = '';
    if (cState.questionAsked) {
        const askedQ = character.questions.find(q => q.id === cState.selectedQuestionId);
        questionHTML = `<div class="action-result visible"><strong>Tu:</strong> ${askedQ.q}<br><strong>${character.name}:</strong> ${askedQ.a}</div>`;
    } else {
        questionHTML = `
            <select id="question-select-${key}" class="action-select" ${isReadOnly ? 'disabled' : ''}>
                <option value="" disabled selected>Escull una pregunta...</option>
                ${character.questions.map(q => `<option value="${q.id}">${q.q}</option>`).join('')}
            </select>
            <button class="action-button ${isReadOnly ? 'completed' : ''}" data-action="ask" data-character="${key}" ${isReadOnly ? 'disabled' : ''}>💬 PREGUNTAR</button>
        `;
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
                ${questionHTML}
            </div>

            <div class="action-group">
                <button class="action-button ${cState.investigated || isReadOnly ? 'completed' : ''}" data-action="investigate" data-character="${key}" ${cState.investigated || isReadOnly ? 'disabled' : ''}>
                    🔎 INVESTIGAR
                </button>
                <div id="result-investigate-${key}" class="action-result ${cState.investigated ? 'visible' : 'hidden'}">${character.investigate}</div>
            </div>
        </div>
    `;

    characterPanelContent.querySelectorAll('.action-button').forEach(btn => {
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
    } 
    else if (action === 'investigate') {
        cState.investigated = true;
        document.getElementById(`result-investigate-${key}`).classList.replace('hidden', 'visible');
        state.evidence[key].push(`🔎 INVESTIGACIÓ: ${character.investigate}`);
    }
    else if (action === 'ask') {
        const select = document.getElementById(`question-select-${key}`);
        if (!select.value) return; 
        
        cState.questionAsked = true;
        cState.selectedQuestionId = select.value;
        const askedQ = character.questions.find(q => q.id === select.value);
        state.evidence[key].push(`💬 PREGUNTA: ${askedQ.q} -> R: ${askedQ.a}`);
        
        openCharacterPanel(key); 
        return; 
    }

    button.disabled = true;
    button.classList.add('completed');
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
