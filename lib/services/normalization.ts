export type RawKeywordRecord = {
  keyword: string;
  source: string;
  region: string;
  rawScore: number;
};

export type NormalizedKeywordRecord = RawKeywordRecord & {
  normalized: string;
  canonicalKeyword: string;
  clusterKey: string;
};

const stopWords = new Set(["the", "for", "and", "app", "tool"]);

export function normalizeKeywordPhrase(keyword: string) {
  return keyword.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, " ");
}

export function canonicalizeKeyword(keyword: string) {
  const normalized = normalizeKeywordPhrase(keyword);
  const tokens = normalized
    .split(" ")
    .filter(Boolean)
    .filter((token) => !stopWords.has(token))
    .sort();

  return tokens.join(" ") || normalized;
}

export function clusterKey(keyword: string) {
  return canonicalizeKeyword(keyword)
    .split(" ")
    .slice(0, 3)
    .join("-");
}

export function normalizeKeywordRecords(records: RawKeywordRecord[]): NormalizedKeywordRecord[] {
  return records.map((record) => ({
    ...record,
    normalized: normalizeKeywordPhrase(record.keyword),
    canonicalKeyword: canonicalizeKeyword(record.keyword),
    clusterKey: clusterKey(record.keyword),
  }));
}

export function dedupeKeywordRecords(records: NormalizedKeywordRecord[]) {
  const deduped = new Map<string, NormalizedKeywordRecord>();

  for (const record of records) {
    const existing = deduped.get(record.normalized);
    if (!existing || existing.rawScore < record.rawScore) {
      deduped.set(record.normalized, record);
    }
  }

  return [...deduped.values()];
}

export function clusterKeywordRecords(records: NormalizedKeywordRecord[]) {
  return records.reduce<Record<string, NormalizedKeywordRecord[]>>((acc, record) => {
    acc[record.clusterKey] ??= [];
    acc[record.clusterKey].push(record);
    return acc;
  }, {});
}
