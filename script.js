/* =========================================================
   GAME 03 — JACK OF HEARTS
   ========================================================= */


/* =========================================================
   PERSONATGES
========================================================= */

const characters = {

  chishiya: {
    name: "CHISHIYA",
    suit: "♣",
    truth: false,

    opening:
      "És ♣. Ja tens quatre respostes. Una és correcta.",

    observation: [
      "Chishiya es manté tranquil mentre els altres parlen.",
      "Quan Arisu respon, el mira abans de tornar la mirada cap a tu.",
      "Quan Usagi diu ♥, mira breument el seu collar i després et mira a tu.",
      "No mostra cap sorpresa clara davant de cap resposta."
    ],

    questions: {
      "Per què t’hauria de creure?": [
        "No ho facis.",
        "Si necessites que et convenci, probablement no sóc la persona que hauries d’escollir."
      ],

      "Qui et sembla més sospitós?": [
        "No és la pregunta correcta.",
        "Hauries de preguntar-te qui necessita que desconfiïs dels altres."
      ],

      "Estàs segur que és ♣?": [
        "Sí.",
        "Ho he vist."
      ],

      "Què estàs intentant fer?": [
        "Que decideixis tu.",
        "Si et dic què has de pensar, ja no serà la teva decisió."
      ]
    },

    investigation: [
      "Ha mantingut la mateixa resposta: ♣.",
      "No ha preguntat als altres quin pal han vist.",
      "Ha prestat més atenció a les reaccions dels altres que a defensar la seva pròpia resposta.",
      "Quan se l’ha pressionat, ha evitat donar explicacions que es puguin comprovar directament.",
      "En diversos moments ha desviat l’atenció cap als altres jugadors.",
      "No s’han detectat canvis en la seva versió."
    ]
  },


  arisu: {
    name: "ARISU",
    suit: "♦",
    truth: false,

    opening:
      "És ♦. Ho sento. Sé que no és gaire útil dir-t’ho així, però és el que estic veient.",

    observation: [
      "Després que Chishiya parli, Arisu sembla que vol intervenir.",
      "Obre la boca, però es deté i acaba dient: «No, res.»",
      "Quan Kuina parla, mira a terra i es frega les mans.",
      "Quan Usagi diu ♥, la mira durant un instant i després aparta la mirada."
    ],

    questions: {
      "Per què estàs tan nerviós?": [
        "Perquè si t’equivoques, et maten.",
        "I perquè sé que jo podria estar en la teva situació."
      ],

      "Estàs segur que és ♦?": [
        "Sí.",
        "Sí. Ho he vist."
      ],

      "Has canviat d’opinió en algun moment?": [
        "No.",
        "Bueno... no sobre el que he vist."
      ],

      "Què creus que està passant aquí?": [
        "Que algú està intentant semblar més segur del que és.",
        "I no sé si ho fa perquè menteix o perquè té por."
      ]
    },

    investigation: [
      "Abans de respondre en un moment, ha començat dues frases i s’ha interromput.",
      "Ha demanat que li repetissin una pregunta.",
      "Ha observat les reaccions dels altres abans de respondre en diverses ocasions.",
      "Quan se li ha preguntat directament pel seu pal, ha contestat sense dubtar.",
      "En explicar un moment anterior, ha corregit una paraula abans de continuar.",
      "No s’han detectat canvis en el pal que afirma haver vist: ♦."
    ]
  },


  kuina: {
    name: "KUINA",
    suit: "♠",
    truth: false,

    opening:
      "És ♠. No sé si et servirà de res que t’ho digui, però és el que veig.",

    observation: [
      "Quan Arisu sembla nerviós, Kuina el mira durant uns segons.",
      "Quan Chishiya domina la conversa, Kuina deixa de participar i observa.",
      "Quan tu sembles bloquejat, fa un petit gest per tranquil·litzar-te.",
      "No mostra una reacció forta davant de les diferents respostes."
    ],

    questions: {
      "Per què hauria de confiar en tu?": [
        "No hauries de fer-ho.",
        "No perquè jo estigui mentint.",
        "Perquè no em coneixes.",
        "Però si vols saber què faria jo... miraria qui canvia més la seva història."
      ],

      "Qui et sembla més sospitós?": [
        "Chishiya.",
        "Perquè sembla que ja sap què faràs abans que ho facis."
      ],

      "Què creus que està fent Arisu?": [
        "Intentant no equivocar-se.",
        "No sé si això el fa més o menys fiable."
      ],

      "Estàs segura que és ♠?": [
        "Sí.",
        "Completament.",
        "Això sí que ho tinc clar."
      ]
    },

    investigation: [
      "Abans de començar, ha preguntat a Arisu si tothom estava bé.",
      "Durant el joc ha intentat reduir la tensió quan algú semblava nerviós.",
      "Quan Chishiya ha dominat la conversa, ha deixat de participar durant uns instants.",
      "No ha canviat mai la seva resposta: ♠.",
      "Abans de començar, havia preguntat a Arisu què faria si algú estigués mentint."
    ]
  },


  usagi: {
    name: "USAGI",
    suit: "♥",
    truth: true,

    opening:
      "És ♥.",

    observation: [
      "Usagi no interromp els altres jugadors mentre parlen.",
      "Quan Arisu diu ♦, el mira breument abans de tornar a mirar-te.",
      "Quan Kuina parla, no mostra una reacció especialment visible.",
      "Quan Chishiya parla, manté l’atenció sobre ell durant uns instants.",
      "Quan sembles confós, fa un petit pas enrere en lloc d’apropar-se per convèncer-te."
    ],

    questions: {
      "Per què hauria de creure’t?": [
        "No ho hauries de fer perquè t’ho digui jo.",
        "Mira què fa cadascú i decideix-ho tu."
      ],

      "Qui et sembla més difícil de llegir?": [
        "Chishiya.",
        "Però això no vol dir que estigui mentint."
      ],

      "Qui et sembla més nerviós?": [
        "Arisu.",
        "Però estar nerviós no vol dir que menteixi."
      ],

      "I Kuina?": [
        "Està intentant que estiguis tranquil.",
        "No sé si això és perquè diu la veritat o perquè vol que hi confiïs."
      ]
    },

    investigation: [
      "Ha mantingut la mateixa resposta des del principi: ♥.",
      "Ha respost directament a les preguntes que se li han fet.",
      "No ha intentat canviar la teva opinió sobre cap dels altres jugadors.",
      "Quan un altre jugador ha estat qüestionat, no l’ha defensat ni l’ha acusat.",
      "Quan se li ha demanat que confirmés la seva resposta, no ha afegit informació que no pogués saber.",
      "La seva resposta continua sent ♥.",
      "En una segona confirmació ha trigat uns segons més a respondre."
    ]
  }

};


/* =========================================================
   ESTAT DEL JOC
========================================================= */

const state = {

  currentCharacter: null,

  discovered: {
    chishiya: {
      observation: false,
      question: null,
      investigation: false
    },

    arisu: {
      observation: false,
      question: null,
      investigation: false
    },

    kuina: {
      observation: false,
      question: null,
      investigation: false
    },

    usagi: {
      observation: false,
      question: null,
      investigation: false
    }
  },

  truthChoice: null,
  suitChoice: null,

  firstTruthChoice: null,
  firstSuitChoice: null,

  firstAttemptFinished: false,
  secondChanceActive: false,

  timer: null,
  timeLeft: 15 * 60,

  secondChanceTimer: null,
  secondTimeLeft: 2 * 60

};


/* =========================================================
   ELEMENTS
========================================================= */

const $ = (id) => document.getElementById(id);

const introScreen = $("intro-screen");
const rulesScreen = $("rules-screen");
const gameScreen = $("game-screen");
const decisionScreen = $("decision-screen");
const secondChanceScreen = $("second-chance-screen");
const resultScreen = $("result-screen");

const enterGameBtn = $("enter-game-btn");
const startGameBtn = $("start-game-btn");

const characterPanel = $("character-panel");
const panelCharacterName = $("panel-character-name");
const panelCharacterArt = $("panel-character-art");
const closeCharacterPanel = $("close-character-panel");

const observationBtn = $("observation-btn");
const questionBtn = $("question-btn");
const investigationBtn = $("investigation-btn");

const modalLayer = $("modal-layer");
const modalClose = $("modal-close");
const modalContent = $("modal-content");

const finalDecisionBtn = $("final-decision-btn");

const truthChoice = $("truth-choice");
const suitChoice = $("suit-choice");
const submitDecisionBtn = $("submit-decision-btn");

const secondChanceTimer = $("second-chance-timer");
const reviewEvidenceBtn = $("review-evidence-btn");
const changeDecisionBtn = $("change-decision-btn");

const timerDisplay = $("timer");

const resultStatus = $("result-status");
const resultSymbol = $("result-symbol");
const resultTitle = $("result-title");
const resultText = $("result-text");


/* =========================================================
   UTILITATS
========================================================= */

function formatTime(seconds) {

  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const secs = (seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
}


function showScreen(screen) {

  [
    introScreen,
    rulesScreen,
    gameScreen,
    decisionScreen,
    secondChanceScreen,
    resultScreen
  ].forEach((element) => {

    if (element) {
      element.classList.remove("active");
    }

  });

  if (screen) {
    screen.classList.add("active");
  }
}


function openModal(content) {

  modalContent.innerHTML = content;

  modalLayer.classList.add("open");
}


function closeModal() {

  modalLayer.classList.remove("open");

  modalContent.innerHTML = "";
}


function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}


/* =========================================================
   PERSONATGES CSS
========================================================= */

function characterArt(key) {

  const char = characters[key];

  return `
    <div class="stick-person ${key}-person">

      <div class="head">

        <div class="eye left"></div>
        <div class="eye right"></div>

        <div class="mouth"></div>

        <div class="hair ${key}-hair">

          ${key === "chishiya" ? `
            <span></span>
            <span></span>
            <span></span>
          ` : ""}

          ${key === "arisu" ? `
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          ` : ""}

          ${key === "kuina" ? `
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          ` : ""}

          ${key === "usagi" ? `
            <span class="long-hair"></span>
            <span class="ponytail"></span>
            <span class="ponytail-tip"></span>
          ` : ""}

        </div>

      </div>

      <div class="neck"></div>

      <div class="body ${key}-body">

        <div class="collar">
          ${char.suit}
        </div>

      </div>

      <div class="arm left-arm"></div>
      <div class="arm right-arm"></div>

    </div>
  `;
}


/* =========================================================
   CREAR PERSONATGES
========================================================= */

function renderCharacterCards() {

  document.querySelectorAll(".character-card").forEach((card) => {

    const key = card.dataset.character;
    const stage = card.querySelector(".character-stage");

    if (!stage || !characters[key]) {
      return;
    }

    stage.innerHTML = characterArt(key);

  });

}


/* =========================================================
   CREAR OPCIONS DE VERITAT
========================================================= */

function renderTruthChoices() {

  truthChoice.innerHTML = Object.keys(characters)
    .map((key) => {

      return `
        <button
          type="button"
          data-character="${key}"
        >
          ${characters[key].name}
        </button>
      `;

    })
    .join("");

  truthChoice
    .querySelectorAll("button")
    .forEach((button) => {

      button.addEventListener("click", () => {

        if (state.secondChanceActive) {
          return;
        }

        truthChoice
          .querySelectorAll("button")
          .forEach((btn) => {
            btn.classList.remove("selected");
          });

        button.classList.add("selected");

        state.truthChoice = button.dataset.character;

        updateSubmitButton();

      });

    });

}


/* =========================================================
   INICI
========================================================= */

enterGameBtn.addEventListener("click", () => {

  showScreen(rulesScreen);

});


startGameBtn.addEventListener("click", () => {

  showScreen(gameScreen);

  closePanel();
  closeModal();

  startMainTimer();
  startOpeningDialogue();

});


/* =========================================================
   OPENING DIALOGUE
========================================================= */

function startOpeningDialogue() {

  const dialogue = $("opening-dialogue");
  const name = $("opening-name");
  const text = $("opening-text");

  const sequence = [
    "chishiya",
    "arisu",
    "kuina",
    "usagi"
  ];

  let index = 0;


  function showNext() {

    if (index >= sequence.length) {

      dialogue.classList.remove("active");

      return;
    }

    const key = sequence[index];
    const char = characters[key];

    name.textContent = char.name;
    text.textContent = char.opening;

    dialogue.classList.add("active");

    index++;

    setTimeout(() => {

      dialogue.classList.remove("active");

      setTimeout(showNext, 400);

    }, 2600);

  }


  showNext();

}


/* =========================================================
   TIMER PRINCIPAL
========================================================= */

function startMainTimer() {

  clearInterval(state.timer);

  state.timeLeft = 15 * 60;

  state.firstAttemptFinished = false;
  state.secondChanceActive = false;

  updateMainTimer();


  state.timer = setInterval(() => {

    state.timeLeft--;

    updateMainTimer();


    if (state.timeLeft <= 0) {

      clearInterval(state.timer);

      if (!state.firstAttemptFinished) {

        enterSecondChance();

      }

    }

  }, 1000);

}


function updateMainTimer() {

  timerDisplay.textContent =
    formatTime(Math.max(0, state.timeLeft));


  timerDisplay.classList.remove(
    "timer-warning",
    "timer-danger",
    "timer-critical"
  );


  if (state.timeLeft <= 30) {

    timerDisplay.classList.add("timer-critical");

  } else if (state.timeLeft <= 120) {

    timerDisplay.classList.add("timer-danger");

  } else if (state.timeLeft <= 300) {

    timerDisplay.classList.add("timer-warning");

  }

}


/* =========================================================
   CHARACTER CARDS
========================================================= */

document
  .querySelectorAll(".character-card")
  .forEach((card) => {

    card.addEventListener("click", () => {

      if (state.secondChanceActive) {
        return;
      }

      const key = card.dataset.character;

      openCharacter(key);

    });

  });


function openCharacter(key) {

  if (!characters[key]) {
    return;
  }

  state.currentCharacter = key;

  const char = characters[key];

  panelCharacterName.textContent = char.name;

  panelCharacterArt.innerHTML =
    characterArt(key);

  characterPanel.classList.add("open");

  updatePanelButtons();

}


function closePanel() {

  characterPanel.classList.remove("open");

  state.currentCharacter = null;

}


closeCharacterPanel.addEventListener(
  "click",
  closePanel
);


/* =========================================================
   BOTONS DEL PANELL
========================================================= */

function updatePanelButtons() {

  const key = state.currentCharacter;

  if (!key) {
    return;
  }

  const evidence = state.discovered[key];


  observationBtn.disabled =
    Boolean(evidence.observation);

  questionBtn.disabled =
    Boolean(evidence.question);

  investigationBtn.disabled =
    Boolean(evidence.investigation);


  observationBtn.classList.toggle(
    "completed",
    Boolean(evidence.observation)
  );

  questionBtn.classList.toggle(
    "completed",
    Boolean(evidence.question)
  );

  investigationBtn.classList.toggle(
    "completed",
    Boolean(evidence.investigation)
  );

}


/* =========================================================
   OBSERVACIÓ
========================================================= */

observationBtn.addEventListener("click", () => {

  const key = state.currentCharacter;

  if (!key || state.secondChanceActive) {
    return;
  }

  if (state.discovered[key].observation) {
    return;
  }


  state.discovered[key].observation = true;

  const lines = characters[key].observation;


  openModal(`
    <div class="evidence-modal">

      <div class="modal-label">
        OBSERVACIÓ
      </div>

      <h2>
        ${characters[key].name}
      </h2>

      <div class="evidence-list">

        ${lines
          .map((line) => `
            <p>
              ${escapeHTML(line)}
            </p>
          `)
          .join("")}

      </div>

    </div>
  `);


  updatePanelButtons();

});


/* =========================================================
   PREGUNTA
========================================================= */

questionBtn.addEventListener("click", () => {

  const key = state.currentCharacter;

  if (!key || state.secondChanceActive) {
    return;
  }

  if (state.discovered[key].question) {
    return;
  }


  const questions =
    Object.keys(characters[key].questions);


  openModal(`
    <div class="question-modal">

      <div class="modal-label">
        INTERROGATORI
      </div>

      <h2>
        Tria una pregunta
      </h2>

      <div class="question-options">

        ${questions
          .map((question, index) => `
            <button
              type="button"
              class="question-option"
              data-question-index="${index}"
            >
              ${escapeHTML(question)}
            </button>
          `)
          .join("")}

      </div>

    </div>
  `);


  document
    .querySelectorAll(".question-option")
    .forEach((button) => {

      button.addEventListener("click", () => {

        const index =
          Number(button.dataset.questionIndex);

        const selectedQuestion =
          questions[index];

        const answer =
          characters[key].questions[selectedQuestion];


        state.discovered[key].question = {

          question: selectedQuestion,

          answer: [...answer]

        };


        showQuestionAnswer(
          key,
          selectedQuestion,
          answer
        );


        updatePanelButtons();

      });

    });

});


function showQuestionAnswer(
  key,
  question,
  answer
) {

  openModal(`
    <div class="answer-modal">

      <div class="modal-label">
        RESPOSTA — ${characters[key].name}
      </div>

      <h2>
        ${escapeHTML(question)}
      </h2>

      <div class="character-answer">

        ${answer
          .map((line) => `
            <p>
              ${escapeHTML(line)}
            </p>
          `)
          .join("")}

      </div>

    </div>
  `);

}


/* =========================================================
   INVESTIGACIÓ
========================================================= */

investigationBtn.addEventListener("click", () => {

  const key = state.currentCharacter;

  if (!key || state.secondChanceActive) {
    return;
  }

  if (state.discovered[key].investigation) {
    return;
  }


  state.discovered[key].investigation = true;

  const lines = characters[key].investigation;


  openModal(`
    <div class="investigation-modal">

      <div class="modal-label">
        DOSSIER D'INVESTIGACIÓ
      </div>

      <h2>
        ${characters[key].name}
      </h2>

      <div class="evidence-list">

        ${lines
          .map((line) => `
            <p>
              ▸ ${escapeHTML(line)}
            </p>
          `)
          .join("")}

      </div>

      <div class="investigation-note">
        No hi ha cap conclusió automàtica.
        La interpretació és teva.
      </div>

    </div>
  `);


  updatePanelButtons();

});


/* =========================================================
   MODAL
========================================================= */

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


/* =========================================================
   FINAL DECISION
========================================================= */

finalDecisionBtn.addEventListener(
  "click",
  () => {

    if (state.secondChanceActive) {
      return;
    }

    clearInterval(state.timer);

    state.firstAttemptFinished = true;

    closePanel();
    closeModal();

    showDecisionScreen();

  }
);


function showDecisionScreen() {

  state.truthChoice = null;
  state.suitChoice = null;


  document
    .querySelectorAll(
      "#truth-choice button, #suit-choice button"
    )
    .forEach((button) => {

      button.classList.remove("selected");

    });


  submitDecisionBtn.disabled = true;


  showScreen(decisionScreen);

}


/* =========================================================
   ELECCIÓ DEL PAL
========================================================= */

document
  .querySelectorAll("#suit-choice button")
  .forEach((button) => {

    button.addEventListener("click", () => {

      if (state.secondChanceActive) {
        return;
      }


      document
        .querySelectorAll("#suit-choice button")
        .forEach((btn) => {

          btn.classList.remove("selected");

        });


      button.classList.add("selected");

      state.suitChoice =
        button.dataset.suit;


      updateSubmitButton();

    });

  });


function updateSubmitButton() {

  submitDecisionBtn.disabled = !(
    state.truthChoice &&
    state.suitChoice
  );

}


/* =========================================================
   COMPROVAR DECISIÓ
========================================================= */

submitDecisionBtn.addEventListener(
  "click",
  () => {

    if (
      !state.truthChoice ||
      !state.suitChoice
    ) {
      return;
    }


    const correctTruth = "usagi";
    const correctSuit = "♥";


    const correct =
      state.truthChoice === correctTruth &&
      state.suitChoice === correctSuit;


    if (correct) {

      showSuccess();

      return;

    }


    state.firstTruthChoice =
      state.truthChoice;

    state.firstSuitChoice =
      state.suitChoice;


    state.firstAttemptFinished = true;


    enterSecondChance();

  }
);


/* =========================================================
   SEGONA OPORTUNITAT
========================================================= */

function enterSecondChance() {

  clearInterval(state.timer);

  clearInterval(state.secondChanceTimer);


  state.secondChanceActive = true;

  state.secondTimeLeft = 2 * 60;


  closePanel();
  closeModal();


  showScreen(secondChanceScreen);


  updateSecondChanceTimer();


  state.secondChanceTimer = setInterval(() => {

    state.secondTimeLeft--;

    updateSecondChanceTimer();


    if (state.secondTimeLeft <= 0) {

      clearInterval(state.secondChanceTimer);

      showGameOver();

    }

  }, 1000);

}


function updateSecondChanceTimer() {

  secondChanceTimer.textContent =
    formatTime(
      Math.max(0, state.secondTimeLeft)
    );


  secondChanceTimer.classList.remove(
    "timer-warning",
    "timer-danger",
    "timer-critical"
  );


  if (state.secondTimeLeft <= 30) {

    secondChanceTimer.classList.add(
      "timer-critical"
    );

  } else if (state.secondTimeLeft <= 60) {

    secondChanceTimer.classList.add(
      "timer-danger"
    );

  }

}


/* =========================================================
   REVISAR EVIDÈNCIES
========================================================= */

reviewEvidenceBtn.addEventListener(
  "click",
  () => {

    const evidenceHTML =
      buildEvidenceReview();


    openModal(`
      <div class="review-modal">

        <div class="modal-label">
          REVISIÓ D'EVIDÈNCIES
        </div>

        <h2>
          El que has descobert
        </h2>

        ${evidenceHTML}

      </div>
    `);

  }
);


function buildEvidenceReview() {

  let html = "";


  Object.keys(characters)
    .forEach((key) => {

      const char = characters[key];
      const evidence = state.discovered[key];


      const hasEvidence =
        evidence.observation ||
        evidence.question ||
        evidence.investigation;


      if (!hasEvidence) {
        return;
      }


      html += `
        <div class="review-character">

          <h3>
            ${char.name}
          </h3>
      `;


      if (evidence.observation) {

        html += `
          <div class="review-section">

            <strong>
              OBSERVACIÓ
            </strong>

            ${char.observation
              .map((line) => `
                <p>
                  ${escapeHTML(line)}
                </p>
              `)
              .join("")}

          </div>
        `;

      }


      if (evidence.question) {

        html += `
          <div class="review-section">

            <strong>
              PREGUNTA
            </strong>

            <p>
              <em>
                ${escapeHTML(
                  evidence.question.question
                )}
              </em>
            </p>

            ${evidence.question.answer
              .map((line) => `
                <p>
                  ${escapeHTML(line)}
                </p>
              `)
              .join("")}

          </div>
        `;

      }


      if (evidence.investigation) {

        html += `
          <div class="review-section">

            <strong>
              INVESTIGACIÓ
            </strong>

            ${char.investigation
              .map((line) => `
                <p>
                  ▸ ${escapeHTML(line)}
                </p>
              `)
              .join("")}

          </div>
        `;

      }


      html += `
        </div>
      `;

    });


  if (!html) {

    html = `
      <p class="empty-review">
        No has recollit cap evidència.
      </p>
    `;

  }


  return html;

}


/* =========================================================
   CANVIAR DECISIÓ
========================================================= */

changeDecisionBtn.addEventListener(
  "click",
  () => {

    closeModal();
    closePanel();


    state.truthChoice = null;
    state.suitChoice = null;


    document
      .querySelectorAll(
        "#truth-choice button, #suit-choice button"
      )
      .forEach((button) => {

        button.classList.remove("selected");

      });


    submitDecisionBtn.disabled = true;


    showScreen(decisionScreen);

  }
);


/* =========================================================
   RESULTAT — GAME CLEAR
========================================================= */

function showSuccess() {

  clearInterval(state.timer);
  clearInterval(state.secondChanceTimer);


  state.secondChanceActive = false;


  resultStatus.textContent =
    "GAME CLEAR";

  resultSymbol.textContent =
    "♥";

  resultTitle.textContent =
    "HAS SOBREVISCUT";


  resultText.innerHTML = `

    <p>
      Has identificat correctament
      qui deia la veritat.
    </p>

    <p>
      <strong>USAGI</strong>
      estava dient la veritat.
    </p>

    <p>
      El teu collar porta el símbol
      <strong>♥</strong>.
    </p>

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


  resultStatus.textContent =
    "GAME OVER";

  resultSymbol.textContent =
    "×";

  resultTitle.textContent =
    "HAS PERDUT";


  resultText.innerHTML = `

    <p>
      No has aconseguit identificar correctament
      qui deia la veritat.
    </p>

    <p>
      El temps s'ha acabat.
    </p>

  `;


  showScreen(resultScreen);

}


/* =========================================================
   INICIALITZACIÓ
========================================================= */

renderCharacterCards();

renderTruthChoices();

showScreen(introScreen);
