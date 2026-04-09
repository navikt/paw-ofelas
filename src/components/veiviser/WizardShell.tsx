"use client";

import { useCallback, useReducer } from "react";
import { Box, VStack } from "@navikt/ds-react";
import { ProgressIndicator } from "./ProgressIndicator";
import { QuestionStep } from "./QuestionStep";
import { ResultStep } from "./ResultStep";
import { canGoBack, goBack, initialState, isComplete, processAnswer } from "@/lib/veiviser/engine";
import { questions } from "@/lib/veiviser/questions";
import type { Answer, WizardState } from "@/lib/veiviser/types";

type Action =
  | { type: "ANSWER"; answer: Answer }
  | { type: "SELECT"; answer: Answer }
  | { type: "BACK" }
  | { type: "RESTART" };

type ShellState = WizardState & {
  /** The answer selected for the current question, not yet submitted */
  pendingAnswer: Answer | undefined;
};

function reducer(state: ShellState, action: Action): ShellState {
  switch (action.type) {
    case "SELECT":
      return { ...state, pendingAnswer: action.answer };

    case "ANSWER": {
      const nextWizardState = processAnswer(questions, state, action.answer);
      return { ...nextWizardState, pendingAnswer: undefined };
    }

    case "BACK": {
      if (!canGoBack(state)) return state;
      const prevWizardState = goBack(state, questions);
      return { ...prevWizardState, pendingAnswer: undefined };
    }

    case "RESTART":
      return { ...initialState, pendingAnswer: undefined };

    default:
      return state;
  }
}

const initialShellState: ShellState = { ...initialState, pendingAnswer: undefined };

export function WizardShell() {
  const [state, dispatch] = useReducer(reducer, initialShellState);
  const currentQuestion = questions[state.currentIndex];

  const handleNext = useCallback(() => {
    if (state.pendingAnswer) {
      dispatch({ type: "ANSWER", answer: state.pendingAnswer });
    }
  }, [state.pendingAnswer]);

  return (
    <Box
      padding={{ xs: "space-16", md: "space-24" }}
      style={{ background: "white", boxShadow: "var(--a-shadow-medium)", borderRadius: "var(--a-border-radius-xlarge)" }}
    >
      <VStack gap="space-8">
        {!isComplete(state) && (
          <ProgressIndicator
            currentStep={state.currentIndex + 1}
            totalSteps={questions.length}
          />
        )}

        {isComplete(state) && state.result ? (
          <ResultStep
            outcome={state.result}
            onRestart={() => dispatch({ type: "RESTART" })}
          />
        ) : (
          <QuestionStep
            questionNumber={state.currentIndex + 1}
            totalQuestions={questions.length}
            category={currentQuestion.category}
            question={currentQuestion.question}
            helpText={currentQuestion.helpText}
            selectedAnswer={state.pendingAnswer}
            onSelect={(answer) => dispatch({ type: "SELECT", answer })}
            onNext={handleNext}
            onBack={canGoBack(state) ? () => dispatch({ type: "BACK" }) : undefined}
          />
        )}
      </VStack>
    </Box>
  );
}
