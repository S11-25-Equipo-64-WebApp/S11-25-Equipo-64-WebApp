import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";

import "../app/globals.css";

import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/mode-toggle";

export async function getServerSideProps() {
  if (process.env.NODE_ENV !== "development") {
    return { notFound: true };
  }
  return { props: {} };
}

// components demo page
export default function ComponentsDemoPage() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex flex-col items-center">
        {/* button */}
        <div className="flex flex-col items-center justify-center">
          <h1>Button</h1>
          <Button>Click me</Button>
        </div>

        {/* mode toggle */}
        <div>
          <h1>Mode Toggle</h1>
          <ModeToggle />
        </div>
      </div>
    </ThemeProvider>
  );
}
