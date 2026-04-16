import { lagHentTekstForSprak, type Sprak } from '@navikt/arbeidssokerregisteret-utils';
import { Box, Heading, VStack } from '@navikt/ds-react';
import { WizardShell } from './WizardShell';

const TEKSTER = {
    nb: { overskrift: 'Hva trenger du hjelp med?' },
    nn: { overskrift: 'Kva treng du hjelp med?' },
    en: { overskrift: 'What do you need help with?' },
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
                    <WizardShell sprak={sprak} />
                </VStack>
            </Box>
        </main>
    );
}
