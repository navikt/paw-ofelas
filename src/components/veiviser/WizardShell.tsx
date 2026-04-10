"use client";

import { useCallback, useReducer } from "react";
import { Box, VStack } from "@navikt/ds-react";
import { ProgressIndicator } from "./ProgressIndicator";
import { QuestionStep } from "./QuestionStep";
import { ResultStep } from "./ResultStep";
import { canGoBack, initialState, isComplete, processAnswer } from "@/lib/veiviser/engine";
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
      if (state.result !== null) {
        // Back from result screen: stay on the question that triggered result, just clear it
        return {
          ...state,
          result: null,
          pendingAnswer: state.answers[questions[state.currentIndex].id],
        };
      }
      return { ...state, currentIndex: state.currentIndex - 1, pendingAnswer: undefined };
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
  const selectedAnswer = state.pendingAnswer ?? state.answers[currentQuestion.id];

  const handleNext = useCallback(() => {
    if (selectedAnswer) {
      dispatch({ type: "ANSWER", answer: selectedAnswer });
    }
  }, [selectedAnswer]);

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
            key={state.currentIndex}
            questionNumber={state.currentIndex + 1}
            totalQuestions={questions.length}
            category={currentQuestion.category}
            question={currentQuestion.question}
            helpText={currentQuestion.helpText}
            selectedAnswer={selectedAnswer}
            onSelect={(answer) => dispatch({ type: "SELECT", answer })}
            onNext={handleNext}
            onBack={canGoBack(state) ? () => dispatch({ type: "BACK" }) : undefined}
          />
        )}
      </VStack>
    </Box>
  );
}
