import {
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Dumbbell,
  PencilLine,
  Search,
  Sparkles,
  Trophy,
  Volume2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../../utils/cn";

export type GuideVisualType = "home" | "guide" | "learn" | "practice" | "review" | "dictionary" | "achievements" | "profile";

export default function GuideVisual({ type }: { type: GuideVisualType }) {
  if (type === "home") return <HomeVisual />;
  if (type === "guide") return <GuideTourVisual />;
  if (type === "learn") return <LearnVisual />;
  if (type === "practice") return <PracticeVisual />;
  if (type === "review") return <ReviewVisual />;
  if (type === "dictionary") return <DictionaryVisual />;
  if (type === "achievements") return <AchievementsVisual />;
  return <ProfileVisual />;
}

function VisualFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[440px] rounded-lg border bg-background p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-tone-4" />
          <span className="size-2.5 rounded-full bg-gold" />
          <span className="size-2.5 rounded-full bg-jade" />
        </div>
        <div className="h-2 w-24 rounded bg-border" />
      </div>
      {children}
    </div>
  );
}

function HomeVisual() {
  return (
    <VisualFrame>
      <div className="grid gap-3 sm:grid-cols-3">
        {["XP hôm nay", "Streak", "Cần ôn"].map((label, index) => (
          <div key={label} className="rounded-lg bg-card p-4">
            <div className="text-xs font-bold text-muted-foreground">{label}</div>
            <div className="mt-3 text-2xl font-extrabold text-primary">{[120, 7, 14][index]}</div>
            <div className="mt-3 h-2 rounded bg-secondary">
              <div className={cn("h-full rounded bg-primary", index === 0 ? "w-2/3" : index === 1 ? "w-1/2" : "w-3/4")} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-card p-5">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div className="text-sm font-extrabold">Bài tiếp theo</div>
            <div className="text-xs font-semibold text-muted-foreground">HSK 3 - Đi siêu thị</div>
          </div>
          <Sparkles className="text-gold" size={22} />
        </div>
        <div className="mt-4 h-3 rounded bg-secondary">
          <div className="h-full w-3/5 rounded bg-primary" />
        </div>
      </div>
    </VisualFrame>
  );
}

function GuideTourVisual() {
  return (
    <VisualFrame>
      <div className="grid gap-4 lg:grid-cols-[170px_1fr]">
        <div className="rounded-lg bg-card p-3">
          {["Trang chủ", "Hướng dẫn", "Học", "Luyện tập", "Ôn tập"].map((label, index) => (
            <div
              key={label}
              className={cn(
                "mb-2 rounded-lg px-3 py-2 text-xs font-bold",
                index === 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
              )}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-card p-5">
          <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
            <Compass size={16} />
            Bước 2/8
          </div>
          <div className="h-4 w-56 rounded bg-primary/25" />
          <div className="mt-4 space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border bg-background p-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-extrabold text-primary">
                  {item}
                </div>
                <div className="h-2 flex-1 rounded bg-border" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

function LearnVisual() {
  return (
    <VisualFrame>
      <div className="mb-4 flex gap-2">
        {["HSK 1", "HSK 2", "HSK 3"].map((label, index) => (
          <div key={label} className={cn("flex-1 rounded-lg py-3 text-center text-xs font-bold", index === 2 ? "bg-primary text-primary-foreground" : "bg-card")}>
            {label}
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {["Từ mới", "Hội thoại", "Ngữ pháp", "Bài tập"].map((label, index) => (
          <div key={label} className="flex items-center gap-3 rounded-lg bg-card p-4">
            <CheckCircle2 className={index < 2 ? "text-jade" : "text-muted-foreground"} size={20} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold">{label}</div>
              <div className="mt-2 h-2 w-2/3 rounded bg-border" />
            </div>
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

function PracticeVisual() {
  const tools: { label: string; icon: LucideIcon }[] = [
    { label: "Tone Drill", icon: Volume2 },
    { label: "Pinyin Typing", icon: PencilLine },
    { label: "Listening", icon: Dumbbell },
    { label: "Hanzi", icon: BookOpen },
  ];

  return (
    <VisualFrame>
      <div className="grid gap-3 sm:grid-cols-2">
        {tools.map(({ label, icon: Icon }, index) => (
          <div key={label} className={cn("rounded-lg border p-5", index === 0 ? "border-primary bg-primary/5" : "bg-card")}>
            <Icon className="mb-4 text-primary" size={24} />
            <div className="text-sm font-extrabold">{label}</div>
            <div className="mt-3 h-2 w-24 rounded bg-border" />
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

function ReviewVisual() {
  return (
    <VisualFrame>
      <div className="mx-auto flex min-h-[230px] max-w-sm flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary bg-primary/5">
        <div className="font-serif text-7xl font-extrabold">水</div>
        <div className="mt-3 text-sm font-bold text-primary">Tap to reveal</div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {["Again", "Hard", "Good", "Easy"].map((label) => (
          <div key={label} className="rounded-lg border bg-card py-3 text-center text-xs font-bold">
            {label}
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

function DictionaryVisual() {
  return (
    <VisualFrame>
      <div className="mb-4 flex items-center gap-2 rounded-lg bg-card px-4 py-3">
        <Search size={18} className="text-muted-foreground" />
        <div className="h-2 flex-1 rounded bg-border" />
      </div>
      <div className="rounded-lg bg-card p-5">
        <div className="font-serif text-6xl font-extrabold">学习</div>
        <div className="mt-2 font-bold text-primary">xué xí</div>
        <div className="mt-3 h-2 w-40 rounded bg-border" />
        <div className="mt-5 flex flex-wrap gap-2">
          <div className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">HSK 1</div>
          <div className="rounded-lg bg-jade/10 px-3 py-1.5 text-xs font-bold text-jade">Yêu thích</div>
          <Volume2 size={22} className="text-primary" />
        </div>
      </div>
    </VisualFrame>
  );
}

function AchievementsVisual() {
  return (
    <VisualFrame>
      <div className="grid gap-3 sm:grid-cols-3">
        {[Award, Trophy, Sparkles].map((Icon, index) => (
          <div key={index} className={cn("rounded-lg border p-5 text-center", index === 0 ? "border-primary bg-primary/5" : "bg-card")}>
            <div className="mx-auto flex size-14 items-center justify-center rounded-lg bg-gold/20 text-gold">
              <Icon size={28} />
            </div>
            <div className="mt-4 text-sm font-extrabold">{["Streak 7 ngày", "HSK Starter", "Review Hero"][index]}</div>
            <div className="mx-auto mt-3 h-2 w-20 rounded bg-border" />
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-card p-4">
        <div className="mb-2 flex justify-between text-sm font-bold">
          <span>Mục tiêu tiếp theo</span>
          <span className="text-primary">70%</span>
        </div>
        <div className="h-3 rounded bg-secondary">
          <div className="h-full w-[70%] rounded bg-primary" />
        </div>
      </div>
    </VisualFrame>
  );
}

function ProfileVisual() {
  return (
    <VisualFrame>
      <div className="flex items-center gap-4 rounded-lg bg-card p-5">
        <div className="flex size-16 items-center justify-center rounded-lg bg-primary text-2xl font-extrabold text-primary-foreground">
          A
        </div>
        <div className="min-w-0 flex-1">
          <div className="h-4 w-36 rounded bg-primary/25" />
          <div className="mt-3 h-2 w-52 rounded bg-border" />
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {["Mục tiêu ngày", "Ngôn ngữ", "Giao diện", "Audio"].map((label) => (
          <div key={label} className="rounded-lg bg-card p-4">
            <div className="text-sm font-extrabold">{label}</div>
            <div className="mt-3 h-2 w-24 rounded bg-border" />
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}
