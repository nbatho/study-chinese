import { Avatar } from "../../../components/ui/avatar";

export default function DashboardAvatar({ avatar, name }: { avatar?: string | null; name: string }) {
  return (
    <Avatar
      avatar={avatar}
      name={name}
      fallback="学"
      className="size-22 rounded-2xl border border-white/25 bg-white/20 text-6xl shadow-lg backdrop-blur sm:size-26"
    />
  );
}
