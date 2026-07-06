import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Camera,
  CheckCircle2,
  Languages,
  Mic2,
  Play,
  RefreshCw,
  Rocket,
  Sparkles,
  Users,
  WandSparkles,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAppSelector } from "../../store/hooks";
import { cn } from "../../utils/cn";
import { FadeIn } from "../../components/ui/FadeIn";

const featureCards = [
  {
    title: "Lộ trình HSK rõ ràng",
    description: "Theo dõi bài học, cấp độ và tiến độ trong một mạch học dễ quay lại.",
    icon: BookOpen,
    href: "/learn",
    className: "lg:col-span-2",
  },
  {
    title: "Luyện nói và phản xạ",
    description: "Nghe, nói, sắp xếp câu và ghi nhớ mặt chữ bằng bài tập ngắn.",
    icon: Mic2,
    href: "/practice",
    className: "lg:row-span-2",
  },
  {
    title: "Từ điển trong ngữ cảnh",
    description: "Tra pinyin, nghĩa, ví dụ và lưu từ cần ôn tiếp.",
    icon: BookMarked,
    href: "/dictionary",
    className: "",
  },
  {
    title: "Dịch văn bản và hình ảnh",
    description: "Nhập câu hoặc chụp chữ Hán để nhận giải thích nhanh.",
    icon: Camera,
    href: "/translate",
    className: "",
  },
  {
    title: "Gia sư AI",
    description: "Hỏi ngữ pháp, sửa câu và luyện hội thoại theo tình huống.",
    icon: Sparkles,
    href: "/ai-tutor",
    className: "lg:col-span-2",
  },
  {
    title: "Cộng đồng học tập",
    description: "Chia sẻ câu hỏi, mẹo học và ghi chú hữu ích với người cùng học.",
    icon: Users,
    href: "/community",
    className: "",
  },
];

const studyFlow = [
  {
    label: "Đặt mục tiêu",
    title: "Chọn cấp độ phù hợp",
    description: "Bắt đầu từ nền tảng hiện tại để bài học vừa sức.",
    icon: WandSparkles,
  },
  {
    label: "Học theo bài",
    title: "Đi qua nội dung ngắn",
    description: "Từ vựng, mẫu câu, pinyin và ví dụ được gom thành từng phiên học.",
    icon: BookOpen,
  },
  {
    label: "Ôn có nhịp",
    title: "Biến kiến thức thành phản xạ",
    description: "Luyện nghe, nói, viết, dịch và ôn lại bằng bài tập tương tác.",
    icon: RefreshCw,
  },
];

const previewRows = [
  { hanzi: "你好", pinyin: "nǐ hǎo", meaning: "Xin chào" },
  { hanzi: "我想点菜", pinyin: "wǒ xiǎng diǎn cài", meaning: "Tôi muốn gọi món" },
  { hanzi: "今天很忙", pinyin: "jīn tiān hěn máng", meaning: "Hôm nay rất bận" },
];

const productStats = [
  { label: "Phiên học", value: "18m" },
  { label: "Từ mới", value: "12" },
  { label: "Ôn lại", value: "24" },
];

export default function Landing() {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const primaryTarget = "/home";
  const primaryCta = isAuthenticated ? "Vào học ngay" : "Bắt đầu học miễn phí";

  return (
    <div className="min-h-[100dvh] overflow-hidden bg-background selection:bg-primary/20">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/88 backdrop-blur-xl">
        <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/landing")}
            className="flex min-w-0 items-center gap-3 rounded-2xl text-left transition hover:text-primary"
            title="Study Chinese"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary font-serif text-2xl font-extrabold text-primary-foreground shadow-sm">
              学
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold">Study Chinese</span>
              <span className="block truncate text-xs font-semibold text-muted-foreground">HSK Learning</span>
            </span>
          </button>

          <div className="hidden items-center gap-7 text-sm font-bold text-muted-foreground md:flex">
            <button type="button" onClick={() => navigate("/learn")} className="transition hover:text-foreground">
              Lộ trình
            </button>
            <button type="button" onClick={() => navigate("/practice")} className="transition hover:text-foreground">
              Luyện tập
            </button>
            <button type="button" onClick={() => navigate("/translate")} className="transition hover:text-foreground">
              Dịch nhanh
            </button>
          </div>

          <Button className="h-11 rounded-full px-5" onClick={() => navigate(primaryTarget)}>
            {primaryCta}
            <ArrowRight className="size-4" />
          </Button>
        </nav>
      </header>

      <main>
        <section className="relative mx-auto grid min-h-[100dvh] max-w-7xl items-center gap-10 px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] lg:px-8">
          <div className="pointer-events-none absolute inset-x-0 top-[4.5rem] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <FadeIn direction="up" delay={80} className="relative z-10 max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
              <Sparkles size={16} />
              <span>Nền tảng học tiếng Trung toàn diện</span>
            </div>
            <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.04] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Học tiếng Trung có nhịp, có lộ trình
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground sm:text-lg">
              Bài học HSK, luyện phản xạ, từ điển và AI tutor cùng nằm trong một không gian học rõ ràng.
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button
                size="lg"
                className="h-14 rounded-full px-8 text-base font-extrabold shadow-lg shadow-primary/20 active:translate-y-px"
                onClick={() => navigate(primaryTarget)}
              >
                {primaryCta}
                <ArrowRight className="size-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 rounded-full border-2 bg-background/70 px-8 text-base font-extrabold active:translate-y-px"
                onClick={() => navigate("/guide")}
              >
                <Play className="size-5" />
                Xem hướng dẫn
              </Button>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={160} className="relative z-10">
            <div className="relative mx-auto max-w-xl">
              <div className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border bg-card shadow-2xl shadow-primary/10">
                <div className="border-b bg-secondary/50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                        <Languages size={22} />
                      </span>
                      <div>
                        <p className="text-sm font-extrabold text-foreground">Phiên học hôm nay</p>
                        <p className="text-xs font-semibold text-muted-foreground">HSK 2 - Giao tiếp thường ngày</p>
                      </div>
                    </div>
                    <CheckCircle2 className="size-6 text-primary" />
                  </div>
                </div>

                <div className="grid gap-4 p-5 sm:p-6">
                  <div className="grid grid-cols-3 gap-3">
                    {productStats.map((stat) => (
                      <div key={stat.label} className="rounded-2xl border bg-background p-3">
                        <span className="block text-xs font-bold text-muted-foreground">{stat.label}</span>
                        <strong className="mt-1 block text-2xl text-foreground">{stat.value}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[1.5rem] border bg-background p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h2 className="text-sm font-extrabold text-foreground">Từ cần nhớ</h2>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">Đang học</span>
                    </div>
                    <div className="grid gap-3">
                      {previewRows.map((row) => (
                        <div key={row.hanzi} className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-3 rounded-2xl bg-card p-3 shadow-sm">
                          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 font-serif text-2xl font-bold text-primary">
                            {row.hanzi.slice(0, 1)}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-serif text-2xl font-bold text-foreground">{row.hanzi}</span>
                            <span className="block truncate text-sm font-medium text-muted-foreground">
                              {row.pinyin} / {row.meaning}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] bg-primary p-5 text-primary-foreground shadow-lg shadow-primary/20">
                    <div className="mb-2 flex items-center gap-2">
                      <Sparkles size={20} />
                      <span className="font-extrabold">Gia sư AI sẵn sàng hỗ trợ</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-primary-foreground/90">
                      Hỏi cách dùng từ, nhờ sửa câu hoặc tạo tình huống luyện nói ngay trong bài học.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        <section className="border-y bg-secondary/40 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <FadeIn className="mb-12 max-w-3xl">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Một bộ công cụ đủ gọn để học mỗi ngày
              </h2>
              <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground">
                Các tính năng chính được nối với nhau theo hành trình học, không tách thành những màn rời rạc.
              </p>
            </FadeIn>

            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featureCards.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <FadeIn key={feature.title} delay={index * 60}>
                    <button
                      type="button"
                      onClick={() => navigate(feature.href)}
                      className={cn(
                        "group flex h-full w-full flex-col justify-between rounded-[1.5rem] border bg-card p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10 active:translate-y-px",
                        feature.className,
                      )}
                    >
                      <span className="mb-8 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon size={24} />
                      </span>
                      <span>
                        <span className="block text-xl font-extrabold text-foreground">{feature.title}</span>
                        <span className="mt-3 block text-sm font-medium leading-relaxed text-muted-foreground">
                          {feature.description}
                        </span>
                      </span>
                      <span className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-primary">
                        Mở công cụ
                        <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                      </span>
                    </button>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <FadeIn>
              <div className="sticky top-28">
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Học theo một nhịp dễ duy trì
                </h2>
                <p className="mt-4 max-w-xl text-base font-medium leading-relaxed text-muted-foreground">
                  Mỗi phiên học được chia nhỏ để bạn biết nên bắt đầu ở đâu, cần ôn gì và khi nào nên luyện phản xạ.
                </p>
              </div>
            </FadeIn>

            <div className="grid gap-4">
              {studyFlow.map((step, index) => {
                const Icon = step.icon;

                return (
                  <FadeIn key={step.title} delay={index * 90} direction="right">
                    <div className="grid gap-4 rounded-[1.5rem] border bg-card p-5 shadow-sm transition hover:border-primary/30 sm:grid-cols-[64px_minmax(0,1fr)]">
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon size={25} />
                      </div>
                      <div>
                        <span className="text-sm font-extrabold text-primary">{step.label}</span>
                        <h3 className="mt-1 text-xl font-extrabold text-foreground">{step.title}</h3>
                        <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-[2rem] border bg-card p-6 shadow-2xl shadow-primary/10 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Rocket size={28} />
                </div>
                <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Sẵn sàng học một phiên ngắn hôm nay?
                </h2>
                <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground">
                  Bắt đầu với lộ trình đang chờ sẵn, hoặc thử dịch nhanh một đoạn tiếng Trung bạn gặp trong ngày.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Button
                  size="lg"
                  className="h-14 rounded-full px-8 text-base font-extrabold shadow-lg shadow-primary/20 active:translate-y-px"
                  onClick={() => navigate(primaryTarget)}
                >
                  {primaryCta}
                  <ArrowRight className="size-5" />
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-14 rounded-full border px-8 text-base font-extrabold active:translate-y-px"
                  onClick={() => navigate("/translate")}
                >
                  <Camera className="size-5" />
                  Thử dịch văn bản
                </Button>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>
    </div>
  );
}
