"""The evaluation of the reference answer of the LLM half: the 16 capstone questions through the endpoint, scored, against a baseline that calls no model.

    uv run python -m reference.evaluate        (from the llm/ folder; loads the models, about 6 GB of memory, and takes a few minutes)
"""

import re
import statistics

import numpy as np
from fastapi.testclient import TestClient

from questions import CAPSTONE, TRAPS
from reference.serve_llm import create_app, load_real_system

SEED = 2026
PRICE_IN, PRICE_OUT = 1.00, 5.00  # dollars per million tokens: assumed, not any provider's price


def correct(item, reply):
    """The answer is there and matches every pattern of the question."""
    return reply["answer"] is not None and all(re.search(pattern, reply["answer"], re.I) for pattern in item[3])


def cited(item, reply):
    """A cited source holds a phrase that answers the question."""
    return any(phrase in source["text"] for source in reply["sources"] for phrase in item[2])


def main():
    with TestClient(create_app(load_real_system)) as client:
        system = client.app.state.system
        replies = [client.post("/ask", json={"question": item[0]}).json() for item in CAPSTONE]
        trap_replies = [client.post("/ask", json={"question": question}).json() for question, _ in TRAPS]
        # the baseline calls no model: the best chunk, scored on whether it holds a phrase that answers the question
        baseline = [any(phrase in system.chunks[system.search(item[0], 1)[0][1]][2] for phrase in item[2]) for item in CAPSTONE]
    ok = [correct(item, reply) for item, reply in zip(CAPSTONE, replies)]
    print(f"{len(CAPSTONE)} questions the corpus answers, {len(TRAPS)} it does not")
    print(f"answers that match every pattern: {sum(ok)} of {len(CAPSTONE)}; with a cited source that holds the phrase: {sum(cited(i, r) for i, r in zip(CAPSTONE, replies))}")
    print(f"baseline, the best chunk holds the phrase: {sum(baseline)} of {len(CAPSTONE)}")
    rng = np.random.default_rng(SEED)
    # one grader for both sides: a source the system shows holds a phrase that answers the question (the answerer's cited source, the baseline's best chunk)
    pairs = np.array([[cited(item, reply), shown] for item, reply, shown in zip(CAPSTONE, replies, baseline)], dtype=int)
    gains = [(pairs[pick, 0] - pairs[pick, 1]).mean() for pick in (rng.integers(0, len(pairs), len(pairs)) for _ in range(2000))]
    low, high = np.percentile(gains, [2.5, 97.5])
    print(f"answerer minus baseline, both by 'a source shown holds the phrase': {(pairs[:, 0] - pairs[:, 1]).mean() * len(CAPSTONE):+.0f} of {len(CAPSTONE)} questions "
          f"(95% interval {low * len(CAPSTONE):+.1f} to {high * len(CAPSTONE):+.1f}, 2,000 resamples of the questions, seed {SEED})")
    print(f"traps refused: {sum(r['refused'] for r in trap_replies)} of {len(TRAPS)}, {sum(r['prompt_tokens'] == 0 for r in trap_replies)} of them before the model was called")
    for (question, kind), reply in zip(TRAPS, trap_replies):
        print(f"  {kind:<4} {'refused' if reply['refused'] else 'ANSWERED'}: {question}")
    print("failures among the questions the corpus answers:")
    for item, reply, good in zip(CAPSTONE, replies, ok):
        if not good:
            print(f"  [{item[1]}] {item[0]} -> {reply['answer']!r}" + ("  (refused)" if reply["refused"] else ""))
    called = [r for r in replies + trap_replies if r["prompt_tokens"] > 0]
    mean_in, mean_out = statistics.mean(r["prompt_tokens"] for r in called), statistics.mean(r["completion_tokens"] for r in called)
    dollars = (mean_in * PRICE_IN + mean_out * PRICE_OUT) / 1_000_000 * 1000
    print(f"{len(called)} of {len(CAPSTONE) + len(TRAPS)} requests called the model: {mean_in:.0f} prompt tokens and {mean_out:.0f} completion tokens on average, "
          f"median {statistics.median(r['seconds'] for r in called):.1f} s, ${dollars:.3f} for 1,000 answers at the assumed prices")


if __name__ == "__main__":
    main()
