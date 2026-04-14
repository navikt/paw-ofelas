import { redirect } from 'next/navigation';
import { lagHentTekstForSprak } from '@navikt/arbeidssokerregisteret-utils';
import { WizardShell } from '@/components/veiviser/WizardShell';
import { Box, Heading, VStack } from '@navikt/ds-react';
import { isValidLanguage, type Language } from '@/lib/language';

const TEKSTER = {
    nb: { overskrift: 'Hva trenger du hjelp med?' },
    nn: { overskrift: 'Kva treng du hjelp med?' },
    en: { overskrift: 'What do you need help with?' },
};

type Props = {
    params: Promise<{ lang: string }>;
};

export default async function LangVeiviserPage({ params }: Props) {
    const { lang } = await params;

    if (!isValidLanguage(lang) || lang === 'nb') {
        redirect('/');
    }

    const sprak: Language = lang;
    const tekst = lagHentTekstForSprak(TEKSTER, sprak);

    return (
        <main>
            <Box paddingBlock={{ xs: 'space-16', md: 'space-24' }} paddingInline={{ xs: 'space-16', md: 'space-40' }}>
                <VStack gap="space-8" style={{ maxWidth: '640px', margin: '0 auto' }}>
                    <Heading size="xlarge" level="1">
                        {tekst('overskrift')}
                    </Heading>
                    <WizardShell sprak={sprak} />
                </VStack>
            </Box>
        </main>
    );
}
