import { getAnalyticsInstance } from '@navikt/nav-dekoratoren-moduler/csr';
import type { AnalyticsEvent } from '@navikt/nav-dekoratoren-moduler/csr';
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

type PawOfelasAktivitet = AnalyticsEvent<'paw-ofelas.aktivitet', PawOfelasAktivitetData>;

type CustomEvents = PawOfelasAktivitet;

const _logEvent = getAnalyticsInstance<CustomEvents>('paw-ofelas');

export const logEvent = (eventName: 'paw-ofelas.aktivitet', eventData: PawOfelasAktivitetData) =>
    _logEvent(eventName, eventData);
