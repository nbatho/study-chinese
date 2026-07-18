import { useEffect } from "react";

// iOS Safari leaves `dvh`/`vh` units stuck at a stale value after the on-screen
// keyboard dismisses — e.g. right after submitting the login form — so a
// `100dvh` shell ends up shorter than the real viewport and the bottom nav gets
// shoved up with a band of background showing below it. Measuring the layout
// viewport in JS and writing it to `--app-height` sidesteps the buggy unit:
// `window.innerHeight` reflects the full viewport (it ignores the keyboard
// overlay), and re-reading it on every resize/visualViewport event makes the
// shell self-correct the moment the keyboard hides or the toolbar toggles.
export function useAppHeight() {
  useEffect(() => {
    const root = document.documentElement;
    const setHeight = () => {
      root.style.setProperty("--app-height", `${window.innerHeight}px`);
    };

    setHeight();

    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", setHeight);
    window.addEventListener("resize", setHeight);
    window.addEventListener("orientationchange", setHeight);
    return () => {
      viewport?.removeEventListener("resize", setHeight);
      window.removeEventListener("resize", setHeight);
      window.removeEventListener("orientationchange", setHeight);
    };
  }, []);
}
