/* =========================================================
   JACK OF HEARTS — GAME 03
   COMPLETE GAME LOGIC
   ========================================================= */

const characters = {

  chishiya: {
    name: "CHISHIYA",
    number: "PLAYER 01",
    suit: "♣",
    image: "assets/chishiya.jpg",

    opening:
      "És ♣. Ja tens quatre respostes. Una és correcta. No necessites que jo et faci la feina.",

    observations: [
      "Chishiya es manté assegut amb una calma gairebé absoluta. No sembla tenir pressa.",
      "Quan Arisu dona la seva resposta, Chishiya el mira durant uns segons abans de tornar a mirar-te.",
      "Quan Usagi diu ♥, Chishiya mira breument el seu collar i després et mira a tu. No sembla sorprès.",
      "Quan algú parla, Chishiya sembla més interessat en la teva reacció que en la resposta mateixa."
    ],

    questions: [
      {
        question: "Per què t'hauria de creure?",
        answer:
          "No ho facis. Si necessites que et convenci, probablement no sóc la persona que hauries d'escollir."
      },
      {
        question: "Qui et sembla més sospitós?",
        answer:
          "No és la pregunta correcta. Hauries de preguntar-te qui necessita que desconfiïs dels altres."
      },
      {
        question: "Estàs segur que és ♣?",
        answer:
          "Sí. Ho he vist."
      },
      {
        question: "Què estàs intentant fer?",
        answer:
          "Que decideixis tu. Si et dic què has de pensar, ja no serà la teva decisió."
      }
    ],

    investigation: [
      "Chishiya ha mantingut la mateixa resposta des del principi: ♣.",
      "No ha preguntat als altres quin pal han vist.",
      "Ha prestat molta atenció a les reaccions dels altres jugadors.",
      "Quan l'han pressionat, ha evitat donar explicacions que es poguessin comprovar directament.",
      "En diverses ocasions ha desviat l'atenció cap als altres jugadors.",
      "No ha modificat la seva resposta en cap moment.",
      "No s'han detectat canvis en la seva versió."
    ]
  },


  arisu: {
    name: "ARISU",
    number: "PLAYER 02",
    suit: "♦",
    image: "assets/arisu.jpg",

    opening:
      "És ♦. Ho sento. Sé que no és gaire útil dir-t'ho així, però és el que estic veient.",

    observations: [
      "Quan Chishiya acaba de parlar, Arisu sembla que vol intervenir. Obre la boca, però s'atura i acaba dient: «No, res.»",
      "Quan Kuina parla, Arisu mira cap a terra i es frega les mans.",
      "Quan Usagi diu ♥, Arisu la mira durant uns segons i després aparta la mirada.",
      "Abans de respondre a algunes intervencions, sembla observar primer les reaccions dels altres."
    ],

    questions: [
      {
        question: "Per què estàs tan nerviós?",
        answer:
          "Perquè si t'equivoques, et maten. I perquè sé que jo podria estar en la teva situació."
      },
      {
        question: "Estàs segur que és ♦?",
        answer:
          "Sí. Sí. Ho he vist."
      },
      {
        question: "Has canviat d'opinió en algun moment?",
        answer:
          "No. Bueno... no sobre el que he vist."
      },
      {
        question: "Què creus que està passant aquí?",
        answer:
          "Que algú està intentant semblar més segur del que és. I no sé si ho fa perquè menteix o perquè té por."
      }
    ],

    investigation: [
      "Abans de donar una resposta, Arisu ha començat dues frases i les ha interromput.",
      "En una ocasió ha demanat que repetissin la pregunta.",
      "Ha observat les reaccions dels altres abans de respondre diverses vegades.",
      "Quan se li ha preguntat directament quin pal veia, ha respost sense dubtar.",
      "En explicar un moment anterior, ha corregit una paraula abans de continuar.",
      "La seva resposta declarada continua sent ♦.",
      "No s'ha detectat un canvi directe en la seva versió."
    ]
  },


  kuina: {
    name: "KUINA",
    number: "PLAYER 03",
    suit: "♠",
    image: "assets/kuina.jpg",

    opening:
      "És ♠. No sé si et servirà de res que t'ho digui, però és el que veig.",

    observations: [
      "Quan Arisu sembla nerviós, Kuina el mira durant uns instants.",
      "Quan Chishiya domina la conversa, Kuina deixa de participar i centra la seva atenció en tu.",
      "Quan sembles bloquejat, Kuina fa un petit gest per intentar calmar-te.",
      "Quan els altres donen les seves respostes, no reacciona de manera especialment visible."
    ],

    questions: [
      {
        question: "Per què hauria de confiar en tu?",
        answer:
          "No hauries de fer-ho. No perquè jo estigui mentint. Perquè no em coneixes. Però si vols saber què faria jo... miraria qui canvia més la seva història."
      },
      {
        question: "Qui et sembla més sospitós?",
        answer:
          "Chishiya. Perquè sembla que ja sap què faràs abans que ho facis."
      },
      {
        question: "Què creus que està fent Arisu?",
        answer:
          "Intentant no equivocar-se. No sé si això el fa més o menys fiable."
      },
      {
        question: "Estàs segura que és ♠?",
        answer:
          "Sí. Completament. Això sí que ho tinc clar."
      }
    ],

    investigation: [
      "Abans de començar, Kuina ha preguntat a Arisu si tothom estava bé.",
      "Quan algú sembla nerviós, Kuina tendeix a intentar reduir la tensió.",
      "Quan Chishiya ha dominat la conversa, Kuina ha deixat de participar durant uns instants.",
      "No ha modificat la seva resposta: continua afirmant que és ♠.",
      "Abans de començar, havia preguntat a Arisu què faria si algú estigués mentint."
    ]
  },


  usagi: {
    name: "USAGI",
    number: "PLAYER 04",
    suit: "♥",
    image: "assets/usagi.jpg",

    opening:
      "És ♥. Això és el que veig.",

    observations: [
      "Quan els altres jugadors parlen, Usagi no els interromp.",
      "Quan Arisu diu ♦, Usagi el mira breument, però no diu res.",
      "Quan Kuina parla, Usagi no mostra una reacció especialment forta.",
      "Quan Chishiya parla, Usagi manté la mirada sobre ell durant uns segons.",
      "Quan et veu confós, fa un petit pas enrere en lloc d'apropar-se o intentar convèncer-te.",
      "En un moment determinat mira el teu collar durant uns segons i després torna a mirar-te."
    ],

    questions: [
      {
        question: "Per què hauria de creure't?",
        answer:
          "No ho hauries de fer perquè t'ho digui jo. Mira què fa cadascú i decideix-ho tu."
      },
      {
        question: "Qui et sembla més difícil de llegir?",
        answer:
          "Chishiya. Però això no vol dir que estigui mentint."
      },
      {
        question: "Qui et sembla més nerviós?",
        answer:
          "Arisu. Però estar nerviós no vol dir que menteixi."
      },
      {
        question: "I Kuina?",
        answer:
          "Està intentant que estiguis tranquil. No sé si això és perquè diu la veritat o perquè vol que hi confiïs."
      }
    ],

    investigation: [
      "Usagi ha mantingut la mateixa resposta des del principi: ♥.",
      "Respon les preguntes directament sense intentar controlar la teva decisió.",
      "No intenta canviar la teva opinió sobre cap dels altres jugadors.",
      "Quan un altre jugador és qüestionat, no el defensa ni l'acusa directament.",
      "Quan li demanes que confirmi la seva resposta, no afegeix informació que no pugui saber.",
      "La seva resposta continua sent ♥."
    ]
  }
};


/* =========================================================
   GAME STATE
   ========================================================= */

const state = {

  selectedCharacter: null,

  used: {
    chishiya: {
      observation: false,
      question: false,
      investigation: false
    },

    arisu: {
      observation: false,
      question: false,
      investigation: false
    },

    kuina: {
      observation: false,
      question: false,
      investigation: false
    },

    usagi: {
      observation: false,
      question: false,
      investigation: false
    }
  },

  discovered: {
    chishiya: [],
    arisu: [],
    kuina: [],
    usagi: []
  },

  seconds: 900,

  timerInterval: null,

  secondChanceSeconds: 120,

  secondChanceInterval: null,

  secondChance: false,

  ended: false,

  openingIndex: 0,

  finalCharacter: null,

  finalSuit: null
};


/* =========================================================
   DOM
   ========================================================= */

const introScreen =
  document.getElementById("introScreen");

const rulesScreen =
  document.getElementById("rulesScreen");

const gameScreen =
  document.getElementById("gameScreen");

const resultScreen =
  document.getElementById("resultScreen");

const secondChanceScreen =
  document.getElementById("secondChanceScreen");

const modalLayer =
  document.getElementById("modalLayer");

const modalContent =
  document.getElementById("modalContent");

const timerElement =
  document.getElementById("timer");

const secondChanceTimer =
  document.getElementById("secondChanceTimer");

const openingDialogue =
  document.getElementById("openingDialogue");

const openingImage =
  document.getElementById("openingImage");

const openingCharacterName =
  document.getElementById("openingCharacterName");

const openingSuit =
  document.getElementById("openingSuit");

const openingText =
  document.getElementById("openingText");

const openingNextButton =
  document.getElementById("openingNextButton");

const characterPanel =
  document.getElementById("characterPanel");

const panelPortrait =
  document.getElementById("panelPortrait");

const panelPlayerNumber =
  document.getElementById("panelPlayerNumber");

const panelCharacterName =
  document.getElementById("panelCharacterName");

const panelCharacterSuit =
  document.getElementById("panelCharacterSuit");

const observationButton =
  document.getElementById("observationButton");

const questionButton =
  document.getElementById("questionButton");

const investigationButton =
  document.getElementById("investigationButton");

const resultStatus =
  document.getElementById("resultStatus");

const resultHeart =
  document.getElementById("resultHeart");

const resultTitle =
  document.getElementById("resultTitle");

const resultMessage =
  document.getElementById("resultMessage");

const resultTimeConnection =
  document.getElementById("resultTimeConnection");


/* =========================================================
   INTRO → RULES
   ========================================================= */

document
  .getElementById("enterGameButton")
  .addEventListener("click", () => {

    introScreen.classList.add("hidden");

    rulesScreen.classList.remove("hidden");

  });


/* =========================================================
   RULES → GAME
   ========================================================= */

document
  .getElementById("startGameButton")
  .addEventListener("click", () => {

    rulesScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    startGame();

  });


/* =========================================================
   START GAME
   ========================================================= */

function startGame() {

  state.seconds = 900;

  state.ended = false;

  updateTimer();

  startMainTimer();

  playTone(440, 0.08);

  setTimeout(() => {

    showOpeningDialogue();

  }, 700);
}


/* =========================================================
   MAIN TIMER
   ========================================================= */

function startMainTimer() {

  clearInterval(state.timerInterval);

  state.timerInterval = setInterval(() => {

    if (state.secondChance || state.ended) {
      return;
    }

    state.seconds--;

    updateTimer();

    if (state.seconds <= 0) {

      clearInterval(state.timerInterval);

      endGame(false, "TIME UP");

    }

  }, 1000);
}


function updateTimer() {

  const minutes =
    Math.floor(state.seconds / 60);

  const seconds =
    state.seconds % 60;

  timerElement.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  timerElement.classList.remove(
    "warning",
    "danger"
  );

  if (state.seconds <= 300) {
    timerElement.classList.add("warning");
  }

  if (state.seconds <= 120) {
    timerElement.classList.remove("warning");
    timerElement.classList.add("danger");
  }

  if (state.seconds <= 30) {
    timerElement.classList.add("danger");
  }
}


/* =========================================================
   OPENING DIALOGUE
   ========================================================= */

function showOpeningDialogue() {

  state.openingIndex = 0;

  openingDialogue.classList.remove("hidden");

  renderOpeningCharacter();

}


function renderOpeningCharacter() {

  const keys = [
    "chishiya",
    "arisu",
    "kuina",
    "usagi"
  ];

  const key =
    keys[state.openingIndex];

  const character =
    characters[key];

  openingImage.src =
    character.image;

  openingImage.alt =
    character.name;

  openingCharacterName.textContent =
    character.name;

  openingSuit.textContent =
    character.suit;

  openingText.textContent =
    character.opening;

  if (state.openingIndex === keys.length - 1) {

    openingNextButton.textContent =
      "ENTER THE GAME";

  } else {

    openingNextButton.textContent =
      "CONTINUE";

  }
}


openingNextButton.addEventListener(
  "click",
  () => {

    const total = 4;

    state.openingIndex++;

    if (state.openingIndex >= total) {

      openingDialogue.classList.add("hidden");

      playTone(220, 0.12);

      return;
    }

    renderOpeningCharacter();

  }
);


/* =========================================================
   CHARACTER CARDS
   ========================================================= */

document
  .querySelectorAll(".character-card")
  .forEach(card => {

    card.addEventListener("click", () => {

      if (state.secondChance || state.ended) {
        return;
      }

      const key =
        card.dataset.character;

      openCharacter(key);

    });

  });


/* =========================================================
   OPEN CHARACTER
   ========================================================= */

function openCharacter(key) {

  state.selectedCharacter = key;

  const character =
    characters[key];

  document
    .querySelectorAll(".character-card")
    .forEach(card => {

      if (
        card.dataset.character === key
      ) {

        card.classList.add("selected");

      } else {

        card.classList.add("dimmed");

      }

    });

  panelPortrait.src =
    character.image;

  panelPortrait.alt =
    character.name;

  panelPlayerNumber.textContent =
    character.number;

  panelCharacterName.textContent =
    character.name;

  panelCharacterSuit.textContent =
    character.suit;

  updateActionButtons();

  characterPanel.classList.remove("hidden");

}


/* =========================================================
   CLOSE CHARACTER
   ========================================================= */

document
  .getElementById("closeCharacterPanel")
  .addEventListener("click", closeCharacter);


function closeCharacter() {

  characterPanel.classList.add("hidden");

  document
    .querySelectorAll(".character-card")
    .forEach(card => {

      card.classList.remove(
        "selected",
        "dimmed"
      );

    });

  state.selectedCharacter = null;

}


/* =========================================================
   UPDATE ACTION BUTTONS
   ========================================================= */

function updateActionButtons() {

  if (!state.selectedCharacter) {
    return;
  }

  const used =
    state.used[state.selectedCharacter];

  observationButton.disabled =
    used.observation;

  questionButton.disabled =
    used.question;

  investigationButton.disabled =
    used.investigation;

}


/* =========================================================
   OBSERVATION
   ========================================================= */

observationButton.addEventListener(
  "click",
  () => {

    if (
      !state.selectedCharacter ||
      state.secondChance
    ) {
      return;
    }

    const key =
      state.selectedCharacter;

    if (
      state.used[key].observation
    ) {
      return;
    }

    state.used[key].observation = true;

    const records =
      characters[key].observations;

    state.discovered[key].push({
      type: "observation",
      data: records
    });

    updateActionButtons();

    showObservation(key, records);

  }
);


function showObservation(
  key,
  records
) {

  let index = 0;

  renderObservation(
    key,
    records,
    index
  );

}


function renderObservation(
  key,
  records,
  index
) {

  modalLayer.classList.remove("hidden");

  modalContent.innerHTML = `

    <div class="modal-label">
      OBSERVATION FILE
    </div>

    <h2>
      ${characters[key].name}
    </h2>

    <div class="observation-record">
      ${records[index]}
    </div>

    <div class="next-button-container">

      ${
        index < records.length - 1

        ? `
          <button
            id="nextObservation"
            class="small-button"
          >
            NEXT
          </button>
        `

        : `
          <button
            id="finishObservation"
            class="small-button"
          >
            CLOSE
          </button>
        `
      }

    </div>

  `;

  const next =
    document.getElementById(
      "nextObservation"
    );

  if (next) {

    next.addEventListener(
      "click",
      () => {

        renderObservation(
          key,
          records,
          index + 1
        );

      }
    );

  }

  const finish =
    document.getElementById(
      "finishObservation"
    );

  if (finish) {

    finish.addEventListener(
      "click",
      closeModal
    );

  }

}


/* =========================================================
   QUESTION
   ========================================================= */

questionButton.addEventListener(
  "click",
  () => {

    if (
      !state.selectedCharacter ||
      state.secondChance
    ) {
      return;
    }

    const key =
      state.selectedCharacter;

    if (
      state.used[key].question
    ) {
      return;
    }

    state.used[key].question = true;

    state.discovered[key].push({
      type: "question",
      data: characters[key].questions
    });

    updateActionButtons();

    showQuestions(key);

  }
);


function showQuestions(key) {

  const questions =
    characters[key].questions;

  modalLayer.classList.remove("hidden");

  modalContent.innerHTML = `

    <div class="modal-label">
      QUESTION
    </div>

    <h2>
      ${characters[key].name}
    </h2>

    <p style="
      color:#777;
      font-size:12px;
      margin-bottom:20px;
    ">
      Tria una pregunta.
    </p>

    <div class="question-list">

      ${questions
        .map(
          (item, index) => `
            <button
              class="question-button"
              data-question="${index}"
            >
              ${item.question}
            </button>
          `
        )
        .join("")
      }

    </div>

  `;

  document
    .querySelectorAll(".question-button")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const index =
            Number(
              button.dataset.question
            );

          showAnswer(
            key,
            questions[index]
          );

        }
      );

    });

}


function showAnswer(
  key,
  question
) {

  modalContent.innerHTML = `

    <div class="modal-label">
      ${characters[key].name}
    </div>

    <h2>
      ${question.question}
    </h2>

    <div class="dialogue-answer">
      ${question.answer}
    </div>

    <div class="next-button-container">

      <button
        id="answerClose"
        class="small-button"
      >
        CLOSE
      </button>

    </div>

  `;

  document
    .getElementById("answerClose")
    .addEventListener(
      "click",
      closeModal
    );

}


/* =========================================================
   INVESTIGATION
   ========================================================= */

investigationButton.addEventListener(
  "click",
  () => {

    if (
      !state.selectedCharacter ||
      state.secondChance
    ) {
      return;
    }

    const key =
      state.selectedCharacter;

    if (
      state.used[key].investigation
    ) {
      return;
    }

    state.used[key].investigation = true;

    state.discovered[key].push({
      type: "investigation",
      data: characters[key].investigation
    });

    updateActionButtons();

    showInvestigation(key);

  }
);


function showInvestigation(key) {

  const records =
    characters[key].investigation;

  modalLayer.classList.remove("hidden");

  modalContent.innerHTML = `

    <div class="modal-label">
      EVIDENCE FILE // ${characters[key].name}
    </div>

    <h2>
      INVESTIGATION
    </h2>

    ${
      records
        .map(
          record => `
            <div class="investigation-record">
              ${record}
            </div>
          `
        )
        .join("")
    }

    <div class="next-button-container">

      <button
        id="investigationClose"
        class="small-button"
      >
        CLOSE FILE
      </button>

    </div>

  `;

  document
    .getElementById("investigationClose")
    .addEventListener(
      "click",
      closeModal
    );

}


/* =========================================================
   MODAL CLOSE
   ========================================================= */

document
  .getElementById("closeModalButton")
  .addEventListener(
    "click",
    closeModal
  );


function closeModal() {

  modalLayer.classList.add("hidden");

  modalContent.innerHTML = "";

}


/* =========================================================
   FINAL DECISION
   ========================================================= */

document
  .getElementById("finalDecisionButton")
  .addEventListener(
    "click",
    () => {

      if (state.ended) {
        return;
      }

      openFinalDecision();

    }
  );


function openFinalDecision() {

  const characterKeys = [
    "chishiya",
    "arisu",
    "kuina",
    "usagi"
  ];

  const suits = [
    "♠",
    "♥",
    "♦",
    "♣"
  ];

  modalLayer.classList.remove("hidden");

  modalContent.innerHTML = `

    <div class="decision-section">

      <div class="modal-label">
        FINAL DECISION
      </div>

      <h2 class="decision-title">
        Qui diu la veritat?
      </h2>

      <div class="decision-characters">

        ${
          characterKeys
            .map(
              key => `
                <button
                  class="decision-character"
                  data-character-choice="${key}"
                >
                  ${characters[key].name}
                </button>
              `
            )
            .join("")
        }

      </div>

      <div class="decision-subtitle">
        QUIN PAL PORTES?
      </div>

      <div class="suit-choices">

        ${
          suits
            .map(
              suit => `
                <button
                  class="suit-choice"
                  data-suit-choice="${suit}"
                >
                  ${suit}
                </button>
              `
            )
            .join("")
        }

      </div>

      <button
        id="confirmDecision"
        class="confirm-decision"
        disabled
      >
        CONFIRM DECISION
      </button>

    </div>

  `;


  let selectedCharacter = null;

  let selectedSuit = null;


  document
    .querySelectorAll(
      ".decision-character"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".decision-character"
            )
            .forEach(b =>
              b.classList.remove(
                "selected"
              )
            );

          button.classList.add(
            "selected"
          );

          selectedCharacter =
            button.dataset.characterChoice;

          checkDecisionReady();

        }
      );

    });


  document
    .querySelectorAll(
      ".suit-choice"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".suit-choice"
            )
            .forEach(b =>
              b.classList.remove(
                "selected"
              )
            );

          button.classList.add(
            "selected"
          );

          selectedSuit =
            button.dataset.suitChoice;

          checkDecisionReady();

        }
      );

    });


  function checkDecisionReady() {

    const button =
      document.getElementById(
        "confirmDecision"
      );

    button.disabled =
      !selectedCharacter ||
      !selectedSuit;

  }


  document
    .getElementById("confirmDecision")
    .addEventListener(
      "click",
      () => {

        if (
          !selectedCharacter ||
          !selectedSuit
        ) {
          return;
        }

        state.finalCharacter =
          selectedCharacter;

        state.finalSuit =
          selectedSuit;

        closeModal();

        checkFinalAnswer();

      }
    );

}


/* =========================================================
   CHECK ANSWER
   ========================================================= */

function checkFinalAnswer() {

  const correct =
    state.finalCharacter === "usagi" &&
    state.finalSuit === "♥";

  if (correct) {

    endGame(true);

    return;

  }


  if (!state.secondChance) {

    startSecondChance();

    return;

  }


  endGame(false, "WRONG");

}


/* =========================================================
   SECOND CHANCE
   ========================================================= */

function startSecondChance() {

  clearInterval(
    state.timerInterval
  );

  state.secondChance = true;

  secondChanceScreen.classList.remove(
    "hidden"
  );

  state.secondChanceSeconds = 120;

  updateSecondChanceTimer();

  playTone(110, 0.25);

  state.secondChanceInterval =
    setInterval(() => {

      state.secondChanceSeconds--;

      updateSecondChanceTimer();

      if (
        state.secondChanceSeconds <= 0
      ) {

        clearInterval(
          state.secondChanceInterval
        );

        endGame(
          false,
          "SECOND CHANCE TIME UP"
        );

      }

    }, 1000);

}


function updateSecondChanceTimer() {

  const minutes =
    Math.floor(
      state.secondChanceSeconds / 60
    );

  const seconds =
    state.secondChanceSeconds % 60;

  secondChanceTimer.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


/* =========================================================
   REVIEW EVIDENCE
   ========================================================= */

document
  .getElementById(
    "reviewEvidenceButton"
  )
  .addEventListener(
    "click",
    showEvidenceReview
  );


function showEvidenceReview() {

  modalLayer.classList.remove("hidden");

  let html = `

    <div class="modal-label">
      EVIDENCE REVIEW
    </div>

    <h2>
      EVERYTHING YOU DISCOVERED
    </h2>

  `;

  const keys = [
    "chishiya",
    "arisu",
    "kuina",
    "usagi"
  ];


  keys.forEach(key => {

    const records =
      state.discovered[key];

    html += `

      <div
        style="
          margin-top:25px;
          border-top:1px solid rgba(255,255,255,.1);
          padding-top:18px;
        "
      >

        <div
          style="
            color:#aaa;
            letter-spacing:.15em;
            font-size:11px;
            margin-bottom:10px;
          "
        >
          ${characters[key].name}
        </div>

    `;


    if (!records.length) {

      html += `
        <div class="investigation-record">
          No evidence collected.
        </div>
      `;

    } else {

      records.forEach(record => {

        if (record.type === "observation") {

          record.data.forEach(item => {

            html += `
              <div class="observation-record">
                ${item}
              </div>
            `;

          });

        }


        if (record.type === "investigation") {

          record.data.forEach(item => {

            html += `
              <div class="investigation-record">
                ${item}
              </div>
            `;

          });

        }


        if (record.type === "question") {

          record.data.forEach(item => {

            html += `
              <div class="investigation-record">
                <strong>
                  ${item.question}
                </strong>
                <br><br>
                ${item.answer}
              </div>
            `;

          });

        }

      });

    }


    html += `</div>`;

  });


  html += `

    <div class="next-button-container">

      <button
        id="closeReview"
        class="small-button"
      >
        BACK
      </button>

    </div>

  `;


  modalContent.innerHTML = html;


  document
    .getElementById("closeReview")
    .addEventListener(
      "click",
      closeModal
    );

}


/* =========================================================
   SECOND CHANCE → FINAL DECISION
   ========================================================= */

document
  .getElementById(
    "secondChanceDecisionButton"
  )
  .addEventListener(
    "click",
    () => {

      secondChanceScreen.classList.add(
        "hidden"
      );

      openFinalDecision();

    }
  );


/* =========================================================
   END GAME
   ========================================================= */

function endGame(
  success,
  reason = ""
) {

  if (state.ended) {
    return;
  }

  state.ended = true;

  clearInterval(
    state.timerInterval
  );

  clearInterval(
    state.secondChanceInterval
  );

  secondChanceScreen.classList.add(
    "hidden"
  );

  gameScreen.classList.add(
    "hidden"
  );

  resultScreen.classList.remove(
    "hidden"
  );


  if (success) {

    resultStatus.textContent =
      "GAME CLEAR";

    resultHeart.textContent =
      "♥";

    resultTitle.textContent =
      "CORRECT";

    resultMessage.innerHTML =
      `
        USAGI WAS TELLING THE TRUTH.<br>
        <span style="color:#777;">
          YOUR COLLAR WAS ♥.
        </span>
      `;

    resultTimeConnection.classList.remove(
      "hidden"
    );

    playTone(880, 0.18);

  } else {

    resultStatus.textContent =
      "GAME OVER";

    resultHeart.textContent =
      "×";

    resultTitle.textContent =
      "YOU LOST";

    if (reason === "TIME UP") {

      resultMessage.textContent =
        "TIME RAN OUT.";

    } else {

      resultMessage.textContent =
        "YOUR FINAL DECISION WAS WRONG.";

    }

    resultTimeConnection.classList.add(
      "hidden"
    );

    playTone(80, 0.4);

  }

}


/* =========================================================
   REPLAY
   ========================================================= */

document
  .getElementById("replayButton")
  .addEventListener(
    "click",
    () => {

      window.location.reload();

    }
  );


/* =========================================================
   SIMPLE SYNTHETIC AUDIO
   No external files required.
   ========================================================= */

let audioContext = null;


function playTone(
  frequency,
  duration
) {

  try {

    if (!audioContext) {

      audioContext =
        new (
          window.AudioContext ||
          window.webkitAudioContext
        )();

    }

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.type =
      "sine";

    oscillator.frequency.value =
      frequency;

    gain.gain.setValueAtTime(
      0.0001,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.06,
      audioContext.currentTime + 0.02
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + duration
    );

    oscillator.connect(gain);

    gain.connect(
      audioContext.destination
    );

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime + duration
    );

  } catch (error) {

    /* Audio is optional.
       The game continues normally
       if the browser blocks it. */

  }

}
