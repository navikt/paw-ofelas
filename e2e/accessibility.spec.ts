import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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

        // Q1–Q5: nei (circuit-breakers)
        for (let i = 0; i < 5; i++) {
            await page.getByRole('radio', { name: 'Nei' }).click();
            await page.getByRole('button', { name: 'Neste' }).click();
            await page.waitForSelector('[role="progressbar"]');
        }

        // Q6–Q10: ja (gir oppfølging)
        for (let i = 0; i < 5; i++) {
            await page.getByRole('radio', { name: 'Ja' }).click();
            await page.getByRole('button', { name: 'Neste' }).click();
            if (i < 4) {
                await page.waitForSelector('[role="progressbar"]');
            }
        }

        await page.waitForSelector('[role="status"]');

        const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
        expect(results.violations).toEqual([]);
    });

    test('spørsmål med hjelpetekst (Q3) har ingen a11y-brudd', async ({ page }) => {
        await page.goto(BASE);
        await page.waitForSelector('[role="progressbar"]');

        // Q1: nei → Q2: nei → Q3 har hjelpetekst
        await page.getByRole('radio', { name: 'Nei' }).click();
        await page.getByRole('button', { name: 'Neste' }).click();
        await page.waitForSelector('text=Spørsmål 2 av 10');

        await page.getByRole('radio', { name: 'Nei' }).click();
        await page.getByRole('button', { name: 'Neste' }).click();
        await page.waitForSelector('text=Spørsmål 3 av 10');

        const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
        expect(results.violations).toEqual([]);
    });
});
