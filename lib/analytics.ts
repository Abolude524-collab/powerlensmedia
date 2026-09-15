export const ANALYTICS_EVENTS = [
  "gallery_open",
  "contact_click",
  "whatsapp_click",
  "social_click",
  "contact_form_submit",
  "calendly_open",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

export function trackEvent(eventName: AnalyticsEventName, target?: string) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({ eventName, target: target?.slice(0, 120) });
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}