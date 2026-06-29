import {
  BookMarked,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Dumbbell,
  Home,
  MousePointerClick,
  RefreshCw,
  Trophy,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../i18n";
import { cn } from "../../utils/cn";
import GuideVisual from "./components/GuideVisual";
import type { GuideVisualType } from "./components/GuideVisual";

type SidebarGuideStep = {
  id: string;
  title: string;
  sidebarLabel: string;
  description: string;
  route: string;
  icon: LucideIcon;
  tone: string;
  points: string[];
  visual: GuideVisualType;
};

const sidebarSteps: SidebarGuideStep[] = [
  {
    id: "home",
    title: "Trang chủ",
    sidebarLabel: "Trang chủ",
    description: "Điểm bắt đầu sau khi đăng nhập, nơi người học xem tiến độ, mục tiêu hôm nay và các lối tắt quan trọng.",
    route: "/home",
    icon: Home,
    tone: "bg-primary",
    visual: "home",
    points: ["Xem XP, streak và số thẻ cần ôn", "Tiếp tục bài học đang dang dở", "Mở nhanh các luồng học chính"],
  },
  {
    id: "guide",
    title: "Hướng dẫn",
    sidebarLabel: "Hướng dẫn",
    description: "Trang tour trực quan giúp người mới hiểu từng mục trên sidebar trước khi bắt đầu học.",
    route: "/guide",
    icon: Compass,
    tone: "bg-tone-4",
    visual: "guide",
    points: ["Đi theo từng bước trong sidebar", "Xem minh họa chức năng chính", "Bấm mở màn hình tương ứng khi đã sẵn sàng"],
  },
  {
    id: "learn",
    title: "Học",
    sidebarLabel: "Học",
    description: "Khu vực học bài theo cấp HSK, gồm từ mới, mẫu câu, ngữ pháp và bài tập cuối bài.",
    route: "/learn",
    icon: BookOpen,
    tone: "bg-tone-1",
    visual: "learn",
    points: ["Chọn cấp HSK phù hợp", "Mở bài học và nghe nội dung", "Hoàn thành bài tập để nhận XP"],
  },
  {
    id: "practice",
    title: "Luyện tập",
    sidebarLabel: "Luyện tập",
    description: "Bộ công cụ luyện kỹ năng nhỏ như nghe, thanh điệu, pinyin và viết Hán tự.",
    route: "/practice",
    icon: Dumbbell,
    tone: "bg-tone-3",
    visual: "practice",
    points: ["Chọn dạng luyện tập", "Làm theo prompt ngắn", "Nhận phản hồi và XP sau mỗi lượt"],
  },
  {
    id: "review",
    title: "Ôn tập",
    sidebarLabel: "Ôn tập",
    description: "Nơi ôn từ vựng bằng SRS, giúp hệ thống tự lên lịch cho những từ cần gặp lại.",
    route: "/review",
    icon: RefreshCw,
    tone: "bg-gold",
    visual: "review",
    points: ["Lật thẻ để xem đáp án", "Tự đánh giá mức nhớ", "Ôn đều để giữ nhịp học"],
  },
  {
    id: "dictionary",
    title: "Từ điển",
    sidebarLabel: "Từ điển",
    description: "Tra cứu Hán tự, pinyin hoặc nghĩa, sau đó lưu từ vào danh sách riêng hoặc đưa vào SRS.",
    route: "/dictionary",
    icon: BookMarked,
    tone: "bg-jade",
    visual: "dictionary",
    points: ["Tìm từ bằng Hán tự, pinyin hoặc nghĩa", "Lọc theo HSK và chủ đề", "Nghe phát âm, yêu thích hoặc thêm vào SRS"],
  },
  {
    id: "achievements",
    title: "Thành tựu",
    sidebarLabel: "Thành tựu",
    description: "Theo dõi huy hiệu, mục tiêu đã đạt và những mốc học tập còn có thể mở khóa.",
    route: "/achievements",
    icon: Trophy,
    tone: "bg-primary",
    visual: "achievements",
    points: ["Xem các huy hiệu đã mở khóa", "Theo dõi mục tiêu kế tiếp", "Tạo động lực học đều mỗi ngày"],
  },
  {
    id: "profile",
    title: "Hồ sơ",
    sidebarLabel: "Hồ sơ",
    description: "Quản lý thông tin cá nhân, mục tiêu học, giao diện, ngôn ngữ và tùy chọn âm thanh.",
    route: "/profile",
    icon: User,
    tone: "bg-tone-2",
    visual: "profile",
    points: ["Cập nhật tên và avatar", "Điều chỉnh mục tiêu hằng ngày", "Đổi giao diện, ngôn ngữ và âm thanh"],
  },
];

export default function Guide() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = sidebarSteps[activeIndex];
  const ActiveIcon = activeStep.icon;

  const goToStep = (index: number) => {
    const nextIndex = Math.min(Math.max(index, 0), sidebarSteps.length - 1);
    setActiveIndex(nextIndex);
  };

  return (
    <div className="anim-slide pb-8">
      <header className="mb-5 rounded-lg border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="text-left">
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
              <Compass size={18} />
              {t("guide.badge")}
            </div>
            <h1 className="max-w-2xl text-3xl font-extrabold sm:text-4xl">{t("guide.title")}</h1>
            <p className="mt-3 max-w-3xl text-[0.95rem] leading-relaxed text-muted-foreground">
              Mỗi bước bên dưới tương ứng với một mục trên sidebar. Chọn từng bước để xem chức năng đó dùng để làm gì và mở màn hình tương ứng.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-bold">
            <ActiveIcon className="size-4 text-primary" />
            Bước {activeIndex + 1}/{sidebarSteps.length}: {activeStep.sidebarLabel}
          </div>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <aside className="rounded-lg border bg-card p-3 shadow-sm">
          <div className="mb-3 px-2 text-left text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
            Các bước trên sidebar
          </div>
          <div className="space-y-2">
            {sidebarSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeIndex;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => goToStep(index)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-transparent bg-background hover:border-primary/40 hover:text-primary",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-lg",
                      isActive ? "bg-primary-foreground/15" : "bg-secondary",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-extrabold">Bước {index + 1}</span>
                    <span className={cn("block truncate text-xs font-semibold", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}>
                      {step.sidebarLabel}
                    </span>
                  </span>
                  {isActive && <CheckCircle2 className="size-5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </aside>

        <article className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
            <div className="p-4 sm:p-5">
              <GuideVisual type={activeStep.visual} />
            </div>

            <div className="border-t bg-secondary/35 p-5 text-left lg:border-l lg:border-t-0">
              <div className={cn("mb-4 flex size-12 items-center justify-center rounded-lg text-white", activeStep.tone)}>
                <ActiveIcon size={24} />
              </div>
              <div className="text-sm font-extrabold uppercase tracking-wide text-primary">
                Bước {activeIndex + 1} trên sidebar
              </div>
              <h2 className="mt-2 text-2xl font-extrabold">{activeStep.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{activeStep.description}</p>

              <ol className="mt-5 space-y-3">
                {activeStep.points.map((point, index) => (
                  <li key={point} className="flex gap-3 text-sm font-semibold">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-extrabold text-primary">
                      {index + 1}
                    </span>
                    <span className="pt-1">{point}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                <button
                  type="button"
                  onClick={() => navigate(activeStep.route)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                >
                  <MousePointerClick size={18} />
                  {t("guide.open")}
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => goToStep(activeIndex - 1)}
                    disabled={activeIndex === 0}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-bold transition hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                    Trước
                  </button>
                  <button
                    type="button"
                    onClick={() => goToStep(activeIndex + 1)}
                    disabled={activeIndex === sidebarSteps.length - 1}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-bold transition hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
                  >
                    Tiếp
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

