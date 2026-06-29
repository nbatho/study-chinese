import { cn } from "../../../utils/cn";

export default function ArrangeExercise({ options, arrangedWords, isAnswerChecked, onToggle }: { options: string[]; arrangedWords: string[]; isAnswerChecked: boolean; onToggle: (word: string) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex min-h-14 flex-wrap justify-center gap-2 rounded-xl border-2 border-dashed bg-background p-4">
        {arrangedWords.map((word, i) => (
          <button key={`${word}-${i}`} onClick={() => onToggle(word)} className="anim-pop rounded-lg border bg-card px-3 py-1.5 font-serif text-xl font-bold">
            {word}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2.5">
        {options.map((word, idx) => {
          const isSelected = arrangedWords.includes(word);
          return (
            <button key={`${word}-${idx}`} disabled={isSelected || isAnswerChecked} onClick={() => onToggle(word)} className={cn("rounded-[10px] border px-4 py-2 font-serif text-xl font-bold", isSelected ? "cursor-default bg-transparent text-transparent opacity-25" : "bg-card text-foreground")}>
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
}
