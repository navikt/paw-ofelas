# paw-ofelas

[![Build](https://github.com/navikt/paw-ofelas/actions/workflows/deploy.yaml/badge.svg)](https://github.com/navikt/paw-ofelas/actions/workflows/deploy.yaml)
![Node](https://img.shields.io/badge/node-24-339933?logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind_CSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css)
![Storybook](https://img.shields.io/badge/Storybook-10-FF4785?logo=storybook&logoColor=white)
![Lint](https://img.shields.io/badge/lint-eslint%20%2B%20prettier-4B32C3)
![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white)

Veiviser som hjelper innbyggere avgjøre om de bør registrere seg som arbeidssøker eller melde seg til arbeidsrettet oppfølging.

## Lenker

- Dev: [https://www.ansatt.dev.nav.no/arbeid/veiviser](https://www.ansatt.dev.nav.no/arbeid/veiviser)
- Prod: [https://www.nav.no/arbeid/veiviser](https://www.nav.no/arbeid/veiviser) _(ikke deployet ennå)_

## Utvikling

Bruk Node.js 24 — `nvm use` dersom du bruker nvm til versjonshåndtering.

Siden noen av modulene hentes fra GitHubs package registry, må du gjøre litt ekstra konfigurasjon for å kjøre løsningen lokalt:

- Opprett et PAT (GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)) med `read:packages`-scope
- Konfigurer SSO mot NAVIKT for tokenet
- Bruk tokenet som passord ved innlogging: `pnpm login --registry https://npm.pkg.github.com`

Deretter fortsetter du med:

```sh
git clone https://github.com/navikt/paw-ofelas.git
cd paw-ofelas
pnpm install
pnpm dev
```

Åpne [http://localhost:3000](http://localhost:3000).

## Testing

Kjør enhetstester med [Vitest](https://vitest.dev/):

```sh
pnpm test
```

For watch-modus under utvikling:

```sh
pnpm test:watch
```

Kjør E2E-tester med [Playwright](https://playwright.dev/):

```sh
pnpm e2e
```

Start [Storybook](https://storybook.js.org/) for komponentutvikling:

```sh
pnpm storybook
```

## Deploye kun til dev

Ved å prefikse branch-navnet med `dev/` vil branchen kun deployes til dev-miljøet:

```sh
git checkout -b dev/<navn-på-branch>
```

## Ekstern dokumentasjon

- [Next.js](https://nextjs.org/)
- [Aksel (NAV Designsystem)](https://aksel.nav.no/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Storybook](https://storybook.js.org/)
- [ESLint](https://eslint.org/) / [Prettier](https://prettier.io/)

---

## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles via issues her på GitHub.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#team-paw-dev](https://nav-it.slack.com/archives/CLTFAEW75)

## Lisens

[MIT](LICENSE)
