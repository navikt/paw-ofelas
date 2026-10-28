<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# paw-ofelas: agent-instruksjoner

## Hva dette er

En Next.js-veiviser («wizard») som hjelper innbyggere å velge mellom to utfall:

1. **Registrere seg som arbeidssøker**
2. **Melde seg til arbeidsrettet oppfølging**

Spørsmålsrekkefølge og utfallsregler er definert i `src/lib/veiviser/questions.ts`. Spørsmålstekstene ligger i `src/lib/veiviser/tekster.ts`. `spørsmål.md` og `veiviser-planning-prompt.md` er bakgrunns- og planleggingsdokumenter, ikke fasit for dagens implementasjon.

## Teknologi

| Teknologi                | Versjon                |
| ------------------------ | ---------------------- |
| Next.js (App Router)     | 16.x                   |
| React                    | 19.x                   |
| TypeScript               | 7.x                    |
| @navikt/ds-react (Aksel) | 8.x                    |
| Vitest                   | 5.x (unit + Storybook) |
| Playwright               | 1.x (e2e)              |
| Storybook                | 10.x                   |
| Node.js                  | 24.22.1                |
| pnpm                     | 11.28.6                |

Eksakte pakkeversjoner står i `package.json`. Node-versjonen står også i `.nvmrc`.

Ingen egen forretningsbackend eller database. Veivisersvar lagres bare i React Context med `useReducer`, uten persistering. Next.js serverrenderer sider, henter Nav-dekoratøren på serveren og eksponerer et health-endpoint.

Appen bruker `basePath: '/arbeid/veiviser'`. Åpne `http://localhost:3000/arbeid/veiviser` lokalt. Produksjonsbygg bruker standalone-output og statiske ressurser fra `https://cdn.nav.no/paw/paw-ofelas`, med offentlige source maps. Se `next.config.ts`.

Deployment til Nais styres av `.github/workflows/deploy.yaml`, med `.nais/nais-dev.yaml` og `.nais/nais-prod.yaml`. Push til `main` deployer til dev og deretter prod. Brancher med prefikset `dev/` deployer bare til dev.

## Shellmiljø

Bruk alltid `nvm use` for å aktivere riktig Node-versjon (definert i `.nvmrc`).
pnpm-versjonen er definert i `packageManager`-feltet i `package.json` og aktiveres via corepack.

```bash
# Før alle kommandoer i bash-verktøy:
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use
```

## Kommandoer

```bash
pnpm dev                    # Start dev-server
pnpm build                  # Produksjonsbygg
pnpm start                  # Start produksjonsserver
pnpm test                   # Vitest-enhetstester (unit-prosjektet)
pnpm test:watch             # Enhetstester i watch-modus
pnpm coverage               # Enhetstester med dekningskrav
pnpm e2e                    # Playwright-flytstester, deretter a11y-tester
pnpm e2e:decorator-smoke     # Separat smoke-test av dekoratørintegrasjonen
pnpm storybook              # Start Storybook på port 6006
pnpm build-storybook        # Bygg Storybook
pnpm test-storybook         # Storybook-tester i headless Chromium
pnpm coverage:components    # Dekningsrapport for komponenter
pnpm lint                   # Biome-sjekk
pnpm lint:fix               # Biome-sjekk med automatiske rettinger
pnpm typecheck              # TypeScript-typesjekk
pnpm format                 # Formater med Biome
pnpm format:check           # Sjekk formatering uten å endre filer
```

## Arkitektur

Beslutningslogikken er skilt fra React-komponentene:

- `src/lib/veiviser/` inneholder spørsmålsdefinisjoner, oversatte tekster, typer og beslutningsmotoren i ren TypeScript.
- `src/lib/language.ts` håndterer språkverdier og URL-tolkning. `src/lib/analytics.ts` definerer analysehendelser.
- `src/components/veiviser/WizardStateContext.tsx` eier veivisertilstanden og reduceren for svar, tilbake og omstart.
- `src/components/veiviser/WizardShell.tsx` kobler tilstand til UI og håndterer fokus, navigasjon og analysehendelser.
- `QuestionStep`, `ResultStep` og `ProgressIndicator` mottar data og callbacks via props.
- `src/components/LanguageHandler.tsx` kobler dekoratørens språkvelger til Next.js-ruteren. `FaroProvider.tsx` initialiserer Faro i nettleseren.
- `src/app/` inneholder sider, rotlayout og `api/health/route.ts`. Health-endpointet ligger under appens basePath.

### Språk og tilstand

Appen støtter bokmål (`nb`), nynorsk (`nn`) og engelsk (`en`). Bokmål bruker `/`, nynorsk `/nn` og engelsk `/en`, alle under basePath. `src/proxy.ts` setter den interne `x-language`-headeren som rotlayouten bruker for HTML-språk og dekoratøren.

`WizardStateProvider` ligger i rotlayouten. Tilstanden beholdes ved språkbytte gjennom klientnavigasjon, men nullstilles ved full sideinnlasting. Tekster velges med `lagHentTekstForSprak` fra `@navikt/arbeidssokerregisteret-utils`. UI-tekster finnes både i `tekster.ts` og i komponentene.

### Dekoratør og observability

Rotlayouten henter Nav-dekoratøren med `fetchDecoratorReact`. `DECORATOR_ENV` velger miljø, med `dev` som fallback. `APP_ONLY_E2E=true` slår av dekoratøren og språkhandleren for isolerte a11y-tester.

Analysehendelser sendes via dekoratørens analyseklient som `paw-ofelas.aktivitet`. Hendelsene beskriver steg, navigasjon, anbefaling og CTA-klikk. Enkeltsvar sendes ikke som egne svarfelter. Ikke legg til personopplysninger i analysehendelser eller logger.

`FaroProvider` initialiserer Grafana Faro når `FARO_URL` er satt, med `NAIS_CLUSTER_NAME` som miljø og `local` som fallback. Nais-manifestene konfigurerer også automatisk Node.js-instrumentering.

### Testing og CI

Vitest har separate prosjekter for enhetstester og Storybook. `pnpm test` kjører bare enhetstestprosjektet. Dekningskravene for `src/lib/` er 90 % for linjer, funksjoner og statements, og 85 % for branches. Tekster, spørsmålsdefinisjoner og typer er unntatt fra dekningsmålingen.

`pnpm e2e` kjører først flytstester med vanlig layout, deretter a11y-tester med `APP_ONLY_E2E=true`. Dekoratørintegrasjonen har en separat smoke-test. Hvis du gjenbruker en lokal dev-server, må den være startet med riktig `APP_ONLY_E2E`-verdi for testen du kjører.

CI krever enhetstester, bygg, Storybook-tester og E2E-tester før deployment. Komponentdekning og dekoratørens smoke-test er rapporterende og ikke-blokkerende.

## Konvensjoner

### Kode

- Bruk Aksel til UI-primitiver, blant annet `Button`, `RadioGroup`, `LocalAlert`, `Heading` og `BodyLong`.
- Bruk Aksel-tokens for spacing, for eksempel `Box` med `padding="space-*"`, aldri Tailwind `p-*`/`m-*`.
- `package.json` bruker eksakte versjoner, for eksempel `"react": "19.3.1"`, aldri `"^19"`.
- Skriv Vitest-tester for beslutningslogikken _før_ implementasjonen.
- Lag Storybook-stories for visuelle komponenter. Hold presentasjonskomponenter props-styrte. Tilstand, effekter og koordinering hører hjemme i providere og containerkomponenter som `WizardShell`.
- Tilgjengelighet er obligatorisk. Bruk Aksel, korrekt overskriftshierarki, tastaturnavigasjon og fokushåndtering ved stegbytte.

### Aksel v8: kritiske regler

- `space-16` = 16px (token-navn er pikselverdier direkte, ikke Tailwind-skala)
- Bruk **ikke** `Alert`. Bruk `LocalAlert`, `GlobalAlert`, `InlineMessage` eller `InfoCard`.
- Bruk **ikke** `borderRadius="large"`. Bruk `"4"`, `"8"`, `"12"`, `"full"`.
- `gap` krever alltid `space-`-prefiks: `gap="space-16"`, aldri `gap="4"` eller `gap={4}`
- `VStack`/`HStack` har **ikke** `padding`-prop. Legg dem i en `Box`.
- Ikke overstyr `--ax-*`-tokens eller `.aksel-*`-klasser

## Beslutningstreet

Veiviseren har ti spørsmål fordelt på pengestøtte, forhold til jobb, kurs/utdanning/tiltak og hindringer.

- q1–q5 er circuit-breakers. Et ja gir anbefaling direkte: q1–q3 gir arbeidssøker, q4–q5 gir oppfølging. Et nei lagres og går videre uten å gi poeng.
- Hvis ingen circuit-breaker slår inn, beregner `calculateResult` utfallet fra q6–q10. Hvert svar gir ett poeng til utfallet definert i `questions.ts`.
- Flertallet avgjør. Ved lik poengsum velges oppfølging. Oppfølging er ikke et automatisk utfall når ingen circuit-breaker slår inn.

Se `src/lib/veiviser/engine.ts` og `engine.test.ts` for beregning og tester. Tilbakenavigasjon og omstart testes i `WizardStateContext.test.ts`.

## Spesialistagenter

I Copilot Chat kan disse brukes via `@agent-name` når de er installert. Andre klienter kan ha andre agentnavn. Bruk bare agenter som er tilgjengelige i klienten.

| Agent                      | Bruk til                                                   |
| -------------------------- | ---------------------------------------------------------- |
| `@aksel-agent`             | Aksel Design System, komponenter, tokens, layout, Figma    |
| `@accessibility-agent`     | WCAG 2.1/2.2, universell utforming, UU-testing             |
| `@auth-agent`              | Azure AD, TokenX, ID-porten, Maskinporten, JWT             |
| `@nais-agent`              | Nais-deployment, GCP-ressurser, kubectl-feilsøking         |
| `@kafka-agent`             | Rapids & Rivers, eventdrevet arkitektur, schema-design     |
| `@observability-agent`     | Prometheus, OpenTelemetry, Grafana, varsling               |
| `@security-champion-agent` | Trusselmodellering, compliance, sikkerhetsvurderinger      |
| `@code-review-agent`       | Kodegjennomgang, Nav-konvensjoner, sikkerhetsfunn          |
| `@forfatter`               | Norsk klarspråk, mikrotekst, teknisk redigering            |
| `@research-agent`          | Utforsk kodebaser, samle kontekst før implementering       |
| `@nav-pilot`               | Planlegging og arkitektur for nye features eller endringer |

## Skills

Bruk tilgjengelige skills via klientens skill-verktøy eller skill-meny:

| Skill                 | Bruk til                                                         |
| --------------------- | ---------------------------------------------------------------- |
| `aksel-builder`       | Aksel-komponenter, responsive layouter, spacing-tokens og tilgjengelighet |
| `conventional-commit` | Generer conventional commit-meldinger med Nav-scopes             |
| `web-design-reviewer` | Visuell inspeksjon for å finne og fikse designproblemer i kildekoden |
