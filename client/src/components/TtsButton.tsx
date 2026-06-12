import type { ComponentProps } from "react";
import { Volume2 } from "lucide-react";
import { cn } from "../utils/cn";
import { speakChinese } from "../utils/tts";

interface TtsButtonProps extends Omit<ComponentProps<"button">, "onClick"> {
  text: string;
  lang?: string;
  iconSize?: number;
}

export default function TtsButton({
  text,
  lang,
  iconSize = 16,
  className,
  children,
  type = "button",
  ...props
}: TtsButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border bg-secondary px-4 py-2 text-[0.85rem] font-semibold text-secondary-foreground transition hover:bg-accent",
        className,
      )}
      onClick={() => speakChinese(text, lang)}
      {...props}
    >
      <Volume2 size={iconSize} />
      {children}
    </button>
  );
}
