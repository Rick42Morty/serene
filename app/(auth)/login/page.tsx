"use client";

import Link from "next/link";
import { useState, useActionState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, type AuthState } from "../actions";

const initial: AuthState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initial);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
        Welcome back
      </p>
      <h1 className="font-display text-3xl sm:text-4xl font-light leading-tight mb-2">
        Step back{" "}
        <span className="italic gradient-text">into stillness.</span>
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Your reflections are waiting — exactly as you left them.
      </p>

      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-xs uppercase tracking-wider text-muted-foreground"
          >
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@quiet.space"
            className="h-12 rounded-xl bg-card"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-xs uppercase tracking-wider text-muted-foreground"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="h-12 rounded-xl bg-card"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <p role="alert" className="min-h-5 text-sm text-destructive">
          {state.error}
        </p>

        <Button
          type="submit"
          className="w-full h-12 rounded-full group"
          disabled={pending}
        >
          {pending ? "Signing in…" : "Continue"}
          {!pending && (
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground pt-2">
          New here?{" "}
          <Link
            href="/signup"
            className="text-foreground font-medium hover:underline"
          >
            Create your space
          </Link>
        </p>
      </form>
    </>
  );
}
