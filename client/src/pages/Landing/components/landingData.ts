import {
  BookMarked,
  BookOpen,
  Camera,
  Mic2,
  RefreshCw,
  Sparkles,
  Users,
  WandSparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
  LandingFeatureId,
  LandingFlowId,
  LandingFooterGroupId,
  LandingLinkId,
} from "../../../i18n/landing";
import { LANGUAGES, LANGUAGE_META } from "../../../i18n/languages";

// Layout and destinations only; the matching copy lives in `i18n/landing`.
export const featureCards: Array<{ id: LandingFeatureId; icon: LucideIcon; href: string; className: string }> = [
  { id: "path", icon: BookOpen, href: "/learn", className: "lg:col-span-2" },
  { id: "practice", icon: Mic2, href: "/practice", className: "lg:row-span-2" },
  { id: "dictionary", icon: BookMarked, href: "/dictionary", className: "" },
  { id: "translate", icon: Camera, href: "/translate", className: "" },
  { id: "tutor", icon: Sparkles, href: "/ai-tutor", className: "lg:col-span-2" },
  { id: "community", icon: Users, href: "/community", className: "" },
];

export const studyFlow: Array<{ id: LandingFlowId; icon: LucideIcon }> = [
  { id: "goal", icon: WandSparkles },
  { id: "lessons", icon: BookOpen },
  { id: "review", icon: RefreshCw },
];

export const previewRows: Array<{ hanzi: string; pinyin: string }> = [
  { hanzi: "你好", pinyin: "nǐ hǎo" },
  { hanzi: "我想点菜", pinyin: "wǒ xiǎng diǎn cài" },
  { hanzi: "今天很忙", pinyin: "jīn tiān hěn máng" },
];

export const productStats: Array<{ id: "statSession" | "statNewWords" | "statReviews"; value: string }> = [
  { id: "statSession", value: "18m" },
  { id: "statNewWords", value: "12" },
  { id: "statReviews", value: "24" },
];

export const footerGroups: Array<{ id: LandingFooterGroupId; links: Array<{ id: LandingLinkId; href: string }> }> = [
  {
    id: "learn",
    links: [
      { id: "learn", href: "/learn" },
      { id: "foundation", href: "/foundation" },
      { id: "grammar", href: "/grammar" },
      { id: "radicals", href: "/radicals" },
    ],
  },
  {
    id: "practice",
    links: [
      { id: "practice", href: "/practice" },
      { id: "review", href: "/review" },
      { id: "tutor", href: "/ai-tutor" },
    ],
  },
  {
    id: "tools",
    links: [
      { id: "dictionary", href: "/dictionary" },
      { id: "translate", href: "/translate" },
      { id: "community", href: "/community" },
      { id: "guide", href: "/guide" },
    ],
  },
];

export const languageOptions = LANGUAGES.map((value) => ({
  value,
  code: LANGUAGE_META[value].code,
  label: LANGUAGE_META[value].nativeLabel,
}));
