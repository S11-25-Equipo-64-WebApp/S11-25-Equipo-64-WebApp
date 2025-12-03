"use client";

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background/95 px-4">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Testimonial CMS · Equipo 64</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/privacy" className="hover:text-primary">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-primary">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-primary">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
