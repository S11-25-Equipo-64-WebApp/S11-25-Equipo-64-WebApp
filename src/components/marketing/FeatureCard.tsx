"use client";

import {
  type CSSProperties,
  type ElementType,
  type MouseEvent,
  useRef,
  useState,
} from "react";

import type { ColorScale } from "@/lib/constants/colors";
import { relColors } from "@/lib/constants/colors";
import { cn } from "@/lib/utils";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ElementType;
  accent: string;
  glowColor: keyof typeof relColors;
  glowBase?: string;
  glowOpacity?: number;
  glowRadius?: number;
  glowFalloff?: number;
  iconGradient: {
    from: string;
    to: string;
  };
  iconColor?: string;
  className?: string;
};

export function FeatureCard({
  title,
  description,
  icon: Icon,
  accent,
  glowColor,
  glowBase,
  glowOpacity = 0.35,
  glowRadius = 500,
  glowFalloff = 60,
  iconGradient,
  iconColor,
  className,
}: FeatureCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement | null>(null);

  const palette = relColors[glowColor] as ColorScale | Record<string, string>;
  const baseColor =
    glowBase ??
    (palette as ColorScale)["500"] ??
    (palette as Record<string, string>)["500"] ??
    Object.values(palette)[0];

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const target = cardRef.current;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setPosition({ x, y });
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg",
        className
      )}
      style={
        {
          "--x": `${position.x}px`,
          "--y": `${position.y}px`,
        } as CSSProperties
      }
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-15`}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-50/70 via-white/60 to-slate-50/60 blur-[1px] dark:from-slate-900/60 dark:via-slate-900/40 dark:to-slate-950/60"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-14 top-0 h-32 w-32 rounded-full blur-3xl opacity-50"
        style={{ background: iconGradient.from }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-36 w-36 rounded-full blur-3xl opacity-45"
        style={{ background: iconGradient.to }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(${glowRadius}px circle at var(--x) var(--y), color-mix(in oklch, ${baseColor} ${glowOpacity * 100}%, transparent), transparent ${glowFalloff}%)`,
        }}
        aria-hidden="true"
      />
      <div className="relative space-y-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-primary-foreground shadow-lg shadow-primary/15"
          style={{
            backgroundImage: `linear-gradient(135deg, ${iconGradient.from}, ${iconGradient.to})`,
            color: iconColor ?? "#0b1224",
          }}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
