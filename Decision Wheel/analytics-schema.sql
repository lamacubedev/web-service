CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  occurred_at TEXT NOT NULL,
  event_date TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  path TEXT NOT NULL,
  referrer_host TEXT NOT NULL DEFAULT '',
  country_code TEXT NOT NULL DEFAULT '',
  language TEXT NOT NULL DEFAULT '',
  culture TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_analytics_date
  ON analytics_events(event_date);

CREATE INDEX IF NOT EXISTS idx_analytics_visitor_date
  ON analytics_events(event_date, visitor_hash);

CREATE INDEX IF NOT EXISTS idx_analytics_path_date
  ON analytics_events(path, event_date);
