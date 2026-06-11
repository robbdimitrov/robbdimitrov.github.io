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
