import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Globe2, Search, Trophy, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import {
  type LeaderboardScope,
  type LeaderboardTimeframe,
  useAcceptFriendRequestMutation,
  useFriendsQuery,
  useLeaderboardQuery,
  useRemoveFriendshipMutation,
  useSendFriendRequestMutation,
} from "../../api/community";
import LoadingCard from "../../components/LoadingCard";
import LoginPromptCard from "../../components/LoginPromptCard";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useI18n } from "../../i18n";
import { useAuthGate } from "../../hooks/useAuthGate";
import SegmentButton from "./component/SegmentButton";
import FriendRow from "./component/FriendRow";
import LeaderboardRow from "./component/LeaderboardRow";

type CommunityTab = "leaderboard" | "friends";

export default function Community() {
  const { t } = useI18n();
  const { isResolving, isAuthenticated } = useAuthGate();
  const [tab, setTab] = useState<CommunityTab>("leaderboard");
  const [scope, setScope] = useState<LeaderboardScope>("global");
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>("weekly");
  const [identifier, setIdentifier] = useState("");

  const friendsQuery = useFriendsQuery(isAuthenticated);
  const leaderboardQuery = useLeaderboardQuery({
    scope,
    timeframe,
    enabled: isAuthenticated && tab === "leaderboard",
  });
  const sendRequestMutation = useSendFriendRequestMutation();
  const acceptRequestMutation = useAcceptFriendRequestMutation();
  const removeFriendshipMutation = useRemoveFriendshipMutation();

  const friends = friendsQuery.data?.friends ?? [];
  const received = friendsQuery.data?.pending.received ?? [];
  const sent = friendsQuery.data?.pending.sent ?? [];
  const entries = useMemo(() => leaderboardQuery.data?.entries ?? [], [leaderboardQuery.data?.entries]);
  const isFriendActionBusy = acceptRequestMutation.isPending || removeFriendshipMutation.isPending;

  const handleSendRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = identifier.trim();

    if (!target) {
      toast.error(t("community.enterIdentifier"));
      return;
    }

    await sendRequestMutation.mutateAsync({ identifier: target });
    setIdentifier("");
    toast.success(t("community.requestSent"));
  };

  const handleAccept = async (friendshipId: string) => {
    await acceptRequestMutation.mutateAsync(friendshipId);
    toast.success(t("community.requestAccepted"));
  };

  const handleRemove = async (friendshipId: string) => {
    await removeFriendshipMutation.mutateAsync(friendshipId);
    toast.success(t("community.friendsUpdated"));
  };

  if (isResolving) {
    return <LoadingCard label={t("common.loading")} />;
  }

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={Users}
        title={t("community.loginTitle")}
        description={t("community.loginBody")}
      />
    );
  }

  return (
    <div className="app-page">
      <header className="app-page-header mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
            <Users size={14} />
            {t("community.badge")}
          </div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">{t("community.title")}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {t("community.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-xl border bg-background p-3 text-center">
          <div className="min-w-18.5">
            <span className="block text-xs font-bold text-muted-foreground">{t("community.statFriends")}</span>
            <strong className="text-xl text-primary">{friends.length}</strong>
          </div>
          <div className="min-w-18.5">
            <span className="block text-xs font-bold text-muted-foreground">{t("community.statReceived")}</span>
            <strong className="text-xl text-tone-3">{received.length}</strong>
          </div>
          <div className="min-w-18.5">
            <span className="block text-xs font-bold text-muted-foreground">{t("community.statSent")}</span>
            <strong className="text-xl text-jade">{sent.length}</strong>
          </div>
        </div>
      </header>

      <div className="app-surface mb-5 grid grid-cols-2 gap-2 p-1 sm:max-w-md">
        <SegmentButton active={tab === "leaderboard"} onClick={() => setTab("leaderboard")}>
          <Trophy size={16} />
          {t("community.tabLeaderboard")}
        </SegmentButton>
        <SegmentButton active={tab === "friends"} onClick={() => setTab("friends")}>
          <Users size={16} />
          {t("community.tabFriends")}
        </SegmentButton>
      </div>

      {tab === "leaderboard" ? (
        <section className="app-surface overflow-hidden">
          <div className="flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-extrabold">{t("community.leaderboardTitle")}</h2>
              <p className="text-xs text-muted-foreground">{t("community.leaderboardSubtitle")}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-[220px_190px]">
              <div className="grid grid-cols-2 gap-1 rounded-xl border bg-background p-1">
                <SegmentButton active={scope === "global"} onClick={() => setScope("global")}>
                  <Globe2 size={15} />
                  {t("community.scopeGlobal")}
                </SegmentButton>
                <SegmentButton active={scope === "friends"} onClick={() => setScope("friends")}>
                  <Users size={15} />
                  {t("community.scopeFriends")}
                </SegmentButton>
              </div>
              <div className="grid grid-cols-2 gap-1 rounded-xl border bg-background p-1">
                <SegmentButton active={timeframe === "weekly"} onClick={() => setTimeframe("weekly")}>
                  {t("community.timeframeWeekly")}
                </SegmentButton>
                <SegmentButton active={timeframe === "all-time"} onClick={() => setTimeframe("all-time")}>
                  {t("community.timeframeAllTime")}
                </SegmentButton>
              </div>
            </div>
          </div>

          {leaderboardQuery.isLoading ? (
            <div className="p-4">
              <LoadingCard label={t("community.leaderboardLoading")} />
            </div>
          ) : leaderboardQuery.isError ? (
            <div className="p-8 text-center text-sm font-semibold text-muted-foreground">
              {t("community.leaderboardError")}
            </div>
          ) : entries.length === 0 ? (
            <div className="p-8 text-center text-sm font-semibold text-muted-foreground">
              {t("community.leaderboardEmpty")}
            </div>
          ) : (
            <ol>
              {entries.map((entry) => (
                <LeaderboardRow key={entry.user.id} entry={entry} />
              ))}
            </ol>
          )}
        </section>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="app-surface overflow-hidden">
            <div className="border-b p-3">
              <h2 className="text-base font-extrabold">{t("community.friendsTitle")}</h2>
              <p className="text-xs text-muted-foreground">{t("community.friendsSubtitle")}</p>
            </div>
            {friendsQuery.isLoading ? (
              <div className="p-4">
                <LoadingCard label={t("community.friendsLoading")} />
              </div>
            ) : friends.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-muted-foreground">
                {t("community.friendsEmpty")}
              </div>
            ) : (
              <ul>
                {friends.map((item) => (
                  <FriendRow
                    key={item.id}
                    item={item}
                    action="friend"
                    onRemove={handleRemove}
                    busy={isFriendActionBusy}
                  />
                ))}
              </ul>
            )}
          </section>

          <aside className="grid gap-5">
            <section className="app-surface-padded">
              <h2 className="mb-3 text-base font-extrabold">{t("community.findFriends")}</h2>
              <form onSubmit={handleSendRequest} className="grid gap-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    placeholder={t("community.identifierPlaceholder")}
                    className="pl-9"
                  />
                </div>
                <Button type="submit" disabled={sendRequestMutation.isPending} className="w-full">
                  <UserPlus size={16} />
                  {sendRequestMutation.isPending ? t("community.sending") : t("community.sendRequest")}
                </Button>
              </form>
            </section>

            <section className="app-surface overflow-hidden">
              <div className="border-b p-3">
                <h2 className="text-base font-extrabold">{t("community.pendingTitle")}</h2>
                <p className="text-xs text-muted-foreground">
                  {t("community.pendingSubtitle", { received: received.length, sent: sent.length })}
                </p>
              </div>

              {received.length > 0 && (
                <div>
                  <div className="border-b bg-secondary/60 px-3 py-2 text-xs font-extrabold text-muted-foreground">
                    {t("community.pendingReceived")}
                  </div>
                  <ul>
                    {received.map((item) => (
                      <FriendRow
                        key={item.id}
                        item={item}
                        action="received"
                        onAccept={handleAccept}
                        onRemove={handleRemove}
                        busy={isFriendActionBusy}
                      />
                    ))}
                  </ul>
                </div>
              )}

              {sent.length > 0 && (
                <div>
                  <div className="border-b bg-secondary/60 px-3 py-2 text-xs font-extrabold text-muted-foreground">
                    {t("community.pendingSent")}
                  </div>
                  <ul>
                    {sent.map((item) => (
                      <FriendRow
                        key={item.id}
                        item={item}
                        action="sent"
                        onRemove={handleRemove}
                        busy={isFriendActionBusy}
                      />
                    ))}
                  </ul>
                </div>
              )}

              {received.length === 0 && sent.length === 0 && (
                <div className="p-6 text-center text-sm font-semibold text-muted-foreground">
                  {t("community.pendingEmpty")}
                </div>
              )}
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
