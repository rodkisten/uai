import type { ReactNode } from "react";
import { ShieldAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
export function SessionAlert({
  title,
  description,
  busy = false,
  onRetry,
  action,
}: {
  title: string;
  description: string;
  busy?: boolean;
  onRetry: () => void;
  action?: ReactNode;
}) {
  return (
    <aside
      role="alert"
      className="flex min-w-0 flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3 text-sm"
    >
      <ShieldAlert size={20} />
      <div className="min-w-0 flex-1">
        <strong>{title}</strong>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={onRetry}
        disabled={busy}
      >
        <RefreshCw size={14} /> Check again
      </Button>
      {action}
    </aside>
  );
}
