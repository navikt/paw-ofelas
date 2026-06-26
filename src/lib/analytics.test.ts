import { vi, expect, describe, it, beforeEach } from 'vitest';

const mockCustom = vi.fn();

vi.mock('@navikt/nav-dekoratoren-moduler/csr', () => ({
    getAnalyticsInstance: () => ({ custom: mockCustom }),
}));

// Import after mock is set up
const { logEvent } = await import('./analytics');

describe('logEvent', () => {
    beforeEach(() => {
        mockCustom.mockClear();
    });

    it('kaller analytics.custom med riktig eventName og eventData', () => {
        logEvent('paw-ofelas.aktivitet', { aktivitet: 'steg fullført', steg: 1, antallSpørsmål: 10 });

        expect(mockCustom).toHaveBeenCalledOnce();
        expect(mockCustom).toHaveBeenCalledWith('paw-ofelas.aktivitet', {
            aktivitet: 'steg fullført',
            steg: 1,
            antallSpørsmål: 10,
        });
    });

    it('videresender valgfrie felt når de er satt', () => {
        logEvent('paw-ofelas.aktivitet', {
            aktivitet: 'resultat vist',
            anbefaling: 'arbeidssøker',
        });

        expect(mockCustom).toHaveBeenCalledWith('paw-ofelas.aktivitet', {
            aktivitet: 'resultat vist',
            anbefaling: 'arbeidssøker',
        });
    });

    it('videresender navigerte til cta med lenketekst og destinasjon', () => {
        logEvent('paw-ofelas.aktivitet', {
            aktivitet: 'navigerte til cta',
            lenketekst: 'Registrer deg som arbeidssøker',
            destinasjon: 'https://www.nav.no/registrering',
        });

        expect(mockCustom).toHaveBeenCalledWith('paw-ofelas.aktivitet', {
            aktivitet: 'navigerte til cta',
            lenketekst: 'Registrer deg som arbeidssøker',
            destinasjon: 'https://www.nav.no/registrering',
        });
    });
});
