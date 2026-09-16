const locales = navigator.languages;

const formatter = new Intl.DateTimeFormat(locales, {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatDateRange(start: Date, end: Date) {
  return formatter.formatRange(new Date(start), new Date(end));
}
