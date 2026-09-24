---
name: to-spec
description: "Turn the current conversation into a spec and publish it to the project issue tracker: no interview, just synthesis of what you've already discussed."
disable-model-invocation: true
---

Turn the current conversation and your codebase knowledge into a spec. Do not interview the user. Synthesize what you already know.

The issue tracker should have been configured for this repo. If not, tell the user to run `/setup-engineering-skills`.

## Process

1. Explore the repo if you have not already. Use the project's domain glossary throughout the spec and respect ADRs in the area you are changing. If `docs/STORIES.md` exists, read it and use it as source material for user stories. If the spec diverges from what is written there, tell the user what changed and why.

2. List the seams where the feature will be tested. Prefer existing seams and use the highest seam that covers the behavior. If a new seam is needed, place it as high as possible. Fewer seams are better; one is ideal.

Check with the user that these seams match their expectations.

1. Write the spec using the template below, then publish it to the project issue tracker. No extra review step is needed.

<spec-template>

## Problem statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User stories

A comprehensive numbered list of user stories. Use this format:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

Cover every part of the feature.

## Implementation decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits.

## Testing decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of scope

A description of the things that are out of scope for this spec.

## Further notes

Any further notes about the feature.

</spec-template>
