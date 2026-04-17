import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Pixel size of the round mark. Defaults to 28. */
  size?: number;
};

/**
 * Serene brand mark: a green circle with a soft "S" inside.
 * Uses the app's primary (green) color via `bg-primary`.
 */
export function SereneLogo({ className, size = 28 }: Props) {
  const fontSize = Math.round(size * 0.62);
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize,
        fontFamily:
          "var(--font-sans), ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
        fontWeight: 600,
        letterSpacing: "-0.02em",
        lineHeight: 1,
      }}
    >
      S
    </span>
  );
}
