import Link from "next/link";
import { Lock } from "lucide-react";
import { SereneLogo } from "@/components/serene-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh">
      {/* Left panel — branding / motivation (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-auth-gradient p-10 xl:p-14">
        <Link href="/" className="flex items-center gap-2">
          <SereneLogo size={30} />
          <span className="text-lg font-semibold tracking-tight">Serene</span>
        </Link>

        <div className="max-w-md">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
            A quiet companion
          </p>
          <blockquote className="font-display text-3xl xl:text-4xl font-light leading-snug">
            &ldquo;Three breaths. One clearer mind.{" "}
            <span className="italic gradient-text">
              Begin where you are.
            </span>
            &rdquo;
          </blockquote>

          <div className="mt-10 flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/15">
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium">Your private space</div>
              <div className="text-xs text-muted-foreground">
                End-to-end private &middot; Never shared
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Serene
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full lg:w-1/2 flex-col bg-background">
        {/* Mobile header */}
        <header className="flex items-center px-5 py-5 sm:px-8 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <SereneLogo size={30} />
            <span className="text-lg font-semibold tracking-tight">
              Serene
            </span>
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-5 pb-16 sm:px-8">
          <div className="w-full max-w-sm">{children}</div>
        </main>
      </div>
    </div>
  );
}
