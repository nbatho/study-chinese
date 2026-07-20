import { useEffect } from "react";

// Mobile browsers (iOS Safari and Android Chrome alike) collapse/expand their
// address bar and keyboard as dynamic, animated UI chrome, and `dvh`/`vh`
// units can be read mid-animation or get stuck at a stale value — e.g. right
// after submitting the login form — so a `100dvh` shell ends up shorter than
// the real viewport and the bottom nav gets shoved up with a band of
// background showing below it. Measuring the layout viewport in JS and
// writing it to `--app-height` sidesteps the buggy unit: `window.innerHeight`
// reflects the full viewport, and re-reading it on every resize/
// visualViewport event (plus a few follow-up reads while the chrome
// animation settles) makes the shell self-correct the moment the keyboard
// hides or the toolbar toggles, on either platform.
export function useAppHeight() {
  useEffect(() => {
    const root = document.documentElement;
    const applyHeight = () => {
      root.style.setProperty("--app-height", `${window.innerHeight}px`);
    };

    // A single read on the triggering event can land mid-animation — e.g. the
    // keyboard is still collapsing or Safari's chrome is still re-expanding
    // after login navigates into this shell — and iOS doesn't reliably fire a
    // second resize once things settle. Re-reading a couple more times over
    // the next ~300ms (the length of iOS's UI chrome transitions) catches the
    // final value without depending on an event that may never come.
    const setHeight = () => {
      applyHeight();
      requestAnimationFrame(applyHeight);
      window.setTimeout(applyHeight, 150);
      window.setTimeout(applyHeight, 300);
    };

    setHeight();

    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", setHeight);
    viewport?.addEventListener("scroll", setHeight);
    window.addEventListener("resize", setHeight);
    window.addEventListener("orientationchange", setHeight);
    return () => {
      viewport?.removeEventListener("resize", setHeight);
      viewport?.removeEventListener("scroll", setHeight);
      window.removeEventListener("resize", setHeight);
      window.removeEventListener("orientationchange", setHeight);
    };
  }, []);
}
