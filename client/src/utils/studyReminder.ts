// Client-side daily study reminder. Uses the Web Notifications API and fires
// while the app is open (no backend / service worker push infrastructure yet),
// with an in-app toast fallback. Preferences persist in localStorage.

export interface ReminderPrefs {
  enabled: boolean;
  /** Local time "HH:MM" the learner wants to be reminded. */
  time: string;
}

const PREFS_KEY = "study_chinese_reminder_prefs_v1";
const LAST_NOTIFIED_KEY = "study_chinese_reminder_last_notified";

export const DEFAULT_REMINDER_PREFS: ReminderPrefs = { enabled: false, time: "19:00" };

const isValidTime = (value: unknown): value is string =>
  typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

export function loadReminderPrefs(): ReminderPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { ...DEFAULT_REMINDER_PREFS };
    const parsed = JSON.parse(raw) as Partial<ReminderPrefs>;
    return {
      enabled: Boolean(parsed.enabled),
      time: isValidTime(parsed.time) ? parsed.time : DEFAULT_REMINDER_PREFS.time,
    };
  } catch {
    return { ...DEFAULT_REMINDER_PREFS };
  }
}

export function saveReminderPrefs(prefs: ReminderPrefs): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // best-effort only
  }
}

/** Local calendar day key, e.g. "2026-07-12". */
export function todayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function notificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!notificationsSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (!notificationsSupported()) return "unsupported";
  if (Notification.permission !== "default") return Notification.permission;
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

/** True once per calendar day, after which the reminder for that day is suppressed. */
export function wasNotifiedToday(): boolean {
  try {
    return localStorage.getItem(LAST_NOTIFIED_KEY) === todayKey();
  } catch {
    return false;
  }
}

export function markNotifiedToday(): void {
  try {
    localStorage.setItem(LAST_NOTIFIED_KEY, todayKey());
  } catch {
    // best-effort only
  }
}

/** Minutes since local midnight for an "HH:MM" string. */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function currentMinutes(date = new Date()): number {
  return date.getHours() * 60 + date.getMinutes();
}
