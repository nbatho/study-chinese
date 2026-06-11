import { useEffect, useRef, useState } from "react";
import {
  useChatScenariosQuery,
  useSendChatMessageMutation,
  useStartChatSessionMutation,
} from "../api/aiTutor/queries";
import type { ChatMessage, ChatScenario } from "../api/aiTutor";
import { ArrowLeft, AlertTriangle, Send, Sparkles, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

interface AITutorProps {
  onClose?: () => void;
}

export default function AITutor({ onClose }: AITutorProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
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

  const playTTS = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "var(--bg-app)",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column"
    }}>
      <header className="glass-panel" style={{
        padding: "16px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid var(--border-color)",
        gap: "16px"
      }}>
        <button onClick={handleClose} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-muted)" }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkles size={18} className="tone-t3" />
            {selectedScenario ? `AI Tutor: ${selectedScenario.title}` : t("ai.title")}
          </h3>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {selectedScenario ? selectedScenario.description : t("ai.subtitle")}
          </p>
        </div>
      </header>

      {!selectedScenario ? (
        <div className="anim-slide" style={{ flex: 1, padding: "24px", overflowY: "auto", maxWidth: "600px", margin: "0 auto", width: "100%" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px", textAlign: "left" }}>
            {t("ai.selectScenario")}
          </h4>
          <div style={{ display: "grid", gap: "12px" }}>
            {scenariosQuery.isLoading && (
              <div className="card" style={{ padding: "16px", color: "var(--text-muted)" }}>
                {t("ai.loadingScenarios")}
              </div>
            )}
            {scenariosQuery.isError && (
              <div className="card" style={{ padding: "16px", color: "var(--primary-red)" }}>
                {t("ai.loadError")}
              </div>
            )}
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                onClick={() => selectScenario(scenario)}
                className="card"
                disabled={startSessionMutation.isPending}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px",
                  cursor: startSessionMutation.isPending ? "wait" : "pointer",
                  textAlign: "left",
                  border: "1px solid var(--border-color)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-main)"
                }}
              >
                <span style={{ fontSize: "2.2rem" }}>{scenario.emoji}</span>
                <span>
                  <strong style={{ display: "block", fontSize: "1.05rem" }}>{scenario.title}</strong>
                  <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {scenario.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "calc(100% - 65px)" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  alignSelf: message.role === "tutor" ? "flex-start" : "flex-end",
                  maxWidth: "80%",
                  textAlign: "left"
                }}
              >
                <div style={{
                  padding: "14px 18px",
                  borderRadius: "16px",
                  borderTopLeftRadius: message.role === "tutor" ? "4px" : "16px",
                  borderTopRightRadius: message.role === "tutor" ? "16px" : "4px",
                  backgroundColor: message.role === "tutor" ? "var(--bg-card)" : "var(--primary-red)",
                  color: message.role === "tutor" ? "var(--text-main)" : "white",
                  border: message.role === "tutor" ? "1px solid var(--border-color)" : "none",
                }}>
                  {message.role === "tutor" ? (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)" }}>{t("ai.tutorName")}</span>
                        <button
                          type="button"
                          onClick={() => playTTS(message.simplified)}
                          style={{ border: "none", background: "none", color: "var(--primary-red)", cursor: "pointer" }}
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                      <h3 className="hanzi-text" style={{ fontSize: "1.35rem", fontWeight: 700 }}>
                        {message.simplified}
                      </h3>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        {message.pinyin ?? ""}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-main)", borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: "4px", marginTop: "6px" }}>
                        {message.english ?? ""}
                      </div>
                    </div>
                  ) : (
                    <h3 className="hanzi-text" style={{ fontSize: "1.35rem", fontWeight: 700 }}>
                      {message.simplified}
                    </h3>
                  )}
                </div>

                {message.correction && (
                  <div className="anim-pop" style={{
                    marginTop: "8px",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(245, 158, 11, 0.08)",
                    border: "1px dashed var(--tone-3)",
                    color: "var(--tone-3)",
                    fontSize: "0.8rem",
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-start"
                  }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <div>
                      <strong>{t("ai.didYouMean")}</strong> <em>"{message.correction.improved}"</em>
                      <p style={{ marginTop: "2px", color: "var(--text-muted)" }}>{message.correction.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div style={{
                alignSelf: "flex-start",
                padding: "12px 18px",
                borderRadius: "16px",
                backgroundColor: "var(--bg-card-hover)",
                border: "1px solid var(--border-color)",
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                fontWeight: 600
              }}>
                {t("ai.thinking")}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="glass-panel"
            style={{
              padding: "14px 18px",
              display: "flex",
              gap: "12px",
              borderTop: "1px solid var(--border-color)"
            }}
          >
            <input
              type="text"
              placeholder={t("ai.placeholder")}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isThinking}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-app)",
                color: "var(--text-main)",
                fontSize: "0.95rem",
                outline: "none"
              }}
            />
            <button
              type="submit"
              disabled={!userInput.trim() || isThinking}
              className="btn btn-primary"
              style={{
                width: "48px",
                height: "48px",
                padding: 0,
                borderRadius: "10px",
                flexShrink: 0
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
