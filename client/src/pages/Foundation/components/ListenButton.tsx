import { Volume2 } from "lucide-react";
import { useI18n } from "../../../i18n";
import { cn } from "../../../utils/cn";
import { speakChinese } from "../../../utils/tts";

export default function ListenButton({ text, className }: { text: string; className?: string }) {
  const { t } = useI18n();
  const label = t("foundation.listenTo", { text });
  return (
    <button
      type="button"
      onClick={() => speakChinese(text)}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-xl border bg-card text-muted-foreground transition hover:border-primary hover:text-primary active:translate-y-px",
        className,
      )}
    >
      <Volume2 size={18} />
    </button>
  );
}
