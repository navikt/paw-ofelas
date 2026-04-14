'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onLanguageSelect, setAvailableLanguages } from '@navikt/nav-dekoratoren-moduler/csr';
import { type Language } from '@/lib/language';

const LANGUAGE_URLS: Record<Language, string> = {
    nb: '/',
    nn: '/nn',
    en: '/en',
};

export function LanguageHandler() {
    const router = useRouter();

    useEffect(() => {
        setAvailableLanguages([
            { locale: 'nb', handleInApp: true },
            { locale: 'nn', handleInApp: true },
            { locale: 'en', handleInApp: true },
        ]);

        onLanguageSelect((language) => {
            const locale = language.locale as Language;
            const url = LANGUAGE_URLS[locale] ?? LANGUAGE_URLS.nb;
            router.push(url);
        });
    }, [router]);

    return null;
}
