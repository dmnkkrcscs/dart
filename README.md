# 🎯 Bullseye — Dart Scorer

Selfhosted Dart-Zähl-App, gebaut für Hobby & Stammtisch. Läuft als kleines Docker-Image auf [Coolify](https://coolify.io/).

## Features (Prototyp)

**Spielmodi**
- X01 (101, 170, 301, 501, 701, 1001) mit Single/Double/Master-Out, beliebig viele Legs/Sets
- Cricket (20, 19, 18, 17, 16, 15, Bull) inkl. Punktewertung
- Around the Clock (1 → 20, optional Bull)
- Bob's 27 (Doppel-Trainer, Solo + Crew)
- Shanghai (20 Runden, Shanghai = sofortiger Sieg)
- High Score (n Aufnahmen, höchste Summe gewinnt)
- Killer (Party-Modus, jeder bekommt eine Zufallsnummer)

**Eingabe**
- 3-Wurf-Total **oder** Einzelwurf-Eingabe (Multiplikator + Segment)
- Quick-Buttons für gängige Aufnahmen (26, 41, 45, 60, 100, 121, 140, 180)
- Mehrstufiger Undo
- Tastatur-Shortcuts (Zahlen + Enter, `U` = Undo)
- Auto-Bust + Auto-Checkout-Validierung

**Checkout-Hilfe**
- PDC-Standard-Tabelle für 2 — 170 (170 = T20 T20 BULL etc.)
- Live-Anzeige am Scoreboard für den werfenden Spieler

**Voice & Feedback**
- Browser-TTS (Deutsch / Englisch) — sagt Punkte und "Spiel, Name!" beim Checkout
- 180-Confetti-Banner
- Sound-Beeps + Vibration (mobil)

**Statistik**
- 3-Dart Ø, First-9 Ø, Checkout %, höchster Checkout
- 180er / 140+ / 100+ / 60+ Counter
- Dartboard-**Heatmap** (Treffer pro Single/Double/Triple/Bull)
- CSV-Export

**Komfort**
- Lokale Profile mit Avataren (kein Account nötig)
- Verlauf der letzten 200 Matches
- Dark Mode, PWA-Manifest, mobile-first responsiv

## Quick Start (lokal)

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Production (Docker)

```bash
docker build -t bullseye .
docker run -p 3000:3000 bullseye
```

oder via Compose:

```bash
docker compose up -d
```

## Deploy auf Coolify

1. Neue **Application** in Coolify anlegen.
2. Build-Pack: **Dockerfile**.
3. Repository auf dieses Verzeichnis zeigen lassen (Dockerfile liegt im Root).
4. Port: `3000`.
5. (Optional) Persistente Daten brauchst du nicht — alles lebt im LocalStorage des Browsers.

Coolify übernimmt TLS, Reverse Proxy und Auto-Deploy bei Push.

## Tech

- Next.js 14 (App Router, `output: "standalone"`)
- React 18 + TypeScript
- Tailwind CSS
- Zustand mit `persist`-Middleware (LocalStorage)
- Web Speech API, Web Audio API, Vibration API
- Inline-SVG-Dartboard für Heatmap

## Roadmap (was als nächstes käme)

- Sprach**eingabe** ("Triple zwanzig, single fünf, Bull")
- AR-Zielhilfe (ARKit/ARCore via WebXR)
- Online-Multiplayer (asynchron + live mit WebRTC)
- Karriere-Modus mit KI-Gegnern
- Smart-Board-Anbindung (Granboard, Scolia, Autodarts)
- KI-Coach mit personalisiertem Trainingsplan
- Echtes Cloud-Sync (statt nur LocalStorage)

## Lizenz

Privates Projekt. Mach was Schönes draus.
