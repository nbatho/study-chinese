import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  currentMinutes,
  getNotificationPermission,
  isReminderDay,
  loadReminderPrefs,
  markNotifiedToday,
  registerReminderSW,
  syncReminderToSW,
  timeToMinutes,
  wasNotifiedToday,
} from "../utils/studyReminder";

interface UseStudyReminderOptions {
  /** Whether the learner already studied today; if true the reminder is skipped. */
  studiedToday: boolean;
  /** Localized notification copy. */
  title: string;
  body: string;
  /** Route to open when the learner acts on the reminder. */
  href?: string;
}

const CHECK_INTERVAL_MS = 60_000;

/**
 * Fires a once-per-day study reminder while the app is open. Preferences are read
 * fresh from localStorage on every tick, so changes in Settings apply immediately.
 */
export function useStudyReminder({ studiedToday, title, body, href = "/learn" }: UseStudyReminderOptions) {
  const navigate = useNavigate();
  // Keep the latest values without re-arming the interval each render.
  const stateRef = useRef({ studiedToday, title, body, href });

  useEffect(() => {
    stateRef.current = { studiedToday, title, body, href };
  }, [studiedToday, title, body, href]);

  useEffect(() => {
    const check = () => {
      const { studiedToday: studied, title: notifTitle, body: notifBody, href: target } = stateRef.current;
      const prefs = loadReminderPrefs();

      if (!prefs.enabled || studied || wasNotifiedToday()) return;
      if (!isReminderDay(prefs)) return;
      if (currentMinutes() < timeToMinutes(prefs.time)) return;

      markNotifiedToday();

      const permission = getNotificationPermission();
      if (permission === "granted") {
        try {
          const notification = new Notification(notifTitle, { body: notifBody, tag: "study-chinese-reminder" });
          notification.onclick = () => {
            window.focus();
            navigate(target);
            notification.close();
          };
          return;
        } catch {
          // fall through to the in-app toast
        }
      }

      toast(notifTitle, {
        description: notifBody,
        action: { label: "▶️", onClick: () => navigate(target) },
        duration: 10_000,
      });
    };

    check();
    const timer = window.setInterval(check, CHECK_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [navigate]);

  // Keep the service worker schedule in sync so the reminder can fire after the
  // tab is closed (best-effort; the interval above covers the app-open case).
  useEffect(() => {
    const prefs = loadReminderPrefs();
    if (!prefs.enabled) return;

    let cancelled = false;
    registerReminderSW().then(() => {
      if (cancelled) return;
      const { title: notifTitle, body: notifBody, href: target } = stateRef.current;
      void syncReminderToSW(prefs, { title: notifTitle, body: notifBody, url: target });
    });

    return () => {
      cancelled = true;
    };
  }, [title, body, href]);
}
