# Logic Prototype

A single, self-contained HTML file that lets anyone push a state model around by clicking buttons. Use it when the question is about **business logic, state transitions, or data shape**, the kind of thing that looks reasonable on paper but only feels wrong once you run cases through it.

Because it is one file with nothing to install, you can hand it to a non-developer (a designer, PM, domain expert) and let them feel the model for themselves. Use their language, not the code's.

## When this is the right shape

- "I'm not sure if this state machine handles the edge case where X then Y."
- "Does this data model actually let me represent the case where..."
- "I want to feel out what the API should look like before writing it."
- Anything where someone wants to **press buttons and watch state change**.

If the question is "what should this look like," this is the wrong branch. Use [UI.md](UI.md).

## Process

### 1. State the question

Before writing code, write down the state model and the question the prototype answers. One paragraph, visible at the top of the demo. A logic prototype that answers the wrong question is waste, so make the question explicit so it can be checked later, whether the user is watching now or returning to it AFK.

### 2. Isolate the logic in a portable module

Put the actual logic in a single `<script>` block, written as a small pure module you could lift into the real codebase later. The page around it is throwaway; this module is not.

Pick the shape that fits the question, not the one easiest to wire to a page:

- **Pure reducer**: `(state, action) => state`. Good for discrete events and a single state value.
- **State machine**: explicit states and transitions. Good when "which actions are even legal right now" is part of the question.
- **Small set of pure functions** over a plain data type. Good when there is no implicit current state, only transformations.
- **Class or module with a clear method surface** when the logic genuinely owns ongoing internal state.

Keep it pure: no DOM, no `document`, no button handlers reaching inside it. The page calls into it; nothing flows the other way. This is what makes the prototype useful past its own lifetime: once the question is answered, the validated reducer / machine / function set lifts into the real module on its own.

### 3. Build the shareable HTML file

One file, plain HTML/CSS/JS: no framework, no bundler, no server, everything inline so it opens by double-click and survives being emailed. Anyone should be able to run it by opening it.

Write it for a non-developer. Every label is in **domain language**, not code: buttons and state read like the business, not the reducer. Explain in plain words what is happening.

Lay it out top to bottom:

1. **Title and one-line explanation** of what the demo lets you explore (the question from step 1).
2. **Current state**: the full relevant state, rendered as readable labelled fields, not a raw JSON dump. Re-render after every click so the change is visible. Call out what just changed when it helps a non-developer follow.
3. **Free-play buttons**: one button per action, always available, so anyone can poke at the model in any order. Each click dispatches its action and re-renders the state.
4. **Guided walkthroughs**: a set of **scenarios**, one per tab. Each tab has a short plain-language description of the situation and what to watch for, plus the ordered **buttons to press** for that scenario. Each step is a real button: clicking it performs that action and moves to the next step. Starting a walkthrough resets to a known initial state so the scenario runs the same way every time.

Choose scenarios that demonstrate the awkward cases: the happy path, a tricky edge case, an attempt at something that should be illegal.

Keep it clean but restrained: generous spacing, one accent colour. No animations, no gimmicks: nothing that competes with the state and the buttons.

### 4. Hand it over

Send them the file or open it for them. They will click through walkthroughs and free-play when they get to it. The interesting feedback is when they say "wait, that shouldn't be possible" or "huh, I assumed X would be different"; those are bugs in the _idea_, which is the whole point. If they want new actions or a new scenario, add them. Prototypes evolve.

### 5. Capture the answer and the prototype

Once the prototype answers its question, capture the answer, then capture the prototype the way the [SKILL](SKILL.md) describes. The validated reducer / machine / function set lifts into the real module. The HTML shell goes to the throwaway branch as a primary source, and because it is one self-contained file it stays trivially re-runnable there.

## Anti-patterns

- **Don't add tests.** A prototype that needs tests is no longer a prototype.
- **Don't wire it to the real database.** Use in-memory state unless the question is specifically about persistence.
- **Don't generalise.** No "what if we wanted to support X later." The prototype answers one question.
- **Don't blur the logic and the page together.** If the pure module references the DOM, `document`, or button handlers, it is no longer liftable. Keep the page as a thin shell over a pure module.
- **Don't reach for a framework, bundler, or server.** One file the recipient double-clicks; a React app or dev server defeats "shareable".
- **Don't ship the HTML shell into production.** The page is optimised for being clicked through by hand. The logic module behind it is the bit worth keeping.
