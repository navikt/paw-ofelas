'use client';

import { lagHentTekstForSprak, type Sprak } from '@navikt/arbeidssokerregisteret-utils';
import { BodyLong, Box, Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import type { Outcome } from '@/lib/veiviser/types';
import { logEvent } from '@/lib/analytics';

const TEKSTER = {
    nb: {
        arbeidssøkerHeading: 'Du bør registrere deg som arbeidssøker',
        arbeidssøkerDescription:
            'Basert på svarene dine anbefaler vi at du registrerer deg som arbeidssøker hos Nav. Dette gir deg tilgang til relevante tjenester og ytelser.',
        arbeidssøkerCta: 'Jeg vil registrere meg som arbeidssøker',
        oppfølgingHeading: 'Du bør be om arbeidsrettet oppfølging',
        oppfølgingDescription:
            'Basert på svarene dine anbefaler vi at du ber om arbeidsrettet oppfølging. Da kan du få veiledning og hjelp som er tilpasset din situasjon',
        oppfølgingCta: 'Jeg ønsker arbeidsrettet oppfølging fra Nav',
        startPåNytt: 'Start på nytt',
        tilbake: 'Tilbake',
    },
    nn: {
        arbeidssøkerHeading: 'Du bør registrere deg som arbeidssøkjar',
        arbeidssøkerDescription:
            'Basert på svara dine tilrår vi at du registrerer deg som arbeidssøkjar hos Nav. Dette gir deg tilgang til relevante tenester og ytingar.',
        arbeidssøkerCta: 'Eg vil registrere meg som arbeidssøkjar',
        oppfølgingHeading: 'Du bør be om arbeidsretta oppfølging',
        oppfølgingDescription:
            'Basert på svara dine tilrår vi at du ber om arbeidsretta oppfølging. Då kan du få rettleiing og hjelp som er tilpassa din situasjon',
        oppfølgingCta: 'Eg ønsker arbeidsretta oppfølging frå Nav',
        startPåNytt: 'Start på nytt',
        tilbake: 'Tilbake',
    },
    en: {
        arbeidssøkerHeading: 'You should register as a job seeker',
        arbeidssøkerDescription:
            'Based on your answers, we recommend that you register as a job seeker with Nav. This gives you access to relevant services and benefits.',
        arbeidssøkerCta: 'I want to register as a job seeker',
        oppfølgingHeading: 'You should request employment follow-up',
        oppfølgingDescription:
            'Based on your answers, we recommend that you request employment follow-up. You can then receive guidance and help tailored to your situation',
        oppfølgingCta: 'I want employment follow-up from Nav',
        startPåNytt: 'Start over',
        tilbake: 'Back',
    },
};

const CTA_HREF: Record<Outcome, string> = {
    arbeidssøker: 'https://www.nav.no/arbeid/registrering',
    oppfølging: 'https://www.nav.no/arbeidsrettet-oppfolging',
};

type Props = {
    sprak: Sprak;
    outcome: Outcome;
    onRestart: () => void;
    onBack?: () => void;
};

export function ResultStep({ sprak, outcome, onRestart, onBack }: Props) {
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);
    const heading = tekst(`${outcome}Heading`);
    const description = tekst(`${outcome}Description`);
    const ctaLabel = tekst(`${outcome}Cta`);

    return (
        <VStack gap="space-24" role="status">
            <Box background="success-soft" borderRadius="12" padding="space-16">
                <HStack gap="space-8" wrap={false}>
                    <CheckmarkCircleFillIcon
                        aria-hidden
                        fontSize="1.5rem"
                        style={{ color: 'var(--a-icon-success)', flexShrink: 0, marginTop: '0.125rem' }}
                    />
                    <VStack>
                        <Heading size="medium" level="2" spacing>
                            {heading}
                        </Heading>
                        <BodyLong>{description}</BodyLong>
                    </VStack>
                </HStack>
            </Box>

            <VStack gap="space-8">
                <Button
                    as="a"
                    href={CTA_HREF[outcome]}
                    variant="primary"
                    size="medium"
                    data-testid={`cta-${outcome}`}
                    onClick={() =>
                        logEvent('paw-ofelas.aktivitet', {
                            aktivitet: 'navigerte til cta',
                            lenketekst: ctaLabel,
                            destinasjon: CTA_HREF[outcome],
                        })
                    }
                >
                    {ctaLabel}
                </Button>
                {onBack && (
                    <Button variant="tertiary" onClick={onBack}>
                        {tekst('tilbake')}
                    </Button>
                )}
                <Button variant="tertiary" onClick={onRestart}>
                    {tekst('startPåNytt')}
                </Button>
            </VStack>
        </VStack>
    );
}
