import type { Event } from "#cds-models/AdminService";

// --------------------------------------------------------
// Build a human-readable date range
// e.g. 16-17 September 2026, 16 September - 2 October 2026
// --------------------------------------------------------
const locales = navigator.languages;

const formatter = new Intl.DateTimeFormat(locales, {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatDateRange(start: Date, end: Date) {
  return formatter.formatRange(new Date(start), new Date(end));
}

// ----------------------------------------------------
// Check date for CDS format string before API submission
// "YYYY-MM-DD"
// ----------------------------------------------------
export type CdsDate = NonNullable<Event["startDate"]>;

export function isCdsDate(value: string): value is CdsDate {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
