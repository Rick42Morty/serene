import Link from "next/link";
import { SereneLogo } from "@/components/serene-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-calm-gradient">
      <header className="mx-auto flex w-full max-w-5xl items-center px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <SereneLogo size={30} />
          <span className="text-lg font-semibold tracking-tight">Serene</span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-5 pb-20 sm:px-8">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
