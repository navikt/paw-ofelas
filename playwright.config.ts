import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:3000/arbeid/veiviser',
        trace: 'on-first-retry',
    },
    testIgnore: ['**/accessibility.spec.ts', '**/decorator-smoke.spec.ts'],
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
    webServer: {
        command: 'APP_ONLY_E2E=true pnpm dev',
        url: 'http://localhost:3000/arbeid/veiviser',
        reuseExistingServer: false,
        stdout: 'ignore',
    },
});
