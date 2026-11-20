# Raff Maff

Matematik för årskurs 4–6 – och hur man lär ut den. En svenskspråkig PWA för en vuxen som utbildar sig till
lärare: användaren lär sig matematiken, övar skriftliga metoder och representationer, och övar på att
**förklara** den för elever. Gjord mobil-först för iPhone.

> **Ärlig status** (läs detta först) finns längst ner under *Vad är klart och vad är det inte*.

## Teknik

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Supabase (Auth + Postgres + RLS) · KaTeX · React Konva ·
OpenAI (endast server-side) · Vercel · PWA (manifest + service worker).

## Kom igång lokalt

Krav: Node ≥ 20.

```bash
npm install
npm run dev
```

Öppna http://localhost:3000. **Utan Supabase-nycklar körs appen i lokalt dev-läge:** ingen inloggning, och framsteg
sparas i `.data/dev-store.json` (aldrig i produktion). Det här läget är till för utveckling och test.

### Konfigurera Supabase (krävs för riktig användning)

1. Skapa ett projekt på supabase.com.
2. SQL-editorn: kör `supabase/migrations/0001_init.sql` (tabeller, index, RLS), därefter `supabase/seed.sql`
   (innehåll: världar, lektioner, uppgiftsmallar, märken). Seed kan återskapas med `npm run db:seed -- --sql`,
   eller köras direkt med `npm run db:seed` när env-variablerna nedan är satta.
3. Authentication → Providers → Email: aktivera. (Stäng av "Confirm email" för enklare test, eller låt den vara på.)
4. Kopiera `.env.example` till `.env.local` och fyll i:

| Variabel | Beskrivning |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API (publik nyckel) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Hemlig, endast server.** Används av API-rutterna för att skriva framsteg. |
| `ASSESSMENT_SECRET` | Lång slumpsträng som signerar provnycklar. **Obligatorisk i produktion.** |
| `OPENAI_API_KEY` | Valfri. Aktiverar AI-handledaren och AI-granskning av lärarförklaringar. |
| `OPENAI_MODEL` | Valfri, standard `gpt-4o-mini`. |

Inga nycklar finns i källkoden. `SUPABASE_SERVICE_ROLE_KEY` och `OPENAI_API_KEY` används bara i server-rutter.

### Driftsättning på Vercel

1. Importera repot i Vercel (framework: Next.js, inga särskilda inställningar).
2. Lägg in miljövariablerna ovan (Project → Settings → Environment Variables).
3. Supabase → Authentication → URL Configuration: lägg till din Vercel-domän som Site URL / Redirect URL.
4. Deploy. Öppna sidan på iPhone i **Safari** → Dela → *Lägg till på hemskärmen*.

## Hur framsteg och upplåsning fungerar (säkerhet)

Mastery får **inte** bero på XP eller på klientens påståenden.

- Lektionens uppgifter genereras av deterministiska generatorer ur ett frö. Servern utfärdar en **signerad
  provnyckel** (HMAC) med användare, lektion, typ och frö. Klienten får bara uppgifterna – **inga svar**.
- Vid inlämning återskapar servern uppgifterna ur fröet, **rättar själv**, kontrollerar att nyckeln är äkta, ny och
  tillhör användaren (replay → 409), och skriver sedan framsteg med service-rollen.
- RLS ger klienten *enbart läsrätt* till sina egna rader; `xp`, `streak` m.m. kan inte ändras av klienten.
- Lektionen är klar först när **alla fyra delar** är godkända: kunskapsprov ≥ 80 %, skriftlig metod ≥ 75 %,
  representation ≥ 75 % och godkänd lärarutmaning. Delarna får klaras vid olika tillfällen.
- **Behärskad** (≠ klar) kräver ≥ 2 godkända kunskapsprov med olika tal, ett aktuellt snitt (senaste tre) ≥ 80 %
  och övning inom 30 dagar. Ett enstaka bra resultat räcker alltså inte.
- Bossutmaning (15 blandade frågor, ≥ 80 %) klarar en värld och låser upp nästa.
- AI kan **inte** låsa upp något. Vid lärarförklaringar kan AI-granskningen bara *underkänna* en förklaring som
  redan klarat kriterierna (t.ex. vid matematiska fel) – aldrig godkänna.

Skriftlig metod bedöms strukturerat: i uppställning bedöms minnessiffror (addition), växlingar (subtraktion) och
delprodukter (multiplikation) **separat** från svaret (1 poäng vardera); i areamodellen bedöms delprodukterna separat
från summan. Frihandsritningen i Räkneyta är ett övningsverktyg och bedöms **inte** automatiskt – representation
bedöms genom strukturerade modelluppgifter (tallinje, basblock, areamodell, del–helhet).

## Repetition

`recommend()` rankar lektioner/färdigheter utifrån (1) tidigare fel (spaced repetition: 1, 3, 7, 14, 30 dagar;
fel → tillbaka till 1 dag), (2) underkända kunskapsprov, (3) svaga färdigheter (> 35 % fel, ≥ 4 försök) och
(4) tid sedan senast (≥ 7 dagar). Ett repetitionspass (6 uppgifter) skapas på servern ur dessa färdigheter.

## Test

```bash
npm test                              # enhetstester: ~190 tester – alla generatorer × 150 frön × 3 nivåer, bedömning, tröskelvärden
npm run dev                           # i en terminal
npx tsx scripts/api-e2e.ts            # mot körande dev-server: upplåsning, replay/förfalskning, XP, hela genomspelet av alla byggda världar
npx tsx scripts/ui-column.ts <mapp>   # styr riktiga UI:t (iPhone-emulering) och löser en uppställningsuppgift
```

Enhetstesterna verifierar bl.a. att varje genererad uppgift är välformad (inga dubbletter i flervalsalternativ,
svar på tallinjens streck, fullt rätt svar ger full poäng) och att rubrikreglerna fungerar (7/10 underkänd, 8/10
godkänd; nyckelordsfyllning underkänns).

Ikoner och splash-bilder genereras med `npm run icons` (Playwright).

## Struktur

```
src/lib/content/      Läroplansinnehåll (världar, lektioner, mallar) – ren TypeScript
src/lib/engine/       Generatorer, bedömning, upplåsning, mastery, repetition, XP, märken
src/lib/server/       Lager för persistens (Supabase + dev-lager), auth, token, AI
src/app/api/          state, theory, practice, assessment/{start,submit}, tutor, config
src/components/       Lektionsspelare, övningar, SVG-bilder, Konva-arbetsyta
supabase/             migration (tabeller, index, RLS) + seed
docs/lgr22-mapping.md Täckning mot Lgr22
public/sw.js          Service worker
```

## Vad är klart och vad är det inte

**Byggt och testat**
- Hela appskalet (Hem, Världskarta, Lärarakademin, Repetition, Profil, Räkneyta, AI-handledare, inloggning).
- **Värld 1 (9 lektioner), Värld 2 (7) och Värld 3 – Multiplikation (6)** med alla 11 lektionssteg, genererade uppgifter,
  fyrdelad slutbedömning, lärarutmaningar med elevfall, och bossutmaningar.
- Server-side rättning, upplåsning, XP/nivåer/streak, 13 märken, mastery, repetition – genomspelade i `api-e2e`.
- Strukturerad uppställning (minnessiffror/växling/delprodukter), areamodell, tallinje, bråkstapel, Konva-rityta.

**Byggt men INTE verifierat i den här miljön** (ingen Supabase/OpenAI/iPhone fanns tillgänglig)
- Supabase-lagret (`supabase-store.ts`), RLS-policyer, login-flödet och proxy-sessionsförnyelsen. Koden typkontrolleras och
  SQL:en är skriven efter tabellernas användning, men den har **inte körts mot en riktig Supabase-instans**.
  Kör migrationen och gör en inloggning + ett prov som första test.
- AI-handledare och AI-granskning (OpenAI-anropen har aldrig körts). Appen degraderar snyggt utan nyckel.
- Service worker/offline och "Lägg till på hemskärmen" – verifierat i headless Chromium (registrering, cachelagrade sidor offline, offline-reservsida) men **inte på en riktig iPhone**.
  Offline fungerar för sidor som besökts tidigare; prov kräver alltid internet.

**Inte byggt**
- **Världarna 4–13** finns på kartan som planerade (🚧) men har **inget innehåll**. De går inte att öppna och ger
  inga framsteg. Se `docs/lgr22-mapping.md` för vad som återstår. Innehållsmodellen är gjord för att fler lektioner
  läggs till som TypeScript-filer i `src/lib/content/` (se `w2/` och `w3/` som mall).
- Frihandsritning bedöms inte automatiskt (se ovan).
- Programmering/algoritmer (står i Lgr22) saknas bland de 13 världarna.
- Lärarförklaringar bedöms med en regelbaserad rubrik (begrepp + minimilängd + skydd mot nyckelordsfyllning) och, med
  OpenAI-nyckel, en AI-granskning som kan underkänna. Rubriken är en approximation och kan missa korrekta men
  annorlunda formuleringar; det är därför "försök igen" alltid finns och exempelsvar visas efter varje försök.
- Innehållet är skrivet av en AI och **bör granskas av en lärarutbildare** innan det används på riktigt.
- Inga tillgänglighetstester med skärmläsare har gjorts; endast aria-etiketter finns.

## Licens

Privat projekt.
