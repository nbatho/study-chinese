import { useState } from "react";
import {
  Bot,
  CheckCircle2,
  FileWarning,
  LayoutDashboard,
  MessageSquareText,
  Shield,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import LoginPromptCard from "../../components/LoginPromptCard";
import { Badge } from "../../components/ui/badge";
import { useAppSelector } from "../../store/hooks";
import { cn } from "../../utils/cn";
import { AiLogViewer, LessonManager, OverviewPanel, ReportManager, UserManager, WordManager } from "./components/AdminPanels";

type AdminTab = "overview" | "lessons" | "words" | "users" | "logs" | "reports";

export default function Admin() {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const [tab, setTab] = useState<AdminTab>("overview");

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={Shield}
        title="Admin cần đăng nhập"
        description="Đăng nhập bằng tài khoản admin để quản lý nội dung và log hệ thống."
      />
    );
  }

  if (user?.role !== "admin") {
    return (
      <section className="app-surface-padded text-left">
        <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
          <Shield size={24} />
        </div>
        <h1 className="text-xl font-extrabold">Không có quyền truy cập</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tài khoản hiện tại chưa có role admin. Hãy cấp role trong database hoặc qua biến ADMIN_EMAILS rồi đăng nhập lại.
        </p>
      </section>
    );
  }

  const tabs: Array<{ id: AdminTab; label: string; icon: LucideIcon }> = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "lessons", label: "Lessons", icon: MessageSquareText },
    { id: "words", label: "Words", icon: CheckCircle2 },
    { id: "users", label: "Users", icon: Users },
    { id: "logs", label: "AI Logs", icon: Bot },
    { id: "reports", label: "Reports", icon: FileWarning },
  ];

  return (
    <div className="app-page">
      <header className="app-page-header mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge className="mb-2 rounded-lg">Admin CMS</Badge>
          <h1 className="text-2xl font-extrabold">Quản trị nội dung</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Thêm sửa bài học, từ vựng, người dùng, log AI và báo lỗi khóa học.
          </p>
        </div>
        <div className="text-sm font-semibold text-muted-foreground">{user.email}</div>
      </header>

      <div className="app-surface mb-5 flex gap-1 overflow-x-auto p-1">
        {tabs.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-extrabold transition",
                tab === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary",
              )}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "overview" && <OverviewPanel />}
      {tab === "lessons" && <LessonManager />}
      {tab === "words" && <WordManager />}
      {tab === "users" && <UserManager />}
      {tab === "logs" && <AiLogViewer />}
      {tab === "reports" && <ReportManager />}
    </div>
  );
}
