import type { Question } from './types';

export const questions: Question[] = [
    // --- Pengestøtte ---
    { id: 'q1', isCircuitBreaker: true, yesOutcome: 'arbeidssøker', noOutcome: 'oppfølging' },
    { id: 'q2', isCircuitBreaker: true, yesOutcome: 'arbeidssøker', noOutcome: 'oppfølging' },
    { id: 'q3', isCircuitBreaker: true, yesOutcome: 'arbeidssøker', noOutcome: 'oppfølging' },
    // --- Forhold til jobb ---
    { id: 'q4', isCircuitBreaker: true, yesOutcome: 'oppfølging', noOutcome: 'arbeidssøker' },
    { id: 'q5', isCircuitBreaker: true, yesOutcome: 'oppfølging', noOutcome: 'arbeidssøker' },
    { id: 'q6', isCircuitBreaker: false, yesOutcome: 'oppfølging', noOutcome: 'arbeidssøker' },
    { id: 'q7', isCircuitBreaker: false, yesOutcome: 'oppfølging', noOutcome: 'arbeidssøker' },
    // --- Kurs/utdanning/tiltak ---
    { id: 'q8', isCircuitBreaker: false, yesOutcome: 'oppfølging', noOutcome: 'arbeidssøker' },
    { id: 'q9', isCircuitBreaker: false, yesOutcome: 'oppfølging', noOutcome: 'arbeidssøker' },
    // --- Hindringer ---
    { id: 'q10', isCircuitBreaker: false, yesOutcome: 'oppfølging', noOutcome: 'arbeidssøker' },
];
