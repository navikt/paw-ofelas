# NAV Veiviser – Plan Mode Prompt

Jeg vil bygge en Next.js-veiviser (wizard) som hjelper NAV-brukere å finne ut om de skal:
1. **Registrere seg som arbeidssøker**, eller
2. **Melde seg til arbeidsrettet oppfølging**

## Tech stack
- Next.js (App Router)
- TypeScript
- NAV Aksel designsystem: `@navikt/ds-react` og `@navikt/ds-css`
- Ingen backend eller database – alt skjer i frontend
- Storybook for komponenter
- pnpm som pakkebehandler
- nais.yaml filer for dev og prod

## Testdrevet utvikling
- utvikling av funksjonalitet skjer ved hjelp av TDD og Storybook
- UI komponenter dokumenteres med Storybook, hvor vi i så stor grad som mulig bare sender inn props
- Logikk og datamodellering dras helst ut fra React, og testes via TDD/Jest
- Storybook er en del av CI/CD-prosessen
- Ved behov kan testing-library benyttes
- Flyter / integrasjonstester gjøres via Playwright, enten i Storybook eller som et eget script package.json

## Funksjonelle krav
- Veiviseren stiller brukeren en serie spørsmål (ett om gangen) for å kartlegge situasjonen deres
- Basert på svarene følger den en beslutningstre-logikk for å lede brukeren til riktig utfall
- På slutten vises en **tydelig anbefaling** med en knapp/lenke som peker videre til riktig handling
- Brukeren skal kunne gå **tilbake** til forrige spørsmål og endre svar
- State håndteres lokalt i React (f.eks. useState eller useReducer) – ingen persistering

## Ikke-funksjonelle krav
- God tilgjengelighet (a11y) – dette er en offentlig tjeneste
- Responsivt design
- Bruk Aksel-komponenter gjennomgående: `Button`, `Radio`/`RadioGroup`, `StepIndicator`, `Alert`, `Heading`, `BodyLong` o.l. – ikke lag egne UI-primitiver der Aksel dekker behovet
- Koden skal være godt strukturert med tydelig separasjon mellom spørsmålslogikk/beslutningstre (data) og UI-komponenter

## Spørsmål jeg ønsker at du avklarer med meg i plan-fasen
1. Hvilke spørsmål bør veiviseren stille, og i hvilken rekkefølge?
2. Hva er beslutningslogikken – hvilke svar leder til hvilken anbefaling?
3. Foreslå en mappestruktur og komponentinndeling
4. Hvordan bør beslutningstreet modelleres i TypeScript (f.eks. som en graf, array av steg, eller noe annet)?

## Ønsket output fra plan-fasen
- En komplett implementasjonsplan med filstruktur
- Forslag til TypeScript-typer/modell for beslutningstreet
- En liste over komponenter som skal lages
- Rekkefølge for implementasjon