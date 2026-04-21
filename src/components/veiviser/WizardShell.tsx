'use client';

import { useCallback, useEffect, useRef } from 'react';
import { lagHentTekstForSprak, type Sprak } from '@navikt/arbeidssokerregisteret-utils';
import { Box, VStack } from '@navikt/ds-react';
import { ProgressIndicator } from './ProgressIndicator';
import { QuestionStep } from './QuestionStep';
import { ResultStep } from './ResultStep';
import { canGoBack, isComplete } from '@/lib/veiviser/engine';
import { questions } from '@/lib/veiviser/questions';
import { SPØRSMÅL_TEKSTER, type QuestionTekst } from '@/lib/veiviser/tekster';
import { useWizardState } from './WizardStateContext';
import { logEvent } from '@/lib/analytics';

type Props = {
    sprak: Sprak;
};

export function WizardShell({ sprak }: Props) {
    const { state, dispatch } = useWizardState();
    const currentQuestion = questions[state.currentIndex];
    const selectedAnswer = state.pendingAnswer ?? state.answers[currentQuestion.id];

    const questionTekst = lagHentTekstForSprak(SPØRSMÅL_TEKSTER, sprak)(currentQuestion.id) as QuestionTekst;

    const focusTargetRef = useRef<HTMLDivElement>(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        focusTargetRef.current?.focus();
    }, [state.currentIndex, state.result]);

    useEffect(() => {
        if (state.result !== null) {
            logEvent('paw-ofelas.aktivitet', {
                aktivitet: 'resultat vist',
                antallSpørsmål: Object.keys(state.answers).length,
                anbefaling: state.result,
            });
        }
    }, [state.result]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleNext = useCallback(() => {
        if (selectedAnswer) {
            const stepNumber = state.currentIndex + 1;
            logEvent('paw-ofelas.aktivitet', { aktivitet: 'steg fullført', steg: stepNumber });
            dispatch({ type: 'ANSWER', answer: selectedAnswer });
        }
    }, [selectedAnswer, dispatch, state.currentIndex]);

    return (
        <Box
            padding={{ xs: 'space-16', md: 'space-24' }}
            style={{
                background: 'white',
                boxShadow: 'var(--a-shadow-medium)',
                borderRadius: 'var(--a-border-radius-xlarge)',
            }}
        >
            <VStack gap="space-24">
                <div ref={focusTargetRef} tabIndex={-1} style={{ outline: 'none' }} />
                {!isComplete(state) && (
                    <ProgressIndicator
                        currentStep={state.currentIndex + 1}
                        totalSteps={questions.length}
                        sprak={sprak}
                    />
                )}

                {isComplete(state) && state.result ? (
                    <ResultStep
                        sprak={sprak}
                        outcome={state.result}
                        onBack={() => dispatch({ type: 'BACK' })}
                        onRestart={() => {
                            logEvent('paw-ofelas.aktivitet', { aktivitet: 'startet på nytt' });
                            dispatch({ type: 'RESTART' });
                        }}
                    />
                ) : (
                    <QuestionStep
                        key={state.currentIndex}
                        sprak={sprak}
                        category={questionTekst.category}
                        question={questionTekst.question}
                        helpText={questionTekst.helpText}
                        selectedAnswer={selectedAnswer}
                        onSelect={(answer) => dispatch({ type: 'SELECT', answer })}
                        onNext={handleNext}
                        onBack={
                            canGoBack(state)
                                ? () => {
                                      logEvent('paw-ofelas.aktivitet', {
                                          aktivitet: 'navigerte tilbake',
                                          steg: state.currentIndex + 1,
                                      });
                                      dispatch({ type: 'BACK' });
                                  }
                                : undefined
                        }
                    />
                )}
            </VStack>
        </Box>
    );
}
