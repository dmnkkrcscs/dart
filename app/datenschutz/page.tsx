import Header from "@/components/Header";
import LegalSection from "@/components/LegalSection";

export const metadata = { title: "Datenschutz · Bullseye" };

export default function DatenschutzPage() {
  return (
    <>
      <Header title="Datenschutz"/>

      <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
        <span aria-hidden>🔒</span> Datenschutz
      </div>

      <div className="space-y-3">
        <LegalSection title="Kurzfassung">
          <p>
            Bullseye ist ein <strong>Privatprojekt</strong> und funktioniert <strong>vollständig offline</strong>.
            Alle Daten – Spieler:innen, Match-Historie, Einstellungen – bleiben{" "}
            <strong>ausschließlich lokal auf deinem Gerät</strong>. Es gibt keinen Account, keinen
            Cloud-Sync, kein Tracking, keine Cookies und keine Drittanbieter-Ressourcen.
          </p>
        </LegalSection>

        <LegalSection title="Verantwortliche Person">
          <p>Dominik Kurcsics, Wien — Kontakt siehe Impressum.</p>
        </LegalSection>

        <LegalSection title="Lokale Datenspeicherung">
          <p>
            Die App nutzt den <strong>localStorage</strong> deines Browsers, um folgende Daten zu
            speichern. Diese Daten verlassen dein Gerät zu keinem Zeitpunkt:
          </p>
          <ul>
            <li>Spieler:innen (Name, Avatar, Farbe, Erstelldatum)</li>
            <li>Abgeschlossene Matches (Datum, Spielmodus, Würfe, Legs/Sets, Gewinner:in)</li>
            <li>App-Einstellungen (Voice-Pack, Sprache, Sound, Haptik, Eingabemodus, Checkout-Hilfe)</li>
            <li>Zuletzt verwendete Spiel-Konfiguration (zum schnellen Wiedereinstieg)</li>
          </ul>
          <p>
            Du kannst alle Daten jederzeit in den <strong>Einstellungen</strong> exportieren
            (Backup-Datei), wieder einspielen oder vollständig löschen. Beim Deinstallieren der App
            bzw. Löschen der Browser-Daten werden sie automatisch entfernt.
          </p>
        </LegalSection>

        <LegalSection title="Backup (manuell, lokal)">
          <p>
            Über die Backup-Funktion in den Einstellungen kannst du eine <strong>JSON-Datei</strong>{" "}
            mit deinen Spieldaten herunterladen und auf einem anderen Gerät wieder einspielen. Die
            Datei wird ausschließlich auf deinem Gerät erzeugt und nicht an einen Server übertragen.
            Was mit dieser Datei passiert (z.B. Cloud-Storage, Messenger-Versand) entscheidest
            ausschließlich du.
          </p>
        </LegalSection>

        <LegalSection title="Keine Nutzungsstatistik, kein Tracking">
          <p>
            Die App enthält <strong>keine Analytics</strong>, kein Google Analytics, keinen
            Facebook Pixel, keine Tracking-Cookies und keine sonstigen Tracking-Tools. Es werden
            keine Daten an Dritte weitergegeben.
          </p>
        </LegalSection>

        <LegalSection title="Eingebundene Inhalte">
          <p>
            Die App liefert sämtliche Assets (Icons, Voice-Pack als MP3-Dateien) von der eigenen
            Domain aus. Es werden <strong>keine externen CDNs</strong>, Schriftarten von Google
            Fonts oder sonstige Drittanbieter-Ressourcen geladen. Die optionale{" "}
            <strong>Browser-TTS-Sprachausgabe</strong> wird vom Betriebssystem deines Geräts
            ausgeführt – auch hier verlassen keine Daten dein Gerät.
          </p>
        </LegalSection>

        <LegalSection title="Deine Rechte">
          <p>
            Da alle Spieldaten lokal bei dir bleiben und keine personenbezogenen Daten an einen
            Server übertragen werden, ist eine personenbezogene Auskunft, Berichtigung oder Löschung
            durch den Anbieter in der Regel nicht möglich – es liegen schlicht keine personenbezogenen
            Daten beim Anbieter vor. Lokale Daten kannst du jederzeit selbst in den App-Einstellungen
            exportieren oder löschen.
          </p>
        </LegalSection>

        <LegalSection title="Stand">
          <p>Letzte Aktualisierung: Mai 2026</p>
        </LegalSection>
      </div>
    </>
  );
}
