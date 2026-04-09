# paw-ofelas – Copilot Instructions

## What this is

A Next.js wizard ("veiviser") that helps NAV users decide between two outcomes:
1. **Registrere seg som arbeidssøker** (job-seeker registration)
2. **Melde seg til arbeidsrettet oppfølging** (employment follow-up)

Questions are defined in `spørsmål.md`. Full planning details are in `veiviser-planning-prompt.md`.

## Tech stack

- **Next.js** (App Router) + TypeScript
- **NAV Aksel Design System**: `@navikt/ds-react` and `@navikt/ds-css`
- **pnpm** as package manager
- **Storybook** for component documentation and visual testing
- **Jest** for unit/logic tests (TDD approach)
- **Playwright** for flow/integration tests
- No backend — all state is local React (useState/useReducer), no persistence
- Deployed to Nais (dev + prod via `nais.yaml`)

## Commands (once project is scaffolded)

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm test         # Run Jest tests
pnpm test -- --testPathPattern=<file>   # Run a single test file
pnpm storybook    # Start Storybook
pnpm lint         # Lint
```

## Architecture

The wizard has a clean separation between **data/logic** and **UI**:

- Decision tree / question flow lives in `src/lib/` or `src/data/` — pure TypeScript, no React
- UI components live in `src/components/` and receive props only (no internal logic)
- Some questions are **circuit-breakers** — they immediately route to a recommendation
- Default outcome when no circuit-breaker fires: **oppfølging**

## Key conventions

- **No custom UI primitives** — always use Aksel components: `Button`, `RadioGroup`, `Alert`, `Heading`, `BodyLong`, `StepIndicator`, etc.
- **Spacing via Aksel tokens** — use `Box` with `padding="space-*"` props, never Tailwind `p-*`/`m-*`
- **Norwegian number formatting** — use `formatNumber()` from `@/lib/format`, not `toLocaleString()`
- **TDD for logic** — decision tree logic must have Jest tests before implementation
- **Storybook for components** — every component gets a Story; components are pure (props in, UI out)
- **a11y is mandatory** — this is a public sector service; use Aksel components, correct heading hierarchy, keyboard navigation

## Decision tree model

The wizard uses accumulated answers (not just the last answer) to determine outcome. Circuit-breaker questions short-circuit directly to a recommendation. See `spørsmål.md` for the full question list organized by category (Pengestøtte, Forhold til jobb, Kurs/utdanning/tiltak, Hindringer).

## Specialist agents

Custom agents are in `.github/agents/` for domain-specific help:
- `aksel.agent.md` — Aksel Design System, spacing, responsive layout
- `accessibility.agent.md` — WCAG 2.1/2.2, UU testing
- `auth.agent.md` — Azure AD, TokenX, ID-porten
- `nais.agent.md` — Nais deployment, GCP, Kafka

Use these via `@agent-name` in Copilot Chat for specialized guidance.
