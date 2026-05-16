# Recherche: Die perfekte Dart-Punkte-Zähl App

**Erstellt am:** 15. Mai 2026
**Zielgruppe der App:** Hobby- und Freizeitspieler (primär), mit Wachstumspotenzial Richtung Vereinsspieler
**Abgedeckte Varianten:** Steeldart und E-Dart/Softdart
**Recherchetiefe:** Features + Tech-Stack + Machbarkeit + Wettbewerb

---

## 1. Executive Summary (Kurzfassung)

Der Markt für Dart-Apps ist gut gefüllt, aber stark fragmentiert: Die meisten Apps können entweder gut zählen ODER haben schöne Statistiken ODER bieten Online-Multiplayer – selten alles in einem. Die größten Player (Russ Bray Pro, DartConnect, DartCounter, Score Darts, King of Darts) decken jeweils Teilbereiche sehr gut ab, lassen aber Lücken offen.

Die größte technische Innovation der letzten Jahre ist die **automatische Wurferkennung per Kamera** – kommerziell durch Scolia und Autodarts, akademisch durch das DeepDarts-Modell. Smartphone-basierte Lösungen erreichen mit einer Kamera bereits 94,7 % Erkennungsgenauigkeit (Quelle: DeepDarts Paper, 2021), aktuelle Vision-Systeme schaffen über 99 % – das eröffnet die Tür für eine App, die ohne teures Zusatz-Hardware-Kit auskommt.

**Kernerkenntnis:** Eine "perfekte" Hobby-App muss vor allem **schnell, intuitiv und schön** sein. Differenzierung gelingt heute primär durch (a) smarte Eingabemethoden (Sprache + Kamera), (b) starke Social-/Coaching-Features und (c) hohe Designqualität.

---

## 2. Was ist ein Hobby-Spieler überhaupt?

Bevor wir Features definieren, ein kurzer Reality-Check: Hobby-Spieler sind nicht der ambitionierte Liga-Spieler, der jede Statistik sehen will. Hobby-Spieler wollen meist:

- mit Freunden eine Runde 501 oder Cricket zählen, ohne im Kopf zu rechnen
- gelegentlich allein üben, ohne dass es sich wie Arbeit anfühlt
- Spaß-Modi für eine WG-Party oder den Kneipenabend
- nicht 20 Einstellungen vornehmen, bevor das erste Spiel startet
- die App nach 3 Wochen Pause sofort wieder verstehen

Das heißt: Die App muss in **unter 10 Sekunden vom Öffnen zum ersten Wurf** kommen. Alles, was diesem Ziel im Weg steht, ist falsch priorisiert.

---

## 3. Wettbewerbsanalyse – Was machen die anderen?

### 3.1 Russ Bray Darts Scorer Pro
Bekannt für die ikonische Stimme von PDC-Schiedsrichter Russ Bray. Die App bietet Karrieremodus, Online-Spiel, Trainingsraum, Turniere und Multiplayer für bis zu 30 Spieler. Sprachsteuerung ist integriert, eine KI mit 20 Schwierigkeitsgraden simuliert Gegner, und ein Performance-Center bietet Charts wie die "3 Dart Average Frequency". Bewertung: 4,8/5 bei 500.000+ Downloads. Preis: Einmalkauf, keine Abos.

**Stärken:** Authentisches Erlebnis, viele Modi, kein Abo.
**Schwächen:** Eher altmodisches UI, Auto-Rotate-Probleme, gelegentliche Bugs beim Score-Undo.

### 3.2 DartConnect
Offizielle Scoring-App der PDC und Partner der WDF – das gewichtigste Renommee am Markt. Web- und Mobile-Plattform, mit Practice-Modi, "Virtual Matches" gegen Spieler weltweit, automatisierten Turnier-Brackets und Live-Übertragungsfunktionen. Preis: Premium ca. 24 USD/Jahr, ein kostenloser Gastzugang mit eingeschränkten Funktionen ist verfügbar.

**Stärken:** Liga- und Turnier-Features, tiefe Statistiken (DCA-Rating), starke Web-Integration.
**Schwächen:** Komplexes UI, deutlich Liga-fokussiert – für Hobby-Spieler Overkill.

### 3.3 DartCounter (Target)
Beworben als "weltweit größte Dart-Scorer-App". Unterstützt X01, Cricket, Around the Clock und mehrere Trainingsspiele. Voice-Calling von "MasterCaller" Ray Martin. Kompatibel mit dem **Target Omni Auto-Scoring System** – einem Kamera-basierten Zusatzgerät, das die App mit echten Würfen verbindet.

**Stärken:** Reichweite, gutes Sound-Erlebnis, optionale Hardware-Integration.
**Schwächen:** Kein nativer Online-Multiplayer auf gleichem Level wie DartConnect.

### 3.4 Score Darts
Modernes UI, zwei Scoring-Modi (Gesamtscore oder Einzelwurf), wechselbar mitten im Spiel. Bietet "SmartBot" als KI-Gegner, der die eigene Performance analysiert.

**Stärken:** UX-Design, KI-Gegner, schöne Statistik-Visualisierung.
**Schwächen:** Kleinere Community als DartConnect.

### 3.5 King of Darts
Plattformübergreifend (Android, Web, läuft auf iOS, Desktop, Tablet ohne Extra-Software). Trackt Averages, Checkouts und Performance über Zeit, speichert Matches automatisch.

**Stärken:** Geräteübergreifend, Web-First-Ansatz, niedrige Einstiegshürde.
**Schwächen:** Weniger Tiefe bei Trainingsfunktionen.

### 3.6 DartVision
Spezialisiert auf **Heatmap-Visualisierung** – zeigt grafisch, wo die Würfe einschlagen, vergleichbar Woche zu Woche, Monat zu Monat.

**Stärken:** Sehr starke visuelle Auswertung.
**Schwächen:** Schmaleres Feature-Set als die Generalisten.

### 3.7 Darts Club: PvP Multiplayer (BoomBit)
**25 Millionen Downloads**, 4,51/5 bei 340.000 Bewertungen. Eher Spiel-App als Scoring-App: Sammelkarten-Mechanik, ELO-System, Club-Wars, saisonale Statistiken. Sehr starke Discord-/Social-Anbindung.

**Stärken:** Massentauglich, suchterzeugend, Online-Battle-Mechanik.
**Schwächen:** Es ist eher ein Game als ein Tracker – die "Darts" sind virtuell.

### 3.8 Dartsmind
Hat als eine der wenigen Apps **KI-Auto-Scoring per Smartphone-Kamera** integriert (Premium für ca. 15 USD). Unterstützt Dual-Device-Setup mit zwei Kameras für höhere Genauigkeit.

**Stärken:** Innovative Kamera-Erkennung ohne Zusatz-Hardware.
**Schwächen:** Genauigkeit abhängig von Licht, noch nicht perfekt.

### 3.9 Hardware-Konkurrenten (außer Konkurrenz, aber wichtig zu kennen)
- **Scolia** – Premium-Kamerasystem (mehrere hundert Euro), 99 %+ Genauigkeit, Industriestandard im Pro-Bereich.
- **Autodarts.io** – DIY-Kamerakit, ~99,5 % Genauigkeit, läuft auf Raspberry Pi 5 oder Jetson Nano.
- **Target Omni** – Hardware-Add-on, das DartCounter automatisches Scoring beibringt.
- **GranBoard 3s** – Smart-Board mit eigenem Skill-Matchmaking.

### 3.10 Marktlücke (das Whitespace)
Niemand vereint heute folgende Punkte gleichzeitig auf hohem Niveau:
- **Modernes, junges UI** (Score Darts und DartVision sind da am ehesten)
- **Sehr schnelle Eingabe ohne Hardware-Pflicht**
- **Spaß-/Party-Modi für Hobby-Sessions**
- **Coaching/Trainingsplan, der personalisiert ist**
- **Social-Layer wie bei Darts Club, aber für echte (nicht virtuelle) Würfe**

Genau dort liegt die Chance.

---

## 4. Feature-Liste nach Priorität

Ich teile die Features in drei Stufen ein:
- **MUST-HAVE** – ohne das ist es keine ernsthafte Dart-App
- **NICE-TO-HAVE** – macht die App rund, ist aber kein Showstopper
- **WOW / Differenzierung** – das hebt die App von allen anderen ab

### 4.1 MUST-HAVE Features

**Scoring-Engine (Pflicht):**
- 501 / 301 / 701 (X01) mit Single-Out, Double-Out und Master-Out
- Cricket / Tactics (mit klarer Visualisierung der "offenen" Zahlen)
- Around the Clock
- Schneller Score-Undo (typischer Bug-Punkt bei Mitbewerbern – muss bei uns wasserdicht sein)
- Automatische "Bust"-Erkennung (überworfen, Rest > 1, Rest auf 1 etc.)
- Anzeige des verbleibenden Scores groß und gut lesbar aus 2–3 Metern Entfernung
- Eingabe per Tasten (3-Wurf-Total) UND per Einzelwurf (Tap aufs Board)

**Player-Setup:**
- 1–8 Spieler mit Profilen (Name, Foto/Avatar)
- Gast-Modus für spontane Mitspieler
- Lokales Speichern, kein Account-Zwang am Anfang

**Checkout-Hilfe:**
- Vorschlag des optimalen Checkout-Wegs bei Restscores ≤ 170
- Berücksichtigung verbleibender Darts in der Aufnahme
- Alternative Routen anzeigen (z. B. "T20-T20-Bull" vs. "T20-T18-D18" für 130)

**Statistik (Standard, nichts Exotisches):**
- 3-Dart-Average
- First-9-Average (Scoring-Power der ersten 3 Aufnahmen)
- Checkout-Quote
- Höchster Checkout, höchste Aufnahme (180er, 140+, 100+, "Tons")
- Anzahl gespielter Legs, Sets, Matches
- Match-Historie chronologisch durchsuchbar

**Bedienbarkeit:**
- "Quick Start" – ein Tipp und das nächste 501-Match läuft mit den letzten Einstellungen
- Großer Tap-Bereich (man hat Hände voll mit Darts)
- Display bleibt an während Match
- Sound feedback bei jedem Wurf (an/aus stellbar)

### 4.2 NICE-TO-HAVE Features

**Sound & Atmosphäre:**
- Voice-Calling der Scores ("One Hundred and Eighty!") – mehrere Stimmen wählbar
- Eigenes Mikrofon-Aufnehmen des eigenen Namens für personalisierte Calls
- Stimmung-Modi (PDC-Style, Pub-Atmosphäre, ruhiger Trainingsmodus)

**Trainingsmodi:**
- Bobs 27 (klassischer Doppel-Trainer)
- Shanghai
- Killer
- Round the World mit Doppeln/Triples
- 121 Challenge (Checkout-Üben)
- Eigene Wunsch-Trainings erstellen ("trainiere 50 Würfe auf T19")

**Erweiterte Statistik:**
- **Heatmap des Boards** – wo treffe ich tatsächlich vs. wo ziele ich
- Performance-Verlauf über Wochen/Monate
- Vergleich mit eigenem Durchschnitt
- "Form"-Indikator (steigt/fällt mein Average gerade?)
- Pro-Segment-Statistik (Triple-20-Trefferquote, Bull-Quote etc.)

**Soziales:**
- Online-Multiplayer (Asynchron oder Live mit Videolink)
- Freundesliste
- Globale + lokale Bestenlisten nach Average, höchstem Checkout etc.
- Match-Ergebnis als Bild für Instagram/WhatsApp teilen

**Komfort:**
- Cloud-Sync der Statistik über Geräte
- Apple Watch / Wear OS Companion (Score-Anzeige am Handgelenk)
- Chromecast / AirPlay auf den Fernseher streamen für Sessions zuhause
- Mehrsprachigkeit (mind. DE/EN, später NL, ES, FR)
- Dunkler & heller Modus
- Linkshänder-Layout

### 4.3 WOW-Features (Differenzierung)

Hier wird's spannend. Das sind die Dinge, die als Marketing-Aufhänger und Differenzierung wirklich funktionieren:

**1. Kamera-Auto-Scoring per Smartphone (ohne Zusatz-Hardware)**
Die größte technische Wow-Funktion. Akademisch durch das DeepDarts-Paper belegt: Eine einzelne Smartphone-Kamera erreicht 94,7 % Erkennungsrate des Gesamtscores. Aktuelle Vision-Systeme schaffen >99 %. Realistisch für eine App: Das Smartphone wird auf einem kleinen Stativ ~1,5 m vor dem Board positioniert, die App kalibriert sich auf das Board und liest die Würfe automatisch. Konkurrenz wie Scolia kostet mehrere hundert Euro extra – wenn das mit einer App-only-Lösung in akzeptabler Qualität klappt, ist das ein riesiger Hebel.

**2. KI-Coach für Hobby-Spieler**
Statt nur Statistiken zu zeigen, sagt die App: "Du verfehlst T20 in 70 % der Fälle rechts daneben. Trainiere diese Woche 3x Bobs 27 und Round-the-World auf D16." Personalisierte 5-Minuten-Trainingsmenüs, die sich an die tatsächlichen Schwächen anpassen. Lehnt sich an Apps wie Strava oder Duolingo an, wo das Personal-Coaching der Hauptanker ist.

**3. Party- & Hobby-Modi, die niemand richtig macht**
- "Truth or Dart" (Trinkspiel-Modus mit Strafkarten – auch alkoholfrei spielbar mit lustigen Tasks)
- "Bingo Darts" – Bingo-Karte auf dem Board, erste Zeile/Spalte gewinnt
- "Teampartner-Roulette" – App würfelt zufällig neue Teams nach jedem Leg, hält Hobby-Sessions in Bewegung
- "Handicap Mode" – schwächere Spieler starten z.B. mit 401, stärkere mit 601, gefühlt fair für alle

**4. Sprachsteuerung in Alltagssprache (nicht nur Zahlen)**
"Triple zwanzig, single fünf, Bullseye" → korrekt erkannt. Aktuell vorhandene Lösungen wie "Darts Score Handsfree" erreichen ca. 98 % Genauigkeit, sind aber meist nur Englisch. Eine wirklich gute deutsche Erkennung mit Dialekt-Toleranz (öst./bay./schwäb.) wäre ein echter USP im DACH-Raum.

**5. AR-Modus auf dem Board**
Mit ARKit/ARCore kann man Ziel-Felder direkt aufs Live-Kamerabild des Boards projizieren. Beispiel: "Du brauchst noch 81 – zielen auf T19" und das Triple-19-Feld leuchtet auf dem Telefon-Display farbig auf. Sehr instagrammable.

**6. Live-Co-Watching mit Freunden (Twitch-Style, light)**
Während ich spiele, sehen Freunde live mein Live-Score-Board (nicht zwingend Video), können Emojis & Reactions schicken. Niedrige Bandbreite, hoher sozialer Wert.

**7. Story-Mode für Solo-Spieler**
Karriere wie in Sport-Games: Aufstieg von Kneipenliga zur (fiktiven) Welt-Tour. Gegner mit eigenen Charakter-Stilen (vorsichtig, aggressiv etc.), Geschichte zwischen den Matches, Outfits/Darts freischaltbar. Russ Bray Pro hat einen ähnlichen Career-Mode – aber technisch und visuell ausbaufähig.

**8. Verein-/Stammtisch-Modus**
Mehrere Spieler regelmäßig zusammen → die App merkt sich die "Crew", erstellt automatisch eine kleine Liga-Tabelle, optional mit Saison-Endveranstaltung. Macht Hobby-Sessions verbindlicher.

**9. Hardware-agnostische Smart-Board-Anbindung**
Falls der User ein Granboard, Scolia, Autodarts oder ein Target-Omni-System hat – die App nimmt die Daten entgegen. Optional, aber öffnet die Tür zu E-Dart und Premium-Setups.

**10. Open-Data-Schnittstelle**
Statistik-Daten als CSV/JSON exportierbar. Klingt nerdig, aber Hardcore-Hobbyisten lieben das – und führt zu organischer Verbreitung in Foren und Reddit.

---

## 5. UX-Prinzipien für eine "perfekte" Hobby-App

Damit das Ganze nicht zum Feature-Monster wird, sollte folgendes leitend sein:

**Schnelligkeit vor Vollständigkeit.** Lieber 8 Modi richtig schnell als 30 Modi mit dreistufigen Einstellungs-Dialogen.

**Eingabe sollte sich wie ein Taschenrechner anfühlen.** Ein großes Ziffernfeld, sofortige visuelle Bestätigung, niemals zwei Bestätigungs-Taps für eine Aufnahme.

**Onboarding minimal.** Erstes Spiel ohne Account, ohne Tutorial. Tutorial nur, wenn der User es will.

**Statistiken nur auf zwei Ebenen:** "Quick Glance" (3 wichtige Zahlen sofort sichtbar) und "Deep Dive" (alles für Statistik-Nerds, aber versteckt hinter einem Tab).

**Spielen ist ein soziales Erlebnis.** Die App darf nie zwischen Spielern und ihrer eigentlichen Aktivität (sich unterhalten, trinken, Spaß haben) stehen.

---

## 6. Tech-Stack und Machbarkeit

### 6.1 Cross-Platform Framework

Für eine App mit ähnlichem Funktionsumfang auf iOS und Android wäre **nativ entwickeln zwar performant, aber doppelt teuer**. Realistisch zur Auswahl:

**Flutter** (von Google, Sprache: Dart)
Hält in 2026 ~46 % Marktanteil im Cross-Platform-Segment. Eigene Render-Engine (Impeller), 50 % schnellere Frame-Rasterisierung als noch vor 2 Jahren. Für eine App, in der Animationen, Statistik-Charts und schnelle Eingaben zentral sind, **gut geeignet**. Sehr konsistentes UI auf beiden Plattformen.

**React Native** (von Meta, Sprache: JavaScript/TypeScript)
~35 % Marktanteil. Neue Architektur (Fabric, JSI) ist seit ~2024 Standard. Vorteil: JavaScript-Entwickler gibt es zuhauf. Performance heute praktisch auf Augenhöhe mit Flutter.

**Native iOS (Swift) + Android (Kotlin)**
Höchste Performance und beste Hardware-Anbindung – wichtig bei Kamera-Erkennung und ARKit/ARCore. Aber: doppelter Code, doppelte Wartung, deutlich höhere Kosten.

**Empfehlung für Hobby-Dart-App:**
- Bei begrenztem Budget und MVP-Fokus: **Flutter**
- Wenn Kamera-Auto-Scoring und AR von Anfang an Kernfeatures sind: **nativ oder Flutter mit nativen Plugins für die ML-Teile** (machbar, aber aufwendiger)

Erfahrungswert: Ein typischer MVP dauert mit Flutter 12–16 Wochen, mit React Native 16–24 Wochen – beide Cross-Platform-Optionen sparen 30–40 % gegenüber Native-Doppelentwicklung.

### 6.2 Kamera-basierte Wurferkennung

Der technisch spannendste Teil. Drei Wege:

**Weg A – On-Device ML (TensorFlow Lite / LiteRT)**
Modelle wie YOLOv8/v9 laufen live auf modernen Smartphones (60+ FPS auf einem iPhone 14 oder Pixel 7). Für die Dart-Erkennung müsste ein eigenes Modell trainiert werden, mit Bildern von Boards und Pfeilen aus verschiedenen Winkeln und Lichtverhältnissen. Akademische Grundlage existiert (DeepDarts, Dart-Sense Repos auf GitHub). On-Device-Vorteil: kein Server, keine Latenz, keine Privacy-Bedenken.

**Weg B – Cloud-Inference**
Smartphone schickt Video-Frames an einen Server, dort läuft ein größeres Modell. Höhere Genauigkeit möglich, aber: Latenz, laufende Server-Kosten, Datenschutz, schlechter Empfang in Kellern/Garagen wo viele spielen.

**Weg C – Hardware-Anbindung an externe Systeme**
Statt selbst Vision zu bauen, einfach Scolia/Autodarts/Omni als Datenquelle akzeptieren. Schneller umsetzbar, aber kein Differenzierungsmerkmal.

**Realistische Roadmap für die Wurferkennung:**
1. v1: Manuelle Eingabe perfekt machen (3-Wurf und Einzelwurf).
2. v2: Sprachsteuerung als Hands-free-Eingabe (3–6 Monate Aufwand inklusive deutscher Erkennung).
3. v3: Kamera-Erkennung Beta, beginnend mit kontrollierten Bedingungen (gleichbleibendes Licht, festes Stativ).
4. v4: Robustere Modelle für unterschiedliche Setups, optional Dual-Kamera über zweites Gerät.

**Realismus-Check:** Smartphone-Auto-Scoring ist machbar, aber NICHT trivial. Die DeepDarts-Genauigkeit von 94,7 % klingt gut, heißt aber in der Praxis: Jeder ~20. Wurf wird falsch erkannt, was im Match nervig ist. Eine wirklich produktreife Lösung braucht eigenes Training, Datenerfassung in mehreren Tausend Beispiel-Bildern und ein gutes Korrektur-UX, wenn der Algorithmus mal danebenliegt.

### 6.3 Sprachsteuerung

Für iOS/Android ist die native Speech-API gratis und gut – Flutter hat dafür das `speech_to_text` Plugin. Für deutsche Sprache und Dialekt-Toleranz wäre ein Cloud-Dienst wie **Deepgram, Google Speech-to-Text oder Azure Speech** sinnvoller (Genauigkeit deutlich höher, Kosten ~1 Cent pro Minute Audio). Eine bereits existierende App ("Darts Score Handsfree") erreicht etwa 98 % Genauigkeit – das ist machbar.

### 6.4 Backend

Für Statistik-Cloud-Sync, Online-Multiplayer und Social-Features:
- **Firebase** (Google) – schnell, günstig im Einstieg, Realtime Database und Auth out-of-the-box. Ideal für MVP.
- **Supabase** – Open-Source-Alternative, basiert auf Postgres, gut für mittelgroße Apps.
- **Eigenes Backend (Node/Go/Python)** – flexibler, aber teurer.

Für Hobby-MVP klar Firebase oder Supabase.

### 6.5 Geschätzter Aufwand & Kosten

Basierend auf branchenüblichen Erfahrungswerten für Sport-MVPs:

**MVP (manuelle Eingabe, 4 Spielmodi, Statistik, Cloud-Sync):**
ca. **20.000 – 50.000 EUR**, 3–4 Monate mit kleinem Team (1 Designer, 2 Entwickler).

**Vollversion 1.0 (mit Sprachsteuerung, Online-Multiplayer, Heatmaps, mehr Modi):**
ca. **60.000 – 120.000 EUR**, 6–9 Monate.

**Mit Kamera-Auto-Scoring als Hauptfeature:**
ca. **120.000 – 250.000 EUR**, 9–14 Monate, plus laufende Kosten für Daten-Sammlung und Modell-Verbesserung.

Hinweis: Die tatsächlichen Kosten eines App-Projekts liegen erfahrungsgemäß 40–60 % über der ersten Schätzung, weil Wartung, Bugfixes, App-Store-Pflege, Marketing und unerwartete Anforderungen dazukommen.

---

## 7. Geschäftsmodell-Optionen

Auch wenn das nicht im Fokus stand: Es lohnt sich kurz, das mitzudenken, weil Features davon abhängen:

**Freemium** (am häufigsten): Basis-Modi und einfache Statistik gratis, Premium für Heatmaps, Karrieremodus, unbegrenzte Historie, Voice-Pakete. Typisch 3–5 EUR/Monat oder 25–40 EUR/Jahr.

**One-Time Purchase** (wie Russ Bray Pro): 5–10 EUR einmalig. Einfacher zu kommunizieren, aber laufende Server-Kosten schwerer zu decken.

**Werbefinanziert** (für Hobby-User vermutlich akzeptabel): Banner während Wartezeit oder zwischen Legs, dezent. Plus Premium-Upgrade gegen Werbung.

**Hybrid:** Manche Premium-Features (Cloud-Sync, Online-Multiplayer) als Abo, einmalige Sets (Voice-Pack, Skin-Pack) als Einzelkauf.

---

## 8. Empfohlener Phasenplan

Wenn die App wirklich gebaut würde, würde ich folgenden Plan vorschlagen:

**Phase 1 – Foundation (Monat 1–3):**
Manuelle Eingabe, 501/301/Cricket/Around-the-Clock, Checkout-Vorschläge, Basis-Statistik, sauberes UI. Ziel: bessere Hobby-App als alle bestehenden Generalisten.

**Phase 2 – Soziales & Sound (Monat 4–6):**
Cloud-Account, lokales Stammtisch-Liga-Feature, Voice-Calling, 2–3 zusätzliche Spielmodi, Party-Modi wie Truth-or-Dart und Bingo-Darts.

**Phase 3 – Hands-Free Eingabe (Monat 7–10):**
Sprachsteuerung in Deutsch und Englisch, AR-Zielhilfe, Apple-Watch-/Wear-OS-Companion, KI-Coach (Beta).

**Phase 4 – Vision (Monat 10–15):**
Kamera-Auto-Scoring Beta, Beta-Tester-Programm, Daten-Sammlung. Parallel: Hardware-Anbindungen für Scolia/Autodarts/Granboard.

**Phase 5 – Live-Multiplayer & Plattform (ab Monat 12):**
Live-Online-Matches, Co-Watching, globale Bestenlisten, Story-/Career-Mode für Solo-Spieler.

---

## 9. Machbarkeit – ehrliche Einschätzung

Damit das nicht alles wie ein Wunschzettel klingt, hier die ehrliche Bewertung:

**Sehr machbar (geringe Risiken):**
Manuelle Eingabe, alle Statistik-Features, Checkout-Vorschläge, Voice-Calling von Scores, Cloud-Sync, Online-Multiplayer asynchron, Heatmap-Visualisierung, Party-Modi. Das ist alles "Standard-App-Entwicklung" auf hohem Qualitätsniveau.

**Machbar, aber aufwendig (mittlere Risiken):**
Sprachsteuerung mit deutscher Dialekt-Toleranz, AR-Zielhilfe, KI-Coach mit personalisierten Trainingsplänen, Live-Co-Watching. Funktioniert, braucht aber gute Spezialisten und sorgfältiges Testing.

**Anspruchsvoll (hohe Risiken):**
Kamera-Auto-Scoring per Smartphone ohne Zusatz-Hardware. Akademisch bewiesen, kommerziell selten gut umgesetzt (Dartsmind ist der bekannteste Versuch). Funktioniert, braucht aber eigenes Datensatz-Sammeln, ML-Engineering und ein gutes Fallback-UI für falsche Erkennungen. Wenn das Hauptverkaufsargument werden soll, lohnt es sich – wenn es nur ein Nice-to-Have ist, lieber später angehen.

---

## 10. Fazit

Die "perfekte" Hobby-Dart-App existiert noch nicht. Es gibt sehr gute Spezialisten (DartConnect für Liga, Russ Bray Pro für Voice/Atmosphäre, DartVision für Heatmaps, Darts Club für Social-Gaming), aber keinen Generalisten, der alle Hobby-Bedürfnisse in einem schönen, schnellen, deutschsprachigen Paket vereint.

Der größte Hebel liegt in der Kombination aus **exzellenter Basis-UX** (schneller als alles, was es gibt), **klugen Hobby-Modi** (Party, Stammtisch, Truth-or-Dart) und einer **wachsenden technischen Tiefe** (Sprachsteuerung → AR → Kamera-Auto-Scoring), die über Releases hinzukommt.

Ein MVP nach 3 Monaten ist realistisch und finanziell überschaubar. Die Premium-Features, die echte Differenzierung schaffen (Kamera-Scoring, KI-Coach), kommen idealerweise schrittweise dazu, wenn die Basis-App bereits eine engagierte Nutzerbasis hat.

---

## Quellen

- [Best Online Darts Scoring Apps (2026) — Pro-Darter vs DartConnect vs DTC](https://www.tallycounter.org/best-tally-counter-for/darts-scoring)
- [The Apps Every Darts Player Will Enjoy – darts501.com](https://darts501.com/darts-apps.html)
- [Russ Bray Darts Scorer Pro – App Store](https://apps.apple.com/us/app/russ-bray-darts-scorer-pro/id1269100714)
- [Russ Bray Dart Scorer Pro Review – Goosed.ie](https://goosed.ie/news/tech-news/best-dart-scoring-app/)
- [DartConnect – Perfect Your Game!](https://www.dartconnect.com/)
- [DartConnect: The Ultimate Digital Darts Scoring Guide – Darts IQ](https://dartsiq.com/dartconnect-digital-darts-scoring-guide/)
- [DartConnect League Pricing](https://www.dartconnect.com/leagues/league-pricing/)
- [DartCounter – App Store](https://apps.apple.com/us/app/dartcounter/id999533915)
- [Dartsmind – Google Play](https://play.google.com/store/apps/details?id=com.zaglab.dartsmind&hl=en_US)
- [Score Darts](https://www.scoredarts.com/)
- [King of Darts](https://kingofdarts.com/)
- [DartVision App](https://dartvision.app/)
- [HIG Studio – DARTS Scorer 2026](https://hig.dev/apps/darts-scorer/)
- [Darts Club: PvP Multiplayer – Google Play](https://play.google.com/store/apps/details?id=com.boombitgames.Dartsy&hl=en_US&gl=US)
- [Scolia Automatic Dart Scoring](https://scoliadarts.com/)
- [Autodarts.io](https://autodarts.io/)
- [Autodarts Vision](https://autodarts.io/vision)
- [Target Omni Auto Scoring](https://www.targetdarts.com/omni-auto-scoring-system-us)
- [DeepDarts Paper (arXiv:2105.09880)](https://arxiv.org/abs/2105.09880)
- [Dart Sense Project (GitHub)](https://github.com/bnww/dart-sense)
- [OpenCV Steel Darts (GitHub)](https://github.com/hanneshoettinger/opencv-steel-darts)
- [Dart Game Rules – Dartsy](https://dartsy.org/rules)
- [Dart Games & Variants – darts501.com](https://www.darts501.com/Games.html)
- [Darts Checkout Chart](https://darts501.com/Check.html)
- [Darts Checkouts Statistik](https://www.thestatsdontlie.com/darts/premier-league/checkouts/)
- [Darts Score Handsfree – Google Play](https://play.google.com/store/apps/details?id=nl.selwyn420.dartscorevoicecontrolled)
- [speech_to_text Flutter Package](https://pub.dev/packages/speech_to_text)
- [Flutter vs React Native 2026 – TechAhead](https://www.techaheadcorp.com/blog/flutter-vs-react-native-in-2026-the-ultimate-showdown-for-app-development-dominance/)
- [Flutter vs React Native 2026 – Discrete Logix](https://www.discretelogix.com/react-native-vs-flutter/)
- [TensorFlow Lite Object Detection in Flutter – Fritz AI](https://fritz.ai/turning-the-mobile-camera-into-a-real-time-object-detector/)
- [MVP Development Costs 2026 – Aalpha](https://www.aalpha.net/articles/how-much-does-it-cost-to-build-an-mvp-mobile-app/)
- [Granboard – Online Darts](https://granboards.com/)
