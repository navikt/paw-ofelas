import { calculateResult, canGoBack, initialState, isComplete, processAnswer } from './engine';
import type { Question } from './types';

// --- Test fixtures ---

const circuitBreakerArbeidssøker: Question = {
    id: 'cb-as',
    isCircuitBreaker: true,
    yesOutcome: 'arbeidssøker',
    noOutcome: 'oppfølging',
};

const circuitBreakerOppfølging: Question = {
    id: 'cb-op',
    isCircuitBreaker: true,
    yesOutcome: 'oppfølging',
    noOutcome: 'arbeidssøker',
};

const accumulatedTowardArbeidssøker: Question = {
    id: 'acc-as',
    isCircuitBreaker: false,
    yesOutcome: 'arbeidssøker',
    noOutcome: 'oppfølging',
};

const accumulatedTowardOppfølging: Question = {
    id: 'acc-op',
    isCircuitBreaker: false,
    yesOutcome: 'oppfølging',
    noOutcome: 'arbeidssøker',
};

// --- initialState ---

describe('initialState', () => {
    it('starter på spørsmål 0 uten svar og uten resultat', () => {
        expect(initialState).toEqual({ currentIndex: 0, answers: {}, result: null });
    });
});

// --- processAnswer: circuit-breakere ---

describe('processAnswer – circuit-breaker', () => {
    const questions = [circuitBreakerArbeidssøker];

    it('ja på circuit-breaker setter result umiddelbart', () => {
        const next = processAnswer(questions, initialState, 'ja');
        expect(next.result).toBe('arbeidssøker');
    });

    it('nei på circuit-breaker fortsetter til neste spørsmål uten å sette result', () => {
        const next = processAnswer(questions, initialState, 'nei');
        expect(next.result).toBeNull();
        expect(next.currentIndex).toBe(1);
    });

    it('nei på circuit-breaker lagres i answers men bidrar ikke til score', () => {
        const next = processAnswer(questions, initialState, 'nei');
        expect(next.answers['cb-as']).toBe('nei');
    });

    it('ja-svar lagres i answers', () => {
        const next = processAnswer(questions, initialState, 'ja');
        expect(next.answers['cb-as']).toBe('ja');
    });
});

// --- processAnswer: circuit-breaker med oppfølging-utfall ---

describe('processAnswer – circuit-breaker med oppfølging-utfall (Q4/Q5-lignende)', () => {
    const questions = [circuitBreakerOppfølging];

    it('ja på circuit-breaker med oppfølging-utfall setter result til oppfølging', () => {
        const next = processAnswer(questions, initialState, 'ja');
        expect(next.result).toBe('oppfølging');
        expect(next.answers['cb-op']).toBe('ja');
    });

    it('nei på circuit-breaker med oppfølging-utfall fortsetter uten å sette result', () => {
        const next = processAnswer(questions, initialState, 'nei');
        expect(next.result).toBeNull();
        expect(next.currentIndex).toBe(1);
        expect(next.answers['cb-op']).toBe('nei');
    });
});

// --- processAnswer: akkumulerte spørsmål ---

describe('processAnswer – akkumulert', () => {
    const questions = [accumulatedTowardArbeidssøker, accumulatedTowardOppfølging];

    it('akkumulert spørsmål lagrer svar og går til neste', () => {
        const next = processAnswer(questions, initialState, 'ja');
        expect(next.answers['acc-as']).toBe('ja');
        expect(next.currentIndex).toBe(1);
        expect(next.result).toBeNull();
    });

    it('siste akkumulerte spørsmål setter result via calculateResult', () => {
        const afterFirst = processAnswer(questions, initialState, 'nei'); // nei → oppfølging poeng
        const afterSecond = processAnswer(questions, afterFirst, 'nei'); // nei → arbeidssøker poeng
        // Score: oppfølging=1, arbeidssøker=1 → uavgjort → oppfølging (default)
        expect(afterSecond.result).toBe('oppfølging');
    });
});

// --- processAnswer: tilbake-navigasjon ---

describe('processAnswer – tilbake etter circuit-breaker-nei', () => {
    const questions = [circuitBreakerArbeidssøker, accumulatedTowardOppfølging];

    it('å gå tilbake fra spørsmål 1 til 0 viser lagret nei-svar fra cb-spørsmål', () => {
        const afterNei = processAnswer(questions, initialState, 'nei');
        expect(afterNei.currentIndex).toBe(1);
        expect(afterNei.answers['cb-as']).toBe('nei');
    });
});

// --- calculateResult ---

describe('calculateResult', () => {
    const questions = [accumulatedTowardArbeidssøker, accumulatedTowardOppfølging, accumulatedTowardOppfølging];

    it('flertall arbeidssøker vinner', () => {
        const answers = {
            'acc-as': 'ja' as const, // arbeidssøker +1
            'acc-op': 'nei' as const, // arbeidssøker +1
        };
        expect(calculateResult(questions, answers)).toBe('arbeidssøker');
    });

    it('flertall oppfølging vinner', () => {
        const answers = {
            'acc-as': 'nei' as const, // oppfølging +1
            'acc-op': 'ja' as const, // oppfølging +1
        };
        expect(calculateResult(questions, answers)).toBe('oppfølging');
    });

    it('uavgjort gir oppfølging (default)', () => {
        const answers = {
            'acc-as': 'ja' as const, // arbeidssøker +1
            'acc-op': 'ja' as const, // oppfølging +1
        };
        expect(calculateResult(questions, answers)).toBe('oppfølging');
    });

    it('ingen svar gir oppfølging (default)', () => {
        expect(calculateResult(questions, {})).toBe('oppfølging');
    });
});

// --- isComplete ---

describe('isComplete', () => {
    it('returnerer false når result er null', () => {
        expect(isComplete(initialState)).toBe(false);
    });

    it('returnerer true når result er satt', () => {
        expect(isComplete({ ...initialState, result: 'arbeidssøker' })).toBe(true);
    });
});

// --- canGoBack ---

describe('canGoBack', () => {
    it('returnerer false på første spørsmål', () => {
        expect(canGoBack(initialState)).toBe(false);
    });

    it('returnerer true på spørsmål > 0 uten result', () => {
        expect(canGoBack({ ...initialState, currentIndex: 1 })).toBe(true);
    });

    it('returnerer true på spørsmål > 0 selv om result er satt (kan gå tilbake og endre)', () => {
        expect(canGoBack({ ...initialState, currentIndex: 1, result: 'arbeidssøker' })).toBe(true);
    });

    it('returnerer true på spørsmål 0 når result er satt via circuit-breaker (kan endre svaret)', () => {
        expect(canGoBack({ ...initialState, currentIndex: 0, result: 'arbeidssøker' })).toBe(true);
    });

    it('returnerer false i startposisjon uten result', () => {
        expect(canGoBack({ ...initialState, currentIndex: 0, result: null })).toBe(false);
    });
});
