import type { DailyStat } from '../users';

export interface ChatScenario {
    id: string;
    title: string;
    emoji: string;
    description: string;
    initialMessage: {
        simplified: string;
        pinyin: string;
        english: string;
    };
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'tutor' | 'system';
    simplified: string;
    pinyin?: string | null;
    english?: string | null;
    correction?: {
        original: string;
        improved: string;
        explanation: string;
    } | null;
}

export interface ChatSession {
    id: string;
    scenarioId: string | null;
    createdAt: string;
    messages: ChatMessage[];
}

export interface ChatScenariosResponse {
    scenarios: ChatScenario[];
}

export interface StartSessionPayload {
    scenarioId?: string | null;
}

export interface StartSessionResponse {
    session: ChatSession;
}

export interface SendMessagePayload {
    text: string;
}

export interface SendMessageResponse {
    userMessage: ChatMessage;
    tutorMessage: ChatMessage;
    xpEarned: number;
    todayStats: Pick<DailyStat, 'xp' | 'minutesStudied'>;
}
