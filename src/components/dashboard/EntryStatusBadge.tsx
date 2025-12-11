import { Badge } from "@/components/ui/badge";
import { EntryStatus } from "@/lib/enums/entry-status";

type Props = {
  status: EntryStatus;
};

export function EntryStatusBadge({ status }: Props) {
  const isApproved = status === EntryStatus.APPROVED;

  return (
    <Badge
      variant={isApproved ? "default" : "outline"}
      className={
        isApproved
          ? "bg-emerald-500/15 text-emerald-700 shadow-sm dark:bg-emerald-500/20 dark:text-emerald-100"
          : "border-amber-400/60 text-amber-600 dark:border-amber-200/40 dark:text-amber-100"
      }
    >
      {isApproved ? "Aprobado" : "Borrador"}
    </Badge>
  );
}
