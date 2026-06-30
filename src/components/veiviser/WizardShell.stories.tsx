import type { Meta, StoryObj } from '@storybook/nextjs-vite';
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
