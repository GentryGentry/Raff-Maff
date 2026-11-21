# Raff Maff

Matematik för årskurs 4–6 – och hur man lär ut den. En svenskspråkig PWA för en vuxen som utbildar sig till
lärare: användaren lär sig matematiken, övar skriftliga metoder och representationer, och övar på att
**förklara** den för elever. Gjord mobil-först för iPhone.

> **Ärlig status** (läs detta först) finns längst ner under *Vad är klart och vad är det inte*.

## Teknik

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Supabase (Postgres, enbart som databas) · KaTeX · React Konva ·
OpenAI (endast server-side) · Vercel · PWA (manifest + service worker).

## Kom igång lokalt

Krav: Node ≥ 20.

```bash
npm install
npm run dev
```

Öppna http://localhost:3000. **Utan Supabase-nycklar körs appen i lokalt dev-läge:** ingen inloggning, och framsteg
sparas i `~/.raff-maff-dev/dev-store.json` utanför projektmappen (aldrig i produktion; `npm run dev:reset` nollställer). Det här läget är till för utveckling och test.

### Sätt upp för riktig användning (en användare)

Appen är gjord för **en person**. Det finns inga konton: du skriver en **åtkomstkod** en gång på telefonen och den
kommer ihåg dig. Databasen (Supabase) används bara för att spara dina framsteg, och bara servern pratar med den.

1. Skapa ett projekt på supabase.com.
2. I SQL-editorn: kör `supabase/migrations/0001_init.sql`, sedan `supabase/migrations/0002_single_user.sql`, sedan
   `supabase/seed.sql` (innehåll: världar, lektioner, uppgiftsmallar, märken). Seed kan återskapas med
   `npm run db:seed -- --sql`, eller köras direkt med `npm run db:seed` när env-variablerna nedan är satta.
3. Du behöver **inte** aktivera någon inloggning i Supabase.
4. Kopiera `.env.example` till `.env.local` (lokalt) eller lägg in värdena i Vercel (se nedan):

| Variabel | Beskrivning |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | **Hemlig, endast server.** Servern använder den för att läsa/skriva dina framsteg. |
| `APP_PASSCODE` | **Din åtkomstkod** – välj något långt. Utan den vägrar servern i produktion att svara. |
| `ASSESSMENT_SECRET` | Lång slumpsträng som signerar inloggningscookien och provnycklar. **Obligatorisk i produktion.** |
| `APP_USER_NAME` | Valfri. Namnet som visas på startsidan (standard "Läraren"). |
| `OPENAI_API_KEY` | Valfri. Aktiverar AI-handledaren och AI-granskning av lärarförklaringar. |
| `OPENAI_MODEL` | Valfri, standard `gpt-4o-mini`. |

Inga nycklar finns i källkoden. `SUPABASE_SERVICE_ROLE_KEY`, `APP_PASSCODE` och `OPENAI_API_KEY` används bara i server-rutter.

### Driftsättning på Vercel

1. Importera repot i Vercel (framework: Next.js, inga särskilda inställningar).
2. Lägg in de fyra obligatoriska miljövariablerna ovan (Project → Settings → Environment Variables) och deploya.
3. Öppna adressen på iPhone i **Safari**, skriv din åtkomstkod, och välj Dela → *Lägg till på hemskärmen*.

**Åtkomstkoden är det enda som hindrar andra från att ändra dina framsteg och använda din OpenAI-nyckel.** Den lagras
som en signerad, HttpOnly-cookie (400 dagar) och kontrolleras både för sidor och för alla API-anrop. Fel kod fördröjs
~1 sekund. Menyn Profil → "Lås appen" loggar ut.

## Hur framsteg och upplåsning fungerar (säkerhet)

Mastery får **inte** bero på XP eller på klientens påståenden.

- Lektionens uppgifter genereras av deterministiska generatorer ur ett frö. Servern utfärdar en **signerad
  provnyckel** (HMAC) med användare, lektion, typ och frö. Klienten får bara uppgifterna – **inga svar**.
- Vid inlämning återskapar servern uppgifterna ur fröet, **rättar själv**, kontrollerar att nyckeln är äkta, ny och
  tillhör användaren (replay → 409), och skriver sedan framsteg med service-rollen.
- Webbläsaren har **ingen** direktåtkomst till databasen: RLS är på utan policys (nekar anon/authenticated allt) och bara servern (service-rollen) skriver framstegen. `xp`, `streak` m.m. kan alltså inte ändras från klienten.
- Lektionen är klar först när **alla fyra delar** är godkända: kunskapsprov ≥ 80 %, skriftlig metod ≥ 75 %,
  representation ≥ 75 % och godkänd lärarutmaning. Delarna får klaras vid olika tillfällen.
- **Behärskad** (≠ klar) kräver ≥ 2 godkända kunskapsprov med olika tal, ett aktuellt snitt (senaste tre) ≥ 80 %
  och övning inom 30 dagar. Ett enstaka bra resultat räcker alltså inte.
- Bossutmaning (15 blandade frågor, ≥ 80 %) klarar en värld och låser upp nästa.
- AI kan **inte** låsa upp något. Vid lärarförklaringar kan AI-granskningen bara *underkänna* en förklaring som
  redan klarat kriterierna (t.ex. vid matematiska fel) – aldrig godkänna.

Skriftlig metod bedöms strukturerat: i uppställning bedöms minnessiffror (addition), växlingar (subtraktion) och
delprodukter (multiplikation) samt kvotsiffra/produkt/rest i varje steg av liggande stolen (division) **separat**; uppställning med decimaltal har fast decimalkomma och samma bedömning av minnessiffror/växlingar från svaret (1 poäng vardera); i areamodellen bedöms delprodukterna separat
från summan. Frihandsritningen i Räkneyta är ett övningsverktyg och bedöms **inte** automatiskt – representation
bedöms genom strukturerade modelluppgifter (tallinje, basblock, areamodell, del–helhet).

## Repetition

`recommend()` rankar lektioner/färdigheter utifrån (1) tidigare fel (spaced repetition: 1, 3, 7, 14, 30 dagar;
fel → tillbaka till 1 dag), (2) underkända kunskapsprov, (3) svaga färdigheter (> 35 % fel, ≥ 4 försök) och
(4) tid sedan senast (≥ 7 dagar). Ett repetitionspass (6 uppgifter) skapas på servern ur dessa färdigheter.

## Test

```bash
npm test                              # enhetstester: ~1100 tester – alla generatorer × 150 frön × 3 nivåer, bedömning, tröskelvärden
npm run dev                           # i en terminal
npx tsx scripts/api-e2e.ts            # mot körande dev-server: upplåsning, replay/förfalskning, XP, hela genomspelet av alla byggda världar
npx tsx scripts/ui-column.ts <mapp>   # styr riktiga UI:t (iPhone-emulering) och löser en uppställningsuppgift
npx tsx scripts/ui-solve.ts w5-l1,w5-l2   # genomför kunskaps-/metod-/representationsprov via riktiga UI:t för ALLA uppgiftstyper
```

Procent-, negativa-tal- och algebrauppgifterna (ekvationer löses med brute-force via en separat parser) (och ett urval i Värld 6) kontrolleras dessutom **oberoende**: testet läser den färdiga uppgiftstexten, räknar om svaret med egen formel och jämför med facit (32 uppgiftstyper × 300–500 slumpningar). Testerna kontrollerar också att svar kan skrivas på olika sätt: "35 %", "−3" med minustecken, tankstreck eller bindestreck, komma eller punkt. Enhetstesterna verifierar bl.a. att varje genererad uppgift är välformad (inga dubbletter i flervalsalternativ,
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
- **Värld 1 (9 lektioner), Värld 2 (7) och Värld 3 – Multiplikation (6) och Värld 4 – Division (7) och Värld 5 – Bråk (7) och Värld 6 – Decimaltal (8) och Värld 7 – Procent (10) och Värld 8 – Negativa tal (6) och Värld 9 – Algebra och mönster (9) och Värld 10 – Geometri (9) och Värld 11 – Enheter och mätning (8) och Värld 12 – Statistik och sannolikhet (7) och Värld 13 – Problemlösning och matematiska resonemang (7)** med alla 11 lektionssteg, genererade uppgifter,
  fyrdelad slutbedömning, lärarutmaningar med elevfall, och bossutmaningar.
- Server-side rättning, upplåsning, XP/nivåer/streak, 13 märken, mastery, repetition – genomspelade i `api-e2e`.
- Strukturerad uppställning (minnessiffror/växling/delprodukter), areamodell, tallinje, bråkstapel, Konva-rityta.

**Byggt men INTE verifierat i den här miljön** (ingen Supabase/OpenAI/iPhone fanns tillgänglig)
- Supabase-lagret (`supabase-store.ts`) och SQL-migrationerna. Koden typkontrolleras och SQL:en är skriven efter
  tabellernas användning, men den har **inte körts mot en riktig Supabase-instans**. Kör migrationerna och gör ett prov,
  stäng appen och öppna den igen för att se att framstegen sparats. (Åtkomstkoden/cookien är däremot testad mot en körande
  server, även i produktionsläge – se `tests/session.test.ts`.)
- AI-handledare och AI-granskning (OpenAI-anropen har aldrig körts). Appen degraderar snyggt utan nyckel.
- Service worker/offline och "Lägg till på hemskärmen" – verifierat i headless Chromium (registrering, cachelagrade sidor offline, offline-reservsida) men **inte på en riktig iPhone**.
  Offline fungerar för sidor som besökts tidigare; prov kräver alltid internet.

**Inte byggt**
- Alla 13 världar har nu innehåll. Innehållsmodellen är gjord för att fler lektioner läggs till som TypeScript-filer i `src/lib/content/` (se `w2/`–`w13/` som mall).
- Värld 13: textproblem löses om från sin egen text med uttömmande sökning i `tests/problem.test.ts` (summa/produkt, hönor och kor, åldrar, baklänges-kedjor, påståenden och motexempel).
- Frihandsritning bedöms inte automatiskt (se ovan). Algebrauttryck ("3n+2") bedöms av en egen säker parser (ingen `eval`): olika skrivsätt godkänns, och "förenkla"-uppgifter kräver förenklad form.
- Geometribilder (månghörningar, vinklar med gradskiva, rätblock, kroppar, koordinatsystem) är ritade i SVG och kontrolleras av `tests/geometry.test.ts`, som räknar om svaren ur bildernas egna koordinater (areor, avstånd, vinklar, spegling). Uppgifterna med "tryck i koordinatsystemet" rättas exakt (rätt punkt eller inte). Bilder av kroppar (prisma, pyramid, kon, cylinder) är schematiska teckningar och inte skalenliga.
- Värld 11: alla enhetsomvandlingar bygger på heltalsaritmetik (inga flyttalsfel) och kontrolleras av `tests/units.test.ts` mot en separat enhetstabell. Linjalen och den analoga klockan är SVG-bilder; hastighet (km/h) ingår bara som enkel proportionalitet.
- Värld 12: statistik och sannolikhet kontrolleras av `tests/stats.test.ts`, som räknar om medelvärde, median, typvärde, sannolikheter och kombinatorik ur prompttext och diagramdata (kombinatorik med brute-force-uppräkning). Uppgifter där man ritar staplar själv rättas stapel för stapel. Sannolikheter anges som bråk eller procent (decimalform godkänns inte i bråkuppgifterna).
- Programmering/algoritmer (står i Lgr22) saknas bland de 13 världarna.
- Lärarförklaringar bedöms med en regelbaserad rubrik (begrepp + minimilängd + skydd mot nyckelordsfyllning) och, med
  OpenAI-nyckel, en AI-granskning som kan underkänna. Rubriken är en approximation och kan missa korrekta men
  annorlunda formuleringar; det är därför "försök igen" alltid finns och exempelsvar visas efter varje försök.
- Innehållet är skrivet av en AI och **bör granskas av en lärarutbildare** innan det används på riktigt.
- Inga tillgänglighetstester med skärmläsare har gjorts; endast aria-etiketter finns.

## Licens

Privat projekt.
