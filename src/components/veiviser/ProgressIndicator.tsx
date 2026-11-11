'use client';

import { lagHentTekstForSprak, type Sprak } from '@navikt/arbeidssokerregisteret-utils';
import { Label, ProgressBar, VStack } from '@navikt/ds-react';
import { useId } from 'react';

const TEKSTER = {
    nb: {
        sporsmalAvTotal: (current: number, total: number) => `Spørsmål ${current} av ${total}`,
    },
    nn: {
        sporsmalAvTotal: (current: number, total: number) => `Spørsmål ${current} av ${total}`,
    },
    en: {
        sporsmalAvTotal: (current: number, total: number) => `Question ${current} of ${total}`,
    },
};

type Props = {
    currentStep: number;
    totalSteps: number;
    sprak: Sprak;
};

export function ProgressIndicator({ currentStep, totalSteps, sprak }: Props) {
    const labelId = useId();
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);
    const label = tekst('sporsmalAvTotal')(currentStep, totalSteps);

    return (
        <VStack gap="space-8">
            <Label size="small" as="span" id={labelId}>
                {label}
            </Label>
            <ProgressBar
                size="small"
                value={currentStep}
                valueMax={totalSteps}
                aria-labelledby={labelId}
                aria-valuetext={label}
                aria-valuemin={1}
                aria-live="polite"
                aria-atomic="true"
            />
        </VStack>
    );
}
