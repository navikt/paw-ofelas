import type { Meta, StoryObj } from "@storybook/react";
import { QuestionStep } from "@/components/veiviser/QuestionStep";
import { useState } from "react";

const meta: Meta<typeof QuestionStep> = {
  title: "Veiviser/QuestionStep",
  component: QuestionStep,
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
type Story = StoryObj<typeof QuestionStep>;

export const Default: Story = {
  args: {
    sprak: "nb",
    questionNumber: 1,
    totalQuestions: 10,
    category: "Pengestøtte",
    question:
      "Mottar du eller skal du søke om pengestøtte som krever at du er registrert som arbeidssøker?",
    helpText:
      "Dagpenger, friskmeldt til arbeidsformidling og enkelte andre ytelser krever at du er registrert arbeidssøker.",
    selectedAnswer: undefined,
    onSelect: () => {},
    onNext: () => {},
  },
};

export const WithAnswer: Story = {
  args: {
    ...Default.args,
    selectedAnswer: "ja",
  },
};

export const WithBack: Story = {
  args: {
    ...Default.args,
    questionNumber: 3,
    selectedAnswer: "nei",
    onBack: () => {},
  },
};

export const WithoutHelpText: Story = {
  args: {
    questionNumber: 2,
    totalQuestions: 10,
    category: "Pengestøtte",
    question: "Er du permittert?",
    selectedAnswer: undefined,
    onSelect: () => {},
    onNext: () => {},
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<"ja" | "nei" | undefined>(undefined);
    return (
      <QuestionStep
        {...args}
        selectedAnswer={selected}
        onSelect={setSelected}
        onNext={() => alert(`Svarte: ${selected}`)}
      />
    );
  },
  args: Default.args,
};
