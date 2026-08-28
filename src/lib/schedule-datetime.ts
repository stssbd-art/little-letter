/** Format a Date for `<input type="datetime-local" />`. */
export function toDatetimeLocalValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Sensible default: tomorrow at 9:00 local time. */
export function defaultScheduleValue() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(9, 0, 0, 0);
  return toDatetimeLocalValue(date);
}

export function minScheduleValue(minutesAhead = 5) {
  return toDatetimeLocalValue(new Date(Date.now() + minutesAhead * 60_000));
}

export function maxScheduleValue(daysAhead = 30) {
  return toDatetimeLocalValue(
    new Date(Date.now() + daysAhead * 24 * 60 * 60_000)
  );
}

export function formatScheduledAt(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
