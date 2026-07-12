export const queryKeys = {
    auth: {
        refresh: ['auth', 'refresh'] as const,
    },
    users: {
        profile: ['users', 'profile'] as const,
        stats: (days?: number) => ['users', 'stats', days ?? 7] as const,
        mistakes: (limit?: number) => ['users', 'mistakes', limit ?? 30] as const,
        todayPlan: ['users', 'today-plan'] as const,
        shop: ['users', 'shop'] as const,
    },
    lessons: {
        list: (locale = 'en') => ['lessons', locale] as const,
        grammar: (locale = 'en') => ['lessons', 'grammar', locale] as const,
        detail: (lessonId: string, locale = 'en') => ['lessons', lessonId, locale] as const,
    },
    placement: {
        questions: ['placement', 'questions'] as const,
    },
    vocabulary: {
        search: (params?: unknown) => ['vocabulary', params ?? {}] as const,
        topics: ['vocabulary', 'topics'] as const,
        radicals: ['vocabulary', 'radicals'] as const,
        stats: ['vocabulary', 'stats'] as const,
        lookup: (text: string) => ['vocabulary', 'lookup', text] as const,
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
        history: (params?: unknown) => ['ocr', 'history', params ?? { limit: 20 }] as const,
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
    community: {
        friends: ['community', 'friends'] as const,
        leaderboard: (scope = 'global', timeframe = 'weekly') =>
            ['community', 'leaderboard', scope, timeframe] as const,
    },
    admin: {
        summary: ['admin', 'summary'] as const,
        lessons: (params?: unknown) => ['admin', 'lessons', params ?? {}] as const,
        words: (params?: unknown) => ['admin', 'words', params ?? {}] as const,
        users: (params?: unknown) => ['admin', 'users', params ?? {}] as const,
        aiLogs: (params?: unknown) => ['admin', 'ai-logs', params ?? {}] as const,
        reports: (params?: unknown) => ['admin', 'reports', params ?? {}] as const,
    },
};
