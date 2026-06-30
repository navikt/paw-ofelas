# DORA Capabilities — paw-ofelas

Rapport basert på analyse av kildekode, pipeline-konfigurasjon og Nais-manifester.
Scope: tekniske capabilities relevante for kode og utvikling.

Referanse: [dora.dev/capabilities](https://dora.dev/capabilities/)

---

## Oppsummering

| Capability | Score |
|---|---|
| Continuous Integration | ✅ Sterk |
| Deployment Automation | ✅ Sterk |
| Test Automation | ✅ Sterk |
| Trunk-Based Development | ✅ God |
| Shifting Left on Security | ⚠️ God med gap |
| Continuous Delivery | ✅ Sterk |
| Code Maintainability | ⚠️ God med gap |
| Observability | ⚠️ God med gap |
| Documentation Quality | ⚠️ God med gap |

---

## Continuous Integration

**Score: ✅ Sterk**

Pipelines kjører automatisk på push til `main` og `dev/*`-branches. Fem parallelle jobber (test, build, storybook, e2e, deploy) gir rask tilbakemelding. `cancel-in-progress: true` hindrer kø-opphoping ved hyppige commits.

Alle GitHub Actions er SHA-pinnet, noe som beskytter mot supply chain-angrep:
```yaml
uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0
```

Pre-commit hook kjører `pnpm typecheck` + `biome check --staged` og gir rask lokal feedback før push.

**Forbedringspotensial:**
- `pnpm ci` kjøres separat i fire jobber (test, build, storybook, e2e) uten deling av installert node_modules. Bruk av Next.js build-cache er allerede på plass, men en felles install-jobb med artefaktuploading eller reusable workflow kan redusere total pipeline-tid.
- `pnpm typecheck` kjøres kun i pre-commit hook, ikke som eksplisitt CI-steg. TypeScript-feil fanges indirekte via `pnpm build` (Next.js kompilerer TS), men et eksplisitt `typecheck`-steg ville gjøre intentet tydeliggere.

---

## Deployment Automation

**Score: ✅ Sterk**

Full GitOps-pipeline fra commit til produksjon uten manuelle steg:

```
push → test/build/storybook/e2e → deploy-dev → deploy-prod (main only)
```

`dev/*`-branches deployes kun til dev-miljøet. Docker-image bygges med immutable tags via GAR, og Nais-manifester refererer alltid til konkret image-SHA. Prod-konfigurasjon har 2–4 replicas med auto-scaling.

Liveness- og readiness-probes er konfigurert:
```yaml
liveness:
    path: /arbeid/veiviser/api/health
readiness:
    path: /arbeid/veiviser/api/health
```

**Forbedringspotensial:**
- Ingen dokumentert rollback-prosedyre. Nais støtter `kubectl rollout undo`, men dette er ikke nevnt i README eller AGENTS.md. Bør dokumenteres.
- Produksjon deployes umiddelbart etter dev uten ventetid eller manuell godkjenning. For en borgervendt tjeneste kan et valgfritt «approval gate» eller en kort bake-time i dev vurderes for risikofylte endringer.

---

## Test Automation

**Score: ✅ Sterk**

Tre komplementære testnivåer:

| Nivå | Verktøy | Kjøres i CI |
|---|---|---|
| Enhetstester | Vitest (jsdom) | ✅ |
| Komponenttester | Storybook + Vitest browser | ✅ |
| E2E + tilgjengelighet | Playwright + axe-core | ✅ |

Coverage-terskler er konfigurert og håndhevet:
```
lines: 90%, functions: 90%, branches: 85%, statements: 90%
```

`forbidOnly: !!process.env.CI` i Playwright hindrer at `.only`-tester ved uhell blokkerer CI.

**Forbedringspotensial:**
- Coverage er begrenset til `src/lib/**` — komponenter og app-lag er ikke inkludert. WizardShell, VeiviserPage og ResultStep mangler dekning.
- E2E-testing kjøres kun mot Chromium. For en offentlig tjeneste kan Firefox og WebKit vurderes, særlig for tilgjengelighetsvalidering.
- Ingen visuell regresjonstesting (screenshot-diff). Storybook-addon finnes for dette.

---

## Trunk-Based Development

**Score: ✅ God**

`main` fungerer som trunk. `dev/*`-branches er korte og deployes rett til dev, noe som oppfordrer til hyppige integrasjoner. Commit-historikken viser jevnlige, småe commits med conventional commit-format.

**Forbedringspotensial:**
- Ingen dokumenterte retningslinjer for PR-størrelse. Store PR-er øker risiko og reviewkostnad.
- Ingen feature flags for gradvis utrulling. For en tjeneste i videreutvikling kan dette være nyttig for å skille deploy fra release.

---

## Shifting Left on Security

**Score: ⚠️ God med gap**

Gode tiltak på plass:
- Alle GitHub Actions SHA-pinnet.
- Sikkerhetshoder satt i `next.config.ts` (`X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`).
- Dependabot kjører ukentlig for npm og GitHub Actions, med grupperte oppdateringer og cooldown.
- Biome inkluderer a11y- og sikkerhetslinting.
- Ingen hemmeligheter i kode — alt via GitHub Secrets.
- SBOM-generering og container image-scanning håndteres automatisk av `nais/docker-build-push`-action, som produserer og attesterer SBOM som standard.

**Gap:**
- `knip` kjøres med `--no-exit-code`, så ubrukt kode blokkerer ikke pipeline — kun rapporteres i job summary. Kan vurderes som en myk feil ved gradvis innstramming.
- Ingen CSP-header (`Content-Security-Policy`). Bør vurderes, spesielt med Faro-telemetri-URL-er som ekstern resource.

---

## Continuous Delivery

**Score: ✅ Sterk**

Alle endringer til `main` deployes automatisk til dev og deretter prod uten manuelle steg. Deploy-jobber har eksplisitt `needs`-avhengighet som sikrer at alle tester er grønne før deploy.

Timeout er satt på alle jobber (10–20 min), noe som hindrer hengende pipelines.

Pipelines trigges kun ved push (ikke schedule), noe som gir direkte sammenheng mellom endring og deploy.

---

## Code Maintainability

**Score: ⚠️ God med gap**

Sterk arkitekturell separasjon:
- `src/lib/` — ren TypeScript-logikk uten React
- `src/components/` — rene UI-komponenter (props inn, UI ut)
- `src/app/` — Next.js App Router-sider

Biome håndhever konsekvent kodeformatering og linting. Eksakte avhengighetsversjoner (ingen `^` eller `~`) gir reproduserbare bygg. Husky pre-commit gir tidlig tilbakemelding.

**Gap:**
- Ingen ADR (Architecture Decision Records) for dokumentasjon av arkitektoniske valg.
- `--no-exit-code` på knip betyr at dead code akkumuleres over tid uten blokkering.
- Storybook er delvis — tre komponenter har stories, men WizardShell, VeiviserPage og WizardStateContext mangler.

---

## Observability

**Score: ⚠️ God med gap**

Grafana Faro nylig innført for frontend-telemetri med separate endepunkter for dev og prod. `isolate: true` er satt korrekt på Faro-instansen for å unngå interferens mellom miljøer.

Liveness og readiness probes er konfigurert og skiller mellom «er appen i live» og «er appen klar til å ta trafikk».

**Gap:**
- Ingen eksplisitte SLO-er (Service Level Objectives) eller error budgets definert.
- Ingen alerting-konfigurasjon dokumentert (Prometheus/Alertmanager).
- Faro gir frontend-telemetri, men det er ukjent om det finnes Grafana-dashboards tilknyttet tjenesten.
- Ingen strukturert logging utover det Next.js gir som standard.

---

## Documentation Quality

**Score: ⚠️ God med gap**

README dekker oppsett, utvikling, testing og deploy-strategi. AGENTS.md og `.github/copilot-instructions.md` dokumenterer AI-assistert utviklingsflyt. CODEOWNERS er satt. Storybook fungerer som levende komponentdokumentasjon.

**Gap:**
- Ingen driftsrunbook. Hva gjøres om tjenesten er nede? Hvem varsles? Hvordan rulles tilbake?
- Ingen incident response-dokumentasjon.
- Ingen ADRs — viktige beslutninger (Next.js App Router, Biome over ESLint, ingen backend) er ikke nedtegnet med begrunnelse.
- Storybook er ikke publisert / tilgjengelig for ikke-utviklere (f.eks. designere).

---

## Sammendrag av forbedringsforslag

Prioritert etter estimert verdi vs. innsats:

| Forslag | Verdi | Innsats |
|---|---|---|
| Dokumenter rollback-prosedyre i README | Høy | Lav |
| Legg til CSP-header i `next.config.ts` | Høy | Middels |
| Utvid coverage til komponenter | Middels | Middels |
| Gjør `knip` til en blokkerende feil (fjern `--no-exit-code`) | Middels | Lav |
| Skriv ADR for sentrale arkitektoniske valg | Middels | Middels |
| Del install-steg mellom CI-jobber (speed) | Lav | Middels |
| Legg til SLO-definisjon og alerting | Middels | Høy |
| Legg til stories for WizardShell og VeiviserPage | Lav | Lav |
