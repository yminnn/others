export function SectionHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string; }) {
  return (
    <div className="space-y-1">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">{eyebrow}</p> : null}
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      {description ? <p className="max-w-2xl text-sm text-slate-400">{description}</p> : null}
    </div>
  );
}
