import type { Page } from '@playwright/test';

/**
 * Svarer på N spørsmål i veiviseren med ett og samme svar.
 * Forventer at hvert spørsmål er klart (radio og Neste-knapp er synlige) før det klikkes.
 */
export async function answerNQuestions(page: Page, answer: 'Ja' | 'Nei', n: number): Promise<void> {
    for (let i = 0; i < n; i++) {
        await page.getByRole('radio', { name: answer }).click();
        await page.getByRole('button', { name: 'Neste' }).click();
    }
}
