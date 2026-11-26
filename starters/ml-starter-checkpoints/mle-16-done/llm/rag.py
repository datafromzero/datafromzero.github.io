"""The retrieval answerer of lessons MLE9 and MLE10, as a module: read the corpus, cut it into chunks, search it, ask the model, check the reply.

    from rag import System
    system = System()                      # loads the two models: about 10 GB of memory at the peak, and one such process at a time
    system.answer("What does PARTITION BY do?")

The corpus is eight published lessons of the SQL stage (CC BY 4.0), read from the release tag v1.0.0 and kept in corpus/. The models are
`sentence-transformers/all-MiniLM-L6-v2` (Apache 2.0) and `ibm-granite/granite-4.0-1b` (made by IBM, Apache 2.0), both at the revisions below, run on the CPU.
"""

import json
import re
import time
import urllib.request
from pathlib import Path

import numpy as np
import torch
from pydantic import BaseModel, ValidationError
from sentence_transformers import SentenceTransformer
from transformers import AutoModelForCausalLM, AutoTokenizer

HERE = Path(__file__).resolve().parent
TEXT_BASE = "https://raw.githubusercontent.com/datafromzero/datafromzero.github.io/v1.0.0/src/content/docs/sql/"
LESSONS = ["null-handling", "group-by-having", "inner-join", "left-join-anti-join", "window-functions", "ctes", "dates-and-time", "case-expressions"]
SKIP_SECTIONS = {"Warm-up", "Finish it", "On your own", "Check yourself"}  # recall prompts and exercises are not teaching text
EMB_NAME, EMB_REVISION = "sentence-transformers/all-MiniLM-L6-v2", "1110a243fdf4706b3f48f1d95db1a4f5529b4d41"
LLM_NAME, LLM_REVISION = "ibm-granite/granite-4.0-1b", "6a7381ba1f54d684ff508d991aeb7dc580157103"
CHUNK_WORDS = 120  # chunks of whole paragraphs, at most this many words
THRESHOLD = 0.40  # the cosine below which the system refuses without calling the model
PROMPT = ("Answer the question using only the numbered sources. Reply with JSON only, like {\"answer\": \"one or two sentences\", \"sources\": [1]}, "
          "where sources lists the numbers of the sources you used. If the sources do not contain the answer, reply {\"answer\": null, \"sources\": []}.")


def read_lesson(slug):
    """The raw text of one lesson: the copy in corpus/, or downloaded from the tag and kept there."""
    path = HERE / "corpus" / f"{slug}.mdx"
    if not path.exists():
        path.parent.mkdir(exist_ok=True)
        with urllib.request.urlopen(TEXT_BASE + slug + ".mdx", timeout=30) as reply:
            path.write_bytes(reply.read())
    return path.read_text(encoding="utf-8")


def paragraphs(raw):
    """The prose paragraphs of a lesson as (section heading, text): no front matter, figures, code, tables or exercise sections."""
    raw = re.sub(r"\A---\n.*?\n---\n", "", raw, flags=re.S)
    raw = re.sub(r"<figure.*?</figure>|<svg.*?</svg>|<RunSQL.*?/>|```.*?```", "", raw, flags=re.S)
    found, section = [], ""
    for block in re.split(r"\n\s*\n", raw):
        block = block.strip()
        if block.startswith("#"):
            section = block.lstrip("#").strip()
        elif block and section not in SKIP_SECTIONS and not block.startswith(("<", "|", "{/*")):
            block = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", re.sub(r"<[^>]+>", "", block)).replace("*", "").replace("`", "")
            block = re.sub(r"\s+", " ", block).strip()
            if len(block.split()) >= 8:  # a few words are a label, not a paragraph
                found.append((section, block))
    return found


def make_chunks(corpus, target_words=CHUNK_WORDS):
    """Chunks of whole paragraphs, each (lesson, section, text), at most `target_words` words unless one paragraph is longer."""
    chunks = []
    for slug, items in corpus.items():
        current, count, head = [], 0, ""
        for section, text in items:
            size = len(text.split())
            if current and count + size > target_words:
                chunks.append((slug, head, " ".join(current)))
                current, count = [], 0
            if not current:
                head = section
            current.append(text)
            count += size
        if current:
            chunks.append((slug, head, " ".join(current)))
    return chunks


class Cited(BaseModel):
    answer: str | None
    sources: list[int]


class System:
    """Corpus, embedding model and language model in one object."""

    def __init__(self, threshold=THRESHOLD, k=3, prompt=PROMPT):
        torch.set_num_threads(2)  # two threads, the size of a free Colab CPU
        self.threshold, self.k, self.prompt = threshold, k, prompt
        self.chunks = make_chunks({slug: paragraphs(read_lesson(slug)) for slug in LESSONS})
        self.embedder = SentenceTransformer(EMB_NAME, revision=EMB_REVISION, device="cpu")
        self.vectors = self.embedder.encode([chunk[2] for chunk in self.chunks])
        self.tokenizer = AutoTokenizer.from_pretrained(LLM_NAME, revision=LLM_REVISION)
        self.model = AutoModelForCausalLM.from_pretrained(LLM_NAME, revision=LLM_REVISION, dtype=torch.float32).eval()
        self.end_marks = {self.tokenizer.eos_token_id}  # the end-of-text marker: <|end_of_text|>

    def search(self, question, k=None):
        """The k chunks most similar to the question, as (cosine, number of the chunk)."""
        scores = self.vectors @ self.embedder.encode([question])[0]
        return [(round(float(scores[i]), 3), int(i)) for i in np.argsort(-scores)[:k or self.k]]

    def chat(self, messages, max_new_tokens=100):
        """One greedy request: the text, the prompt tokens, the completion tokens (end marker not counted) and the seconds."""
        prompt = self.tokenizer.apply_chat_template(messages, add_generation_prompt=True, return_tensors="pt", return_dict=True)["input_ids"]
        start = time.perf_counter()
        with torch.no_grad():
            out = self.model.generate(input_ids=prompt, attention_mask=torch.ones_like(prompt), max_new_tokens=max_new_tokens, do_sample=False, repetition_penalty=1.0)
        seconds = time.perf_counter() - start
        written = out[0][prompt.shape[1]:].tolist()
        return {"text": self.tokenizer.decode(written, skip_special_tokens=True), "prompt_tokens": prompt.shape[1],
                "completion_tokens": sum(1 for token in written if token not in self.end_marks), "seconds": seconds}

    def answer(self, question):
        """The whole system: search, refuse when nothing is close, otherwise ask the model and check its reply."""
        found = self.search(question)
        if found[0][0] < self.threshold:
            return {"found": found, "answer": None, "sources": [], "valid": True, "abstained": True, "prompt_tokens": 0, "completion_tokens": 0, "seconds": 0.0}
        sources = "\n".join(f"[{n}] {self.chunks[i][2]}" for n, (score, i) in enumerate(found, start=1))
        reply = self.chat([{"role": "system", "content": self.prompt}, {"role": "user", "content": f"Sources:\n{sources}\n\nQuestion: {question}"}])
        try:
            parsed = Cited.model_validate_json(reply["text"])
            valid = all(1 <= n <= len(found) for n in parsed.sources)
            return {**reply, "found": found, "answer": parsed.answer, "sources": parsed.sources, "valid": valid, "abstained": False}
        except ValidationError:
            return {**reply, "found": found, "answer": None, "sources": [], "valid": False, "abstained": False}


if __name__ == "__main__":
    system = System()
    print(len(system.chunks), "chunks;", json.dumps(system.answer("What does PARTITION BY do inside OVER?"), default=str)[:400])
