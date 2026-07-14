export default function DashboardAvatar({ avatar, name }: { avatar?: string | null; name: string }) {
  const isImage = Boolean(avatar && /^(https?:|data:image|blob:)/.test(avatar));

  return (
    <span className="flex size-[5.5rem] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/25 bg-white/20 text-6xl font-extrabold shadow-lg backdrop-blur sm:size-[6.5rem]">
      {isImage ? (
        <img src={avatar ?? ""} alt={name} className="size-full object-cover" />
      ) : (
        <span aria-hidden="true">{avatar || "学"}</span>
      )}
    </span>
  );
}