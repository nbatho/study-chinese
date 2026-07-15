import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Activity, ArrowLeft, Dumbbell, Ear, Keyboard, Mic, PencilLine, Target, Volume2 } from "lucide-react";
import { useI18n } from "../../i18n";
import { useAppSelector } from "../../store/hooks";
import ConfirmDialog from "../../components/ConfirmDialog";
import LoginPromptCard from "../../components/LoginPromptCard";
import { cn } from "../../utils/cn";
import {
  HanziDrawingTool,
  ListeningTool,
  ListPracticeTool,
  MinimalPairsTool,
  PinyinTypingTool,
  ShadowingTool,
  ToneDrillTool,
  WeakPracticeTool,
} from "./components/PracticeTools";
import { isPracticeTool } from "./components/practiceToolTypes";
import type { Tool } from "./components/practiceToolTypes";

export default function Practice() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const [searchParams] = useSearchParams();
  const initialTool = searchParams.get("tool");
  const from = searchParams.get("from");
  const [activeTool, setActiveTool] = useState<Tool>(isPracticeTool(initialTool) ? initialTool : "menu");
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);

  const leaveTool = () => {
    if (from) {
      navigate(from === "learn" ? "/learn" : from === "home" ? "/home" : `/${from}`);
    } else {
      setActiveTool("menu");
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={Dumbbell}
        title={t("loginPrompt.practiceTitle")}
        description={t("loginPrompt.practiceBody")}
      />
    );
  }

  return (
    <div className="app-page">
      {activeTool !== "menu" && (
        <button onClick={() => setIsExitConfirmOpen(true)} className="mb-5 inline-flex items-center gap-1.5 rounded-xl border bg-card/90 px-3 py-2 font-bold text-primary shadow-sm transition hover:bg-secondary active:translate-y-px">
          <ArrowLeft size={16} /> {from ? t("notFound.goBack") : t("practice.back")}
        </button>
      )}

      <ConfirmDialog
        open={isExitConfirmOpen}
        title={t("practice.confirmExitTitle")}
        description={t("practice.confirmExitBody")}
        confirmLabel={t("common.exit")}
        cancelLabel={t("common.stay")}
        onConfirm={() => {
          setIsExitConfirmOpen(false);
          leaveTool();
        }}
        onCancel={() => setIsExitConfirmOpen(false)}
      />

      {activeTool === "menu" && (
        <div className="grid gap-4">
          <div className="app-page-header mb-2">
            <h2 className="text-2xl font-extrabold">{t("practice.title")}</h2>
            <p className="text-[0.9rem] text-muted-foreground">
              {t("practice.subtitle")}
            </p>
          </div>
          {[
            { id: "tones", title: t("practice.tones"), desc: t("practice.tonesDesc"), icon: Activity, cls: "bg-tone-1" },
            { id: "weak", title: "Weak Practice", desc: "Review words and skills you missed before.", icon: Target, cls: "bg-primary" },
            { id: "list", title: "Practice List", desc: "Practice vocabulary from your saved word lists.", icon: Target, cls: "bg-tone-2" },
            { id: "pairs", title: t("practice.pairs"), desc: t("practice.pairsDesc"), icon: Ear, cls: "bg-tone-4" },
            { id: "typing", title: t("practice.typing"), desc: t("practice.typingDesc"), icon: Keyboard, cls: "bg-jade" },
            { id: "listening", title: t("practice.listening"), desc: t("practice.listeningDesc"), icon: Volume2, cls: "bg-primary" },
            { id: "shadow", title: t("practice.shadow"), desc: t("practice.shadowDesc"), icon: Mic, cls: "bg-tone-3" },
            { id: "hanzi", title: t("practice.hanzi"), desc: t("practice.hanziDesc"), icon: PencilLine, cls: "bg-gold" },
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <button key={tool.id} onClick={() => setActiveTool(tool.id as Tool)} className="app-card-button flex cursor-pointer items-center gap-4 p-4 sm:gap-5 sm:p-5">
                <span className={cn("flex size-13 shrink-0 items-center justify-center rounded-xl text-white", tool.cls)}>
                  <Icon size={26} />
                </span>
                <span className="min-w-0">
                  <strong className="block text-[1.1rem]">{tool.title}</strong>
                  <span className="mt-0.5 block text-[0.85rem] text-muted-foreground">{tool.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {activeTool === "weak" && <WeakPracticeTool />}
      {activeTool === "list" && <ListPracticeTool />}
      {activeTool === "tones" && <ToneDrillTool />}
      {activeTool === "pairs" && <MinimalPairsTool />}
      {activeTool === "typing" && <PinyinTypingTool />}
      {activeTool === "listening" && <ListeningTool />}
      {activeTool === "shadow" && <ShadowingTool />}
      {activeTool === "hanzi" && <HanziDrawingTool />}
    </div>
  );
}

