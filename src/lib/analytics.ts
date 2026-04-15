import { getAnalyticsInstance } from '@navikt/nav-dekoratoren-moduler/csr';
import type { AnalyticsEvent } from '@navikt/nav-dekoratoren-moduler/csr';
import type { Outcome } from './veiviser/types';

type VeiviserResultatVist = AnalyticsEvent<
    'veiviser resultat vist',
    {
        /** Antall spørsmål brukeren besvarte før resultatet ble vist */
        antallSpørsmål: number;
        /** Anbefalingen som ble gitt */
        anbefaling: Outcome;
    }
>;

type VeiviserTilbakeknapp = AnalyticsEvent<
    'veiviser tilbakeknapp',
    {
        /** Spørsmålsnummeret brukeren navigerte tilbake fra (1-basert) */
        fraMål: number;
    }
>;

type CustomEvents = VeiviserResultatVist | VeiviserTilbakeknapp;

export const logEvent = getAnalyticsInstance<CustomEvents>('paw-ofelas');
