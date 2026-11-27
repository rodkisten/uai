import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
export type KeyValueRow = { id: string; key: string; value: string };
export function KeyValueEditor({
  rows,
  onChange,
  onAdd,
  disabled = false,
}: {
  rows: readonly KeyValueRow[];
  onChange: (rows: KeyValueRow[]) => void;
  onAdd: () => void;
  disabled?: boolean;
}) {
  const update = (id: string, patch: Partial<Pick<KeyValueRow, "key" | "value">>) =>
    onChange(rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  return (
    <div className="grid min-w-0 gap-2">
      {rows.map((row) => (
        <div
          key={row.id}
          className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-1"
        >
          <Input
            aria-label="Key"
            autoCapitalize="none"
            value={row.key}
            disabled={disabled}
            onChange={(e) => update(row.id, { key: e.target.value })}
          />
          <Input
            aria-label="Value"
            autoCapitalize="none"
            value={row.value}
            disabled={disabled}
            onChange={(e) => update(row.id, { value: e.target.value })}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Remove row"
            disabled={disabled}
            onClick={() => onChange(rows.filter((item) => item.id !== row.id))}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={onAdd}>
        <Plus size={14} /> Add variable
      </Button>
    </div>
  );
}
