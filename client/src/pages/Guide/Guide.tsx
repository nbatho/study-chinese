import {
  BookMarked,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Compass,
  Dumbbell,
  Home,
  Languages,
  MousePointerClick,
  RefreshCw,
  Shield,
  ShoppingBag,
  Sparkles,
  Trophy,
  User,
  Users,
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
    description: "Điểm bắt đầu sau khi đăng nhập, nơi người học xem tiến độ, mục tiêu hôm nay, streak, Gems và các lối tắt quan trọng.",
    route: "/",
    icon: Home,
    tone: "bg-primary",
    visual: "home",
    points: ["Xem XP, Gems, streak và số thẻ cần ôn", "Tiếp tục bài học đang dang dở", "Mở nhanh học, luyện tập, OCR, AI Tutor hoặc cửa hàng"],
  },
  {
    id: "learn",
    title: "Học",
    sidebarLabel: "Học",
    description: "Khu vực học theo lộ trình HSK, gồm từ mới, hội thoại, ngữ pháp, đọc hiểu, nghe hiểu và bài tập cuối bài.",
    route: "/learn",
    icon: BookOpen,
    tone: "bg-tone-1",
    visual: "learn",
    points: ["Chọn cấp HSK phù hợp", "Học từ mới, mẫu câu, đoạn đọc và hội thoại nghe", "Hoàn thành bài tập để nhận XP và Gems"],
  },
  {
    id: "practice",
    title: "Luyện tập",
    sidebarLabel: "Luyện tập",
    description: "Bộ công cụ luyện kỹ năng nhỏ như nghe, thanh điệu, pinyin, minimal pairs, shadowing và viết Hán tự.",
    route: "/practice",
    icon: Dumbbell,
    tone: "bg-tone-3",
    visual: "practice",
    points: ["Chọn dạng luyện tập theo kỹ năng", "Làm prompt ngắn lấy dữ liệu từ server", "Nhận phản hồi, ghi lỗi sai và cộng XP sau mỗi lượt"],
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
    points: ["Tìm từ bằng Hán tự, pinyin hoặc nghĩa", "Lọc theo HSK và chủ đề", "Nghe phát âm, yêu thích, thêm vào list hoặc SRS"],
  },
  {
    id: "translate",
    title: "Dịch / OCR",
    sidebarLabel: "Dịch",
    description: "Dịch văn bản tiếng Trung hoặc quét ảnh bằng OCR, tách cụm từ, lưu lịch sử và đưa từ nhận diện vào danh sách học.",
    route: "/translate",
    icon: Languages,
    tone: "bg-tone-2",
    visual: "translate",
    points: ["Nhập văn bản hoặc mở camera/tải ảnh", "Chọn từng cụm OCR để xem pinyin và nghĩa", "Lưu vào list, SRS, lịch sử OCR hoặc đánh dấu yêu thích"],
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
    points: ["Lật thẻ để xem đáp án", "Tự đánh giá mức nhớ bằng Again, Hard, Good, Easy", "Ôn đều để giữ streak và giảm quên từ"],
  },
  {
    id: "ai-tutor",
    title: "AI Tutor",
    sidebarLabel: "AI Tutor",
    description: "Luyện hội thoại tiếng Trung theo tình huống, có phản hồi sửa câu, đọc phát âm và giới hạn lượt miễn phí/premium.",
    route: "/ai-tutor",
    icon: Sparkles,
    tone: "bg-tone-4",
    visual: "aiTutor",
    points: ["Chọn tình huống hội thoại", "Nhắn bằng tiếng Trung và nghe tutor đọc lại", "Theo dõi quota miễn phí hoặc nâng cấp Premium trong Shop"],
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
    points: ["Xem các huy hiệu đã mở khóa", "Theo dõi mục tiêu kế tiếp theo nhóm kỹ năng", "Tạo động lực học đều mỗi ngày"],
  },
  {
    id: "shop",
    title: "Cửa hàng",
    sidebarLabel: "Cửa hàng",
    description: "Dùng Gems kiếm được từ học tập để mua Streak Freeze, avatar, skin AI Tutor và Premium tạm thời.",
    route: "/shop",
    icon: ShoppingBag,
    tone: "bg-tone-1",
    visual: "shop",
    points: ["Xem số Gems, Freeze và trạng thái Premium", "Mua vật phẩm bằng Gems", "Trang bị avatar hoặc phong cách AI Tutor đã sở hữu"],
  },
  {
    id: "community",
    title: "Cộng đồng",
    sidebarLabel: "Cộng đồng",
    description: "Khu vực kết nối người học với leaderboard XP và hệ thống bạn bè.",
    route: "/community",
    icon: Users,
    tone: "bg-tone-3",
    visual: "community",
    points: ["Xem bảng xếp hạng toàn cục hoặc bạn bè", "Gửi và quản lý lời mời kết bạn", "Theo dõi XP, streak và tiến trình của nhau"],
  },
  {
    id: "profile",
    title: "Hồ sơ",
    sidebarLabel: "Hồ sơ",
    description: "Quản lý thông tin cá nhân, mục tiêu học, giao diện, ngôn ngữ, âm thanh, ví Gems và trạng thái Premium.",
    route: "/profile",
    icon: User,
    tone: "bg-tone-2",
    visual: "profile",
    points: ["Cập nhật tên và avatar", "Điều chỉnh mục tiêu hằng ngày", "Đổi giao diện, ngôn ngữ, âm thanh và xem trạng thái tài khoản"],
  },
  {
    id: "admin",
    title: "Admin",
    sidebarLabel: "Admin",
    description: "Màn quản trị chỉ hiện với tài khoản admin, dùng để quản lý nội dung, người dùng, AI logs và báo cáo lỗi khóa học.",
    route: "/admin",
    icon: Shield,
    tone: "bg-tone-4",
    visual: "admin",
    points: ["Xem dashboard hệ thống", "Thêm sửa bài học, từ vựng và người dùng", "Kiểm tra AI logs và xử lý báo cáo lỗi nội dung"],
  },
  {
    id: "guide",
    title: "Hướng dẫn",
    sidebarLabel: "Hướng dẫn",
    description: "Trang tour trực quan giúp người mới hiểu từng mục trong ứng dụng trước khi bắt đầu học.",
    route: "/guide",
    icon: Compass,
    tone: "bg-primary",
    visual: "guide",
    points: ["Đi theo từng bước trong danh sách", "Xem minh họa chức năng chính", "Bấm mở màn hình tương ứng khi đã sẵn sàng"],
  },
];

export default function Guide() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = sidebarSteps[activeIndex];
  const ActiveIcon = activeStep.icon;
  const progressPercent = ((activeIndex + 1) / sidebarSteps.length) * 100;

  const goToStep = (index: number) => {
    const nextIndex = Math.min(Math.max(index, 0), sidebarSteps.length - 1);
    setActiveIndex(nextIndex);
  };

  return (
    <div className="app-page">
      <header className="app-page-header mb-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="text-left">
            <div className="mb-3 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
              <Compass size={18} />
              {t("guide.badge")}
            </div>
            <h1 className="max-w-2xl text-3xl font-extrabold sm:text-4xl">{t("guide.title")}</h1>
            <p className="mt-3 max-w-3xl text-[0.95rem] leading-relaxed text-muted-foreground">
              Mỗi bước tương ứng với một mục trong ứng dụng. Dùng Trước/Tiếp để đi qua tour và mở màn hình tương ứng khi đã sẵn sàng.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm font-bold">
            <ActiveIcon className="size-4 text-primary" />
            Bước {activeIndex + 1}/{sidebarSteps.length}: {activeStep.sidebarLabel}
          </div>
        </div>
      </header>

      <section className="app-surface overflow-hidden">
        <div className="border-b bg-secondary/35 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3 text-left">
              <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl text-white", activeStep.tone)}>
                <ActiveIcon size={22} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-extrabold text-primary">
                  Bước {activeIndex + 1}/{sidebarSteps.length}
                </div>
                <h2 className="truncate text-xl font-extrabold sm:text-2xl">{activeStep.title}</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:w-57.5">
              <button
                type="button"
                onClick={() => goToStep(activeIndex - 1)}
                disabled={activeIndex === 0}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm font-bold transition hover:border-primary hover:text-primary active:translate-y-px disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft size={18} />
                Trước
              </button>
              <button
                type="button"
                onClick={() => goToStep(activeIndex + 1)}
                disabled={activeIndex === sidebarSteps.length - 1}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm font-bold transition hover:border-primary hover:text-primary active:translate-y-px disabled:pointer-events-none disabled:opacity-40"
              >
                Tiếp
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-background">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <article className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="p-4 sm:p-5">
            <GuideVisual type={activeStep.visual} />
          </div>

          <div className="border-t bg-secondary/20 p-5 text-left lg:border-l lg:border-t-0">
            <div className="text-sm font-extrabold text-primary">
              {activeStep.sidebarLabel}
            </div>
            <h3 className="mt-2 text-2xl font-extrabold">{activeStep.title}</h3>
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

            <div className="mt-6 grid gap-2">
              <button
                type="button"
                onClick={() => navigate(activeStep.route)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 active:translate-y-px"
              >
                <MousePointerClick size={18} />
                {t("guide.open")}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => goToStep(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm font-bold transition hover:border-primary hover:text-primary active:translate-y-px disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                  Trước
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(activeIndex + 1)}
                  disabled={activeIndex === sidebarSteps.length - 1}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm font-bold transition hover:border-primary hover:text-primary active:translate-y-px disabled:pointer-events-none disabled:opacity-40"
                >
                  Tiếp
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
