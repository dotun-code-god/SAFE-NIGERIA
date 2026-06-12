import React from "react";
import Link from "next/link";
import { Waves } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-none px-8 py-12">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Waves className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">SAFE-NIGERIA</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            A research initiative of Obafemi Awolowo University, Ile-Ife.
          </p>
        </div>
        <div className="flex gap-8 text-xs text-muted-foreground">
          <a href="#problem" className="hover:text-foreground">Problem</a>
          <a href="#solution" className="hover:text-foreground">Solution</a>
          <a href="#how" className="hover:text-foreground">Technology</a>
          <Link href="/portal" className="hover:text-foreground">Portal</Link>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} · Built in Ile-Ife
        </p>
      </div>
    </footer>
  );
}
