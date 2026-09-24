# UI Prototype

Generate **several structurally different UI variations** on a single route, switchable from a floating bottom bar. The user flips between variants in the browser, picks one (or steals bits from each), then throws the rest away.

If the question is about logic or state, this is the wrong branch. Use [LOGIC.md](LOGIC.md).

## When this is the right shape

- "What should this page look like?"
- "I want to see a few options for this dashboard before committing."
- "Try a different layout for the settings screen."
- Any time the user would otherwise spend a day picking between three vague mockups in their head.

## Two sub-shapes: strongly prefer A

A UI prototype is much easier to judge when it sits **inside the real app**: real header, sidebar, data, density. A throwaway route on its own is a vacuum; every variant looks fine in isolation. Default to sub-shape A whenever there is a plausible existing page to host the variants. Reach for B only if the prototype genuinely has no nearby home.

### Sub-shape A: adjustment to an existing page (preferred)

The route already exists. Variants render **on the same route**, gated by a `?variant=` URL search param. Existing data fetching, params, and auth stay. Only the rendering swaps. This is the default.

If the prototype is for something that does not yet have a page but *would naturally live inside one* (a new dashboard section, a new settings card, a new step in an existing flow), it is still sub-shape A. Mount the variants inside the host page.

### Sub-shape B: a new page (last resort)

Use this only when the thing being prototyped genuinely has no existing page to live in (an entirely new top-level surface, or a flow that cannot be embedded anywhere sensible).

Create a **throwaway route** following the project's routing convention. Do not invent a new top-level structure. Name it so it is obviously a prototype. Use the same `?variant=` pattern.

Before committing to B, check whether there is really no existing page that could host it. An empty route hides design problems a populated one would expose.

In both sub-shapes the floating bottom bar is identical.

## Process

### 1. State the question and pick N

Default to **3 variants**. More than 5 stops being meaningfully different and starts being noise, so cap there.

Write the plan in one line, in the prototype location or a top-of-file comment:

> "Three variants of the settings page, switchable via `?variant=`, on the existing `/settings` route."

This works whether the user is present or AFK.

### 2. Generate structurally different variants

Draft each variant. Hold each one to:

- The page's purpose and the data it has access to.
- The project's component library / styling system (TailwindCSS, shadcn, MUI, plain CSS, whatever).
- A clear exported component name, e.g. `VariantA`, `VariantB`, `VariantC`.

Variants must be **structurally different**: different layout, information hierarchy, primary affordance, not just different colours. Three slightly-tweaked card grids is wallpaper, not a prototype. If two drafts come out too similar, redo one with explicit "do not use a card grid" guidance.

### 3. Wire them together

Create a single switcher component on the route:

```tsx
// pseudo-code, adapt to the project's framework
const variant = searchParams.get('variant') ?? 'A';
return (
  <>
    {variant === 'A' && <VariantA {...data} />}
    {variant === 'B' && <VariantB {...data} />}
    {variant === 'C' && <VariantC {...data} />}
    <PrototypeSwitcher variants={['A','B','C']} current={variant} />
  </>
);
```

For sub-shape A: keep all existing data fetching above the switcher; only the rendered subtree changes per variant.

For sub-shape B: the throwaway route under `/prototype/<name>` mounts the same switcher.

### 4. Build the floating switcher

A small fixed-position bar at the bottom-centre of the screen with three pieces:

- **Left arrow**: cycles to the previous variant (wraps around).
- **Variant label**: shows the current variant key and, if the variant exports a name, that name too, e.g. `B (Sidebar layout)`.
- **Right arrow**: cycles forward (wraps around).

Behaviour:

- Clicking an arrow updates the URL search param with the framework router so the variant is shareable and reload-stable.
- Keyboard: `←` and `→` arrow keys also cycle. Do not intercept arrow keys when an `input`, `textarea`, or `[contenteditable]` is focused.
- Visually distinct from the page (high-contrast pill, subtle shadow) so it is obviously not part of the design being evaluated.
- Hidden in production builds: gate on `process.env.NODE_ENV !== 'production'` or equivalent, so a stray prototype merge cannot ship the bar to users.

Put the switcher in a single shared component so both sub-shapes reuse it. Locate it wherever shared UI lives in the project.

### 5. Hand it over

Surface the URL and the `?variant=` keys. The user will flip through when they get to it. The interesting feedback is usually **"I want the header from B with the sidebar from C"**, which is the actual design they want.

### 6. Capture the answer and clean up

Once a variant wins, capture the answer (which variant and why), then capture the prototype the way the [SKILL](SKILL.md) describes. Fold the winner into the real code and move the rest to the throwaway branch, not into main:

- **Sub-shape A**: fold the winner into the existing page; drop the losing variants and the switcher from main.
- **Sub-shape B**: promote the winning variant to a real route; drop the throwaway route and the switcher from main.

The full set of variants is the primary source, so it lands on the throwaway branch, not the bin. Variant components and the switcher rot fast and confuse the next reader if left in main.

## Anti-patterns

- **Variants that differ only in colour or copy.** That's a tweak, not a prototype. Real variants disagree about structure.
- **Sharing too much code between variants.** A shared `Header` is fine; a shared `Layout` defeats the point. Each variant should be free to throw out the layout.
- **Wiring variants to real mutations.** Read-only prototypes are fine. If a variant needs to mutate, point it at a stub: the question is "what should this look like", not "does the backend work".
- **Promoting the prototype directly to production.** The variant code was written under prototype constraints (no tests, minimal error handling). Rewrite it properly when you fold it in.
