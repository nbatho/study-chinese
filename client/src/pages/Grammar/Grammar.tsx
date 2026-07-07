import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, FileText, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLessonGrammarIndexQuery } from "../../api";
import type { LessonGrammarEntry } from "../../api/lessons";
import LoginPromptCard from "../../components/LoginPromptCard";
import LoadingCard from "../../components/LoadingCard";
import { useI18n } from "../../i18n";
import { useAppSelector } from "../../store/hooks";
import { cn } from "../../utils/cn";

type GrammarLessonGroup = {
  lesson: LessonGrammarEntry["lesson"];
  grammar: LessonGrammarEntry[];
};

export default function Grammar() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const grammarQuery = useLessonGrammarIndexQuery(isAuthenticated);
  const [search, setSearch] = useState("");
  const [selectedHsk, setSelectedHsk] = useState<number | "all">("all");

  const grammar = grammarQuery.data?.grammar ?? [];
  const hskLevels = useMemo(
    () => Array.from(new Set(grammar.map((entry) => entry.lesson.hskLevel))).sort((a, b) => a - b),
    [grammar],
  );
  const groups = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = grammar.filter((entry) => {
      const matchesHsk = selectedHsk === "all" || entry.lesson.hskLevel === selectedHsk;
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

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={Search}
        title={t("loginPrompt.learnTitle")}
        description={t("loginPrompt.learnBody")}
      />
    );
  }

  return (
    <div className="app-page">
      <header className="app-page-header mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="text-left">
          <div className="mb-2 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
            <FileText size={17} />
            Ngữ pháp theo bài học
          </div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Thư viện ngữ pháp trong lộ trình</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Mỗi cấu trúc nằm trong bài học gốc để bạn học mẫu câu cùng từ vựng, hội thoại và bài tập liên quan.
          </p>
        </div>
        <span className="rounded-xl border bg-background px-3 py-2 text-sm font-extrabold text-primary">
          {grammar.length} cấu trúc
        </span>
      </header>

      <section className="app-surface-padded mb-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
          <label className="flex min-h-11 items-center gap-2.5 rounded-xl border bg-background px-3">
            <Search size={18} className="shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm mẫu câu, giải thích, ví dụ hoặc bài học..."
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground"
            />
          </label>
          <select
            value={selectedHsk}
            onChange={(event) => setSelectedHsk(event.target.value === "all" ? "all" : Number(event.target.value))}
            className="app-control h-11 text-sm font-semibold"
          >
            <option value="all">Tất cả HSK</option>
            {hskLevels.map((level) => (
              <option key={level} value={level}>HSK {level}</option>
            ))}
          </select>
        </div>
      </section>

      {grammarQuery.isLoading ? (
        <LoadingCard label="Đang tải ngữ pháp theo bài học..." />
      ) : groups.length === 0 ? (
        <section className="app-surface px-5 py-10 text-center">
          <Search className="mx-auto mb-3 text-muted-foreground" size={36} />
          <h3 className="font-extrabold">Không tìm thấy cấu trúc phù hợp</h3>
          <p className="mt-1 text-sm text-muted-foreground">Thử đổi từ khóa hoặc chọn lại cấp HSK.</p>
        </section>
      ) : (
        <div className="grid gap-4">
          {groups.map((group) => (
            <article key={group.lesson.id} className="app-surface overflow-hidden text-left">
              <div className="border-b bg-secondary/35 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase text-muted-foreground">
                      <span>HSK {group.lesson.hskLevel}</span>
                      <span>Bài {group.lesson.order}</span>
                      <span>{group.lesson.skill}</span>
                      {group.lesson.completedAt && (
                        <span className="inline-flex items-center gap-1 text-jade">
                          <CheckCircle2 size={13} />
                          Đã học
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
                    Học trong bài
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
