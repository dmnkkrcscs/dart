#!/usr/bin/env node
/**
 * Generates all voice-call MP3s via ElevenLabs and writes them to public/audio/<pack>/<key>.mp3.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=sk_xxx ELEVENLABS_VOICE_ID=xxxx node scripts/generate-audio.mjs [pack]
 *
 *   pack = "pdc" (default, English, Russ-Bray-Style) | "de" (German)
 *
 * Re-runs are cheap — files already on disk are skipped.
 * Stats endpoint logs character usage at end.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
const MODEL = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";
const PACK = (process.argv[2] || "pdc").toLowerCase();

const EN_ONES = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const EN_TENS = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
const DE_ONES = ["null","eins","zwei","drei","vier","fünf","sechs","sieben","acht","neun","zehn","elf","zwölf","dreizehn","vierzehn","fünfzehn","sechzehn","siebzehn","achtzehn","neunzehn"];
const DE_TENS = ["","","zwanzig","dreißig","vierzig","fünfzig","sechzig","siebzig","achtzig","neunzig"];

if (!API_KEY) {
  console.error("✘ Missing ELEVENLABS_API_KEY env var.");
  process.exit(1);
}
if (!VOICE_ID) {
  console.error("✘ Missing ELEVENLABS_VOICE_ID env var.");
  process.exit(1);
}

const OUT_DIR = path.join(ROOT, "public", "audio", PACK);
fs.mkdirSync(OUT_DIR, { recursive: true });

const PHRASES = buildPhrases(PACK);

const VOICE_SETTINGS = {
  stability: 0.55,
  similarity_boost: 0.8,
  style: 0.45,
  use_speaker_boost: true,
};

let generated = 0;
let skipped = 0;
let failed = 0;

for (const { key, text } of PHRASES) {
  const file = path.join(OUT_DIR, `${key}.mp3`);
  if (fs.existsSync(file) && fs.statSync(file).size > 1000) {
    skipped++;
    continue;
  }
  process.stdout.write(`→ ${PACK}/${key}.mp3  "${text}" … `);
  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: MODEL,
        voice_settings: VOICE_SETTINGS,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.log(`FAIL ${res.status} ${body.slice(0, 200)}`);
      failed++;
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(file, buf);
    console.log(`${(buf.length / 1024).toFixed(1)} kB`);
    generated++;
    await new Promise(r => setTimeout(r, 150)); // tiny rate-limit cushion
  } catch (err) {
    console.log(`ERR ${err.message}`);
    failed++;
  }
}

// write manifest so the client knows what's available
const manifest = {
  pack: PACK,
  voiceId: VOICE_ID,
  model: MODEL,
  generatedAt: new Date().toISOString(),
  files: PHRASES.map(p => ({ key: p.key, text: p.text })),
};
fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));

console.log("");
console.log(`✓ done — generated: ${generated}, skipped: ${skipped}, failed: ${failed}`);
console.log(`  pack: ${PACK}  voice: ${VOICE_ID}  model: ${MODEL}`);
console.log(`  output: public/audio/${PACK}/`);

// ---------------------------------------------------------------------------

function buildPhrases(pack) {
  if (pack === "de") return buildDe();
  return buildPdc();
}

function buildPdc() {
  const list = [];
  // Numbers 0-180 — say them in classic darts style.
  // Special call: 180 = "One hundred and eighty!"
  // 100..179 = "One hundred and X"
  // 60..99 = "Sixty…" "Ninety-nine"
  // 26 = "twenty-six"
  // 0 = "no score"
  list.push({ key: "score_0", text: "No score." });
  for (let n = 1; n <= 180; n++) {
    let text;
    if (n === 180) text = "One hundred and eighty!";
    else if (n === 100) text = "One hundred!";
    else if (n === 140) text = "One hundred and forty!";
    else if (n === 26) text = "Bed and breakfast, twenty-six.";
    else if (n === 11) text = "Legs eleven.";
    else text = `${enWord(n)}.`;
    list.push({ key: `score_${n}`, text });
  }
  // Calls
  list.push({ key: "bust", text: "Bust!" });
  list.push({ key: "game_shot", text: "Game shot!" });
  list.push({ key: "game_on", text: "Game on!" });
  list.push({ key: "leg", text: "Leg." });
  list.push({ key: "set", text: "Set!" });
  list.push({ key: "match", text: "Match!" });
  list.push({ key: "one_hundred_eighty", text: "One hundred and eighty!" });
  list.push({ key: "tonpus", text: "Ton plus!" });
  list.push({ key: "ton", text: "Ton!" });
  list.push({ key: "welcome", text: "Welcome to Bullseye." });
  list.push({ key: "your_turn", text: "Your throw." });
  return list;
}

function buildDe() {
  const list = [];
  list.push({ key: "score_0", text: "Nichts." });
  for (let n = 1; n <= 180; n++) {
    let text;
    if (n === 180) text = "Einhundertachtzig!";
    else if (n === 100) text = "Einhundert!";
    else if (n === 140) text = "Einhundertvierzig!";
    else text = `${deWord(n)}.`;
    list.push({ key: `score_${n}`, text });
  }
  list.push({ key: "bust", text: "Überworfen!" });
  list.push({ key: "game_shot", text: "Spiel!" });
  list.push({ key: "game_on", text: "Es geht los!" });
  list.push({ key: "leg", text: "Leg." });
  list.push({ key: "set", text: "Satz!" });
  list.push({ key: "match", text: "Match!" });
  list.push({ key: "one_hundred_eighty", text: "Einhundertachtzig!" });
  list.push({ key: "welcome", text: "Willkommen bei Bullseye." });
  list.push({ key: "your_turn", text: "Du bist dran." });
  return list;
}

function enWord(n) {
  if (n < 20) return EN_ONES[n];
  if (n < 100) {
    const t = Math.floor(n / 10), r = n % 10;
    return r === 0 ? EN_TENS[t] : `${EN_TENS[t]}-${EN_ONES[r]}`;
  }
  const h = Math.floor(n / 100), rest = n % 100;
  return rest === 0 ? `${EN_ONES[h]} hundred` : `one hundred and ${enWord(rest)}`;
}

function deWord(n) {
  if (n < 20) return DE_ONES[n];
  if (n < 100) {
    const t = Math.floor(n / 10), r = n % 10;
    if (r === 0) return DE_TENS[t];
    const ones = r === 1 ? "ein" : DE_ONES[r];
    return `${ones}und${DE_TENS[t]}`;
  }
  const h = Math.floor(n / 100), rest = n % 100;
  const prefix = h === 1 ? "einhundert" : `${DE_ONES[h]}hundert`;
  return rest === 0 ? prefix : `${prefix}${deWord(rest)}`;
}
