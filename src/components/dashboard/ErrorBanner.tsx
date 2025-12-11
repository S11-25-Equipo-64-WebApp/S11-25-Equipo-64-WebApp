import { AlertTriangle } from "lucide-react";

import type { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

type Props = {
  error?: ApiError | null;
  className?: string;
  title?: string;
};

export function ErrorBanner({ error, className, title }: Props) {
  if (!error) return null;

  return (
    <div
      role="status"
      className={cn(
        "flex gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive shadow-sm",
        className
      )}
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2 font-medium">
          <span>{title ?? "Algo salió mal"}</span>
          <span className="text-xs text-destructive/80">
            {error.status ? `(${error.status})` : null} {error.code ?? null}
          </span>
        </div>
        <p className="text-sm leading-relaxed">{error.message}</p>
        {error.issues && error.issues.length > 0 ? (
          <ul className="list-disc space-y-1 pl-4 text-xs text-destructive/80">
            {error.issues.map((issue, index) => (
              <li key={`${issue.message ?? index}-${index}`}>
                {issue.path?.length ? `${issue.path.join(".")}: ` : ""}
                {issue.message ?? "Error de validación"}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
