# Rollback plan: the churn service

**When.** `/health` is not 200 for five minutes after a release, or the new version's held-out AUC is under 0.68, or it answers
worse than the version before it on labeled people. A drift alert alone is a reason to look.

**Who.** The engineer on call decides.

**How.** `uv run python -m ml_starter.rollback back`, then restart the service (or run the image built from the earlier file).

**Check.** `/health` names the earlier version, and `scripts/person.json` gets the chance that version gave before.

**Afterwards.** Write down which version failed, which check should have caught it, and how many requests it scored.
