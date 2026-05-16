"use client";

const NUM_DE: Record<number, string> = {
  0: "Null", 1: "Eins", 2: "Zwei", 3: "Drei", 4: "Vier", 5: "Fünf",
  6: "Sechs", 7: "Sieben", 8: "Acht", 9: "Neun", 10: "Zehn",
};

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

export function announceScore(total: number, lang: "de" | "en" = "de") {
  if (total === 180) {
    speak(lang === "de" ? "Einhundertachtzig!" : "One hundred and eighty!", lang);
    return;
  }
  speak(String(total), lang);
}

export function announceCheckout(name: string, lang: "de" | "en" = "de") {
  speak(lang === "de" ? `Spiel, ${name}!` : `Game shot, ${name}!`, lang);
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
