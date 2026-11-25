"""Rebuild data/churn_table.csv from the app-events files, with the query of lesson DS3 (the modeling table of the Data Scientist track).

    uv run python scripts/build_table.py [BASE]

BASE is a web address or a folder that holds users.csv and events.csv. The default is the release tag v0.2.0 of the site
repository (about 14 MB). The file in the repository was made this way: it has 17,816 people, 9,696 of them churned.
"""

import sys
import tempfile
import urllib.request
from pathlib import Path

import duckdb

BASE = "https://raw.githubusercontent.com/datafromzero/datafromzero.github.io/v0.2.0/datasets/app-events/v1/"
OUT = Path(__file__).resolve().parents[1] / "data" / "churn_table.csv"
MODELING_SQL = """WITH people AS (            -- one row per person: the spine of the table
  SELECT u.user_id, u.signup_date, u.channel, u.region, s.platform,
         s.event_ts AS signup_ts,
         s.event_ts + INTERVAL 7 DAY AS cutoff,       -- the prediction moment
         s.event_ts + INTERVAL 30 DAY AS horizon      -- the end of the label window
  FROM users AS u
  JOIN events AS s ON s.user_id = u.user_id AND s.event_name = 'signup_complete'
  WHERE u.signup_date BETWEEN DATE '2026-01-01' AND DATE '2026-05-31'
),
clean AS (                  -- retry copies removed: keep the first copy of each event
  SELECT *
  FROM events
  QUALIFY ROW_NUMBER() OVER (PARTITION BY user_id, event_ts, event_name, platform ORDER BY received_at, event_id) = 1
),
known AS (                  -- what the app knew at the cutoff: it had happened and it had arrived
  SELECT p.user_id, c.event_name, c.event_ts, p.cutoff
  FROM people AS p
  JOIN clean AS c ON c.user_id = p.user_id
  WHERE c.event_ts <= p.cutoff AND c.received_at <= p.cutoff
),
features AS (
  SELECT user_id,
         COUNT(*) FILTER (WHERE event_name = 'session_start') AS sessions_7d,
         COUNT(*) FILTER (WHERE event_name = 'add_expense') AS expenses_7d,
         COUNT(*) FILTER (WHERE event_name IN ('session_start', 'add_expense') AND event_ts > cutoff - INTERVAL 3 DAY) AS recent_3d,
         COUNT(DISTINCT CAST(event_ts AS DATE)) FILTER (WHERE event_name IN ('session_start', 'add_expense')) AS active_days_7d,
         CAST(COUNT(*) FILTER (WHERE event_name = 'onboarding_complete') > 0 AS INTEGER) AS onboarded,
         CAST(COUNT(*) FILTER (WHERE event_name IN ('view_paywall', 'paywall_viewed')) > 0 AS INTEGER) AS saw_paywall,
         CAST(COUNT(*) FILTER (WHERE event_name = 'purchase') > 0 AS INTEGER) AS bought_plus
  FROM known
  GROUP BY user_id
),
label AS (                  -- from the other side of the cutoff: no visit and no expense in days 8 to 30
  SELECT p.user_id,
         CAST(NOT EXISTS (SELECT 1 FROM events AS e
                          WHERE e.user_id = p.user_id AND e.event_name IN ('session_start', 'add_expense')
                            AND e.event_ts > p.cutoff AND e.event_ts <= p.horizon) AS INTEGER) AS churned
  FROM people AS p
)
SELECT p.user_id, p.signup_date, p.channel, p.platform, p.region,
       f.sessions_7d, f.expenses_7d, f.recent_3d, f.active_days_7d, f.onboarded, f.saw_paywall, f.bought_plus,
       l.churned
FROM people AS p
JOIN features AS f ON f.user_id = p.user_id
JOIN label AS l ON l.user_id = p.user_id
ORDER BY p.user_id"""


def fetch(base, name):
    """The path of one CSV file: downloaded when BASE is a web address, else the file in the folder."""
    if base.startswith("http"):
        path = Path(tempfile.mkdtemp()) / f"{name}.csv"
        urllib.request.urlretrieve(f"{base}{name}.csv", path)
        return path
    return Path(base) / f"{name}.csv"


def main(base):
    con = duckdb.connect()
    con.execute(f"CREATE TABLE users AS FROM read_csv('{fetch(base, 'users')}', types={{'signup_date': 'DATE'}})")
    con.execute(f"CREATE TABLE events AS FROM read_csv('{fetch(base, 'events')}', types={{'event_ts': 'TIMESTAMP', 'received_at': 'TIMESTAMP'}})")
    table = con.sql(MODELING_SQL).df()
    table.to_csv(OUT, index=False)
    print(f"Wrote {OUT.name}: {len(table):,} people, {int(table['churned'].sum()):,} of them churned.")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else BASE)
