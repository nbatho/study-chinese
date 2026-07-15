import { Fragment, type ElementType, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { useHanziLookup } from "./context";

// Matches a single CJK ideograph (the characters worth looking up).
const HAN_CHAR = /[㐀-鿿豈-﫿]/;

interface HanziTextProps {
  children: string | null | undefined;
  /** Element to render as the wrapper. Defaults to a span. */
  as?: ElementType;
  className?: string;
}

/**
 * Renders Chinese text where every Han character is tappable, opening the global
 * lookup popover (pinyin + Sino-Vietnamese reading + meaning + audio + save). Any
 * non-Han text (punctuation, latin, spaces) renders inertly.
 */
export default function HanziText({ children, as, className }: HanziTextProps) {
  const { open } = useHanziLookup();
  const Wrapper: ElementType = as ?? "span";
  const text = children ?? "";

  if (!text) {
    return null;
  }

  const nodes: ReactNode[] = [];
  let buffer = "";
  const flushBuffer = (key: string) => {
    if (buffer) {
      nodes.push(<Fragment key={`t-${key}`}>{buffer}</Fragment>);
      buffer = "";
    }
  };

  [...text].forEach((char, index) => {
    if (HAN_CHAR.test(char)) {
      flushBuffer(`b-${index}`);
      nodes.push(
        <span
          key={`h-${index}`}
          role="button"
          tabIndex={0}
          onClick={(event) => {
            event.stopPropagation();
            open(char, event.currentTarget.getBoundingClientRect());
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.stopPropagation();
              open(char, event.currentTarget.getBoundingClientRect());
            }
          }}
          className="cursor-pointer rounded-[3px] transition-colors hover:bg-primary/15 hover:text-primary focus:bg-primary/15 focus:text-primary focus:outline-none"
        >
          {char}
        </span>,
      );
    } else {
      buffer += char;
    }
  });
  flushBuffer("end");

  return <Wrapper className={cn(className)}>{nodes}</Wrapper>;
}
