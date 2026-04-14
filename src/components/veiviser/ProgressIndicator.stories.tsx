import type { Meta, StoryObj } from '@storybook/nextjs-vite';
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

export const Start: Story = {
    args: { currentStep: 1, totalSteps: 10, sprak: 'nb' },
};

export const Halfway: Story = {
    args: { currentStep: 5, totalSteps: 10, sprak: 'nb' },
};

export const NearEnd: Story = {
    args: { currentStep: 9, totalSteps: 10, sprak: 'nb' },
};
