import type { Answer, Outcome, Question, WizardState } from "./types";

export const initialState: WizardState = {
  currentIndex: 0,
  answers: {},
  result: null,
};

/**
 * Process a user's answer to the current question.
 * - Circuit-breaker + "ja" → sets result immediately.
 * - Circuit-breaker + "nei" → advances to next question, answer not stored.
 * - Accumulated question → stores answer, advances; if last question, calculates result.
 */
export function processAnswer(
  questions: Question[],
  state: WizardState,
  answer: Answer
): WizardState {
  const question = questions[state.currentIndex];
  const isLast = state.currentIndex === questions.length - 1;

  if (question.isCircuitBreaker) {
    if (answer === "ja") {
      return {
        ...state,
        answers: { ...state.answers, [question.id]: answer },
        result: question.yesOutcome,
      };
    }
    // nei on circuit-breaker: skip, don't store, advance
    return { ...state, currentIndex: state.currentIndex + 1 };
  }

  // Accumulated question
  const updatedAnswers = { ...state.answers, [question.id]: answer };

  if (isLast) {
    return {
      ...state,
      answers: updatedAnswers,
      result: calculateResult(questions, updatedAnswers),
    };
  }

  return { ...state, answers: updatedAnswers, currentIndex: state.currentIndex + 1 };
}

/**
 * Calculate the final outcome from accumulated answers using majority vote.
 * Tie goes to "oppfølging" (default).
 */
export function calculateResult(
  questions: Question[],
  answers: Record<string, Answer>
): Outcome {
  let arbeidssøkerScore = 0;
  let oppfølgingScore = 0;

  for (const question of questions) {
    if (question.isCircuitBreaker) continue;
    const answer = answers[question.id];
    if (!answer) continue;

    const outcome = answer === "ja" ? question.yesOutcome : question.noOutcome;
    if (outcome === "arbeidssøker") {
      arbeidssøkerScore++;
    } else {
      oppfølgingScore++;
    }
  }

  return arbeidssøkerScore > oppfølgingScore ? "arbeidssøker" : "oppfølging";
}

/** Returns true when the wizard has a final result. */
export function isComplete(state: WizardState): boolean {
  return state.result !== null;
}

/** Returns true when the user can navigate back. */
export function canGoBack(state: WizardState): boolean {
  return state.currentIndex > 0 && state.result === null;
}

/**
 * Go back to the previous question.
 * If the previous question is an accumulated question, removes its stored answer.
 * If the previous question was a circuit-breaker (which stores no answer on "nei"), nothing to remove.
 */
export function goBack(state: WizardState, questions?: Question[]): WizardState {
  const prevIndex = state.currentIndex - 1;
  const updatedAnswers = { ...state.answers };

  if (questions) {
    const prevQuestion = questions[prevIndex];
    delete updatedAnswers[prevQuestion.id];
  }

  return { ...state, currentIndex: prevIndex, answers: updatedAnswers };
}
