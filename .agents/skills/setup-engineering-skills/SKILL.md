---
name: setup-engineering-skills
description: "Configure this repo for the engineering skills: set up its issue tracker and domain doc layout. Run once before first use of the other engineering skills."
disable-model-invocation: true
---

# Setup Tudor's Skills

Create the per-repo config the engineering skills expect:

- **Issue tracker**: where issues live
- **Domain docs**: where `CONTEXT.md` and ADRs live, and how to read them

This is prompt-driven, not scripted. Explore, summarize, confirm, then write.

## Process

### 1. Explore

Read whatever exists; do not assume:

- `git remote -v` and `.git/config`: is this a GitHub repo? Which one?
- `AGENTS.md` at the repo root: does it exist? Is there already an `## Agent skills` section?
- `CONTEXT.md` and `CONTEXT-MAP.md` at the repo root
- `docs/adr/` and any `src/*/docs/adr/` directories
- `docs/agents/`: does prior output already exist?
- `.scratch/`: a sign that a local-markdown issue tracker is already in use
- Monorepo signals: `pnpm-workspace.yaml`, `workspaces` in `package.json`, or populated `packages/*` with their own `src/`. These only appear in genuinely large multi-package repos; their absence means single-context, which is almost every repo.

### 2. Present findings and ask

Summarize what is present and what is missing. Take the sections in order. One section, one answer, then the next.

Lead with the recommended answer so the user can accept it in one word. Explain only when the choice genuinely branches. Skip a section when exploration already settled it (Section C when there is no monorepo).

**Section A: Issue tracker.**

> The issue tracker is where this repo keeps issues. Skills like `to-tickets` and `to-spec` read from and write to it. They need to know whether to call `gh issue create`, write a file under `.scratch/`, or follow some other workflow.

Default to GitHub if `git remote` points there. Default to GitLab if it points to `gitlab.com` or a self-hosted GitLab. Otherwise, or if the user prefers, offer:

- **GitHub**: uses the `gh` CLI
- **GitLab**: uses the [`glab`](https://gitlab.com/gitlab-org/cli) CLI
- **Local markdown**: files under `.scratch/<feature>/` in this repo (good for solo projects or repos without a remote)
- **Other** (Jira, Linear, etc.): the user describes the workflow in one paragraph; record it as freeform prose

Record the choice in `docs/agents/issue-tracker.md`.

**Section C: Domain docs.** Default to **single-context**: one `CONTEXT.md` and `docs/adr/` at the repo root. This fits almost every repo; write it without asking.

Offer **multi-context** (root `CONTEXT-MAP.md` pointing to per-context `CONTEXT.md` files) only if you found monorepo signals. Then confirm which layout they want.

### 3. Confirm and edit

Show the user a draft of:

- The `## Agent skills` block to add to `AGENTS.md` at the repo root
- The contents of `docs/agents/issue-tracker.md` and `docs/agents/domain.md`

Let them edit before writing.

### 4. Write

Edit `AGENTS.md` at the repo root. If an `## Agent skills` block already exists, update it in-place. Never create `CLAUDE.md`.

The block:

```markdown
## Agent skills

### Issue tracker

[one-line summary]. See `docs/agents/issue-tracker.md`.

### Domain docs

[one-line summary: "single-context" or "multi-context"]. See `docs/agents/domain.md`.
```

Then write the docs files from the seed templates in this skill folder:

- [issue-tracker-github.md](./issue-tracker-github.md)
- [issue-tracker-gitlab.md](./issue-tracker-gitlab.md)
- [issue-tracker-local.md](./issue-tracker-local.md)
- [domain.md](./domain.md)

For "other" trackers, write `docs/agents/issue-tracker.md` from scratch using the user's description.

### 5. Done

Tell the user setup is complete and which skills will read these files. They can edit `docs/agents/*.md` directly later. Re-run this skill only to switch trackers or start from scratch.

## How the engineering skills work

- Use subagents for parallel work or whenever a separate context window would help.
- Read `CONTEXT.md` and ADRs before touching code in an area.
- Stop and ask on architectural decisions; do not decide them silently.
