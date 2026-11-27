---
id: glossary-virtual-environment
term: Virtual environment
short: 'A project''s own folder holding its own Python and its own packages, so projects do not disturb each other.'
aliases: [environment, venv, environments]
reviewed: 2026-11-27
---

A virtual environment is a self-contained directory tree that holds one version of Python plus the packages one project needs, as the Python documentation puts it. Each project gets its own, so two projects can use different versions of the same library without breaking each other. A common name for the folder is `.venv`. A "no module named..." error often means the code ran in a different environment from the one you installed into. The tool [uv](/reference/glossary/uv/) builds one for you.

## Where you meet it

- [*Your own Python setup: environments and pip*](/python/environments-and-pip/) (P24): make an environment and install into the Python you name.
- [*Environments and dependencies, for real*](/core/environments-and-dependencies/) (C25): a project environment rebuilt from the files it declares.

## Source

- [Python documentation: Virtual Environments and Packages](https://docs.python.org/3/tutorial/venv.html)
