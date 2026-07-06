import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Check, Flame, Globe2, Medal, Search, Trophy, UserPlus, Users, X } from "lucide-react";
import { toast } from "sonner";
import {
  type FriendshipItem,
  type LeaderboardEntry,
  type LeaderboardScope,
  type LeaderboardTimeframe,
  useAcceptFriendRequestMutation,
  useFriendsQuery,
  useLeaderboardQuery,
  useRemoveFriendshipMutation,
  useSendFriendRequestMutation,
} from "../api/community";
import LoadingCard from "../components/LoadingCard";
import LoginPromptCard from "../components/LoginPromptCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAppSelector } from "../store/hooks";
import { cn } from "../utils/cn";

type CommunityTab = "leaderboard" | "friends";

const formatNumber = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

const formatLevel = (level?: string) => {
  const labels: Record<string, string> = {
    beginner: "Beginner",
    elementary: "Elementary",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };

  return labels[level || ""] ?? "Learner";
};

function Avatar({ avatar, name, className }: { avatar?: string; name: string; className?: string }) {
  const isImage = Boolean(avatar && /^(https?:|data:image|blob:)/.test(avatar));

  return (
    <span
      className={cn(
        "flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary text-xl font-extrabold",
        className,
      )}
    >
      {isImage ? (
        <img src={avatar} alt={name} className="size-full object-cover" />
      ) : (
        <span aria-hidden="true">{avatar || name.slice(0, 1).toUpperCase()}</span>
      )}
    </span>
  );
}

function SegmentButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-sm font-extrabold transition",
        active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary",
      )}
    >
      {children}
    </button>
  );
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const rankClass =
    entry.rank === 1
      ? "bg-gold/15 text-gold"
      : entry.rank === 2
        ? "bg-tone-1/10 text-tone-1"
        : entry.rank === 3
          ? "bg-tone-3/10 text-tone-3"
          : "bg-secondary text-muted-foreground";

  return (
    <li
      className={cn(
        "grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 border-b px-3 py-3 last:border-b-0 sm:grid-cols-[52px_minmax(0,1fr)_120px_120px]",
        entry.isCurrentUser && "bg-primary/5",
      )}
    >
      <span className={cn("flex size-9 items-center justify-center rounded-xl text-sm font-extrabold", rankClass)}>
        {entry.rank <= 3 ? <Medal size={17} /> : entry.rank}
      </span>

      <div className="flex min-w-0 items-center gap-3">
        <Avatar avatar={entry.user.avatar} name={entry.user.name} />
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-extrabold sm:text-base">{entry.user.name}</span>
            {entry.isCurrentUser && (
              <span className="shrink-0 rounded-md bg-primary/10 px-1.5 py-0.5 text-[0.68rem] font-bold text-primary">
                Bạn
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
            <span>{formatLevel(entry.user.startLevel)}</span>
            <span className="inline-flex items-center gap-1">
              <Flame size={13} className="text-tone-3" />
              {entry.user.streak.current} ngày
            </span>
          </div>
        </div>
      </div>

      <div className="text-right">
        <strong className="block text-base text-primary sm:text-lg">{formatNumber(entry.totalXp)}</strong>
        <span className="text-xs font-semibold text-muted-foreground">XP</span>
      </div>

      <div className="hidden text-right text-sm font-bold text-muted-foreground sm:block">
        Best {entry.user.streak.best}
      </div>
    </li>
  );
}

function FriendRow({
  item,
  action,
  onAccept,
  onRemove,
  busy,
}: {
  item: FriendshipItem;
  action: "friend" | "received" | "sent";
  onAccept?: (id: string) => void;
  onRemove: (id: string) => void;
  busy: boolean;
}) {
  return (
    <li className="flex flex-col gap-3 border-b px-3 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar avatar={item.user.avatar} name={item.user.name} />
        <div className="min-w-0">
          <h3 className="truncate text-sm font-extrabold sm:text-base">{item.user.name}</h3>
          <div className="mt-1 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
            <span>{formatLevel(item.user.startLevel)}</span>
            <span className="inline-flex items-center gap-1">
              <Flame size={13} className="text-tone-3" />
              {item.user.streak.current} ngày
            </span>
            <span>{formatNumber(item.user.totalXp ?? 0)} XP</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {action === "received" && onAccept && (
          <Button type="button" size="sm" onClick={() => onAccept(item.id)} disabled={busy}>
            <Check size={15} />
            Accept
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          variant={action === "friend" ? "outline" : "secondary"}
          onClick={() => onRemove(item.id)}
          disabled={busy}
        >
          {action === "friend" ? <X size={15} /> : <X size={15} />}
          {action === "friend" ? "Hủy kết bạn" : action === "sent" ? "Hủy lời mời" : "Reject"}
        </Button>
      </div>
    </li>
  );
}

export default function Community() {
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
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
      toast.error("Nhập email hoặc mã user để gửi lời mời.");
      return;
    }

    await sendRequestMutation.mutateAsync({ identifier: target });
    setIdentifier("");
    toast.success("Đã gửi lời mời kết bạn.");
  };

  const handleAccept = async (friendshipId: string) => {
    await acceptRequestMutation.mutateAsync(friendshipId);
    toast.success("Đã chấp nhận lời mời.");
  };

  const handleRemove = async (friendshipId: string) => {
    await removeFriendshipMutation.mutateAsync(friendshipId);
    toast.success("Đã cập nhật danh sách bạn bè.");
  };

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={Users}
        title="Tham gia cộng đồng"
        description="Đăng nhập để xem bảng xếp hạng, kết bạn và theo dõi tiến trình học của nhau."
      />
    );
  }

  return (
    <div className="app-page">
      <header className="app-page-header mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
            <Users size={14} />
            Community
          </div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Cộng đồng học tiếng Trung</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Theo dõi XP, chuỗi ngày học và kết nối với bạn bè cùng luyện tập.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-xl border bg-background p-3 text-center">
          <div className="min-w-18.5">
            <span className="block text-xs font-bold text-muted-foreground">Bạn bè</span>
            <strong className="text-xl text-primary">{friends.length}</strong>
          </div>
          <div className="min-w-18.5">
            <span className="block text-xs font-bold text-muted-foreground">Chờ nhận</span>
            <strong className="text-xl text-tone-3">{received.length}</strong>
          </div>
          <div className="min-w-18.5">
            <span className="block text-xs font-bold text-muted-foreground">Đã gửi</span>
            <strong className="text-xl text-jade">{sent.length}</strong>
          </div>
        </div>
      </header>

      <div className="app-surface mb-5 grid grid-cols-2 gap-2 p-1 sm:max-w-md">
        <SegmentButton active={tab === "leaderboard"} onClick={() => setTab("leaderboard")}>
          <Trophy size={16} />
          Bảng xếp hạng
        </SegmentButton>
        <SegmentButton active={tab === "friends"} onClick={() => setTab("friends")}>
          <Users size={16} />
          Bạn bè
        </SegmentButton>
      </div>

      {tab === "leaderboard" ? (
        <section className="app-surface overflow-hidden">
          <div className="flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-extrabold">Bảng xếp hạng XP</h2>
              <p className="text-xs text-muted-foreground">Top 50 theo XP tích lũy trong phạm vi đã chọn.</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-[220px_190px]">
              <div className="grid grid-cols-2 gap-1 rounded-xl border bg-background p-1">
                <SegmentButton active={scope === "global"} onClick={() => setScope("global")}>
                  <Globe2 size={15} />
                  Global
                </SegmentButton>
                <SegmentButton active={scope === "friends"} onClick={() => setScope("friends")}>
                  <Users size={15} />
                  Friends
                </SegmentButton>
              </div>
              <div className="grid grid-cols-2 gap-1 rounded-xl border bg-background p-1">
                <SegmentButton active={timeframe === "weekly"} onClick={() => setTimeframe("weekly")}>
                  Tuần
                </SegmentButton>
                <SegmentButton active={timeframe === "all-time"} onClick={() => setTimeframe("all-time")}>
                  All-time
                </SegmentButton>
              </div>
            </div>
          </div>

          {leaderboardQuery.isLoading ? (
            <div className="p-4">
              <LoadingCard label="Đang tải bảng xếp hạng..." />
            </div>
          ) : leaderboardQuery.isError ? (
            <div className="p-8 text-center text-sm font-semibold text-muted-foreground">
              Không thể tải bảng xếp hạng lúc này.
            </div>
          ) : entries.length === 0 ? (
            <div className="p-8 text-center text-sm font-semibold text-muted-foreground">
              Chưa có dữ liệu XP trong phạm vi này.
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
              <h2 className="text-base font-extrabold">Bạn bè</h2>
              <p className="text-xs text-muted-foreground">Những người đã chấp nhận kết nối với bạn.</p>
            </div>
            {friendsQuery.isLoading ? (
              <div className="p-4">
                <LoadingCard label="Đang tải danh sách bạn bè..." />
              </div>
            ) : friends.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-muted-foreground">
                Bạn chưa có kết nối nào.
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
              <h2 className="mb-3 text-base font-extrabold">Tìm bạn học</h2>
              <form onSubmit={handleSendRequest} className="grid gap-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    placeholder="Email hoặc mã user"
                    className="pl-9"
                  />
                </div>
                <Button type="submit" disabled={sendRequestMutation.isPending} className="w-full">
                  <UserPlus size={16} />
                  {sendRequestMutation.isPending ? "Đang gửi..." : "Gửi lời mời"}
                </Button>
              </form>
            </section>

            <section className="app-surface overflow-hidden">
              <div className="border-b p-3">
                <h2 className="text-base font-extrabold">Lời mời đang chờ</h2>
                <p className="text-xs text-muted-foreground">
                  {received.length} chờ bạn phản hồi, {sent.length} đã gửi.
                </p>
              </div>

              {received.length > 0 && (
                <div>
                  <div className="border-b bg-secondary/60 px-3 py-2 text-xs font-extrabold text-muted-foreground">
                    Chờ phản hồi
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
                    Đã gửi
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
                  Không có lời mời đang chờ.
                </div>
              )}
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
