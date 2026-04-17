"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, PenLine, LineChart, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SereneLogo } from "@/components/serene-logo";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/(auth)/actions";

const LINKS = [
  { href: "/dashboard", label: "Journal", icon: Home },
  { href: "/journal/new", label: "New entry", icon: PenLine },
  { href: "/insights", label: "Insights", icon: LineChart },
];

export function AppNav({ email }: { email: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <SereneLogo size={26} />
          <span className="text-base font-semibold tracking-tight">Serene</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active =
              pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {email && (
            <span className="max-w-[160px] truncate text-xs text-muted-foreground">
              {email}
            </span>
          )}
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </form>
        </div>

        {/* Mobile trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden"
            render={<Button variant="ghost" size="icon" aria-label="Open menu" />}
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <SheetTitle className="px-6 pt-6 text-base">Menu</SheetTitle>
            <nav className="mt-4 flex flex-col gap-1 px-4">
              {LINKS.map((l) => {
                const active =
                  pathname === l.href || pathname.startsWith(l.href + "/");
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm",
                      active
                        ? "bg-secondary text-secondary-foreground"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    <l.icon className="h-5 w-5" />
                    {l.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto border-t border-border/60 p-4">
              {email && (
                <p className="mb-3 px-1 text-xs text-muted-foreground break-all">
                  {email}
                </p>
              )}
              <form action={logoutAction}>
                <Button type="submit" variant="outline" className="w-full">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
