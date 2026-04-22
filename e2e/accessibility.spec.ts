import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { answerNQuestions } from './helpers';

/**
 * Disse testene bruker eksplisitte basePath-prefiks (/arbeid/veiviser)
 * for å fungere korrekt med Next.js basePath-konfigurasjon i lokalt dev-miljø.
 * I CI kjøres de mot et miljø der basePath er transparent via ingress-proxy.
 */
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa'];

const BASE = '/arbeid/veiviser';

test.describe('Tilgjengelighet (WCAG 2.1 AA)', () => {
    test('startside har ingen a11y-brudd', async ({ page }) => {
        await page.goto(BASE);
        await page.waitForSelector('[role="progressbar"]');

        const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
        expect(results.violations).toEqual([]);
    });

    test('engelsk versjon (/en) har ingen a11y-brudd', async ({ page }) => {
        await page.goto(`${BASE}/en`);
        await page.waitForSelector('[role="progressbar"]');

        const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
        expect(results.violations).toEqual([]);
    });

    test('nynorsk versjon (/nn) har ingen a11y-brudd', async ({ page }) => {
        await page.goto(`${BASE}/nn`);
        await page.waitForSelector('[role="progressbar"]');

        const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
        expect(results.violations).toEqual([]);
    });

    test('resultatsiden (arbeidssøker) har ingen a11y-brudd', async ({ page }) => {
        await page.goto(BASE);
        await page.waitForSelector('[role="progressbar"]');

        // Circuit-breaker: Ja på Q1 → arbeidssøker-resultat
        await page.getByRole('radio', { name: 'Ja' }).click();
        await page.getByRole('button', { name: 'Neste' }).click();
        await page.waitForSelector('[role="status"]');

        const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
        expect(results.violations).toEqual([]);
    });

    test('resultatsiden (oppfølging) har ingen a11y-brudd', async ({ page }) => {
        await page.goto(BASE);
        await page.waitForSelector('[role="progressbar"]');

        // Q1–Q5: nei (circuit-breakers), Q6–Q10: ja (gir oppfølging)
        await answerNQuestions(page, 'Nei', 5);
        await answerNQuestions(page, 'Ja', 5);

        await page.waitForSelector('[role="status"]');

        const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
        expect(results.violations).toEqual([]);
    });

    test('spørsmål med hjelpetekst (Q2 – permittert) har ingen a11y-brudd', async ({ page }) => {
        await page.goto(BASE);
        await page.waitForSelector('[role="progressbar"]');

        // Q1: nei → Q2 har hjelpetekst om permitteringsvarsel
        await answerNQuestions(page, 'Nei', 1);
        await page.waitForSelector('text=Spørsmål 2 av 10');

        const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
        expect(results.violations).toEqual([]);
    });

    test('spørsmål med hjelpetekst (Q3) har ingen a11y-brudd', async ({ page }) => {
        await page.goto(BASE);
        await page.waitForSelector('[role="progressbar"]');

        // Q1: nei → Q2: nei → Q3 har hjelpetekst
        await answerNQuestions(page, 'Nei', 2);
        await page.waitForSelector('text=Spørsmål 3 av 10');

        const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
        expect(results.violations).toEqual([]);
    });
});

test.describe('Fokus og tastaturnavigasjon', () => {
    test('fokus flyttes til toppen ved spørsmålsskifte', async ({ page }) => {
        await page.goto(BASE);
        await page.waitForSelector('[role="progressbar"]');

        await page.getByRole('radio', { name: 'Nei' }).click();
        await page.getByRole('button', { name: 'Neste' }).click();
        await page.waitForSelector('text=Spørsmål 2 av 10');

        const focusedClass = await page.evaluate(() => document.activeElement?.className ?? '');
        expect(focusedClass).toContain('navds-sr-only');
    });

    test('hele flyten kan gjennomføres med kun tastatur', async ({ page }) => {
        await page.goto(BASE);
        await page.waitForSelector('[role="progressbar"]');

        // Tab til Nei-radio, velg, tab til Neste og trykk
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Space'); // velger Nei
        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter'); // Neste

        await expect(page.getByText('Spørsmål 2 av 10')).toBeVisible();
    });

    test('Tab-orden er logisk: radio → Neste-knapp', async ({ page }) => {
        await page.goto(BASE);
        await page.waitForSelector('[role="progressbar"]');

        await page.getByRole('radio', { name: 'Ja' }).click();

        await page.keyboard.press('Tab');
        const focusedLabel = await page.evaluate(() => (document.activeElement as HTMLElement)?.textContent?.trim());
        expect(focusedLabel).toBe('Neste');
    });
});

test.describe('Axe-scan midtveis i flyten', () => {
    test('Q6 (første akkumulerte spørsmål i Forhold til jobb) har ingen a11y-brudd', async ({ page }) => {
        await page.goto(BASE);
        await page.waitForSelector('[role="progressbar"]');

        // Q1–Q5: nei (alle circuit-breakers)
        await answerNQuestions(page, 'Nei', 5);
        await page.waitForSelector('text=Spørsmål 6 av 10');

        const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
        expect(results.violations).toEqual([]);
    });

    test('Q9 (Kurs/utdanning) har ingen a11y-brudd', async ({ page }) => {
        await page.goto(BASE);
        await page.waitForSelector('[role="progressbar"]');

        // Q1–Q8: nei
        await answerNQuestions(page, 'Nei', 8);
        await page.waitForSelector('text=Spørsmål 9 av 10');

        const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
        expect(results.violations).toEqual([]);
    });
});
