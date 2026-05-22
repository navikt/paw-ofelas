import { getAnalyticsInstance } from '@navikt/nav-dekoratoren-moduler/csr';
import type { Outcome } from './veiviser/types';

type Aktivitet = 'startet på nytt' | 'steg fullført' | 'navigerte tilbake' | 'resultat vist' | 'navigerte til cta';

type PawOfelasAktivitetData = {
    aktivitet: Aktivitet;
    steg?: number;
    antallSpørsmål?: number;
    anbefaling?: Outcome;
    lenketekst?: string;
    destinasjon?: string;
};

const analytics = getAnalyticsInstance('paw-ofelas');

export const logEvent = (eventName: 'paw-ofelas.aktivitet', eventData: PawOfelasAktivitetData) =>
    analytics.custom(eventName, eventData);
