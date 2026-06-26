import { useEffect, useRef, useState } from "react";
import {
  useChatScenariosQuery,
  useSendChatMessageMutation,
  useStartChatSessionMutation,
} from "../api/aiTutor/queries";
import type { ChatMessage, ChatScenario } from "../api/aiTutor";
import { ArrowLeft, AlertTriangle, Send, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import { useAppSelector } from "../store/hooks";
import { cn } from "../utils/cn";
import LoginPromptCard from "../components/LoginPromptCard";
import TtsButton from "../components/TtsButton";

const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";

interface AITutorProps {
  onClose?: () => void;
}

export default function AITutor({ onClose }: AITutorProps) {
  const { t } = useI18n();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={Sparkles}
        title={t("loginPrompt.aiTutorTitle")}
        description={t("loginPrompt.aiTutorBody")}
      />
    );
  }

  return <AITutorContent onClose={onClose} />;
}

function AITutorContent({ onClose }: AITutorProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const isOverlay = Boolean(onClose);
  const handleClose = onClose || (() => navigate("/home"));
  const scenariosQuery = useChatScenariosQuery();
  const startSessionMutation = useStartChatSessionMutation();
  const [selectedScenario, setSelectedScenario] = useState<ChatScenario | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const sendMessageMutation = useSendChatMessageMutation(sessionId ?? "");
  const isThinking = startSessionMutation.isPending || sendMessageMutation.isPending;
  const scenarios = scenariosQuery.data?.scenarios ?? [];
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const selectScenario = async (scenario: ChatScenario) => {
    const response = await startSessionMutation.mutateAsync({ scenarioId: scenario.id });
    setSelectedScenario(scenario);
    setSessionId(response.session.id);
    setMessages(response.session.messages);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInput.trim() || isThinking || !selectedScenario || !sessionId) {
      return;
    }

    const input = userInput.trim();
    setUserInput("");

    const pendingMessage: ChatMessage = {
      id: `pending_${Date.now()}`,
      role: "user",
      simplified: input,
      pinyin: "",
      english: "",
      correction: null,
    };

    setMessages((prev) => [...prev, pendingMessage]);
    const response = await sendMessageMutation.mutateAsync({ text: input });
    setMessages((prev) => [
      ...prev.filter((message) => message.id !== pendingMessage.id),
      response.userMessage,
      response.tutorMessage,
    ]);
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden bg-background",
        isOverlay
          ? "fixed inset-0 z-[1000]"
          : "anim-slide h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)]",
      )}
    >
      <header
        className={cn(
          "flex items-center gap-4",
          isOverlay ? "border-b bg-card/90 p-4 shadow-sm backdrop-blur-xl" : "mb-5",
        )}
      >
        <button
          type="button"
          onClick={handleClose}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="min-w-0">
          <h2 className="flex items-center gap-1.5 truncate text-2xl font-extrabold">
            <Sparkles size={18} className="shrink-0 text-tone-3" />
            {selectedScenario ? `AI Tutor: ${selectedScenario.title}` : t("ai.title")}
          </h2>
          <p className="truncate text-xs text-muted-foreground">
            {selectedScenario ? selectedScenario.description : t("ai.subtitle")}
          </p>
        </div>
      </header>

      {!selectedScenario ? (
        <div className="anim-slide mx-auto w-full max-w-[600px] flex-1 overflow-y-auto p-4 sm:p-6">
          <h4 className="mb-4 text-left text-base font-bold uppercase text-muted-foreground">
            {t("ai.selectScenario")}
          </h4>
          <div className="grid gap-3">
            {scenariosQuery.isLoading && (
              <div className="rounded-lg border bg-card p-4 text-muted-foreground shadow-sm">
                {t("ai.loadingScenarios")}
              </div>
            )}
            {scenariosQuery.isError && (
              <div className="rounded-lg border bg-card p-4 text-primary shadow-sm">
                {t("ai.loadError")}
              </div>
            )}
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                onClick={() => selectScenario(scenario)}
                className="flex items-center gap-4 rounded-lg border bg-card p-4 text-left text-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-wait disabled:opacity-70"
                disabled={startSessionMutation.isPending}
              >
                <span className="text-[2.2rem]">{scenario.emoji}</span>
                <span className="min-w-0">
                  <strong className="block truncate text-[1.05rem]">{scenario.title}</strong>
                  <span className="mt-0.5 block text-[0.8rem] text-muted-foreground">
                    {scenario.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("max-w-[88%] text-left sm:max-w-[80%]", message.role === "tutor" ? "self-start" : "self-end")}
              >
                <div className={cn("rounded-2xl px-[18px] py-3.5", message.role === "tutor" ? "rounded-tl border bg-card text-foreground" : "rounded-tr bg-primary text-white")}>
                  {message.role === "tutor" ? (
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[0.7rem] font-bold text-muted-foreground">{t("ai.tutorName")}</span>
                        <TtsButton
                          text={message.simplified}
                          aria-label={t("common.listen")}
                          className="border-0 bg-transparent p-1 text-primary shadow-none hover:bg-transparent"
                        />
                      </div>
                      <h3 className="font-serif text-[1.35rem] font-bold">
                        {message.simplified}
                      </h3>
                      <div className="mt-0.5 text-[0.85rem] text-muted-foreground">
                        {message.pinyin ?? ""}
                      </div>
                      <div className="mt-1.5 border-t border-black/5 pt-1 text-[0.85rem] text-foreground">
                        {message.english ?? ""}
                      </div>
                    </div>
                  ) : (
                    <h3 className="font-serif text-[1.35rem] font-bold">
                      {message.simplified}
                    </h3>
                  )}
                </div>

                {message.correction && (
                  <div className="anim-pop mt-2 flex items-start gap-2 rounded-xl border border-dashed border-tone-3 bg-tone-3/10 px-3.5 py-2.5 text-[0.8rem] text-tone-3">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                    <div>
                      <strong>{t("ai.didYouMean")}</strong> <em>"{message.correction.improved}"</em>
                      <p className="mt-0.5 text-muted-foreground">{message.correction.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="self-start rounded-2xl border bg-secondary px-[18px] py-3 text-[0.85rem] font-semibold text-muted-foreground">
                {t("ai.thinking")}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSend}
            className={cn(
              "flex gap-3 py-3",
              isOverlay ? "border-t bg-card/90 px-3.5 backdrop-blur-xl sm:px-[18px]" : "pt-3",
            )}
          >
            <input
              type="text"
              placeholder={t("ai.placeholder")}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isThinking}
              className="min-w-0 flex-1 rounded-[10px] border bg-background px-4 py-3 text-[0.95rem] text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!userInput.trim() || isThinking}
              className={cn(primaryButtonClass, "size-12 shrink-0 rounded-[10px] p-0")}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
