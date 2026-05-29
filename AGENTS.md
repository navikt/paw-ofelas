<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# paw-ofelas — Agent-instruksjoner

## Hva dette er

En Next.js-veiviser («wizard») som hjelper NAV-brukere å velge mellom to utfall:

1. **Registrere seg som arbeidssøker**
2. **Melde seg til arbeidsrettet oppfølging**

Spørsmålene er definert i `spørsmål.md`. Planleggingsdetaljer i `veiviser-planning-prompt.md`.

## Tech stack

| Teknologi                | Versjon                |
| ------------------------ | ---------------------- |
| Next.js (App Router)     | 16.x                   |
| React                    | 19.x                   |
| TypeScript               | 5.x                    |
| @navikt/ds-react (Aksel) | 8.x                    |
| Vitest                   | 4.x (unit + Storybook) |
| Playwright               | 1.x (e2e)              |
| Storybook                | 10.x                   |
| pnpm                     | pakkebehandler         |

Ingen backend — all tilstand er lokal React (`useState`/`useReducer`), ingen persistering.
Deployeres til Nais (dev + prod) via `nais.yaml`.

## Kommandoer

```bash
pnpm dev                    # Start dev-server
pnpm build                  # Produksjonsbygg
pnpm test                   # Vitest enhetstester
pnpm test:watch             # Vitest i watch-modus
pnpm e2e                    # Playwright E2E-tester
pnpm storybook              # Start Storybook
pnpm lint                   # Biome
pnpm typecheck              # TypeScript type-sjekk
pnpm format                 # Biome
```

## Arkitektur

Veiviseren har et klart skille mellom **data/logikk** og **UI**:

- `src/lib/` / `src/data/` — beslutningstreet og spørsmålsflyt; ren TypeScript, ingen React
- `src/components/` — UI-komponenter som kun mottar props (ingen intern logikk)
- `src/app/` — Next.js App Router-sider

Noen spørsmål er **circuit-breakers** — de ruter direkte til en anbefaling.
Standard utfall når ingen circuit-breaker treffer: **oppfølging**.

## Konvensjoner

### Kode

- **Ingen egne UI-primitiver** — bruk alltid Aksel: `Button`, `RadioGroup`, `LocalAlert`, `Heading`, `BodyLong`, `StepIndicator`, osv.
- **Spacing via Aksel-tokens** — `Box` med `padding="space-*"`, aldri Tailwind `p-*`/`m-*`
- **Eksakte versjoner** — `package.json` bruker alltid eksakt versjon (`"react": "19.2.5"`, aldri `"^19"`)
- **TDD for logikk** — beslutningstreet skal ha Vitest-tester _før_ implementasjon
- **Storybook for komponenter** — alle komponenter får en Story; komponenter er pure (props inn, UI ut)
- **a11y er obligatorisk** — offentlig tjeneste; bruk Aksel, korrekt heading-hierarki, tastaturnavigasjon

### Aksel v8 — kritiske regler

- `space-16` = 16px (token-navn er pikselverdier direkte, ikke Tailwind-skala)
- Bruk **ikke** `Alert` — bruk `LocalAlert`, `GlobalAlert`, `InlineMessage` eller `InfoCard`
- Bruk **ikke** `borderRadius="large"` — bruk `"4"`, `"8"`, `"12"`, `"full"`
- `gap` krever alltid `space-`-prefiks: `gap="space-16"`, aldri `gap="4"` eller `gap={4}`
- `VStack`/`HStack` har **ikke** `padding`-prop — wrap i `Box`
- Ikke overstyr `--ax-*`-tokens eller `.aksel-*`-klasser

## Beslutningstreet

Veiviseren bruker akkumulerte svar (ikke bare siste svar) for å bestemme utfall. Circuit-breaker-spørsmål kortslutter direkte til en anbefaling. Se `spørsmål.md` for full spørsmålsliste organisert etter kategori (Pengestøtte, Forhold til jobb, Kurs/utdanning/tiltak, Hindringer).

## Spesialistagenter

Bruk disse via `@agent-name` i Copilot Chat for domene-spesifikk hjelp:

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

Bruk disse i Copilot Chat med `#skill-name` eller via skill-menyen:

| Skill                 | Bruk til                                                         |
| --------------------- | ---------------------------------------------------------------- |
| `aksel-spacing`       | Responsive layouts, spacing-tokens, Box/HStack/VStack/HGrid/Page |
| `conventional-commit` | Generer conventional commit-meldinger med Nav-scopes             |
| `web-design-reviewer` | Visuell inspeksjon — finn og fiks designproblemer i kildekoden   |
