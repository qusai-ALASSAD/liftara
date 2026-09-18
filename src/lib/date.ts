export const DAY_MS = 86_400_000;

/** Montag = 0 … Sonntag = 6 */
export const weekdayIndex = (d: Date | number): number => {
  const day = new Date(d).getDay();
  return (day + 6) % 7;
};

export const startOfDay = (d: Date | number): number => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
};

export const dayKey = (d: Date | number): string => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
};

export const startOfWeek = (d: Date | number): number => startOfDay(new Date(d).getTime() - weekdayIndex(d) * DAY_MS);

export const daysBetween = (a: number, b: number) => Math.round((startOfDay(b) - startOfDay(a)) / DAY_MS);

export const hoursSince = (t: number, now = Date.now()) => (now - t) / 3_600_000;

export function formatDate(ts: number, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric' }).format(ts);
}
export function formatDuration(ms: number) {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
