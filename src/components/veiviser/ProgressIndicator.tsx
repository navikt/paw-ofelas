'use client';

import { lagHentTekstForSprak, type Sprak } from '@navikt/arbeidssokerregisteret-utils';
import { Label } from '@navikt/ds-react';

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
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);
    const label = tekst('sporsmalAvTotal')(currentStep, totalSteps);

    return (
        <div>
            <Label size="small" as="span" aria-live="polite" aria-atomic="true">
                {label}
            </Label>
            <div
                role="progressbar"
                aria-label={label}
                aria-valuenow={currentStep}
                aria-valuemin={1}
                aria-valuemax={totalSteps}
                style={{
                    height: '6px',
                    background: 'var(--a-gray-400)',
                    borderRadius: '3px',
                    marginTop: 'var(--a-spacing-2)',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: `${(currentStep / totalSteps) * 100}%`,
                        background: 'var(--a-blue-700)',
                        borderRadius: '3px',
                        transition: 'width 0.2s ease',
                    }}
                />
            </div>
        </div>
    );
}
