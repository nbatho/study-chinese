import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import beApi from '../callApi';
import { queryKeys } from '../queryKeys';
import { apiRequest, unwrapApiData } from '../shared';

export type LeaderboardTimeframe = 'weekly' | 'all-time';
export type LeaderboardScope = 'global' | 'friends';

export interface CommunityUser {
    id: string;
    name: string;
    avatar: string;
    startLevel: string;
    streak: {
        current: number;
        best: number;
    };
    totalXp?: number;
}

export interface FriendshipItem {
    id: string;
    status: 'pending' | 'accepted';
    direction: 'incoming' | 'outgoing';
    createdAt: string;
    updatedAt: string;
    user: CommunityUser;
}

export interface FriendsResponse {
    friends: FriendshipItem[];
    pending: {
        received: FriendshipItem[];
        sent: FriendshipItem[];
    };
}

export interface FriendRequestPayload {
    identifier?: string;
    email?: string;
    userId?: string;
}

export interface FriendRequestResponse {
    friendship: FriendshipItem;
}

export interface LeaderboardEntry {
    rank: number;
    user: Omit<CommunityUser, 'totalXp'>;
    totalXp: number;
    isCurrentUser: boolean;
}

export interface LeaderboardResponse {
    timeframe: LeaderboardTimeframe;
    scope: LeaderboardScope;
    entries: LeaderboardEntry[];
}

export const communityApi = {
    getFriends: () => apiRequest<FriendsResponse>(beApi.get('friends')),

    sendFriendRequest: (payload: FriendRequestPayload) =>
        apiRequest<FriendRequestResponse>(beApi.post('friends/request', payload)),

    acceptFriendRequest: (friendshipId: string) =>
        apiRequest<FriendRequestResponse>(beApi.put(`friends/${friendshipId}/accept`)),

    removeFriendship: (friendshipId: string) => apiRequest<null>(beApi.delete(`friends/${friendshipId}`)),

    getLeaderboard: (params?: { timeframe?: LeaderboardTimeframe }) =>
        apiRequest<LeaderboardResponse>(beApi.get('leaderboard', { params })),

    getFriendsLeaderboard: (params?: { timeframe?: LeaderboardTimeframe }) =>
        apiRequest<LeaderboardResponse>(beApi.get('leaderboard/friends', { params })),
};

export const useFriendsQuery = (enabled = true) =>
    useQuery({
        queryKey: queryKeys.community.friends,
        queryFn: () => unwrapApiData(communityApi.getFriends()),
        enabled,
    });

export const useLeaderboardQuery = ({
    scope = 'global',
    timeframe = 'weekly',
    enabled = true,
}: {
    scope?: LeaderboardScope;
    timeframe?: LeaderboardTimeframe;
    enabled?: boolean;
} = {}) =>
    useQuery({
        queryKey: queryKeys.community.leaderboard(scope, timeframe),
        queryFn: () =>
            unwrapApiData(
                scope === 'friends'
                    ? communityApi.getFriendsLeaderboard({ timeframe })
                    : communityApi.getLeaderboard({ timeframe }),
            ),
        enabled,
    });

export const useSendFriendRequestMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: FriendRequestPayload) => unwrapApiData(communityApi.sendFriendRequest(payload)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.community.friends });
            queryClient.invalidateQueries({ queryKey: ['community', 'leaderboard'] });
        },
    });
};

export const useAcceptFriendRequestMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (friendshipId: string) => unwrapApiData(communityApi.acceptFriendRequest(friendshipId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.community.friends });
            queryClient.invalidateQueries({ queryKey: ['community', 'leaderboard'] });
        },
    });
};

export const useRemoveFriendshipMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (friendshipId: string) => unwrapApiData(communityApi.removeFriendship(friendshipId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.community.friends });
            queryClient.invalidateQueries({ queryKey: ['community', 'leaderboard'] });
        },
    });
};
