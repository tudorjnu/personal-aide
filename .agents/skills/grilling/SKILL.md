---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

Interview the user until you share a precise understanding. Map the discussion as a **design tree**: each decision branches into the decisions that depend on it.

Work through the tree in **rounds**. The **frontier** contains every decision whose prerequisites are settled, so you can ask those questions without guessing. At the start of each round, enumerate the whole frontier so the user sees the full shape. Then ask **one question at a time**, starting with the most important. Wait for the answer before moving to the next question in the round.

Format each question like so:

```
❓ **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Each answer reshapes the tree. Settled decisions unblock the questions that depend on them. Recompute the frontier before the next round.

Find _facts_ yourself. When a question needs information from the filesystem or tools, send a sub-agent instead of asking the user. Keep working on unrelated frontier questions while it runs; only dependent questions wait. The user owns the _decisions_, so put each decision to them and wait.

The session ends when the frontier is empty, every branch has been visited, and no assumption remains hidden. Do not act until the user confirms the shared understanding.
