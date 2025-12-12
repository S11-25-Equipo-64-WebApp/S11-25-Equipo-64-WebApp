"use client";

import { Copy, ShieldCheck, Video } from "lucide-react";

import { HeroStatCard } from "@/components/marketing/HeroStatCard";

const stats = [
  {
    label: "Roles listos",
    value: "Admin · Editor",
    icon: ShieldCheck,
    iconGradient: {
      from: "#d8d7ff",
      to: "#7c3aed",
    },
    glowColor: "primary",
    glowRadius: 520,
    glowOpacity: 0.45,
  },
  {
    label: "Embeds",
    value: "Copy & paste",
    icon: Copy,
    iconGradient: {
      from: "#a5f3fc",
      to: "#0ea5e9",
    },
    glowColor: "accent",
    glowRadius: 500,
    glowOpacity: 0.45,
  },
  {
    label: "Medios",
    value: "Texto · Imagen · Video",
    icon: Video,
    iconGradient: {
      from: "#fecdd3",
      to: "#fb7185",
    },
    glowColor: "secondary",
    glowRadius: 500,
    glowOpacity: 0.45,
  },
] as const satisfies Array<Parameters<typeof HeroStatCard>[0]>;

export function HeroStatsGrid() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-3">
      {stats.map((stat) => (
        <HeroStatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
