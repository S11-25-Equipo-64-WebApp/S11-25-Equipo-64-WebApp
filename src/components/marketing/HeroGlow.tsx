"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

type HeroGlowProps = {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowOpacity?: number;
  radius?: number;
  hoverGlow?: boolean;
};

export function HeroGlow({
  children,
  className,
  glowColor = "var(--color-primary)",
  glowOpacity = 0.35,
  radius = 900,
  hoverGlow,
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

  const containerClass = cn("relative overflow-hidden", hoverGlow && "group", className);
  const overlayClasses = cn(
    "pointer-events-none absolute inset-0 transition duration-300",
    hoverGlow ? "opacity-0 group-hover:opacity-100" : "opacity-0 lg:opacity-100"
  );

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className={containerClass}
      style={
        {
          "--x": `${position.x}px`,
          "--y": `${position.y}px`,
        } as React.CSSProperties
      }
    >
      <div
        className={overlayClasses}
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
