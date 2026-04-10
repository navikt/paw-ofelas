"use client";

import { lagHentTekstForSprak, type Sprak } from "@navikt/arbeidssokerregisteret-utils";
import { Alert, BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import type { Outcome } from "@/lib/veiviser/types";

const TEKSTER = {
  nb: {
    arbeidssøkerHeading: "Du bør registrere deg som arbeidssøker",
    arbeidssøkerDescription:
      "Basert på svarene dine anbefaler vi at du registrerer deg som arbeidssøker hos NAV. Dette gir deg tilgang til relevante tjenester og ytelser.",
    arbeidssøkerCta: "Registrer deg som arbeidssøker",
    oppfølgingHeading: "Du bør melde deg til arbeidsrettet oppfølging",
    oppfølgingDescription:
      "Basert på svarene dine anbefaler vi at du tar kontakt med NAV for arbeidsrettet oppfølging. Vi kan hjelpe deg med veiledning og tiltak tilpasset din situasjon.",
    oppfølgingCta: "Ta kontakt med NAV",
    startPåNytt: "Start på nytt",
  },
  nn: {
    arbeidssøkerHeading: "Du bør registrere deg som arbeidssøkjar",
    arbeidssøkerDescription:
      "Basert på svara dine tilrår vi at du registrerer deg som arbeidssøkjar hos NAV. Dette gir deg tilgang til relevante tenester og ytingar.",
    arbeidssøkerCta: "Registrer deg som arbeidssøkjar",
    oppfølgingHeading: "Du bør melde deg til arbeidsretta oppfølging",
    oppfølgingDescription:
      "Basert på svara dine tilrår vi at du tek kontakt med NAV for arbeidsretta oppfølging. Vi kan hjelpe deg med rettleiing og tiltak tilpassa din situasjon.",
    oppfølgingCta: "Ta kontakt med NAV",
    startPåNytt: "Start på nytt",
  },
  en: {
    arbeidssøkerHeading: "You should register as a job seeker",
    arbeidssøkerDescription:
      "Based on your answers, we recommend that you register as a job seeker with NAV. This gives you access to relevant services and benefits.",
    arbeidssøkerCta: "Register as a job seeker",
    oppfølgingHeading: "You should sign up for employment follow-up",
    oppfølgingDescription:
      "Based on your answers, we recommend that you contact NAV for employment follow-up. We can help you with guidance and measures tailored to your situation.",
    oppfølgingCta: "Contact NAV",
    startPåNytt: "Start over",
  },
};

const CTA_HREF: Record<Outcome, string> = {
  arbeidssøker: "https://www.nav.no/arbeid/registrering",
  oppfølging: "https://www.nav.no/kontaktoss",
};

type Props = {
  sprak: Sprak;
  outcome: Outcome;
  onRestart: () => void;
};

export function ResultStep({ sprak, outcome, onRestart }: Props) {
  const tekst = lagHentTekstForSprak(TEKSTER, sprak);
  const heading = tekst(`${outcome}Heading`);
  const description = tekst(`${outcome}Description`);
  const ctaLabel = tekst(`${outcome}Cta`);

  return (
    <VStack gap="space-8">
      <Alert variant="success" fullWidth>
        <Heading size="medium" level="2" spacing>
          {heading}
        </Heading>
        <BodyLong>{description}</BodyLong>
      </Alert>

      <VStack gap="space-4">
        <Button as="a" href={CTA_HREF[outcome]} variant="primary" size="medium">
          {ctaLabel}
        </Button>
        <Button variant="tertiary" onClick={onRestart}>
          {tekst("startPåNytt")}
        </Button>
      </VStack>
    </VStack>
  );
}
