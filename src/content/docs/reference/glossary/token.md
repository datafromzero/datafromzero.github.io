---
id: glossary-token
term: Token
short: 'A small piece of text, often a word or part of a word, that a language model reads and counts instead of letters.'
aliases: [tokens, tokenizer]
reviewed: 2026-11-27
---

A language model does not read letters or words. A tokenizer cuts text into tokens, pieces from a fixed list, and the model works with the number of each piece. Google's Machine Learning Crash Course says that a token may be a word, a subword or even a single character. A common word is usually one token and a rare word several, so the number of tokens differs from the number of words, and a model's input limit and its price are counted in tokens. An API token, a secret that proves who you are, is a different thing.

## Where you meet it

- [*Prompting with the data in the room*](/core/prompting-with-the-data-in-the-room/) (C37): a model reads a limited number of tokens, its context window.
- [*Text as numbers: tokens, embeddings and transformers*](/ml-engineer/text-embeddings-and-transformers/) (MLE7): cut sentences into tokens and count them.
- [*Calling LLM APIs and getting structured output*](/ml-engineer/llm-apis-and-structured-output/) (MLE8): tokens in and out of a model call, and what they cost.

## Source

- [Google for Developers: Machine Learning Crash Course, LLMs: Transformers](https://developers.google.com/machine-learning/crash-course/llm/transformers)
