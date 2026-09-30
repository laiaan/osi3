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

        talk: [
            "No et diré si estic dient la veritat.",
            "Si vols sobreviure, hauràs d'observar més i confiar menys."
        ],

        observe: [
            "Chishiya sembla completament tranquil.",
            "No sembla nerviós ni preocupat pel seu collar.",
            "La seva actitud és difícil de llegir."
        ]

    },


    arisu: {

        name: "ARISU",

        suit: "♠",

        truth: false,

        statements: [
            "El teu pal és ♠."
        ],

        talk: [
            "No sé si pots confiar en mi.",
            "Potser hauries de fixar-te en el que diu cadascú."
        ],

        observe: [
            "Arisu sembla més tens que els altres.",
            "Mira repetidament els collars dels altres jugadors.",
            "Sembla estar intentant calcular totes les possibilitats."
        ]

    },


    kuina: {

        name: "KUINA",

        suit: "♣",

        truth: false,

        statements: [
            "El teu pal és ♣."
        ],

        talk: [
            "No et puc assegurar que la resta siguin sincers.",
            "No et precipitis. Encara tens temps."
        ],

        observe: [
            "Kuina manté una actitud molt segura.",
            "No sembla especialment afectada per la situació.",
            "El seu comportament no revela clarament si menteix."
        ]

    },


    usagi: {

        name: "USAGI",

        suit: "♥",

        truth: true,

        statements: [
            "El teu pal és ♥."
        ],

        talk: [
            "No et puc demostrar que dic la veritat.",
            "Però pensa en totes les coses que has vist fins ara."
        ],

        observe: [
            "Usagi sembla concentrada, però no excessivament nerviosa.",
            "La seva expressió es manté estable.",
            "No sembla intentar influir directament en la teva decisió."
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

const characterPanel = $("character-panel");

const characterPanelContent =
    $("character-panel-content");

const characterPanelClose =
    $("character-panel-close");

const finalDecisionButton =
    $("final-decision-button");

const submitDecisionButton =
    $("submit-decision");

const secondChanceTimer =
    $("second-chance-timer");

const reviewEvidenceButton =
    $("review-evidence");

const changeDecisionButton =
    $("change-decision");

const modalLayer =
    $("modal-layer");

const modalContent =
    $("modal-content");

const modalClose =
    $("modal-close");

const resultSymbol =
    $("result-symbol");

const resultTitle =
    $("result-title");

const resultText =
    $("result-text");

const restartButton =
    $("restart-button");

const playerCollar =
    $("player-collar");


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

                <span class="hair-main"></span>

                <span class="hair-left"></span>

                <span class="hair-right"></span>

            </div>

        `;

    }


    if (key === "arisu") {

        return `

            <div class="hair arisu-hair">

                <span class="hair-main"></span>

                <span class="spike spike-1"></span>

                <span class="spike spike-2"></span>

                <span class="spike spike-3"></span>

                <span class="spike spike-4"></span>

            </div>

        `;

    }


    if (key === "kuina") {

        return `

            <div class="hair kuina-hair">

                <span class="kuina-top"></span>

                <span class="kuina-front-strand"></span>

                <span class="braid braid-1"></span>

                <span class="braid braid-2"></span>

                <span class="braid braid-3"></span>

                <span class="braid braid-4"></span>

                <span class="braid braid-5"></span>

                <span class="braid braid-6"></span>

                <span class="braid braid-7"></span>

            </div>

        `;

    }


    if (key === "usagi") {

        return `

            <div class="hair usagi-hair">

                <span class="usagi-bob"></span>

                <span class="usagi-bang bang-left"></span>

                <span class="usagi-bang bang-center"></span>

                <span class="usagi-bang bang-right"></span>

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

        kuina: "smile",

        usagi: "neutral"

    }[key];


    return `

        <div class="stick-person ${key}-person">

            <div class="head">

                ${characterHair(key)}

                <div class="face">

                    <span class="eye left"></span>

                    <span class="eye right"></span>

                    <span class="nose"></span>

                    <span class="mouth ${mouthClass}"></span>

                </div>

            </div>


            <div class="neck"></div>


            <div class="body">

                <div class="shirt-detail"></div>

            </div>


            <div class="arm arm-left"></div>

            <div class="arm arm-right"></div>

            <div class="hand hand-left"></div>

            <div class="hand hand-right"></div>

            <div class="leg leg-left"></div>

            <div class="leg leg-right"></div>

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

            const key =
                stage.dataset.characterStage;

            stage.innerHTML =
                characterArt(key);

        });

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


    state.evidence = {

        chishiya: [],

        arisu: [],

        kuina: [],

        usagi: []

    };


    playerCollar.textContent = "?";


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
        Math.max(
            0,
            Math.floor(state.timeLeft / 60)
        );


    const seconds =
        Math.max(
            0,
            state.timeLeft % 60
        );


    timer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


    timer.classList.remove(
        "timer-warning",
        "timer-danger",
        "timer-critical"
    );


    if (state.timeLeft <= 60) {

        timer.classList.add(
            "timer-critical"
        );

    } else if (state.timeLeft <= 180) {

        timer.classList.add(
            "timer-danger"
        );

    } else if (state.timeLeft <= 300) {

        timer.classList.add(
            "timer-warning"
        );

    }

}


/* =========================================================
   SECOND CHANCE TIMER
========================================================= */

function updateSecondChanceTimer() {

    const minutes =
        Math.max(
            0,
            Math.floor(state.timeLeft / 60)
        );


    const seconds =
        Math.max(
            0,
            state.timeLeft % 60
        );


    secondChanceTimer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


    secondChanceTimer.classList.remove(
        "timer-warning",
        "timer-danger",
        "timer-critical"
    );


    if (state.timeLeft <= 30) {

        secondChanceTimer.classList.add(
            "timer-critical"
        );

    } else if (state.timeLeft <= 60) {

        secondChanceTimer.classList.add(
            "timer-danger"
        );

    }

}


/* =========================================================
   CHARACTER PANEL
========================================================= */

function openCharacterPanel(key) {

    if (state.secondChanceActive) {
        return;
    }


    const character =
        characters[key];


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
                DECLARACIÓ
            </h3>

            ${character.statements
                .map(
                    (statement) => `
                        <p>
                            “${statement}”
                        </p>
                    `
                )
                .join("")}

        </div>

    `;


    characterPanel.classList.add("active");

}


function closeCharacterPanel() {

    characterPanel.classList.remove(
        "active"
    );

}


/* =========================================================
   MODAL
========================================================= */

function openModal(content) {

    modalContent.innerHTML =
        content;

    modalLayer.classList.add(
        "active"
    );

    document.body.classList.add(
        "modal-open"
    );

}


function closeModal() {

    modalLayer.classList.remove(
        "active"
    );

    document.body.classList.remove(
        "modal-open"
    );

}


/* =========================================================
   ACTIONS
========================================================= */

function performAction(
    action,
    key,
    button
) {

    if (state.secondChanceActive) {
        return;
    }


    const character =
        characters[key];


    if (!character) {
        return;
    }


    if (button.classList.contains("completed")) {
        return;
    }


    button.classList.add(
        "completed"
    );

    button.disabled = true;


    let content = "";


    if (action === "talk") {

        const randomLine =
            character.talk[
                Math.floor(
                    Math.random() *
                    character.talk.length
                )
            ];


        state.evidence[key].push(
            `PARLAR: ${randomLine}`
        );


        content = `

            <div class="modal-title">

                ${character.name}

            </div>


            <div class="modal-type">

                CONVERSA

            </div>


            <p class="modal-dialogue">

                “${randomLine}”

            </p>

        `;

    }


    if (action === "observe") {

        const randomLine =
            character.observe[
                Math.floor(
                    Math.random() *
                    character.observe.length
                )
            ];


        state.evidence[key].push(
            `OBSERVAR: ${randomLine}`
        );


        content = `

            <div class="modal-title">

                ${character.name}

            </div>


            <div class="modal-type">

                OBSERVACIÓ

            </div>


            <p class="modal-dialogue">

                ${randomLine}

            </p>

        `;

    }


    openModal(content);

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

            button.classList.remove(
                "selected"
            );

        });


    showScreen(
        decisionScreen
    );

}


/* =========================================================
   TRUTH SELECTION
========================================================= */

document
    .querySelectorAll("#truth-choice button")
    .forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                state.truthChoice =
                    button.dataset.character;


                document
                    .querySelectorAll(
                        "#truth-choice button"
                    )
                    .forEach((btn) => {

                        btn.classList.remove(
                            "selected"
                        );

                    });


                button.classList.add(
                    "selected"
                );

            }
        );

    });


/* =========================================================
   SUIT SELECTION
========================================================= */

document
    .querySelectorAll("#suit-choice button")
    .forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                state.suitChoice =
                    button.dataset.suit;


                document
                    .querySelectorAll(
                        "#suit-choice button"
                    )
                    .forEach((btn) => {

                        btn.classList.remove(
                            "selected"
                        );

                    });


                button.classList.add(
                    "selected"
                );

            }
        );

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

    state.firstAttemptFinished =
        true;


    enterSecondChance();

}


/* =========================================================
   SECOND CHANCE
========================================================= */

function enterSecondChance() {

    if (state.secondChanceActive) {
        return;
    }


    clearInterval(
        state.timer
    );


    state.secondChanceActive =
        true;


    state.timeLeft =
        120;


    closeModal();

    closeCharacterPanel();


    showScreen(
        secondChanceScreen
    );


    updateSecondChanceTimer();


    clearInterval(
        state.secondChanceTimer
    );


    state.secondChanceTimer =
        setInterval(() => {

            state.timeLeft--;

            updateSecondChanceTimer();


            if (state.timeLeft <= 0) {

                clearInterval(
                    state.secondChanceTimer
                );

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

    `;


    const allEvidence =
        Object.entries(
            state.evidence
        ).flatMap(
            ([key, evidence]) => {

                return evidence.map(
                    (item) => ({

                        character:
                            characters[key].name,

                        text: item

                    })
                );

            }
        );


    if (
        allEvidence.length === 0
    ) {

        html += `

            <p class="modal-dialogue">

                No has recopilat cap prova.

            </p>

        `;

    } else {

        html += `
            <div class="evidence-list">
        `;


        allEvidence.forEach(
            (item) => {

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

            }
        );


        html += `
            </div>
        `;

    }


    openModal(html);

}


/* =========================================================
   SUCCESS
========================================================= */

function showSuccess() {

    clearInterval(
        state.timer
    );

    clearInterval(
        state.secondChanceTimer
    );


    state.secondChanceActive =
        false;


    closeModal();

    closeCharacterPanel();


    playerCollar.textContent =
        SOLUTION.suit;


    resultScreen.classList.remove(
        "game-over"
    );


    resultSymbol.textContent =
        "♥";


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


    showScreen(
        resultScreen
    );

}


/* =========================================================
   GAME OVER
========================================================= */

function showGameOver() {

    clearInterval(
        state.timer
    );

    clearInterval(
        state.secondChanceTimer
    );


    state.secondChanceActive =
        false;


    closeModal();

    closeCharacterPanel();


    resultScreen.classList.add(
        "game-over"
    );


    resultSymbol.textContent =
        "×";


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


    showScreen(
        resultScreen
    );

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

        if (
            event.target === modalLayer
        ) {

            closeModal();

        }

    }
);


restartButton.addEventListener(
    "click",
    () => {

        resetState();

        showScreen(
            openingScreen
        );

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


                const action =
                    button.dataset.action;


                const character =
                    button.dataset.character;


                performAction(
                    action,
                    character,
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
                    event.target.closest(
                        ".action-button"
                    )
                ) {

                    return;

                }


                if (
                    state.secondChanceActive
                ) {

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


                    if (
                        state.secondChanceActive
                    ) {

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

        if (
            event.key !== "Escape"
        ) {

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

showScreen(
    openingScreen
);
