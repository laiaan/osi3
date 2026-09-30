"use strict";


/* =========================================================
   JACK OF HEARTS
========================================================= */

const characters = {

    chishiya: {

        name: "CHISHIYA",
        suit: "♦",
        truth: false,

        statements: [
            "El teu pal és ♦."
        ],

        ask: [
            "El teu pal és ♦. Això és tot el que et diré.",
            "Si vols saber si menteixo, hauràs de comparar el que dic amb la resta.",
            "No esperis que et faciliti la resposta."
        ],

        observe: [
            "Chishiya manté una calma gairebé absoluta.",
            "No aparta la mirada quan parles amb ell.",
            "El seu comportament no sembla el d'algú que tingui por."
        ],

        investigate: [
            "Quan compares la seva declaració amb les altres, el seu pal no coincideix amb el teu.",
            "Chishiya no modifica la seva versió en cap moment.",
            "No trobes cap contradicció interna en el que ha declarat."
        ]

    },


    arisu: {

        name: "ARISU",
        suit: "♠",
        truth: false,

        statements: [
            "El teu pal és ♠."
        ],

        ask: [
            "No sé si pots confiar en mi.",
            "Jo només puc dir-te el que crec que és cert.",
            "Compara la meva resposta amb el que t'han dit els altres."
        ],

        observe: [
            "Arisu sembla més tens que els altres.",
            "Mira repetidament els collars dels altres jugadors.",
            "Sembla estar intentant calcular totes les possibilitats."
        ],

        investigate: [
            "Arisu sembla estar buscant una explicació que encaixi amb totes les declaracions.",
            "La seva versió coincideix amb la seva afirmació inicial, però no amb la realitat del teu collar.",
            "No sembla tenir informació que els altres no tinguin."
        ]

    },


    kuina: {

        name: "KUINA",
        suit: "♣",
        truth: false,

        statements: [
            "El teu pal és ♣."
        ],

        ask: [
            "No et puc assegurar que la resta siguin sincers.",
            "No et precipitis. Encara tens temps.",
            "Potser el que importa no és qui sembla més segur."
        ],

        observe: [
            "Kuina manté una actitud molt segura.",
            "No sembla especialment afectada per la situació.",
            "La seva postura es manté estable mentre observes el grup."
        ],

        investigate: [
            "La seva declaració no coincideix amb la d'algunes de les altres persones.",
            "Kuina manté la mateixa història encara que li facis més preguntes.",
            "No trobes cap prova que confirmi que el teu pal sigui ♣."
        ]

    },


    usagi: {

        name: "USAGI",
        suit: "♥",
        truth: true,

        statements: [
            "El teu pal és ♥."
        ],

        ask: [
            "El teu pal és ♥.",
            "No et puc demostrar que dic la veritat. Hauràs de decidir-ho tu.",
            "Mira les quatre declaracions i pensa quina pot ser certa."
        ],

        observe: [
            "Usagi sembla concentrada, però no excessivament nerviosa.",
            "La seva expressió es manté estable.",
            "No sembla intentar influir directament en la teva decisió."
        ],

        investigate: [
            "La seva declaració és coherent amb la informació que has pogut reunir.",
            "Usagi no canvia la seva resposta quan tornes a analitzar-la.",
            "És l'única declaració que encaixa amb el pal que realment tens."
        ]

    }

};


const SOLUTION = {
    truth: "usagi",
    suit: "♥"
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

    firstTruthChoice: null,

    firstSuitChoice: null,

    actionsUsed: 0,

    maxActions: 3,

    usedActions: [],

    evidence: {

        chishiya: [],
        arisu: [],
        kuina: [],
        usagi: []

    }

};


/* =========================================================
   DOM
========================================================= */

const $ = (id) => document.getElementById(id);

const openingScreen = $("opening-screen");
const gameScreen = $("game-screen");
const decisionScreen = $("decision-screen");
const secondChanceScreen = $("second-chance-screen");
const resultScreen = $("result-screen");

const startButton = $("start-button");
const timer = $("timer");

const actionsUsedElement = $("actions-used");

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
   SCREEN
========================================================= */

function showScreen(screen) {

    document
        .querySelectorAll(".screen")
        .forEach((element) => {
            element.classList.remove("active");
        });

    screen.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

}


/* =========================================================
   CHARACTER HAIR
========================================================= */

function characterHair(key) {

    if (key === "chishiya") {

        return `
            <div class="hair chishiya-hair">
                <span class="chishiya-top"></span>
                <span class="chishiya-side left"></span>
                <span class="chishiya-side right"></span>
                <span class="chishiya-fringe one"></span>
                <span class="chishiya-fringe two"></span>
                <span class="chishiya-fringe three"></span>
            </div>
        `;

    }


    if (key === "arisu") {

        return `
            <div class="hair arisu-hair">
                <span class="arisu-main"></span>
                <span class="arisu-fringe f1"></span>
                <span class="arisu-fringe f2"></span>
                <span class="arisu-fringe f3"></span>
                <span class="arisu-fringe f4"></span>
                <span class="arisu-side"></span>
            </div>
        `;

    }


    if (key === "kuina") {

        return `
            <div class="hair kuina-hair">
                <span class="kuina-main"></span>
                <span class="kuina-ponytail"></span>
                <span class="kuina-front-strand"></span>

                <span class="braid b1"></span>
                <span class="braid b2"></span>
                <span class="braid b3"></span>
                <span class="braid b4"></span>
                <span class="braid b5"></span>
                <span class="braid b6"></span>
                <span class="braid b7"></span>
            </div>
        `;

    }


    if (key === "usagi") {

        return `
            <div class="hair usagi-hair">
                <span class="usagi-main"></span>
                <span class="usagi-bang b1"></span>
                <span class="usagi-bang b2"></span>
                <span class="usagi-bang b3"></span>
                <span class="usagi-side left"></span>
                <span class="usagi-side right"></span>
            </div>
        `;

    }

    return "";
}


/* =========================================================
   CHARACTER ART
========================================================= */

function characterArt(key) {

    const mouthClass = {
        chishiya: "calm",
        arisu: "nervous",
        kuina: "serious",
        usagi: "neutral"
    }[key];


    return `
        <div class="character-figure ${key}-figure">

            <div class="figure-shadow"></div>

            <div class="figure-head">

                ${characterHair(key)}

                <div class="figure-face">

                    <span class="brow left"></span>
                    <span class="brow right"></span>

                    <span class="eye left"></span>
                    <span class="eye right"></span>

                    <span class="nose"></span>

                    <span class="mouth ${mouthClass}"></span>

                </div>

            </div>


            <div class="figure-neck"></div>


            <div class="figure-body">

                <div class="collar-line"></div>
                <div class="shirt-mark"></div>

            </div>


            <div class="figure-arm left">
                <span class="figure-hand"></span>
            </div>

            <div class="figure-arm right">
                <span class="figure-hand"></span>
            </div>


            <div class="figure-leg left"></div>
            <div class="figure-leg right"></div>

        </div>
    `;

}


/* =========================================================
   RENDER CHARACTERS
========================================================= */

function renderCharacters() {

    document
        .querySelectorAll("[data-character-stage]")
        .forEach((stage) => {

            const key = stage.dataset.characterStage;
            const character = characters[key];

            if (!character) {
                return;
            }

            const statement = character.statements[0];

            stage.innerHTML = `

                <div class="speech-bubble">

                    <div class="bubble-name">
                        ${character.name}
                    </div>

                    <div class="bubble-text">
                        “${statement}”
                    </div>

                </div>

                <div class="character-art">
                    ${characterArt(key)}
                </div>

            `;

        });

}


/* =========================================================
   RESET
========================================================= */

function resetState() {

    clearInterval(state.timer);
    clearInterval(state.secondChanceTimer);

    state.timeLeft = 15 * 60;

    state.secondChanceActive = false;
    state.firstAttemptFinished = false;

    state.truthChoice = null;
    state.suitChoice = null;

    state.firstTruthChoice = null;
    state.firstSuitChoice = null;

    state.actionsUsed = 0;
    state.usedActions = [];

    state.evidence = {
        chishiya: [],
        arisu: [],
        kuina: [],
        usagi: []
    };

    playerCollar.textContent = "?";

    updateActionsCounter();

    document
        .querySelectorAll(".action-button")
        .forEach((button) => {

            button.disabled = false;
            button.classList.remove("completed");

        });

    document
        .querySelectorAll(
            "#truth-choice button, #suit-choice button"
        )
        .forEach((button) => {
            button.classList.remove("selected");
        });

    timer.className = "timer";

}


/* =========================================================
   START GAME
========================================================= */

function startGame() {

    resetState();

    showScreen(gameScreen);

    startMainTimer();

}


/* =========================================================
   ACTION COUNTER
========================================================= */

function updateActionsCounter() {

    actionsUsedElement.textContent =
        state.actionsUsed;

    actionsUsedElement.parentElement.classList.toggle(
        "actions-full",
        state.actionsUsed >= state.maxActions
    );

}


function disableAllActions() {

    document
        .querySelectorAll(".action-button")
        .forEach((button) => {

            button.disabled = true;

        });

}


/* =========================================================
   MAIN TIMER
========================================================= */

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
                enterSecondChance();
            } else {
                showGameOver();
            }

        }

    }, 1000);

}


function updateTimer() {

    const minutes =
        Math.max(0, Math.floor(state.timeLeft / 60));

    const seconds =
        Math.max(0, state.timeLeft % 60);

    timer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    timer.classList.remove(
        "timer-warning",
        "timer-danger",
        "timer-critical"
    );

    if (state.timeLeft <= 60) {

        timer.classList.add("timer-critical");

    } else if (state.timeLeft <= 180) {

        timer.classList.add("timer-danger");

    } else if (state.timeLeft <= 300) {

        timer.classList.add("timer-warning");

    }

}


/* =========================================================
   SECOND CHANCE TIMER
========================================================= */

function updateSecondChanceTimer() {

    const minutes =
        Math.max(0, Math.floor(state.timeLeft / 60));

    const seconds =
        Math.max(0, state.timeLeft % 60);

    secondChanceTimer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    secondChanceTimer.classList.remove(
        "timer-warning",
        "timer-danger",
        "timer-critical"
    );

    if (state.timeLeft <= 30) {

        secondChanceTimer.classList.add("timer-critical");

    } else if (state.timeLeft <= 60) {

        secondChanceTimer.classList.add("timer-danger");

    }

}


/* =========================================================
   CHARACTER PANEL
========================================================= */

function openCharacterPanel(key) {

    if (state.secondChanceActive) {
        return;
    }

    const character = characters[key];

    if (!character) {
        return;
    }

    characterPanelContent.innerHTML = `

        <div class="panel-character-art">
            ${characterArt(key)}
        </div>

        <div class="panel-character-name">
            ${character.name}
        </div>

        <div class="panel-character-suit">
            Collar visible: ${character.suit}
        </div>

        <div class="panel-statements">

            <h3>
                DECLARACIÓ INICIAL
            </h3>

            ${character.statements
                .map((statement) => `
                    <p>“${statement}”</p>
                `)
                .join("")}

        </div>
    `;

    characterPanel.classList.add("active");

}


function closeCharacterPanel() {

    characterPanel.classList.remove("active");

}


/* =========================================================
   MODAL
========================================================= */

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
   ACTIONS
========================================================= */

function performAction(action, key, button) {

    if (state.secondChanceActive) {
        return;
    }

    if (state.actionsUsed >= state.maxActions) {

        openModal(`
            <div class="modal-title">
                LÍMIT D'ACCIONS
            </div>

            <p class="modal-dialogue">
                Ja has utilitzat les 3 accions disponibles.
                Ara només pots prendre la decisió final.
            </p>
        `);

        return;
    }

    const character = characters[key];

    if (!character) {
        return;
    }

    if (button.classList.contains("completed")) {
        return;
    }


    let pool = [];

    let typeName = "";


    if (action === "ask") {

        pool = character.ask;
        typeName = "PREGUNTA";

    } else if (action === "observe") {

        pool = character.observe;
        typeName = "OBSERVACIÓ";

    } else if (action === "investigate") {

        pool = character.investigate;
        typeName = "INVESTIGACIÓ";

    }


    if (!pool.length) {
        return;
    }


    const randomLine =
        pool[
            Math.floor(
                Math.random() * pool.length
            )
        ];


    state.actionsUsed++;

    state.usedActions.push({
        action,
        character: key
    });


    state.evidence[key].push(
        `${typeName}: ${randomLine}`
    );


    button.classList.add("completed");
    button.disabled = true;


    updateActionsCounter();


    if (state.actionsUsed >= state.maxActions) {
        disableAllActions();
    }


    openModal(`

        <div class="modal-title">
            ${character.name}
        </div>

        <div class="modal-type">
            ${typeName}
        </div>

        <p class="modal-dialogue">
            “${randomLine}”
        </p>

        <div class="action-result-count">
            ACCIONS UTILITZADES:
            ${state.actionsUsed}/3
        </div>

    `);

}


/* =========================================================
   DECISION SCREEN
========================================================= */

function showDecisionScreen() {

    closeCharacterPanel();
    closeModal();

    state.truthChoice = null;
    state.suitChoice = null;

    document
        .querySelectorAll(
            "#truth-choice button, #suit-choice button"
        )
        .forEach((button) => {
            button.classList.remove("selected");
        });

    showScreen(decisionScreen);

}


/* =========================================================
   TRUTH SELECTION
========================================================= */

document
    .querySelectorAll("#truth-choice button")
    .forEach((button) => {

        button.addEventListener("click", () => {

            state.truthChoice =
                button.dataset.character;

            document
                .querySelectorAll("#truth-choice button")
                .forEach((btn) => {
                    btn.classList.remove("selected");
                });

            button.classList.add("selected");

        });

    });


/* =========================================================
   SUIT SELECTION
========================================================= */

document
    .querySelectorAll("#suit-choice button")
    .forEach((button) => {

        button.addEventListener("click", () => {

            state.suitChoice =
                button.dataset.suit;

            document
                .querySelectorAll("#suit-choice button")
                .forEach((btn) => {
                    btn.classList.remove("selected");
                });

            button.classList.add("selected");

        });

    });


/* =========================================================
   SUBMIT
========================================================= */

function submitDecision() {

    if (
        !state.truthChoice ||
        !state.suitChoice
    ) {

        openModal(`

            <div class="modal-title">
                DECISIÓ INCOMPLETA
            </div>

            <p class="modal-dialogue">
                Has de seleccionar tant la persona
                que diu la veritat com el teu pal.
            </p>

        `);

        return;
    }


    const correct =
        state.truthChoice === SOLUTION.truth &&
        state.suitChoice === SOLUTION.suit;


    if (correct) {

        showSuccess();

        return;
    }


    if (state.secondChanceActive) {

        showGameOver();

        return;
    }


    state.firstTruthChoice =
        state.truthChoice;

    state.firstSuitChoice =
        state.suitChoice;

    state.firstAttemptFinished = true;

    enterSecondChance();

}


/* =========================================================
   SECOND CHANCE
========================================================= */

function enterSecondChance() {

    if (state.secondChanceActive) {
        return;
    }

    clearInterval(state.timer);

    state.secondChanceActive = true;

    state.timeLeft = 120;

    closeModal();
    closeCharacterPanel();

    showScreen(secondChanceScreen);

    updateSecondChanceTimer();

    clearInterval(state.secondChanceTimer);

    state.secondChanceTimer =
        setInterval(() => {

            state.timeLeft--;

            updateSecondChanceTimer();

            if (state.timeLeft <= 0) {

                clearInterval(state.secondChanceTimer);

                showGameOver();

            }

        }, 1000);

}


/* =========================================================
   CHANGE DECISION
========================================================= */

function changeDecision() {

    closeModal();

    showDecisionScreen();

}


/* =========================================================
   REVIEW EVIDENCE
========================================================= */

function reviewEvidence() {

    let html = `

        <div class="modal-title">
            PROVES RECOPILADES
        </div>

        <div class="evidence-counter">
            ${state.actionsUsed}/3 accions utilitzades
        </div>
    `;


    const allEvidence =
        Object.entries(state.evidence)
            .flatMap(([key, evidence]) => {

                return evidence.map((item) => ({
                    character: characters[key].name,
                    text: item
                }));

            });


    if (!allEvidence.length) {

        html += `
            <p class="modal-dialogue">
                No has recopilat cap prova.
            </p>
        `;

    } else {

        html += `<div class="evidence-list">`;

        allEvidence.forEach((item) => {

            html += `

                <div class="evidence-item">

                    <strong>
                        ${item.character}
                    </strong>

                    <span>
                        ${item.text}
                    </span>

                </div>

            `;

        });

        html += `</div>`;

    }


    openModal(html);

}


/* =========================================================
   SUCCESS
========================================================= */

function showSuccess() {

    clearInterval(state.timer);
    clearInterval(state.secondChanceTimer);

    state.secondChanceActive = false;

    closeModal();
    closeCharacterPanel();

    playerCollar.textContent = SOLUTION.suit;

    resultScreen.classList.remove("game-over");

    resultSymbol.textContent = "♥";

    resultTitle.textContent =
        "HAS SOBREVISCUT";

    resultText.innerHTML = `

        Has encertat les dues respostes.

        <br><br>

        <strong>
            La persona que diu la veritat és Usagi.
        </strong>

        <br>

        <strong>
            El teu pal és ♥.
        </strong>

        <br><br>

        Has superat el Jack of Hearts.

    `;

    showScreen(resultScreen);

}


/* =========================================================
   GAME OVER
========================================================= */

function showGameOver() {

    clearInterval(state.timer);
    clearInterval(state.secondChanceTimer);

    state.secondChanceActive = false;

    closeModal();
    closeCharacterPanel();

    resultScreen.classList.add("game-over");

    resultSymbol.textContent = "×";

    resultTitle.textContent =
        "GAME OVER";

    resultText.innerHTML = `

        Has fallat la decisió final.

        <br><br>

        La resposta correcta era:

        <br><br>

        <strong>
            USAGI
        </strong>

        <br>

        <strong>
            ♥
        </strong>

    `;

    showScreen(resultScreen);

}


/* =========================================================
   EVENTS
========================================================= */

startButton.addEventListener(
    "click",
    startGame
);


finalDecisionButton.addEventListener(
    "click",
    showDecisionScreen
);


submitDecisionButton.addEventListener(
    "click",
    submitDecision
);


reviewEvidenceButton.addEventListener(
    "click",
    reviewEvidence
);


changeDecisionButton.addEventListener(
    "click",
    changeDecision
);


characterPanelClose.addEventListener(
    "click",
    closeCharacterPanel
);


modalClose.addEventListener(
    "click",
    closeModal
);


modalLayer.addEventListener(
    "click",
    (event) => {

        if (event.target === modalLayer) {
            closeModal();
        }

    }
);


restartButton.addEventListener(
    "click",
    () => {

        resetState();

        showScreen(openingScreen);

    }
);


/* =========================================================
   ACTION BUTTONS
========================================================= */

document
    .querySelectorAll(".action-button")
    .forEach((button) => {

        button.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                performAction(
                    button.dataset.action,
                    button.dataset.character,
                    button
                );

            }
        );

    });


/* =========================================================
   CHARACTER CARDS
========================================================= */

document
    .querySelectorAll(".character-card")
    .forEach((card) => {

        card.addEventListener(
            "click",
            (event) => {

                if (
                    event.target.closest(".action-button")
                ) {
                    return;
                }

                if (state.secondChanceActive) {
                    return;
                }

                openCharacterPanel(
                    card.dataset.character
                );

            }
        );


        card.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    if (state.secondChanceActive) {
                        return;
                    }

                    openCharacterPanel(
                        card.dataset.character
                    );

                }

            }
        );

    });


/* =========================================================
   ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key !== "Escape") {
            return;
        }

        closeModal();
        closeCharacterPanel();

    }
);


/* =========================================================
   INIT
========================================================= */

renderCharacters();

showScreen(openingScreen);

updateActionsCounter();
