import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/nextjs-vite';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: ['@storybook/addon-vitest', '@storybook/addon-a11y', '@storybook/addon-docs'],
    framework: '@storybook/nextjs-vite',
    viteFinal: async (config) => {
        config.resolve = config.resolve ?? {};
        config.resolve.alias = {
            ...config.resolve.alias,
            '@/': `${path.resolve(dirname, '../src')}/`,
        };
        return config;
    },
};
export default config;
