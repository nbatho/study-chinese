import { Avatar as BaseAvatar } from "../../../components/ui/avatar";
import { cn } from "../../../utils/cn";

export default function Avatar({ avatar, name, className }: { avatar?: string; name: string; className?: string }) {
    return <BaseAvatar avatar={avatar} name={name} className={cn("size-11 rounded-xl text-xl", className)} />;
}
