# UU-testing av veiviseren

Veiviseren testes automatisk med Vitest, Storybook og Playwright med axe-core. Testene fanger opp regresjoner i utvalgte tilstander. Grønne tester er ikke en bekreftelse på at hele tjenesten oppfyller WCAG 2.1 AA. Du må også teste hele brukerflyten, opplesning og forstørring manuelt.

Dette dokumentet beskriver dagens testdekning. De manuelle sjekklistene beskriver fremgangsmåten, ikke resultatene fra gjennomførte tester.

## Hva testes automatisk?

### Axe-skanning i Playwright

[UU-testene](e2e/accessibility.spec.ts) bruker axe-reglene med taggene `wcag2a`, `wcag2aa` og `wcag21aa`. Testene krever at skanningen ikke rapporterer brudd. Axe kan blant annet oppdage enkelte feil i navn, ARIA-attributter, semantikk og tekstkontrast, men tester ikke alle WCAG-krav.

| Tilstand                           | Bokmål | Nynorsk | Engelsk |
| ---------------------------------- | ------ | ------- | ------- |
| Første spørsmål                    | Ja     | Ja      | Ja      |
| Spørsmål 2 og 3, med hjelpetekst   | Ja     | Nei     | Nei     |
| Spørsmål 6 og 9                    | Ja     | Nei     | Nei     |
| Resultat: arbeidssøker             | Ja     | Nei     | Nei     |
| Resultat: arbeidsrettet oppfølging | Ja     | Nei     | Nei     |

Testene kjører i Chromium med skrivebordsvisning. [UU-konfigurasjonen](playwright.a11y.config.ts) starter appen med `APP_ONLY_E2E=true`, uten Nav-dekoratøren og språkhandleren. Axe skanner bare innholdet i `main`.

Dette betyr at skanningen ikke dekker:

- Spørsmål 4, 5, 7, 8 og 10 som egne skannetilstander.
- Hele flyten og resultatene på nynorsk og engelsk.
- Dokumentnivået, blant annet kontroll av `html lang`.
- Dekoratøren, språkbytte via dekoratøren eller «hopp til hovedinnhold».
- Mobilvisning, reflow eller andre nettlesere.

### Fokus, tastatur og navigasjon

[Playwright-testene for UU](e2e/accessibility.spec.ts) kontrollerer at:

- Den synlige spørsmålsoverskriften får fokus ved overgangen fra spørsmål 1 til 2.
- Det går an å velge «Nei» med mellomrom og gå til spørsmål 2 med Tab og Enter.
- Tab flytter fokus fra et valgt svar til «Neste» på første spørsmål.

Testen med navnet «hele flyten kan gjennomføres med kun tastatur» setter fokus direkte på en radio og stopper på spørsmål 2. Den verifiserer **ikke** en hel tastaturflyt fra sideinnlasting til resultat.

[De funksjonelle Playwright-testene](e2e/veiviser.spec.ts) dekker blant annet begge utfall, tilbake, endret svar, omstart, deaktivert «Neste» uten svar og språkspesifikke overskrifter. De bruker klikk og bekrefter ikke at alle disse handlingene kan gjennomføres med tastatur.

### Komponenttester og Storybook

[Vitest-testene](src/components/veiviser/stories.test.tsx) kontrollerer blant annet:

- At spørsmålet gir radiogruppen et tilgjengelig navn.
- At hjelpeteksten gir radiogruppen en tilgjengelig beskrivelse, og at beskrivelsen mangler når det ikke finnes hjelpetekst.
- Fokus på overskriften ved stegbytte, arbeidssøkerresultat, tilbake og omstart.
- At valg av svar ikke flytter fokus bort fra radioen.
- Visning og gjenoppretting av svar og språktilpasset fremdriftstekst.

Vitest bruker JSDOM. Testene bekrefter DOM-egenskaper og fokus, ikke visuell fokusmarkering eller skjermleserens opplesning.

Storybook kjører i Chromium. [Storybook-oppsettet](.storybook/preview.ts) har `a11y.test: 'error'`, slik at axe-funn i testede stories feiler testkjøringen. Stories dekker ubesvarte og besvarte spørsmål, hjelpetekst, tilbakeknapp og begge resultater. [WizardShell-stories](src/components/veiviser/WizardShell.stories.tsx) kontrollerer også overskriftsfokus gjennom navigasjon, begge utfall og omstart. [ProgressIndicator-stories](src/components/veiviser/ProgressIndicator.stories.tsx) kontrollerer tilgjengelig navn og ARIA-verdier for steg 1, 5 og 9.

Isolerte stories erstatter ikke testing av hele siden med dekoratøren.

### Dekoratør og CI/CD

[Dekoratørens smoke-test](e2e/decorator-smoke.spec.ts) kontrollerer at header og footer vises. Den kontrollerer ikke tilgjengeligheten i dekoratøren eller samspillet med veiviseren.

[CI-workflowen](.github/workflows/deploy.yaml) kjører unit-tester, Storybook og Playwright ved push til `main` og `dev/*`. Feil i disse jobbene stopper deployment. Dekoratørens smoke-test og komponentdekningen er ikke-blokkerende.

Workflowen kjører ikke på vanlige pull requests. En feil kan derfor bli merget til `main` før CI avdekker den, men feilen stopper deployment.

## Kjør automatiserte tester lokalt

Aktiver Node-versjonen fra `.nvmrc` før testkommandoene:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use

pnpm test
pnpm test-storybook
pnpm e2e
pnpm e2e:decorator-smoke
```

`pnpm e2e` kjører først flyttestene med vanlig layout og deretter UU-testene uten dekoratøren. Playwright kan gjenbruke en lokal server. Stopp derfor en eksisterende dev-server før kjøringen, slik at testene starter med riktig miljø. Stopp også en server med `APP_ONLY_E2E=true` før dekoratørens smoke-test.

Playwright skriver HTML-rapport til `playwright-report/`. Åpne rapporten rett etter kjøringen du undersøker. Senere Playwright-kjøringer kan overskrive den.

## Forbered manuell testing

Test hele siden med dekoratøren, helst i dev-miljøet med samme bygg som skal deployes. Lokal testing kan gjøres med:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use
APP_ONLY_E2E=false pnpm dev
```

Åpne `http://localhost:3000/arbeid/veiviser`. Bokmål bruker denne adressen, nynorsk bruker `/arbeid/veiviser/nn`, og engelsk bruker `/arbeid/veiviser/en`.

Bruk konstruerte svar. Ikke legg personopplysninger i skjermbilder, opptak eller feilrapporter. Kontroller at resultatlenkene fører til riktig destinasjon uten å gjennomføre registrering eller sende inn opplysninger.

Bruk disse svarløpene på hvert språk:

| Løp                  | Svar                                     | Forventet resultat              |
| -------------------- | ---------------------------------------- | ------------------------------- |
| Kort arbeidssøkerløp | Ja på spørsmål 1                         | Registrere seg som arbeidssøker |
| Fullt oppfølgingsløp | Nei på spørsmål 1–5, ja på spørsmål 6–10 | Be om arbeidsrettet oppfølging  |

Kjør sjekklistene før release og etter endringer i spørsmål, navigasjon, språk, layout eller dekoratørintegrasjon. Registrer hvert språk og hjelpemiddel som faktisk er testet.

## Manuell sjekkliste

### 1. Tastatur uten skjermleser

Start med en ny sideinnlasting. Legg bort musen og bruk Tab, Shift+Tab, piltaster, mellomrom og Enter.

1. Tab gjennom starten av siden. Aktiver dekoratørens «hopp til hovedinnhold» med Enter. Neste trykk på Tab skal føre deg inn i veiviseren, ikke tilbake gjennom headeren.
2. Gå til radiogruppen. Velg og bytt svar med piltaster og mellomrom. Kontroller at bare ett svar er valgt.
3. Gå til «Neste» med Tab og aktiver med Enter. På senere spørsmål skal du også kunne nå «Tilbake» i en forståelig rekkefølge.
4. Gjennomfør begge svarløpene. Etter hvert stegbytte skal fokus ligge på den synlige spørsmålsoverskriften. På resultatet skal resultatoverskriften få fokus.
5. Tab til resultatlenken. Kontroller at den kan aktiveres med Enter og fører til riktig destinasjon. Gjenta for begge utfall.
6. Gå tilbake fra resultatet, endre svaret og gå videre. Tidligere svar skal være bevart når du går tilbake, og nytt svar skal styre neste steg.
7. Aktiver «Start på nytt». Første spørsmål skal vises uten valgt svar, med fokus på spørsmålsoverskriften.
8. Bruk Shift+Tab for å kontrollere at du også kommer tilbake til tidligere kontroller uten å bli fanget.

- [ ] Begge løpene kan fullføres uten mus eller programmatisk hjelp til å sette fokus.
- [ ] Fokusmarkeringen er synlig på alle kontroller og på overskriften etter navigasjon.
- [ ] Fokus skjules ikke av header, samtykkedialog eller andre elementer.
- [ ] Ingen tastaturfeller eller uforklarlige fokushopp.
- [ ] Det er forståelig at et svar må velges før «Neste» blir tilgjengelig.

### 2. Skjermleser

Test med NVDA og Firefox på Windows og med VoiceOver og Safari på macOS. Noter versjoner og innstillinger. Andre kombinasjoner kan supplere disse.

Med NVDA kan du bruke H for å gå mellom overskrifter og D mellom landemerker i lesemodus. Bruk Tab til kontroller og NVDA+Space for å bytte mellom lese- og fokusmodus ved behov. Med VoiceOver åpner du rotoren med VO+U for å finne overskrifter og landemerker. VO betyr VoiceOver-modifikatortastene, normalt Control+Option. Bruk hjelpemiddelets egne kommandoer for å betjene radiogruppen.

1. Les sidetittel, hovedoverskrift og innledning. Finn hovedinnholdet via landemerker eller hopp-lenken.
2. Gå til radiogruppen. Kontroller at spørsmålet identifiserer gruppen, at «Ja» og «Nei» har navn, og at valgt tilstand formidles.
3. Les hjelpeteksten på alle spørsmål som har slik tekst. Kontroller at den er tilgjengelig i leserekkefølgen og som beskrivelse til radiogruppen. Opplesningen skal gi nok informasjon til at du kan svare.
4. Gjennomfør begge svarløpene. Etter «Neste», «Tilbake» og omstart skal du høre riktig spørsmål, ikke bli stående på en fjernet knapp eller et tomt element.
5. Kontroller fremdriften. Stegnummeret skal kunne leses, og eventuelle automatiske annonseringer skal ikke avbryte eller overdøve spørsmålet.
6. På begge resultater: kontroller at anbefalingen formidles, at forklaringen kan leses, og at resultatlenken er forståelig uten visuell kontekst.

- [ ] Overskrifter og landemerker gir en forståelig struktur.
- [ ] Spørsmål, svar og hjelpetekst kan leses og brukes uten å se skjermen.
- [ ] Fokus og opplesning følger navigasjonen, også ved tilbake og omstart.
- [ ] Resultatet blir formidlet uten forstyrrende eller gjentatt opplesning.

Resultatområdet har `role="status"`, og fremdriftsindikatoren har `aria-live="polite"`. Samspillet mellom live-regionene og overskriftsfokus må vurderes ved faktisk opplesning. DOM-sjekker kan ikke avgjøre om dette gir god tilbakemelding.

### 3. Språk og dekoratør

1. Åpne bokmål, nynorsk og engelsk direkte. Kontroller at veiviserens tekst og dekoratøren bruker valgt språk. Se i nettleserens utviklerverktøy at `html lang` er henholdsvis `nb`, `nn` og `en`.
2. Velg svar og gå til et senere spørsmål. Bytt språk med dekoratørens språkvelger, først med tastatur og deretter med skjermleser.
3. Kontroller at du er på samme spørsmål og kan fortsette. Gå tilbake for å kontrollere at svarene er bevart. Gjenta språkbytte på resultatet.
4. Kontroller at dokumentets språk oppdateres og at skjermleseren bruker riktig uttale. Automatisk språkbytte må være aktivert i skjermleseren for å teste dette.
5. Test eventuell samtykkedialog eller annet overlegg som vises med en ny nettleserprofil. Kontroller tastaturtilgang og at fokus kommer tilbake til et forståelig sted når dialogen lukkes.

- [ ] Språkvelgeren kan brukes med tastatur og skjermleser.
- [ ] Språkbytte bevarer fremdrift og svar ved klientnavigasjon. Full sideinnlasting nullstiller svarene etter dagens løsning.
- [ ] Innhold, dokumentets språk og uttale samsvarer.
- [ ] Hopp-lenken og eventuelle dialoger fungerer sammen med veiviseren.

### 4. Forstørring, reflow og tekstavstand

Gjenta kontrollene for alle spørsmål og begge resultater, på alle tre språk. Ta også med dekoratøren og eventuelle dialoger.

1. Sett nettleserens visningsbredde til 320 CSS-piksler, for eksempel i responsiv modus i utviklerverktøyene. Kontroller hele siden ved å rulle vertikalt.
2. Test nettleserzoom på 400 % med et innholdsvindu som er omtrent 1280 CSS-piksler bredt ved 100 %. Dette gir omtrent 320 CSS-piksler tilgjengelig bredde. Ikke bruk bare en smal viewport som erstatning for zoomtesten.
3. I Firefox: aktiver «Zoom kun tekst» og øk til 200 %. Kontroller at større tekst ikke klippes eller overlapper andre elementer. Tilbakestill innstillingen etterpå.
4. Bruk et verktøy for WCAG-tekstavstand eller midlertidige stilregler i utviklerverktøyene. Sett linjehøyde til minst 1,5 ganger skriftstørrelsen, avstand etter avsnitt til minst 2 ganger skriftstørrelsen, bokstavavstand til 0,12 em og ordavstand til 0,16 em. Ikke endre appens kildekode for denne sjekken.
5. Bruk tastaturet ved forstørring. Kontroller at fokuserte kontroller rulles inn i synsfeltet og ikke skjules.

- [ ] Ingen horisontal rulling er nødvendig for å lese veiviseren eller bruke kontrollene.
- [ ] Spørsmål, hjelpetekst og knappe- og lenketekster er lesbare uten klipping eller overlapping.
- [ ] Ingen informasjon eller handling går tapt ved zoom, tekstforstørring eller økt tekstavstand.
- [ ] Fokus og navigasjon fungerer også i forstørret visning.

### 5. Kontrast og visuell informasjon

Bruk nettleserens kontrastverktøy eller Colour Contrast Analyser til å måle de faktiske fargeparene. Kontroller vanlig tekst, hjelpetekst, resultattekst og kontroller i relevante tilstander.

- [ ] Vanlig tekst har minst 4,5:1 kontrast. Stor tekst har minst 3:1. Stor tekst betyr minst 18 punkter, eller 14 punkter i fet skrift.
- [ ] Visuelle markører som trengs for å identifisere kontroller og valgt tilstand, har minst 3:1 kontrast mot tilstøtende farger der WCAG 1.4.11 gjelder.
- [ ] Fokusmarkeringen er tydelig, og valgt svar kan identifiseres uten å være avhengig av farge alene.
- [ ] Resultatets betydning formidles med tekst, ikke bare grønn bakgrunn eller ikon.

Deaktiverte kontroller har unntak fra kontrastkravene. Kontroller likevel at det er forståelig hvorfor «Neste» ikke kan brukes uten et svar.

## Registrer resultat og avvik

Bruk teamets vanlige feil- eller release-oppfølging. Registrer:

- Dato, tester og commit eller byggversjon.
- Miljø, operativsystem, nettleser og skjermleser med versjoner.
- Språk, svarløp, viewport, zoom og relevante hjelpemiddelinnstillinger.
- Hvilke sjekker som er gjennomført, bestått, feilet eller ikke testet.
- For hvert avvik: steg for å gjenskape det, forventet resultat, faktisk resultat og konsekvens for brukeren. Ta med skjermbilde eller opptak uten personopplysninger når det hjelper.

Ikke marker en sjekk som bestått hvis miljøet eller hjelpemiddelet hindret testing. Registrer den som «ikke testet» med begrunnelse. Avtal hvem som følger opp avvik og manglende testing før release.

## Referanser

- [WCAG 2.1](https://www.w3.org/TR/WCAG21/)
- [Reflow, WCAG 1.4.10](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html)
- [Tekstavstand, WCAG 1.4.12](https://www.w3.org/WAI/WCAG21/Understanding/text-spacing.html)
- [Aksel](https://aksel.nav.no/)
