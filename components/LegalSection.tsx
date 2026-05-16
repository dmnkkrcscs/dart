export default function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-5">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted [&_strong]:font-bold [&_strong]:text-ink [&_a]:text-accent [&_a]:underline [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
