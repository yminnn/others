from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from werkzeug.security import generate_password_hash

from services import score_keyword, recommendation, utc_now_iso

DB_PATH = Path(__file__).resolve().parent / "data" / "opportunity_radar.db"
SCHEMA_PATH = Path(__file__).resolve().parent / "schema.sql"


def seed(conn: sqlite3.Connection) -> None:
    now = utc_now_iso()
    conn.execute("DELETE FROM alerts")
    conn.execute("DELETE FROM saved_keywords")
    conn.execute("DELETE FROM product_recommendations")
    conn.execute("DELETE FROM source_events")
    conn.execute("DELETE FROM keyword_metrics")
    conn.execute("DELETE FROM keyword_variants")
    conn.execute("DELETE FROM keywords")
    conn.execute("DELETE FROM keyword_clusters")
    conn.execute("DELETE FROM ingestion_runs")

    conn.execute(
        """
        INSERT INTO users(email, password_hash, name, created_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET password_hash=excluded.password_hash, name=excluded.name
        """,
        ("founder@opportunityradar.dev", generate_password_hash("ChangeMe123!", method="pbkdf2:sha256"), "Demo Founder", now),
    )
    user_id = conn.execute("SELECT id FROM users WHERE email=?", ("founder@opportunityradar.dev",)).fetchone()[0]

    seed_keywords = [
        ("ai-meeting-notes", "ai meeting notes", "PRODUCTIVITY", "PROBLEM_AWARE", "STEADY_GROWTH", "MEDIUM", "SAAS", "US", "Automated summaries and follow-ups for calls.", 82, 78, 54, 83, 81, 22.4, 48.7, 12800, 42, 3, 18, "meeting-automation", "meeting automation", "Workflow automation for calls and execution."),
        ("ugc-ads-library", "ugc ads library", "MARKETING", "COMMERCIAL", "BREAKOUT", "LOW", "SAAS", "US", "Searchable inspiration for high-performing UGC ads.", 88, 72, 36, 76, 84, 31.8, 69.2, 7600, 28, 3, 11, "creative-intelligence", "creative intelligence", "Creative intelligence for growth teams."),
        ("soc2-agent", "soc2 agent", "DEVELOPER_TOOLS", "TRANSACTIONAL", "BREAKOUT", "MEDIUM", "SAAS", "US", "Compliance automation for startups and SMB SaaS.", 86, 80, 58, 91, 85, 27.5, 58.9, 5200, 36, 3, 13, "compliance-automation", "compliance automation", "Security and compliance workflow automation."),
    ]

    for row in seed_keywords:
        (
            slug, canonical, category, intent, trend_type, competition, product_type, region, description,
            trend, demand, comp, money, opp, g30, g90, volume, validation, source_count, long_tail,
            cluster_slug, cluster_canonical, cluster_summary,
        ) = row
        conn.execute(
            "INSERT OR IGNORE INTO keyword_clusters(slug, canonical_keyword, summary) VALUES(?,?,?)",
            (cluster_slug, cluster_canonical, cluster_summary),
        )
        cluster_id = conn.execute("SELECT id FROM keyword_clusters WHERE slug=?", (cluster_slug,)).fetchone()[0]
        conn.execute(
            """
            INSERT INTO keywords(
              slug, canonical_keyword, category, intent, trend_type, competition_level, product_type,
              region, language, description, trend_score, demand_score, competition_score,
              monetization_score, opportunity_score, growth_30d, growth_90d, search_volume_estimate,
              validation_count, source_count, long_tail_count, cluster_id
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """,
            (slug, canonical, category, intent, trend_type, competition, product_type,
             region, "en", description, trend, demand, comp, money, opp, g30, g90,
             volume, validation, source_count, long_tail, cluster_id),
        )
        keyword_id = conn.execute("SELECT id FROM keywords WHERE slug=?", (slug,)).fetchone()[0]

        variants = [
            (keyword_id, canonical, canonical, "GOOGLE_TRENDS"),
            (keyword_id, f"{canonical} app", canonical, "REDDIT"),
        ]
        conn.executemany(
            "INSERT INTO keyword_variants(keyword_id, variant, normalized, source_platform) VALUES (?,?,?,?)",
            variants,
        )

        metrics = []
        for i, factor in enumerate([0.8, 0.88, 0.94, 0.98, 1.0]):
            m = score_keyword(trend * factor, int(volume * factor), int(validation * factor), comp / 10, money / 14, 3, g30 * factor)
            metrics.append((keyword_id, utc_now_iso(), m["trend"], m["demand"], m["competition"], m["monetization"], m["opportunity"], g30 * factor, int(volume * factor)))
        conn.executemany(
            """
            INSERT INTO keyword_metrics(keyword_id, captured_at, trend_score, demand_score, competition_score,
            monetization_score, opportunity_score, growth_rate, search_volume)
            VALUES (?,?,?,?,?,?,?,?,?)
            """,
            metrics,
        )

        rec = recommendation(canonical, category, intent, competition, opp)
        conn.execute(
            """
            INSERT INTO product_recommendations(keyword_id, headline, target_users, mvp_features,
            monetization_model, risks, differentiation)
            VALUES (?,?,?,?,?,?,?)
            """,
            (
                keyword_id,
                rec["headline"],
                json.dumps(rec["target_users"], ensure_ascii=False),
                json.dumps(rec["mvp_features"], ensure_ascii=False),
                json.dumps(rec["monetization_model"], ensure_ascii=False),
                json.dumps(rec["risks"], ensure_ascii=False),
                rec["differentiation"],
            ),
        )

        conn.execute(
            "INSERT INTO saved_keywords(user_id, keyword_id, created_at) VALUES (?,?,?)",
            (user_id, keyword_id, now),
        )

    conn.execute(
        "INSERT INTO alerts(user_id, title, message, severity, created_at) VALUES (?,?,?,?,?)",
        (user_id, "Breakout trend", "UGC ads library crossed opportunity score 80.", "INFO", now),
    )
    conn.execute(
        "INSERT INTO alerts(user_id, title, message, severity, created_at) VALUES (?,?,?,?,?)",
        (user_id, "Competition watch", "AI meeting notes competition has moved to medium.", "WARNING", now),
    )
    conn.execute(
        "INSERT INTO ingestion_runs(source_platform, status, records_collected, records_accepted, started_at, finished_at, metadata_json) VALUES (?,?,?,?,?,?,?)",
        ("MANUAL", "SUCCESS", 6, 6, now, now, json.dumps({"seed": True})),
    )


def main() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    schema = SCHEMA_PATH.read_text(encoding="utf-8")
    conn.executescript(schema)
    seed(conn)
    conn.commit()
    conn.close()
    print(f"Database initialized at {DB_PATH}")
    print("Demo login: founder@opportunityradar.dev / ChangeMe123!")


if __name__ == "__main__":
    main()
