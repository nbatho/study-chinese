import { useEffect, useState } from "react";
import { Lock, MoreHorizontal, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import { useAppSelector } from "../store/hooks";
import { cn } from "../utils/cn";
import { PRIMARY_TAB_IDS, resolveActiveTab, useNavTabs, type NavTab } from "./navConfig";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const tabs = useNavTabs();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const activeTab = resolveActiveTab(location.pathname);
  const primaryTabs = PRIMARY_TAB_IDS.map((id) => tabs.find((tab) => tab.id === id)).filter(
    (tab): tab is NavTab => Boolean(tab),
  );
  const moreTabs = tabs.filter((tab) => !PRIMARY_TAB_IDS.includes(tab.id as (typeof PRIMARY_TAB_IDS)[number]));
  const isMoreActive = moreTabs.some((tab) => tab.id === activeTab);

  // Close the sheet whenever navigation changes.
  useEffect(() => {
    setIsMoreOpen(false);
  }, [location.pathname]);

  const go = (id: string) => {
    setIsMoreOpen(false);
    navigate(`/${id}`);
  };

  const renderBadge = (tab: NavTab, className: string) =>
    tab.badge && tab.badge > 0 ? (
      <span
        className={cn(
          "flex min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] font-bold leading-4 text-primary-foreground",
          className,
        )}
      >
        {tab.badge > 99 ? "99+" : tab.badge}
      </span>
    ) : null;

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t bg-card/95 backdrop-blur-xl md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label={t("nav.sidebar")}
      >
        <div className="mx-auto grid max-w-lg grid-cols-6">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const locked = !isAuthenticated && tab.requiresAuth;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => go(tab.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[0.62rem] font-bold transition",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span className="relative">
                  <Icon className="size-5.5" />
                  {renderBadge(tab, "absolute -right-2 -top-1.5")}
                  {locked && (
                    <Lock size={9} className="absolute -right-1.5 -top-1 text-muted-foreground/60" />
                  )}
                </span>
                <span className="max-w-full truncate">{tab.shortLabel ?? tab.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setIsMoreOpen((open) => !open)}
            aria-expanded={isMoreOpen}
            aria-haspopup="menu"
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[0.62rem] font-bold transition",
              isMoreActive || isMoreOpen ? "text-primary" : "text-muted-foreground",
            )}
          >
            <MoreHorizontal className="size-5.5" />
            <span>{t("nav.more")}</span>
          </button>
        </div>
      </nav>

      {isMoreOpen && (
        <div className="fixed inset-0 z-1100 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label={t("nav.collapse")}
            onClick={() => setIsMoreOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t bg-card p-4 shadow-2xl"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-extrabold">{t("nav.more")}</h2>
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary"
                aria-label={t("nav.collapse")}
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {moreTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const locked = !isAuthenticated && tab.requiresAuth;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => go(tab.id)}
                    className={cn(
                      "relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-[0.68rem] font-bold transition",
                      isActive
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-transparent bg-secondary text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="relative">
                      <Icon className="size-5.5" />
                      {renderBadge(tab, "absolute -right-2 -top-1.5")}
                      {locked && (
                        <Lock size={10} className="absolute -right-1.5 -top-1 text-muted-foreground/60" />
                      )}
                    </span>
                    <span className="max-w-full truncate text-center">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
