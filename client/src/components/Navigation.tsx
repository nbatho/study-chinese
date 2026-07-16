import { ChevronLeft, ChevronRight, Compass, Lock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import { useAppSelector } from "../store/hooks";
import { cn } from "../utils/cn";
import { resolveActiveTab, useNavTabs } from "./navConfig";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface NavigationProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export default function Navigation({ collapsed, onToggleCollapsed }: NavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const { t } = useI18n();

  const path = location.pathname;
  // Resolve exactly one active tab; default to "home" for unmatched routes.
  const activeTab = path === "/home" || path.startsWith("/home/") ? "home" : resolveActiveTab(path);
  const tabs = useNavTabs();

  return (
    <aside
      className={cn(
        "sticky top-0 z-40 hidden h-[100dvh] shrink-0 flex-col border-r bg-card/95 shadow-[8px_0_24px_rgba(0,0,0,0.03)] backdrop-blur-xl transition-[width] duration-300 md:flex",
        collapsed ? "w-19" : "w-66",
      )}
    >
      <div className="grid h-20 shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b px-3">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className={cn(
            "flex h-14 min-w-0 items-center gap-3 rounded-xl text-left transition hover:bg-secondary active:translate-y-px",
            collapsed ? "justify-center px-0" : "px-2.5",
          )}
          title="Study Chinese"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary font-serif text-3xl font-extrabold leading-none text-primary-foreground shadow-sm">
            学
          </span>
          {!collapsed && (
            <span className="min-w-0 pt-0.5">
              <span className="block truncate text-[0.95rem] font-extrabold leading-5">Study Chinese</span>
              <span className="block truncate text-xs font-semibold leading-4 text-muted-foreground">{t("nav.brandTagline")}</span>
            </span>
          )}
        </button>

        {!collapsed && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleCollapsed}
            className="size-10 shrink-0 rounded-xl"
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
            className="size-10 rounded-xl"
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
              {!isAuthenticated && tab.requiresAuth && (
                <Lock
                  size={12}
                  className={cn(
                    "absolute",
                    collapsed ? "right-1.5 top-1.5" : "right-3",
                    isActive ? "text-primary-foreground/60" : "text-muted-foreground/50",
                  )}
                />
              )}
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
