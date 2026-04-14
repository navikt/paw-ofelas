export type Outcome = 'arbeidssøker' | 'oppfølging';
export type Answer = 'ja' | 'nei';

export type Question = {
    id: string;
    /**
     * Circuit-breakers trigger an immediate recommendation when answered "ja".
     * "nei" always means: continue to the next question (no score contribution).
     * Non-circuit-breaker (accumulated) questions: both "ja" and "nei" add +1 to a score.
     */
    isCircuitBreaker: boolean;
    /** For circuit-breakers: the outcome when answered "ja". For accumulated: outcome for "ja". */
    yesOutcome: Outcome;
    /** Only meaningful for accumulated questions: outcome when answered "nei". */
    noOutcome: Outcome;
};

export type WizardState = {
    /** Index into the questions array of the currently displayed question. */
    currentIndex: number;
    /** Map from question id to the user's answer. */
    answers: Record<string, Answer>;
    /** Set when a circuit-breaker fires or all questions have been answered. */
    result: Outcome | null;
};
