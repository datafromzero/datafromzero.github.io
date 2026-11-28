---
id: glossary-docker
term: Docker
short: 'A tool that packages a program and what it needs into a container, so that it runs the same way on any computer.'
aliases: [container, containers]
reviewed: 2026-11-27
---

Docker runs programs in containers. The Docker documentation describes a container as an isolated process with its own filesystem, and an image as a package of everything a container needs to start. That is why a program in a container runs the same way on every machine that has Docker. In these lessons you can start PostgreSQL with Docker instead of installing it.

## Where you meet it

- [*The cloud: storage, compute and who may access what*](/core/cloud-storage-compute-and-access/) (C33): a container in one box, among the cloud basics.
- [*Reading the machine: plans and operators*](/data-engineer/query-plans-and-operators/) (DE20): start PostgreSQL with Docker for the plans lab.
- [*Serving a model behind an API*](/ml-engineer/serving-a-model-api/) (MLE13): package a model API in a container.

## Source

- [Docker documentation: What is a container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)
