import type { Event, Timeslot } from "#cds-models/AdminService";

export type CdsDate = NonNullable<Event["startDate"]>;
export type CdsTime = NonNullable<Timeslot["startTime"]>;

// ----------------------------------------------------------
// Build a human-readable date range or date following locale
// e.g. 16-17 September 2026, 16 September - 2 October 2026
// ----------------------------------------------------------
const locales = navigator.languages;

const formatter = new Intl.DateTimeFormat(locales, {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function toLocalDate(date: CdsDate) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(date: CdsDate) {
  return formatter.format(toLocalDate(date));
}

export function formatDateRange(start: CdsDate, end: CdsDate) {
  return formatter.formatRange(toLocalDate(start), toLocalDate(end));
}

// ------------------------------------------------------
// Check date for CDS format string before API submission
// "YYYY-MM-DD"
// ------------------------------------------------------

export function isCdsDate(value: string): value is CdsDate {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

// ------------------------------------------------------
// Check time for CDS format string before API submission
// "HH:mm:ss"
// ------------------------------------------------------

export function isCdsTime(value: string): value is CdsTime {
  return /^\d{2}:\d{2}:\d{2}$/.test(value);
}
