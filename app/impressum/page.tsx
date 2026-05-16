import Header from "@/components/Header";
import LegalSection from "@/components/LegalSection";

export const metadata = { title: "Impressum · Bullseye" };

export default function ImpressumPage() {
  return (
    <>
      <Header title="Impressum"/>

      <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
        <span aria-hidden>🔒</span> Impressum
      </div>

      <div className="space-y-3">
        <LegalSection title="Angaben gemäß § 24 MedienG / § 5 ECG">
          <p>
            <strong>Dominik Kurcsics</strong><br/>
            Wien, Österreich
          </p>
        </LegalSection>

        <LegalSection title="Unternehmensgegenstand">
          <p>
            Keiner – diese App ist ein <strong>privates, nicht-kommerzielles Hobbyprojekt</strong> zum
            Mitschreiben von Dart-Punktzahlen.
          </p>
        </LegalSection>

        <LegalSection title="Kontakt">
          <p>
            <a href="mailto:dominik.kurcsics@outlook.com">dominik.kurcsics@outlook.com</a>
          </p>
        </LegalSection>

        <LegalSection title="Haftungsausschluss">
          <p>
            Die Inhalte dieser App wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
            Vollständigkeit und Aktualität der Inhalte – insbesondere der hinterlegten Spielregeln
            und Punkteberechnungen – wird keine Gewähr übernommen. Alle Spielnamen, Marken und Logos
            sind Eigentum ihrer jeweiligen Inhaber:innen und werden hier ausschließlich zur
            Identifikation des jeweiligen Spiels verwendet.
          </p>
        </LegalSection>
      </div>
    </>
  );
}
