import type { Question } from "./types";

export const questions: Question[] = [
  // --- Pengestøtte ---
  {
    id: "q1",
    category: "Pengestøtte",
    question:
      "Mottar du eller skal du søke om pengestøtte som krever at du er registrert som arbeidssøker?",
    helpText:
      "Dagpenger, friskmeldt til arbeidsformidling og enkelte andre ytelser krever at du er registrert arbeidssøker.",
    isCircuitBreaker: true,
    yesOutcome: "arbeidssøker",
    noOutcome: "oppfølging",
  },
  {
    id: "q2",
    category: "Pengestøtte",
    question: "Er du permittert?",
    isCircuitBreaker: true,
    yesOutcome: "arbeidssøker",
    noOutcome: "oppfølging",
  },
  {
    id: "q3",
    category: "Pengestøtte",
    question: "Har du fått beskjed om å registrere deg som arbeidssøker?",
    helpText: "Noen tilfeller krever at du skal være registrert arbeidssøker.",
    isCircuitBreaker: true,
    yesOutcome: "arbeidssøker",
    noOutcome: "oppfølging",
  },
  // --- Forhold til jobb ---
  {
    id: "q4",
    category: "Forhold til jobb",
    question: "Trenger du hjelp til å bli værende i den jobben du har?",
    isCircuitBreaker: true,
    yesOutcome: "oppfølging",
    noOutcome: "arbeidssøker",
  },
  {
    id: "q5",
    category: "Forhold til jobb",
    question: "Er du sykmeldt og har du en jobb du skal tilbake til?",
    isCircuitBreaker: true,
    yesOutcome: "oppfølging",
    noOutcome: "arbeidssøker",
  },
  {
    id: "q6",
    category: "Forhold til jobb",
    question: "Er du i en avklaringsfase i forhold til arbeid?",
    helpText:
      "For eksempel etter sykdom, permisjon eller lang tid utenfor arbeidslivet.",
    isCircuitBreaker: false,
    yesOutcome: "oppfølging",
    noOutcome: "arbeidssøker",
  },
  {
    id: "q7",
    category: "Forhold til jobb",
    question: "Trenger du tett veiledning før du kan søke eller ta en jobb?",
    isCircuitBreaker: false,
    yesOutcome: "oppfølging",
    noOutcome: "arbeidssøker",
  },
  // --- Kurs/utdanning/tiltak ---
  {
    id: "q8",
    category: "Kurs/utdanning/tiltak",
    question: "Trenger du kurs, tiltak eller omskolering for å komme i jobb?",
    isCircuitBreaker: false,
    yesOutcome: "oppfølging",
    noOutcome: "arbeidssøker",
  },
  {
    id: "q9",
    category: "Kurs/utdanning/tiltak",
    question: "Trenger du hjelp til å fullføre eller velge utdanning?",
    isCircuitBreaker: false,
    yesOutcome: "oppfølging",
    noOutcome: "arbeidssøker",
  },
  // --- Hindringer ---
  {
    id: "q10",
    category: "Hindringer",
    question: "Har du utfordringer som påvirker om du kan jobbe eller søke jobb?",
    helpText:
      "Helse, språk, livssituasjon, familiesituasjon, transportmuligheter osv.",
    isCircuitBreaker: false,
    yesOutcome: "oppfølging",
    noOutcome: "arbeidssøker",
  },
];
