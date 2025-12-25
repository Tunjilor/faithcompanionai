export default function BrandHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="brand-gradient-border mb-8">
      <div className="rounded-[27px] brand-surface-strong px-8 py-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">{title}</h1>
        {subtitle ? (
          <p className="mt-2 text-slate-700 max-w-2xl mx-auto">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
