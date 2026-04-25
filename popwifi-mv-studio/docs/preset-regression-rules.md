# Pop WiFi MV Studio — Preset Regression Rules

## Purpose

This document prevents the recurring failure pattern where adding preset group 1 breaks preset group 2, or where adding new visual presets changes the preview, sidebar, or data flow unexpectedly.

## Fixed Stack

Use this implementation stack only:

- Node.js
- Express
- HTML/CSS/JS browser preview
- JSON preset data
- FFmpeg-oriented local workflow

Do not introduce Remotion.
Do not introduce a second preset engine.
Do not create another parallel preview engine.

## Batch Rule

Preset imports must be grouped by 10 items maximum.

Examples:

- `shared/presets/imports/intro-batch-001-010.json`
- `shared/presets/imports/intro-batch-011-020.json`
- `shared/presets/imports/intro-batch-021-030.json`

Every batch JSON must include:

```json
{
  "ratio": "16x9",
  "batchId": "batch-001-010",
  "presets": []
}
```

## Required Intro Flow

Every intro preset must preserve this flow:

- Frame: 10 seconds
- Title: first 5 seconds
- Like/Subscribe/Notification CTA: next 5 seconds
- Bottom lyric/title bar: starts after 10 seconds and remains visible

Do not change this timing while adding new presets unless the user explicitly requests a timing system change.

## Data Rule

New presets should be added as JSON data, not as new hardcoded CSS blocks for every individual preset.

Preferred structure:

- `variant`: broad visual family such as `jazz`, `lofi`, `ballad`, `anime`, etc.
- `visual`: preset-level token data such as accent colors, palette, texture, typography.
- `layout`: frame/title/CTA/bottom bar placement hints.
- `flow`: required timing.

## Variant Rule

Allowed variants:

- `jazz`
- `lofi`
- `acoustic`
- `kpop`
- `ballad`
- `citypop`
- `blues`
- `anime`
- `chillwave`
- `cafe`
- `cinematic`
- `retro`
- `minimal`
- `spring`
- `night`

A new variant can be added only if multiple presets will reuse it.
Do not create a new variant for a single preset unless the user explicitly requests it.

## CSS Rule

Do not create a new CSS file for preset preview changes.
Use existing `app/styles/app.css` only.

Do not create 50 separate hardcoded CSS rules for 50 presets.
Use shared variants and CSS variables.

## JS Rule

Do not create a duplicate renderer.
Use the existing preview path:

- `app/scripts/presets/preset-preview.js`
- `app/scripts/presets/preset-actions.js`
- `app/scripts/core/state.js`

Do not bypass `preset-preview.js` with another preview implementation.

## Required Validation Before Import

Before importing or committing new preset batch JSON files, run:

```bash
npm run validate:preset-batches
```

Then run the existing API smoke test:

```bash
npm run test:preset-api
```

Then import the target batch:

```bash
npm run import:preset-batch -- shared/presets/imports/intro-batch-011-020.json
```

## Validation Script Checks

The script validates:

- Import JSON files exist.
- Batch id matches `batch-001-010` format.
- Preset count is 1 to 10.
- Preset ids are unique inside each file.
- Preset ids are unique across import files.
- Required fields exist: `id`, `title`, `category`, `description`.
- Required timing is preserved:
  - `frameSeconds: 10`
  - `titleSeconds: 5`
  - `ctaSeconds: 5`
  - `bottomBarStartsAfterSeconds: 10`
- Optional token colors are valid `#RRGGBB` values.
- Optional variants are in the allowed variant list.

## Regression Checklist

After adding a new batch:

1. Run `npm run validate:preset-batches`.
2. Run `npm run test:preset-api`.
3. Import the new batch.
4. Open the Longform Intro page.
5. Confirm old batch still displays.
6. Confirm new batch displays.
7. Click at least one preset from each batch.
8. Confirm title → CTA → bottom bar loop still works.
9. Confirm sidebar and page layout did not change.
10. Confirm no new preview engine, CSS file, or render framework was added.

## Current Progress Marker

After this regression guard patch, estimated project progress is 55–57%.

Next safe work:

- Add `intro-batch-011-020.json` using the same schema.
- Run validation before import.
- Only then continue adding more batches.
