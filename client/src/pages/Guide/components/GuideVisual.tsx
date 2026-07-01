import {
  Award,
  BookOpen,
  Bot,
  Camera,
  CheckCircle2,
  Compass,
  Crown,
  Dumbbell,
  Gem,
  Languages,
  MessageSquareText,
  PencilLine,
  ScanLine,
  Search,
  Shield,
  ShoppingBag,
  Sparkles,
  Trophy,
  UserPlus,
  Users,
  Volume2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../../utils/cn";

export type GuideVisualType =
  | "home"
  | "guide"
  | "learn"
  | "practice"
  | "review"
  | "dictionary"
  | "translate"
  | "aiTutor"
  | "achievements"
  | "shop"
  | "community"
  | "profile"
  | "admin";

export default function GuideVisual({ type }: { type: GuideVisualType }) {
  if (type === "home") return <HomeVisual />;
  if (type === "guide") return <GuideTourVisual />;
  if (type === "learn") return <LearnVisual />;
  if (type === "practice") return <PracticeVisual />;
  if (type === "review") return <ReviewVisual />;
  if (type === "dictionary") return <DictionaryVisual />;
  if (type === "translate") return <TranslateVisual />;
  if (type === "aiTutor") return <AiTutorVisual />;
  if (type === "achievements") return <AchievementsVisual />;
  if (type === "shop") return <ShopVisual />;
  if (type === "community") return <CommunityVisual />;
  if (type === "admin") return <AdminVisual />;
  return <ProfileVisual />;
}

function VisualFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-110 rounded-lg border bg-background p-4">
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
      <div className="grid gap-3 sm:grid-cols-4">
        {["XP hôm nay", "Gems", "Streak", "Cần ôn"].map((label, index) => (
          <div key={label} className="rounded-lg bg-card p-4">
            <div className="text-xs font-bold text-muted-foreground">{label}</div>
            <div className="mt-3 text-2xl font-extrabold text-primary">{[120, 36, 7, 14][index]}</div>
            <div className="mt-3 h-2 rounded bg-secondary">
              <div className={cn("h-full rounded bg-primary", ["w-2/3", "w-1/3", "w-1/2", "w-3/4"][index])} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-card p-5">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div className="text-sm font-extrabold">Kế hoạch hôm nay</div>
            <div className="text-xs font-semibold text-muted-foreground">Học bài, ôn SRS, luyện nói, quét OCR</div>
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
          {["Trang chủ", "Học", "Luyện tập", "Dịch", "AI Tutor", "Shop"].map((label, index) => (
            <div
              key={label}
              className={cn(
                "mb-2 rounded-lg px-3 py-2 text-xs font-bold",
                index === 3 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
              )}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-card p-5">
          <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
            <Compass size={16} />
            Tour ứng dụng
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
        {["Từ mới", "Hội thoại nghe", "Đọc hiểu", "Bài tập"].map((label, index) => (
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
    { label: "Minimal Pairs", icon: Dumbbell },
    { label: "Shadowing", icon: Languages },
    { label: "Hanzi", icon: PencilLine },
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
      <div className="mx-auto flex min-h-57.5 max-w-sm flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary bg-primary/5">
        <div className="font-serif text-7xl font-extrabold">水</div>
        <div className="mt-3 text-sm font-bold text-primary">Chạm để xem đáp án</div>
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

function TranslateVisual() {
  return (
    <VisualFrame>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg bg-card p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-extrabold">
            <Languages size={18} className="text-primary" />
            Văn bản / OCR
          </div>
          <div className="flex min-h-42.5 items-center justify-center rounded-lg border bg-[#1e1e24] text-white/70">
            <Camera size={38} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {["Camera", "Quét", "Tải ảnh"].map((label, index) => (
              <div key={label} className={cn("rounded-lg py-2 text-center text-xs font-bold", index === 1 ? "bg-primary text-primary-foreground" : "bg-secondary")}>
                {label}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-card p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-extrabold">
            <ScanLine size={18} className="text-jade" />
            Kết quả
          </div>
          {["你好", "我想喝茶", "谢谢"].map((text, index) => (
            <div key={text} className={cn("mb-2 rounded-lg border px-3 py-2", index === 1 ? "border-primary bg-primary/5" : "bg-background")}>
              <div className="font-serif text-xl font-extrabold">{text}</div>
              <div className="text-xs font-bold text-primary">{["nǐ hǎo", "wǒ xiǎng hē chá", "xiè xie"][index]}</div>
            </div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

function AiTutorVisual() {
  return (
    <VisualFrame>
      <div className="mx-auto max-w-md rounded-lg bg-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-extrabold">
            <Bot size={19} className="text-tone-3" />
            AI Tutor
          </div>
          <div className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">6/10 free</div>
        </div>
        <div className="space-y-3">
          <div className="max-w-[82%] rounded-lg border bg-background p-3">
            <div className="font-serif text-xl font-extrabold">你今天想练什么？</div>
            <div className="mt-1 text-xs font-bold text-primary">nǐ jīn tiān xiǎng liàn shén me?</div>
          </div>
          <div className="ml-auto max-w-[78%] rounded-lg bg-primary p-3 text-primary-foreground">
            <div className="font-serif text-xl font-extrabold">我想点菜。</div>
          </div>
          <div className="rounded-lg border border-tone-3/30 bg-tone-3/10 p-3 text-xs font-semibold text-tone-3">
            Gợi ý sửa câu và phản hồi theo ngữ cảnh
          </div>
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

function ShopVisual() {
  return (
    <VisualFrame>
      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Gems", value: "360", icon: Gem },
          { label: "Freeze", value: "2", icon: Shield },
          { label: "Premium", value: "Free", icon: Crown },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg bg-card p-3">
            <Icon className="mx-auto mb-2 text-primary" size={20} />
            <strong className="block text-lg">{value}</strong>
            <span className="text-xs font-bold text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {["Streak Freeze", "Premium 30 ngày", "Avatar Panda", "AI Tutor Scholar"].map((label, index) => (
          <div key={label} className="rounded-lg border bg-card p-4">
            <ShoppingBag className="mb-3 text-primary" size={22} />
            <div className="text-sm font-extrabold">{label}</div>
            <div className="mt-3 inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-bold">
              <Gem size={13} />
              {[60, 500, 120, 220][index]}
            </div>
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

function CommunityVisual() {
  return (
    <VisualFrame>
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-lg bg-card p-1">
        {["Bảng xếp hạng", "Bạn bè"].map((label, index) => (
          <div key={label} className={cn("rounded-md py-2 text-center text-xs font-extrabold", index === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
            {label}
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-card">
        {["Lan", "Minh", "You", "Hoa"].map((name, index) => (
          <div key={name} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 border-b px-3 py-3 last:border-b-0">
            <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-sm font-extrabold">{index + 1}</div>
            <div>
              <div className="text-sm font-extrabold">{name}</div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Users size={12} />
                {index + 3} ngày streak
              </div>
            </div>
            <strong className="text-primary">{[1280, 940, 710, 660][index]} XP</strong>
          </div>
        ))}
      </div>
      <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-bold text-primary">
        <UserPlus size={16} />
        Gửi lời mời kết bạn
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
        {["Mục tiêu ngày", "Ngôn ngữ", "Giao diện", "Gems & Premium"].map((label) => (
          <div key={label} className="rounded-lg bg-card p-4">
            <div className="text-sm font-extrabold">{label}</div>
            <div className="mt-3 h-2 w-24 rounded bg-border" />
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

function AdminVisual() {
  return (
    <VisualFrame>
      <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-bold text-primary">
        <Shield size={17} />
        Admin CMS
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Lessons", icon: MessageSquareText },
          { label: "Words", icon: CheckCircle2 },
          { label: "Users", icon: Users },
        ].map(({ label, icon: Icon }) => (
          <div key={label} className="rounded-lg bg-card p-4">
            <Icon className="mb-3 text-primary" size={22} />
            <div className="text-sm font-extrabold">{label}</div>
            <div className="mt-3 h-2 rounded bg-border" />
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-card p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-extrabold">
          <BookOpen size={17} className="text-tone-3" />
          AI logs và báo cáo lỗi
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-9 rounded-lg bg-secondary" />
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}
