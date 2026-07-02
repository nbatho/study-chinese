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
  WandSparkles
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAppSelector } from "../../store/hooks";
import { cn } from "../../utils/cn";
import { FadeIn } from "../../components/ui/FadeIn";

const featureCards = [
  {
    title: "Lộ trình HSK rõ ràng",
    description: "Học theo bài, theo cấp độ và tiếp tục đúng nơi bạn đang dừng.",
    icon: BookOpen,
    color: "text-primary",
    bg: "bg-primary/10",
    href: "/learn",
  },
  {
    title: "Luyện nói và phản xạ",
    description: "Luyện phát âm, sắp xếp câu, nghe hiểu và ghi nhớ mặt chữ trong một nơi.",
    icon: Mic2,
    color: "text-tone-1",
    bg: "bg-tone-1/10",
    href: "/practice",
  },
  {
    title: "Từ điển trong ngữ cảnh",
    description: "Tra từ, xem pinyin, nghĩa, ví dụ và lưu lại những từ cần học tiếp.",
    icon: BookMarked,
    color: "text-jade",
    bg: "bg-jade/10",
    href: "/dictionary",
  },
  {
    title: "Dịch văn bản và hình ảnh",
    description: "Nhập câu, chụp ảnh chữ Hán và nhận giải thích để hiểu nhanh hơn.",
    icon: Camera,
    color: "text-tone-3",
    bg: "bg-tone-3/10",
    href: "/translate",
  },
  {
    title: "Gia sư AI",
    description: "Hỏi cách dùng từ, nhờ sửa câu và luyện hội thoại theo tình huống.",
    icon: Sparkles,
    color: "text-tone-4",
    bg: "bg-tone-4/10",
    href: "/ai-tutor",
  },
  {
    title: "Cộng đồng học tập",
    description: "Chia sẻ câu hỏi, mẹo học và những ghi chú hữu ích với người cùng học.",
    icon: Users,
    color: "text-tone-2",
    bg: "bg-tone-2/10",
    href: "/community",
  },
];

const studyFlow = [
  {
    label: "Khởi động",
    title: "Chọn mục tiêu và cấp độ",
    description: "Bắt đầu từ nền tảng hiện tại để bài học vừa sức.",
    icon: WandSparkles,
  },
  {
    label: "Học mới",
    title: "Đi qua bài học ngắn",
    description: "Mỗi bài kết hợp từ vựng, mẫu câu, pinyin và ví dụ.",
    icon: BookOpen,
  },
  {
    label: "Thực hành",
    title: "Biến kiến thức thành phản xạ",
    description: "Nghe, nói, viết, dịch và ôn lại bằng bài tập tương tác.",
    icon: RefreshCw,
  },
];

const previewRows = [
  { hanzi: "你好", pinyin: "nǐ hǎo", meaning: "Xin chào" },
  { hanzi: "我想点菜", pinyin: "wǒ xiǎng diǎn cài", meaning: "Tôi muốn gọi món" },
  { hanzi: "今天很忙", pinyin: "jīn tiān hěn máng", meaning: "Hôm nay rất bận" },
];

export default function Landing() {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const primaryTarget = "/home";

  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-primary/20">
      {/* Hero Section */}
      <section className="relative pt-24 pb-28 sm:pt-32 sm:pb-36 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col items-center text-center">
        <FadeIn direction="up" delay={100} className="z-10 w-full flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <Sparkles size={16} />
            <span>Nền tảng học tiếng Trung toàn diện</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-foreground tracking-tight mb-6">
            Làm chủ tiếng Trung <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
              dễ dàng hơn bao giờ hết
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Học theo lộ trình bài bản, luyện phản xạ tự nhiên, tra từ điển thông minh và nhận sự hỗ trợ 24/7 từ Gia sư AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Button size="lg" className="rounded-full w-full sm:w-auto text-base h-14 px-10 shadow-md hover:shadow-lg transition-shadow" onClick={() => navigate(primaryTarget)}>
              {isAuthenticated ? "Vào học ngay" : "Bắt đầu học miễn phí"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto text-base h-14 px-10 border-2 hover:bg-secondary transition-colors" onClick={() => navigate("/guide")}>
              <Play className="mr-2 h-5 w-5" />
              Xem hướng dẫn
            </Button>
          </div>
        </FadeIn>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/40 px-4 sm:px-6 lg:px-8 border-y">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-foreground">Hệ sinh thái công cụ học tập</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mọi tính năng bạn cần để thành thạo tiếng Trung đều được tích hợp trong một nền tảng duy nhất, giúp việc học mượt mà và tập trung hơn.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featureCards.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <FadeIn key={feature.title} delay={index * 100}>
                  <div 
                    onClick={() => navigate(feature.href)}
                    className="group h-full bg-card p-8 rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col"
                  >
                    <div className={cn("w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110", feature.bg, feature.color)}>
                      <Icon size={28} />
                    </div>
                    <h3 className="text-xl font-extrabold mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all">
                      <span>Khám phá ngay</span>
                      <ArrowRight size={16} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-jade/10 text-jade text-xs font-extrabold uppercase tracking-widest mb-6">
                  <CheckCircle2 size={14} />
                  <span>Cách thức hoạt động</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-foreground">Học tập theo một lộ trình khoa học</h2>
                <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                  Chúng tôi thiết kế một quy trình học tập tối ưu, đi từ bước nhận diện, ghi nhớ đến việc biến nó thành phản xạ tự nhiên thông qua luyện tập.
                </p>
              </FadeIn>
              
              <div className="space-y-6">
                {studyFlow.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <FadeIn key={step.title} delay={index * 150} direction="right">
                      <div className="flex gap-5 p-5 rounded-3xl bg-card border shadow-sm hover:border-primary/40 transition-colors group">
                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center relative group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                           <Icon size={24} />
                           {index !== studyFlow.length - 1 && (
                             <div className="absolute top-14 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-border group-hover:bg-primary/30 transition-colors"></div>
                           )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-extrabold text-primary uppercase tracking-[0.08em]">{step.label}</span>
                          </div>
                          <h3 className="text-lg font-extrabold text-foreground mb-1.5">{step.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
            
            <FadeIn direction="left" className="relative h-full min-h-125 lg:h-150 rounded-[2.5rem] bg-secondary/60 p-8 flex flex-col justify-center border overflow-hidden">
                <div className="absolute -top-10 -right-10 p-8 opacity-3 text-primary">
                   <Languages size={300} />
                </div>
                <div className="relative z-10 space-y-5">
                  {previewRows.map((row, index) => (
                    <div key={row.hanzi} className="bg-card p-5 rounded-2xl shadow-sm border flex items-center gap-4 transform transition-all duration-300 hover:scale-102 hover:shadow-md" style={{ transform: `translateX(${index * 24}px)` }}>
                      <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center font-extrabold text-primary">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="text-2xl font-serif font-bold text-foreground truncate">{row.hanzi}</div>
                        <div className="text-sm font-medium text-muted-foreground mt-0.5 truncate">{row.pinyin} • {row.meaning}</div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-10 bg-primary text-primary-foreground p-7 rounded-4xl shadow-xl relative overflow-hidden transform transition-all hover:-translate-y-1">
                     <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                     <div className="flex items-center gap-3 mb-3 relative z-10">
                       <Sparkles size={24} className="text-yellow-300" />
                       <span className="text-lg font-extrabold">Gia sư AI luôn sẵn sàng</span>
                     </div>
                     <p className="text-primary-foreground/90 text-sm leading-relaxed relative z-10 font-medium">
                       Bạn có thể hỏi bất kỳ ngữ pháp nào, nhờ giải thích đoạn hội thoại, hoặc tự tạo tình huống để luyện nói trực tiếp với AI.
                     </p>
                  </div>
                </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 mb-10">
        <FadeIn direction="up">
          <div className="max-w-5xl mx-auto bg-card rounded-[3rem] border shadow-2xl overflow-hidden relative">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-background to-background"></div>
             
             <div className="relative z-10 p-12 sm:p-20 text-center">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-8">
                 <Rocket size={32} />
               </div>
               <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 text-foreground tracking-tight">Sẵn sàng nâng cao trình độ?</h2>
               <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                 Tham gia cùng hàng ngàn học viên khác. Bắt đầu hành trình chinh phục tiếng Trung của bạn với các công cụ học tập thông minh nhất.
               </p>
               
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <Button size="lg" className="rounded-full text-base font-bold h-14 px-10 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5" onClick={() => navigate(primaryTarget)}>
                   {isAuthenticated ? "Tiếp tục học ngay" : "Tạo tài khoản miễn phí"}
                   <ArrowRight className="ml-2 h-5 w-5" />
                 </Button>
                 <Button size="lg" variant="secondary" className="rounded-full text-base font-bold h-14 px-10 w-full sm:w-auto border transition-all hover:-translate-y-0.5" onClick={() => navigate("/translate")}>
                   <Camera className="mr-2 h-5 w-5" />
                   Thử dịch văn bản
                 </Button>
               </div>
             </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
