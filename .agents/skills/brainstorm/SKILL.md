---
name: brainstorm
description: "Use when the user says 'I want to build', 'I want to add', 'how would I', 'what if we', 'explore', 'design', 'figure out', 'think through', or any request to change or create something where the path is unclear. Classify the work, surface the choices, and agree on the next step. Do not implement."
---

# Brainstorm

Help the user figure out what they actually need before anyone writes code.

This skill is a navigator, not a builder. Your job is to understand the goal, surface the choices, and agree on a next step. Do not implement. Do not scaffold. Do not write production code.

## How to start

1. **Restate what you heard.** One sentence, in the user's terms. Confirm you understand the goal before doing anything else.
2. **Classify the shape.** Say which of these fits best:
   - **Spike**: "Can we...?", "Is it possible...?", a feasibility probe. Output is an answer, not kept code.
   - **Bounded change**: a well-scoped edit to existing code that is already in this repo. The flow being changed exists here.
   - **New ground**: a new project, subsystem, public interface, or anything without an existing flow to modify.
   - **Clarify first**: you do not understand the goal well enough to classify. Ask questions.

If you are unsure between two shapes, take the heavier one.

## What to do next

Once the shape is clear, offer the user a concrete next step:

- **Spike** → propose the probe and what you will find out. Use [`/research`](./skills/helpers/research/SKILL.md) or [`/prototype`](./skills/engineering/prototype/SKILL.md) depending on the question.
- **Bounded change** → ask the clarifying questions that matter, one at a time. When the path is clear, present a short in-chat design and wait for explicit approval before [`/implement`](./skills/engineering/implement/SKILL.md).
- **New ground** → use [`/grill-with-domain`](./skills/engineering/grill-with-domain/SKILL.md) to sharpen the domain model and decisions, then [`/to-spec`](./skills/engineering/to-spec/SKILL.md) or [`/to-tickets`](./skills/engineering/to-tickets/SKILL.md) depending on how big it is.

## Rules

- Ask one question at a time.
- Do not answer for the user.
- Do not start implementing while "presenting" a design.
- Hidden complexity found mid-task upgrades the shape. Stop, say so, and step up.
- Each task gets its own classification and its own approval.
