import { type ReactNode, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

export type DropdownSelectOption<TValue extends string> = {
  value: TValue;
  label: ReactNode;
  code?: ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
};

type DropdownSelectProps<TValue extends string> = {
  value: TValue;
  options: Array<DropdownSelectOption<TValue>>;
  onChange: (value: TValue) => void;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  align?: "left" | "right";
};

export function DropdownSelect<TValue extends string>({
  value,
  options,
  onChange,
  label,
  icon,
  disabled,
  className,
  buttonClassName,
  menuClassName,
  align = "right",
}: DropdownSelectProps<TValue>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const currentOption = options.find((option) => option.value === value) ?? options[0];
  const currentLabel = currentOption?.ariaLabel ?? (typeof currentOption?.label === "string" ? currentOption.label : value);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        disabled={disabled}
        className={cn(
          "inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border bg-background/70 px-2.5 text-xs font-extrabold text-muted-foreground transition hover:border-primary/30 hover:bg-secondary hover:text-foreground active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60",
          buttonClassName,
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`${label}: ${currentLabel}`}
        title={`${label}: ${currentLabel}`}
      >
        {icon && <span className="flex size-4 shrink-0 items-center justify-center text-primary">{icon}</span>}
        <span className="min-w-0 flex-1 text-left leading-none">
          <span className="mt-1 block truncate text-xs font-extrabold text-foreground">{currentOption?.label}</span>
        </span>
        <ChevronDown size={15} className={cn("shrink-0 text-muted-foreground transition", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className={cn(
            "absolute z-50 mt-2 max-h-[min(18rem,calc(100vh-8rem))] w-48 overflow-y-auto overscroll-contain rounded-2xl border bg-popover p-1.5 text-popover-foreground shadow-xl",
            align === "right" ? "right-0" : "left-0",
            menuClassName,
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <div key={option.value} className={cn("rounded-xl p-1", isSelected && "bg-primary")}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={isSelected}
                  disabled={option.disabled}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-extrabold transition disabled:cursor-not-allowed disabled:opacity-50",
                    isSelected
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {option.code && (
                    <span className={cn("w-7 shrink-0 text-xs", isSelected ? "text-primary-foreground/80" : "text-primary")}>
                      {option.code}
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
