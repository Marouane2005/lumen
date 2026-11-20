import { cn } from "@/lib/utils";

/** The glowing gold mark that stands in for Lumen's avatar. */
export function LumenMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex size-9 shrink-0 items-center justify-center rounded-full",
        "bg-[radial-gradient(circle_at_35%_30%,oklch(0.92_0.09_82),oklch(0.76_0.13_68)_55%,oklch(0.55_0.11_48))]",
        "shadow-[0_0_0_1px_oklch(0.76_0.13_68/0.35),0_0_22px_oklch(0.76_0.13_68/0.28)]",
        className,
      )}
    >
      <span className="size-3 rounded-full bg-[oklch(0.99_0.02_85)]/85 blur-[1px]" />
    </span>
  );
}
