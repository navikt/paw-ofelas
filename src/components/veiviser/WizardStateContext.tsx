'use client';

import { createContext, useContext, useReducer } from 'react';
import { canGoBack, initialState, processAnswer } from '@/lib/veiviser/engine';
import { questions } from '@/lib/veiviser/questions';
import type { Answer, WizardState } from '@/lib/veiviser/types';

export type ShellState = WizardState & {
    /** The answer selected for the current question, not yet submitted */
    pendingAnswer: Answer | undefined;
};

type Action =
    | { type: 'ANSWER'; answer: Answer }
    | { type: 'SELECT'; answer: Answer }
    | { type: 'BACK' }
    | { type: 'RESTART' };

function reducer(state: ShellState, action: Action): ShellState {
    switch (action.type) {
        case 'SELECT':
            return { ...state, pendingAnswer: action.answer };

        case 'ANSWER': {
            const nextWizardState = processAnswer(questions, state, action.answer);
            return { ...nextWizardState, pendingAnswer: undefined };
        }

        case 'BACK': {
            if (!canGoBack(state)) return state;
            if (state.result !== null) {
                // Going back from result: clear result and restore the answer as pending so the radio shows the previous selection.
                return {
                    ...state,
                    result: null,
                    pendingAnswer: state.answers[questions[state.currentIndex].id],
                };
            }
            // Going back from a question: keep the existing answer in state so it is shown as pre-filled.
            // The user can change or confirm it when they click Next.
            return { ...state, currentIndex: state.currentIndex - 1, pendingAnswer: undefined };
        }

        case 'RESTART':
            return { ...initialState, pendingAnswer: undefined };

        default:
            return state;
    }
}

const initialShellState: ShellState = { ...initialState, pendingAnswer: undefined };

type WizardStateContextValue = {
    state: ShellState;
    dispatch: React.Dispatch<Action>;
};

const WizardStateContext = createContext<WizardStateContextValue | null>(null);

export function WizardStateProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialShellState);

    return <WizardStateContext.Provider value={{ state, dispatch }}>{children}</WizardStateContext.Provider>;
}

export function useWizardState(): WizardStateContextValue {
    const ctx = useContext(WizardStateContext);
    if (!ctx) throw new Error('useWizardState must be used within WizardStateProvider');
    return ctx;
}

export { type Action };
