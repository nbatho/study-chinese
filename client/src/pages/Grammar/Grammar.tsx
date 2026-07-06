import { useState } from "react";
import { Search } from "lucide-react";
import { useDailyContentQuery } from "../../api";
import LoginPromptCard from "../../components/LoginPromptCard";
import { useI18n } from "../../i18n";
import { useAppSelector } from "../../store/hooks";

export default function Grammar() {
  const { t } = useI18n();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const dailyContentQuery = useDailyContentQuery(isAuthenticated);
  const [grammarQuery, setGrammarQuery] = useState("");
  const grammarLibrary = dailyContentQuery.data?.grammarLibrary ?? [];
  const filteredGrammar = grammarLibrary.filter((entry) =>
    entry.title.toLowerCase().includes(grammarQuery.toLowerCase()) ||
    entry.summary.toLowerCase().includes(grammarQuery.toLowerCase()) ||
    entry.pattern.toLowerCase().includes(grammarQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={Search}
        title={t("loginPrompt.learnTitle")}
        description={t("loginPrompt.learnBody")}
      />
    );
  }

  return (
    <div className="app-page">
      <div className="app-surface mb-5 flex items-center gap-2.5 px-4 py-2">
        <Search size={18} className="text-muted-foreground" />
        <input
          type="text"
          placeholder={t("learn.searchGrammar")}
          value={grammarQuery}
          onChange={(event) => setGrammarQuery(event.target.value)}
          className="w-full bg-transparent text-[0.95rem] text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="grid gap-4">
        {filteredGrammar.map((entry) => (
          <div key={entry.id} className="app-card-button p-5">
            <h4 className="text-[1.1rem] font-extrabold text-primary">{entry.title}</h4>
            <div className="my-2 rounded-xl bg-background px-3 py-2 text-[0.85rem] font-semibold">
              {t("learn.pattern")} {entry.pattern}
            </div>
            <p className="mb-3 text-[0.9rem] text-muted-foreground">{entry.summary}</p>
            <div className="border-t border-dashed pt-2.5">
              <label className="text-xs font-bold text-muted-foreground">{t("learn.example")}</label>
              {entry.examples.map((ex, index) => (
                <div key={`${entry.id}-${index}`} className="mt-1">
                  <span className="font-serif text-xl font-bold">{ex.simplified}</span>
                  <span className="ml-2.5 text-[0.85rem] text-muted-foreground">({ex.pinyin})</span>
                  <p className="mt-0.5 text-[0.9rem]">{ex.english}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
