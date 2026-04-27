import type { Metadata } from 'next';
import { VeiviserPage } from '@/components/veiviser/VeiviserPage';

export const metadata: Metadata = {
    title: 'Veiviser – Bør du registrere deg som arbeidssøker eller be om arbeidsrettet oppfølging?',
};

export default function RootVeiviserPage() {
    return <VeiviserPage sprak="nb" />;
}
