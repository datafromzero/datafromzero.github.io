---
id: glossary-cosine-similarity
term: Cosine similarity
short: 'A score from -1 to 1 for how closely two lists of numbers point the same way; embeddings of similar texts score near 1.'
aliases: [cosine]
reviewed: 2026-11-27
---

Cosine similarity compares two lists of numbers by the angle between them, not by their length. The scikit-learn documentation says that it computes the L2-normalized dot product of vectors, which is the cosine of the angle between them. Two lists that point the same way score 1, lists at a right angle score 0, and lists that point opposite ways score -1. It is the usual score for comparing the embeddings of two texts.

## Where you meet it

- [*Text as numbers: tokens, embeddings and transformers*](/ml-engineer/text-embeddings-and-transformers/) (MLE7): compare the embeddings of sentences.
- [*A retrieval pipeline: chunk, embed, search, answer with citations*](/ml-engineer/rag-retrieval-pipeline/) (MLE9): search chunks by their closeness to a question.
- [*Evaluating LLM and RAG systems*](/ml-engineer/llm-and-rag-evaluation/) (MLE10): a retrieval score that a system can be tested on.

## Source

- [scikit-learn documentation: Pairwise metrics, cosine similarity](https://scikit-learn.org/stable/modules/metrics.html#cosine-similarity)
