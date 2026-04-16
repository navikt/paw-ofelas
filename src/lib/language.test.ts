import { getLangFromPath, isValidLanguage } from './language';

// --- getLangFromPath ---

describe('getLangFromPath', () => {
    it('returnerer nb for /', () => {
        expect(getLangFromPath('/')).toBe('nb');
    });

    it('returnerer nb for ukjent sti', () => {
        expect(getLangFromPath('/de/noe')).toBe('nb');
    });

    it('returnerer nn for /nn', () => {
        expect(getLangFromPath('/nn')).toBe('nn');
    });

    it('returnerer nn for /nn/ med trailing slash', () => {
        expect(getLangFromPath('/nn/')).toBe('nn');
    });

    it('returnerer nn for /nn/substi', () => {
        expect(getLangFromPath('/nn/side/annen')).toBe('nn');
    });

    it('returnerer en for /en', () => {
        expect(getLangFromPath('/en')).toBe('en');
    });

    it('returnerer en for /en/substi', () => {
        expect(getLangFromPath('/en/another/page')).toBe('en');
    });

    it('returnerer nb for /noe-annet', () => {
        expect(getLangFromPath('/noe-annet')).toBe('nb');
    });

    it('returnerer nb for /nb (nb er ikke en eksplisitt sti)', () => {
        expect(getLangFromPath('/nb')).toBe('nb');
    });
});

// --- isValidLanguage ---

describe('isValidLanguage', () => {
    it('godtar nb', () => {
        expect(isValidLanguage('nb')).toBe(true);
    });

    it('godtar nn', () => {
        expect(isValidLanguage('nn')).toBe(true);
    });

    it('godtar en', () => {
        expect(isValidLanguage('en')).toBe(true);
    });

    it('avviser ukjent språkkode', () => {
        expect(isValidLanguage('de')).toBe(false);
    });

    it('avviser tom streng', () => {
        expect(isValidLanguage('')).toBe(false);
    });

    it('avviser undefined', () => {
        expect(isValidLanguage(undefined)).toBe(false);
    });

    it('avviser tall', () => {
        expect(isValidLanguage(42)).toBe(false);
    });
});
