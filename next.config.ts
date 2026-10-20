import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

const securityHeaders = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-XSS-Protection', value: '1; mode=block' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

export default (phase: string): NextConfig => ({
    output: 'standalone',
    productionBrowserSourceMaps: true,
    basePath: '/arbeid/veiviser',
    // Use one shared CDN prefix across deployment branches; public source maps are intentional.
    assetPrefix: phase === PHASE_DEVELOPMENT_SERVER ? undefined : 'https://cdn.nav.no/paw/paw-ofelas',
    turbopack: {
        root: __dirname,
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: securityHeaders,
            },
        ];
    },
});
