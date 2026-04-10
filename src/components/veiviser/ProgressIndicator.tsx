"use client";

import { lagHentTekstForSprak, type Sprak } from "@navikt/arbeidssokerregisteret-utils";
import { BodyShort, Label } from "@navikt/ds-react";

const TEKSTER = {
  nb: {
    sporsmalAvTotal: (current: number, total: number) => `Spørsmål ${current} av ${total}`,
    gjenstaar: (remaining: number) => `${remaining} spørsmål gjenstår`,
  },
  nn: {
    sporsmalAvTotal: (current: number, total: number) => `Spørsmål ${current} av ${total}`,
    gjenstaar: (remaining: number) => `${remaining} spørsmål att`,
  },
  en: {
    sporsmalAvTotal: (current: number, total: number) => `Question ${current} of ${total}`,
    gjenstaar: (remaining: number) => `${remaining} questions remaining`,
  },
};

type Props = {
  currentStep: number;
  totalSteps: number;
  sprak: Sprak;
};

export function ProgressIndicator({ currentStep, totalSteps, sprak }: Props) {
  const tekst = lagHentTekstForSprak(TEKSTER, sprak);
  const label = tekst("sporsmalAvTotal")(currentStep, totalSteps);

  return (
    <div aria-label={label}>
      <Label size="small" as="span">
        {label}
      </Label>
      <div
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        style={{
          height: "4px",
          background: "var(--a-surface-neutral)",
          borderRadius: "2px",
          marginTop: "var(--a-spacing-2)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(currentStep / totalSteps) * 100}%`,
            background: "var(--a-blue-600)",
            borderRadius: "2px",
            transition: "width 0.2s ease",
          }}
        />
      </div>
      <BodyShort size="small" style={{ color: "var(--a-text-subtle)", marginTop: "var(--a-spacing-1)" }}>
        {tekst("gjenstaar")(totalSteps - currentStep)}
      </BodyShort>
    </div>
  );
}
