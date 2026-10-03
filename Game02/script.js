/* ==========================================================================
   JOC 2 — LES CINC DECISIONS
   Lògica i Gestió d'Estat del Joc
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Configuració de les 5 sales i la taula interna de pistes
  const ROOMS_DATA = [
    {
      id: 1,
      title: "SALA 01 — PROVA DE JUDICI",
      narrative: "Hi ha hagut un petit accident. Es detecta un petit rastre de sang a terra, però NO correspon a cap ferida principal manifesta. Cap dels tres sospitosos presenta ferides visibles a simple vista.\n\nTens tres persones a la sala:",
      options: [
        {
          letter: "A",
          title: "DEIXAR SORTIR LAIA",
          desc: "Porta una motxilla pesada amb roba de recanvi a dins.",
          type: "falsa",
          clue: "Cerca en un lloc elevat de la cuina, prop dels utensilis de vidre."
        },
        {
          letter: "B",
          title: "DEIXAR SORTIR MARC",
          desc: "Porta un clauer metàl·lic amb una petita fulla incorporada.",
          type: "veritable",
          clue: "La primera clau es troba en un espai d'ús personal diari on l'aigua té un paper central."
        },
        {
          letter: "C",
          title: "DEIXAR SORTIR POL",
          desc: "Porta un encenedor metàl·lic industrial.",
          type: "inutil",
          clue: "El lloc escollit té parets i una porta que es pot tancar per dins."
        }
      ],
      defaultOptionIndex: 1 // Si s'esgota el temps (Marc)
    },
    {
      id: 2,
      title: "SALA 02 — SOSPITA I DEDUCCIÓ",
      narrative: "La investigació continua. Reevalua la informació prèvia dels tres integrants i els seus estris personals:\n• Laia (motxilla amb roba)\n• Marc (clauer amb petita fulla)\n• Pol (encenedor)\n\nEl rastre secundari de sang no prové d'una agressió. Qui és el responsable directe d'haver generat la fallada inicial?",
      options: [
        {
          letter: "A",
          title: "ASSENYALAR LAIA",
          desc: "Considerar la seva implicació directa.",
          type: "falsa",
          clue: "Revisa sota el sofà principal de la sala d'estar."
        },
        {
          letter: "B",
          title: "ASSENYALAR MARC",
          desc: "Considerar l'element tallant del clauer.",
          type: "veritable",
          clue: "No busquis a terra ni a l'exterior; l'objectiu està protegit de la pols rere un vidre o mirall."
        },
        {
          letter: "C",
          title: "ASSENYALAR POL",
          desc: "Considerar l'encenedor metàl·lic.",
          type: "inutil",
          clue: "A la casa hi ha molts amagatalls possibles, però aquest és molt freqüentat."
        }
      ],
      defaultOptionIndex: 1 // Si s'esgota el temps (Marc)
    },
    {
      id: 3,
      title: "SALA 03 — EL PROTOCOL",
      narrative: "S'ha produït una interrupció crítica de comunicacions. El sistema principal continua funcionant, però l'alimentació auxiliar ha patit una sobrecàrrega anteriorment.\n\nQuina actuació és la més coherent amb el protocol de seguretat?",
      options: [
        {
          letter: "A",
          title: "REINICIAR",
          desc: "Reiniciar completament el sistema.",
          type: "inutil",
          clue: "És un lloc on es guarden objectes organitzats en petits compartiments o prestatges."
        },
        {
          letter: "B",
          title: "AÏLLAR LA ZONA",
          desc: "Aïllar la zona afectada abans d'intervenir.",
          type: "veritable",
          clue: "Dins el contenidor hi ha petits envasos, blisters o flascons destinats a la cura o la salut."
        },
        {
          letter: "C",
          title: "FORÇAR ALIMENTACIÓ AUXILIAR",
          desc: "Forçar l'alimentació auxiliar.",
          type: "falsa",
          clue: "Està amagat dins d'una sabata al rebedor de l'entrada."
        }
      ],
      defaultOptionIndex: 1 // Si s'esgota el temps (B - Aïllar)
    },
    {
      id: 4,
      title: "SALA 04 — EL REPARTIMENT",
      narrative: "Davant teu hi ha tres recipients diferenciats i una nota gravada al centre:\n«Només un dels tres recipients mostra el seu contingut tal com és.»\n\n• Caixa A: Transparent, aparentment buida.\n• Caixa B: Metàl·lica, amb la inscripció «NO OBRIR».\n• Caixa C: Fusta, sense cap indicació especial.",
      options: [
        {
          letter: "A",
          title: "ESCOLLIR LA CAIXA TRANSPARENT",
          desc: "Caixa d'acrílic clar.",
          type: "inutil",
          clue: "L'objecte no fa cap soroll i manté una temperatura ambient constant."
        },
        {
          letter: "B",
          title: "ESCOLLIR LA CAIXA METÀL·LICA",
          desc: "Caixa de metall amb advertència.",
          type: "falsa",
          clue: "Busca darrere de la televisió del menjador."
        },
        {
          letter: "C",
          title: "ESCOLLIR LA CAIXA DE FUSTA",
          desc: "Caixa opaca sense rètols.",
          type: "veritable",
          clue: "Si t'ubiques davant de l'element reflector, el compartiment queda a una alçada mitjana, a l'abast de la mà."
        }
      ],
      defaultOptionIndex: 2 // Si s'esgota el temps (C - Fusta)
    },
    {
      id: 5,
      title: "SALA 05 — LA DECISIÓ FINAL",
      narrative: "Una sala austera en absolut silenci. Al centre, un missatge gravat en metall:\n«Només una decisió et permetrà continuar.»",
      options: [
        {
          letter: "A",
          title: "SORTIR",
          desc: "Abandona ara.",
          type: "falsa",
          clue: "El temps s'ha esgotat i el regal ha estat traslladat a la terrassa exterior."
        },
        {
          letter: "B",
          title: "ESPERAR",
          desc: "No facis res.",
          type: "inutil",
          clue: "Totes les decisions preses fins ara t'han portat fins a aquesta última reflexió."
        },
        {
          letter: "C",
          title: "ARRISCAR",
          desc: "Actua.",
          type: "veritable",
          clue: "El punt exacte es troba rere la petita superfície reflectant del compartiment de la zona d'higiene."
        }
      ],
      defaultOptionIndex: 2 // Si s'esgota el temps (C - Arriscar)
    }
  ];

  // 2. Estat del Joc
  let currentRoomIndex = 0;
  let timerSeconds = 300; // 5 minuts = 300s
  let timerInterval = null;
  let isTransitioning = false;
  let gameHistory = []; // Desa les 5 pistes obtingudes

  // 3. Elements del DOM
  const views = {
    start: document.getElementById("view-start"),
    room: document.getElementById("view-room"),
    transition: document.getElementById("view-transition"),
    clue: document.getElementById("view-clue"),
    final: document.getElementById("view-final")
  };

  const btnStart = document.getElementById("btn-start");
  const btnNextRoom = document.getElementById("btn-next-room");
  const timerDisplay = document.getElementById("timer-display");
  const timerBox = document.getElementById("timer-box");
  const roomBadge = document.getElementById("room-badge");
  const roomTitle = document.getElementById("room-title");
  const roomNarrative = document.getElementById("room-narrative");
  const optionsContainer = document.getElementById("options-container");
  const transitionStatus = document.getElementById("transition-status");
  const clueRoomTitle = document.getElementById("clue-room-title");
  const clueTextBody = document.getElementById("clue-text-body");
  const finalCluesList = document.getElementById("final-clues-list");

  // 4. Canvi de pantalla (View Router)
  function showView(viewName) {
    Object.keys(views).forEach(key => {
      if (key === viewName) {
        views[key].classList.add("active");
      } else {
        views[key].classList.remove("active");
      }
    });
  }

  // 5. Control del Temporitzador (5 minuts real)
  function startTimer() {
    stopTimer();
    timerSeconds = 300;
    updateTimerDisplay();
    timerBox.classList.remove("timer-warning");

    timerInterval = setInterval(() => {
      timerSeconds--;
      updateTimerDisplay();

      if (timerSeconds <= 10) {
        timerBox.classList.add("timer-warning");
      }

      if (timerSeconds <= 0) {
        stopTimer();
        handleTimeout();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');
    timerDisplay.textContent = `${formattedMins}:${formattedSecs}`;
  }

  // 6. Gestionar Esgotament de Temps (Timeout 00:00)
  function handleTimeout() {
    if (isTransitioning) return;
    const currentRoom = ROOMS_DATA[currentRoomIndex];
    selectOption(currentRoom.defaultOptionIndex, true);
  }

  // 7. Renderitzar la Sala Actual
  function renderRoom() {
    const room = ROOMS_DATA[currentRoomIndex];
    isTransitioning = false;

    roomBadge.textContent = `SALA 0${room.id} / 05`;
    roomTitle.textContent = room.title;
    roomNarrative.textContent = room.narrative;

    // Generar botons d'opció
    optionsContainer.innerHTML = "";
    room.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerHTML = `
        <span class="option-letter">${opt.letter}</span>
        <div class="option-text-wrapper">
          <span class="option-title">${opt.title}</span>
          ${opt.desc ? `<span class="option-desc">\${opt.desc}</span>` : ""}
        </div>
      `;
      btn.addEventListener("click", () => {
        selectOption(idx, false);
      });
      optionsContainer.appendChild(btn);
    });

    showView("room");
    startTimer();
  }

  // 8. Selecció d'una Opció (Manual o Timeout)
  function selectOption(optionIndex, isTimeout = false) {
    if (isTransitioning) return;
    isTransitioning = true;
    stopTimer();

    // Bloquejar botons immediatament
    const buttons = optionsContainer.querySelectorAll(".option-btn");
    buttons.forEach(b => b.disabled = true);

    const room = ROOMS_DATA[currentRoomIndex];
    const chosenOption = room.options[optionIndex];

    // Enregistrar a l'historial del joc
    gameHistory.push({
      roomId: room.id,
      roomTitle: `SALA 0${room.id}`,
      clueText: chosenOption.clue
    });

    // Seqüència de Transició: ELECCIÓ REGISTRADA -> PISTA OBTINGUDA
    showView("transition");
    transitionStatus.textContent = "ELECCIÓ REGISTRADA";

    setTimeout(() => {
      transitionStatus.textContent = "PISTA OBTINGUDA";
      
      setTimeout(() => {
        showClueScreen(room.id, chosenOption.clue);
      }, 1000);

    }, 1000);
  }

  // 9. Mostrar Pantalla de Pista
  function showClueScreen(roomId, clueText) {
    clueRoomTitle.textContent = `SALA 0${roomId} — PISTA 0${roomId}`;
    clueTextBody.textContent = `«${clueText}»`;
    showView("clue");
  }

  // 10. Avançar a la següent sala o a la Pantalla Final
  function handleNextRoom() {
    currentRoomIndex++;

    if (currentRoomIndex < ROOMS_DATA.length) {
      renderRoom();
    } else {
      renderFinalScreen();
    }
  }

  // 11. Renderitzar Pantalla Final amb les 5 Pistes
  function renderFinalScreen() {
    stopTimer();
    finalCluesList.innerHTML = "";

    gameHistory.forEach((item) => {
      const clueCard = document.createElement("div");
      clueCard.className = "final-clue-item";
      clueCard.innerHTML = `
        <div class="final-clue-label">${item.roomTitle} — PISTA 0${item.roomId}</div>
        <div class="final-clue-body">«${item.clueText}»</div>
      `;
      finalCluesList.appendChild(clueCard);
    });

    showView("final");
  }

  // 12. Listeners d'esdeveniments principals
  btnStart.addEventListener("click", () => {
    currentRoomIndex = 0;
    gameHistory = [];
    renderRoom();
  });

  btnNextRoom.addEventListener("click", () => {
    handleNextRoom();
  });

});
