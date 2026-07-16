import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Globe2,
  LogIn,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../api/auth/queries";
import { useLessonsQuery } from "../api/lessons/queries";
import { useUserProfileQuery } from "../api/users/queries";
import { useSelectedHskLevel } from "../hooks/useSelectedHskLevel";
import { useI18n } from "../i18n";
import { useAppSelector } from "../store/hooks";
import { cn } from "../utils/cn";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CircularProgress } from "./ui/circular-progress";
import { DropdownSelect } from "./ui/dropdown-select";

function Avatar({
  avatar,
  name,
  className,
}: {
  avatar?: string | null;
  name: string;
  className?: string;
}) {
  const isImage = Boolean(avatar && /^(https?:|data:image|blob:)/.test(avatar));

  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary text-lg font-extrabold shadow-sm",
        className,
      )}
    >
      {isImage ? (
        <img src={avatar ?? ""} alt={name} className="size-full object-cover" />
      ) : (
        <span aria-hidden="true">{avatar || name.slice(0, 1).toUpperCase() || "学"}</span>
      )}
    </span>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useI18n();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const authUser = useAppSelector((state) => state.auth.user);
  const profileQuery = useUserProfileQuery(isAuthenticated);
  const lessonsQuery = useLessonsQuery(isAuthenticated);
  const logoutMutation = useLogoutMutation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const profile = profileQuery.data?.profile;
  const lessons = useMemo(() => lessonsQuery.data?.lessons ?? [], [lessonsQuery.data?.lessons]);
  // "Curriculum progress" counts every lesson on the roadmap, exactly like the
  // Profile page's headline card — the two numbers must agree. Per-level
  // progress lives on the Learn page, labeled with its HSK level.
  const { selectedHsk } = useSelectedHskLevel(
    profile?.cefrLevel ?? "A1",
    profile?.placementTestCompletedAt ?? null,
  );
  const { completedLessons, totalLessons, progressPercent } = useMemo(() => {
    const completed = lessons.filter((lesson) => lesson.completedAt).length;
    return {
      completedLessons: completed,
      totalLessons: lessons.length,
      progressPercent: lessons.length ? Math.round((completed / lessons.length) * 100) : 0,
    };
  }, [lessons]);
  const displayName = profile?.name || authUser?.name || t("common.learner");
  const displayEmail = authUser?.email ?? "";
  const avatar = profile?.avatar || authUser?.avatar;

  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setIsUserMenuOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 shadow-[0_8px_24px_rgba(0,0,0,0.03)] backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between gap-3 px-3 sm:px-5 lg:px-7">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {isAuthenticated && (
            <div className="hidden min-w-0 max-w-md flex-1 items-center gap-3 md:flex">
              <CircularProgress progress={progressPercent} size={46} strokeWidth={4.5} />
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2 text-xs font-bold text-muted-foreground">
                  <BookOpen size={14} className="shrink-0 text-primary" />
                  <span className="truncate">{t("navbar.curriculumProgress")}</span>
                </div>
                <div className="mt-1 flex min-w-0 items-center gap-2">
                  <Badge className="rounded-md px-2.5 py-1 text-xs">
                    HSK {selectedHsk}
                  </Badge>
                  <span className="truncate text-xs font-semibold text-muted-foreground">
                    {t("navbar.lessonsComplete", { completed: completedLessons, total: totalLessons })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <DropdownSelect
            value={language}
            label={t("navbar.languageToggle")}
            icon={<Globe2 size={16} />}
            onChange={setLanguage}
            options={[
              { code: "EN", label: t("profile.languageEnglish"), value: "en" },
              { code: "VI", label: t("profile.languageVietnamese"), value: "vi" },
              { code: "简", label: t("profile.languageChineseSimplified"), value: "zh-Hans" },
              { code: "繁", label: t("profile.languageChineseTraditional"), value: "zh-Hant" },
            ]}
            buttonClassName="min-w-36"
          />

          {isAuthenticated ? (
            <div ref={menuRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((value) => !value)}
                className="inline-flex h-11 items-center gap-2 rounded-lg px-2 pr-3 transition hover:bg-secondary"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
                aria-label={t("navbar.openUserMenu")}
                title={t("navbar.openUserMenu")}
              >
                <Avatar avatar={avatar} name={displayName} />
                <span className="hidden min-w-0 text-left sm:block">
                  <span className="block max-w-32 truncate text-sm font-extrabold">{displayName}</span>
                </span>
                <ChevronDown
                  size={16}
                  className={cn("text-muted-foreground transition", isUserMenuOpen && "rotate-180")}
                />
              </button>

              {isUserMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-72 overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-xl"
                >
                  <div className="flex items-center gap-3 border-b p-3">
                    <Avatar avatar={avatar} name={displayName} className="size-12 text-xl" />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-extrabold">{displayName}</div>
                      <div className="truncate text-xs font-semibold text-muted-foreground">{displayEmail}</div>
                    </div>
                  </div>
                  <div className="grid gap-1 p-2">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-bold transition hover:bg-secondary"
                    >
                      <User size={16} className="text-primary" />
                      {t("nav.profile")}
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate("/settings");
                      }}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-bold transition hover:bg-secondary"
                    >
                      <Settings size={16} className="text-primary" />
                      {t("navbar.settings")}
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-bold text-tone-4 transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <LogOut size={16} />
                      {logoutMutation.isPending ? t("profile.signingOut") : t("profile.logout")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button type="button" onClick={() => navigate("/auth")} className="h-11 shrink-0 rounded-lg px-4">
              <LogIn size={17} />
              {t("auth.login")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
