# Domain Docs

How engineering skills should read this repo's domain documentation.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root, or
- **`CONTEXT-MAP.md`** at the repo root if it exists: it points to one `CONTEXT.md` per context. Read each one relevant to the topic.
- **`docs/adr/`**: ADRs that touch the area you're about to work in. In multi-context repos, also check `src/<context>/docs/adr/` for context-specific decisions.

If these files do not exist, proceed silently. Do not flag their absence or suggest creating them. The `/domain-modeling` skill creates them lazily when terms or decisions get resolved.

## File structure

Single-context repo (most repos):

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

Multi-context repo (when `CONTEXT-MAP.md` exists at the root):

```
/
├── CONTEXT-MAP.md
├── docs/adr/                          ← system-wide decisions
└── src/
    ├── ordering/
    │   ├── CONTEXT.md
    │   └── docs/adr/                  ← context-specific decisions
    └── billing/
        ├── CONTEXT.md
        └── docs/adr/
```

## Use the glossary's vocabulary

When naming a domain concept in output (issue titles, refactor proposals, hypotheses, test names), use the term as defined in `CONTEXT.md`. Do not drift to synonyms the glossary avoids.

If the concept you need is not in the glossary, either you are inventing language the project does not use (reconsider) or there is a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly instead of silently overriding:

> _Contradicts ADR-0007 (event-sourced orders), but worth reopening because…_
