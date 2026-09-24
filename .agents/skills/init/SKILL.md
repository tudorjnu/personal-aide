---
name: init
description: "Use when you start work in a repo that has not been prepared, or when the user says 'set up this repo', 'init', 'get started here', or 'onboard'. Checks the repo setup, runs setup if needed, then maps the project structure, domain language, and open work."
disable-model-invocation: true
---

# Init

Prepare the repo for engineering work.

## 1. Check setup

Look for these markers:

- `AGENTS.md` at the repo root
- `docs/agents/issue-tracker.md`
- `docs/agents/domain.md`
- `CONTEXT.md` or `CONTEXT-MAP.md`

If any are missing, tell the user to run `/setup-engineering-skills` first. This skill cannot run it for you because both are user-invoked.

## 2. Map the project

If setup is in place, spawn a subagent to explore the repo and return a compact summary:

- **Structure**: top-level directories, entry points, main modules, build/test commands.
- **Tech stack**: languages, frameworks, package manager, database, deployment signals.
- **Domain language**: existing terms in `CONTEXT.md`/glossary; note any gaps or contradictions.
- **Open work**: open tickets/specs in the issue tracker; recent commits; any in-progress branches or PRs.
- **Risks**: missing tests, unclear seams, large files, heavy dependencies, anything that looks like it would slow work down.

The subagent should read only what it needs; do not dump every file.

## 3. Present the summary

Report back in a short, scannable form. Do not change any files in the repo.

```
Repo: {name}
Stack: {brief}
Entry points: {list}
Domain terms: {list or "none yet"}
Open work: {count + links, or "none"}
Risks: {list or "none obvious"}
Next: {suggested next step}
```

End with a suggested next step. If there is open work, ask whether to pick one up. If not, ask what the user wants to build.
