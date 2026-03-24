PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS keyword_clusters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  canonical_keyword TEXT NOT NULL,
  summary TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS keywords (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  canonical_keyword TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  intent TEXT NOT NULL,
  trend_type TEXT NOT NULL,
  competition_level TEXT NOT NULL,
  product_type TEXT NOT NULL,
  region TEXT NOT NULL,
  language TEXT NOT NULL,
  description TEXT NOT NULL,
  trend_score REAL NOT NULL,
  demand_score REAL NOT NULL,
  competition_score REAL NOT NULL,
  monetization_score REAL NOT NULL,
  opportunity_score REAL NOT NULL,
  growth_30d REAL NOT NULL,
  growth_90d REAL NOT NULL,
  search_volume_estimate INTEGER NOT NULL,
  validation_count INTEGER NOT NULL,
  source_count INTEGER NOT NULL,
  long_tail_count INTEGER NOT NULL,
  cluster_id INTEGER NOT NULL,
  FOREIGN KEY(cluster_id) REFERENCES keyword_clusters(id)
);

CREATE TABLE IF NOT EXISTS keyword_variants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  keyword_id INTEGER NOT NULL,
  variant TEXT NOT NULL,
  normalized TEXT NOT NULL,
  source_platform TEXT NOT NULL,
  FOREIGN KEY(keyword_id) REFERENCES keywords(id)
);

CREATE TABLE IF NOT EXISTS keyword_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  keyword_id INTEGER NOT NULL,
  captured_at TEXT NOT NULL,
  trend_score REAL NOT NULL,
  demand_score REAL NOT NULL,
  competition_score REAL NOT NULL,
  monetization_score REAL NOT NULL,
  opportunity_score REAL NOT NULL,
  growth_rate REAL NOT NULL,
  search_volume INTEGER NOT NULL,
  FOREIGN KEY(keyword_id) REFERENCES keywords(id)
);

CREATE TABLE IF NOT EXISTS source_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  keyword_id INTEGER NOT NULL,
  source_platform TEXT NOT NULL,
  raw_keyword TEXT NOT NULL,
  raw_score REAL NOT NULL,
  region TEXT NOT NULL,
  collected_at TEXT NOT NULL,
  FOREIGN KEY(keyword_id) REFERENCES keywords(id)
);

CREATE TABLE IF NOT EXISTS product_recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  keyword_id INTEGER NOT NULL UNIQUE,
  headline TEXT NOT NULL,
  target_users TEXT NOT NULL,
  mvp_features TEXT NOT NULL,
  monetization_model TEXT NOT NULL,
  risks TEXT NOT NULL,
  differentiation TEXT NOT NULL,
  FOREIGN KEY(keyword_id) REFERENCES keywords(id)
);

CREATE TABLE IF NOT EXISTS alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS saved_keywords (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  keyword_id INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(user_id, keyword_id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(keyword_id) REFERENCES keywords(id)
);

CREATE TABLE IF NOT EXISTS ingestion_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_platform TEXT NOT NULL,
  status TEXT NOT NULL,
  records_collected INTEGER NOT NULL,
  records_accepted INTEGER NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT NOT NULL,
  metadata_json TEXT NOT NULL
);
