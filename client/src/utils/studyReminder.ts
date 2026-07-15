// Client-side daily study reminder. Uses the Web Notifications API with two layers:
// an in-page interval while the app is open, plus a best-effort service worker
// timer that can outlive the tab. Preferences persist in localStorage.

export interface ReminderPrefs {
  enabled: boolean;
  /** Local time "HH:MM" the learner wants to be reminded. */
  time: string;
  /** Days of week the reminder is active (0=Sunday ... 6=Saturday). */
  days: number[];
}

const PREFS_KEY = "study_chinese_reminder_prefs_v1";
const LAST_NOTIFIED_KEY = "study_chinese_reminder_last_notified";

export const ALL_REMINDER_DAYS = [0, 1, 2, 3, 4, 5, 6];

export const DEFAULT_REMINDER_PREFS: ReminderPrefs = {
  enabled: false,
  time: "19:00",
  days: [...ALL_REMINDER_DAYS],
};

const isValidTime = (value: unknown): value is string =>
  typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

const sanitizeDays = (value: unknown): number[] => {
  if (!Array.isArray(value)) return [...ALL_REMINDER_DAYS];
  const days = [...new Set(value.filter((day) => Number.isInteger(day) && day >= 0 && day <= 6))] as number[];
  return days.length > 0 ? days.sort((a, b) => a - b) : [...ALL_REMINDER_DAYS];
};

export function loadReminderPrefs(): ReminderPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { ...DEFAULT_REMINDER_PREFS, days: [...ALL_REMINDER_DAYS] };
    const parsed = JSON.parse(raw) as Partial<ReminderPrefs>;
    return {
      enabled: Boolean(parsed.enabled),
      time: isValidTime(parsed.time) ? parsed.time : DEFAULT_REMINDER_PREFS.time,
      days: sanitizeDays(parsed.days),
    };
  } catch {
    return { ...DEFAULT_REMINDER_PREFS, days: [...ALL_REMINDER_DAYS] };
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

export function isReminderDay(prefs: ReminderPrefs, date = new Date()): boolean {
  return prefs.days.includes(date.getDay());
}

/**
 * Next timestamp (ms) the reminder should fire, or null when disabled.
 * Skips today when its slot already passed or the learner was already notified.
 */
export function nextReminderTimestamp(prefs: ReminderPrefs, from = new Date()): number | null {
  if (!prefs.enabled || prefs.days.length === 0) return null;

  const [hours, minutes] = prefs.time.split(":").map(Number);

  for (let offset = 0; offset < 8; offset += 1) {
    const candidate = new Date(from.getFullYear(), from.getMonth(), from.getDate() + offset, hours, minutes, 0, 0);
    if (!prefs.days.includes(candidate.getDay())) continue;
    if (candidate.getTime() <= from.getTime()) continue;
    if (offset === 0 && wasNotifiedToday()) continue;
    return candidate.getTime();
  }

  return null;
}

// --- Service worker layer (best-effort background reminders) ---

export interface ReminderCopy {
  title: string;
  body: string;
  url: string;
}

export function reminderSWSupported(): boolean {
  return typeof navigator !== "undefined" && "serviceWorker" in navigator && notificationsSupported();
}

export async function registerReminderSW(): Promise<ServiceWorkerRegistration | null> {
  if (!reminderSWSupported()) return null;
  try {
    return await navigator.serviceWorker.register("/sw.js");
  } catch {
    return null;
  }
}

/** Pushes the current schedule to the service worker (or cancels it). */
export async function syncReminderToSW(prefs: ReminderPrefs, copy: ReminderCopy): Promise<void> {
  if (!reminderSWSupported()) return;

  try {
    const registration = (await navigator.serviceWorker.getRegistration("/sw.js")) ?? (await registerReminderSW());
    const worker = registration?.active ?? registration?.waiting ?? registration?.installing;
    if (!worker) return;

    const fireAt = getNotificationPermission() === "granted" ? nextReminderTimestamp(prefs) : null;

    if (fireAt === null) {
      worker.postMessage({ type: "CANCEL_REMINDER" });
      return;
    }

    worker.postMessage({
      type: "SCHEDULE_REMINDER",
      fireAt,
      title: copy.title,
      body: copy.body,
      url: copy.url,
    });
  } catch {
    // best-effort only
  }
}
