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
import LoadingCard from "../../components/LoadingCard";
import LoginPromptCard from "../../components/LoginPromptCard";
import { Badge } from "../../components/ui/badge";
import { useI18n } from "../../i18n";
import type { TranslationKey } from "../../i18n";
import { useAuthGate } from "../../hooks/useAuthGate";
import { useAppSelector } from "../../store/hooks";
import { cn } from "../../utils/cn";
import { AiLogViewer, LessonManager, OverviewPanel, ReportManager, UserManager, WordManager } from "./components/AdminPanels";

type AdminTab = "overview" | "lessons" | "words" | "users" | "logs" | "reports";

export default function Admin() {
  const { t } = useI18n();
  const user = useAppSelector((state) => state.auth.user);
  const { isResolving, isAuthenticated } = useAuthGate();
  const [tab, setTab] = useState<AdminTab>("overview");

  if (isResolving) {
    return <LoadingCard label={t("common.loading")} />;
  }

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={Shield}
        title={t("admin.loginTitle")}
        description={t("admin.loginBody")}
      />
    );
  }

  if (user?.role !== "admin") {
    return (
      <section className="app-surface-padded text-left">
        <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
          <Shield size={24} />
        </div>
        <h1 className="text-xl font-extrabold">{t("admin.noAccessTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("admin.noAccessBody")}</p>
      </section>
    );
  }

  const tabs: Array<{ id: AdminTab; labelKey: TranslationKey; icon: LucideIcon }> = [
    { id: "overview", labelKey: "admin.tabOverview", icon: LayoutDashboard },
    { id: "lessons", labelKey: "admin.tabLessons", icon: MessageSquareText },
    { id: "words", labelKey: "admin.tabWords", icon: CheckCircle2 },
    { id: "users", labelKey: "admin.tabUsers", icon: Users },
    { id: "logs", labelKey: "admin.tabLogs", icon: Bot },
    { id: "reports", labelKey: "admin.tabReports", icon: FileWarning },
  ];

  return (
    <div className="app-page">
      <header className="app-page-header mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge className="mb-2 rounded-lg">{t("admin.badge")}</Badge>
          <h1 className="text-2xl font-extrabold">{t("admin.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("admin.subtitle")}</p>
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
              {t(item.labelKey)}
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
