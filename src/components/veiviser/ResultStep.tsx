"use client";

import { Alert, BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import type { Outcome } from "@/lib/veiviser/types";

const CONTENT: Record<Outcome, { heading: string; description: string; ctaLabel: string; ctaHref: string }> = {
  arbeidssøker: {
    heading: "Du bør registrere deg som arbeidssøker",
    description:
      "Basert på svarene dine anbefaler vi at du registrerer deg som arbeidssøker hos NAV. Dette gir deg tilgang til relevante tjenester og ytelser.",
    ctaLabel: "Registrer deg som arbeidssøker",
    ctaHref: "https://www.nav.no/arbeid/registrering",
  },
  oppfølging: {
    heading: "Du bør melde deg til arbeidsrettet oppfølging",
    description:
      "Basert på svarene dine anbefaler vi at du tar kontakt med NAV for arbeidsrettet oppfølging. Vi kan hjelpe deg med veiledning og tiltak tilpasset din situasjon.",
    ctaLabel: "Ta kontakt med NAV",
    ctaHref: "https://www.nav.no/kontaktoss",
  },
};

type Props = {
  outcome: Outcome;
  onRestart: () => void;
};

export function ResultStep({ outcome, onRestart }: Props) {
  const { heading, description, ctaLabel, ctaHref } = CONTENT[outcome];

  return (
    <VStack gap="space-8">
      <Alert variant="success" fullWidth>
        <Heading size="medium" level="2" spacing>
          {heading}
        </Heading>
        <BodyLong>{description}</BodyLong>
      </Alert>

      <VStack gap="space-4">
        <Button as="a" href={ctaHref} variant="primary" size="medium">
          {ctaLabel}
        </Button>
        <Button variant="tertiary" onClick={onRestart}>
          Start på nytt
        </Button>
      </VStack>
    </VStack>
  );
}
