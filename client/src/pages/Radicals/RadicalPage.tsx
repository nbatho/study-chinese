import { useMemo, useState } from "react";
import { BookOpen, Filter, Search, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DropdownSelect } from "../../components/ui/dropdown-select";
import { cn } from "../../utils/cn";
import { speakChinese } from "../../utils/tts";
import { KANGXI_RADICALS, RADICAL_STROKE_COUNTS, type RadicalFrequency } from "./radicalCatalog";

const frequencyOptions: Array<{ value: RadicalFrequency | "all"; label: string }> = [
  { value: "all", label: "Tất cả mức phổ biến" },
  { value: "high", label: "Rất hay gặp" },
  { value: "medium", label: "Thường gặp" },
  { value: "low", label: "Ít gặp hơn" },
];

const frequencyLabel: Record<RadicalFrequency, string> = {
  high: "Rất hay gặp",
  medium: "Thường gặp",
  low: "Ít gặp",
};

const frequencyClass: Record<RadicalFrequency, string> = {
  high: "bg-primary/10 text-primary",
  medium: "bg-jade/10 text-jade",
  low: "bg-secondary text-muted-foreground",
};

export default function Radicals() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedStrokeCount, setSelectedStrokeCount] = useState<number | "all">("all");
  const [selectedFrequency, setSelectedFrequency] = useState<RadicalFrequency | "all">("all");

  const radicals = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return KANGXI_RADICALS.filter((radical) => {
      const matchesStrokeCount = selectedStrokeCount === "all" || radical.strokeCount === selectedStrokeCount;
      const matchesFrequency = selectedFrequency === "all" || radical.frequency === selectedFrequency;
      const haystack = [
        radical.number,
        radical.radical,
        radical.pinyin,
        radical.meaningVi,
        ...(radical.variants ?? []),
        ...radical.examples,
      ].join(" ").toLowerCase();

      return matchesStrokeCount && matchesFrequency && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [query, selectedFrequency, selectedStrokeCount]);

  return (
    <div className="app-page">
      <header className="app-page-header mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="text-left">
          <div className="mb-2 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
            <BookOpen size={17} />
            214 bộ thủ Kangxi
          </div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Học từ vựng theo bộ thủ</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Lọc theo số nét, tra nghĩa tiếng Việt, nghe cách đọc và mở nhanh các từ có cùng bộ thủ trong từ điển.
          </p>
        </div>
        <div className="rounded-xl border bg-background px-3 py-2 text-sm font-extrabold text-primary">
          {radicals.length}/{KANGXI_RADICALS.length} bộ thủ
        </div>
      </header>

      <section className="app-surface-padded mb-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_220px]">
          <label className="flex min-h-11 items-center gap-2.5 rounded-xl border bg-background px-3">
            <Search size={18} className="shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm bộ thủ, pinyin, nghĩa hoặc ví dụ..."
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground"
            />
          </label>
          <DropdownSelect
            label="Lọc theo số nét"
            icon={<Filter size={16} />}
            value={String(selectedStrokeCount)}
            onChange={(value) => setSelectedStrokeCount(value === "all" ? "all" : Number(value))}
            options={[
              { value: "all", label: "Tất cả số nét" },
              ...RADICAL_STROKE_COUNTS.map((count) => ({ value: String(count), label: `${count} nét` })),
            ]}
            align="left"
            className="min-w-0"
            buttonClassName="w-full justify-between"
            menuClassName="w-full min-w-48"
          />
          <DropdownSelect
            label="Lọc theo mức phổ biến"
            icon={<Filter size={16} />}
            value={selectedFrequency}
            onChange={setSelectedFrequency}
            options={frequencyOptions}
            align="left"
            className="min-w-0"
            buttonClassName="w-full justify-between"
            menuClassName="w-full min-w-48"
          />
        </div>
      </section>

      {radicals.length === 0 ? (
        <section className="app-surface px-5 py-10 text-center">
          <Search className="mx-auto mb-3 text-muted-foreground" size={36} />
          <h3 className="font-extrabold">Không tìm thấy bộ thủ phù hợp</h3>
          <p className="mt-1 text-sm text-muted-foreground">Thử đổi từ khóa, số nét hoặc mức phổ biến.</p>
        </section>
      ) : (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {radicals.map((radical) => (
            <article key={radical.number} className="app-card-button flex min-h-48 flex-col justify-between p-4 text-left">
              <div>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-16 shrink-0 place-items-center rounded-lg border bg-background font-serif text-4xl font-extrabold text-primary">
                      {radical.radical}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-muted-foreground">#{radical.number} - {radical.strokeCount} nét</div>
                      <h2 className="mt-1 text-lg font-extrabold">{radical.meaningVi}</h2>
                      <p className="text-sm font-semibold text-muted-foreground">{radical.pinyin}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakChinese(radical.radical)}
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground transition hover:border-primary hover:text-primary"
                    aria-label={`Nghe ${radical.radical}`}
                    title={`Nghe ${radical.radical}`}
                  >
                    <Volume2 size={17} />
                  </button>
                </div>

                <div className="mb-3 flex flex-wrap gap-1.5">
                  <span className={cn("rounded-md px-2 py-1 text-[0.68rem] font-extrabold", frequencyClass[radical.frequency])}>
                    {frequencyLabel[radical.frequency]}
                  </span>
                  {radical.variants?.map((variant) => (
                    <span key={variant} className="rounded-md bg-secondary px-2 py-1 font-serif text-[0.8rem] font-extrabold text-muted-foreground">
                      {variant}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {radical.examples.map((example) => (
                    <span key={example} className="grid size-9 place-items-center rounded-lg bg-secondary font-serif text-lg font-bold">
                      {example}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/dictionary?radical=${encodeURIComponent(radical.radical)}`)}
                className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm font-bold transition hover:border-primary hover:text-primary active:translate-y-px"
              >
                Mở từ cùng bộ thủ
              </button>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
