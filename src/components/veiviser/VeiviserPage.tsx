import { lagHentTekstForSprak, type Sprak } from '@navikt/arbeidssokerregisteret-utils';
import { BodyLong, Box, Heading, VStack } from '@navikt/ds-react';
import { WizardShell } from './WizardShell';

const TEKSTER = {
    nb: {
        overskrift: 'Hva bør jeg velge?',
        undertittel: 'Registrere meg som arbeidssøker eller be om arbeidsrettet oppfølging?',
    },
    nn: {
        overskrift: 'Kva bør eg velje?',
        undertittel: 'Registrere meg som arbeidssøkar eller be om arbeidsretta oppfølging?',
    },
    en: {
        overskrift: 'What should I choose?',
        undertittel: 'Register as a job seeker or request employment follow-up?',
    },
};

type Props = {
    sprak: Sprak;
};

export function VeiviserPage({ sprak }: Props) {
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    return (
        <main>
            <Box paddingBlock={{ xs: 'space-16', md: 'space-24' }} paddingInline={{ xs: 'space-16', md: 'space-40' }}>
                <VStack gap="space-12" style={{ maxWidth: '640px', margin: '0 auto' }}>
                    <Heading size="xlarge" level="1">
                        {tekst('overskrift')}
                    </Heading>
                    <BodyLong size="large">{tekst('undertittel')}</BodyLong>
                    <WizardShell sprak={sprak} />
                </VStack>
            </Box>
        </main>
    );
}
