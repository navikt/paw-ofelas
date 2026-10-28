import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { ProgressIndicator } from '@/components/veiviser/ProgressIndicator';

const meta: Meta<typeof ProgressIndicator> = {
    title: 'Veiviser/ProgressIndicator',
    component: ProgressIndicator,
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
type Story = StoryObj<typeof ProgressIndicator>;

const verifyProgress = async (canvasElement: HTMLElement, currentStep: number) => {
    const canvas = within(canvasElement);
    const label = `Spørsmål ${currentStep} av 10`;
    const progress = canvas.getByRole('progressbar', { name: label });

    await expect(progress).toHaveAttribute('aria-valuemin', '1');
    await expect(progress).toHaveAttribute('aria-valuemax', '10');
    await expect(progress).toHaveAttribute('aria-valuenow', String(currentStep));
    await expect(canvas.getByText(label)).toBeVisible();
};

export const Start: Story = {
    args: { currentStep: 1, totalSteps: 10, sprak: 'nb' },
    play: ({ canvasElement }) => verifyProgress(canvasElement, 1),
};

export const Halfway: Story = {
    args: { currentStep: 5, totalSteps: 10, sprak: 'nb' },
    play: ({ canvasElement }) => verifyProgress(canvasElement, 5),
};

export const NearEnd: Story = {
    args: { currentStep: 9, totalSteps: 10, sprak: 'nb' },
    play: ({ canvasElement }) => verifyProgress(canvasElement, 9),
};
