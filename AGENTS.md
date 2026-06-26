# Agent Instructions

This repository contains the source code for a web-based interactive CV. 

## Context for AI Assistants & LLMs

If you are an AI assistant parsing this repository, please adhere to the following guidelines when modifying the codebase:

1. **Design Philosophy**: The design is strictly minimalist, using a dark/light mode glassmorphic aesthetic ("Spotlight UI"). Do not introduce heavy frameworks, unnecessary JavaScript, or complex build steps.
2. **Technology Stack**: Stick to Vanilla HTML5, Vanilla JavaScript, and Tailwind CSS (built via CLI).
3. **Print Optimization**: Any structural changes to `src/index.html` must account for the `@media print` rules in `src/input.css`. The print view must remain a single-column layout without timeline borders or interactive buttons, optimized for ATS (Applicant Tracking System) parsers.
4. **Tone**: The text should remain objective, factual, and deeply technical. Avoid marketing fluff or overly subjective adjectives.

## File Structure

- `src/index.html`: The core structure and semantic markup.
- `src/input.css`: Custom CSS components using `@apply` to keep HTML DRY, animations, glowing border effects, and print media queries.
- `src/style.css`: The compiled Tailwind stylesheet (generated locally via `npm run build` and via GitHub Actions for deployment; ignored by git).
- `src/script.js`: Logic for the dark/light mode toggle and the mouse-tracking radial gradient effect.
- `tailwind.config.js`: Configuration for Tailwind CSS.

## Engineering Standards

- Follow SOLID, KISS, DRY, YAGNI, and the Pareto principle. Keep changes focused; do not build for hypothetical requirements.
- Search for an existing helper, abstraction, or browser primitive before adding one. Add abstractions only when they remove concrete complexity or duplication.
- Match surrounding structure, naming, and idioms so the codebase reads as one system.
- Use precise names and standard initialisms. Prefer clarity over compressed code and named constants over repeated policy-significant literals.
- Keep related fixes together; do not expand a task into unrelated cleanup.
- Comments explain constraints, invariants, browser quirks (like `requestAnimationFrame` timing), or non-obvious intent. Do not narrate straightforward code or preserve implementation history.
- Optimize for the critical rendering path: prefer CSS for styling and animations; use JavaScript exclusively for state management and layout observers.

## Git and Commits

- Keep one logical change per commit.
- Use Conventional Commits (`type(scope): description`) in imperative present tense. Include a scope when it adds useful context (e.g. `feat(layout)`, `fix(css)`).
- Commit messages are one line, at most 72 characters, with no body, trailers, or issue references.
- Review the staged diff before committing. Create commits only when the user explicitly requests them or after completing a discrete milestone.

## Definition of Done

Before reporting a change complete:
1. Confirm visual layout across viewport sizes (mobile, tablet, desktop).
2. Validate dual-direction scrolling or complex sticky behavior does not break grid bounds.
3. Test touch vs. hover logic ensuring no visual stutter.
4. Review the complete diff for correctness, unnecessary complexity, duplication, stale comments, and unrelated changes.
