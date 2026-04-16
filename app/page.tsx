import Link from "next/link";
import { Sparkles, Lock, LineChart, Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="flex flex-1 flex-col bg-calm-gradient">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-lg"
          >
            🌿
          </span>
          <span className="text-lg font-semibold tracking-tight">Serene</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/login"
            className="hidden rounded-md px-3 py-2 text-foreground/80 hover:text-foreground sm:inline-block"
          >
            Log in
          </Link>
          <Link href="/signup" className={buttonVariants({ size: "sm" })}>
            Get started
          </Link>
        </nav>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 py-16 text-center sm:px-8 sm:py-24">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Private by design
          </span>
          <h1
            className="font-semibold tracking-tight text-foreground"
            style={{ fontSize: "clamp(2.25rem, 5vw + 1rem, 4rem)", lineHeight: 1.05 }}
          >
            A calm space for <br className="hidden sm:block" />
            <span className="text-primary">how you really feel.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Serene is a private mood journal with a gentle AI companion. Log a
            mood, add a note, and receive a warm one-line reflection — then
            watch patterns emerge over time.
          </p>
          <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/signup"
              className={buttonVariants({
                size: "lg",
                className: "w-full sm:w-auto",
              })}
            >
              Start journaling — it&apos;s free
            </Link>
            <Link
              href="/login"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className: "w-full sm:w-auto",
              })}
            >
              I already have an account
            </Link>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-5xl gap-4 px-5 pb-20 sm:grid-cols-3 sm:px-8">
          <Feature
            icon={<Heart className="h-5 w-5 text-primary" />}
            title="Empathetic by design"
            body="Every reflection is a warm one-to-two sentence response — never clinical, never pushy."
          />
          <Feature
            icon={<Lock className="h-5 w-5 text-primary" />}
            title="Your journal, yours alone"
            body="Row-level security in Supabase. No one — not even Serene admins — sees your entries."
          />
          <Feature
            icon={<LineChart className="h-5 w-5 text-primary" />}
            title="Patterns, not pressure"
            body="A gentle weekly overview so you can notice what lifts you and what weighs you down."
          />
        </section>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-5 py-6 text-center text-xs text-muted-foreground sm:px-8">
        Made with care. Serene is not a substitute for professional support.
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-5 backdrop-blur">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </div>
      <h3 className="mt-3 text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}
