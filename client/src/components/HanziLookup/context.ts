import { createContext, useContext } from "react";

export interface HanziLookupContextValue {
  /** Open the lookup popover for `text`, anchored to the tapped element. */
  open: (text: string, anchor: DOMRect) => void;
  close: () => void;
}

export const HanziLookupContext = createContext<HanziLookupContextValue | null>(null);

export const useHanziLookup = (): HanziLookupContextValue => {
  const ctx = useContext(HanziLookupContext);
  if (!ctx) {
    // No provider mounted (e.g. outside AppLayout) — lookups are a no-op.
    return { open: () => {}, close: () => {} };
  }
  return ctx;
};
