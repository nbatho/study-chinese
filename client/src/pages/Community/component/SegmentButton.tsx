import type { ReactNode } from "react";
import { cn } from "../../../utils/cn";

export default function SegmentButton({
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