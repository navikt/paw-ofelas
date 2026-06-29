'use client';

import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';
import { useEffect } from 'react';

interface Props {
    url: string;
    environment: string;
}

export function FaroProvider({ url, environment }: Props) {
    useEffect(() => {
        if (!url) return;

        initializeFaro({
            url,
            app: {
                name: 'paw-ofelas',
                environment,
            },
            instrumentations: [...getWebInstrumentations()],
        });
    }, [url, environment]);

    return null;
}
