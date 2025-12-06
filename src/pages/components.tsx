import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/mode-toggle";
import "../app/globals.css";

export const dynamic = "force-dynamic";

export default function ComponentsDemoPage() {
  // 1. server side rendering lives here
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  // 2. Rendering
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex flex-col items-center gap-8 p-10">
        {/* Button Section */}
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-xl font-bold">Button</h1>
          <Button>Click me</Button>
        </div>

        {/* Mode Toggle Section */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-bold">Mode Toggle</h1>
          <ModeToggle />
        </div>
      </div>
    </ThemeProvider>
  );
}
