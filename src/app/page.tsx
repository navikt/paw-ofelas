import type { Metadata } from 'next';
import { VeiviserPage } from '@/components/veiviser/VeiviserPage';

export const metadata: Metadata = {
    title: 'Veiviser – Bør jeg registrere meg som arbeidssøker eller be om arbeidsrettet oppfølging?',
};

export default function RootVeiviserPage() {
    return <VeiviserPage sprak="nb" />;
}
