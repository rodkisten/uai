/** @jsxImportSource react */
import type { ReactNode } from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

/** Presentation-only primitive; independent of userscript runtime state. */
export function DockHeader({ title, closeLabel }: { title: string; closeLabel: string }) {
  return (
    <header className="panel-header flex shrink-0 items-center justify-between gap-2 border-b border-border p-3">
      <Dialog.Title className="panel-title text-sm font-semibold text-foreground">{title}</Dialog.Title>
      <Dialog.Close className="btn btn--icon inline-flex size-8 items-center justify-center rounded-md hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring" aria-label={closeLabel}>
        <X size={16} aria-hidden="true" />
      </Dialog.Close>
    </header>
  );
}

export function DockSearch({
  id,
  label,
  variant,
  placeholder,
  value,
  onChange,
}: {
  id?: string;
  label?: string;
  variant: "spaced" | "block";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      id={id}
      aria-label={label}
      className={`input input--${variant} w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-base text-foreground`}
      type="search"
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck={false}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function DockOverlay({ secondary = false, onClose }: { secondary?: boolean; onClose: () => void }) {
  return (
    <div
      className={`overlay fixed inset-0 bg-black/50 ${secondary ? "overlay--secondary z-[61]" : "z-[59]"}`}
      aria-hidden="true"
      onClick={onClose}
    />
  );
}

/** Non-modal Radix composition avoids document-level scroll locking in shadow roots. */
export function DockPanel({
  open,
  onOpenChange,
  portal,
  title,
  closeLabel,
  secondary = false,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portal: HTMLElement;
  title: string;
  closeLabel: string;
  secondary?: boolean;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root modal={false} open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal container={portal}>
        {open && <DockOverlay secondary={secondary} onClose={() => onOpenChange(false)} />}
        <Dialog.Content className={`panel fixed inset-x-0 bottom-0 flex max-h-[85dvh] flex-col overflow-hidden rounded-t-xl border border-border bg-background text-foreground shadow-xl sm:inset-x-auto sm:right-4 sm:w-[420px] ${secondary ? "z-[62]" : "z-[60]"}`} {...(!description ? { "aria-describedby": undefined } : {})}>
          <DockHeader title={title} closeLabel={closeLabel} />
          <div className="panel-body min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
            {description && (
              <Dialog.Description className="panel-description mb-2 text-sm text-muted-foreground">{description}</Dialog.Description>
            )}
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
