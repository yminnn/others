export function formatScore(value: number | string) {
  const numeric = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(numeric) ? numeric.toFixed(0) : "0";
}

export function formatPercent(value: number | string) {
  const numeric = typeof value === "string" ? Number(value) : value;
  return `${numeric >= 0 ? "+" : ""}${numeric.toFixed(1)}%`;
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function titleize(value: string) {
  return value
    .toLowerCase()
    .split(/[_\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
