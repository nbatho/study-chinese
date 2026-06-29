export interface AdminSummaryResponse {
    summary: {
        users: { total: number; admins: number };
        lessons: { total: number; active: number };
        words: { total: number; active: number };
        reports: { total: number; pending: number };
        chats: { sessions: number; recent: number };
    };
}

export interface AdminLesson {
    id: string;
    title: string;
    subtitle: string;
    hskLevel: number;
    order: number;
    skill: string;
    estimatedMinutes: number;
    xpReward: number;
    intro: string;
    dialogue?: unknown;
    isActive: boolean;
    contentVersion: number;
    createdAt: string;
    updatedAt: string;
}

export interface AdminWord {
    id: string;
    simplified: string;
    traditional: string;
    pinyin: string;
    tones: number[];
    english: string;
    partOfSpeech: string;
    hskLevel: number;
    category: string;
    isActive: boolean;
    contentVersion: number;
    createdAt: string;
    updatedAt: string;
}

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    avatar?: string | null;
    role: 'student' | 'admin';
    isActive: boolean;
    startLevel: string;
    dailyMinutes: number;
    currentStreak: number;
    bestStreak: number;
    joinDate: string;
    updatedAt: string;
}

export interface AdminAiMessage {
    id: string;
    role: 'user' | 'tutor' | 'system';
    rawText: string;
    simplified: string;
    pinyin?: string | null;
    english?: string | null;
    correction?: {
        original: string;
        improved: string;
        explanation: string;
    } | null;
    modelName?: string | null;
    tokenUsage?: Record<string, number> | null;
    createdAt: string;
}

export interface AdminAiLogSession {
    id: string;
    userId: string;
    userEmail: string;
    userName: string;
    scenarioId?: string | null;
    scenarioTitle?: string | null;
    title?: string | null;
    messageCount: number;
    lastModelName?: string | null;
    totalInputTokens: number;
    totalOutputTokens: number;
    createdAt: string;
    updatedAt: string;
    messages: AdminAiMessage[];
}

export interface AdminReport {
    id: string;
    userId?: string | null;
    userEmail?: string | null;
    userName?: string | null;
    lessonId?: string | null;
    lessonTitle?: string | null;
    wordId?: string | null;
    wordText?: string | null;
    exerciseId?: string | null;
    category: string;
    status: 'open' | 'reviewing' | 'resolved' | 'dismissed';
    message: string;
    adminNote?: string | null;
    resolvedBy?: string | null;
    resolvedAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface AdminListParams {
    q?: string;
    limit?: number;
    includeInactive?: boolean;
    status?: string;
}

export interface AdminLessonsResponse {
    lessons: AdminLesson[];
}

export interface AdminWordsResponse {
    words: AdminWord[];
}

export interface AdminUsersResponse {
    users: AdminUser[];
}

export interface AdminAiLogsResponse {
    sessions: AdminAiLogSession[];
}

export interface AdminReportsResponse {
    reports: AdminReport[];
}

export type AdminLessonPayload = Omit<AdminLesson, 'createdAt' | 'updatedAt' | 'contentVersion'>;
export type AdminWordPayload = Omit<AdminWord, 'createdAt' | 'updatedAt' | 'contentVersion'>;
