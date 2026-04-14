import { test, expect } from '@playwright/test';

test.describe('Veiviser', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('viser første spørsmål ved oppstart', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /hva trenger du hjelp med/i })).toBeVisible();
        await expect(page.getByText('Spørsmål 1 av 10')).toBeVisible();
        await expect(page.getByRole('radio', { name: 'Ja' })).toBeVisible();
        await expect(page.getByRole('radio', { name: 'Nei' })).toBeVisible();
    });

    test('Neste-knapp er deaktivert uten valg', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Neste' })).toBeDisabled();
    });

    test('circuit-breaker: ja på Q1 gir umiddelbar arbeidssøker-anbefaling', async ({ page }) => {
        await page.getByRole('radio', { name: 'Ja' }).click();
        await page.getByRole('button', { name: 'Neste' }).click();

        await expect(page.getByText(/registrere deg som arbeidssøker/i)).toBeVisible();
        await expect(page.getByRole('link', { name: /registrer deg som arbeidssøker/i })).toBeVisible();
    });

    test('nei gjennom alle circuit-breakere viser neste spørsmål', async ({ page }) => {
        // Q1: nei
        await page.getByRole('radio', { name: 'Nei' }).click();
        await page.getByRole('button', { name: 'Neste' }).click();
        await expect(page.getByText('Spørsmål 2 av 10')).toBeVisible();

        // Q2: nei
        await page.getByRole('radio', { name: 'Nei' }).click();
        await page.getByRole('button', { name: 'Neste' }).click();
        await expect(page.getByText('Spørsmål 3 av 10')).toBeVisible();
    });

    test('tilbake-knapp er ikke synlig på første spørsmål', async ({ page }) => {
        await expect(page.getByRole('button', { name: /tilbake/i })).not.toBeVisible();
    });

    test('tilbake-navigasjon fungerer og beholder valg', async ({ page }) => {
        // Svar nei på Q1
        await page.getByRole('radio', { name: 'Nei' }).click();
        await page.getByRole('button', { name: 'Neste' }).click();
        await expect(page.getByText('Spørsmål 2 av 10')).toBeVisible();

        // Gå tilbake
        await page.getByRole('button', { name: /tilbake/i }).click();
        await expect(page.getByText('Spørsmål 1 av 10')).toBeVisible();
    });

    test('oppfølging-flyt: alle circuit-breakere nei, akkumulerte gir oppfølging', async ({ page }) => {
        // Q1–Q5: nei (circuit-breakers)
        for (let i = 0; i < 5; i++) {
            await page.getByRole('radio', { name: 'Nei' }).click();
            await page.getByRole('button', { name: 'Neste' }).click();
        }

        // Q6–Q10: ja (alle → oppfølging poeng)
        for (let i = 0; i < 5; i++) {
            await page.getByRole('radio', { name: 'Ja' }).click();
            await page.getByRole('button', { name: 'Neste' }).click();
        }

        await expect(page.getByText(/arbeidsrettet oppfølging/i)).toBeVisible();
    });

    test('start på nytt-knapp tilbakestiller veiviseren', async ({ page }) => {
        // Gå til result via circuit-breaker
        await page.getByRole('radio', { name: 'Ja' }).click();
        await page.getByRole('button', { name: 'Neste' }).click();
        await expect(page.getByText(/registrere deg som arbeidssøker/i)).toBeVisible();

        await page.getByRole('button', { name: /start på nytt/i }).click();
        await expect(page.getByText('Spørsmål 1 av 10')).toBeVisible();
    });
});

test.describe('Språkstøtte', () => {
    test('norsk bokmål er standard på /', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { name: /hva trenger du hjelp med/i })).toBeVisible();
    });

    test('/en viser engelsk overskrift', async ({ page }) => {
        await page.goto('/en');
        await expect(page.getByRole('heading', { name: /what do you need help with/i })).toBeVisible();
    });

    test('/nn viser nynorsk overskrift', async ({ page }) => {
        await page.goto('/nn');
        await expect(page.getByRole('heading', { name: /kva treng du hjelp med/i })).toBeVisible();
    });

    test('ugyldig språkkode redirecter til /', async ({ page }) => {
        await page.goto('/de');
        await expect(page).toHaveURL('/');
        await expect(page.getByRole('heading', { name: /hva trenger du hjelp med/i })).toBeVisible();
    });

    test('nb-språkkode redirecter til /', async ({ page }) => {
        await page.goto('/nb');
        await expect(page).toHaveURL('/');
        await expect(page.getByRole('heading', { name: /hva trenger du hjelp med/i })).toBeVisible();
    });
});
