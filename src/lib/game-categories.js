export const gameCategories = {
  "take-order": {
    label: "Metti in Ordine",
    schema: {
      hasSteps: true,
      stepSchema: {
        question: {
          type: "text",
          label: "Domanda",
          placeholder: "Inserisci la domanda",
        },
        correctArray: {
          type: "text",
          label: "Elementi da ordinare",
          isArray: true,
          itemLabel: "elemento",
          placeholder: "Inserisci un elemento",
        },
      },
    },
  },
  "multiple-choise": {
    label: "Scelta Multipla",
    schema: {
      hasSteps: true,
      stepSchema: {
        question: {
          type: "text",
          label: "Domanda",
          placeholder: "Inserisci la domanda",
        },
        image: {
          type: "text",
          label: "URL dell'immagine",
          placeholder: "Inserisci l'URL dell'immagine",
        },
        answer: {
          type: "complex",
          label: "Risposte",
          isArray: true,
          itemLabel: "risposta",
          fields: {
            text: {
              type: "text",
              label: "Testo",
              placeholder: "Inserisci il testo della risposta",
            },
            isCorrect: {
              type: "checkbox",
              label: "È corretta?",
              defaultValue: false,
            },
            id: {
              type: "number",
              label: "ID",
              placeholder: "Inserisci un ID numerico",
            },
          },
        },
      },
    },
  },
  "looking-for-errors": {
    label: "Trova gli Errori",
    schema: {
      hasSteps: true,
      stepSchema: {
        answer: {
          type: "complex",
          label: "Affermazioni",
          isArray: true,
          itemLabel: "affermazione",
          fields: {
            text: {
              type: "text",
              label: "Testo",
              placeholder: "Inserisci un'affermazione",
            },
            isCorrect: {
              type: "checkbox",
              label: "Contiene un errore?",
              defaultValue: false,
            },
            id: {
              type: "number",
              label: "ID",
              placeholder: "Inserisci un ID numerico",
            },
          },
        },
      },
    },
  },
  "missing-topoparole": {
    label: "Parole Mancanti",
    schema: {
      hasSteps: true,
      stepSchema: {
        question: {
          type: "text",
          label: "Frase con spazio vuoto",
          placeholder: "Inserisci la frase con _______ per lo spazio vuoto",
        },
        image: {
          type: "text",
          label: "URL dell'immagine",
          placeholder: "Inserisci l'URL dell'immagine",
        },
        answer: {
          type: "complex",
          label: "Possibili risposte",
          isArray: true,
          itemLabel: "risposta",
          fields: {
            text: {
              type: "text",
              label: "Testo",
              placeholder: "Inserisci una possibile parola",
            },
            isCorrect: {
              type: "checkbox",
              label: "È corretta?",
              defaultValue: false,
            },
            id: {
              type: "number",
              label: "ID",
              placeholder: "Inserisci un ID numerico",
            },
          },
        },
      },
    },
  },
  "couple-choise": {
    label: "Abbina le Coppie",
    schema: {
      hasSteps: true,
      stepSchema: {
        question: {
          type: "text",
          label: "Domanda",
          placeholder: "Inserisci la domanda per l'abbinamento",
        },
        pairs: {
          type: "complex",
          label: "Coppie da abbinare",
          isArray: true,
          itemLabel: "coppia",
          fields: {
            left: {
              type: "text",
              label: "Elemento sinistro",
              placeholder: "Inserisci l'elemento sinistro",
            },
            leftId: {
              type: "number",
              label: "ID sinistro",
              placeholder: "Inserisci un ID numerico",
            },
            right: {
              type: "text",
              label: "Elemento destro",
              placeholder: "Inserisci l'elemento destro",
            },
            rightId: {
              type: "number",
              label: "ID destro",
              placeholder: "Inserisci un ID numerico",
            },
            isCorrect: {
              type: "checkbox",
              label: "È la coppia corretta?",
              defaultValue: false,
            },
          },
        },
      },
    },
  },
  "puzzle-game": {
    label: "Puzzle",
    schema: {
      hasSteps: true,
      stepSchema: {
        question: {
          type: "text",
          label: "Istruzioni",
          placeholder: "Inserisci le istruzioni per il puzzle",
        },
        correctArray: {
          type: "text",
          label: "Pezzi del puzzle (immagini)",
          isArray: true,
          itemLabel: "pezzo",
          placeholder: "Carica un'immagine per il pezzo del puzzle",
        },
      },
    },
  },
}

