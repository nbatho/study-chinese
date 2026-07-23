import { cn } from "../../utils/cn";

const IMAGE_SRC = /^(https?:|data:image|blob:)/;

export function Avatar({
  avatar,
  name,
  fallback,
  className,
}: {
  avatar?: string | null;
  name?: string | null;
  /** Shown when there is neither an image nor an emoji, in place of the name initial. */
  fallback?: string;
  className?: string;
}) {
  const isImage = Boolean(avatar && IMAGE_SRC.test(avatar));
  const initial = name?.trim().slice(0, 1).toUpperCase();

  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary text-lg font-extrabold",
        className,
      )}
    >
      {isImage ? (
        <img src={avatar ?? ""} alt={name ?? ""} className="size-full object-cover" />
      ) : (
        <span aria-hidden="true">{avatar || fallback || initial || "学"}</span>
      )}
    </span>
  );
}

export default Avatar;
