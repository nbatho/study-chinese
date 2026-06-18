import {
  BookMarked,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Compass,
  Dumbbell,
  Home,
  Languages,
  RefreshCw,
  Trophy,
  User,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDueSrsCardsQuery } from "../api/srs/queries";
import { useI18n } from "../i18n";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "../utils/cn";

interface NavigationProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export default function Navigation({ collapsed, onToggleCollapsed }: NavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const dueCardsQuery = useDueSrsCardsQuery(99);
  const { t } = useI18n();

  const path = location.pathname;
  let activeTab = "home";
  if (path.startsWith("/guide")) activeTab = "guide";
  else if (path.startsWith("/learn")) activeTab = "learn";
  else if (path.startsWith("/practice")) activeTab = "practice";
  else if (path.startsWith("/review")) activeTab = "review";
  else if (path.startsWith("/dictionary")) activeTab = "dictionary";
  else if (path.startsWith("/translate") || path.startsWith("/camera-translator")) activeTab = "translate";
  else if (path.startsWith("/achievements")) activeTab = "achievements";
  else if (path.startsWith("/profile")) activeTab = "profile";

  const tabs = [
    { id: "home", label: t("nav.home"), icon: Home },
    { id: "learn", label: t("nav.learn"), icon: BookOpen },
    { id: "practice", label: t("nav.practice"), icon: Dumbbell },
    { id: "review", label: t("nav.review"), icon: RefreshCw, badge: dueCardsQuery.data?.cards.length ?? 0 },
    { id: "dictionary", label: t("nav.dictionary"), icon: BookMarked },
    { id: "translate", label: t("nav.translate"), icon: Languages },
    { id: "achievements", label: t("nav.achievements"), icon: Trophy },
    { id: "profile", label: t("nav.profile"), icon: User },
  ];

  return (
    <aside
      className={cn(
        "sticky top-0 z-[900] flex h-screen shrink-0 flex-col border-r bg-card/95 shadow-[8px_0_24px_rgba(0,0,0,0.03)] backdrop-blur-xl transition-[width] duration-300",
        collapsed ? "w-[76px]" : "w-[264px]",
      )}
    >
      <div className="flex h-20 items-center gap-3 border-b px-3">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left transition hover:bg-secondary",
            collapsed ? "justify-center p-2" : "px-2 py-2",
          )}
          title="Study Chinese"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary font-serif text-2xl font-extrabold text-primary-foreground shadow-sm">
            学
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold">Study Chinese</span>
              <span className="block truncate text-xs font-semibold text-muted-foreground">HSK Learning</span>
            </span>
          )}
        </button>

        {!collapsed && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleCollapsed}
            className="size-9 shrink-0 rounded-lg"
            aria-label={t("nav.collapse")}
            title={t("nav.collapse")}
          >
            <ChevronLeft size={18} />
          </Button>
        )}
      </div>

      {collapsed && (
        <div className="border-b p-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleCollapsed}
            className="size-10 rounded-lg"
            aria-label={t("nav.expand")}
            title={t("nav.expand")}
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      )}

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Button
              key={tab.id}
              type="button"
              variant="ghost"
              onClick={() => navigate(`/${tab.id}`)}
              title={collapsed ? tab.label : undefined}
              className={cn(
                "relative h-12 justify-start rounded-lg px-3 text-sm font-bold transition",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="size-5 shrink-0" />
              {!collapsed && <span className="ml-3 truncate">{tab.label}</span>}
              {!!tab.badge && tab.badge > 0 && (
                <Badge
                  className={cn(
                    "absolute flex size-5 items-center justify-center rounded-full p-0 text-[0.68rem] font-bold",
                    collapsed ? "right-1 top-1" : "right-3",
                  )}
                >
                  {tab.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </nav>

      <div className="border-t p-3">
        {collapsed ? (
          <Button
            type="button"
            variant={activeTab === "guide" ? "default" : "ghost"}
            size="icon"
            onClick={() => navigate("/guide")}
            className="size-10 rounded-lg"
            aria-label={t("nav.guide")}
            title={t("nav.guideHint")}
          >
            <Compass size={18} />
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/guide")}
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-left transition",
              activeTab === "guide"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary hover:bg-secondary/80 hover:text-primary",
            )}
          >
            <span className="flex min-w-0 items-center gap-3">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg",
                  activeTab === "guide" ? "bg-primary-foreground/15" : "bg-background",
                )}
              >
                <Compass size={18} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-extrabold">{t("nav.guide")}</span>
                <span
                  className={cn(
                    "block truncate text-xs font-semibold",
                    activeTab === "guide" ? "text-primary-foreground/80" : "text-muted-foreground",
                  )}
                >
                  {t("nav.guideHint")}
                </span>
              </span>
            </span>
            <ChevronRight
              className={cn("size-5 shrink-0", activeTab === "guide" ? "text-primary-foreground" : "text-foreground")}
            />
          </button>
        )}
      </div>
    </aside>
  );
}
