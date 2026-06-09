import { useState, useEffect, useRef } from "react";
import { useStore } from "../store/store";
import { CHAT_SCENARIOS } from "../resources/seedData";
import type { ChatScenario } from "../resources/seedData";
import { ArrowLeft, Send, Sparkles, Volume2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AITutorProps {
  onClose?: () => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "tutor";
  simplified: string;
  pinyin: string;
  english: string;
  correction?: {
    original: string;
    improved: string;
    explanation: string;
  };
}

export default function AITutor({ onClose }: AITutorProps) {
  const navigate = useNavigate();
  const handleClose = onClose || (() => navigate("/home"));
  const store = useStore();
  const [selectedScenario, setSelectedScenario] = useState<ChatScenario | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isThinking]);

  const selectScenario = (scenario: ChatScenario) => {
    setSelectedScenario(scenario);
    setMessages([
      {
        id: `msg_init_${Date.now()}`,
        role: "tutor",
        simplified: scenario.initialMessage.simplified,
        pinyin: scenario.initialMessage.pinyin,
        english: scenario.initialMessage.english
      }
    ]);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isThinking || !selectedScenario) return;

    const input = userInput.trim();
    setUserInput("");

    // Add user message
    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: "user",
      simplified: input,
      pinyin: "",
      english: ""
    };

    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate response matching swift service logic
    const lower = input.toLowerCase();
    let reply = "有意思！请再说一下。";
    let pinyin = "Yǒu yìsi! Qǐng zài shuō yīxià.";
    let english = "Interesting! Please say more.";
    let correction: ChatMessage["correction"] = undefined;

    if (lower.includes("你好") || lower.includes("ni hao") || lower.includes("hello")) {
      reply = "你好！很高兴认识你。你今天怎么样？";
      pinyin = "Nǐ hǎo! Hěn gāoxìng rènshí nǐ. Nǐ jīntiān zěnmeyàng?";
      english = "Hello! Nice to meet you. How are you today?";
    } else if (lower.includes("谢谢") || lower.includes("xie xie") || lower.includes("thank")) {
      reply = "不客气！还有什么想聊的吗？";
      pinyin = "Bú kèqì! Hái yǒu shénme xiǎng liáo de ma?";
      english = "You're welcome! Is there anything else you'd like to chat about?";
    } else if (lower.includes("名字") || lower.includes("name")) {
      reply = "我叫小红。你呢？";
      pinyin = "Wǒ jiào Xiǎo Hóng. Nǐ ne?";
      english = "My name is Xiao Hong. And you?";
    } else {
      switch (selectedScenario.id) {
        case "cafe":
          reply = "我们有咖啡、茶和果汁。你要什么？";
          pinyin = "Wǒmen yǒu kāfēi, chá hé guǒzhī. Nǐ yào shénme?";
          english = "We have coffee, tea and juice. What would you like?";
          break;
        case "restaurant":
          reply = "今天的招牌菜是宫保鸡丁，非常好吃！";
          pinyin = "Jīntiān de zhāopái cài shì gōngbǎo jīdīng, fēicháng hǎochī!";
          english = "Today's special is Kung Pao Chicken, very delicious!";
          break;
        case "directions":
          reply = "一直走，然后在第二个路口左转。";
          pinyin = "Yīzhí zǒu, ránhòu zài dì èr gè lùkǒu zuǒ zhuǎn.";
          english = "Go straight, then turn left at the second intersection.";
          break;
        case "shopping":
          reply = "这件衣服三百元。你要几件？";
          pinyin = "Zhè jiàn yīfu sānbǎi yuán. Nǐ yào jǐ jiàn?";
          english = "This piece of clothing is 300 yuan. How many would you like?";
          break;
        case "hotel":
          reply = "请给我您的护照，房间号是808。";
          pinyin = "Qǐng gěi wǒ nín de hùzhào, fángjiān hào shì 808.";
          english = "Please give me your passport, your room number is 808.";
          break;
        case "taxi":
          reply = "没问题，大概二十分钟就到。";
          pinyin = "Méi wèntí, dàgài èrshí fēnzhōng jiù dào.";
          english = "No problem, it'll take about twenty minutes.";
          break;
        case "business":
          reply = "谢谢您的邀请。我们先讨论项目计划好吗？";
          pinyin = "Xièxiè nín de yāoqǐng. Wǒmen xiān tǎolùn xiàngmù jìhuà hǎo ma?";
          english = "Thank you for the invitation. Shall we discuss the project plan first?";
          break;
      }
    }

    // Flag grammar feedback correction if input lacks tone accents
    if (lower.includes("ni hao")) {
      correction = {
        original: input,
        improved: input.replace(/ni hao/gi, "nǐ hǎo"),
        explanation: "Grammar Tip: Use proper tone marks: nǐ (3rd tone) hǎo (3rd tone). Good job!"
      };
    }

    const tutorMsg: ChatMessage = {
      id: `msg_tutor_${Date.now()}`,
      role: "tutor",
      simplified: reply,
      pinyin,
      english,
      correction
    };

    setMessages(prev => [...prev, tutorMsg]);
    setIsThinking(false);
    store.addXP(10); // +10 XP for tutoring message
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
      {/* Header bar */}
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
            {selectedScenario ? `AI Tutor: ${selectedScenario.title}` : "AI Tutor Conversations"}
          </h3>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {selectedScenario ? `Active Scenario: ${selectedScenario.description}` : "Chat with Xiao Hong in scenarios"}
          </p>
        </div>
      </header>

      {/* Main View Area */}
      {!selectedScenario ? (
        <div className="anim-slide" style={{ flex: 1, padding: "24px", overflowY: "auto", maxWidth: "600px", margin: "0 auto", width: "100%" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px", textAlign: "left" }}>
            Select Dialogue Scenario
          </h4>
          <div style={{ display: "grid", gap: "12px" }}>
            {CHAT_SCENARIOS.map((scen) => (
              <div
                key={scen.id}
                onClick={() => selectScenario(scen)}
                className="card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <span style={{ fontSize: "2.2rem" }}>{scen.emoji}</span>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: "1.05rem" }}>{scen.title}</h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>{scen.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "calc(100% - 65px)" }}>
          {/* Messages body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.role === "tutor" ? "flex-start" : "flex-end",
                  maxWidth: "80%",
                  textAlign: "left"
                }}
              >
                <div style={{
                  padding: "14px 18px",
                  borderRadius: "16px",
                  borderTopLeftRadius: msg.role === "tutor" ? "4px" : "16px",
                  borderTopRightRadius: msg.role === "tutor" ? "16px" : "4px",
                  backgroundColor: msg.role === "tutor" ? "var(--bg-card)" : "var(--primary-red)",
                  color: msg.role === "tutor" ? "var(--text-main)" : "white",
                  border: msg.role === "tutor" ? "1px solid var(--border-color)" : "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.01)"
                }}>
                  {msg.role === "tutor" ? (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)" }}>👩‍🏫 Tutor Xiao Hong</span>
                        <button
                          onClick={() => playTTS(msg.simplified)}
                          style={{ border: "none", background: "none", color: "var(--primary-red)", cursor: "pointer" }}
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                      <h3 className="hanzi-text" style={{ fontSize: "1.35rem", fontWeight: 700 }}>
                        {msg.simplified}
                      </h3>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "2px" }}>{msg.pinyin}</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-main)", borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: "4px", marginTop: "6px" }}>
                        {msg.english}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="hanzi-text" style={{ fontSize: "1.35rem", fontWeight: 700 }}>
                        {msg.simplified}
                      </h3>
                    </div>
                  )}
                </div>

                {/* Correction Tips Box */}
                {msg.correction && (
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
                      <strong>Did you mean:</strong> <em>"{msg.correction.improved}"</em>
                      <p style={{ marginTop: "2px", color: "var(--text-muted)" }}>{msg.correction.explanation}</p>
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
                Xiao Hong is writing a response... ✏️
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Typing Form box */}
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
              placeholder={`Chat with Tutor in Chinese (e.g. 你好)...`}
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
