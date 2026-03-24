from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Iterable


@dataclass
class RawKeywordRecord:
    keyword: str
    source: str
    region: str
    raw_score: float


def normalize_keyword(text: str) -> str:
    cleaned = "".join(ch.lower() if ch.isalnum() or ch in " -" else " " for ch in text)
    return " ".join(cleaned.split())


def canonical_keyword(text: str) -> str:
    stop_words = {"the", "for", "and", "app", "tool"}
    tokens = [t for t in normalize_keyword(text).split() if t not in stop_words]
    return " ".join(sorted(tokens)) if tokens else normalize_keyword(text)


def cluster_key(text: str) -> str:
    return "-".join(canonical_keyword(text).split()[:3])


def dedupe(records: Iterable[RawKeywordRecord]) -> list[RawKeywordRecord]:
    best: dict[str, RawKeywordRecord] = {}
    for record in records:
        norm = normalize_keyword(record.keyword)
        prev = best.get(norm)
        if prev is None or prev.raw_score < record.raw_score:
            best[norm] = record
    return list(best.values())


def score_keyword(raw_trend: float, search_volume: int, validation_count: int, competition_signals: float, pricing_power: float, source_diversity: int, growth_rate_30d: float) -> dict[str, float]:
    def clamp(v: float) -> float:
        return max(0.0, min(100.0, v))

    trend = clamp(raw_trend * 0.55 + growth_rate_30d * 1.2 + source_diversity * 6)
    demand = clamp(search_volume / 180 + validation_count * 1.6 + source_diversity * 4)
    competition = clamp(competition_signals * 10)
    monetization = clamp(pricing_power * 14 + validation_count * 0.7)
    opportunity = clamp(trend * 0.30 + demand * 0.30 + (100 - competition) * 0.15 + monetization * 0.25)

    return {
        "trend": round(trend, 2),
        "demand": round(demand, 2),
        "competition": round(competition, 2),
        "monetization": round(monetization, 2),
        "opportunity": round(opportunity, 2),
    }


def recommendation(keyword: str, category: str, intent: str, competition_level: str, opportunity_score: float) -> dict[str, object]:
    if category == "DEVELOPER_TOOLS" or intent == "TRANSACTIONAL":
        product_type = "SAAS"
    elif category == "MARKETING" and competition_level == "LOW":
        product_type = "SAAS"
    elif category == "COMMUNITY":
        product_type = "COMMUNITY"
    else:
        product_type = "SAAS" if opportunity_score > 75 else "MOBILE_APP"

    return {
        "product_type": product_type,
        "headline": f"Build a focused {product_type.lower()} product around '{keyword}'.",
        "target_users": ["Indie hackers", "Founders", "Product operators"],
        "mvp_features": ["Signal dashboard", "Saved opportunities", "Weekly trend digest", "Simple team sharing"],
        "monetization_model": ["Monthly subscription", "Team plan"],
        "risks": ["Trend decay risk", "Data source quality"],
        "differentiation": "Focus on actionable build recommendations, not vanity trend charts.",
    }


class GoogleTrendsCollector:
    source = "GOOGLE_TRENDS"

    def collect(self) -> list[RawKeywordRecord]:
        return [
            RawKeywordRecord("AI meeting notes", self.source, "US", 82),
            RawKeywordRecord("SOC2 agent", self.source, "US", 79),
        ]


class RedditCollector:
    source = "REDDIT"

    def collect(self) -> list[RawKeywordRecord]:
        return [
            RawKeywordRecord("UGC ads library", self.source, "US", 77),
            RawKeywordRecord("AI compliance agent", self.source, "US", 74),
        ]


class ProductHuntCollector:
    source = "PRODUCT_HUNT"

    def collect(self) -> list[RawKeywordRecord]:
        return [
            RawKeywordRecord("meeting summary tool", self.source, "US", 75),
            RawKeywordRecord("creative swipe file", self.source, "US", 71),
        ]


def run_ingestion_preview() -> list[dict[str, object]]:
    collectors = [GoogleTrendsCollector(), RedditCollector(), ProductHuntCollector()]
    raw = [item for collector in collectors for item in collector.collect()]
    rows = []
    for item in dedupe(raw):
        scores = score_keyword(
            raw_trend=item.raw_score,
            search_volume=4000 + int(item.raw_score * 100),
            validation_count=int(item.raw_score / 3),
            competition_signals=max(2, round(item.raw_score / 14)),
            pricing_power=max(3, round(item.raw_score / 18)),
            source_diversity=3,
            growth_rate_30d=item.raw_score / 3,
        )
        rec = recommendation(item.keyword, "MARKETING", "COMMERCIAL", "LOW", scores["opportunity"])
        rows.append(
            {
                "keyword": item.keyword,
                "normalized": normalize_keyword(item.keyword),
                "canonical": canonical_keyword(item.keyword),
                "cluster": cluster_key(item.keyword),
                "scores": scores,
                "recommendation": rec,
            }
        )
    return rows


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()
