"use client";

type Pack = "pdc" | "de";

const cache = new Map<string, HTMLAudioElement>();
const missing = new Set<string>();

/** Resolve which pack to use based on settings + lang. */
function resolvePack(packPref: string | undefined, lang: "de" | "en"): Pack | null {
  if (packPref === "browser") return null;
  if (packPref === "pdc") return "pdc";
  if (packPref === "de") return "de";
  // auto
  return lang === "de" ? "de" : "pdc";
}

function audioUrl(pack: Pack, key: string) {
  return `/audio/${pack}/${key}.mp3`;
}

async function playFile(pack: Pack, key: string): Promise<boolean> {
  const cacheKey = `${pack}/${key}`;
  if (missing.has(cacheKey)) return false;
  let el = cache.get(cacheKey);
  if (!el) {
    el = new Audio(audioUrl(pack, key));
    el.preload = "auto";
    cache.set(cacheKey, el);
  }
  try {
    el.currentTime = 0;
    await el.play();
    return true;
  } catch {
    try {
      const head = await fetch(audioUrl(pack, key), { method: "HEAD" });
      if (!head.ok) {
        missing.add(cacheKey);
        cache.delete(cacheKey);
        return false;
      }
    } catch {
      missing.add(cacheKey);
      return false;
    }
    return false;
  }
}

export function speak(text: string, lang: "de" | "en" = "de") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "de" ? "de-DE" : "en-US";
    u.rate = 1.05;
    u.pitch = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {}
}

export async function announceScore(total: number, lang: "de" | "en" = "de", packPref: string = "auto") {
  const pack = resolvePack(packPref, lang);
  if (pack) {
    const ok = await playFile(pack, `score_${total}`);
    if (ok) return;
  }
  if (total === 180) {
    speak(lang === "de" ? "Einhundertachtzig!" : "One hundred and eighty!", lang);
    return;
  }
  speak(String(total), lang);
}

export async function announceCheckout(name: string, lang: "de" | "en" = "de", packPref: string = "auto") {
  const pack = resolvePack(packPref, lang);
  let usedFile = false;
  if (pack) usedFile = await playFile(pack, "game_shot");
  setTimeout(() => speak(name, lang), usedFile ? 700 : 0);
  if (!usedFile) speak(lang === "de" ? `Spiel, ${name}!` : `Game shot, ${name}!`, lang);
}

export async function announceBust(lang: "de" | "en" = "de", packPref: string = "auto") {
  const pack = resolvePack(packPref, lang);
  if (pack) {
    const ok = await playFile(pack, "bust");
    if (ok) return;
  }
  speak(lang === "de" ? "Überworfen!" : "Bust!", lang);
}

export async function announceWelcome(lang: "de" | "en" = "de", packPref: string = "auto") {
  const pack = resolvePack(packPref, lang);
  if (pack) await playFile(pack, "welcome");
}

export function preloadCommonAudio(lang: "de" | "en" = "de", packPref: string = "auto") {
  const pack = resolvePack(packPref, lang);
  if (!pack) return;
  const common = [180, 140, 100, 60, 41, 26, 0];
  for (const n of common) {
    const cacheKey = `${pack}/score_${n}`;
    if (cache.has(cacheKey)) continue;
    const el = new Audio(audioUrl(pack, `score_${n}`));
    el.preload = "auto";
    cache.set(cacheKey, el);
  }
  ["game_shot", "bust"].forEach(k => {
    const cacheKey = `${pack}/${k}`;
    if (cache.has(cacheKey)) return;
    const el = new Audio(audioUrl(pack, k));
    el.preload = "auto";
    cache.set(cacheKey, el);
  });
}

export function beep(freq = 880, durationMs = 80, vol = 0.04) {
  if (typeof window === "undefined") return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.value = vol;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    setTimeout(() => { osc.stop(); ctx.close(); }, durationMs);
  } catch {}
}

export function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try { (navigator as any).vibrate(pattern); } catch {}
  }
}
