import { cn } from "../../../utils/cn";
export default function Avatar({ avatar, name, className }: { avatar?: string; name: string; className?: string }) {
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
