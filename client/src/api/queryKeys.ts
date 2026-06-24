export const queryKeys = {
    auth: {
        refresh: ['auth', 'refresh'] as const,
    },
    users: {
        profile: ['users', 'profile'] as const,
        stats: (days?: number) => ['users', 'stats', days ?? 7] as const,
        mistakes: (limit?: number) => ['users', 'mistakes', limit ?? 30] as const,
        todayPlan: ['users', 'today-plan'] as const,
    },
    lessons: {
        list: ['lessons'] as const,
        detail: (lessonId: string) => ['lessons', lessonId] as const,
    },
    vocabulary: {
        search: (params?: unknown) => ['vocabulary', params ?? {}] as const,
    },
    srs: {
        due: (limit?: number) => ['srs', 'due', limit ?? 20] as const,
    },
    favorites: {
        all: ['favorites'] as const,
    },
    lists: {
        all: ['lists'] as const,
        detail: (listId: string) => ['lists', listId] as const,
    },
    aiTutor: {
        scenarios: ['ai-tutor', 'scenarios'] as const,
    },
    ocr: {
        scan: ['ocr', 'scan'] as const,
        history: (limit?: number) => ['ocr', 'history', limit ?? 20] as const,
    },
    achievements: {
        all: ['achievements'] as const,
    },
    dashboard: {
        dailyContent: ['dashboard', 'daily-content'] as const,
    },
    practice: {
        catalog: ['practice'] as const,
        minimalPairs: ['practice', 'minimal-pairs'] as const,
        shadowingPrompts: ['practice', 'shadowing-prompts'] as const,
        hanziStrokes: ['practice', 'hanzi-strokes'] as const,
    },
};
