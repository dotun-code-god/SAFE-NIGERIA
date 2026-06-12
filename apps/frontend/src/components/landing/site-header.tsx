import Link from "next/link";
import { Waves } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-none items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-[var(--gradient-signal)]">
            <Waves className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            <span className="absolute inset-0 animate-ping rounded-md bg-primary/30" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">SAFE-NIGERIA</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Flood Intelligence
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#problem" className="transition hover:text-foreground">Problem</a>
          <a href="#solution" className="transition hover:text-foreground">Solution</a>
          <a href="#how" className="transition hover:text-foreground">How it Works</a>
          <a href="#impact" className="transition hover:text-foreground">Impact</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/portal"
            className="hidden rounded-md border border-border px-3.5 py-2 text-xs font-medium text-foreground transition hover:bg-secondary sm:inline-block"
          >
            Live Portal
          </Link>
          <Link
            href="/portal"
            className="rounded-md bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Government Login
          </Link>
        </div>
      </div>
    </header>
  );
}
