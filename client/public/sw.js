// Study reminder service worker. The page posts SCHEDULE_REMINDER with the next
// fire timestamp; we hold a timer and show a notification when it elapses.
// Browsers may stop an idle worker, so this is best-effort — the page keeps its
// own interval as fallback while the app is open.

let reminderTimer = null;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

const clearReminder = () => {
  if (reminderTimer !== null) {
    clearTimeout(reminderTimer);
    reminderTimer = null;
  }
};

self.addEventListener("message", (event) => {
  const data = event.data || {};

  if (data.type === "CANCEL_REMINDER") {
    clearReminder();
    return;
  }

  if (data.type !== "SCHEDULE_REMINDER") return;

  clearReminder();

  const delay = Number(data.fireAt) - Date.now();
  if (!Number.isFinite(delay) || delay <= 0) return;

  reminderTimer = setTimeout(() => {
    reminderTimer = null;
    self.registration.showNotification(data.title || "Study Chinese", {
      body: data.body || "",
      tag: "study-chinese-reminder",
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      data: { url: data.url || "/learn" },
    });
  }, delay);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/learn";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windows) => {
        for (const client of windows) {
          if ("focus" in client) {
            client.focus();
            if ("navigate" in client) client.navigate(url);
            return;
          }
        }
        return self.clients.openWindow(url);
      })
  );
});
