import type { Metadata } from "next";
import "@navikt/ds-css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Veiviser – NAV",
  description: "Finn ut om du bør registrere deg som arbeidssøker eller melde deg til arbeidsrettet oppfølging.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body>{children}</body>
    </html>
  );
}
