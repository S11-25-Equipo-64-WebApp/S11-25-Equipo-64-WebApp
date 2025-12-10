 "use client";

import type { ElementType } from "react";
import { Settings, Share2, Upload, Users } from "lucide-react";

import { relColors } from "@/lib/constants/colors";
import { FeatureCard } from "@/components/marketing/FeatureCard";

type Feature = {
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
};

const features: Feature[] = [
  {
    title: "Captura fácil",
    description: "Formularios personalizados para texto, imagen y video.",
    icon: Upload,
    accent: "from-[#c7d7ff] to-[#9bb8ff]",
    glowColor: "primary",
    glowOpacity: 0.45,
    glowRadius: 520,
    iconGradient: {
      from: "#82c6ff",
      to: "#1e66f5",
    },
    iconColor: "#0b1224",
  },
  {
    title: "Gestión total",
    description: "Organiza, aprueba y edita desde un panel dedicado.",
    icon: Settings,
    accent: "from-[#ecd4ff] to-[#c9b5ff]",
    glowColor: "secondary",
    glowOpacity: 0.5,
    glowRadius: 540,
    glowFalloff: 65,
    iconGradient: {
      from: "#e0b3ff",
      to: "#7c3aed",
    },
    iconColor: "#120b2f",
  },
  {
    title: "Trabajo en equipo",
    description: "Roles Admin y Editor para colaborar sin fricción.",
    icon: Users,
    accent: "from-[#a9f1f7] to-[#c7d7ff]",
    glowColor: "accent",
    glowOpacity: 0.5,
    glowFalloff: 62,
    iconGradient: {
      from: "#4be8dc",
      to: "#0ea5e9",
    },
    iconColor: "#062c34",
  },
  {
    title: "Integración simple",
    description: "Embeds listos para tu sitio web en segundos.",
    icon: Share2,
    accent: "from-[#ffe5f5] to-[#c7d7ff]",
    glowColor: "neutral",
    glowBase: "#74c7ec",
    glowOpacity: 0.45,
    glowRadius: 500,
    glowFalloff: 58,
    iconGradient: {
      from: "#f472b6",
      to: "#74c7ec",
    },
    iconColor: "#0f172a",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="space-y-8">
      <div className="space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#2563eb]">
          ¿Cómo funciona?
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
          Tres pasos simples para mostrar prueba social
        </h2>
        <p className="text-slate-600 dark:text-slate-200 sm:mx-auto sm:max-w-2xl">
          Diseñado a partir de la landing de frontend-rel: captura, modera y comparte embeds accesibles
          sin perder consistencia con nuestro sistema de diseño.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            accent={feature.accent}
            glowColor={feature.glowColor}
            glowBase={feature.glowBase}
            glowOpacity={feature.glowOpacity}
            glowRadius={feature.glowRadius}
            glowFalloff={feature.glowFalloff}
            iconGradient={feature.iconGradient}
            iconColor={feature.iconColor}
          />
        ))}
      </div>
    </section>
  );
}
