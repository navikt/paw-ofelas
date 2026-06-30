import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Run Storybook stories as jsdom tests to collect component coverage.
// The browser-based storybookTest plugin (Playwright) is intentionally not used here
// because it requires Chromium → localhost network access, which is blocked in
// sandboxed environments (e.g. cplt). Instead, stories are rendered via
// composeStories from @storybook/nextjs-vite in jsdom.
export default defineConfig({
    root: dirname,
    test: {
        coverage: {
            provider: 'v8',
            reportsDirectory: './coverage/components',
            include: ['src/components/veiviser/**/*.tsx'],
            exclude: ['src/components/veiviser/**/*.stories.tsx'],
        },
        projects: [
            {
                test: {
                    name: 'components',
                    environment: 'jsdom',
                    globals: true,
                    include: ['src/components/veiviser/**/*.test.tsx'],
                    setupFiles: ['./vitest.setup.ts'],
                },
                resolve: {
                    alias: {
                        '@/': `${path.resolve(dirname, 'src')}/`,
                    },
                },
            },
        ],
    },
});
