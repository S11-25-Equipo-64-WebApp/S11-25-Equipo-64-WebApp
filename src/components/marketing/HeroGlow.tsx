"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

type HeroGlowProps = {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowOpacity?: number;
  radius?: number;
};

export function HeroGlow({
  children,
  className,
  glowColor = "var(--color-primary)",
  glowOpacity = 0.35,
  radius = 900,
}: HeroGlowProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
    const target = ref.current;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setPosition({ x, y });
  }

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn("relative overflow-hidden", className)}
      style={
        {
          "--x": `${position.x}px`,
          "--y": `${position.y}px`,
        } as React.CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 lg:opacity-100"
        style={{
          background: `radial-gradient(${radius}px circle at var(--x) var(--y), color-mix(in oklch, ${glowColor} ${
            glowOpacity * 100
          }%, transparent), transparent 65%)`,
        }}
        aria-hidden="true"
      />
      {children}
    </section>
  );
}
