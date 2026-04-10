import type { Meta, StoryObj } from "@storybook/react";
import { ResultStep } from "@/components/veiviser/ResultStep";

const meta: Meta<typeof ResultStep> = {
  title: "Veiviser/ResultStep",
  component: ResultStep,
  tags: ["autodocs"],
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
    sprak: "nb",
    outcome: "arbeidssøker",
    onRestart: () => {},
  },
};

export const Oppfølging: Story = {
  args: {
    sprak: "nb",
    outcome: "oppfølging",
    onRestart: () => {},
  },
};
