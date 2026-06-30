import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { VeiviserPage } from '@/components/veiviser/VeiviserPage';
import { WizardStateProvider } from '@/components/veiviser/WizardStateContext';

const meta: Meta<typeof VeiviserPage> = {
    title: 'Veiviser/VeiviserPage',
    component: VeiviserPage,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <WizardStateProvider>
                <Story />
            </WizardStateProvider>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof VeiviserPage>;

export const Default: Story = {
    args: {
        sprak: 'nb',
    },
};
