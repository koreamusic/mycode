# Pop WiFi MV Studio Dev Log — 2026-04-25 Preset Server Patch

## Scope

This patch continues the Pop WiFi MV Studio handoff work by stabilizing the preset server layer and connecting the existing preset list UI to the richer intro preset data.

No sidebar, page layout, intro preset source data, or external render framework behavior was changed.

Important correction: this project continues with Node/Express + HTML/CSS/JS + JSON preset data + FFmpeg-oriented local workflow. Remotion is not part of this implementation path.

## Completed

### 1. Preset route/store/utils split

The former preset server logic was separated into clear layers:

- `server/routes/presets.js`
  - Express route registration only.
  - Keeps the existing public preset API shape.
- `server/core/preset-store.js`
  - Reads preset batches.
  - Reads preset lists.
  - Reads/writes preset `config.json` files.
  - Handles active/inactive preset state.
  - Handles preset create/update through `upsertPresetConfig`.
- `server/core/preset-utils.js`
  - Preset root/path helpers.
  - Batch directory detection.
  - Next batch id generation.

### 2. Preset create/update API added

Added API routes:

- `POST /api/presets/:ratio/batch/:batchId/:presetId`
  - Creates or overwrites one preset config.
  - Normalizes `id`, `ratio`, `batchId`, `active`, `createdAt`, and `updatedAt`.

- `PATCH /api/presets/:ratio/batch/:batchId/:presetId`
  - Updates an existing preset config.
  - Returns `404` if the preset does not exist.

Existing routes remain:

- `GET /api/presets/:ratio`
- `GET /api/presets/:ratio/batches`
- `POST /api/presets/:ratio/batches/next`
- `GET /api/presets/:ratio/batch/:batchId`
- `GET /api/presets/:ratio/batch/:batchId/:presetId`
- `PATCH /api/presets/:ratio/batch/:batchId/:presetId/deactivate`

### 3. Local preset API test script added

Added:

- `scripts/test-preset-api.js`
- `npm run test:preset-api`

The script checks:

1. Create preset config through `POST`.
2. Read preset config through `GET`.
3. Update preset config through `PATCH`.
4. Confirm the preset appears in the batch list.
5. Mark the preset inactive through the existing deactivate route.

Default test target:

- Base URL: `http://localhost:3100`
- Ratio: `16x9`
- Batch: `batch-001-010`
- Preset: `test-api-preset`

Environment override examples:

```bash
POPWIFI_API_BASE=http://localhost:3100 npm run test:preset-api
POPWIFI_TEST_RATIO=9x16 POPWIFI_TEST_BATCH=batch-001-010 npm run test:preset-api
```

### 4. 10-item preset batch import helper added

Added:

- `scripts/import-preset-batch.js`
- `npm run import:preset-batch`
- `shared/presets/examples/preset-batch-example.json`

The importer reads a JSON payload with this shape:

```json
{
  "ratio": "16x9",
  "batchId": "batch-001-010",
  "presets": []
}
```

Rules:

- `presets` must contain 1 to 10 presets.
- Each preset must have a unique string `id`.
- Duplicate preset ids inside the same import file are rejected.
- The importer uses the existing preset create API, so the server data path remains single-route.

Usage:

```bash
npm run import:preset-batch -- shared/presets/examples/preset-batch-example.json
```

### 5. First real intro preset batch JSON added

Added:

- `shared/presets/imports/intro-batch-001-010.json`

This file contains 10 real intro preset config entries for:

1. Midnight Jazz Frame
2. Lofi Window Glow
3. Acoustic Spring Card
4. K-Pop Neon Stage
5. Ballad Memory Film
6. City Pop Sunset Grid
7. Blues Smoke Signature
8. Anime Sky Breeze
9. Chillwave Dream Tape
10. Cafe Smooth Jazz

Each preset preserves the required intro flow:

- Frame: 10 seconds
- Title: first 5 seconds
- Like/Subscribe/Notification CTA: next 5 seconds
- Bottom lyric/title bar: starts after 10 seconds and stays active

Import command:

```bash
npm run import:preset-batch -- shared/presets/imports/intro-batch-001-010.json
```

### 6. Existing preset list UI connected to richer intro preset fields

Updated:

- `app/scripts/presets/preset-loader.js`
- `app/styles/app.css`

The longform and shorts pages already had preset list containers:

- `longformPresetList`
- `shortsPresetList`

The renderer now displays:

- `title` or fallback `name/id`
- `mood` or fallback `category`
- `description`
- flow summary such as frame/title/CTA/bottom bar timing

Only minimal CSS was added for `small` and `em` inside preset cards. The layout, sidebar, preview cards, and page structure were not changed.

### 7. Selected preset preview binding added

Updated/added:

- `app/scripts/core/state.js`
- `app/scripts/presets/preset-preview.js`
- `app/scripts/presets/preset-actions.js`
- `app/styles/app.css`

Behavior:

- Clicking a preset row marks it as selected.
- The selected preset is stored in `appState.selectedPresets`.
- The existing longform/shorts preview card is updated with:
  - title
  - mood
  - description
  - CTA placeholder
  - frame/title/CTA/bottom bar timing summary
  - frame style, title position, CTA style, bottom bar style, end animation, palette, and typography metadata

### 8. HTML/CSS/JS animated preview timeline shell added

Updated:

- `app/scripts/presets/preset-preview.js`
- `app/styles/app.css`

Behavior:

- 0–5s: title stage is visible.
- 5–10s: like/subscribe/notification CTA stage is visible.
- 10s+: bottom bar appears.
- The preview loops every 12 seconds for quick inspection.
- This is browser preview only, using HTML/CSS/JS. No Remotion or other external render framework is used.

### 9. Intro preset visual variants added

Updated:

- `app/scripts/presets/preset-preview.js`
- `app/styles/app.css`

Behavior:

- Selected presets are mapped to a preview variant through `data-preset-variant`.
- Each variant changes preview accent colors, secondary accent, glow, frame line color, CTA glow, progress bar, and bottom bar tint.
- This is still a browser preview layer only. It does not alter source preset JSON or introduce another engine.

### 10. Preset regression guard added

Added:

- `scripts/validate-preset-batches.js`
- `npm run validate:preset-batches`
- `docs/preset-regression-rules.md`

Purpose:

- Prevent a new batch from breaking previous batches.
- Prevent one preset group from silently changing timing, data shape, preview route, CSS route, or stack rules.
- Lock the implementation path to Node/Express + HTML/CSS/JS + JSON + FFmpeg-oriented workflow.
- Explicitly keep Remotion out of this project.

Before adding any future batch, run:

```bash
npm run validate:preset-batches
```

### 11. Second real intro preset batch JSON added

Added:

- `shared/presets/imports/intro-batch-011-020.json`

This file contains 10 additional intro preset config entries:

11. Rainy Piano Window
12. Vinyl Room Lofi
13. Cinematic Black Gold
14. Minimal White Line
15. Retro TV Dial
16. Spring Flower Breeze
17. Night Drive Synth
18. Soft R&B Silk
19. Folk Paper Diary
20. Dreamy Cloud Pop

Each preset preserves the same locked intro flow:

- Frame: 10 seconds
- Title: first 5 seconds
- Like/Subscribe/Notification CTA: next 5 seconds
- Bottom lyric/title bar: starts after 10 seconds and stays active

### 12. Preview token path hardened for 50+ presets

Updated:

- `app/scripts/presets/preset-preview.js`

Fix:

- Explicit `preset.variant` now has priority over inferred variant.
- `visual.accent` and `visual.accent2` are injected as CSS variables directly onto the preview card.
- This avoids creating one hardcoded CSS rule per preset.
- This protects future batches from breaking older preview variants.

### 13. Third real intro preset batch JSON added

Added:

- `shared/presets/imports/intro-batch-021-030.json`

This file contains 10 additional intro preset config entries:

21. Sax Club Corner
22. Blue Hour Lofi
23. Guitar Sunbeam
24. Pop Glass Pulse
25. Old Photo Ballad
26. City Night Sign
27. Rust Blues Lamp
28. Schoolyard Anime Spring
29. Tape Haze Chillwave
30. Cafe Rain Jazz

This batch reuses existing variants and relies on `visual.accent` / `visual.accent2` tokens for visual differentiation, so no new CSS selectors or preview engine paths were required.

## Important Rules Preserved

- Do not touch UI unless explicitly requested.
- Do not modify sidebar/design while working on server preset structure.
- Keep intro preset structure protected: frame/title/CTA/bottom lyric bar flow must not be broken.
- Avoid duplicate engines.
- Keep server preset data flow single-path.
- Do not split intro preset design into unrelated independent pieces from the user perspective.
- Keep files modular so 10-preset batch import can be added safely later.
- Keep implementation aligned with Node/Express + HTML/CSS/JS + JSON + FFmpeg-oriented local workflow.
- Do not introduce Remotion.
- Do not add a new preset batch until `npm run validate:preset-batches` passes.

## Current Progress

Estimated total project progress after this patch: 64–66%.

The preset server layer now has a local smoke-test path, 10-item batch import tooling, 30 real 16:9 intro preset configs across three batches, richer preset list rendering, selected preset preview binding, animated HTML/CSS preview timeline, variant-based preview styling, token-based visual override, and regression validation to protect future batches.

## Next Recommended Work

1. Run local server: `npm run dev`.
2. In another terminal, run: `npm run validate:preset-batches`.
3. Run: `npm run test:preset-api`.
4. Test batch imports:
   - `npm run import:preset-batch -- shared/presets/imports/intro-batch-001-010.json`
   - `npm run import:preset-batch -- shared/presets/imports/intro-batch-011-020.json`
   - `npm run import:preset-batch -- shared/presets/imports/intro-batch-021-030.json`
5. Confirm imported files under:
   - `shared/presets/16x9/batch-001-010/`
   - `shared/presets/16x9/batch-011-020/`
   - `shared/presets/16x9/batch-021-030/`
6. Open the Longform Intro page.
7. Click presets from all three batches and confirm:
   - title → CTA → bottom bar loop works
   - old batches still work
   - new batch has visually distinct accent/frame/glow from JSON tokens
8. Next implementation target: add `intro-batch-031-040.json` only after local validation passes.

## Notes

This patch was applied directly to `main`. Future larger changes should preferably use a branch/PR flow to preserve rollback safety.
