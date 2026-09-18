import type { Event, Timeslot } from "#cds-models/AdminService";

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

export function formatDateRange(start: Date, end: Date) {
  return formatter.formatRange(new Date(start), new Date(end));
}

export function formatDate(date: Date) {
  return formatter.format(new Date(date));
}

// ------------------------------------------------------
// Check date for CDS format string before API submission
// "YYYY-MM-DD"
// ------------------------------------------------------
export type CdsDate = NonNullable<Event["startDate"]>;

export function isCdsDate(value: string): value is CdsDate {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

// ------------------------------------------------------
// Check time for CDS format string before API submission
// "HH:mm:ss"
// ------------------------------------------------------
export type CdsTime = NonNullable<Timeslot["startTime"]>;

export function isCdsTime(value: string): value is CdsTime {
  return /^\d{2}:\d{2}:\d{2}$/.test(value);
}
