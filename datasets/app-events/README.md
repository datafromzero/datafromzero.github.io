# app-events

A fictional personal-budgeting app with a free tier and a paid plan called **Plus**. People sign up through one of five
channels, add expenses, meet a paywall, subscribe, cancel, and some of them are part of three A/B tests. The data covers
six months (January 1 to June 30, 2026) and is used from SQL and Python to the data tracks, so one dataset answers
questions about funnels, retention, experiments, churn and ingestion.

The data is **synthetic**: a script generated it from a stated model (see "True parameters"), and no row describes a real
person or a real app. That is the point of this dataset: where a lesson says "the truth is X", X is a number written
below, not a guess. All times are UTC.

License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Credit: datafromzero, https://datafromzero.github.io.

## Files (version 1)

| File | Rows | One row is |
|---|---:|---|
| `v1/users.csv` | 21,841 | a person who created an account |
| `v1/events.csv` | 177,379 | one thing the app recorded (a signup, a visit, an expense, a purchase, ...) |
| `v1/subscriptions.csv` | 3,840 | one saved version of a subscription (2,905 different subscriptions, so some appear more than once) |
| `v1/experiment_assignments.csv` | 15,868 | one person in one experiment |
| `v1/app-events.xlsx` | | all four tables, one sheet each |
| `v1/app-events.sql` | | a DuckDB script that creates the four tables and loads the four CSV files |
| `v1/api/events/page-001.json` and on | 18,437 | the events received from June 16 on, served as 19 pages of up to 1,000 rows |
| `v1/api/subscriptions/page-001.json` and on | 3,840 | every subscription row, 4 pages of up to 1,000 rows |
| `v1/api/index.json` | | the two endpoints, their first page and their totals |

Row counts do not include the header row. The CSV files are UTF-8, comma-separated, with a header row and `\n` line
endings. An empty field means the value is missing (NULL). Timestamps are `YYYY-MM-DD HH:MM:SS`, dates are `YYYY-MM-DD`,
and a boolean is `true` or `false`.

**Size.** The events sheet of the workbook holds all 177,379 events, far below the limit of 1,048,576 rows of an Excel
sheet, but it is the heavy sheet (the whole workbook is about 7 MB), so sorting or a PivotTable on it is slow. Use the CSV for
anything beyond a first look. No Excel lesson depends on this dataset.

**The in-page SQL runner.** The runner of the SQL stage (D42) cannot load this dataset today: `src/scripts/sql-runtime.ts` is
written for cafe-sales, and `events.csv` is 13 MB. The SQL-stage lessons that the curriculum map ties to `app-events` use
cafe-sales. Until a decision is made, this dataset is for Colab and Python notebooks, a local DuckDB and Excel.

**Where notebooks and lessons load it.** Notebooks read the CSV and JSON files from a release tag, never from `main`
(SPEC §7). The pattern is

```text
https://raw.githubusercontent.com/datafromzero/datafromzero.github.io/<tag>/datasets/app-events/v1/events.csv
https://raw.githubusercontent.com/datafromzero/datafromzero.github.io/<tag>/datasets/app-events/v1/api/events/page-001.json
```

This dataset is newer than the pre-release tag `v0.1.0`, so a lesson links to it only after the owner creates the first
tag that contains `datasets/app-events/`; `<tag>` is that tag. `v1/` never changes, so the links keep working.

## Columns

Grain first, because it is the first thing a lesson asks: **`users` has one row per person, `events` one row per recorded
event, `subscriptions` one row per saved version of a subscription (not per subscription), `experiment_assignments` one
row per person and experiment.**

### users

| Column | Type | Meaning |
|---|---|---|
| `user_id` | integer | Key of the person; 10001 and up, rises with the signup time |
| `signup_date` | date | Day of the `signup_complete` event (UTC) |
| `channel` | text | How the person arrived: `organic_search`, `referral`, `app_store`, `paid_search` or `paid_social` |
| `region` | text | `north_america`, `europe`, `latin_america` or `asia_pacific` |
| `plan_at_signup` | text | `free`, or `plus` when the person bought Plus on the signup screen |

There is no platform column: the platform of a person is the `platform` of their `signup_complete` event.

### events

| Column | Type | Meaning |
|---|---|---|
| `event_id` | integer | Key of the event; 1000001 and up, in the order events were **received**, not the order they happened |
| `user_id` | integer | The person; a key of `users` (40 accounts were deleted, see the quirks) |
| `event_ts` | timestamp | When it happened on the device or server (UTC) |
| `event_name` | text | `signup_complete`, `onboarding_complete`, `session_start`, `add_expense`, `view_paywall`, `paywall_viewed`, `start_checkout`, `purchase`, `plus_feature_used` or `cancel_subscription` |
| `platform` | text | `ios`, `android` or `web` |
| `received_at` | timestamp | When the data collector stored it (UTC); added to the columns of the curriculum map so that "late" can be measured |

Rows and people per event name:

| `event_name` | Rows | People | What it records |
|---|---:|---:|---|
| `signup_complete` | 21,871 | 21,871 | The account was created. One per person (21,841 users, 40 deleted accounts, minus 10 users without any event) |
| `onboarding_complete` | 15,082 | 15,082 | The person finished the first-run screens |
| `session_start` | 34,328 | 14,528 | A return visit (never the first visit: that is the signup) |
| `add_expense` | 63,453 | 16,676 | An expense was added; the main use of the app |
| `view_paywall` | 11,142 | 9,181 | The Plus paywall was shown |
| `paywall_viewed` | 1,303 | 1,099 | The same event as `view_paywall`, under its new name in the iOS app from 2026-05-18 |
| `start_checkout` | 4,757 | 4,680 | The person opened checkout |
| `purchase` | 2,905 | 2,849 | A Plus subscription started; one per subscription (also for people who subscribe again) |
| `plus_feature_used` | 21,839 | 2,522 | A Plus-only feature was used; only exists while a subscription is active |
| `cancel_subscription` | 699 | 692 | A subscription was canceled |

### subscriptions

| Column | Type | Meaning |
|---|---|---|
| `subscription_id` | integer | Key of the subscription; 70001 and up. **Not unique in this table** (a subscription is saved again whenever it changes) |
| `user_id` | integer | The subscriber; a key of `users` |
| `plan` | text | `plus_monthly` or `plus_annual` |
| `started_on` | date | Day of the `purchase` event that started it |
| `ended_on` | date | Day it was canceled; empty while it is active |
| `updated_at` | timestamp | When this version of the row was saved (UTC) |
| `cancel_reason` | text | `too_expensive`, `not_using`, `missing_feature`, `found_alternative` or `other`; empty while the subscription is active |

The current state of a subscription is its row with the latest `updated_at`. Prices are not a column: Plus costs $7.99 a
month or $59.99 a year.

### experiment_assignments

| Column | Type | Meaning |
|---|---|---|
| `user_id` | integer | The person; a key of `users` |
| `experiment` | text | `paywall_v2`, `welcome_tips` or `signup_flow_v2` |
| `variant` | text | `control` or `variant` |
| `assigned_at` | timestamp | When the person was put in the experiment: 1 to 3 seconds after their `signup_complete` |
| `converted` | boolean | A `purchase` event within 14 days after `assigned_at` |

A person is in at most one experiment: every experiment takes the people who sign up inside its own window.

## The story in dates

| Date (2026) | What happens |
|---|---|
| January 1 | The data starts: every account in `users` was created on or after this day |
| January 12 to March 8 | Experiment `paywall_v2` (a redesigned paywall) enrolls every new signup; its lift is largest in the first week (a novelty effect) |
| March 16 to April 26 | Experiment `welcome_tips` (tips on the first screens) enrolls every new signup |
| March 17, 14:00 to 19:59 | The collector is down; the events of those hours arrive at 20:00 and after |
| April 13 to June 7 | A paid-social campaign: many more signups, all from `paid_social`, which converts poorly |
| May 4 to June 7 | Experiment `signup_flow_v2` (a new signup screen) enrolls every new signup |
| May 18 | The iOS app starts sending `paywall_viewed` instead of `view_paywall` |
| May 25 | Memorial Day, a US public holiday: visits from `north_america` dip for one day |
| June 30 | The data ends; the export was taken on July 1 at 00:00 UTC |

**A clean baseline.** The stretch before the campaign, January 1 to April 12, is not a clean baseline for a before and
after comparison: it holds `paywall_v2` (a real lift, January 12 to March 8) and `welcome_tips` (no effect, from March 16).
The clean window is **March 9 to April 12**: the people who signed up after `paywall_v2` ended, while only `welcome_tips`
runs, and it has no effect.

## True parameters

These constants are what the generator uses. A lesson can say "the truth is" and quote them. Measured numbers further down
are what the data shows, which differs from the truth by sampling noise.

**Signups.** The baseline of ordinary signups a day is 90 on January 1, rising in a straight line to 125 on June 30,
with Poisson noise. The day of the week scales it (Monday 1.00, Tuesday 1.05, Wednesday 1.05, Thursday 1.00, Friday 0.90,
Saturday 0.75, Sunday 0.80), and the first three days of a month are 1.3 times busier (people plan a budget at the start
of the month). Channel shares of ordinary signups: `organic_search` 30%, `app_store` 25%, `referral` 20%,
`paid_search` 15%, `paid_social` 10%. Regions: `north_america` 42%, `europe` 28%, `asia_pacific` 18%, `latin_america` 12%;
the region decides the hour of day of a person's events (local evening and morning peaks) and, for `north_america`, the
holiday dip below, and has **no effect on anything else**. The campaign adds 55 `paid_social` signups a day at full size (scaled by the same weekday factor) from April 13 to June 7,
ramping from 40% to full size over the first week, and stops on June 8. In all, 21,881 accounts were created; the 40 deleted ones are not in `users`.

**Platform and devices.** The platform of a signup depends on the channel (the share of each platform):

| Channel | `web` | `ios` | `android` |
|---|---:|---:|---:|
| `organic_search` | 65% | 15% | 20% |
| `referral` | 55% | 25% | 20% |
| `app_store` | 0% | 55% | 45% |
| `paid_search` | 35% | 35% | 30% |
| `paid_social` | 5% | 50% | 45% |

About 92% of a person's later events come from their own platform and 8% from another. 35% of Android users have an old
version of the operating system. That fact is hidden: it is in no column, but it matters for one experiment.

**Buying.** Every person goes through the same coin flips, in this order. A person chooses Plus on the signup screen with
the `plus_signup` chance and then buys within minutes. Everyone else sees the paywall with the `view` chance, and a viewer
buys with the `buy` chance, scaled by a platform factor (iOS 1.25, others 1.0) and by 0.15 for an old Android device.

| Channel | `plus_signup` | `view` (sees the paywall) | `buy` (buys, given a view) | Finishes onboarding | Activity factor |
|---|---:|---:|---:|---:|---:|
| `organic_search` | 2.0% | 55% | 26% | 78% | 1.20 |
| `referral` | 3.0% | 60% | 38% | 85% | 1.80 |
| `app_store` | 1.5% | 50% | 20% | 72% | 1.00 |
| `paid_search` | 1.5% | 50% | 17% | 68% | 0.85 |
| `paid_social` | 0.5% | 35% | 10% | 45% | 0.35 |

15% of viewers first see the paywall 15 to 100 days after signup, so about 0.845 of viewers see it, and buy, within 14 days;
of the rest, 40% see it within 12 hours and the others 1 day plus an exponential wait with a mean of 3 days. The checkout
follows the view within 1 to 7 minutes and the purchase 30 seconds to 4 minutes after that. **Buying does not depend on how active a person
is.** Only the channel, the platform, an old device and the experiment arm change it.

**Activity.** A person's activity is a log-normal draw with mean 1 and spread 0.55, times the activity factor of the channel
and 1.10 for iOS (a small real difference). The number of later days on which the person opens the app is Poisson with a
mean of 1.8 times the activity; each is a delay of 1 day plus an exponential wait (mean 9 days for 75% of the days, 45 days
for the rest), a quarter of weekend days are skipped, and each visit adds Poisson(1.0 times the square root of the activity)
expenses, as does the first day. Paying for Plus does not change how often someone visits; it only adds `plus_feature_used`
events, at 0.08 a day times the activity.

**Subscriptions and churn.** 25% of purchases are annual. An annual subscriber cancels within 14 days with a chance of 5%
and then never. A monthly subscriber decides at every 30-day renewal: the chance to cancel is 0.14 times the activity to the
power of minus 0.6 (more active people stay), 1.3 times that at the first renewal, never above 0.6. At the second renewal
6% of the monthly subscribers move to the annual plan instead (a new row of the same subscription). 12% of people who
cancel buy again 10 to 60 days later (a new subscription, monthly). So **engagement does cause retention here, and
channel does not cause buying through engagement**. The `cancel_reason` is drawn with weights 3 too expensive, 2 missing
feature, 2 found alternative, 1 other, and 6 not using for people with activity below 0.8 (1.5 for the others).

**Assumptions for lifetime-value lessons.** These are fictional and not in any table: the average ad cost per signup is
$4.50 for `paid_search`, $2.00 for `paid_social`, $3.00 for `referral` (a reward credit), and $0 for `organic_search` and
`app_store`.

### The three experiments

Each experiment enrolls every new signup in its window, with a fair coin per person.

| Experiment | Signups from to | Users (control, variant) | True effect |
|---|---|---|---|
| `paywall_v2` | 2026-01-12 to 2026-03-08 | 2,706 and 2,713 | **Real and modest, with a novelty effect.** The `buy` chance after a view is multiplied by a lift that depends on the day a person signed up (see below) and settles at a steady 1.20, in every channel. The model's chance of a purchase within 14 days, averaged over the people in each group, is 12.4% in control and 15.1% in the variant (computed from the parameters, not from outcomes). Its buyers also cancel more at the first renewal: that chance is multiplied by 1.3 |
| `welcome_tips` | 2026-03-16 to 2026-04-26 | 2,449 and 2,519 | **None.** The variant changes nothing for anyone |
| `signup_flow_v2` | 2026-05-04 to 2026-06-07 | 2,878 and 2,603 | **None**, and the experiment is broken (see the sample-ratio quirk) |

The random labels of all three experiments were chosen from a few dozen to a few hundred candidates so that each tells its
story (`paywall_v2` shows a clearly larger first week); the truth does not depend on that choice. The seed (20260301) and the
salts (17, 350 and 3) are part of the v1 contract: changing one changes the data, so it would need a `v2/`. Tests below are two-sided z tests for two proportions with a
pooled standard error (the same p as a chi-square test without continuity correction).

**The `paywall_v2` lift curve (the novelty effect).** For a variant person who signed up `d` days after January 12, the
multiplier on the `buy` chance is 1.20 plus 0.50 times e to the power of minus `d` over 6. It is a smooth curve, not a step:

| Days after the start | 0 | 3 | 6 | 7 | 14 | 28 | 55 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Multiplier on `buy` | 1.70 | 1.50 | 1.38 | 1.36 | 1.25 | 1.20 | 1.20 |

Measured, by the week of signup (days 0 to 6 against day 7 on), from `converted`:

| Signups | Users (control, variant) | Control | Variant | Difference | p | Model: control, variant |
|---|---|---:|---:|---:|---:|---|
| First week | 321 and 304 | 12.8% | 19.4% | +6.6 points | 0.024 | 12.4% and 17.6% |
| Weeks 2 to 8 | 2,385 and 2,409 | 12.7% | 14.8% | +2.1 points | 0.033 | 12.4% and 14.8% |
| All eight weeks | 2,706 and 2,713 | 12.7% | 15.3% | +2.6 points | 0.005 | 12.4% and 15.1% |

A test that stops after week one overstates the long-run lift; the steady lift is the ×1.20 of the later weeks.

## Planted quirks

Real data is never clean, so the data is odd on purpose. Every row of this table can be found with a query, and the
numbers are what the data shows.

| # | Quirk | Where | Size | The truth | Used by |
|---:|---|---|---|---|---|
| 1 | Subscription rows repeated | `subscriptions` | 3,840 rows for 2,905 subscriptions; 874 subscriptions have several rows | A subscription is saved again at every change (a plan change, a cancel). 82 rows are a nightly re-sync that changed nothing (a later `updated_at`, same values) and 97 are exact copies written by a retried load. The row with the latest `updated_at` is the truth. 55 people have more than one subscription (they subscribed again) | `sql-deduplicate-latest-record`, `data-engineer-incremental-loads-idempotency`, `data-engineer-data-quality-checks` |
| 2 | Late events | `events` | 912 events arrived 1 hour to 3 days after they happened, not counting the 240 events of the outage (the plain filter `received_at - event_ts >= 1 hour` also catches 223 of those and gives 1,135) | 1.3% of the usage events from phones (`session_start`, `add_expense`, `plus_feature_used` on `ios` or `android`) are held on the device and sent later. Their `event_id` is higher than events that happened after them. 12 more were still on their way when the data was exported, so they are missing | `sql-funnels`, `core-sampling-and-bias`, `data-engineer-streaming-concepts`, `data-engineer-incremental-loads-idempotency` |
| 3 | A collector outage | `events` | 240 events | Events with `event_ts` between 2026-03-17 14:00 and 19:59 arrived between 20:00 and 20:29 the same day. Nothing is lost; counted by `received_at`, the hours are empty and 20:00 is a spike | `core-diagnosing-a-movement`, `data-engineer-backfills-and-failure-recovery` |
| 4 | Duplicate events | `events` | 835 extra rows | A client retry wrote the same event twice: identical `user_id`, `event_ts`, `event_name` and `platform`, a different `event_id`, a `received_at` 1 to 20 seconds later. Never for `purchase`, `cancel_subscription`, `signup_complete` or `onboarding_complete` | `sql-funnels`, `core-defining-metrics`, `data-engineer-data-quality-checks` |
| 5 | Future-dated events | `events` | 30 events | The phone clock ran 1 to 5 hours ahead: `event_ts` is later than `received_at` | `data-engineer-data-quality-checks` |
| 6 | Deleted accounts | `events` | 393 events of 40 people | Accounts that signed up from January 1 to 11 and never subscribed were deleted: the row left `users` but the events stayed. An analysis that starts from `users` sees only the survivors: none of the 40 had subscribed, so conversion among the signups of January 1 to 11 looks higher than it was | `core-sampling-and-bias` (survivorship), `data-engineer-data-quality-checks` |
| 7 | Users without events | `users` | 10 people | Created by an import, free, signed up June 8 to 30, no event of any kind | `core-sampling-and-bias`, `core-defining-metrics` (the denominator) |
| 8 | A renamed event | `events` | 1,303 `paywall_viewed` rows | From 2026-05-18 the iOS app sends `paywall_viewed`; the other platforms still send `view_paywall`. In the four weeks before there are 2,379 `view_paywall` events; in the four weeks from May 18 there are 1,619 `view_paywall` and 2,533 with both names. Nothing about behavior changed | `core-diagnosing-a-movement`, `sql-funnels`, `data-engineer-data-quality-checks` |
| 9 | The mix shift | `users`, `events` | 14-day conversion falls from 12.9% (the clean baseline, March 9 to April 12) to 9.9% | The campaign (April 13 to June 7) raised the share of `paid_social` signups from 9.9% to 37.7% (9.3% after it ended). Use March 9 to April 12 (3,622 people, 12.9%) as the baseline. The longer window of January 1 to April 12 (9,989 people, 13.7%) is not clean: it holds the `paywall_v2` variant (2,713 people at 15.3%), which adds about 0.6 points (13.1% without them), so the channel rates of that window are not the channel rates of the campaign weeks. With the channel rates of the clean baseline and the campaign's channel mix, conversion would be 10.1% against 9.9% observed: the mix explains about 2.8 of the 3.0 points. The small rest is sampling noise and a third contributor, `signup_flow_v2`: the 367 people of quirk 15 cannot buy. It recovers to 14.7% after June 7. In weekly cohorts (weeks start on Monday) the `paid_social` share is 29.9% in the week of April 13 and 35% to 41% from April 20 to June 1; the weekly conversion is 12.0% to 14.6% in the weeks from March 9 to April 6 and 8.0% to 11.4% in the weeks from April 20 to June 1 | `core-diagnosing-a-movement`, `core-correlation-and-causation`, `ml-engineer-monitoring-drift-and-retraining` (a change in the inputs, not in the relationship) |
| 10 | A confounder | `users`, `events` | Engaged people convert more | Channel drives both activity and buying. People with 5 or more `session_start` and `add_expense` events in their first 7 days (18.3% of people) convert at 16.5%, the others at 11.0%, and the correlation of those event counts with converting is 0.08. Inside a channel it is near zero | `core-correlation-and-causation`, `core-study-design-and-data-types` |
| 11 | A reversal (Simpson) | `users`, `events` | Web beats iOS overall; iOS beats web in every channel that has web users (`app_store` has none) | Overall 14-day conversion is 16.3% for people who signed up on web, 12.5% on iOS and 7.3% on Android, because web people come mostly through high-converting channels. Inside each channel iOS converts better than web (the true factor is 1.25), but the gaps are mostly inside the noise: only `referral` is significant (p = 0.0004; `organic_search` p = 0.214, `paid_search` p = 0.222, `paid_social` p = 0.120) | `core-correlation-and-causation` |
| 12 | A tiny real difference | `events` | iOS vs Android activity | Mean `session_start` plus `add_expense` events in the first 14 days: 3.30 on iOS, 2.86 on Android (Cohen's d = 0.11: a very small p-value but a small effect). The platform factor in the model is 1.10. Web has the highest mean (4.29), because of the channel mix, not the platform | `core-comparing-groups` (statistical against practical significance) |
| 13 | An experiment with no effect | `experiment_assignments` | `welcome_tips` | The result is not significant (12.4% against 12.1%, p = 0.776). The first day on which the running p-value is under 0.05 is day 12 (2026-03-27, p = 0.022): stopping there would call a winner. It is under 0.05 on 3 of 36 daily looks from day 7 on. Of the 12 one-way segments (channel, platform, region) two are under 0.05 although nothing is there: `platform=ios` (p = 0.024) and `platform=web` (p = 0.027) | `core-hypothesis-testing` (peeking, multiple comparisons), `core-experiments-ab-testing`, `data-scientist-experiment-analysis-in-python` |
| 14 | A real, modest lift with a novelty effect | `experiment_assignments` | `paywall_v2` | 12.7% in control, 15.3% in the variant, p = 0.005; the true steady lift is ×1.20 on the `buy` step. The lift is larger in the first week (+6.6 points, against +2.1 from week 2 on), as the curve above says. Its guardrail moves in the wrong direction but not conclusively: of the buyers, 48 of 343 in control and 75 of 415 in the variant canceled within 30 days of starting (p = 0.130), although the true first-renewal cancel chance is 1.3 times higher | `core-comparing-groups`, `core-experiments-ab-testing`, `data-analyst-ab-test-readout` |
| 15 | A sample-ratio mismatch | `experiment_assignments` | `signup_flow_v2` | 2,878 in control and 2,603 in the variant: the sample-ratio p-value is 0.0002 for a 50/50 split. **Cause:** the new signup screen of the variant crashes on devices with an old Android version, before the assignment is written. The account already exists, so the person is in `users` with one `signup_complete` event and no more, but has no assignment row. 367 users signed up in the window and have no row, all on Android. The test reads like a win (9.5% against 11.2%, p = 0.032) and is not: the true effect is zero. People on an old Android buy 0.15 times as often as others; control keeps its old-Android people and the variant lost all of its own, so the two groups are not comparable. From the model, the chance of buying for the people who are in each group is 9.7% in control and 10.5% in the variant: 0.8 points from who is in the groups alone | `core-experiments-ab-testing`, `core-diagnosing-a-movement`, `data-analyst-ab-test-readout`, `data-scientist-experiment-analysis-in-python` |
| 16 | A leaky column | `subscriptions` | `cancel_reason` | It is empty exactly while a subscription is active and filled when it ends, so it knows the answer to "who cancels". So do `ended_on`, the `updated_at` of the last row, the `cancel_subscription` event and anything counted after the prediction moment (`plus_feature_used` for "who buys"). `plan_at_signup = plus` is known at signup but is the outcome for 397 people | `core-data-leakage`, `core-framing-split-and-baseline`, `data-scientist-feature-engineering`, `ml-engineer-sklearn-pipelines-and-column-transformers` |
| 17 | Unfinished follow-up | `users`, `subscriptions` | Signups after June 16; subscriptions started late | A signup after June 16 has fewer than 14 days to convert, and a monthly subscription started in June has not reached a renewal. Counting them as "did not convert" or "did not cancel" understates both | `core-defining-metrics` (cohort against calendar), `data-analyst-retention-and-lifetime-value` |
| 18 | A holiday dip (a labeled distractor) | `events` | 2026-05-25, Memorial Day | Visits (`session_start` events) from people in `north_america` fall to 57, against an average of 109.8 on the four Mondays around it (May 11, May 18, June 1, June 8); the other regions have 138 against 149.5, which is noise. Half of the holiday visits of `north_america` people are not made, across every platform and channel, and the next day is normal. It is **not** the mix shift (the channel shares do not change, and it lasts one day), **not** the iOS rename (every platform dips) and **not** a tracking problem (no event name changes and nothing arrives late): a one-day change in behavior with a known calendar cause. Conversion is not affected | `core-diagnosing-a-movement` (a one-day distractor next to the two real causes), `core-defining-metrics` |

The sizes above are measured from the files by `python3 scripts/build-app-events.py --check`, which fails when this
README quotes a number the data no longer has.

## Rows you can compare

| Measure | Value | Rows it counts |
|---|---:|---|
| 14-day conversion, all people with a full follow-up (signed up by June 16) | 12.0% | people who have a `purchase` within 14 days of `signup_complete` |
| Users by channel | 5,777 `organic_search`, 4,689 `app_store`, 3,802 `referral`, 2,905 `paid_search`, 4,668 `paid_social` | rows of `users` |
| People with `plan_at_signup = plus` | 397 | rows of `users` |
| Conversion before (the clean baseline), during and after the campaign | 12.9%, 9.9%, 14.7% | 3,622, 9,110 and 1,074 people who signed up March 9 to April 12, April 13 to June 7, and June 8 to June 16. January 1 to April 12 (9,989 people) gives 13.7%, but it holds the `paywall_v2` variant |
| "Active in June" (there is no such column, and the definition changes the answer) | 7,874 with any event, 4,289 with a `session_start`, 4,344 with an `add_expense`, 5,215 with either of those two | distinct people with an event dated June 1 to 30; "any event" includes the June signups and the purchases |
| Conversion by channel, before then during the campaign | `organic_search` 14.0% then 13.0%, `referral` 23.3% then 22.5%, `app_store` 10.6% then 8.8%, `paid_search` 7.9% then 9.6%, `paid_social` 3.3% then 4.0% | the same people by channel |

14-day conversion by the platform of the signup event and by channel (people who signed up by June 16):

| Channel | `web` | `ios` | `android` |
|---|---:|---:|---:|
| `organic_search` | 15.2% | 17.0% | 10.1% |
| `referral` | 23.0% | 29.3% | 16.1% |
| `app_store` | | 12.5% | 8.0% |
| `paid_search` | 9.8% | 11.5% | 5.2% |
| `paid_social` | 2.7% | 5.0% | 2.8% |

## Base rates for the modeling lessons

Two natural targets, and their majority-class baselines, so a model's score can be printed beside a baseline:

| Target | Positive rate | Baseline accuracy (always predict the majority) |
|---|---:|---:|
| A person buys within 14 days of signup (people who signed up by June 16) | 12.0% | 88.0% |
| A subscription has ended by June 30 (the latest row of each of the 2,905 subscriptions) | 24.1% | 75.9% |

The second target is cut off at the end of the data: a subscription that started in June had little time to end. A
fair churn model uses a fixed window after the start, or a time-based split.

## The JSON files

`v1/api/` pretends to be a small web service, one file per page, for the ingestion lessons. Two endpoints, `events` and
`subscriptions`, each with files `page-001.json`, `page-002.json`, and so on. Every page looks like this:

```json
{"page": 1, "page_size": 1000, "total_rows": 18437, "total_pages": 19, "next_page": "page-002.json", "rows": [ ... ]}
```

- `rows` hold the same values as the CSV (strings for dates and timestamps in the CSV format, real booleans and `null`).
- The last page has `"next_page": null`: that is the stopping rule.
- The events endpoint serves the 18,437 events received from June 16 on (`received_at`), in `event_id` order. The
  subscriptions endpoint serves all 3,840 rows in `subscription_id` and `updated_at` order.
- **A paging quirk.** While a loop pages through events, rows arrive; page 7 repeats the last 3 rows of page 6, and the
  pages after it are shifted by 3. The 19 pages hold 18,440 rows for 18,437 events, and `event_id` is the key that removes
  the repeats. The subscription pages repeat nothing, but they contain the repeated subscription rows of quirk 1.
- A static file cannot refuse a request, so rate limits and retries are practiced with a small function a lesson supplies
  that fails now and then, not with these files.

## How it was made

`scripts/build-app-events.py` generates every file from a fixed random seed, so running it again gives the same bytes (the
`.xlsx` too). Each person's behavior has its own random stream.
`python3 scripts/build-app-events.py --check` rebuilds in memory and fails if a CSV, JSON or SQL file differs from the
script, if one of the planted quirks above is missing or different, or if this README quotes a stale number.
`--facts` prints the measured numbers. It needs Python 3.10 or later, and openpyxl 3.1 for the `.xlsx` file.

A released version never changes. A change to columns or values creates a new folder (`v2/`), and `v1/` stays as it is, so
old notebooks and spreadsheets keep working.

## Not in this dataset

Said here so that a lesson does not promise them: there is no other holiday dip (one day, Memorial Day, is planted; the rest is the weekday and first-of-the-month
pattern), no continuous measure stored in a column
(revenue and session length are derived from events and prices), and no record of a deleted account, only the absence of
its row. The ingestion lessons add their own rate limits and retries around the JSON files.
