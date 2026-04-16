import { redirect } from 'next/navigation';
import { isValidLanguage, type Language } from '@/lib/language';
import { VeiviserPage } from '@/components/veiviser/VeiviserPage';

type Props = {
    params: Promise<{ lang: string }>;
};

export default async function LangVeiviserPage({ params }: Props) {
    const { lang } = await params;

    if (!isValidLanguage(lang) || lang === 'nb') {
        redirect('/');
    }

    return <VeiviserPage sprak={lang as Language} />;
}
