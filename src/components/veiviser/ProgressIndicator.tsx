"use client";

import { BodyShort, Label } from "@navikt/ds-react";

type Props = {
  currentStep: number;
  totalSteps: number;
};

export function ProgressIndicator({ currentStep, totalSteps }: Props) {
  return (
    <div aria-label={`Spørsmål ${currentStep} av ${totalSteps}`}>
      <Label size="small" as="span">
        Spørsmål {currentStep} av {totalSteps}
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
        {totalSteps - currentStep} spørsmål gjenstår
      </BodyShort>
    </div>
  );
}
