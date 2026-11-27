---
id: glossary-attention
term: Attention
short: 'How a language model lets each token weigh the other tokens of the text to decide what matters for its own meaning.'
aliases: [self-attention]
reviewed: 2026-11-27
---

Attention is the step in a transformer where every token looks at the other tokens of the text and decides how much each one matters for its own meaning. Google's Machine Learning Crash Course describes it for each token as asking how much each other token affects the interpretation of this token. The original transformer paper describes an attention function as mapping a query and a set of key-value pairs to an output, computed as a weighted sum. The weights of one token add up to 1.0, and a lesson can print them for a real model.

## Where you meet it

- [*Text as numbers: tokens, embeddings and transformers*](/ml-engineer/text-embeddings-and-transformers/) (MLE7): print the attention weights of one word in a sentence.

## Source

- [Google for Developers: Machine Learning Crash Course, LLMs: Transformers](https://developers.google.com/machine-learning/crash-course/llm/transformers)
- [Vaswani et al., Attention Is All You Need (arXiv, section 3.2)](https://arxiv.org/abs/1706.03762)
