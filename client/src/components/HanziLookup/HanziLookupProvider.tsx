import { useCallback, useMemo, useState, type ReactNode } from "react";
import { HanziLookupContext } from "./context";
import HanziLookupPopover from "./HanziLookupPopover";

interface ActiveLookup {
  text: string;
  anchor: DOMRect;
}

export default function HanziLookupProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ActiveLookup | null>(null);

  const open = useCallback((text: string, anchor: DOMRect) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setActive({ text: trimmed, anchor });
  }, []);

  const close = useCallback(() => setActive(null), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <HanziLookupContext.Provider value={value}>
      {children}
      {active && (
        <HanziLookupPopover
          key={active.text}
          text={active.text}
          anchor={active.anchor}
          onClose={close}
        />
      )}
    </HanziLookupContext.Provider>
  );
}
