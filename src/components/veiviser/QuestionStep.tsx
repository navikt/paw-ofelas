"use client";

import { BodyLong, Button, Heading, HelpText, HStack, Radio, RadioGroup, VStack } from "@navikt/ds-react";

type Props = {
  questionNumber: number;
  totalQuestions: number;
  category: string;
  question: string;
  helpText?: string;
  selectedAnswer: "ja" | "nei" | undefined;
  onSelect: (answer: "ja" | "nei") => void;
  onNext: () => void;
  onBack?: () => void;
};

export function QuestionStep({
  questionNumber,
  totalQuestions,
  category,
  question,
  helpText,
  selectedAnswer,
  onSelect,
  onNext,
  onBack,
}: Props) {
  return (
    <VStack gap="space-8">
      <VStack gap="space-2">
        <BodyLong size="small" style={{ color: "var(--a-text-subtle)" }}>
          {category}
        </BodyLong>
        <Heading size="medium" level="2">
          {question}
          {helpText && (
            <HelpText title="Mer informasjon" style={{ marginLeft: "var(--a-spacing-2)" }}>
              {helpText}
            </HelpText>
          )}
        </Heading>
      </VStack>

      <RadioGroup
        legend={question}
        hideLegend
        value={selectedAnswer ?? null}
        onChange={(val) => onSelect(val as "ja" | "nei")}
      >
        <Radio value="ja">Ja</Radio>
        <Radio value="nei">Nei</Radio>
      </RadioGroup>

      <HStack gap="space-4">
        {onBack && (
          <Button variant="tertiary" onClick={onBack}>
            ← Tilbake
          </Button>
        )}
        <Button
          variant="primary"
          onClick={onNext}
          disabled={!selectedAnswer}
        >
          Neste
        </Button>
      </HStack>
    </VStack>
  );
}
