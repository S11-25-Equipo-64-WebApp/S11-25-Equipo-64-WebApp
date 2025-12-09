"use client";

import "@/app/globals.css";
import {
  Badge,
  Breadcrumb,
  Button,
  Input,
  Label,
  Textarea,
  ToggleSwitch,
} from "@/components/ui";
import { notFound } from "next/navigation";

export default function ComponentsPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-md font-bold mb-12">Default Components</h2>

      <section className="flex flex-col gap-4">
        <Button>Click me</Button>
        <Badge />
        <Breadcrumb />
        <Input />
        <Label />
        <Textarea />
        <ToggleSwitch
          checked={true}
          onChange={() => {}}
        />
      </section>
    </div>
  );
}
