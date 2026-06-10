export interface Achievement {
    id: string;
    title: string;
    description: string;
    emoji: string;
    targetValue: number;
    category: 'lessons' | 'streak' | 'vocabulary' | 'xp' | 'hsk' | 'skill';
    unlockedAt: string | null;
}

export interface AchievementsResponse {
    achievements: Achievement[];
}

export interface UnlockAchievementResponse {
    unlocked: boolean;
    achievement: Pick<Achievement, 'id' | 'title' | 'emoji'>;
}
