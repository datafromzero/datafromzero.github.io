---
id: glossary-embedding
term: Embedding
short: A list of numbers that stands for a piece of text, so that texts with similar meaning get similar lists.
aliases: [embeddings, embedding vector]
reviewed: 2026-11-27
---

An embedding is a list of numbers that a model produces for a piece of text. Texts about the same thing get lists that point the same way, so you can compare meaning by comparing numbers; the lesson uses cosine similarity for that. The example in the Sentence Transformers documentation scores two sentences about the weather much closer to each other than to a sentence about a stadium. Embeddings are how a retrieval system finds the passage that matches a question.

## Where you meet it

- [*Text as numbers: tokens, embeddings and transformers*](/ml-engineer/text-embeddings-and-transformers/) (MLE7): embeddings and cosine similarity.
- [*A retrieval pipeline: chunk, embed, search, answer with citations*](/ml-engineer/rag-retrieval-pipeline/) (MLE9): embed, search and answer with citations.
- [*RAG and agents: what they are and how to judge them*](/core/ai-literacy-rag-and-agents/) (C43): where retrieval fits in RAG.

## Source

- [Sentence Transformers documentation: Computing embeddings](https://sbert.net/examples/sentence_transformer/applications/computing-embeddings/README.html)
- [Google for Developers: Machine Learning Crash Course, Embeddings](https://developers.google.com/machine-learning/crash-course/embeddings)
