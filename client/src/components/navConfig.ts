import type { LucideIcon } from "lucide-react";
import {
  BookMarked,
  BookOpen,
  Dumbbell,
  FileText,
  GraduationCap,
  Home,
  Languages,
  RefreshCw,
  Shapes,
  Shield,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";
import { useDueSrsCardsQuery } from "../api/srs/queries";
import { useI18n } from "../i18n";
import { useAppSelector } from "../store/hooks";

export interface NavTab {
  id: string;
  label: string;
  /** Shorter label for the compact mobile bottom bar; falls back to `label`. */
  shortLabel?: string;
  icon: LucideIcon;
  badge?: number;
  requiresAuth?: boolean;
}

/** IDs of the tabs surfaced directly on the mobile bottom bar; the rest live under "More". */
export const PRIMARY_TAB_IDS = ["home", "learn", "practice", "review", "dictionary"] as const;

export const resolveActiveTab = (path: string): string => {
  if (path.startsWith("/guide")) return "guide";
  if (path.startsWith("/foundation")) return "foundation";
  if (path.startsWith("/learn")) return "learn";
  if (path.startsWith("/grammar")) return "grammar";
  if (path.startsWith("/radicals")) return "radicals";
  if (path.startsWith("/practice")) return "practice";
  if (path.startsWith("/review")) return "review";
  if (path.startsWith("/dictionary")) return "dictionary";
  if (path.startsWith("/translate") || path.startsWith("/camera-translator")) return "translate";
  if (path.startsWith("/ai-tutor")) return "ai-tutor";
  if (path.startsWith("/shop")) return "shop";
  if (path.startsWith("/community")) return "community";
  if (path.startsWith("/admin")) return "admin";
  return "home";
};

export const useNavTabs = (): NavTab[] => {
  const { t } = useI18n();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const authUser = useAppSelector((state) => state.auth.user);
  const dueCardsQuery = useDueSrsCardsQuery(99, isAuthenticated);

  return [
    { id: "home", label: t("nav.home"), icon: Home },
    { id: "foundation", label: t("nav.foundation"), icon: GraduationCap },
    { id: "learn", label: t("learn.curriculum"), shortLabel: t("nav.learn"), icon: BookOpen },
    { id: "grammar", label: t("nav.grammar"), icon: FileText, requiresAuth: true },
    { id: "radicals", label: t("nav.radicals"), icon: Shapes },
    { id: "practice", label: t("nav.practice"), icon: Dumbbell },
    { id: "dictionary", label: t("nav.dictionary"), icon: BookMarked },
    { id: "translate", label: t("nav.translate"), icon: Languages },
    {
      id: "review",
      label: t("nav.review"),
      icon: RefreshCw,
      badge: isAuthenticated ? (dueCardsQuery.data?.cards.length ?? 0) : 0,
      requiresAuth: true,
    },
    { id: "ai-tutor", label: t("nav.aiTutor"), icon: Sparkles, requiresAuth: true },
    { id: "shop", label: t("nav.shop"), icon: ShoppingBag, requiresAuth: true },
    { id: "community", label: t("nav.community"), icon: Users, requiresAuth: true },
    ...(authUser?.role === "admin"
      ? [{ id: "admin", label: t("nav.admin"), icon: Shield, requiresAuth: true }]
      : []),
  ];
};
