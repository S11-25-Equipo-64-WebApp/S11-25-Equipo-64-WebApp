"use client";

import {
  type CSSProperties,
  type ComponentProps,
  type MouseEvent,
  useRef,
  useState,
} from "react";

import type { ColorScale } from "@/lib/constants/colors";
import { relColors } from "@/lib/constants/colors";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type GlowButtonProps = ComponentProps<typeof Button> & {
  glowColor?: keyof typeof relColors;
  glowBase?: string;
  glowOpacity?: number;
  glowRadius?: number;
  glowFalloff?: number;
  accent?: string;
  containerClassName?: string;
};

export function GlowButton({
  className,
  containerClassName,
  glowColor = "primary",
  glowBase,
  glowOpacity = 0.4,
  glowRadius = 420,
  glowFalloff = 65,
  accent = "from-primary/25 via-secondary/20 to-transparent",
  ...props
}: GlowButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement | null>(null);

  const palette = relColors[glowColor] as ColorScale | Record<string, string>;
  const baseColor =
    glowBase ??
    (palette as ColorScale)["500"] ??
    (palette as Record<string, string>)["500"] ??
    Object.values(palette)[0];

  function handleMove(event: MouseEvent<HTMLDivElement>) {
    const target = ref.current;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setPosition({ x, y });
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={cn("group relative inline-block", containerClassName)}
      style={
        {
          "--x": `${position.x}px`,
          "--y": `${position.y}px`,
        } as CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(${glowRadius}px circle at var(--x) var(--y), color-mix(in oklch, ${baseColor} ${glowOpacity * 100}%, transparent), transparent ${glowFalloff}%)`,
        }}
        aria-hidden="true"
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br opacity-30 blur-md",
          accent
        )}
        aria-hidden="true"
      />
      <Button
        className={cn("relative z-10 rounded-xl px-7", className)}
        {...props}
      />
    </div>
  );
}
