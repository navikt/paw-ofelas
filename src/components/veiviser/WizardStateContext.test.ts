import { reducer, type ShellState } from './WizardStateContext';
import { initialState } from '@/lib/veiviser/engine';
import { questions } from '@/lib/veiviser/questions';

const initial: ShellState = { ...initialState, pendingAnswer: undefined };

// --- SELECT ---

describe('reducer – SELECT', () => {
    it('setter pendingAnswer til valgt svar', () => {
        const next = reducer(initial, { type: 'SELECT', answer: 'ja' });
        expect(next.pendingAnswer).toBe('ja');
    });

    it('endrer pendingAnswer fra ja til nei', () => {
        const withJa: ShellState = { ...initial, pendingAnswer: 'ja' };
        const next = reducer(withJa, { type: 'SELECT', answer: 'nei' });
        expect(next.pendingAnswer).toBe('nei');
    });
});

// --- ANSWER ---

describe('reducer – ANSWER', () => {
    it('circuit-breaker ja: setter result og fjerner pendingAnswer', () => {
        // Q1 er circuit-breaker med yesOutcome: arbeidssøker
        const withPending: ShellState = { ...initial, pendingAnswer: 'ja' };
        const next = reducer(withPending, { type: 'ANSWER', answer: 'ja' });
        expect(next.result).toBe('arbeidssøker');
        expect(next.pendingAnswer).toBeUndefined();
    });

    it('circuit-breaker nei: avanserer til neste spørsmål og fjerner pendingAnswer', () => {
        const withPending: ShellState = { ...initial, pendingAnswer: 'nei' };
        const next = reducer(withPending, { type: 'ANSWER', answer: 'nei' });
        expect(next.result).toBeNull();
        expect(next.currentIndex).toBe(1);
        expect(next.pendingAnswer).toBeUndefined();
    });

    it('lagrer svaret i answers', () => {
        const next = reducer(initial, { type: 'ANSWER', answer: 'nei' });
        expect(next.answers[questions[0].id]).toBe('nei');
    });
});

// --- BACK – fra spørsmål (uten result) ---

describe('reducer – BACK fra spørsmål', () => {
    it('gjør ingenting på første spørsmål uten result', () => {
        const next = reducer(initial, { type: 'BACK' });
        expect(next).toBe(initial); // ingen endring → samme referanse
    });

    it('går tilbake til forrige spørsmål', () => {
        const atQ2: ShellState = { ...initial, currentIndex: 1, answers: { [questions[0].id]: 'nei' } };
        const next = reducer(atQ2, { type: 'BACK' });
        expect(next.currentIndex).toBe(0);
        expect(next.pendingAnswer).toBeUndefined();
    });

    it('beholder eksisterende svar ved tilbake (pre-fyll for bruker)', () => {
        const atQ2: ShellState = {
            ...initial,
            currentIndex: 1,
            answers: { [questions[0].id]: 'nei', [questions[1].id]: 'ja' },
        };
        const next = reducer(atQ2, { type: 'BACK' });
        // Q1-svaret skal fremdeles ligge i answers for pre-fyll
        expect(next.answers[questions[0].id]).toBe('nei');
    });
});

// --- BACK – fra resultatsiden ---

describe('reducer – BACK fra resultat', () => {
    it('fjerner result og gjenoppretter svaret som pendingAnswer', () => {
        // Circuit-breaker-resultat: result satt, currentIndex = 0
        const atResult: ShellState = {
            ...initial,
            currentIndex: 0,
            answers: { [questions[0].id]: 'ja' },
            result: 'arbeidssøker',
        };
        const next = reducer(atResult, { type: 'BACK' });
        expect(next.result).toBeNull();
        expect(next.currentIndex).toBe(0);
        expect(next.pendingAnswer).toBe('ja');
    });

    it('result=null men canGoBack er false på Q0: gjør ingenting', () => {
        // Startstate: currentIndex=0, result=null → canGoBack=false
        const next = reducer(initial, { type: 'BACK' });
        expect(next).toBe(initial);
    });
});

// --- RESTART ---

describe('reducer – RESTART', () => {
    it('tilbakestiller all state til startverdier', () => {
        const atResult: ShellState = {
            currentIndex: 3,
            answers: { [questions[0].id]: 'ja', [questions[1].id]: 'nei' },
            result: 'arbeidssøker',
            pendingAnswer: 'ja',
        };
        const next = reducer(atResult, { type: 'RESTART' });
        expect(next.currentIndex).toBe(0);
        expect(next.answers).toEqual({});
        expect(next.result).toBeNull();
        expect(next.pendingAnswer).toBeUndefined();
    });
});
