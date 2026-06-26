export type Language = 'nb' | 'nn' | 'en';
export const DEFAULT_LANGUAGE: Language = 'nb';
export const LANGUAGE_HEADER = 'x-language';

const SUPPORTED_LANGUAGES: Language[] = ['nb', 'nn', 'en'];

export function getLangFromPath(pathname: string): Language {
    if (pathname.startsWith('/nn/') || pathname === '/nn') return 'nn';
    if (pathname.startsWith('/en/') || pathname === '/en') return 'en';
    return DEFAULT_LANGUAGE;
}

export function isValidLanguage(lang: unknown): lang is Language {
    return SUPPORTED_LANGUAGES.includes(lang as Language);
}
