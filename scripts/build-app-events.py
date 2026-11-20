"""Build the app-events dataset (SPEC §7): CSV files, paginated JSON files, an .xlsx workbook and a DuckDB load script.

A fictional budgeting app with a free tier and a paid plan called Plus: users, an event stream, subscriptions and three
A/B tests (January 1 to June 30, 2026). Synthetic and deterministic: the same seed always gives the same rows, so the files
can be rebuilt and compared. A released version folder (v1/) is immutable; change the data only in a new folder.

The model below (every constant under "True parameters") is what the README calls the truth, so a lesson can say what is
real and what is noise. The generator checks its own output (`verify`) before it writes anything.

    python3 scripts/build-app-events.py            # writes datasets/app-events/v1/
    python3 scripts/build-app-events.py --check    # rebuilds in memory and fails if the files or the README differ
    python3 scripts/build-app-events.py --facts    # prints the measured numbers the README quotes

Needs Python 3.10+ and openpyxl 3.1 (only for the .xlsx file).
"""

from __future__ import annotations

import csv
import io
import json
import math
import random
import re
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from pathlib import Path

from stable_xlsx import stabilize

ROOT = Path(__file__).resolve().parent.parent
DATASET = ROOT / "datasets" / "app-events"
OUT = DATASET / "v1"
SEED = 20260301
FIRST_DAY = date(2026, 1, 1)
LAST_DAY = date(2026, 6, 30)
EXPORT_AT = datetime(2026, 7, 1)  # events received at or after this moment are not in the export
PAGE_SIZE = 1000
FIRST_ID = {"user": 10001, "subscription": 70001, "event": 1000001}

# ---------------------------------------------------------------------------------------------------------------------
# True parameters (quoted in README.md)
# ---------------------------------------------------------------------------------------------------------------------

CHANNELS = {
    # share of ordinary daily signups, engagement multiplier, probability of ever seeing the paywall, probability of buying
    # after seeing it (control, android or web, a normal device), probability of choosing Plus on the signup screen,
    # probability of finishing onboarding, platform mix.
    "organic_search": dict(share=0.30, engage=1.20, view=0.55, buy=0.26, plus_signup=0.020, onboard=0.78,
                           platform={"web": 0.65, "ios": 0.15, "android": 0.20}),
    "referral": dict(share=0.20, engage=1.80, view=0.60, buy=0.38, plus_signup=0.030, onboard=0.85,
                     platform={"web": 0.55, "ios": 0.25, "android": 0.20}),
    "app_store": dict(share=0.25, engage=1.00, view=0.50, buy=0.20, plus_signup=0.015, onboard=0.72,
                      platform={"ios": 0.55, "android": 0.45}),
    "paid_search": dict(share=0.15, engage=0.85, view=0.50, buy=0.17, plus_signup=0.015, onboard=0.68,
                        platform={"web": 0.35, "ios": 0.35, "android": 0.30}),
    "paid_social": dict(share=0.10, engage=0.35, view=0.35, buy=0.10, plus_signup=0.005, onboard=0.45,
                        platform={"ios": 0.50, "android": 0.45, "web": 0.05}),
}
REGIONS = {  # share, offset of local time from UTC in hours; the region changes nothing but the hour of day
    "north_america": (0.42, -6),
    "europe": (0.28, 1),
    "latin_america": (0.12, -3),
    "asia_pacific": (0.18, 8),
}
PLATFORM_BUY = {"ios": 1.25, "android": 1.0, "web": 1.0}  # ios buyers are a little likelier to buy, whatever the channel
PLATFORM_ENGAGE = {"ios": 1.10, "android": 1.0, "web": 1.0}  # and a little more active (a small real difference)
OLD_ANDROID_SHARE = 0.35  # of android users, an old operating system
OLD_ANDROID_BUY = 0.15  # their buying multiplier
ENGAGE_SIGMA = 0.55  # lognormal spread of a person's activity, mean 1 before the multipliers
LATE_VIEWER_SHARE = 0.15  # viewers who first see the paywall 15 to 100 days after signup

SIGNUPS_PER_DAY = (90, 125)  # baseline of ordinary signups on the first and the last day (straight line between), before the factors below
WEEKDAY_FACTOR = [1.00, 1.05, 1.05, 1.00, 0.90, 0.75, 0.80]  # Monday first
MONTH_START_FACTOR = 1.3  # days 1 to 3 of a month
CAMPAIGN = (date(2026, 4, 13), date(2026, 6, 7))  # a paid-social campaign: extra signups, all from paid_social
CAMPAIGN_EXTRA_PER_DAY = 55
CLEAN_BASELINE_FROM = date(2026, 3, 9)  # the first signup day after paywall_v2 ended: from here to April 12 nothing but welcome_tips (null) runs

ACTIVE_DAYS = 1.8  # mean number of later days a person opens the app, before multiplying by their activity
EXPENSES_PER_VISIT = 1.0
PLUS_USE_PER_DAY = 0.08  # plus_feature_used events a day for a subscriber with activity 1

ANNUAL_SHARE = 0.25
ANNUAL_REFUND_RATE = 0.05  # annual buyers who cancel within 14 days
MONTHLY_CHURN = 0.14  # chance of canceling at a monthly renewal for activity 1; falls as activity rises
CHURN_ACTIVITY_POWER = -0.6
FIRST_RENEWAL_FACTOR = 1.3
UPGRADE_RATE = 0.06  # monthly subscribers who move to annual at the second renewal
RESUBSCRIBE_RATE = 0.12
TOUCH_RATE = 0.03  # subscriptions with a nightly re-sync row that changed nothing
DUPLICATE_ROW_RATE = 0.025  # subscription rows written twice by a retried load

EXPERIMENTS = {
    # name: (first signup day, last signup day, salt of the fair-coin labels). The salts were picked from a few dozen to a
    # few hundred candidates, so that the labels tell the lesson story (paywall_v2 shows a clearly larger lift in week one;
    # the interim p-value of welcome_tips dips under 0.05 in week two and ends near 0.8; the broken test of signup_flow_v2
    # looks like a win). The truth does not depend on the salt.
    "paywall_v2": (date(2026, 1, 12), date(2026, 3, 8), 17),
    "welcome_tips": (date(2026, 3, 16), date(2026, 4, 26), 350),
    "signup_flow_v2": (date(2026, 5, 4), date(2026, 6, 7), 3),
}
PAYWALL_LIFT = 1.20  # paywall_v2 multiplies the chance of buying after seeing the paywall (the steady lift)
NOVELTY_EXTRA = 0.50  # a novelty effect: people who sign up on day 0 of paywall_v2 get 0.50 more on top of the steady lift,
NOVELTY_DECAY_DAYS = 6.0  # and the extra decays as exp(-day / 6): about 1.52 on average in the first week, 1.21 by day 28
PAYWALL_FIRST_MONTH_CANCEL = 1.30  # and its buyers cancel a little more at the first renewal
CONVERSION_DAYS = 14

LATE_EVENT_RATE = 0.013  # mobile usage events held on the phone and sent 1 to 72 hours late
DUPLICATE_EVENT_RATE = 0.006
FUTURE_DATED_EVENTS = 30  # a phone clock that runs 1 to 5 hours ahead
OUTAGE = (datetime(2026, 3, 17, 14), datetime(2026, 3, 17, 20))  # the collector was down; events arrived from 20:00 on
RENAME_DAY = date(2026, 5, 18)  # the iOS app renames view_paywall to paywall_viewed
HOLIDAY = date(2026, 5, 25)  # Memorial Day, a US public holiday (a Monday)
HOLIDAY_SKIP = 0.5  # on that day half of the visits of north_america people do not happen
DELETED_USERS = 40
NO_EVENT_USERS = 10

LOCAL_HOUR_WEIGHT = [1, .5, .3, .2, .2, .4, 1.0, 2.2, 3.2, 2.6, 2.0, 2.4, 3.0, 2.6, 2.0, 1.8, 1.8, 2.0, 2.6, 3.2, 3.6, 3.2,
                     2.2, 1.4]
USAGE = ("session_start", "add_expense", "plus_feature_used")
CLIENT = USAGE + ("view_paywall", "start_checkout")
EVENT_NAMES = ["signup_complete", "onboarding_complete", "session_start", "add_expense", "view_paywall", "paywall_viewed",
               "start_checkout", "purchase", "plus_feature_used", "cancel_subscription"]
LAST_MOMENT = EXPORT_AT - timedelta(seconds=1)


def poisson(rng: random.Random, lam: float) -> int:
    if lam < 30:
        limit, k, p = math.exp(-lam), 0, rng.random()
        while p > limit:
            k += 1
            p *= rng.random()
        return k
    return max(0, round(rng.gauss(lam, math.sqrt(lam))))


def pick(rng: random.Random, weights: dict[str, float]) -> str:
    return rng.choices(list(weights), weights=list(weights.values()))[0]


def hour_weights(offset: int) -> list[float]:
    return [LOCAL_HOUR_WEIGHT[(h + offset) % 24] for h in range(24)]


HOURS = {name: hour_weights(offset) for name, (_, offset) in REGIONS.items()}


def at(day: date, region: str, rng: random.Random) -> datetime:
    hour = rng.choices(range(24), weights=HOURS[region])[0]
    return datetime(day.year, day.month, day.day, hour) + timedelta(seconds=rng.randrange(3600))


@dataclass
class User:
    channel: str
    region: str
    platform: str
    old_android: bool
    activity: float
    signup_ts: datetime
    user_id: int = 0

    @property
    def signup_date(self) -> date:
        return self.signup_ts.date()


def make_users(rng: random.Random) -> list[User]:
    users: list[User] = []
    span = (LAST_DAY - FIRST_DAY).days
    day = FIRST_DAY
    while day <= LAST_DAY:
        level = SIGNUPS_PER_DAY[0] + (SIGNUPS_PER_DAY[1] - SIGNUPS_PER_DAY[0]) * (day - FIRST_DAY).days / span
        level *= WEEKDAY_FACTOR[day.weekday()] * (MONTH_START_FACTOR if day.day <= 3 else 1)
        counts = {c: poisson(rng, level * p["share"]) for c, p in CHANNELS.items()}
        if CAMPAIGN[0] <= day <= CAMPAIGN[1]:
            ramp = min(1.0, 0.4 + 0.6 * (day - CAMPAIGN[0]).days / 7)
            counts["paid_social"] += poisson(rng, CAMPAIGN_EXTRA_PER_DAY * ramp * WEEKDAY_FACTOR[day.weekday()])
        for channel, n in counts.items():
            for _ in range(n):
                region = pick(rng, {r: s for r, (s, _) in REGIONS.items()})
                platform = pick(rng, CHANNELS[channel]["platform"])
                old = platform == "android" and rng.random() < OLD_ANDROID_SHARE
                activity = math.exp(rng.gauss(-ENGAGE_SIGMA**2 / 2, ENGAGE_SIGMA))
                activity *= CHANNELS[channel]["engage"] * PLATFORM_ENGAGE[platform]
                users.append(User(channel, region, platform, old, activity, at(day, region, rng)))
        day += timedelta(days=1)
    users.sort(key=lambda u: u.signup_ts)
    for i, u in enumerate(users):
        u.user_id = FIRST_ID["user"] + i
    return users


def assign_arms(users: list[User]) -> dict[int, tuple[str, str]]:
    """Fair-coin labels, one stream per experiment, for every user who signs up inside the experiment's window."""
    arms: dict[int, tuple[str, str]] = {}
    for name, (first, last, salt) in EXPERIMENTS.items():
        coin = random.Random(f"{SEED}:{name}:{salt}")
        for u in users:
            if first <= u.signup_date <= last:
                arms[u.user_id] = (name, "variant" if coin.random() < 0.5 else "control")
    return arms


def crashed(u: User, arm: tuple[str, str] | None) -> bool:
    """signup_flow_v2 crashes on old android before the assignment is written: no row, no onboarding, never back."""
    return arm == ("signup_flow_v2", "variant") and u.old_android


@dataclass
class Raw:
    ts: datetime
    user_id: int
    name: str
    platform: str


@dataclass
class Subscription:
    start: datetime
    user_id: int
    versions: list[tuple[datetime, str, date | None, str | None]]  # updated_at, plan, ended_on, cancel_reason


@dataclass
class Sim:
    plan_at_signup: str
    expected14: float  # chance of buying within 14 days of signup, from the parameters (never used to draw an outcome)
    events: list[Raw]
    subscriptions: list[Subscription]


VIEW_SAME_DAY = 0.4
VIEW_MEAN_DAYS = 3.0


def paywall_lift(day: int) -> float:
    """The multiplier on the chance of buying after a view for a paywall_v2 variant user who signed up `day` days after the
    experiment started: the steady 1.20 plus a novelty extra that fades."""
    return PAYWALL_LIFT + NOVELTY_EXTRA * math.exp(-day / NOVELTY_DECAY_DAYS)


def simulate_user(u: User, arm: tuple[str, str] | None) -> Sim:
    rng = random.Random(f"{SEED}:user:{u.user_id}")
    ch = CHANNELS[u.channel]
    events: list[Raw] = []

    def device() -> str:
        return u.platform if rng.random() < 0.92 else rng.choice([p for p in PLATFORM_BUY if p != u.platform])

    def add(ts: datetime, name: str, platform: str | None = None) -> None:
        if ts < EXPORT_AT:
            events.append(Raw(ts, u.user_id, name, platform or u.platform))

    add(u.signup_ts, "signup_complete")
    if crashed(u, arm):
        return Sim("free", 0.0, events, [])

    buy = ch["buy"] * PLATFORM_BUY[u.platform] * (OLD_ANDROID_BUY if u.old_android else 1.0)
    if arm == ("paywall_v2", "variant"):
        buy *= paywall_lift((u.signup_date - EXPERIMENTS["paywall_v2"][0]).days)
    buy = min(0.9, buy)
    in14 = (1 - LATE_VIEWER_SHARE) * (1 - (1 - VIEW_SAME_DAY) * math.exp(-CONVERSION_DAYS / VIEW_MEAN_DAYS))
    expected14 = ch["plus_signup"] + (1 - ch["plus_signup"]) * ch["view"] * in14 * buy

    d_plus, d_view, d_buy, d_onboard = rng.random(), rng.random(), rng.random(), rng.random()
    plus_signup = d_plus < ch["plus_signup"]
    viewer = plus_signup or d_view < ch["view"]
    buys = plus_signup or (viewer and d_buy < buy)

    if d_onboard < ch["onboard"]:
        add(u.signup_ts + timedelta(seconds=rng.randint(60, 1200)), "onboarding_complete")

    purchase_ts = None
    if viewer:
        if plus_signup:
            view_ts = u.signup_ts + timedelta(seconds=rng.randint(20, 120))
        elif rng.random() < LATE_VIEWER_SHARE:
            view_ts = at(u.signup_date + timedelta(days=rng.randint(15, 100)), u.region, rng)
        elif rng.random() < VIEW_SAME_DAY:
            view_ts = u.signup_ts + timedelta(seconds=rng.randint(600, 43200))
        else:
            view_ts = at(u.signup_date + timedelta(days=1 + int(rng.expovariate(1 / VIEW_MEAN_DAYS))), u.region, rng)
        add(view_ts, "view_paywall")
        if buys:
            checkout_ts = view_ts + timedelta(seconds=rng.randint(60, 400))
            purchase_ts = checkout_ts + timedelta(seconds=rng.randint(30, 240))
            add(checkout_ts, "start_checkout")
        else:
            if rng.random() < 0.25:
                add(view_ts + timedelta(seconds=rng.randint(60, 400)), "start_checkout")
            if rng.random() < 0.30:
                add(at(view_ts.date() + timedelta(days=rng.randint(1, 10)), u.region, rng), "view_paywall")

    # Usage: a few expenses on the first day, then later days with a visit and expenses.
    for _ in range(poisson(rng, EXPENSES_PER_VISIT * math.sqrt(u.activity))):
        add(u.signup_ts + timedelta(seconds=rng.randint(60, 3600)), "add_expense")
    for _ in range(poisson(rng, ACTIVE_DAYS * u.activity)):
        k = 1 + int(rng.expovariate(1 / 9) if rng.random() < 0.75 else rng.expovariate(1 / 45))
        day = u.signup_date + timedelta(days=k)
        if day > LAST_DAY or (day.weekday() >= 5 and rng.random() < 0.25):
            continue
        if day == HOLIDAY and u.region == "north_america" and rng.random() < HOLIDAY_SKIP:
            continue
        visit = at(day, u.region, rng)
        add(visit, "session_start", device())
        for _ in range(poisson(rng, EXPENSES_PER_VISIT * math.sqrt(u.activity))):
            add(visit + timedelta(seconds=rng.randint(20, 900)), "add_expense", device())

    subscriptions: list[Subscription] = []
    if buys and purchase_ts is not None and purchase_ts < EXPORT_AT:
        subscriptions = simulate_subscriptions(u, rng, arm, purchase_ts, add, device)
    return Sim("plus" if plus_signup else "free", expected14, events, subscriptions)


def simulate_subscriptions(u, rng, arm, purchase_ts, add, device) -> list[Subscription]:
    subscriptions: list[Subscription] = []
    start = purchase_ts
    plan = "plus_annual" if rng.random() < ANNUAL_SHARE else "plus_monthly"
    first = True
    while True:
        add(start, "purchase")
        versions: list[tuple[datetime, str, date | None, str | None]] = [
            (start + timedelta(seconds=rng.randint(1, 60)), plan, None, None)
        ]
        end = None
        if plan == "plus_annual":
            if rng.random() < ANNUAL_REFUND_RATE:
                end = at(start.date() + timedelta(days=rng.randint(1, 14)), u.region, rng)
        else:
            k = 1
            while start + timedelta(days=30 * k) <= LAST_MOMENT:
                boundary = start + timedelta(days=30 * k)
                if k == 2 and rng.random() < UPGRADE_RATE:
                    plan = "plus_annual"
                    versions.append((boundary + timedelta(seconds=rng.randint(1, 3600)), plan, None, None))
                    break
                hazard = MONTHLY_CHURN * u.activity**CHURN_ACTIVITY_POWER
                if k == 1:
                    hazard *= FIRST_RENEWAL_FACTOR
                    if first and arm == ("paywall_v2", "variant"):
                        hazard *= PAYWALL_FIRST_MONTH_CANCEL
                if rng.random() < min(0.6, hazard):
                    end = at(boundary.date() - timedelta(days=rng.randint(0, 5)), u.region, rng)
                    break
                k += 1
        last = end or LAST_MOMENT
        days = max(1, (last.date() - start.date()).days)
        for _ in range(poisson(rng, PLUS_USE_PER_DAY * u.activity * days)):
            ts = at(start.date() + timedelta(days=rng.randrange(days + 1)), u.region, rng)
            if start < ts <= last:
                add(ts, "plus_feature_used", device())
        if end is not None:
            add(end, "cancel_subscription")
            low = u.activity < 0.8
            reasons = {"too_expensive": 3, "not_using": 6 if low else 1.5, "missing_feature": 2, "found_alternative": 2,
                       "other": 1}
            versions.append((end + timedelta(seconds=rng.randint(1, 30)), plan, end.date(), pick(rng, reasons)))
        # A nightly re-sync that rewrote a row without changing it, then rows written twice by a retried load.
        if rng.random() < TOUCH_RATE:
            i = rng.randrange(len(versions))
            upper = versions[i + 1][0] if i + 1 < len(versions) else LAST_MOMENT
            if (upper - versions[i][0]).days >= 2:
                touched = versions[i][0] + (upper - versions[i][0]) * rng.uniform(0.2, 0.8)
                versions.insert(i + 1, (touched.replace(microsecond=0),) + versions[i][1:])
        versions += [v for v in versions if rng.random() < DUPLICATE_ROW_RATE]
        subscriptions.append(Subscription(start, u.user_id, versions))
        first = False
        if end is None or rng.random() >= RESUBSCRIBE_RATE:
            return subscriptions
        start = at(end.date() + timedelta(days=rng.randint(10, 60)), u.region, rng)
        if start >= EXPORT_AT:
            return subscriptions
        add(start - timedelta(seconds=rng.randint(60, 300)), "start_checkout")
        plan = "plus_monthly"


Table = tuple[list[str], list[list[object]]]


def finalize_events(raw: list[Raw], rng: random.Random) -> tuple[list[list[object]], dict[str, int]]:
    """Add the delivery details: the iOS rename, the outage, late and duplicated events, a few phone clocks that run ahead.
    Events are numbered in the order they arrived (received_at), so a late event has a higher id than events that happened
    after it."""
    raw.sort(key=lambda e: (e.ts, e.user_id, e.name))
    in_outage = lambda ts: OUTAGE[0] <= ts < OUTAGE[1]
    mobile_usage = [
        i for i, e in enumerate(raw)
        if e.name in USAGE and e.platform != "web" and e.ts < EXPORT_AT - timedelta(days=3) and not in_outage(e.ts)
    ]
    ahead = set(rng.sample(mobile_usage, FUTURE_DATED_EVENTS))
    rows: list[tuple[datetime, datetime, int, str, str]] = []  # received_at, event_ts, user_id, name, platform
    dropped = 0
    for i, e in enumerate(raw):
        name, ts = e.name, e.ts
        if name == "view_paywall" and e.platform == "ios" and ts.date() >= RENAME_DAY:
            name = "paywall_viewed"
        if in_outage(ts):
            received = OUTAGE[1] + timedelta(seconds=rng.randrange(1800))
        elif i in ahead:
            received = ts + timedelta(seconds=1 + int(rng.expovariate(1 / 3)))
            ts += timedelta(seconds=rng.randint(3600, 5 * 3600))
        elif name in USAGE and e.platform != "web" and rng.random() < LATE_EVENT_RATE:
            received = ts + timedelta(seconds=rng.randint(3600, 72 * 3600))
        else:
            received = ts + timedelta(seconds=1 + int(rng.expovariate(1 / 3)))
        copies = [(received, ts)]
        retried = (name in CLIENT or name == "paywall_viewed") and not in_outage(e.ts) and i not in ahead
        if retried and rng.random() < DUPLICATE_EVENT_RATE:
            copies.append((received + timedelta(seconds=rng.randint(1, 20)), ts))
        for r, t in copies:
            if r >= EXPORT_AT:
                dropped += 1
            else:
                rows.append((r, t, e.user_id, name, e.platform))
    rows.sort(key=lambda r: (r[0], r[1], r[2], r[3]))
    events = [
        [FIRST_ID["event"] + i, uid, ts, name, platform, received]
        for i, (received, ts, uid, name, platform) in enumerate(rows)
    ]
    return events, {"not_yet_received_at_export": dropped}


def build() -> tuple[dict[str, Table], dict]:
    rng = random.Random(SEED)
    users = make_users(rng)
    arms = assign_arms(users)
    sims = {u.user_id: simulate_user(u, arms.get(u.user_id)) for u in users}
    post = random.Random(f"{SEED}:post")

    subscribers = {uid for uid, s in sims.items() if s.subscriptions}
    deleted = set(post.sample(
        [u.user_id for u in users if u.signup_date < EXPERIMENTS["paywall_v2"][0] and u.user_id not in subscribers], DELETED_USERS))
    quiet = set(post.sample(
        [u.user_id for u in users
         if u.signup_date >= date(2026, 6, 8) and u.user_id not in subscribers and sims[u.user_id].plan_at_signup == "free"],
        NO_EVENT_USERS))
    raw = [e for uid, s in sims.items() if uid not in quiet for e in s.events]
    events, event_facts = finalize_events(raw, post)

    subscriptions = sorted((s for sim in sims.values() for s in sim.subscriptions), key=lambda s: (s.start, s.user_id))
    sub_rows = [
        [FIRST_ID["subscription"] + i, s.user_id, plan, s.start.date(), ended_on, updated_at, reason]
        for i, s in enumerate(subscriptions)
        for updated_at, plan, ended_on, reason in s.versions
    ]
    sub_rows.sort(key=lambda r: (r[0], r[5]))

    purchases: dict[int, list[datetime]] = defaultdict(list)
    for e in raw:
        if e.name == "purchase":
            purchases[e.user_id].append(e.ts)
    assignments = []
    for u in users:
        arm = arms.get(u.user_id)
        if arm is None or crashed(u, arm):
            continue
        assigned_at = u.signup_ts + timedelta(seconds=random.Random(f"{SEED}:assign:{u.user_id}").randint(1, 3))
        converted = any(assigned_at <= t <= assigned_at + timedelta(days=CONVERSION_DAYS) for t in purchases[u.user_id])
        assignments.append([u.user_id, arm[0], arm[1], assigned_at, converted])
    assignments.sort(key=lambda r: (r[3], r[0]))

    tables = {
        "users": (["user_id", "signup_date", "channel", "region", "plan_at_signup"],
                  [[u.user_id, u.signup_date, u.channel, u.region, sims[u.user_id].plan_at_signup]
                   for u in users if u.user_id not in deleted]),
        "events": (["event_id", "user_id", "event_ts", "event_name", "platform", "received_at"], events),
        "subscriptions": (["subscription_id", "user_id", "plan", "started_on", "ended_on", "updated_at", "cancel_reason"],
                          sub_rows),
        "experiment_assignments": (["user_id", "experiment", "variant", "assigned_at", "converted"], assignments),
    }
    truth = {
        "deleted": deleted,
        "crashed": {u.user_id for u in users if crashed(u, arms.get(u.user_id))},
        "expected14": {u.user_id: sims[u.user_id].expected14 for u in users},
        **event_facts,
    }
    return tables, truth


# ---------------------------------------------------------------------------------------------------------------------
# The paginated JSON files (a pretend API, one file per page)
# ---------------------------------------------------------------------------------------------------------------------

API_EVENTS_FROM = datetime(2026, 6, 16)  # the events endpoint serves the events received from June 16
API_OVERLAP = (7, 3)  # page 7 starts 3 rows early, as a page does when rows arrive during a paging loop


def jsonable(v: object) -> object:
    if isinstance(v, (datetime, date)):
        return text(v)
    return v


def api_pages(tables: dict[str, Table]) -> dict[str, dict]:
    sources = {
        "events": [r for r in tables["events"][1] if r[5] >= API_EVENTS_FROM],
        "subscriptions": tables["subscriptions"][1],
    }
    pages: dict[str, dict] = {}
    for name, rows in sources.items():
        header = tables[name][0]
        starts: list[int] = []
        start = 0
        while start < len(rows):
            starts.append(start)
            start += PAGE_SIZE
            if name == "events" and len(starts) == API_OVERLAP[0] - 1:
                start -= API_OVERLAP[1]  # rows arrived while the loop was paging: the next page repeats 3 rows
        for i, begin in enumerate(starts, start=1):
            chunk = rows[begin : begin + PAGE_SIZE]
            pages[f"{name}/page-{i:03d}.json"] = {
                "page": i,
                "page_size": PAGE_SIZE,
                "total_rows": len(rows),
                "total_pages": len(starts),
                "next_page": f"page-{i + 1:03d}.json" if i < len(starts) else None,
                "rows": [{h: jsonable(v) for h, v in zip(header, r)} for r in chunk],
            }
    pages["index.json"] = {
        "name": "app-events",
        "version": 1,
        "endpoints": {
            name: {
                "first_page": f"{name}/page-001.json",
                "page_size": PAGE_SIZE,
                "total_rows": pages[f"{name}/page-001.json"]["total_rows"],
                "total_pages": pages[f"{name}/page-001.json"]["total_pages"],
            }
            for name in sources
        },
    }
    return pages


# ---------------------------------------------------------------------------------------------------------------------
# Measuring the data (the numbers the README quotes) and checking it
# ---------------------------------------------------------------------------------------------------------------------


def z_test(x1: int, n1: int, x2: int, n2: int) -> tuple[float, float]:
    """Two-proportion z test with a pooled standard error: (z, two-sided p), positive z when group 2 is higher."""
    pooled = (x1 + x2) / (n1 + n2)
    z = (x2 / n2 - x1 / n1) / math.sqrt(pooled * (1 - pooled) * (1 / n1 + 1 / n2))
    return z, math.erfc(abs(z) / math.sqrt(2))


def srm_p(n1: int, n2: int) -> float:
    """Chi-square test of a 50/50 split, one degree of freedom."""
    return math.erfc(math.sqrt((n1 - n2) ** 2 / (n1 + n2) / 2))


def correlation(xs: list[float], ys: list[float]) -> float:
    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)
    cov = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    return cov / math.sqrt(sum((x - mx) ** 2 for x in xs) * sum((y - my) ** 2 for y in ys))


def measure(tables: dict[str, Table], truth: dict, pages: dict[str, dict]) -> dict:
    users, events = tables["users"][1], tables["events"][1]
    subs, assignments = tables["subscriptions"][1], tables["experiment_assignments"][1]
    f: dict = {"rows": {name: len(rows) for name, (_, rows) in tables.items()}}
    user_ids = {r[0] for r in users}
    channel = {r[0]: r[2] for r in users}
    region = {r[0]: r[3] for r in users}
    f["users_by_channel"] = dict(Counter(channel.values()))
    f["plan_at_signup"] = dict(Counter(r[4] for r in users))

    # events
    f["event_names"] = dict(Counter(e[3] for e in events))
    lag = [(e[5] - e[2]).total_seconds() for e in events]
    outage_ids = {e[0] for e in events if OUTAGE[0] <= e[2] < OUTAGE[1]}
    f["outage_events"] = len(outage_ids)
    f["late_events"] = sum(1 for e, s in zip(events, lag) if s >= 3600 and e[0] not in outage_ids)
    f["late_filter_all"] = sum(1 for s in lag if s >= 3600)  # the plain filter, which also catches outage events
    f["future_dated_events"] = sum(1 for s in lag if s < 0)
    keys = Counter((e[1], e[2], e[3], e[4]) for e in events)
    f["duplicate_events_extra"] = sum(n - 1 for n in keys.values())
    f["orphan_events"] = sum(1 for e in events if e[1] not in user_ids)
    f["orphan_users"] = len({e[1] for e in events if e[1] not in user_ids})
    f["users_without_events"] = len(user_ids - {e[1] for e in events})
    f["not_yet_received_at_export"] = truth["not_yet_received_at_export"]
    f["first_event"] = min(e[2] for e in events).isoformat(sep=" ")
    f["last_event"] = max(e[2] for e in events).isoformat(sep=" ")
    f["events_per_user"] = len(events) / len(users)
    f["events_in_api"] = sum(1 for e in events if e[5] >= API_EVENTS_FROM)
    f["event_users"] = {n: len({e[1] for e in events if e[3] == n}) for n in EVENT_NAMES}
    june = [e for e in events if e[2].date().month == 6]
    f["june_active_people"] = {
        "any event": len({e[1] for e in june}),
        "session_start": len({e[1] for e in june if e[3] == "session_start"}),
        "add_expense": len({e[1] for e in june if e[3] == "add_expense"}),
        "session_start or add_expense": len({e[1] for e in june if e[3] in ("session_start", "add_expense")}),
    }
    weeks = {"before": (RENAME_DAY - timedelta(days=28), RENAME_DAY), "after": (RENAME_DAY, RENAME_DAY + timedelta(days=28))}
    f["paywall_views_four_weeks"] = {
        label: {
            "view_paywall": sum(1 for e in events if e[3] == "view_paywall" and first <= e[2].date() < last),
            "both_names": sum(1 for e in events if e[3] in ("view_paywall", "paywall_viewed") and first <= e[2].date() < last),
        }
        for label, (first, last) in weeks.items()
    }

    # subscriptions
    f["subscriptions_distinct"] = len({r[0] for r in subs})
    rows_by_sub = defaultdict(list)
    for r in subs:
        rows_by_sub[r[0]].append(r)
    f["subscriptions_with_several_rows"] = sum(1 for v in rows_by_sub.values() if len(v) > 1)
    f["subscription_rows_exact_duplicates_extra"] = len(subs) - len({tuple(r) for r in subs})
    latest = {sid: max(v, key=lambda r: r[5]) for sid, v in rows_by_sub.items()}
    f["subscriptions_ended"] = sum(1 for r in latest.values() if r[4] is not None)
    f["subscriptions_by_plan"] = dict(Counter(r[2] for r in latest.values()))
    f["cancel_reasons"] = dict(Counter(r[6] for r in latest.values() if r[6]))
    f["resync_rows"] = 0
    for v in rows_by_sub.values():
        ordered = sorted({tuple(r) for r in v}, key=lambda r: r[5])
        f["resync_rows"] += sum(1 for a, b in zip(ordered, ordered[1:]) if a[2:5] == b[2:5] and a[6] == b[6])
    f["users_with_several_subscriptions"] = sum(1 for n in Counter(r[1] for r in latest.values()).values() if n > 1)

    # conversion within 14 days of signup, per user
    signup_ts = {e[1]: e[2] for e in events if e[3] == "signup_complete"}
    purchases = defaultdict(list)
    for e in events:
        if e[3] == "purchase":
            purchases[e[1]].append(e[2])
    signup_platform = {e[1]: e[4] for e in events if e[3] == "signup_complete"}
    conv14 = {
        uid: any(ts <= t <= ts + timedelta(days=CONVERSION_DAYS) for t in purchases[uid]) for uid, ts in signup_ts.items()
    }
    f["purchase_events"] = sum(len(v) for v in purchases.values())
    matured = [r for r in users if r[1] <= LAST_DAY - timedelta(days=CONVERSION_DAYS) and r[0] in conv14]
    f["conversion_overall"] = sum(conv14[r[0]] for r in matured) / len(matured)

    # the mix shift
    periods = {
        "before": (CLEAN_BASELINE_FROM, CAMPAIGN[0] - timedelta(days=1)),
        "before_all": (FIRST_DAY, CAMPAIGN[0] - timedelta(days=1)),  # also holds the paywall_v2 variant, which lifts it
        "during": CAMPAIGN,
        "after": (CAMPAIGN[1] + timedelta(days=1), LAST_DAY - timedelta(days=CONVERSION_DAYS)),
    }
    f["mix"] = {}
    for label, (first, last) in periods.items():
        group = [r for r in matured if first <= r[1] <= last]
        by = defaultdict(list)
        for r in group:
            by[r[2]].append(conv14[r[0]])
        f["mix"][label] = {
            "n": len(group),
            "conversion": sum(conv14[r[0]] for r in group) / len(group),
            "paid_social_share": len(by["paid_social"]) / len(group),
            "by_channel": {c: sum(v) / len(v) for c, v in sorted(by.items())},
            "by_channel_counts": {c: (sum(v), len(v)) for c, v in sorted(by.items())},
        }
    paywall_variant = {r[0] for r in assignments if r[1] == "paywall_v2" and r[2] == "variant"}
    without_variant = [conv14[r[0]] for r in matured if periods["before_all"][0] <= r[1] <= periods["before_all"][1]
                       and r[0] not in paywall_variant]
    f["mix"]["before_all_without_paywall_variant"] = sum(without_variant) / len(without_variant)
    during = f["mix"]["during"]
    f["mix"]["during_with_before_rates"] = sum(
        size / during["n"] * f["mix"]["before"]["by_channel"][c] for c, (_, size) in during["by_channel_counts"].items()
    )

    # a reversal (Simpson): platform of the signup event against the channel
    cells: dict[tuple[str, str], list[bool]] = defaultdict(list)
    for r in matured:
        cells[(r[2], signup_platform[r[0]])].append(conv14[r[0]])
    f["platform_overall"] = {
        p: sum(sum(v) for (c, pl), v in cells.items() if pl == p) / sum(len(v) for (c, pl), v in cells.items() if pl == p)
        for p in PLATFORM_BUY
    }
    f["platform_by_channel"] = {
        c: {p: sum(v) / len(v) for (cc, p), v in sorted(cells.items()) if cc == c} for c in CHANNELS
    }
    f["ios_vs_web_p"] = {
        c: z_test(sum(cells[(c, "web")]), len(cells[(c, "web")]), sum(cells[(c, "ios")]), len(cells[(c, "ios")]))[1]
        for c in CHANNELS if (c, "web") in cells
    }
    f["platform_by_channel_n"] = {c: {p: len(v) for (cc, p), v in sorted(cells.items()) if cc == c} for c in CHANNELS}

    # engagement against conversion
    eng = Counter()
    eng14 = Counter()
    for e in events:
        if e[3] in ("session_start", "add_expense") and e[1] in signup_ts:
            delta = e[2] - signup_ts[e[1]]
            if timedelta(0) <= delta <= timedelta(days=7):
                eng[e[1]] += 1
            if timedelta(0) <= delta <= timedelta(days=14):
                eng14[e[1]] += 1
    xs = [float(eng[r[0]]) for r in matured]
    ys = [float(conv14[r[0]]) for r in matured]
    f["engagement"] = {
        "r_overall": correlation(xs, ys),
        "r_within_channel": {
            c: correlation([x for x, r in zip(xs, matured) if r[2] == c], [y for y, r in zip(ys, matured) if r[2] == c])
            for c in CHANNELS
        },
    }
    high = [conv14[r[0]] for r in matured if eng[r[0]] >= 5]
    low = [conv14[r[0]] for r in matured if eng[r[0]] < 5]
    f["engagement"].update(high_share=len(high) / len(matured), high_conversion=sum(high) / len(high),
                           low_conversion=sum(low) / len(low))
    ios = [float(eng14[r[0]]) for r in matured if signup_platform[r[0]] == "ios"]
    android = [float(eng14[r[0]]) for r in matured if signup_platform[r[0]] == "android"]
    web = [float(eng14[r[0]]) for r in matured if signup_platform[r[0]] == "web"]
    mean = lambda v: sum(v) / len(v)
    var = lambda v: sum((x - mean(v)) ** 2 for x in v) / (len(v) - 1)
    t = (mean(ios) - mean(android)) / math.sqrt(var(ios) / len(ios) + var(android) / len(android))
    pooled_sd = math.sqrt((var(ios) * (len(ios) - 1) + var(android) * (len(android) - 1)) / (len(ios) + len(android) - 2))
    f["ios_vs_android_activity"] = {"ios": mean(ios), "android": mean(android), "web": mean(web), "z": t,
                                    "p": math.erfc(abs(t) / math.sqrt(2)), "d": (mean(ios) - mean(android)) / pooled_sd}

    # a US holiday: visits of people in north_america on Memorial Day against the Mondays around it
    mondays = [HOLIDAY + timedelta(days=k) for k in (-14, -7, 7, 14)]
    visits = {"holiday": Counter(), "other_mondays": Counter()}
    for e in events:
        if e[3] == "session_start" and e[1] in region:
            group = "holiday" if e[2].date() == HOLIDAY else "other_mondays" if e[2].date() in mondays else None
            if group:
                visits[group][region[e[1]] == "north_america"] += 1
    f["holiday"] = {
        "north_america": (visits["holiday"][True], visits["other_mondays"][True] / len(mondays)),
        "elsewhere": (visits["holiday"][False], visits["other_mondays"][False] / len(mondays)),
    }

    # experiments
    f["experiments"] = {}
    f["lift_curve"] = {day: paywall_lift(day) for day in (0, 3, 6, 7, 14, 28, 55)}
    first_sub_of = {}
    for sid in sorted(latest):
        first_sub_of.setdefault(latest[sid][1], latest[sid])
    for name, (first, last, _) in EXPERIMENTS.items():
        rows = [r for r in assignments if r[1] == name]
        arms = {a: [r for r in rows if r[2] == a] for a in ("control", "variant")}
        x = {a: sum(r[4] for r in v) for a, v in arms.items()}
        n = {a: len(v) for a, v in arms.items()}
        z, p = z_test(x["control"], n["control"], x["variant"], n["variant"])
        expected = {a: sum(truth["expected14"][r[0]] for r in v) / len(v) for a, v in arms.items()}
        window_users = [r for r in users if first <= r[1] <= last]
        missing = [r for r in window_users if r[0] not in {a[0] for a in rows}]
        d = {
            "first_day": first.isoformat(), "last_day": last.isoformat(), "n": n, "converted": x,
            "rate": {a: x[a] / n[a] for a in n}, "z": z, "p": p, "srm_p": srm_p(n["control"], n["variant"]),
            "expected_rate": expected, "users_in_window_without_assignment": len(missing),
        }
        if name == "paywall_v2":
            early = {a: [] for a in n}
            for r in arms["control"] + arms["variant"]:
                s = first_sub_of.get(r[0])
                if r[4] and s is not None:
                    early[r[2]].append(s[4] is not None and (s[4] - s[3]).days <= 30)
            d["early_cancel"] = {a: (sum(v), len(v)) for a, v in early.items()}
            d["early_cancel_p"] = z_test(*d["early_cancel"]["control"], *d["early_cancel"]["variant"])[1]
            d["novelty"] = {}
            for label, in_group in (("first_week", lambda r: (r[3].date() - first).days < 7),
                                    ("later_weeks", lambda r: (r[3].date() - first).days >= 7)):
                g = {a: [r for r in arms[a] if in_group(r)] for a in arms}
                gx = {a: sum(r[4] for r in v) for a, v in g.items()}
                gn = {a: len(v) for a, v in g.items()}
                gz, gp = z_test(gx["control"], gn["control"], gx["variant"], gn["variant"])
                d["novelty"][label] = {"n": gn, "rate": {a: gx[a] / gn[a] for a in gn}, "p": gp,
                                       "expected": {a: sum(truth["expected14"][r[0]] for r in g[a]) / gn[a] for a in gn}}
        if name == "welcome_tips":
            d["path"] = peeking_path(rows)
            d["segments_significant"] = significant_segments(rows, channel, signup_platform, region)
        f["experiments"][name] = d
    f["crashed_users"] = len(truth["crashed"])
    f["api"] = {}
    for name, endpoint in pages["index.json"]["endpoints"].items():
        served = sum(len(p["rows"]) for path, p in pages.items() if path.startswith(f"{name}/"))
        f["api"][name] = {"rows": endpoint["total_rows"], "pages": endpoint["total_pages"], "served": served}
    return f


def peeking_path(rows: list[list[object]]) -> dict:
    """The p-value of the control-versus-variant test at the end of every day from day 7 on, for an experiment that has no
    effect: the first day it dips under 0.05, and where it ends."""
    ordered = sorted(rows, key=lambda r: (r[3], r[0]))
    first_day = ordered[0][3].date()
    counts = {"control": [0, 0], "variant": [0, 0]}  # converted, assigned
    path = []
    i = 0
    last_day = ordered[-1][3].date()
    day = first_day
    while day <= last_day:
        while i < len(ordered) and ordered[i][3].date() <= day:
            counts[ordered[i][2]][0] += ordered[i][4]
            counts[ordered[i][2]][1] += 1
            i += 1
        if (day - first_day).days + 1 >= 7:
            z, p = z_test(*counts["control"], *counts["variant"])
            path.append((day, p))
        day += timedelta(days=1)
    dipped = next(((d, p) for d, p in path if p < 0.05), None)
    return {
        "first_look_below_0_05": None if dipped is None else (dipped[0].isoformat(), dipped[1]),
        "day_number": None if dipped is None else (dipped[0] - first_day).days + 1,
        "looks_below_0_05": sum(1 for _, p in path if p < 0.05),
        "looks": len(path),
        "final_p": path[-1][1],
    }


def significant_segments(rows, channel, platform, region) -> dict:
    """How many of the one-way segments (5 channels, 3 platforms, 4 regions) of a no-effect experiment show p < 0.05."""
    segments = defaultdict(list)
    for r in rows:
        for label in (f"channel={channel[r[0]]}", f"platform={platform[r[0]]}", f"region={region[r[0]]}"):
            segments[label].append(r)
    hits = []
    for label, v in sorted(segments.items()):
        xs = {a: [r[4] for r in v if r[2] == a] for a in ("control", "variant")}
        if min(len(x) for x in xs.values()) < 50:
            continue
        z, p = z_test(sum(xs["control"]), len(xs["control"]), sum(xs["variant"]), len(xs["variant"]))
        if p < 0.05:
            hits.append((label, round(p, 4)))
    return {"segments": len(segments), "hits": hits}


def verify(tables: dict[str, Table], truth: dict, f: dict, pages: dict[str, dict]) -> None:
    """Fails loudly when the planted quirks are not in the data the way the README says."""
    users, events = tables["users"][1], tables["events"][1]
    subs, assignments = tables["subscriptions"][1], tables["experiment_assignments"][1]
    problems: list[str] = []

    def check(ok: bool, message: str) -> None:
        if not ok:
            problems.append(message)

    user_ids = {r[0] for r in users}
    check(len(user_ids) == len(users), "user_id is not unique")
    check(all(a[1] <= b[1] for a, b in zip(users, users[1:])), "user_id does not rise with signup_date")
    check(len({e[0] for e in events}) == len(events), "event_id is not unique")
    check(all(a[5] <= b[5] for a, b in zip(events, events[1:])), "event_id does not rise with received_at")
    check(len(events) < 300_000, "the events table has 300,000 rows or more")
    check(f["first_event"] >= FIRST_DAY.isoformat() and f["last_event"] < EXPORT_AT.isoformat(sep=" "), "events outside the period")
    check(f["orphan_users"] == DELETED_USERS == len(truth["deleted"]), "deleted accounts: orphan events are not 40 users")
    check({e[1] for e in events if e[1] not in user_ids} == truth["deleted"], "orphan events are not the deleted users'")
    check(f["users_without_events"] == NO_EVENT_USERS, "the number of users without events is wrong")
    check(f["future_dated_events"] == FUTURE_DATED_EVENTS, "the number of future-dated events is wrong")
    check(all(r[1] in user_ids for r in subs) and all(r[0] in user_ids for r in assignments), "an unknown user_id")

    # funnel and subscription tie-outs
    check(f["purchase_events"] == f["subscriptions_distinct"], "purchase events differ from distinct subscription_id")
    purchase_days = {(e[1], e[2].date()) for e in events if e[3] == "purchase"}
    check(all((r[1], r[3]) in purchase_days for r in subs), "a subscription starts on a day without a purchase event")
    checkouts = {e[1] for e in events if e[3] == "start_checkout"}
    check(all(e[1] in checkouts for e in events if e[3] == "purchase"), "a purchase by someone who never started a checkout")

    # the iOS rename and the outage
    check(not any(e[3] == "view_paywall" and e[4] == "ios" and e[2].date() >= RENAME_DAY for e in events), "late ios view_paywall")
    check(all(e[4] == "ios" and e[2].date() >= RENAME_DAY for e in events if e[3] == "paywall_viewed"), "stray paywall_viewed")
    check(all(e[5] >= OUTAGE[1] for e in events if OUTAGE[0] <= e[2] < OUTAGE[1]), "an event inside the outage arrived on time")
    check(f["outage_events"] > 100, "the outage hid too few events")

    # assignments
    check(len({r[0] for r in assignments}) == len(assignments), "a user is assigned twice")
    signup_ts = {e[1]: e[2] for e in events if e[3] == "signup_complete"}
    purchases = defaultdict(list)
    for e in events:
        if e[3] == "purchase":
            purchases[e[1]].append(e[2])
    for r in assignments:
        first, last, _ = EXPERIMENTS[r[1]]
        check(first <= r[3].date() <= last, f"user {r[0]} is assigned outside the window of {r[1]}")
        truth_flag = any(r[3] <= t <= r[3] + timedelta(days=CONVERSION_DAYS) for t in purchases[r[0]])
        check(truth_flag == r[4], f"user {r[0]}: converted differs from the purchase events")
    crashed_events = Counter(e[1] for e in events if e[1] in truth["crashed"])
    check(set(crashed_events.values()) <= {1}, "a crashed user has more than one event")
    check(f["experiments"]["signup_flow_v2"]["users_in_window_without_assignment"] == f["crashed_users"],
          "users without an assignment are not the crashed users")

    # what each experiment shows
    e1, e2, e3 = (f["experiments"][n] for n in EXPERIMENTS)
    check(e1["p"] < 0.05 and e1["rate"]["variant"] > e1["rate"]["control"], "paywall_v2 does not show its lift")
    check(e1["srm_p"] > 0.05 and e2["srm_p"] > 0.05, "a clean experiment fails the sample-ratio check")
    week1, later = e1["novelty"]["first_week"], e1["novelty"]["later_weeks"]
    week1_diff = week1["rate"]["variant"] - week1["rate"]["control"]
    later_diff = later["rate"]["variant"] - later["rate"]["control"]
    check(later["p"] < 0.05 and week1_diff > 2 * later_diff > 0, "paywall_v2 does not show a larger lift in week one")
    north_america, elsewhere = f["holiday"]["north_america"], f["holiday"]["elsewhere"]
    check(north_america[0] < 0.7 * north_america[1] and elsewhere[0] > 0.75 * elsewhere[1],
          "Memorial Day does not dip for north_america only")
    check(e2["path"]["first_look_below_0_05"] is not None and 10 <= e2["path"]["day_number"] <= 30 and e2["path"]["final_p"] > 0.5,
          "welcome_tips does not show an early dip below 0.05 that ends high")
    check(e3["srm_p"] < 0.001, "signup_flow_v2 does not fail the sample-ratio check")
    check(e3["p"] < 0.05 and e3["rate"]["variant"] > e3["rate"]["control"], "signup_flow_v2 does not look like a win")

    # the mix shift, the reversal, the confounder
    mix = f["mix"]
    check(EXPERIMENTS["paywall_v2"][1] < CLEAN_BASELINE_FROM, "the clean baseline window overlaps paywall_v2")
    check(mix["before"]["conversion"] - mix["during"]["conversion"] > 0.02, "the mix shift does not lower conversion")
    check(mix["before_all"]["conversion"] - mix["before_all_without_paywall_variant"] > 0.004,
          "the paywall_v2 variant does not lift the January to April baseline")
    check(abs(mix["during_with_before_rates"] - mix["during"]["conversion"]) < 0.01,
          "the mix does not explain the fall from the clean baseline")
    check(mix["during"]["paid_social_share"] > 3 * mix["before"]["paid_social_share"], "the campaign adds too few signups")
    check(all(abs(mix["during"]["by_channel"][c] - mix["before"]["by_channel"][c]) < 0.03 for c in CHANNELS),
          "a channel's own conversion moved during the campaign")
    overall = f["platform_overall"]
    check(overall["web"] > overall["ios"], "web does not convert better than ios overall")
    for c, rates in f["platform_by_channel"].items():
        if "web" in rates and min(f["platform_by_channel_n"][c]["web"], f["platform_by_channel_n"][c]["ios"]) >= 300:
            check(rates["ios"] > rates["web"], f"ios does not beat web inside {c}")
    eng = f["engagement"]
    check(eng["r_overall"] > 0.05 and all(abs(r) < 0.05 for r in eng["r_within_channel"].values()),
          "engagement is not correlated with conversion overall and flat inside channels")
    significant = [c for c, p in f["ios_vs_web_p"].items() if p < 0.05]
    check(significant == ["referral"], "ios against web inside a channel is significant somewhere other than referral only")
    act = f["ios_vs_android_activity"]
    check(act["web"] > act["ios"] > act["android"], "mean activity is not web, then ios, then android")
    check(f["ios_vs_android_activity"]["p"] < 0.001 and f["ios_vs_android_activity"]["d"] < 0.2,
          "ios against android activity is not tiny but significant")

    # the JSON files
    check(f["api"]["events"]["served"] - f["api"]["events"]["rows"] == API_OVERLAP[1], "events pages do not repeat 3 rows")
    check(f["api"]["subscriptions"]["served"] == f["api"]["subscriptions"]["rows"], "subscription pages repeat rows")
    check(f["api"]["events"]["rows"] == f["events_in_api"], "the events endpoint holds the wrong rows")
    if problems:
        raise SystemExit("app-events checks failed:\n  " + "\n  ".join(problems))


def readme_claims(f: dict) -> list[str]:
    """Figures the README must quote exactly as measured, so a rebuild cannot leave the README stale."""
    n = lambda v: f"{v:,}"
    pct = lambda x: f"{100 * x:.1f}%"
    e1, e2, e3 = (f["experiments"][name] for name in EXPERIMENTS)
    views = f["paywall_views_four_weeks"]
    claims = [n(v) for v in f["rows"].values()]
    claims += [n(f["subscriptions_distinct"]), n(f["subscriptions_with_several_rows"]), n(f["users_with_several_subscriptions"]),
               n(f["subscription_rows_exact_duplicates_extra"]), n(f["resync_rows"])]
    claims += [n(f["outage_events"]), n(f["late_events"]), n(f["duplicate_events_extra"]), n(f["orphan_events"]),
               n(f["not_yet_received_at_export"]), n(f["events_in_api"]), n(f["api"]["events"]["served"]),
               str(f["api"]["events"]["pages"]), str(f["api"]["subscriptions"]["pages"])]
    claims += [n(v) for v in f["event_names"].values()] + [n(v) for v in f["event_users"].values()]
    claims += [n(views["before"]["view_paywall"]), n(views["after"]["view_paywall"]), n(views["after"]["both_names"])]
    for e in (e1, e2, e3):
        claims += [n(e["n"]["control"]), n(e["n"]["variant"]), pct(e["rate"]["control"]), pct(e["rate"]["variant"]),
                   f"{e['p']:.3f}"]
    novelty = e1["novelty"]
    for part in novelty.values():
        claims += [n(part["n"]["control"]), n(part["n"]["variant"]), pct(part["rate"]["control"]), pct(part["rate"]["variant"]),
                   f"{part['p']:.3f}", pct(part["expected"]["control"]), pct(part["expected"]["variant"])]
    claims += [f"{v:.2f}" for v in f["lift_curve"].values()]
    holiday = f["holiday"]
    claims += [n(holiday["north_america"][0]), f"{holiday['north_america'][1]:.1f}", n(holiday["elsewhere"][0]),
               f"{holiday['elsewhere'][1]:.1f}"]
    claims += [pct(e1["expected_rate"]["control"]), pct(e1["expected_rate"]["variant"]),
               f"{e1['early_cancel']['control'][0]} of {e1['early_cancel']['control'][1]}",
               f"{e1['early_cancel']['variant'][0]} of {e1['early_cancel']['variant'][1]}", f"{e1['early_cancel_p']:.3f}"]
    path = e2["path"]
    claims += [path["first_look_below_0_05"][0], f"{path['first_look_below_0_05'][1]:.3f}", f"day {path['day_number']}",
               f"{path['looks_below_0_05']} of {path['looks']}"]
    claims += [label for label, _ in e2["segments_significant"]["hits"]]
    claims += [f"p = {p:.3f}" for _, p in e2["segments_significant"]["hits"]]
    claims += [f"{e3['srm_p']:.4f}", n(f["crashed_users"]), pct(e3["expected_rate"]["control"]), pct(e3["expected_rate"]["variant"])]
    mix = f["mix"]
    periods = ("before", "before_all", "during", "after")
    claims += [pct(mix[k]["conversion"]) for k in periods] + [pct(mix[k]["paid_social_share"]) for k in periods]
    claims += [pct(mix["before_all_without_paywall_variant"]), n(mix["before_all"]["n"])]
    claims += [pct(v) for c in CHANNELS for v in (mix["before"]["by_channel"][c], mix["during"]["by_channel"][c])]
    claims += [pct(mix["during_with_before_rates"]), n(mix["before"]["n"]), n(mix["during"]["n"]), n(mix["after"]["n"])]
    claims += [n(v) for v in f["users_by_channel"].values()] + [n(f["plan_at_signup"]["plus"])]
    claims += [pct(v) for v in f["platform_overall"].values()]
    claims += [pct(v) for rates in f["platform_by_channel"].values() for v in rates.values()]
    eng = f["engagement"]
    claims += [f"{eng['r_overall']:.2f}", pct(eng["high_conversion"]), pct(eng["low_conversion"]), pct(eng["high_share"])]
    act = f["ios_vs_android_activity"]
    claims += [f"{act['ios']:.2f}", f"{act['android']:.2f}", f"{act['web']:.2f}", f"{act['d']:.2f}"]
    claims += [n(f["late_filter_all"]), n(f["late_filter_all"] - f["late_events"])]
    claims += [f"{p:.3f}" for p in f["ios_vs_web_p"].values()]
    claims += [str(SEED)] + [str(EXPERIMENTS[name][2]) for name in EXPERIMENTS]
    ended = f["subscriptions_ended"] / f["subscriptions_distinct"]
    claims += [pct(f["conversion_overall"]), pct(1 - f["conversion_overall"]), pct(ended), pct(1 - ended)]
    claims += [n(v) for v in f["june_active_people"].values()]
    return claims


# ---------------------------------------------------------------------------------------------------------------------
# Files
# ---------------------------------------------------------------------------------------------------------------------

SQL_TYPES = {
    "user_id": "INTEGER", "signup_date": "DATE", "channel": "VARCHAR", "region": "VARCHAR", "plan_at_signup": "VARCHAR",
    "event_id": "INTEGER", "event_ts": "TIMESTAMP", "event_name": "VARCHAR", "platform": "VARCHAR",
    "received_at": "TIMESTAMP", "subscription_id": "INTEGER", "plan": "VARCHAR", "started_on": "DATE", "ended_on": "DATE",
    "updated_at": "TIMESTAMP", "cancel_reason": "VARCHAR", "experiment": "VARCHAR", "variant": "VARCHAR",
    "assigned_at": "TIMESTAMP", "converted": "BOOLEAN",
}


def text(v: object) -> str:
    if v is None:
        return ""
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, datetime):
        return v.strftime("%Y-%m-%d %H:%M:%S")
    if isinstance(v, date):
        return v.isoformat()
    return str(v)


def to_csv(header: list[str], rows: list[list[object]]) -> str:
    buf = io.StringIO()
    w = csv.writer(buf, lineterminator="\n")
    w.writerow(header)
    for r in rows:
        w.writerow([text(v) for v in r])
    return buf.getvalue()


def to_sql(tables: dict[str, Table]) -> str:
    out = [
        "-- app-events v1: DuckDB load script. Synthetic data, CC BY 4.0, https://datafromzero.github.io",
        "-- Generated by scripts/build-app-events.py; do not edit by hand.",
        "-- Run it from the folder that holds the CSV files (datasets/app-events/v1/). To load from the web instead, replace",
        "-- each file name with the release-tag URL of that file (see README.md).",
        "",
    ]
    for name, (header, _) in tables.items():
        cols = ",\n  ".join(f"{c} {SQL_TYPES[c]}" for c in header)
        out.append(f"CREATE OR REPLACE TABLE {name} (\n  {cols}\n);")
        out.append(f"COPY {name} FROM '{name}.csv' (HEADER, DELIMITER ',');")
        out.append("")
    return "\n".join(out)


def to_xlsx(tables: dict[str, Table], path: Path) -> None:
    from openpyxl import Workbook
    from openpyxl.cell import WriteOnlyCell
    from openpyxl.styles import Font

    wb = Workbook(write_only=True)
    for name, (header, rows) in tables.items():
        ws = wb.create_sheet(name)
        ws.freeze_panes = "A2"
        formats = {i: "yyyy-mm-dd hh:mm:ss" if SQL_TYPES[h] == "TIMESTAMP" else "yyyy-mm-dd" if SQL_TYPES[h] == "DATE" else None
                   for i, h in enumerate(header)}
        for i, h in enumerate(header):
            ws.column_dimensions[chr(ord("A") + i)].width = 21 if SQL_TYPES[h] == "TIMESTAMP" else max(12, len(h) + 2)
        head = []
        for h in header:
            cell = WriteOnlyCell(ws, value=h)
            cell.font = Font(bold=True)
            head.append(cell)
        ws.append(head)
        for r in rows:
            out = []
            for i, v in enumerate(r):
                if formats[i] and v is not None:
                    cell = WriteOnlyCell(ws, value=v)
                    cell.number_format = formats[i]
                    out.append(cell)
                else:
                    out.append(v)
            ws.append(out)
    wb.properties.creator = "datafromzero"
    wb.save(path)
    stabilize(path)


def stale_pages(files: dict[str, str]) -> list[str]:
    """JSON files on disk that the generator no longer writes (an earlier build had more pages)."""
    found = (OUT / "api").rglob("*.json") if (OUT / "api").is_dir() else []
    return sorted(str(p.relative_to(OUT)) for p in found if str(p.relative_to(OUT)) not in files)


def docs_problems(tables: dict[str, Table], facts: dict) -> list[str]:
    """schema.yaml and README.md must quote the row counts and measured figures of the data."""
    problems = []
    schema, readme = DATASET / "schema.yaml", DATASET / "README.md"
    if not schema.is_file() or not readme.is_file():
        return ["schema.yaml or README.md is missing"]
    declared = {m[1]: int(m[2]) for m in re.finditer(r"- name: (\w+)\n    file: \S+\n    rows: (\d+)", schema.read_text())}
    declared |= {f"api {m[1]}": int(m[2]) for m in re.finditer(r"- \{ name: (\w+), first_page: \S+, rows: (\d+)", schema.read_text())}
    actual = {name: len(rows) for name, (_, rows) in tables.items()}
    actual |= {f"api {name}": api["rows"] for name, api in facts["api"].items()}
    problems += [f"schema.yaml says {declared.get(k)} rows for {k}, the data has {v}" for k, v in actual.items() if declared.get(k) != v]
    stale = sorted({c for c in readme_claims(facts) if c not in readme.read_text()})
    if stale:
        problems.append(f"README.md does not quote these measured figures: {', '.join(stale)}")
    return problems


def main() -> None:
    tables, truth = build()
    pages = api_pages(tables)
    facts = measure(tables, truth, pages)
    verify(tables, truth, facts, pages)
    if "--facts" in sys.argv:
        print(json.dumps(facts, indent=2, default=str))
        return
    files = {f"{name}.csv": to_csv(h, rows) for name, (h, rows) in tables.items()}
    files[f"{DATASET.name}.sql"] = to_sql(tables)
    for path, page in pages.items():
        files[f"api/{path}"] = json.dumps(page, separators=(",", ":"), ensure_ascii=False) + "\n"
    if "--check" in sys.argv:
        bad = [f for f, body in files.items() if not (OUT / f).is_file() or (OUT / f).read_text() != body]
        bad += stale_pages(files)
        if bad:
            raise SystemExit(f"app-events v1 differs from the generator: {', '.join(bad)}")
        problems = docs_problems(tables, facts)
        if problems:
            raise SystemExit("\n".join(problems))
        print("app-events v1 matches the generator.")
        return
    for stale in stale_pages(files):
        (OUT / stale).unlink()
    for f, body in files.items():
        target = OUT / f
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(body)
    to_xlsx(tables, OUT / "app-events.xlsx")
    for name, (_, rows) in tables.items():
        print(f"{name}: {len(rows)} rows")
    problems = docs_problems(tables, facts)
    if problems:
        raise SystemExit("\n".join(problems))


if __name__ == "__main__":
    main()
