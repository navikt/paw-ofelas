import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Script from 'next/script';
import '@navikt/ds-css';
import './globals.css';
import { fetchDecoratorReact } from '@navikt/nav-dekoratoren-moduler/ssr';
import { LanguageHandler } from '@/components/LanguageHandler';
import { type Language, LANGUAGE_HEADER } from '@/lib/language';

export const metadata: Metadata = {
    title: 'Veiviser – NAV',
    description: 'Finn ut om du bør registrere deg som arbeidssøker eller melde deg til arbeidsrettet oppfølging.',
};

function getDecoratorEnv() {
    const env = process.env.DECORATOR_ENV;
    if (env === 'prod' || env === 'dev' || env === 'beta' || env === 'betaTms') {
        return env;
    }
    return 'dev';
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const headersList = await headers();
    const language = (headersList.get(LANGUAGE_HEADER) ?? 'nb') as Language;

    const Decorator = await fetchDecoratorReact({
        env: getDecoratorEnv(),
        params: {
            context: 'privatperson',
            language,
        },
    });

    return (
        <html lang={language}>
            <head>
                <Decorator.HeadAssets />
            </head>
            <body>
                <Decorator.Header />
                {children}
                <Decorator.Footer />
                <Decorator.Scripts loader={Script} />
                <LanguageHandler />
            </body>
        </html>
    );
}
