"use client";

import { useRouter } from "next/navigation";

import { EntryForm } from "@/components/dashboard/EntryForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiContext } from "@/context/api-context";

export default function NewEntryPage() {
  const router = useRouter();
  const { role } = useApiContext();

  return (
    <div className="space-y-4">
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Nuevo testimonio</CardTitle>
          <CardDescription>
            POST /entries siempre crea en estado draft. Si hay conflicto de slug (409) se mostrará
            para ajustar el título o slug antes de reenviar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EntryForm
            mode="create"
            role={role}
            onSaved={(entry) => router.push(`/dashboard/entries/${entry.slug}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
