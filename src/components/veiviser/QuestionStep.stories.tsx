import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { QuestionStep } from '@/components/veiviser/QuestionStep';

const meta: Meta<typeof QuestionStep> = {
    title: 'Veiviser/QuestionStep',
    component: QuestionStep,
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
type Story = StoryObj<typeof QuestionStep>;

export const Default: Story = {
    args: {
        sprak: 'nb',
        category: 'Pengestøtte',
        question: 'Mottar du eller skal du søke om pengestøtte som krever at du er registrert som arbeidssøker?',
        helpText:
            'Dagpenger, friskmeldt til arbeidsformidling og enkelte andre ytelser krever at du er registrert arbeidssøker.',
        selectedAnswer: undefined,
        onSelect: fn(),
        onNext: fn(),
    },
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement);
        const nextButton = canvas.getByRole('button', { name: 'Neste' });

        await expect(nextButton).toBeDisabled();
        await userEvent.click(canvas.getByRole('radio', { name: 'Ja' }));
        await expect(args.onSelect).toHaveBeenCalledWith('ja');
        await expect(nextButton).toBeDisabled();
        await expect(args.onNext).not.toHaveBeenCalled();
    },
};

export const WithAnswer: Story = {
    args: {
        ...Default.args,
        selectedAnswer: 'ja',
        onSelect: fn(),
        onNext: fn(),
    },
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement);
        const nextButton = canvas.getByRole('button', { name: 'Neste' });

        await expect(nextButton).toBeEnabled();
        await userEvent.click(nextButton);
        await expect(args.onNext).toHaveBeenCalledOnce();
    },
};

export const WithBack: Story = {
    args: {
        ...Default.args,
        selectedAnswer: 'nei',
        onSelect: fn(),
        onNext: fn(),
        onBack: fn(),
    },
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement);

        await userEvent.click(canvas.getByRole('button', { name: 'Tilbake' }));
        await expect(args.onBack).toHaveBeenCalledOnce();
    },
};

export const WithoutHelpText: Story = {
    args: {
        category: 'Pengestøtte',
        question: 'Er du permittert?',
        selectedAnswer: undefined,
        onSelect: () => {},
        onNext: () => {},
    },
};

export const Interactive: Story = {
    render: (args) => {
        const [selected, setSelected] = useState<'ja' | 'nei' | undefined>(undefined);
        return (
            <QuestionStep
                {...args}
                selectedAnswer={selected}
                onSelect={(answer) => {
                    args.onSelect(answer);
                    setSelected(answer);
                }}
            />
        );
    },
    args: {
        ...Default.args,
        onSelect: fn(),
        onNext: fn(),
    },
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement);
        const yesRadio = canvas.getByRole('radio', { name: 'Ja' });
        const nextButton = canvas.getByRole('button', { name: 'Neste' });

        await expect(yesRadio).not.toBeChecked();
        await expect(nextButton).toBeDisabled();
        await userEvent.click(yesRadio);
        await expect(args.onSelect).toHaveBeenCalledWith('ja');
        await expect(yesRadio).toBeChecked();
        await expect(nextButton).toBeEnabled();
        await userEvent.click(nextButton);
        await expect(args.onNext).toHaveBeenCalledOnce();
    },
};
