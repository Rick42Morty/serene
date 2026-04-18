"use client";

import Link from "next/link";
import { useState, useActionState } from "react";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupAction, type AuthState } from "../actions";

const initial: AuthState = { error: null };

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signupAction, initial);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
        Begin
      </p>
      <h1 className="font-display text-3xl sm:text-4xl font-light leading-tight mb-2">
        Create your{" "}
        <span className="italic gradient-text">quiet place.</span>
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        A few details and you&apos;ll be in. No noise. No tracking.
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
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="At least 8 characters"
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

        <ul className="space-y-1.5 text-xs text-muted-foreground">
          {[
            "End-to-end private — only you read your entries",
            "Free forever for daily journaling",
            "No credit card required",
          ].map((p) => (
            <li key={p} className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-primary shrink-0" />
              {p}
            </li>
          ))}
        </ul>

        {state.error && (
          <p role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full h-12 rounded-full group"
          disabled={pending}
        >
          {pending ? "Creating…" : "Create my space"}
          {!pending && (
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          By continuing you agree to our{" "}
          <Link href="#" className="underline hover:text-foreground">
            Terms
          </Link>{" "}
          &{" "}
          <Link href="#" className="underline hover:text-foreground">
            Privacy
          </Link>
          .
        </p>

        <p className="text-center text-sm text-muted-foreground">
          Already have a space?{" "}
          <Link
            href="/login"
            className="text-foreground font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </>
  );
}
