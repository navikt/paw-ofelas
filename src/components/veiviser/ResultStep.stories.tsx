import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ResultStep } from '@/components/veiviser/ResultStep';

const meta: Meta<typeof ResultStep> = {
    title: 'Veiviser/ResultStep',
    component: ResultStep,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div style={{ maxWidth: 640, padding: 24 }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof ResultStep>;

export const Arbeidssøker: Story = {
    args: {
        sprak: 'nb',
        outcome: 'arbeidssøker',
        onRestart: fn(),
        onBack: fn(),
    },
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement);
        const cta = canvas.getByRole('button', { name: 'Jeg vil registrere meg som arbeidssøker' });

        await expect(canvas.getByRole('heading', { name: 'Du bør registrere deg som arbeidssøker' })).toBeVisible();
        await expect(cta).toHaveAttribute('href', 'https://www.nav.no/arbeid/registrering');
        await userEvent.click(canvas.getByRole('button', { name: 'Tilbake' }));
        await expect(args.onBack).toHaveBeenCalledOnce();
        await userEvent.click(canvas.getByRole('button', { name: 'Start på nytt' }));
        await expect(args.onRestart).toHaveBeenCalledOnce();
    },
};

export const Oppfølging: Story = {
    args: {
        sprak: 'nb',
        outcome: 'oppfølging',
        onRestart: fn(),
        onBack: fn(),
    },
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement);
        const cta = canvas.getByRole('button', { name: 'Jeg ønsker arbeidsrettet oppfølging fra Nav' });

        await expect(canvas.getByRole('heading', { name: 'Du bør be om arbeidsrettet oppfølging' })).toBeVisible();
        await expect(cta).toHaveAttribute('href', 'https://www.nav.no/arbeidsrettet-oppfolging');
        await userEvent.click(canvas.getByRole('button', { name: 'Tilbake' }));
        await expect(args.onBack).toHaveBeenCalledOnce();
        await userEvent.click(canvas.getByRole('button', { name: 'Start på nytt' }));
        await expect(args.onRestart).toHaveBeenCalledOnce();
    },
};
