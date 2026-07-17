import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, FileText, Filter, Layers, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLessonGrammarIndexQuery } from "../../api";
import type { LessonGrammarEntry } from "../../api/lessons";
import { DropdownSelect } from "../../components/ui/dropdown-select";
import LoginPromptCard from "../../components/LoginPromptCard";
import LoadingCard from "../../components/LoadingCard";
import { useI18n } from "../../i18n";
import { useAuthGate } from "../../hooks/useAuthGate";
import { cn } from "../../utils/cn";

type GrammarLessonGroup = {
  lesson: LessonGrammarEntry["lesson"];
  grammar: LessonGrammarEntry[];
};

export default function Grammar() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { isResolving, isAuthenticated } = useAuthGate();
  const grammarQuery = useLessonGrammarIndexQuery(isAuthenticated);
  const [search, setSearch] = useState("");
  const [selectedHsk, setSelectedHsk] = useState<number | null>(null);

  const grammar = grammarQuery.data?.grammar ?? [];
  const hskLevels = useMemo(
    () => Array.from(new Set(grammar.map((entry) => entry.hskLevel ?? entry.lesson.hskLevel))).sort((a, b) => a - b),
    [grammar],
  );
  const groups = useMemo(() => {
    if (selectedHsk === null) return [];
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = grammar.filter((entry) => {
      const entryHsk = entry.hskLevel ?? entry.lesson.hskLevel;
      const matchesHsk = entryHsk === selectedHsk;
      const haystack = [
        entry.pattern,
        entry.explanation,
        entry.lesson.title,
        entry.lesson.subtitle,
        ...entry.tips,
        ...entry.examples.flatMap((example) => [example.simplified, example.pinyin, example.english]),
      ].join(" ").toLowerCase();

      return matchesHsk && (!normalizedSearch || haystack.includes(normalizedSearch));
    });
    const grouped = new Map<string, GrammarLessonGroup>();

    filtered.forEach((entry) => {
      const current = grouped.get(entry.lesson.id);

      if (current) {
        current.grammar.push(entry);
        return;
      }

      grouped.set(entry.lesson.id, {
        lesson: entry.lesson,
        grammar: [entry],
      });
    });

    return Array.from(grouped.values());
  }, [grammar, search, selectedHsk]);

  const levelCounts = useMemo(() => {
    const counts = new Map<number, number>();
    grammar.forEach((entry) => {
      const hsk = entry.hskLevel ?? entry.lesson.hskLevel;
      counts.set(hsk, (counts.get(hsk) ?? 0) + 1);
    });
    return counts;
  }, [grammar]);

  const filteredCount = useMemo(() => {
    if (selectedHsk === null) return grammar.length;
    return grammar.filter((entry) => (entry.hskLevel ?? entry.lesson.hskLevel) === selectedHsk).length;
  }, [grammar, selectedHsk]);

  if (isResolving) {
    return <LoadingCard label={t("common.loading")} />;
  }

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={Search}
        title={t("loginPrompt.learnTitle")}
        description={t("loginPrompt.learnBody")}
      />
    );
  }

  const CEFR_MAP: Record<number, string> = { 1: "A1", 2: "A2", 3: "B1", 4: "B2", 5: "C1", 6: "C2" };

  return (
    <div className="app-page">
      <header className="app-page-header mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="text-left">
          <div className="mb-2 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
            <FileText size={17} />
            {t("grammar.badge")}
          </div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">{t("grammar.title")}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {t("grammar.subtitle")}
          </p>
        </div>
        <span className="rounded-xl border bg-background px-3 py-2 text-sm font-extrabold text-primary">
          {t("grammar.count", { count: grammar.length })}
        </span>
      </header>

      {selectedHsk !== null && (
        <section className="app-surface-padded mb-5">
          <div className="grid gap-3 lg:grid-cols-[auto_minmax(0,1fr)_220px]">
            <button
              type="button"
              onClick={() => { setSelectedHsk(null); setSearch(""); }}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border bg-background/70 px-3 text-xs font-extrabold text-muted-foreground transition hover:border-primary/30 hover:bg-secondary hover:text-foreground active:translate-y-px"
            >
              <ArrowLeft size={16} />
              {t("grammar.backToLevels")}
            </button>
            <label className="flex min-h-11 items-center gap-2.5 rounded-xl border bg-background px-3">
              <Search size={18} className="shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("grammar.searchPlaceholder")}
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground"
              />
            </label>
            <DropdownSelect
              label={t("grammar.hskFilter")}
              icon={<Filter size={16} />}
              value={String(selectedHsk)}
              onChange={(value) => setSelectedHsk(Number(value))}
              options={hskLevels.map((level) => ({ value: String(level), label: `HSK ${level}` }))}
              align="left"
              className="min-w-0"
              buttonClassName="w-full justify-between"
              menuClassName="w-full min-w-48"
            />
          </div>
        </section>
      )}

      {grammarQuery.isLoading ? (
        <LoadingCard label={t("grammar.loading")} />
      ) : selectedHsk === null ? (
        /* ── Level picker ── */
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {hskLevels.map((level) => {
            const count = levelCounts.get(level) ?? 0;
            const cefr = CEFR_MAP[level] ?? "";
            return (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedHsk(level)}
                className="group app-surface flex items-center gap-4 p-4 text-left transition hover:border-primary/40 hover:shadow-lg active:translate-y-px"
              >
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary/20">
                  <Layers size={26} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-lg font-extrabold">HSK {level}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    {cefr && <span className="rounded bg-secondary px-1.5 py-0.5">{cefr}</span>}
                    <span>{t("grammar.patternCount", { count })}</span>
                  </div>
                </div>
                <ChevronRight size={20} className="shrink-0 text-muted-foreground transition group-hover:text-primary" />
              </button>
            );
          })}
        </div>
      ) : groups.length === 0 ? (
        <section className="app-surface px-5 py-10 text-center">
          <Search className="mx-auto mb-3 text-muted-foreground" size={36} />
          <h3 className="font-extrabold">{t("grammar.emptyTitle")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("grammar.emptyBody")}</p>
        </section>
      ) : (
        <div className="grid gap-4">
          <div className="text-sm font-bold text-muted-foreground">
            {t("grammar.showingLevel", { level: selectedHsk, count: filteredCount })}
          </div>
          {groups.map((group) => (
            <article key={group.lesson.id} className="app-surface overflow-hidden text-left">
              <div className="border-b bg-secondary/35 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase text-muted-foreground">
                      <span>HSK {group.lesson.hskLevel}</span>
                      <span>{group.lesson.cefrLevel}</span>
                      <span>{t("grammar.lessonNumber", { order: group.lesson.order })}</span>
                      <span>{group.lesson.skill}</span>
                      {group.lesson.completedAt && (
                        <span className="inline-flex items-center gap-1 text-jade">
                          <CheckCircle2 size={13} />
                          {t("grammar.completed")}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-extrabold">{group.lesson.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{group.lesson.subtitle}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/learn?lessonId=${encodeURIComponent(group.lesson.id)}`)}
                    className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 active:translate-y-px"
                  >
                    <BookOpen size={17} />
                    {t("grammar.studyInLesson")}
                  </button>
                </div>
              </div>

              <div className="grid gap-3 p-4">
                {group.grammar.map((entry) => (
                  <section key={entry.id} className="rounded-lg border bg-card p-4">
                    <div className="mb-2 rounded-lg bg-background px-3 py-2 font-serif text-xl font-extrabold text-primary">
                      {entry.pattern}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{entry.explanation}</p>
                    {entry.tips.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {entry.tips.map((tip) => (
                          <span key={tip} className="rounded-md bg-secondary px-2.5 py-1 text-xs font-bold text-muted-foreground">
                            {tip}
                          </span>
                        ))}
                      </div>
                    )}
                    {entry.examples.length > 0 && (
                      <div className="mt-3 grid gap-2 border-t border-dashed pt-3">
                        {entry.examples.slice(0, 2).map((example, index) => (
                          <div key={`${entry.id}-${index}`} className={cn("rounded-md bg-background p-3", index > 0 && "hidden sm:block")}>
                            <div className="font-serif text-lg font-bold">{example.simplified}</div>
                            <div className="text-xs font-semibold text-muted-foreground">{example.pinyin}</div>
                            <div className="mt-1 text-sm">{example.english}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
