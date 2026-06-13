import { toast } from "sonner";
import type { Achievement } from "../api/achievements";

export const showAchievementToasts = (achievements?: Achievement[]) => {
  if (!achievements?.length) return;

  achievements.forEach((achievement) => {
    toast.success(`Đạt thành tựu mới: ${achievement.title}`, {
      description: `${achievement.emoji} ${achievement.description}`,
      duration: 6000,
    });
  });
};
