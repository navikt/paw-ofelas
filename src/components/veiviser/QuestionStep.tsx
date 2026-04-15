'use client';

import { lagHentTekstForSprak, type Sprak } from '@navikt/arbeidssokerregisteret-utils';
import { BodyLong, BodyShort, Box, Button, Heading, HStack, Radio, RadioGroup, VStack } from '@navikt/ds-react';

const TEKSTER = {
    nb: {
        ja: 'Ja',
        nei: 'Nei',
        neste: 'Neste',
        tilbake: 'Tilbake',
    },
    nn: {
        ja: 'Ja',
        nei: 'Nei',
        neste: 'Neste',
        tilbake: 'Tilbake',
    },
    en: {
        ja: 'Yes',
        nei: 'No',
        neste: 'Next',
        tilbake: 'Back',
    },
};

type Props = {
    sprak: Sprak;
    questionNumber: number;
    totalQuestions: number;
    category: string;
    question: string;
    helpText?: string;
    selectedAnswer: 'ja' | 'nei' | undefined;
    onSelect: (answer: 'ja' | 'nei') => void;
    onNext: () => void;
    onBack?: () => void;
};

export function QuestionStep({ sprak, category, question, helpText, selectedAnswer, onSelect, onNext, onBack }: Props) {
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    return (
        <VStack gap="space-8">
            <VStack gap="space-2">
                <BodyLong size="small" style={{ color: 'var(--a-text-subtle)' }}>
                    {category}
                </BodyLong>
                <Heading size="medium" level="2">
                    {question}
                </Heading>
                {helpText && (
                    <Box background="info-soft" borderRadius="8" padding="space-12">
                        <BodyShort size="small">{helpText}</BodyShort>
                    </Box>
                )}
            </VStack>

            <RadioGroup
                legend={question}
                hideLegend
                value={selectedAnswer ?? null}
                onChange={(val) => onSelect(val as 'ja' | 'nei')}
            >
                <Radio value="ja">{tekst('ja')}</Radio>
                <Radio value="nei">{tekst('nei')}</Radio>
            </RadioGroup>

            <HStack gap="space-4">
                {onBack && (
                    <Button variant="tertiary" onClick={onBack}>
                        {tekst('tilbake')}
                    </Button>
                )}
                <Button variant="primary" onClick={onNext} disabled={!selectedAnswer}>
                    {tekst('neste')}
                </Button>
            </HStack>
        </VStack>
    );
}
