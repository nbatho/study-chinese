import { toast } from "sonner";
import type { Achievement } from "../api/achievements";
import { translate } from "../i18n/translate";
import getAchievementText from "../pages/Achievements/components/getAchievementText";

export const showAchievementToasts = (achievements?: Achievement[]) => {
  if (!achievements?.length) return;

  achievements.forEach((achievement) => {
    const { title, description } = getAchievementText(achievement, translate);

    toast.success(translate("achievements.toastUnlocked", { title }), {
      description: `${achievement.emoji} ${description}`,
      duration: 6000,
    });
  });
};
