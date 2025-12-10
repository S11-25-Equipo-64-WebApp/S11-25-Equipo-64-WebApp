import { MessageSquareQuote } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";

type LogoProps = {
  href?: string;
  showText?: boolean;
  size?: LogoSize;
  className?: string;
  labelClassName?: string;
};

const logoSizes: Record<LogoSize, { icon: string; text: string; wrapper: string }> = {
  sm: { icon: "h-4 w-4", text: "text-base", wrapper: "h-9 w-9" },
  md: { icon: "h-5 w-5", text: "text-lg", wrapper: "h-10 w-10" },
  lg: { icon: "h-6 w-6", text: "text-xl", wrapper: "h-11 w-11" },
};

export function Logo({
  href = "/",
  showText = true,
  size = "md",
  className,
  labelClassName,
}: LogoProps) {
  const sizeTokens = logoSizes[size];

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-foreground transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      aria-label="Volver al inicio"
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/25 transition-transform group-hover:scale-105 group-active:scale-95",
          sizeTokens.wrapper
        )}
      >
        <MessageSquareQuote className={sizeTokens.icon} aria-hidden="true" />
      </span>
      {showText ? (
        <span
          className={cn(
            "font-semibold tracking-tight text-foreground",
            sizeTokens.text,
            labelClassName
          )}
        >
          Testimonial CMS
        </span>
      ) : null}
    </Link>
  );
}
