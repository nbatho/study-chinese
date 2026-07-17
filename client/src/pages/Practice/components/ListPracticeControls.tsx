import { useI18n, type TranslationKey } from "../../../i18n";
import { cn } from "../../../utils/cn";

type ListPracticeMode = "typing" | "listening" | "tone";

export default function ListPracticeControls({
  lists,
  selectedListId,
  mode,
  onListChange,
  onModeChange,
}: {
  lists: Array<{ id: string; name: string; wordIds: string[] }>;
  selectedListId: string;
  mode: ListPracticeMode;
  onListChange: (value: string) => void;
  onModeChange: (value: ListPracticeMode) => void;
}) {
  const { t } = useI18n();
  const modeLabelKeys: Record<ListPracticeMode, TranslationKey> = {
    typing: "practice.list.modeTyping",
    listening: "practice.list.modeListening",
    tone: "practice.list.modeTone",
  };

  return (
    <div className="grid gap-3 text-left sm:grid-cols-[1fr_auto]">
      <select
        value={selectedListId}
        onChange={(event) => onListChange(event.target.value)}
        className="min-w-0 rounded-lg border bg-background px-3 py-2 text-sm font-semibold outline-none focus:border-primary"
      >
        {lists.map((list) => (
          <option key={list.id} value={list.id}>
            {list.name} ({list.wordIds.length})
          </option>
        ))}
      </select>
      <div className="grid grid-cols-3 gap-1 rounded-lg border bg-secondary p-1">
        {(["typing", "listening", "tone"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onModeChange(item)}
            className={cn("rounded-md px-3 py-2 text-xs font-bold", mode === item ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}
          >
            {t(modeLabelKeys[item])}
          </button>
        ))}
      </div>
    </div>
  );
}