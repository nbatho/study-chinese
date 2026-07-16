import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Bot, Plus, Save, Search, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  useAdminAiLogsQuery,
  useAdminLessonMutation,
  useAdminLessonsQuery,
  useAdminReportsQuery,
  useAdminSummaryQuery,
  useAdminUsersQuery,
  useAdminWordMutation,
  useAdminWordsQuery,
  useDeleteAdminLessonMutation,
  useDeleteAdminWordMutation,
  useUpdateAdminReportMutation,
  useUpdateAdminUserMutation,
} from "../../../api/admin/queries";
import type { AdminLesson, AdminLessonPayload, AdminReport, AdminWord, AdminWordPayload } from "../../../api/admin";
import LoadingCard from "../../../components/LoadingCard";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { useI18n } from "../../../i18n";
import type { TranslationKey } from "../../../i18n";
import { cn } from "../../../utils/cn";

const emptyLesson: AdminLessonPayload = {
  id: "",
  title: "",
  subtitle: "",
  hskLevel: 1,
  order: 1,
  skill: "vocabulary",
  estimatedMinutes: 5,
  xpReward: 20,
  intro: "",
  dialogue: null,
  isActive: true,
};

const emptyWord: AdminWordPayload = {
  id: "",
  simplified: "",
  traditional: "",
  pinyin: "",
  tones: [],
  english: "",
  partOfSpeech: "phrase",
  hskLevel: 1,
  category: "General",
  isActive: true,
};

export function OverviewPanel() {
  const { t } = useI18n();
  const summaryQuery = useAdminSummaryQuery();
  const summary = summaryQuery.data?.summary;

  if (summaryQuery.isLoading || !summary) return <LoadingCard label={t("admin.loadingDashboard")} />;

  const stats = [
    {
      label: t("admin.statUsers"),
      value: summary.users.total,
      note: t("admin.statAdmins", { count: summary.users.admins }),
    },
    {
      label: t("admin.statLessons"),
      value: summary.lessons.active,
      note: t("admin.statTotal", { count: summary.lessons.total }),
    },
    {
      label: t("admin.statWords"),
      value: summary.words.active,
      note: t("admin.statTotal", { count: summary.words.total }),
    },
    {
      label: t("admin.statReports"),
      value: summary.reports.pending,
      note: t("admin.statTotal", { count: summary.reports.total }),
    },
    {
      label: t("admin.statAiSessions"),
      value: summary.chats.sessions,
      note: t("admin.statRecentSessions", { count: summary.chats.recent }),
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border bg-card/95 p-4 text-left shadow-sm">
          <div className="text-xs font-bold text-muted-foreground">{stat.label}</div>
          <div className="mt-2 text-3xl font-extrabold text-primary">{stat.value}</div>
          <div className="mt-1 text-xs font-semibold text-muted-foreground">{stat.note}</div>
        </div>
      ))}
    </div>
  );
}

export function LessonManager() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [includeInactive, setIncludeInactive] = useState(true);
  const [draft, setDraft] = useState<AdminLessonPayload>(emptyLesson);
  const [editingId, setEditingId] = useState<string | undefined>();
  const lessonsQuery = useAdminLessonsQuery({ q, includeInactive, limit: 150 });
  const saveMutation = useAdminLessonMutation();
  const deleteMutation = useDeleteAdminLessonMutation();

  const save = async () => {
    await saveMutation.mutateAsync({ id: editingId, payload: draft });
    toast.success(t("admin.savedLesson"));
    setDraft(emptyLesson);
    setEditingId(undefined);
  };

  const edit = (lesson: AdminLesson) => {
    setEditingId(lesson.id);
    setDraft({
      id: lesson.id,
      title: lesson.title,
      subtitle: lesson.subtitle,
      hskLevel: lesson.hskLevel,
      order: lesson.order,
      skill: lesson.skill,
      estimatedMinutes: lesson.estimatedMinutes,
      xpReward: lesson.xpReward,
      intro: lesson.intro,
      dialogue: lesson.dialogue ?? null,
      isActive: lesson.isActive,
    });
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <section className="app-surface-padded text-left min-w-0">
        <PanelTitle icon={Plus} title={editingId ? t("admin.editLesson") : t("admin.addLesson")} />
        <div className="grid gap-3">
          <TextInput label="ID" value={draft.id} disabled={!!editingId} onChange={(value) => setDraft({ ...draft, id: value })} />
          <TextInput label={t("admin.fieldTitle")} value={draft.title} onChange={(value) => setDraft({ ...draft, title: value })} />
          <TextInput label={t("admin.fieldSubtitle")} value={draft.subtitle} onChange={(value) => setDraft({ ...draft, subtitle: value })} />
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="HSK" value={draft.hskLevel} onChange={(value) => setDraft({ ...draft, hskLevel: value })} />
            <NumberInput label={t("admin.fieldOrder")} value={draft.order} onChange={(value) => setDraft({ ...draft, order: value })} />
          </div>
          <TextInput label={t("admin.fieldSkill")} value={draft.skill} onChange={(value) => setDraft({ ...draft, skill: value })} />
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label={t("admin.fieldMinutes")} value={draft.estimatedMinutes} onChange={(value) => setDraft({ ...draft, estimatedMinutes: value })} />
            <NumberInput label="XP" value={draft.xpReward} onChange={(value) => setDraft({ ...draft, xpReward: value })} />
          </div>
          <TextArea label={t("admin.fieldIntro")} value={draft.intro} onChange={(value) => setDraft({ ...draft, intro: value })} />
          <ToggleRow label={t("admin.fieldActive")} value={draft.isActive} onChange={(value) => setDraft({ ...draft, isActive: value })} />
          <div className="flex gap-2">
            <Button type="button" onClick={save} disabled={saveMutation.isPending} className="h-10 flex-1 rounded-xl font-bold">
              <Save size={16} />
              {t("admin.save")}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={() => { setEditingId(undefined); setDraft(emptyLesson); }} className="h-10 rounded-xl font-bold">
                {t("admin.cancel")}
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="app-surface-padded text-left min-w-0">
        <Toolbar q={q} setQ={setQ} includeInactive={includeInactive} setIncludeInactive={setIncludeInactive} />
        <div className="grid gap-2">
          {(lessonsQuery.data?.lessons ?? []).map((lesson) => (
            <div key={lesson.id} className="flex flex-col gap-3 rounded-xl border bg-background p-3 sm:flex-row sm:items-center sm:justify-between min-w-0">
              <button type="button" onClick={() => edit(lesson)} className="flex-1 min-w-0 text-left">
                <div className="truncate font-extrabold">{lesson.title}</div>
                <div className="truncate text-xs font-semibold text-muted-foreground">
                  {lesson.id} · HSK {lesson.hskLevel} · #{lesson.order} · {lesson.skill}
                </div>
              </button>
              <div className="flex items-center gap-2">
                <StatusPill active={lesson.isActive} />
                <IconButton title={t("admin.hideLesson")} onClick={() => deleteMutation.mutate(lesson.id)} icon={Trash2} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function WordManager() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [includeInactive, setIncludeInactive] = useState(true);
  const [draft, setDraft] = useState<AdminWordPayload>(emptyWord);
  const [editingId, setEditingId] = useState<string | undefined>();
  const wordsQuery = useAdminWordsQuery({ q, includeInactive, limit: 150 });
  const saveMutation = useAdminWordMutation();
  const deleteMutation = useDeleteAdminWordMutation();

  const save = async () => {
    await saveMutation.mutateAsync({ id: editingId, payload: draft });
    toast.success(t("admin.savedWord"));
    setDraft(emptyWord);
    setEditingId(undefined);
  };

  const edit = (word: AdminWord) => {
    setEditingId(word.id);
    setDraft({ ...word });
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <section className="app-surface-padded text-left min-w-0">
        <PanelTitle icon={Plus} title={editingId ? t("admin.editWord") : t("admin.addWord")} />
        <div className="grid gap-3">
          <TextInput label="ID" value={draft.id} disabled={!!editingId} onChange={(value) => setDraft({ ...draft, id: value })} />
          <TextInput label={t("admin.fieldSimplified")} value={draft.simplified} onChange={(value) => setDraft({ ...draft, simplified: value, traditional: draft.traditional || value })} />
          <TextInput label={t("admin.fieldTraditional")} value={draft.traditional} onChange={(value) => setDraft({ ...draft, traditional: value })} />
          <TextInput label={t("admin.fieldPinyin")} value={draft.pinyin} onChange={(value) => setDraft({ ...draft, pinyin: value })} />
          <TextArea label={t("admin.fieldEnglish")} value={draft.english} onChange={(value) => setDraft({ ...draft, english: value })} />
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="HSK" value={draft.hskLevel} onChange={(value) => setDraft({ ...draft, hskLevel: value })} />
            <TextInput label={t("admin.fieldCategory")} value={draft.category} onChange={(value) => setDraft({ ...draft, category: value })} />
          </div>
          <SelectInput
            label={t("admin.fieldPartOfSpeech")}
            value={draft.partOfSpeech}
            options={["noun", "verb", "adjective", "adverb", "pronoun", "numeral", "measure", "phrase"]}
            onChange={(value) => setDraft({ ...draft, partOfSpeech: value })}
          />
          <TextInput
            label={t("admin.fieldTones")}
            value={draft.tones.join(",")}
            onChange={(value) => setDraft({ ...draft, tones: value.split(",").map((item) => Number(item.trim())).filter(Number.isFinite) })}
          />
          <ToggleRow label={t("admin.fieldActive")} value={draft.isActive} onChange={(value) => setDraft({ ...draft, isActive: value })} />
          <div className="flex gap-2">
            <Button type="button" onClick={save} disabled={saveMutation.isPending} className="h-10 flex-1 rounded-xl font-bold">
              <Save size={16} />
              {t("admin.save")}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={() => { setEditingId(undefined); setDraft(emptyWord); }} className="h-10 rounded-xl font-bold">
                {t("admin.cancel")}
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="app-surface-padded text-left min-w-0">
        <Toolbar q={q} setQ={setQ} includeInactive={includeInactive} setIncludeInactive={setIncludeInactive} />
        <div className="grid gap-2">
          {(wordsQuery.data?.words ?? []).map((word) => (
            <div key={word.id} className="flex flex-col gap-3 rounded-xl border bg-background p-3 sm:flex-row sm:items-center sm:justify-between min-w-0">
              <button type="button" onClick={() => edit(word)} className="flex-1 min-w-0 text-left">
                <div className="truncate font-serif text-xl font-bold">{word.simplified}</div>
                <div className="truncate text-xs font-semibold text-muted-foreground">
                  {word.pinyin} · HSK {word.hskLevel} · {word.category} · {word.english}
                </div>
              </button>
              <div className="flex items-center gap-2">
                <StatusPill active={word.isActive} />
                <IconButton title={t("admin.hideWord")} onClick={() => deleteMutation.mutate(word.id)} icon={Trash2} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function UserManager() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const usersQuery = useAdminUsersQuery({ q, limit: 150 });
  const updateMutation = useUpdateAdminUserMutation();

  return (
    <section className="app-surface-padded text-left min-w-0">
      <div className="mb-4 flex items-center gap-2 rounded-xl border bg-background px-3 py-2">
        <Search size={16} className="text-muted-foreground" />
        <input value={q} onChange={(event) => setQ(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder={t("admin.searchUsers")} />
      </div>
      <div className="grid gap-2">
        {(usersQuery.data?.users ?? []).map((user) => (
          <div key={user.id} className="grid gap-3 rounded-xl border bg-background p-3 lg:grid-cols-[1fr_150px_150px] lg:items-center">
            <div className="min-w-0">
              <div className="truncate font-extrabold">{user.name}</div>
              <div className="truncate text-xs font-semibold text-muted-foreground">{user.email}</div>
            </div>
            <select
              value={user.role}
              onChange={(event) => updateMutation.mutate({ userId: user.id, payload: { role: event.target.value as "student" | "admin" } })}
              className="h-10 rounded-xl border bg-card px-3 text-sm font-semibold"
            >
              <option value="student">{t("admin.roleStudent")}</option>
              <option value="admin">{t("admin.roleAdmin")}</option>
            </select>
            <select
              value={user.isActive ? "active" : "inactive"}
              onChange={(event) => updateMutation.mutate({ userId: user.id, payload: { isActive: event.target.value === "active" } })}
              className="h-10 rounded-xl border bg-card px-3 text-sm font-semibold"
            >
              <option value="active">{t("admin.statusActive")}</option>
              <option value="inactive">{t("admin.statusInactive")}</option>
            </select>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AiLogViewer() {
  const { t } = useI18n();
  const logsQuery = useAdminAiLogsQuery({ limit: 40 });
  const sessions = useMemo(() => logsQuery.data?.sessions ?? [], [logsQuery.data?.sessions]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => sessions.find((session) => session.id === selectedId) ?? sessions[0], [selectedId, sessions]);

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <section className="app-surface p-3 text-left min-w-0">
        <PanelTitle icon={Bot} title={t("admin.recentAiSessions")} />
        <div className="grid gap-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => setSelectedId(session.id)}
              className={cn(
                "w-full min-w-0 rounded-xl border p-3 text-left transition",
                selected?.id === session.id ? "border-primary bg-primary/5" : "bg-background hover:bg-secondary",
              )}
            >
              <div className="truncate text-sm font-extrabold">{session.userEmail}</div>
              <div className="mt-1 truncate text-xs font-semibold text-muted-foreground">
                {session.scenarioTitle || t("admin.scenarioPersonal")} ·{" "}
                {t("admin.messageCount", { count: session.messageCount })}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="app-surface-padded text-left min-w-0">
        {selected ? (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b pb-3">
              <div className="min-w-0">
                <h2 className="font-extrabold break-all">{selected.userName || selected.userEmail}</h2>
                <p className="text-xs font-semibold text-muted-foreground break-words">
                  {t("admin.modelTokens", {
                    model: selected.lastModelName || "mock",
                    tokens: selected.totalInputTokens + selected.totalOutputTokens,
                  })}
                </p>
              </div>
              <Badge className="rounded-lg shrink-0">{new Date(selected.updatedAt).toLocaleString()}</Badge>
            </div>
            <div className="grid gap-3">
              {selected.messages.map((message) => (
                <div key={message.id} className={cn("rounded-xl border p-3 min-w-0", message.role === "user" ? "bg-background" : "bg-secondary")}>
                  <div className="mb-1 text-xs font-extrabold text-muted-foreground">{message.role}</div>
                  <p className="whitespace-pre-wrap break-words text-sm font-semibold">{message.rawText || message.simplified}</p>
                  {message.english && <p className="mt-1 break-words text-sm text-muted-foreground">{message.english}</p>}
                  {message.correction && (
                    <div className="mt-2 rounded-md bg-card px-3 py-2 text-xs break-words">
                      <strong>{t("admin.correction")}</strong> {message.correction.improved} · {message.correction.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-sm font-semibold text-muted-foreground">{t("admin.noAiLogs")}</div>
        )}
      </section>
    </div>
  );
}

/** Report status values are stored in English; only their labels are localised. */
const reportStatusLabelKeys: Record<string, TranslationKey> = {
  open: "admin.statusOpen",
  reviewing: "admin.statusReviewing",
  resolved: "admin.statusResolved",
  dismissed: "admin.statusDismissed",
};

export function ReportManager() {
  const { t } = useI18n();
  const [status, setStatus] = useState("");
  const reportsQuery = useAdminReportsQuery({ status: status || undefined, limit: 100 });
  const updateMutation = useUpdateAdminReportMutation();

  const update = async (report: AdminReport, nextStatus: AdminReport["status"], adminNote?: string) => {
    await updateMutation.mutateAsync({ reportId: report.id, payload: { status: nextStatus, adminNote: adminNote ?? report.adminNote ?? "" } });
    toast.success(t("admin.savedReport"));
  };

  return (
    <section className="app-surface-padded text-left min-w-0">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SelectInput
          label={t("admin.fieldStatus")}
          value={status}
          options={["", "open", "reviewing", "resolved", "dismissed"]}
          optionLabel={(option) =>
            option ? t(reportStatusLabelKeys[option]) : t("admin.optionAll")
          }
          onChange={setStatus}
        />
      </div>
      <div className="grid gap-3">
        {(reportsQuery.data?.reports ?? []).map((report) => (
          <ReportCard key={report.id} report={report} onUpdate={update} />
        ))}
      </div>
    </section>
  );
}

function ReportCard({ report, onUpdate }: { report: AdminReport; onUpdate: (report: AdminReport, status: AdminReport["status"], note?: string) => void }) {
  const { t } = useI18n();
  const [note, setNote] = useState(report.adminNote || "");
  const statusLabelKey = reportStatusLabelKeys[report.status];

  return (
    <div className="rounded-xl border bg-background p-4 min-w-0">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-extrabold break-words">{report.lessonTitle || report.lessonId || t("admin.hiddenLesson")}</div>
          <div className="text-xs font-semibold text-muted-foreground break-all">
            {report.userEmail || t("admin.anonymous")} · {report.category} · {new Date(report.createdAt).toLocaleString()}
          </div>
        </div>
        <Badge className="rounded-lg shrink-0">{statusLabelKey ? t(statusLabelKey) : report.status}</Badge>
      </div>
      <p className="whitespace-pre-wrap break-words text-sm">{report.message}</p>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        className="mt-3 min-h-20 w-full rounded-xl border bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        placeholder={t("admin.notePlaceholder")}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" variant="secondary" className="h-9 rounded-xl font-bold" onClick={() => onUpdate(report, "reviewing", note)}>
          {t("admin.statusReviewing")}
        </Button>
        <Button type="button" className="h-9 rounded-xl font-bold" onClick={() => onUpdate(report, "resolved", note)}>
          {t("admin.statusResolved")}
        </Button>
        <Button type="button" variant="ghost" className="h-9 rounded-xl font-bold" onClick={() => onUpdate(report, "dismissed", note)}>
          {t("admin.statusDismiss")}
        </Button>
      </div>
    </div>
  );
}

function PanelTitle({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon size={18} />
      </span>
      <h2 className="font-extrabold">{title}</h2>
    </div>
  );
}

function Toolbar({
  q,
  setQ,
  includeInactive,
  setIncludeInactive,
}: {
  q: string;
  setQ: (value: string) => void;
  includeInactive: boolean;
  setIncludeInactive: (value: boolean) => void;
}) {
  const { t } = useI18n();

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 min-w-0 items-center gap-2 rounded-xl border bg-background px-3 py-2">
        <Search size={16} className="text-muted-foreground shrink-0" />
        <input value={q} onChange={(event) => setQ(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder={t("admin.search")} />
      </div>
      <ToggleRow label={t("admin.showInactive")} value={includeInactive} onChange={setIncludeInactive} compact />
    </div>
  );
}

function TextInput({ label, value, onChange, disabled = false }: { label: string; value: string; onChange: (value: string) => void; disabled?: boolean }) {
  return (
    <label className="min-w-0 grid gap-1.5">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <input
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full h-10 rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
      />
    </label>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="min-w-0 grid gap-1.5">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full h-10 rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="min-w-0 grid gap-1.5">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full min-h-24 rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
  optionLabel,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  /** Defaults to showing the raw value, for selects whose options are data. */
  optionLabel?: (option: string) => string;
}) {
  return (
    <label className="min-w-0 grid gap-1.5">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full h-10 rounded-xl border bg-background px-3 text-sm font-semibold outline-none">
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabel ? optionLabel(option) : option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleRow({ label, value, onChange, compact = false }: { label: string; value: boolean; onChange: (value: boolean) => void; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn("flex items-center justify-between gap-3 rounded-xl border bg-background px-3 py-2 text-sm font-bold", compact ? "h-10" : "w-full")}
    >
      <span>{label}</span>
      <span className={cn("h-5 w-9 rounded-full p-0.5 transition", value ? "bg-primary" : "bg-muted")}>
        <span className={cn("block size-4 rounded-full bg-white transition", value && "translate-x-4")} />
      </span>
    </button>
  );
}

function StatusPill({ active }: { active: boolean }) {
  const { t } = useI18n();

  return (
    <span className={cn("rounded-lg px-2 py-1 text-xs font-extrabold", active ? "bg-jade/10 text-jade" : "bg-muted text-muted-foreground")}>
      {active ? t("admin.statusActive") : t("admin.statusInactive")}
    </span>
  );
}

function IconButton({ title, onClick, icon: Icon }: { title: string; onClick: () => void; icon: LucideIcon }) {
  return (
    <button type="button" onClick={onClick} title={title} className="flex size-9 items-center justify-center rounded-xl border bg-card text-muted-foreground transition hover:text-primary active:translate-y-px">
      <Icon size={16} />
    </button>
  );
}

