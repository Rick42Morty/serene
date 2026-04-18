import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import {
  Brain,
  Heart,
  Lock,
  Sparkles,
  LineChart,
  Leaf,
  ArrowRight,
  Check,
} from "lucide-react";
import { SereneLogo } from "@/components/serene-logo";
import { createClient } from "@/lib/supabase/server";

export default async function Landing() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-medium">
            <SereneLogo size={28} />
            Serene
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={buttonVariants({ variant: "ghost", size: "sm", className: "hidden sm:inline-flex" })}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className={buttonVariants({ size: "sm", className: "rounded-full" })}
            >
              Begin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-36 grain">
        {/* Floating orbs */}
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full bg-sage-soft/40 blur-3xl animate-float-slow" />
        <div className="absolute top-40 -right-32 w-[500px] h-[500px] rounded-full bg-blush/30 blur-3xl animate-float" />
        <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] rounded-full bg-lavender/30 blur-3xl animate-float-slow" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/80 backdrop-blur border border-border/60 text-xs font-medium text-muted-foreground mb-8 animate-fade-up">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            AI-guided reflection — private by design
          </div>
          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[0.95] mb-8 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            A quiet place
            <br />
            <span className="italic gradient-text font-normal">for your mind.</span>
          </h1>
          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Serene is a beautifully private journal that helps you understand your moods,
            uncover patterns, and feel heard — with empathetic AI insights.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/signup"
              className={buttonVariants({
                size: "lg",
                className: "rounded-full px-8 h-12 text-base group",
              })}
            >
              Start journaling free
              <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <p
            className="text-xs text-muted-foreground/70 mt-6 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            No credit card · End-to-end private · Cancel anytime
          </p>

          {/* Hero visual */}
          <div
            id="hero-visual"
            className="relative mt-20 animate-fade-up scroll-mt-24"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute -inset-8 bg-gradient-to-br from-sage-soft/40 via-blush/30 to-lavender/40 rounded-[3rem] blur-2xl" />
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-glow border border-border/50">
                <Image
                  src="/hero-orb.jpeg"
                  alt="Serene mood journaling visual"
                  width={1280}
                  height={800}
                  className="w-full aspect-[16/10] object-cover"
                  priority
                />
                {/* Floating UI cards */}
                <div className="absolute top-6 left-6 md:top-10 md:left-10 bg-card/95 backdrop-blur rounded-2xl p-4 shadow-soft border border-border/50 animate-float">
                  <div className="text-xs text-muted-foreground mb-1">Today, 9:42 AM</div>
                  <div className="font-display text-lg">Feeling calm 🌿</div>
                </div>
                <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 bg-card/95 backdrop-blur rounded-2xl p-4 shadow-soft border border-border/50 max-w-xs animate-float-slow">
                  <div className="flex items-center gap-2 text-xs text-accent font-medium mb-2">
                    <Sparkles className="w-3 h-3" /> Vibe check
                  </div>
                  <p className="text-sm leading-relaxed">
                    It sounds like the morning walk grounded you. Notice that feeling — it&apos;s worth returning to.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-12 border-y border-border/50 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { v: "12K+", l: "Daily reflections" },
            { v: "94%", l: "Feel more aware" },
            { v: "100%", l: "Private entries" },
            { v: "4.9★", l: "User rating" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-3xl md:text-4xl text-foreground">{s.v}</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 md:py-36 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-20">
            <div className="text-xs uppercase tracking-[0.2em] text-primary mb-4">What&apos;s inside</div>
            <h2 className="font-display text-4xl md:text-6xl font-light leading-tight">
              Built to feel like a <span className="italic gradient-text">deep breath.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(
              [
                {
                  icon: Heart,
                  title: "Mood, beautifully captured",
                  body: "Pick from soft, expressive states. Tag what\u2019s around you — work, sleep, relationships. No clinical sliders.",
                  tone: "bg-blush/30",
                },
                {
                  icon: Brain,
                  title: "AI Vibe Check",
                  body: "An empathetic companion reads your reflection and offers a one-line insight. Never advice. Always kind.",
                  tone: "bg-sage-soft/40",
                },
                {
                  icon: LineChart,
                  title: "Patterns over time",
                  body: "Weekly visual summaries reveal what lifts you and what weighs you down. Without judgement.",
                  tone: "bg-lavender/40",
                },
                {
                  icon: Lock,
                  title: "Yours alone",
                  body: "Entries are encrypted and tied to your account. We can\u2019t read them. Neither can anyone else.",
                  tone: "bg-cream-deep/60",
                },
                {
                  icon: Leaf,
                  title: "A calm interface",
                  body: "Soft typography, generous space, gentle motion. Designed for the moments you need to slow down.",
                  tone: "bg-blush/30",
                },
                {
                  icon: Sparkles,
                  title: "Reflective rituals",
                  body: "Gentle prompts when you feel stuck. Optional daily check-ins. Always at your pace.",
                  tone: "bg-sage-soft/40",
                },
              ] as const
            ).map((f) => (
              <div
                key={f.title}
                className="group relative p-8 rounded-3xl bg-card border border-border/60 hover:shadow-soft transition-all duration-500 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-2xl ${f.tone} flex items-center justify-center mb-6`}>
                  <f.icon className="w-5 h-5 text-foreground/80" />
                </div>
                <h3 className="font-display text-xl mb-3">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-28 md:py-36 bg-muted/40 relative grain">
        <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-sage-soft/30 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="text-xs uppercase tracking-[0.2em] text-primary mb-4">A gentle ritual</div>
            <h2 className="font-display text-4xl md:text-6xl font-light leading-tight max-w-3xl mx-auto">
              Three breaths. <span className="italic gradient-text">One clearer mind.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-4">
            {[
              { n: "01", t: "Notice how you feel", b: "Tap a mood. Add tags for what\u2019s shaping today. It takes seconds." },
              { n: "02", t: "Write what\u2019s on your mind", b: "A few sentences is enough. No format. No pressure. Just thoughts." },
              { n: "03", t: "Receive a kind reflection", b: "Your AI companion offers a soft insight — and it\u2019s saved to your timeline." },
            ].map((step, i) => (
              <div key={step.n} className="relative">
                <div className="bg-card rounded-3xl p-8 border border-border/50 h-full">
                  <div className="font-display text-5xl text-primary/50 mb-6">{step.n}</div>
                  <h3 className="font-display text-2xl mb-3">{step.t}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.b}</p>
                </div>
                {i < 2 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-28 md:py-36">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-primary mb-8">Loved by quiet thinkers</div>
          <blockquote className="font-display text-3xl md:text-5xl font-light leading-tight">
            &ldquo;I&apos;ve journaled for years, but Serene is the first app that
            <span className="italic gradient-text"> actually feels like company.</span>
            {" "}The vibe checks are uncannily kind.&rdquo;
          </blockquote>
          <div className="mt-10 flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blush/40 to-accent" />
            <div className="text-left">
              <div className="font-medium text-sm">Maya Chen</div>
              <div className="text-xs text-muted-foreground">Designer · Lisbon</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / CTA */}
      <section id="pricing" className="py-28 md:py-36 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative rounded-[2.5rem] p-12 md:p-20 text-center overflow-hidden border border-border/60 shadow-glow">
            <div className="absolute inset-0 bg-gradient-to-br from-sage-soft/50 via-cream-deep/40 to-blush/40" />
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-lavender/40 blur-3xl animate-breathe" />
            <div className="relative">
              <h2 className="font-display text-4xl md:text-6xl font-light mb-6 leading-tight">
                Begin your <span className="italic">first reflection</span> today.
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
                Free forever for daily journaling. Upgrade anytime for deeper AI insights.
              </p>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10 text-sm text-foreground/80">
                {["Unlimited entries", "Daily AI vibe check", "Private & encrypted", "Web + mobile"].map((p) => (
                  <span key={p} className="inline-flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-primary" /> {p}
                  </span>
                ))}
              </div>

              <Link
                href="/signup"
                className={buttonVariants({
                  size: "lg",
                  className: "rounded-full px-10 h-14 text-base",
                })}
              >
                Create your space
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
              <p className="text-xs text-muted-foreground mt-5">Free plan · No card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display text-lg">
            <SereneLogo size={20} />
            Serene
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Serene. Crafted with quiet care.</p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
