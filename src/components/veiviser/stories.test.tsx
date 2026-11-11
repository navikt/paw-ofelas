import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { WizardStateProvider } from '@/components/veiviser/WizardStateContext';
import { ProgressIndicator } from './ProgressIndicator';
import { QuestionStep } from './QuestionStep';
import { ResultStep } from './ResultStep';
import { VeiviserPage } from './VeiviserPage';
import { WizardShell } from './WizardShell';

vi.mock('@navikt/nav-dekoratoren-moduler/csr', () => ({
    getAnalyticsInstance: () => ({ custom: vi.fn() }),
}));

// ProgressIndicator

describe('ProgressIndicator', () => {
    it('viser steg 1 av 10', () => {
        render(<ProgressIndicator currentStep={1} totalSteps={10} sprak="nb" />);
        expect(screen.getByText('Spørsmål 1 av 10')).toBeInTheDocument();
    });

    it('viser steg 5 av 10', () => {
        render(<ProgressIndicator currentStep={5} totalSteps={10} sprak="nb" />);
        expect(screen.getByText('Spørsmål 5 av 10')).toBeInTheDocument();
    });

    it('viser steg 9 av 10', () => {
        render(<ProgressIndicator currentStep={9} totalSteps={10} sprak="nb" />);
        expect(screen.getByText('Spørsmål 9 av 10')).toBeInTheDocument();
    });

    it('viser norsk nynorsk-tekst med sprak=nn', () => {
        render(<ProgressIndicator currentStep={2} totalSteps={10} sprak="nn" />);
        expect(screen.getByText('Spørsmål 2 av 10')).toBeInTheDocument();
    });

    it('viser engelsk tekst med sprak=en', () => {
        render(<ProgressIndicator currentStep={3} totalSteps={10} sprak="en" />);
        expect(screen.getByText('Question 3 of 10')).toBeInTheDocument();
    });

    it.each([
        { sprak: 'nb' as const, label: 'Spørsmål 1 av 10' },
        { sprak: 'nn' as const, label: 'Spørsmål 1 av 10' },
        { sprak: 'en' as const, label: 'Question 1 of 10' },
    ])('har tilgjengelig navn, verdier og tekst for sprak=$sprak', ({ sprak, label }) => {
        render(<ProgressIndicator currentStep={1} totalSteps={10} sprak={sprak} />);

        const progress = screen.getByRole('progressbar', { name: label });
        expect(progress).toHaveAccessibleName(label);
        expect(progress).toHaveAttribute('aria-valuenow', '1');
        expect(progress).toHaveAttribute('aria-valuemin', '1');
        expect(progress).toHaveAttribute('aria-valuemax', '10');
        expect(progress).toHaveAttribute('aria-valuetext', label);
    });

    it('oppdaterer verdier ved rerender uten å duplisere indikatoren', () => {
        const { rerender } = render(<ProgressIndicator currentStep={1} totalSteps={10} sprak="nb" />);

        rerender(<ProgressIndicator currentStep={2} totalSteps={8} sprak="nb" />);

        const progressIndicators = screen.getAllByRole('progressbar');
        expect(progressIndicators).toHaveLength(1);
        expect(progressIndicators[0]).toHaveAccessibleName('Spørsmål 2 av 8');
        expect(progressIndicators[0]).toHaveAttribute('aria-valuenow', '2');
        expect(progressIndicators[0]).toHaveAttribute('aria-valuemin', '1');
        expect(progressIndicators[0]).toHaveAttribute('aria-valuemax', '8');
        expect(progressIndicators[0]).toHaveAttribute('aria-valuetext', 'Spørsmål 2 av 8');
    });
});

// QuestionStep

const defaultQuestionProps = {
    sprak: 'nb' as const,
    category: 'Pengestøtte',
    question: 'Mottar du dagpenger?',
    selectedAnswer: undefined as 'ja' | 'nei' | undefined,
    onSelect: vi.fn(),
    onNext: vi.fn(),
};

describe('QuestionStep', () => {
    it('viser spørsmål og kategori', () => {
        render(<QuestionStep {...defaultQuestionProps} />);
        expect(screen.getByText('Pengestøtte')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Mottar du dagpenger?' })).toBeInTheDocument();
    });

    it('viser hjelpetekst når helpText er satt', () => {
        render(<QuestionStep {...defaultQuestionProps} helpText="Dagpenger krever registrering." />);
        expect(screen.getByText('Dagpenger krever registrering.')).toBeInTheDocument();
        const group = screen.getByRole('radiogroup', {
            name: 'Mottar du dagpenger?',
            description: 'Dagpenger krever registrering.',
        });
        expect(group).toHaveAccessibleName('Mottar du dagpenger?');
        expect(group).toHaveAccessibleDescription('Dagpenger krever registrering.');
    });

    it('skjuler hjelpetekst når helpText ikke er satt', () => {
        render(<QuestionStep {...defaultQuestionProps} />);
        expect(screen.queryByText('Dagpenger krever registrering.')).not.toBeInTheDocument();
        const group = screen.getByRole('radiogroup', { name: 'Mottar du dagpenger?' });
        expect(group).toHaveAccessibleName('Mottar du dagpenger?');
        expect(group).not.toHaveAccessibleDescription();
    });

    it('viser forhåndsvalgt svar', () => {
        render(<QuestionStep {...defaultQuestionProps} selectedAnswer="ja" />);
        const ja = screen.getByRole('radio', { name: 'Ja' });
        expect(ja).toBeChecked();
    });

    it('kaller onSelect når bruker velger et svar', () => {
        const onSelect = vi.fn();
        render(<QuestionStep {...defaultQuestionProps} onSelect={onSelect} />);
        fireEvent.click(screen.getByRole('radio', { name: 'Nei' }));
        expect(onSelect).toHaveBeenCalledWith('nei');
    });

    it('viser Tilbake-knapp når onBack er satt', () => {
        render(<QuestionStep {...defaultQuestionProps} onBack={vi.fn()} />);
        expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    });

    it('skjuler Tilbake-knapp når onBack ikke er satt', () => {
        render(<QuestionStep {...defaultQuestionProps} />);
        expect(screen.queryByRole('button', { name: 'Tilbake' })).not.toBeInTheDocument();
    });
});

// ResultStep

describe('ResultStep', () => {
    it('viser arbeidssøker-utfall', () => {
        render(<ResultStep sprak="nb" outcome="arbeidssøker" onRestart={vi.fn()} />);
        expect(screen.getByText('Du bør registrere deg som arbeidssøker')).toBeInTheDocument();
    });

    it('viser oppfølging-utfall', () => {
        render(<ResultStep sprak="nb" outcome="oppfølging" onRestart={vi.fn()} />);
        expect(screen.getByText('Du bør be om arbeidsrettet oppfølging')).toBeInTheDocument();
    });

    it('viser Tilbake-knapp når onBack er satt', () => {
        render(<ResultStep sprak="nb" outcome="arbeidssøker" onRestart={vi.fn()} onBack={vi.fn()} />);
        expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    });

    it('viser Start på nytt-knapp', () => {
        render(<ResultStep sprak="nb" outcome="arbeidssøker" onRestart={vi.fn()} />);
        expect(screen.getByRole('button', { name: 'Start på nytt' })).toBeInTheDocument();
    });

    it('CTA-lenke er klikkbar og kaller analytics', () => {
        render(<ResultStep sprak="nb" outcome="arbeidssøker" onRestart={vi.fn()} />);
        const cta = screen.getByTestId('cta-arbeidssøker');
        fireEvent.click(cta);
        expect(cta).toBeInTheDocument();
    });
});

// VeiviserPage

describe('VeiviserPage', () => {
    it('viser side-overskrift', () => {
        render(
            <WizardStateProvider>
                <VeiviserPage sprak="nb" />
            </WizardStateProvider>,
        );
        expect(screen.getByRole('heading', { name: 'Hva bør du velge?' })).toBeInTheDocument();
    });

    it('viser undertittel', () => {
        render(
            <WizardStateProvider>
                <VeiviserPage sprak="nb" />
            </WizardStateProvider>,
        );
        expect(
            screen.getByText('Registrere deg som arbeidssøker eller be om arbeidsrettet oppfølging?'),
        ).toBeInTheDocument();
    });
});

// WizardShell

function renderShell() {
    render(
        <WizardStateProvider>
            <WizardShell sprak="nb" />
        </WizardStateProvider>,
    );
}

describe('WizardShell', () => {
    it('viser første spørsmål og progress-indikator', () => {
        renderShell();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('navigerer til resultat etter ja på Q1 (circuit-breaker) og flytter fokus til overskriften', () => {
        renderShell();
        fireEvent.click(screen.getByRole('radio', { name: 'Ja' }));
        fireEvent.click(screen.getByRole('button', { name: 'Neste' }));
        expect(screen.getByRole('heading', { name: 'Du bør registrere deg som arbeidssøker' })).toHaveFocus();
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('navigerer tilbake fra resultat, gjenoppretter svaret og flytter fokus til spørsmålet', () => {
        renderShell();
        fireEvent.click(screen.getByRole('radio', { name: 'Ja' }));
        fireEvent.click(screen.getByRole('button', { name: 'Neste' }));
        fireEvent.click(screen.getByRole('button', { name: 'Tilbake' }));
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: 'Ja' })).toBeChecked();
        expect(
            screen.getByRole('heading', {
                name: 'Mottar du eller skal du søke om pengestøtte som krever at du er registrert som arbeidssøker?',
            }),
        ).toHaveFocus();
    });

    it('starter på nytt fra resultat og flytter fokus til første spørsmål', () => {
        renderShell();
        fireEvent.click(screen.getByRole('radio', { name: 'Ja' }));
        fireEvent.click(screen.getByRole('button', { name: 'Neste' }));
        fireEvent.click(screen.getByRole('button', { name: 'Start på nytt' }));
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: 'Ja' })).not.toBeChecked();
        expect(
            screen.getByRole('heading', {
                name: 'Mottar du eller skal du søke om pengestøtte som krever at du er registrert som arbeidssøker?',
            }),
        ).toHaveFocus();
    });

    it('navigerer til Q2 etter nei på Q1, og kan gå tilbake til Q1 med fokus på spørsmålet', () => {
        renderShell();
        fireEvent.click(screen.getByRole('radio', { name: 'Nei' }));
        fireEvent.click(screen.getByRole('button', { name: 'Neste' }));
        expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Er du permittert?' })).toHaveFocus();
        fireEvent.click(screen.getByRole('button', { name: 'Tilbake' }));
        expect(screen.getByRole('radio', { name: 'Nei' })).toBeChecked();
        expect(
            screen.getByRole('heading', {
                name: 'Mottar du eller skal du søke om pengestøtte som krever at du er registrert som arbeidssøker?',
            }),
        ).toHaveFocus();
    });

    it('lar fokus bli på valgt svar når et svar velges', async () => {
        renderShell();
        const jaRadio = screen.getByRole('radio', { name: 'Ja' });

        await userEvent.click(jaRadio);

        expect(jaRadio).toHaveFocus();
    });
});
