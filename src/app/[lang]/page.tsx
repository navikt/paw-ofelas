import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { isValidLanguage, type Language } from '@/lib/language';
import { VeiviserPage } from '@/components/veiviser/VeiviserPage';

type Props = {
    params: Promise<{ lang: string }>;
};

const pageTitles: Record<Language, string> = {
    nb: 'Veiviser – Bør du registrere deg som arbeidssøker eller be om arbeidsrettet oppfølging?',
    nn: 'Veiviser – Bør du registrere deg som arbeidssøkjar eller be om arbeidsretta oppfølging?',
    en: 'Wizard – Should you register as a job seeker or request employment follow-up?',
};

const pageDescriptions: Record<Language, string> = {
    nb: 'Finn ut om du bør registrere deg som arbeidssøker eller be om arbeidsrettet oppfølging.',
    nn: 'Finn ut om du bør registrere deg som arbeidssøkjar eller be om arbeidsretta oppfølging.',
    en: 'Find out if you should register as a job seeker or request employment follow-up.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    const language = isValidLanguage(lang) ? (lang as Language) : 'nb';
    return { title: pageTitles[language], description: pageDescriptions[language] };
}

export default async function LangVeiviserPage({ params }: Props) {
    const { lang } = await params;

    if (!isValidLanguage(lang) || lang === 'nb') {
        redirect('/');
    }

    return <VeiviserPage sprak={lang as Language} />;
}
