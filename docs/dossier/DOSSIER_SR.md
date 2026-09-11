## Kontrola dokumenta

| Polje | Vrednost |
|---|---|
| Naslov | Tehnički dosije, FishyFinds (ISA) |
| Verzija dosijea | 1.0.0 |
| Softver | FishyFinds / artefakt `com.fishyfinds:isa` `0.0.1-SNAPSHOT` |
| Predmet | Internet softverske arhitekture (ISA), FTN UNS, 2021/22 |
| Sastavljeno | 9. septembra 2026. |
| Autori | Natalija Simin (gost / klijent), Laslo Uri (vlasnik bungalova / broda), David Jandrić (instruktor / admin) |
| Institucija | Fakultet tehničkih nauka, Univerzitet u Novom Sadu, Računarstvo i automatika |
| Provera | `scripts/full-smoke.ps1` **66/66 PASS**; Maven servisni testovi zeleni (JDK 17) |
| Lokalni ulaz | `http://localhost:8080` |

## 1. Cilj predmeta

**Internet softverske arhitekture (ISA)** je predmet na FTN-u gde tim od tri studenta projektuje i isporučuje višekorisnički veb sistem sa pravom perzistencijom, autentifikacijom i ocenjivanim nefunkcionalnim temama (konkurentnost, DevOps, skalabilnost). Za odbranu se očekuje:

- zajednički proizvod sa **podelom uloga** (svaki student brani svoju personu),
- REST + SPA (ili ekvivalent) nad relacionom bazom,
- dokumentovano ponašanje pri konkurentnom pristupu,
- automatski testovi i CI,
- kratka argumentacija skalabilnosti uz bar jedan konkretan mehanizam u kodu.

Ovaj dosije je arhivski zapis te odbrane: čemu sistem služi, kako je složen, šta pokriva svaki opseg ocena i kako je izgledao živi UI u septembru 2026.

## 2. Cilj projekta

**FishyFinds** je marketplace za ribolovni turizam. Gosti pregledaju obalske bungalove, brodove i kurseve sa instruktorom. Registrovani klijenti rezervišu i otkazuju termine. Oglašivači (vlasnici bungalova, vlasnici brodova, instruktori) objavljuju ponude, uređuju dostupnost, pokreću popustne „brze akcije“, rezervišu za klijenta na licu mesta i čitaju grafikone zauzetosti / prihoda. Administratori moderiraju registracije, recenzije, žalbe, zahteve za brisanje naloga, penale zbog nedolaska, loyalty lestvicu, direktorijum korisnika/ponuda i sistemski udeo prihoda.

Proizvod je namerno jedan Spring Boot proces koji služi Vue 2 SPA iz `static/`, uz PostgreSQL. To je kursni sistem, ne produkcioni SaaS: SMTP može biti isključen, lozinke su demo, šema se na svakom startu gradi iz seed-a (`create-drop` + `data-postgres.sql`).

## 3. Identifikacija

| Stavka | Detalj |
|---|---|
| Prikazni naziv | **FISHYFINDS** (crveni znak ribe, crni wordmark) |
| Engleski naziv | FishyFinds — coastal stays & fishing days |
| Srpski naziv | FishyFinds — obalski smeštaj i ribolovni dani |
| Vrsta | Višekorisnička veb aplikacija (SPA + REST) |
| Backend | Java 11 target, Spring Boot **2.5.7**, radi na JDK 17+ |
| Frontend | Vue 2 (CDN), Vue Router history, Axios, SweetAlert2 |
| Mape / grafikoni | OpenLayers 6, Chart.js |
| Persistencija | Spring Data JPA, Hibernate, PostgreSQL baza `fishyfinds_db` |
| Auth | Spring Security + JWT (`TokenUtils`), uloge preko `@PreAuthorize` |
| Mejl | Spring Mail (verifikacija, rezervacije, admin odluke; greške nisu fatalne) |
| Build | Maven Wrapper; GitHub Actions; SonarCloud |
| Testovi | JUnit 5 + Mockito; PowerShell živi smoke (`scripts/full-smoke.ps1`) |
| Jezik UI | Engleski chrome (kursni SPA) |
| Jezici dokumentacije | Srpski latinica (ovaj fajl) · English ([DOSSIER_EN.md](DOSSIER_EN.md)) |

| Autor | Uloge na predmetu | Glavne površine |
|---|---|---|
| Natalija Simin | Gost, klijent | Katalozi, registracija/aktivacija, pretraga i rezervacija, otkazivanje (≥3 dana), istorija, feedback, praćenje, žalbe, penali, profil |
| Laslo Uri | Vlasnik bungalova, vlasnik broda | CRUD ponuda, termini, brze akcije, rezervacija za klijenta, mape, kalendar nedostupnosti, `/owner-reports` |
| David Jandrić | Instruktor, admin | Kursevi, izveštaji o posetama, loyalty, admin redovi (registracije, recenzije, žalbe, brisanja, penali, direktorijum, prihod) |

Seed lozinka za sve demo naloge: **`password`**.

| Email | Uloga |
|---|---|
| `mail@mail.com` | Klijent |
| `zokaMagic@mail.com` | Vlasnik bungalova |
| `zokiSumi@mail.com` | Vlasnik broda |
| `vesnaVuki@mail.com` | Instruktor |
| `admin@admin.com` | Admin |
| `pending.owner@mail.com` | Registracija na čekanju |

## 4. Obuhvat

U obuhvatu: pregled tri tipa ponuda; JWT prijava; rezervacija/otkazivanje klijenta; životni ciklus ponude vlasnika/instruktora (kreiranje, izmena blokirana dok ima rezervacija, meko brisanje, termini, brze akcije, rezervacija za klijenta); OpenLayers mape; kalendar zauzetosti / nedostupnosti; Chart.js izveštaji; loyalty; kompletan admin hub; dokumenti konkurentnog pristupa; servisni testovi; keš kataloga za PoC skalabilnosti.

Van obuhvata / poštene granice: produkciono ojačavanje SMTP-a, multi-tenant hosting, savršeno snimanje svakog ugnježđenog admin modala i potpuni ručni prolaz kroz svaki SweetAlert. Živi smoke pokriva **66** API/UI kritičnih provera po ulogama — to je prag verifikacije za ovaj dosije.

## 5. Tehnološki stek (sa objašnjenjem)

| Sloj | Izbor | Zašto je ovde |
|---|---|---|
| Spring Boot 2.5.7 | Kontejner aplikacije | Stek iz vremena predmeta: ugrađeni Tomcat, auto-config za Web, Security, JPA, Mail |
| Spring Web / Data REST | HTTP površina | Kontroleri u `controllers/` izlažu `/api/**`; SPA je statički |
| Spring Security + JWT | AuthN/Z | Bezstanјski API: login vraća token; filter čita `Authorization`; method security po ulozi |
| Spring Data JPA / Hibernate | ORM | Mapira hijerarhiju `User` i podtipove `Offer` na PostgreSQL; `@Version` za optimističko zaključavanje |
| PostgreSQL | RDBMS | Relacioni integritet rezervacija nad terminima; seed preko `data-postgres.sql` |
| Spring Mail | Obaveštenja | Aktivacija, rezervacija, mejl pretplatnicima; umotan tako da nestali SMTP ne ruši rezervaciju |
| Vue 2 CDN SPA | UI | Brza isporuka bez Node build pipeline-a; komponente u `static/` |
| Vue Router (history) | Klijentske rute | Lepši URL-ovi; `SpaForwardController` prosleđuje nepoznate GET-ove na `index.html` |
| Axios | HTTP klijent | Kači JWT; govori sa `/api` |
| OpenLayers 6 | Mape (ocena 7) | Mape na detalju ponude iz koordinata `Location` |
| Chart.js | Analitika (ocena 7) | Grafikoni vlasnika; admin finansije |
| Spring Cache `@Cacheable` | PoC skalabilnosti (ocena 10) | Catalog `findAll` za bungalove / brodove / kurseve |
| Maven + GHA + Sonar | DevOps (ocena 9) | Build, test, statička analiza |

**Raspored izvornog koda**

```text
src/main/java/com/fishyfinds/isa/
  controllers/     REST (ponude, korisnici, termini, admin, analitika…)
  service/         Poslovna pravila (rezervacija, mejl, loyalty…)
  model/           JPA entiteti + enumi
  repository/      Spring Data interfejsi
  security/        JWT filter, TokenUtils
  config/          Security, keš, SPA forward
src/main/resources/static/          Vue SPA
src/main/resources/data-postgres.sql
docs/concurrent-access/             Ocena 8
docs/scalability/SCALABILITY_POC.md Ocena 10
scripts/full-smoke.ps1              Živa verifikacija
```

## 6. Arhitektura sistema

![Arhitektura](../assets/diagrams/architecture.svg)

*Slika 1. Pregledač Vue SPA → Spring Boot (:8080) → kontroleri/servisi → JPA → PostgreSQL. JWT je u `localStorage` i zaglavlju `Authorization`. Čitanja kataloga mogu ići preko Spring Cache.*

![Slučajevi upotrebe](../assets/diagrams/use-case.svg)

*Slika 2. Podela uloga po trima studentima ISA, plus zajedničke teme ocena 7–10.*

![Tok rezervacije](../assets/diagrams/reservation-flow.svg)

*Slika 3. Put rezervacije (klijent ili vlasnik-za-klijenta): kontroler → provere u servisu → optimistički/pesimistički lock → commit → mejl po najboljoj mogućnosti.*

U runtime-u je **jedan JVM**. Nema posebnog Node servera. Statički sadržaj i REST dele origin `localhost:8080`, što pojednostavljuje CORS za kursni demo.

## 7. Domenski model (detalj aplikacije)

**Korisnici.** `User` implementira `UserDetails`. Podtipovi: `Customer`, `BungalowOwner`, `BoatOwner`, `Instructor`, `Admin`, uz `Authority` / status registracije. Oglašivači čekaju admin odobrenje; klijenti se aktiviraju mejl tokenom kada SMTP radi.

**Ponude.** Apstraktni `Offer` sa `Location`, `ImageItem`, `AdditionalService`, `Price`. Konkretni tipovi: `Bungalow`, `Boat` (sa `Engine`), `Course` (veza na instruktora). Meko brisanje i zabrana izmene dok postoje aktivne rezervacije štite inventar.

**Zakazivanje.** `Term` je rezervabilni prozor na ponudi (`@Version`). `Reservation` vezuje klijenta (ili `null` za `ReservationType.QUICK`) za termin. `CancelledReservation` beleži otkazivanja. `OfferUnavailability` blokira opsege na kalendaru (ocena 7).

**Moderacija i loyalty.** `Complaint`, `UserFeedback`, `AccountDeletionRequest`, `Penal`, `LoyaltyProgram`, loyalty redovi po ulozi, `VisitReport`, `Subscriber` (praćenje → mejl na brzu akciju).

**Ključna pravila u servisima**

- Otkazivanje samo ako rezervacija počinje za **≥ 3 dana**.
- `createQuickAction` pravi brzu rezervaciju i šalje mejl pretplatnicima.
- `updateBungalow|Boat|Course/{id}` odbijen dok postoje aktivne rezervacije.
- `getTermsByOfferId` vraća termine čiji je `endTime` još u budućnosti (seed prozori pomereni na **2027**).
- Nedostajući `Penal` red za klijenta se automatski kreira.
- Duplikat `DELETE /api/deleteUser/{id}` uklonjen; brisanje ostaje na `AdminDirectoryController`.

## 8. Funkcionalna specifikacija po ulozi

**Gost.** Hero početna; pregled bungalova / brodova / kurseva; detalj (opis, cena, ocena, mapa); registracija; prijava.

**Klijent.** Pretraga/sortiranje; rezervacija slobodnog termina; predstojeće / istorija; otkazivanje uz pravilo 3 dana; feedback; praćenje akcija; žalbe; penali; profil.

**Vlasnik bungalova / broda.** Moje liste sa Details / Terms / Edit / Actions / Book for client / Delete; dodavanje termina; brze akcije; nedostupnost na kalendaru; `/owner-reports`; visit report gde postoji.

**Instruktor.** Isti obrazac na kursevima (`/my-courses`).

**Admin.** Tile dashboard: registracije, žalbe, recenzije, brisanja, penali, direktorijum, registracija admina, loyalty, prihod / sistemski udeo.

## 9. Lestvica ocena (ISA 6 → 10)

| Ocena | Očekivanje | Šta je u ovom stablu |
|---|---|---|
| **6** | Jezgro marketplace-a | Terms UI za sve tipove; `POST /api/createQuickAction` + mejl; `PUT` update; book-for-client; soft-delete |
| **7** | Mape, grafikoni, kalendar, loyalty | OpenLayers; Chart.js; `OfferUnavailability`; `/admin-loyalty` |
| **8** | Konkurentni pristup | PDF-ovi u `docs/concurrent-access/`; `@Version` + lock-ovi |
| **9** | DevOps + testovi | GitHub Actions, SonarCloud; Mockito testovi |
| **10** | Skalabilnost | `SCALABILITY_POC.md`; `@Cacheable` na catalog `findAll` |

## 10. Korisnički interfejs (živi snimci)

Snimci sa lokalne aplikacije 9. septembra 2026. Fajlovi: [`../screenshots/`](../screenshots/).

### 10.1 Gost i klijent

![Početna gosta](../screenshots/01-guest-home.png)

*Slika 4. Početna gosta — hero luke, brend **FISHYFINDS**, CTA za bungalove / brodove / kurseve, REGISTER i SIGN IN.*

![Katalog bungalova](../screenshots/02-bungalows.png)

*Slika 5. Javni katalog bungalova — kartice sa fotografijom, cenom, ocenom, lokacijom.*

![Prijava](../screenshots/03-sign-in.png)

*Slika 6. Prijava — JWT login; demo lozinka `password`.*

![Katalog brodova](../screenshots/13-boats-catalog.png)

*Slika 7. Katalog brodova — isti obrazac kartica.*

![Katalog kurseva](../screenshots/14-courses-catalog.png)

*Slika 8. Katalog kurseva — kursevi sa instruktorom.*

![Rezervacija](../screenshots/04-make-reservation.png)

*Slika 9. UI rezervacije — izbor slobodnog termina i potvrda.*

![Predstojeće rezervacije](../screenshots/05-upcoming.png)

*Slika 10. Predstojeće rezervacije klijenta — otkazivanje uz pravilo ≥3 dana.*

### 10.2 Vlasnici i instruktor

![Moji bungalovi](../screenshots/06-owner-bungalows.png)

*Slika 11. Moji bungalovi — pretraga, ADD BUNGALOW, i dugmad Details / Terms / Edit / Actions / Book for client / Delete.*

![Moji brodovi](../screenshots/15-my-boats.png)

*Slika 12. Moji brodovi — paritet sa upravljanjem bungalovima.*

![Moji kursevi](../screenshots/16-my-courses.png)

*Slika 13. Moji kursevi (instruktor) — CRUD i isti alati termina/akcija.*

![Kalendar vlasnika](../screenshots/07-owner-calendar.png)

*Slika 14. Kalendar vlasnika — zauzetost i blokade `OfferUnavailability`.*

![Izveštaji vlasnika](../screenshots/08-owner-reports.png)

*Slika 15. Izveštaji vlasnika — Chart.js poslovni grafikoni.*

### 10.3 Admin

![Admin početna](../screenshots/09-admin-home.png)

*Slika 16. Admin dashboard — tile hub za sve redove moderacije i finansije.*

![Admin registracije](../screenshots/10-admin-registrations.png)

*Slika 17. Red registracija — odobri ili odbij oglašivača.*

![Admin žalbe](../screenshots/11-admin-complaints.png)

*Slika 18. Red žalbi — rešavanje uz mogući mejl odluke.*

![Admin prihod](../screenshots/12-admin-income.png)

*Slika 19. Prihod / sistemski udeo.*

![Admin loyalty](../screenshots/17-admin-loyalty.png)

*Slika 20. Loyalty program — kategorije i stope (ocena 7).*

## 11. Bezbednost, mejl i podaci

- Lozinke sa heširanjem Spring Security; autorizacija JWT + provera uloga.
- Registracija oglašivača ostaje `PENDING` do admin odobrenja.
- Mejl je **best-effort**: uspeh rezervacije ne zavisi od SMTP-a.
- Demo šema: `create-drop` + `data-postgres.sql`. Termini u seed-u su u **2027**. `setval` na sekvencama sprečava sudar PK za loyalty/penal.

## 12. Konkurentnost, testovi i skalabilnost

**Konkurentnost (ocena 8).** Optimistički `@Version` na `Term` / `Reservation`; pesimistički lock na klijenta gde treba. Opisi: `docs/concurrent-access/`.

**Testovi (ocena 9).** Mockito pokriće servisa; `./mvnw test` na JDK 17 zelen. Živa regresija: `scripts/full-smoke.ps1` (66 provera).

**Skalabilnost (ocena 10).** Pisani PoC (particije, replike, LB, keš). U kodu: `@Cacheable` na catalog `findAll`.

## 13. Build i pokretanje (provera 2026)

```text
# PostgreSQL: baza fishyfinds_db (podrazumevano root/root;
# override DB_USERNAME / DB_PASSWORD — ne commit-ovati tajne)

./mvnw spring-boot:run
# otvoriti http://localhost:8080

./mvnw test
powershell -File scripts/full-smoke.ps1
powershell -File scripts/capture-screenshots.ps1
```

Preporučen JDK **17+**. Aplikacija služi SPA i API na portu **8080**.

## 14. Rezime

FishyFinds je arhiva ISA tima 2021/22: Spring Boot + Vue 2 + PostgreSQL marketplace za bungalove, brodove i ribolovne kurseve, sa jasnom podelom uloga na tri studenta, JWT bezbednošću, admin moderacijom, mapama/grafikonima/kalendarom/loyalty-jem, dokumentacijom konkurentnog pristupa, automatskim testovima/CI i beleškom o skalabilnosti uz keš kataloga. Provereno lokalno 9. septembra 2026. sa **66/66** smoke proverama i zelenim Maven testovima. Ovaj dosije ima englesko i srpsko (latinica) izdanje za usmenu odbranu i kasnije obnove arhive.

## 15. Povezani dokumenti

| Dokument | Putanja |
|---|---|
| Engleski dosije | [DOSSIER_EN.md](DOSSIER_EN.md) |
| Interaktivni HTML | [dossier.html](dossier.html) |
| Konkurentni pristup | `../concurrent-access/` |
| PoC skalabilnosti | `../scalability/SCALABILITY_POC.md` |
| Snimci ekrana | `../screenshots/` |
| Dijagrami | `../assets/diagrams/` |

*FishyFinds ISA tehnički dosije — srpsko izdanje.*
