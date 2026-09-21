const locales = navigator.languages;

export function formatNumber(number: number | null | undefined) {
  if (number == null) return "-";
  return new Intl.NumberFormat(locales, { notation: "compact" }).format(number);
}
