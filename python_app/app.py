from __future__ import annotations

import json
import sqlite3
from functools import wraps
from pathlib import Path

from flask import Flask, g, redirect, render_template, request, session, url_for, jsonify
from werkzeug.security import check_password_hash, generate_password_hash

from services import run_ingestion_preview, utc_now_iso

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "data" / "opportunity_radar.db"

app = Flask(__name__)
app.config["SECRET_KEY"] = "dev-secret-change-in-production"

DEMO_EMAIL = "founder@opportunityradar.dev"
DEMO_PASSWORD = "ChangeMe123!"
DEMO_NAME = "Demo Founder"


def get_db() -> sqlite3.Connection:
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(_error: Exception | None) -> None:
    db = g.pop("db", None)
    if db is not None:
        db.close()


def login_required(view):
    @wraps(view)
    def wrapped(**kwargs):
        if not session.get("user_id"):
            return redirect(url_for("login"))
        return view(**kwargs)

    return wrapped


def ensure_demo_user(db: sqlite3.Connection) -> sqlite3.Row:
    now = utc_now_iso()
    db.execute(
        """
        INSERT INTO users(email, password_hash, name, created_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET password_hash=excluded.password_hash, name=excluded.name
        """,
        (DEMO_EMAIL, generate_password_hash(DEMO_PASSWORD), DEMO_NAME, now),
    )
    db.commit()
    return db.execute("SELECT * FROM users WHERE email=?", (DEMO_EMAIL,)).fetchone()


def rows_to_dicts(rows: list[sqlite3.Row]) -> list[dict[str, object]]:
    return [dict(row) for row in rows]


@app.route("/")
def index():
    return redirect(url_for("dashboard"))


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        db = get_db()
        user = db.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
        if not user and email == DEMO_EMAIL and password == DEMO_PASSWORD:
            user = ensure_demo_user(db)
        if user and check_password_hash(user["password_hash"], password):
            session["user_id"] = user["id"]
            session["user_name"] = user["name"]
            return redirect(url_for("dashboard"))
        return render_template(
            "login.html",
            error=f"账号或密码错误。请使用 Demo 账号 {DEMO_EMAIL} / {DEMO_PASSWORD}，或先运行 python init_db.py。",
        )
    return render_template("login.html", error=None)


@app.route("/logout", methods=["POST"])
@login_required
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.route("/dashboard")
@login_required
def dashboard():
    db = get_db()
    kpis = {
        "keyword_count": db.execute("SELECT COUNT(*) c FROM keywords").fetchone()["c"],
        "avg_opportunity": db.execute("SELECT ROUND(AVG(opportunity_score),1) v FROM keywords").fetchone()["v"],
        "saved_count": db.execute("SELECT COUNT(*) c FROM saved_keywords WHERE user_id=?", (session["user_id"],)).fetchone()["c"],
        "total_volume": db.execute("SELECT SUM(search_volume_estimate) v FROM keywords").fetchone()["v"],
    }
    recent = db.execute("SELECT * FROM keywords ORDER BY id DESC LIMIT 5").fetchall()
    low_comp = db.execute("SELECT * FROM keywords WHERE competition_level='LOW' ORDER BY opportunity_score DESC LIMIT 5").fetchall()
    alerts = db.execute("SELECT * FROM alerts WHERE user_id=? ORDER BY id DESC LIMIT 5", (session["user_id"],)).fetchall()
    chart_rows = db.execute(
        "SELECT substr(captured_at,1,10) d, ROUND(AVG(opportunity_score),1) o, ROUND(AVG(trend_score),1) t FROM keyword_metrics GROUP BY substr(captured_at,1,10) ORDER BY d"
    ).fetchall()
    return render_template(
        "dashboard.html",
        kpis=kpis,
        recent=recent,
        low_comp=low_comp,
        alerts=alerts,
        chart_rows=rows_to_dicts(chart_rows),
    )


@app.route("/keywords")
@login_required
def keywords():
    db = get_db()
    search = request.args.get("search", "").strip().lower()
    category = request.args.get("category", "ALL")
    intent = request.args.get("intent", "ALL")
    competition = request.args.get("competition", "ALL")
    sort = request.args.get("sort", "opportunity")

    where = ["1=1"]
    params: list[object] = []
    if search:
        where.append("LOWER(canonical_keyword) LIKE ?")
        params.append(f"%{search}%")
    if category != "ALL":
        where.append("category=?")
        params.append(category)
    if intent != "ALL":
        where.append("intent=?")
        params.append(intent)
    if competition != "ALL":
        where.append("competition_level=?")
        params.append(competition)

    order_map = {
        "opportunity": "opportunity_score DESC",
        "growth": "growth_30d DESC",
        "demand": "demand_score DESC",
        "monetization": "monetization_score DESC",
    }
    sql = f"SELECT * FROM keywords WHERE {' AND '.join(where)} ORDER BY {order_map.get(sort, order_map['opportunity'])}"
    rows = db.execute(sql, params).fetchall()

    categories = [r[0] for r in db.execute("SELECT DISTINCT category FROM keywords ORDER BY category")]
    intents = [r[0] for r in db.execute("SELECT DISTINCT intent FROM keywords ORDER BY intent")]

    return render_template("keywords.html", rows=rows, categories=categories, intents=intents, selected={"search": search, "category": category, "intent": intent, "competition": competition, "sort": sort})


@app.route("/keywords/<slug>")
@login_required
def keyword_detail(slug: str):
    db = get_db()
    keyword = db.execute("SELECT * FROM keywords WHERE slug=?", (slug,)).fetchone()
    if not keyword:
        return render_template("not_found.html"), 404
    variants = db.execute("SELECT * FROM keyword_variants WHERE keyword_id=?", (keyword["id"],)).fetchall()
    metrics = db.execute("SELECT * FROM keyword_metrics WHERE keyword_id=? ORDER BY captured_at", (keyword["id"],)).fetchall()
    events = db.execute("SELECT * FROM source_events WHERE keyword_id=? ORDER BY collected_at DESC", (keyword["id"],)).fetchall()
    rec = db.execute("SELECT * FROM product_recommendations WHERE keyword_id=?", (keyword["id"],)).fetchone()

    rec_data = None
    if rec:
        rec_data = {
            "headline": rec["headline"],
            "target_users": json.loads(rec["target_users"]),
            "mvp_features": json.loads(rec["mvp_features"]),
            "monetization_model": json.loads(rec["monetization_model"]),
            "risks": json.loads(rec["risks"]),
            "differentiation": rec["differentiation"],
        }

    return render_template(
        "keyword_detail.html",
        keyword=keyword,
        variants=variants,
        metrics=rows_to_dicts(metrics),
        events=events,
        rec=rec_data,
    )


@app.route("/alerts")
@login_required
def alerts():
    rows = get_db().execute("SELECT * FROM alerts WHERE user_id=? ORDER BY id DESC", (session["user_id"],)).fetchall()
    return render_template("alerts.html", rows=rows)


@app.route("/settings")
@login_required
def settings():
    db = get_db()
    saved = db.execute(
        "SELECT k.* FROM saved_keywords s JOIN keywords k ON s.keyword_id=k.id WHERE s.user_id=? ORDER BY s.id DESC LIMIT 10",
        (session["user_id"],),
    ).fetchall()
    runs = db.execute("SELECT * FROM ingestion_runs ORDER BY id DESC LIMIT 10").fetchall()
    return render_template("settings.html", saved=saved, runs=runs)


@app.route("/api/ingest/mock", methods=["POST"])
@login_required
def ingest_mock():
    preview = run_ingestion_preview()
    db = get_db()
    now = utc_now_iso()
    db.execute(
        "INSERT INTO ingestion_runs(source_platform, status, records_collected, records_accepted, started_at, finished_at, metadata_json) VALUES (?,?,?,?,?,?,?)",
        ("MANUAL", "SUCCESS", len(preview), len(preview), now, now, json.dumps({"preview": True})),
    )
    db.commit()
    return jsonify({"count": len(preview), "results": preview})


if __name__ == "__main__":
    app.run(debug=True)
