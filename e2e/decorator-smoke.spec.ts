import { expect, test } from '@playwright/test';

test.describe('Dekoratør-integrasjon (smoke)', () => {
    test('renderer header og footer fra dekoratøren', async ({ page }) => {
        await page.goto('/arbeid/veiviser');
        await expect(page.locator('decorator-header')).toBeVisible();
        await expect(page.locator('decorator-footer')).toBeVisible();
    });
});
