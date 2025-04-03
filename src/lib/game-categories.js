export const gameCategories = {
  "lessons": {
    label: "Lezioni",
    schema: {
      hasSteps: true,
      stepSchema: {
        text: {
          type: "textarea",
          label: "Testo della Pagina",
          placeholder: "Inserisci il testo della pagina",
        },
      },
      // Campi aggiuntivi al di fuori degli step
      additionalFields: {
        title: {
          type: "text",
          label: "Titolo",
          placeholder: "Inserisci il titolo della lezione",
        },
        subtitle: {
          type: "text",
          label: "Sottotitolo",
          placeholder: "Inserisci il sottotitolo della lezione",
        },
        image: {
          type: "image",
          label: "Immagine della Lezione",
          placeholder: "Carica un'immagine per la lezione",
        },
      },
    },
  },
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
        final_comment: {
          type: "textarea",
          label: "Commento Finale",
          placeholder: "Inserisci un commento finale per questo step",
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
        final_comment: {
          type: "textarea",
          label: "Commento Finale",
          placeholder: "Inserisci un commento finale per questo step",
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
        final_comment: {
          type: "textarea",
          label: "Commento Finale",
          placeholder: "Inserisci un commento finale per questo step",
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
        final_comment: {
          type: "textarea",
          label: "Commento Finale",
          placeholder: "Inserisci un commento finale per questo step",
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
        final_comment: {
          type: "textarea",
          label: "Commento Finale",
          placeholder: "Inserisci un commento finale per questo step",
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
        final_comment: {
          type: "textarea",
          label: "Commento Finale",
          placeholder: "Inserisci un commento finale per questo step",
        },
      },
    },
  },
}