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
import { useI18n } from "../i18n";
import { useAppSelector } from "../store/hooks";
import { cn } from "../utils/cn";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CircularProgress } from "./ui/circular-progress";

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

function LanguageDropdown({
  language,
  label,
  englishLabel,
  vietnameseLabel,
  onSelect,
}: {
  language: "en" | "vi";
  label: string;
  englishLabel: string;
  vietnameseLabel: string;
  onSelect: (language: "en" | "vi") => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const languageOptions: Array<{ code: string; label: string; value: "en" | "vi" }> = [
    { code: "EN", label: englishLabel, value: "en" },
    { code: "VI", label: vietnameseLabel, value: "vi" },
  ];
  const currentLanguage = languageOptions.find((option) => option.value === language) ?? languageOptions[0];

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border bg-background/70 px-2.5 text-xs font-extrabold text-muted-foreground transition hover:border-primary/30 hover:bg-secondary hover:text-foreground active:translate-y-px"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`${label}: ${currentLanguage.label}`}
        title={`${label}: ${currentLanguage.label}`}
      >
        <Globe2 size={16} className="text-primary" />
        <span className="min-w-18 text-left leading-none">
          <span className="mt-1 block text-xs font-extrabold text-foreground">{currentLanguage.label}</span>
        </span>
        <ChevronDown size={15} className={cn("text-muted-foreground transition", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 rounded-2xl border bg-popover p-1.5 text-popover-foreground shadow-xl"
        >
          {languageOptions.map((option) => {
            const isSelected = option.value === language;

            return (
              <div key={option.value} className={cn("rounded-xl p-1", isSelected && "bg-primary")}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={isSelected}
                  onClick={() => {
                    onSelect(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-extrabold transition",
                    isSelected
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <span className={cn("w-7 text-xs", isSelected ? "text-primary-foreground/80" : "text-primary")}>
                    {option.code}
                  </span>
                  <span>{option.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
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
  const completedLessons = lessons.filter((lesson) => lesson.completedAt).length;
  const totalLessons = lessons.length;
  const progressPercent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
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
                    {profile?.cefrLevel ?? "A1"}
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
          <LanguageDropdown
            language={language}
            label={t("navbar.languageToggle")}
            englishLabel={t("profile.languageEnglish")}
            vietnameseLabel={t("profile.languageVietnamese")}
            onSelect={setLanguage}
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
