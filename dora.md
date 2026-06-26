# DORA Capabilities — paw-ofelas

> Analyse basert på [DORA capabilities](https://dora.dev/capabilities/). Fokus: tekniske og prosess-relaterte capabilities som er relevante for kode og utvikling. Gjennomgått juni 2026.

---

## Sammendrag

paw-ofelas er en moden, frontend-only Next.js-applikasjon med solid CI/CD-pipeline og god testdekning. Kodebasen scorer sterkt på automatisering, testpraksis og sikkerhet i leveransekjeden. De viktigste forbedringsområdene er observabilitet, testdekningsmåling og manglende blokkering på noen kvalitetssignaler.

| Capability | Score | Kommentar |
|---|---|---|
| Version control | ✅ | Git + GitHub, CODEOWNERS |
| Continuous integration | ✅ | Solid pipeline med flere testtyper |
| Trunk-based development | ✅ | `main` som trunk, `dev/*`-konvensjon |
| Continuous testing | ✅ | Unit, E2E, Storybook, a11y i CI |
| Continuous delivery | ✅ | Automatisk til dev og prod |
| Deployment automation | ✅ | Nais + Docker, ingen manuelle steg |
| Code maintainability | ✅ | Strict TS, Biome, Knip |
| Shifting left on security | ⚠️ | SHA-pins ✅, SAST mangler |
| Observability | ⚠️ | Health check ✅, metrics/logging mangler |
| Documentation | ✅ | README, Storybook, AGENTS.md |
| Working in small batches | ✅ | `dev/*`-branches, Dependabot-grupper |
| Flexible infrastructure | ✅ | Nais + autoscaling i prod |

---

## Detaljert vurdering

### ✅ Version control

- Git med GitHub, tydelig branch-navnekonvensjon (`dev/<navn>`)
- `CODEOWNERS` konfigurert (`@navikt/paw` for hele repoet)
- `.gitignore` er komplett

**Forbedring:** Ingen PR-mal (`.github/PULL_REQUEST_TEMPLATE.md`). En enkel sjekkliste kan gjøre code review mer konsistent.

---

### ✅ Continuous integration

CI-pipelinen i `.github/workflows/deploy.yaml` er velutviklet:

- **Test-jobb:** Vitest enhetstester + Knip dead code-sjekk
- **Storybook-jobb:** Komponenttester kjørt i Chromium via Playwright
- **E2E-jobb:** Playwright mot fullstack-app
- **Build-jobb:** Next.js produksjonsbygg + Docker-image
- Alle fire jobber må passere før deploy til dev
- `concurrency: cancel-in-progress` hindrer parallelle deploy av samme branch

**Forbedring:** `pnpm install --no-frozen-lockfile` i CI betyr at lockfilen kan avvike fra det som faktisk installeres. Bruk `pnpm ci` (alias for `pnpm clean && pnpm install --frozen-lockfile`, tilgjengelig fra pnpm 9+) for deterministiske bygg.

---

### ✅ Trunk-based development

- `main` er trunk og deploymentsbranch for prod
- `dev/*`-branches gir enkelt preview-deploy til dev uten å merge til main
- Git-loggen viser hyppige, fokuserte commits (dependabot-oppdateringer merges individuelt)

---

### ✅ Continuous testing

Teststrategien er bred og godt integrert:

| Testnivå | Verktøy | Kjøres |
|---|---|---|
| Enhet (logic) | Vitest | pre-push + CI |
| Komponent (UI) | Storybook + Vitest | CI |
| E2E (brukerflyt) | Playwright | CI |
| Tilgjengelighet | axe-core/playwright | CI (eget spec) |
| Type-sjekk | TypeScript strict | pre-commit |
| Lint | Biome | pre-commit (staged) |

Pre-commit-hook kjører `tsc --noEmit` og `biome check --staged`.
Pre-push-hook kjører `pnpm test` (enhetstester).

**Forbedringer:**

1. **Ingen coverage-terskel i CI.** `@vitest/coverage-v8` er installert og `pnpm coverage` er satt opp lokalt. Den faktiske testdekningen for ren logikk er god (48 tester dekker `engine.ts`, `language.ts` og `WizardStateContext`-reducer grundig). Det mangler imidlertid en terskelverdi i `vitest.config.ts` og i CI-pipelinen som bryter bygget dersom dekningen faller under et minimum.
2. **Knip blokkerer ikke.** `--no-exit-code` betyr at dead code rapporteres til GitHub Step Summary, men hindrer ikke merge. Vurder å gjøre dette til en blokkerende feil.
3. **Ingen smoke-test etter deploy til prod.** Pipelinen slutter etter `nais deploy` uten å verifisere at applikasjonen faktisk svarer.

---

### ✅ Continuous delivery & Deployment automation

```
push til main → test + build + storybook + e2e → deploy-dev → deploy-prod
push til dev/* → test + build + storybook + e2e → deploy-dev (kun)
```

- Ingen manuelle godkjenninger — full automatikk fra commit til prod
- Docker-image bygges med `nais/docker-build-push` og SHA-pinnet versjon
- `nais/deploy` håndterer Kubernetes-manifest
- Prod: 2–4 replicas med autoscaling
- Dev: 1 replica (tilstrekkelig for preview)

**Forbedring:** Det er ingen feature-flags eller canary-mekanisme. Alle endringer rulles ut til 100 % av trafikken umiddelbart. Nais støtter gradual rollout via `strategy: RollingUpdate` med lavere `maxSurge`/`maxUnavailable` — kan vurderes for risikoreduksjon.

---

### ✅ Code maintainability

- **TypeScript** med `"strict": true` — alle vanlige feil fanges på kompileringstidspunkt
- **Biome** erstatter ESLint + Prettier med én rask konfig, inkludert a11y-regler
- **Knip** oppdager ubrukte eksporter, dependencies og filer
- **Klar arkitektur:** `src/lib/` (ren logikk) → `src/components/` (UI) → `src/app/` (Next.js routing) — ingen blanding av ansvarsområder
- **Eksakte versjoner** i `package.json` (ingen `^` eller `~`) — reproduserbare installasjoner
- `engines.node` satt til eksakt versjon i `package.json` og `.nvmrc`

---

### ⚠️ Shifting left on security

**Styrker:**

- Alle GitHub Actions er SHA-pinnet (f.eks. `actions/checkout@df4cb1c069...`) — excellent supply chain security
- Dependabot konfigurert for både npm og GitHub Actions, med ukentlig frekvens og grupperte PRs
- Ingen hardkodede hemmeligheter (frontend-only, ingen backend-integrasjoner utover Nav Dekoratøren)
- `accessPolicy` i Nais-manifest er eksplisitt og minimal (kun outbound til dekoratøren)

**Mangler:**

- **Ingen SAST-skanning** (f.eks. CodeQL via `github/codeql-action`). For en Next.js-app er risikoen lav, men XSS og avhengighetssårbarheter kan fanges tidlig.
- **Ingen `npm audit` / `pnpm audit` i CI.** Dependabot dekker kjente CVE-er, men med en ukes forsinkelse.

---

### ⚠️ Observability

**Styrker:**

- Liveness og readiness probes peker på `/arbeid/veiviser/api/health` — returnerer `{ status: "ok" }` 
- Nais-plattformen gir grunnleggende metrics (CPU, minne, request rate) automatisk

**Mangler:**

- **Ingen frontend-feillogging** (f.eks. Sentry, Faro). Dersom JavaScript-feil oppstår i produksjon for brukere, er disse usynlige.
- **Ingen Core Web Vitals-måling.** For en brukervendt tjeneste på nav.no er LCP, CLS og INP viktige kvalitetsindikatorer.
- **Ingen hendelseslogging/analytics utover standard Umami/Amplitude.** `src/lib/analytics.ts` eksisterer, men det er uklart hva som spores og om det er aktivt.
- **Health-endepunktet er statisk** — returnerer alltid `ok` uavhengig av faktisk tilstand.

---

### ✅ Documentation

- **README** er tydelig: formål, kom-i-gang, alle kommandoer, lenker til dev/prod, Slack-kanal
- **Storybook** dokumenterer komponenter visuelt
- **`spørsmål.md`** dokumenterer forretningslogikken (beslutningstret)
- **`AGENTS.md`** og `.github/copilot-instructions.md` dokumenterer konvensjoner for AI-assistert utvikling
- **`veiviser-planning-prompt.md`** gir arkitekturkontekst

**Forbedring:** Ingen `CHANGELOG.md` eller automatisert release notes. Conventional commits brukes ikke konsekvent (se git-loggen: `c oppdaterer pnpm...`). Med conventional commits og f.eks. `release-please` kan endringslogg genereres automatisk.

---

### ✅ Working in small batches

- Dependabot lager én PR per dependency-gruppe — enkle, målrettede endringer
- `dev/*`-konvensjon gjør det trygt å deploye til dev uten full merge
- Ingen feature-branches med lang levetid synlig i git-loggen

---

## Prioriterte forbedringer

| Prioritet | Forbedring | Innsats | Verdi |
|---|---|---|---|
| 🔴 Høy | Legg til coverage-terskel i `vitest.config.ts` og CI | Lav | Bryter bygget om dekning faller under minimum |
| 🔴 Høy | Frontend-feillogging (Sentry eller Faro) | Medium | Synlighet på produksjonsfeil |
| 🟡 Medium | `pnpm ci` i stedet for `pnpm install --no-frozen-lockfile` | Svært lav | Deterministiske bygg |
| 🟡 Medium | Gjør Knip til blokkerende feil | Svært lav | Hindrer dead code fra å akkumulere |
| 🟡 Medium | Smoke-test etter prod-deploy | Lav | Raskere deteksjon av deploy-feil |
| 🟢 Lav | PR-mal med sjekkliste | Svært lav | Mer konsistent code review |
| 🟢 Lav | Conventional commits + CHANGELOG | Lav | Sporbarhet mellom commits og funksjonalitet |
| 🟢 Lav | CodeQL SAST-skanning | Lav | Ekstra sikkerhetsnett |

---

*Generert av nav-pilot · paw-ofelas · juni 2026*
