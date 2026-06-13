import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { aiTutorApi } from './index';
import type { SendMessagePayload, StartSessionPayload } from './types';
import { showAchievementToasts } from '../../utils/achievementToast';

export const useChatScenariosQuery = () =>
    useQuery({
        queryKey: queryKeys.aiTutor.scenarios,
        queryFn: () => unwrapApiData(aiTutorApi.scenarios()),
    });

export const useStartChatSessionMutation = () =>
    useMutation({
        mutationFn: (payload: StartSessionPayload) => unwrapApiData(aiTutorApi.startSession(payload)),
    });

export const useSendChatMessageMutation = (sessionId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: SendMessagePayload) =>
            unwrapApiData(aiTutorApi.sendMessage(sessionId, payload)),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
            showAchievementToasts(data.unlockedAchievements);
        },
    });
};
