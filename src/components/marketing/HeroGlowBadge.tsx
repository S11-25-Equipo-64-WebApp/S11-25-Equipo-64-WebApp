"use client";

import {
  type CSSProperties,
  type MouseEvent,
  useRef,
  useState,
} from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type HeroGlowBadgeProps = {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowOpacity?: number;
  glowRadius?: number;
  glowFalloff?: number;
};

export function HeroGlowBadge({
  children,
  className,
  glowColor = "#f6c7da",
  glowOpacity = 0.4,
  glowRadius = 220,
  glowFalloff = 70,
}: HeroGlowBadgeProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const badgeRef = useRef<HTMLDivElement | null>(null);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const target = badgeRef.current;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setPosition({ x, y });
  }

  return (
    <div
      ref={badgeRef}
      onMouseMove={handleMouseMove}
      className={cn("relative inline-flex group rounded-full", className)}
      style={
        {
          "--x": `${position.x}px`,
          "--y": `${position.y}px`,
        } as CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 rounded-full"
        style={{
          background: `radial-gradient(${glowRadius}px circle at var(--x) var(--y), color-mix(in oklch, ${glowColor} ${
            glowOpacity * 100
          }%, transparent), transparent ${glowFalloff}%)`,
        }}
        aria-hidden="true"
      />
      <Badge
        variant="outline"
        className="relative rounded-full border-primary/30 bg-primary/10 text-primary"
      >
        {children}
      </Badge>
    </div>
  );
}
