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
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type HeroStatCardProps = {
  label: string;
  value: string;
  icon: ElementType;
  iconGradient: {
    from: string;
    to: string;
  };
  iconColor?: string;
  glowColor?: keyof typeof relColors;
  glowBase?: string;
  glowOpacity?: number;
  glowRadius?: number;
  glowFalloff?: number;
  className?: string;
};

export function HeroStatCard({
  label,
  value,
  icon: Icon,
  iconGradient,
  iconColor,
  glowColor = "primary",
  glowBase,
  glowOpacity = 0.35,
  glowRadius = 500,
  glowFalloff = 65,
  className,
}: HeroStatCardProps) {
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
    <Card
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card/90 p-4 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg",
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
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(${glowRadius}px circle at var(--x) var(--y), color-mix(in oklch, ${baseColor} ${
            glowOpacity * 100
          }%, transparent), transparent ${glowFalloff}%)`,
        }}
        aria-hidden="true"
      />
      <div className="relative flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground shadow-lg shadow-primary/20"
          style={{
            backgroundImage: `linear-gradient(135deg, ${iconGradient.from}, ${iconGradient.to})`,
            color: iconColor ?? "#0b1224",
          }}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-primary/70">
            {label}
          </p>
          <p className="text-lg font-semibold leading-tight text-foreground">{value}</p>
        </div>
      </div>
    </Card>
  );
}
