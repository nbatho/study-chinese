export type SkillLevel = "beginner" | "elementary" | "intermediate" | "advanced";
export type LearningGoal = "travel" | "business" | "hskExam" | "culture" | "family" | "casual";

export interface UserProfile {
  name: string;
  avatar: string;
  startLevel: SkillLevel;
  goalPurpose: LearningGoal;
  dailyMinutes: number;
  showPinyin: boolean;
  audioAutoPlay: boolean;
  appAppearance: "light" | "dark" | "system";
  hasCompletedOnboarding: boolean;
  joinDate: string;
}

export interface DailyStat {
  dateKey: string; // yyyy-MM-dd
  xp: number;
  minutesStudied: number;
  lessonsCompleted: number;
  wordsReviewed: number;
  exercisesCorrect: number;
  exercisesTotal: number;
}

export interface LessonProgress {
  lessonId: string;
  completedAt: string | null;
  bestAccuracy: number;
  attempts: number;
}

export type ReviewQuality = "again" | "hard" | "good" | "easy";
export type MasteryLevel = "new" | "learning" | "young" | "mature" | "mastered";

export interface SRSCard {
  id: string;
  wordId: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  dueDate: string; // ISO String
  lastReviewedAt: string | null;
  correctStreak: number;
  wrongCount: number;
  masteryLevel: MasteryLevel;
}

export interface CustomList {
  id: string;
  name: string;
  emoji: string;
  wordIds: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  targetValue: number;
  category: "lessons" | "streak" | "vocabulary" | "xp" | "hsk" | "skill";
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_lesson", title: "First Step", description: "Complete your first lesson", emoji: "👣", targetValue: 1, category: "lessons" },
  { id: "ten_lessons", title: "Dedicated", description: "Complete 10 lessons", emoji: "📘", targetValue: 10, category: "lessons" },
  { id: "fifty_lessons", title: "Scholar", description: "Complete 50 lessons", emoji: "📚", targetValue: 50, category: "lessons" },
  { id: "streak_3", title: "Warming Up", description: "3-day streak", emoji: "🔥", targetValue: 3, category: "streak" },
  { id: "streak_7", title: "Week Strong", description: "7-day streak", emoji: "⚡", targetValue: 7, category: "streak" },
  { id: "streak_30", title: "Unstoppable", description: "30-day streak", emoji: "🏆", targetValue: 30, category: "streak" },
  { id: "words_50", title: "Builder", description: "Learn 50 words", emoji: "🧱", targetValue: 50, category: "vocabulary" },
  { id: "words_200", title: "Vocab Master", description: "Learn 200 words", emoji: "🎯", targetValue: 200, category: "vocabulary" },
  { id: "words_500", title: "Word Wizard", description: "Learn 500 words", emoji: "🧙", targetValue: 500, category: "vocabulary" },
  { id: "xp_100", title: "Rookie", description: "Earn 100 XP", emoji: "⭐", targetValue: 100, category: "xp" },
  { id: "xp_1000", title: "Pro", description: "Earn 1000 XP", emoji: "🌟", targetValue: 1000, category: "xp" },
  { id: "xp_5000", title: "Elite", description: "Earn 5000 XP", emoji: "✨", targetValue: 5000, category: "xp" },
  { id: "perfect_tone", title: "Tone Master", description: "Perfect score on tone drill", emoji: "🎵", targetValue: 1, category: "skill" }
];

export class AppStore {
  profile: UserProfile;
  dailyStats: Record<string, DailyStat> = {};
  lessonProgress: Record<string, LessonProgress> = {};
  srsCards: Record<string, SRSCard> = {};
  unlockedAchievements: string[] = [];
  favoriteWords: string[] = [];
  customLists: CustomList[] = [];
  recentlyUnlocked: Achievement | null = null;

  private listeners = new Set<() => void>();

  constructor() {
    // Load from local storage or set defaults
    this.profile = this.loadItem("user_profile", {
      name: "Learner",
      avatar: "🐼",
      startLevel: "beginner",
      goalPurpose: "travel",
      dailyMinutes: 15,
      showPinyin: true,
      audioAutoPlay: true,
      appAppearance: "light",
      hasCompletedOnboarding: false,
      joinDate: new Date().toISOString()
    });

    this.dailyStats = this.loadItem("daily_stats", {});
    this.lessonProgress = this.loadItem("lesson_progress", {});
    this.srsCards = this.loadItem("srs_cards", {});
    this.unlockedAchievements = this.loadItem("unlocked_achievements", []);
    this.favoriteWords = this.loadItem("favorite_words", []);
    this.customLists = this.loadItem("custom_lists", []);

    this.updateStreakIfNeeded();
  }

  private loadItem<T>(key: string, defaultValue: T): T {
    try {
      const val = localStorage.getItem(`study_chinese_${key}`);
      return val ? JSON.parse(val) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private saveItem(key: string, value: any) {
    try {
      localStorage.setItem(`study_chinese_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error("Storage save error", e);
    }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l());
  }

  // Set Profile
  updateProfile(updates: Partial<UserProfile>) {
    this.profile = { ...this.profile, ...updates };
    this.saveItem("user_profile", this.profile);
    this.notify();
  }

  // Get Today's Date String
  getTodayKey(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  getTodayStat(): DailyStat {
    const key = this.getTodayKey();
    if (!this.dailyStats[key]) {
      this.dailyStats[key] = {
        dateKey: key,
        xp: 0,
        minutesStudied: 0,
        lessonsCompleted: 0,
        wordsReviewed: 0,
        exercisesCorrect: 0,
        exercisesTotal: 0
      };
    }
    return this.dailyStats[key];
  }

  addXP(amount: number) {
    const today = this.getTodayStat();
    today.xp += amount;
    this.saveItem("daily_stats", this.dailyStats);
    this.evaluateAchievements();
    this.notify();
  }

  addMinutes(minutes: number) {
    const today = this.getTodayStat();
    today.minutesStudied += minutes;
    this.saveItem("daily_stats", this.dailyStats);
    this.notify();
  }

  // Lesson Progress
  getLessonProgress(lessonId: string): LessonProgress {
    if (!this.lessonProgress[lessonId]) {
      this.lessonProgress[lessonId] = {
        lessonId,
        completedAt: null,
        bestAccuracy: 0,
        attempts: 0
      };
    }
    return this.lessonProgress[lessonId];
  }

  completeLesson(lessonId: string, accuracy: number, minutes: number) {
    const progress = this.getLessonProgress(lessonId);
    const wasCompleted = !!progress.completedAt;
    
    progress.completedAt = new Date().toISOString();
    progress.bestAccuracy = Math.max(progress.bestAccuracy, accuracy);
    progress.attempts += 1;

    const today = this.getTodayStat();
    if (!wasCompleted) {
      today.lessonsCompleted += 1;
    }
    
    this.addMinutes(minutes);
    this.saveItem("lesson_progress", this.lessonProgress);
    this.saveItem("daily_stats", this.dailyStats);
    this.evaluateAchievements();
    this.notify();
  }

  getCompletedLessonsCount() {
    return Object.values(this.lessonProgress).filter(p => !!p.completedAt).length;
  }

  // Spaced Repetition (SRS)
  enrollSRS(wordId: string) {
    if (!this.srsCards[wordId]) {
      this.srsCards[wordId] = {
        id: `srs_${wordId}`,
        wordId,
        easeFactor: 2.5,
        intervalDays: 0,
        repetitions: 0,
        dueDate: new Date().toISOString(),
        lastReviewedAt: null,
        correctStreak: 0,
        wrongCount: 0,
        masteryLevel: "new"
      };
      this.saveItem("srs_cards", this.srsCards);
    }
  }

  reviewSRS(wordId: string, quality: ReviewQuality) {
    this.enrollSRS(wordId);
    const card = this.srsCards[wordId];
    const now = new Date();

    card.lastReviewedAt = now.toISOString();

    switch (quality) {
      case "again":
        card.repetitions = 0;
        card.intervalDays = 0.01; // ~15 mins
        card.wrongCount += 1;
        card.correctStreak = 0;
        card.easeFactor = Math.max(1.3, card.easeFactor - 0.2);
        break;
      case "hard":
        card.repetitions += 1;
        card.intervalDays = Math.max(1, card.intervalDays * 1.2);
        card.correctStreak += 1;
        card.easeFactor = Math.max(1.3, card.easeFactor - 0.15);
        break;
      case "good":
        card.repetitions += 1;
        if (card.repetitions === 1) {
          card.intervalDays = 1;
        } else if (card.repetitions === 2) {
          card.intervalDays = 3;
        } else {
          card.intervalDays = card.intervalDays * card.easeFactor;
        }
        card.correctStreak += 1;
        break;
      case "easy":
        card.repetitions += 1;
        if (card.repetitions === 1) {
          card.intervalDays = 2;
        } else {
          card.intervalDays = card.intervalDays * card.easeFactor * 1.3;
        }
        card.easeFactor = Math.min(3.0, card.easeFactor + 0.15);
        card.correctStreak += 1;
        break;
    }

    card.intervalDays = Math.min(card.intervalDays, 365);
    const dueTime = new Date(now.getTime() + card.intervalDays * 24 * 60 * 60 * 1000);
    card.dueDate = dueTime.toISOString();

    // Mastery calculation
    if (card.repetitions === 0) card.masteryLevel = "new";
    else if (card.intervalDays < 1) card.masteryLevel = "learning";
    else if (card.intervalDays < 7) card.masteryLevel = "young";
    else if (card.intervalDays < 21) card.masteryLevel = "mature";
    else card.masteryLevel = "mastered";

    const today = this.getTodayStat();
    today.wordsReviewed += 1;
    this.addXP(5); // +5 XP per review card

    this.saveItem("srs_cards", this.srsCards);
    this.saveItem("daily_stats", this.dailyStats);
    this.evaluateAchievements();
    this.notify();
  }

  getDueSRSCardsCount() {
    const now = new Date();
    return Object.values(this.srsCards).filter(c => new Date(c.dueDate) <= now).length;
  }

  getDueSRSCards(limit = 20): SRSCard[] {
    const now = new Date();
    return Object.values(this.srsCards)
      .filter(c => new Date(c.dueDate) <= now)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, limit);
  }

  getTotalStudiedWordsCount() {
    return Object.values(this.srsCards).filter(c => cardRepCount(c) > 0).length;
  }

  getMasteredWordsCount() {
    return Object.values(this.srsCards).filter(c => c.masteryLevel === "mastered").length;
  }

  // Favorites
  isFavorite(wordId: string): boolean {
    return this.favoriteWords.includes(wordId);
  }

  toggleFavorite(wordId: string) {
    if (this.favoriteWords.includes(wordId)) {
      this.favoriteWords = this.favoriteWords.filter(id => id !== wordId);
    } else {
      this.favoriteWords.push(wordId);
    }
    this.saveItem("favorite_words", this.favoriteWords);
    this.notify();
  }

  // Custom Vocab lists
  addCustomList(name: string, emoji = "📗") {
    const newList: CustomList = {
      id: `list_${Date.now()}`,
      name,
      emoji,
      wordIds: []
    };
    this.customLists.push(newList);
    this.saveItem("custom_lists", this.customLists);
    this.notify();
  }

  deleteCustomList(id: string) {
    this.customLists = this.customLists.filter(l => l.id !== id);
    this.saveItem("custom_lists", this.customLists);
    this.notify();
  }

  addWordToCustomList(wordId: string, listId: string) {
    const list = this.customLists.find(l => l.id === listId);
    if (list && !list.wordIds.includes(wordId)) {
      list.wordIds.push(wordId);
      this.saveItem("custom_lists", this.customLists);
      this.notify();
    }
  }

  removeWordFromCustomList(wordId: string, listId: string) {
    const list = this.customLists.find(l => l.id === listId);
    if (list) {
      list.wordIds = list.wordIds.filter(id => id !== wordId);
      this.saveItem("custom_lists", this.customLists);
      this.notify();
    }
  }

  // Streaks Management
  getCurrentStreak(): number {
    const streak = this.loadItem<any>("study_streak", { current: 0, best: 0, lastStudyDateKey: null });
    return streak.current;
  }

  getBestStreak(): number {
    const streak = this.loadItem<any>("study_streak", { current: 0, best: 0, lastStudyDateKey: null });
    return streak.best;
  }

  private updateStreakIfNeeded() {
    const streak = this.loadItem<any>("study_streak", { current: 0, best: 0, lastStudyDateKey: null });
    const today = this.getTodayKey();
    
    if (streak.lastStudyDateKey === today) return;

    // Check if yesterday was the last study day to continue the streak
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yesterday = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    if (streak.lastStudyDateKey === yesterday) {
      // Streak continues upon next review/lesson, we check when they earn XP
    } else if (streak.lastStudyDateKey !== null) {
      // Streak broken
      streak.current = 0;
      this.saveItem("study_streak", streak);
    }
  }

  recordActivityXP() {
    const streak = this.loadItem<any>("study_streak", { current: 0, best: 0, lastStudyDateKey: null });
    const today = this.getTodayKey();
    
    if (streak.lastStudyDateKey !== today) {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      const yesterday = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

      if (streak.lastStudyDateKey === yesterday || streak.current === 0) {
        streak.current += 1;
      } else {
        streak.current = 1;
      }
      streak.best = Math.max(streak.best, streak.current);
      streak.lastStudyDateKey = today;
      this.saveItem("study_streak", streak);
      this.evaluateAchievements();
    }
  }

  // Achievements checking
  evaluateAchievements() {
    const streak = this.loadItem<any>("study_streak", { current: 0, best: 0, lastStudyDateKey: null }).current;
    const totalXP = Object.values(this.dailyStats).reduce((sum, s) => sum + s.xp, 0);
    const totalLessons = this.getCompletedLessonsCount();
    const totalWords = this.getTotalStudiedWordsCount();

    ACHIEVEMENTS.forEach(ach => {
      if (this.unlockedAchievements.includes(ach.id)) return;

      let meetsRequirement = false;
      if (ach.category === "lessons" && totalLessons >= ach.targetValue) meetsRequirement = true;
      if (ach.category === "streak" && streak >= ach.targetValue) meetsRequirement = true;
      if (ach.category === "vocabulary" && totalWords >= ach.targetValue) meetsRequirement = true;
      if (ach.category === "xp" && totalXP >= ach.targetValue) meetsRequirement = true;

      if (meetsRequirement) {
        this.unlockedAchievements.push(ach.id);
        this.recentlyUnlocked = ach;
        this.saveItem("unlocked_achievements", this.unlockedAchievements);
        setTimeout(() => {
          this.recentlyUnlocked = null;
          this.notify();
        }, 3000);
      }
    });
  }

  unlockSpecialAchievement(id: string) {
    if (!this.unlockedAchievements.includes(id)) {
      const ach = ACHIEVEMENTS.find(a => a.id === id);
      if (ach) {
        this.unlockedAchievements.push(id);
        this.recentlyUnlocked = ach;
        this.saveItem("unlocked_achievements", this.unlockedAchievements);
        this.notify();
        setTimeout(() => {
          this.recentlyUnlocked = null;
          this.notify();
        }, 3000);
      }
    }
  }

  // Get next recommended lesson
  getNextLesson(): null {
    return null;
  }

  // History for charts
  getRecentStats(days = 7): DailyStat[] {
    const result: DailyStat[] = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      result.push(this.dailyStats[key] || {
        dateKey: key,
        xp: 0,
        minutesStudied: 0,
        lessonsCompleted: 0,
        wordsReviewed: 0,
        exercisesCorrect: 0,
        exercisesTotal: 0
      });
    }
    return result;
  }
}

function cardRepCount(card: SRSCard): number {
  return card.repetitions || 0;
}

export const globalStore = new AppStore();

import { useState, useEffect } from "react";
export function useStore() {
  const [, setTick] = useState(0);
  useEffect(() => {
    return globalStore.subscribe(() => setTick(t => t + 1));
  }, []);
  return globalStore;
}
