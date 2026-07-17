import { User } from "lucide-react";
import LoginPromptCard from "../../components/LoginPromptCard";
import LoadingCard from "../../components/LoadingCard";
import { useI18n } from "../../i18n";
import { useAuthGate } from "../../hooks/useAuthGate";
import AppSettingsSection from "./components/AppSettingsSection";
import SecuritySection from "./components/SecuritySection";
import DangerZoneSection from "./components/DangerZoneSection";

export default function Settings() {
  const { t } = useI18n();
  const { isResolving, isAuthenticated } = useAuthGate();

  if (isResolving) {
    return <LoadingCard label={t("common.loading")} />;
  }

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={User}
        title={t("loginPrompt.profileTitle")}
        description={t("loginPrompt.profileBody")}
      />
    );
  }

  return (
    <div className="app-page">
      <AppSettingsSection />
      <SecuritySection />
      <DangerZoneSection />
    </div>
  );
}
