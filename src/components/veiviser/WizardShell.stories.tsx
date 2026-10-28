import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { WizardShell } from '@/components/veiviser/WizardShell';
import { WizardStateProvider } from '@/components/veiviser/WizardStateContext';

const meta: Meta<typeof WizardShell> = {
    title: 'Veiviser/WizardShell',
    component: WizardShell,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <WizardStateProvider>
                <div style={{ maxWidth: 640, padding: 24 }}>
                    <Story />
                </div>
            </WizardStateProvider>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof WizardShell>;

export const Default: Story = {
    args: {
        sprak: 'nb',
    },
};

const answerAndContinue = async (canvasElement: HTMLElement, answer: 'Ja' | 'Nei') => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: answer }));
    await userEvent.click(canvas.getByRole('button', { name: 'Neste' }));
};

export const ArbeidssøkerViaCircuitBreaker: Story = {
    args: { sprak: 'nb' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await answerAndContinue(canvasElement, 'Ja');
        await expect(canvas.getByRole('heading', { name: 'Du bør registrere deg som arbeidssøker' })).toBeVisible();
    },
};

export const OppfølgingViaAccumulerteSvar: Story = {
    args: { sprak: 'nb' },
    play: async ({ canvasElement }) => {
        const answers: Array<'Ja' | 'Nei'> = ['Nei', 'Nei', 'Nei', 'Nei', 'Nei', 'Ja', 'Ja', 'Ja', 'Ja', 'Ja'];

        for (const answer of answers) {
            await answerAndContinue(canvasElement, answer);
        }

        await expect(
            within(canvasElement).getByRole('heading', { name: 'Du bør be om arbeidsrettet oppfølging' }),
        ).toBeVisible();
    },
};

export const TilbakeOgEndreSvar: Story = {
    args: { sprak: 'nb' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await answerAndContinue(canvasElement, 'Nei');
        await expect(
            canvas.getByRole('heading', {
                name: 'Er du permittert?',
            }),
        ).toBeVisible();
        await userEvent.click(canvas.getByRole('button', { name: 'Tilbake' }));
        await expect(
            canvas.getByRole('heading', {
                name: 'Mottar du eller skal du søke om pengestøtte som krever at du er registrert som arbeidssøker?',
            }),
        ).toBeVisible();
        await expect(canvas.getByRole('radio', { name: 'Nei' })).toBeChecked();
        await userEvent.click(canvas.getByRole('radio', { name: 'Ja' }));
        await userEvent.click(canvas.getByRole('button', { name: 'Neste' }));
        await expect(canvas.getByRole('heading', { name: 'Du bør registrere deg som arbeidssøker' })).toBeVisible();
    },
};

export const StartPåNyttFjernerSvar: Story = {
    args: { sprak: 'nb' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await answerAndContinue(canvasElement, 'Ja');
        await expect(canvas.getByRole('heading', { name: 'Du bør registrere deg som arbeidssøker' })).toBeVisible();
        await userEvent.click(canvas.getByRole('button', { name: 'Start på nytt' }));
        await expect(
            canvas.getByRole('heading', {
                name: 'Mottar du eller skal du søke om pengestøtte som krever at du er registrert som arbeidssøker?',
            }),
        ).toBeVisible();
        await expect(canvas.getByRole('radio', { name: 'Ja' })).not.toBeChecked();
        await expect(canvas.getByRole('radio', { name: 'Nei' })).not.toBeChecked();
        await expect(canvas.getByRole('button', { name: 'Neste' })).toBeDisabled();
    },
};

export const FokusFlyttesVedStegbytte: Story = {
    args: { sprak: 'nb' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const focusTarget = canvasElement.querySelector<HTMLElement>('[tabindex="-1"]');

        if (!focusTarget) {
            throw new Error('Fant ikke veiviserens fokusmål');
        }

        await answerAndContinue(canvasElement, 'Nei');
        await expect(canvas.getByRole('heading', { name: 'Er du permittert?' })).toBeVisible();
        await expect(focusTarget).toHaveFocus();

        const noRadio = canvas.getByRole('radio', { name: 'Nei' });
        await userEvent.click(noRadio);
        await expect(noRadio).toHaveFocus();
        await userEvent.click(canvas.getByRole('button', { name: 'Neste' }));
        await expect(
            canvas.getByRole('heading', { name: 'Har du fått beskjed om å registrere deg som arbeidssøker?' }),
        ).toBeVisible();
        await expect(focusTarget).toHaveFocus();
    },
};
