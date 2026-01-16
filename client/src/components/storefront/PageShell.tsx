import { Link } from "wouter";

export default function PageShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-[calc(100vh-120px)]">
      <header className="mx-auto max-w-6xl px-6 pt-12">
        {eyebrow ? (
          <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
        ) : null}

        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h1>

        {subtitle ? (
          <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            {subtitle}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Explorar catálogo
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center rounded-xl border bg-background px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-accent"
          >
            Ver preguntas frecuentes
          </Link>
        </div>

        <div className="mt-10 border-t" />
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">{children}</section>
    </main>
  );
}
