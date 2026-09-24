---
name: to-tickets
description: Break a plan, spec, or the current conversation into a set of tracer-bullet tickets, each declaring its blocking edges, published to the configured tracker (edges as text in one file per ticket locally, or native blocking links on a real tracker).
disable-model-invocation: true
---

# To tickets

Break a plan, spec, or conversation into **tickets**: tracer-bullet vertical slices that name their blockers.

The issue tracker should have been configured for this repo. If not, tell the user to run `/setup-engineering-skills`.

## Process

### 1. Gather context

Use the context already in the conversation. If the user passes a spec path, issue number, or URL, fetch it and read the full body and comments. If `docs/STORIES.md` exists, read it and use it as source material for ticket titles and descriptions. If the breakdown diverges from what is written there, tell the user what changed and why.

### 2. Explore the codebase (optional)

Explore the codebase if you have not already. Use the project's domain glossary in ticket titles and descriptions, and respect ADRs in the area you are changing.

Look for opportunities to prefactor the code to make the implementation easier. "Make the change easy, then make the easy change."

### 3. Draft vertical slices

Break the work into **tracer bullet** tickets.

<vertical-slice-rules>

- Each slice cuts a narrow but complete path through every relevant layer (schema, API, UI, tests). It is vertical, not a horizontal slice of one layer.
- A completed slice is demoable or verifiable on its own.
- Each slice fits in one fresh context window.
- Do any prefactoring first.

</vertical-slice-rules>

Give each ticket its **blocking edges**: the other tickets that must complete before it can start. A ticket with no blockers can start immediately.

**Wide refactors are the exception to vertical slicing.** A **wide refactor** is one mechanical change, such as renaming a column or retyping a shared symbol, that breaks too many callers for one vertical slice to stay green. Sequence it as **expand–contract**:

1. **Expand:** add the new form beside the old so nothing breaks.
2. **Migrate:** move callers in batches sized by blast radius, one ticket per package or directory. Each ticket is blocked by the expand step. The old form keeps CI green between batches.
3. **Contract:** delete the old form after no callers remain. This ticket is blocked by every migration ticket.

If migration batches cannot stay green alone, use a shared integration branch and add a final integrate-and-verify ticket. Promise green only there.

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each ticket, show:

- **Title**: short descriptive name
- **Blocked by**: which other tickets (if any) must complete first
- **What it delivers**: the end-to-end behaviour this ticket makes work

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Are the blocking edges correct: does each ticket only depend on tickets that genuinely gate it?
- Should any tickets be merged or split further?

Iterate until the user approves the breakdown.

### 5. Publish the tickets to the configured tracker

Publish the approved tickets. The tracker configured by `/setup-engineering-skills` decides how. The ticket content stays the same; only the blocking links differ:

- **Local files** → write one file per ticket under `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01` in dependency order (blockers first). Each file's "Blocked by" lists the numbers/titles it depends on. Use the per-ticket file template below: one ticket per file, never a single combined file.
- **A real issue tracker (GitHub, Linear, …)** → publish one issue per ticket in dependency order (blockers first) so each ticket's blocking edges can reference real identifiers. Use the platform's native blocking / sub-issue relationship where it has one; otherwise set each ticket's "Blocked by" to the blocking issues.

Work the **frontier**: any ticket whose blockers are all done. For a purely linear chain that means top to bottom.

Do not close or modify the parent issue.

<local-ticket-template>

# <NN>: <Ticket title>

**What to build:** the end-to-end behaviour this ticket makes work, from the user's perspective, not a layer-by-layer implementation list.

**Blocked by:** the numbers/titles of the tickets that gate this one, or "None (can start immediately)".

- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2

</local-ticket-template>

<issue-template>

## Parent

A reference to the parent issue on the tracker (if the source was an existing issue, otherwise omit this section).

## What to build

The end-to-end behaviour this ticket makes work, from the user's perspective, not layer-by-layer implementation.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Blocked by

- A reference to each blocking ticket, or "None (can start immediately)".

</issue-template>

In either form, avoid specific file paths or code snippets: they go stale fast. Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits.
