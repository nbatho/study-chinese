import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { useI18n } from "../i18n";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-1200 flex items-center justify-center bg-black/35 px-4"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="anim-pop w-full max-w-md rounded-lg border bg-card p-5 text-left shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-tone-4/10 text-tone-4">
            <AlertTriangle size={20} />
          </span>
          <div className="min-w-0">
            <h3 className="font-extrabold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border bg-background px-5 text-sm font-bold transition hover:bg-secondary active:translate-y-px"
          >
            {cancelLabel ?? t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:translate-y-px"
          >
            {confirmLabel ?? t("common.exit")}
          </button>
        </div>
      </div>
    </div>
  );
}
