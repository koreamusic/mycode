# Pop WiFi MV Studio Dev Log — 2026-04-25 Preset Server Patch

## Scope

This patch continues the Pop WiFi MV Studio handoff work by stabilizing the preset server layer only.

No UI, sidebar, layout, preview design, intro preset visual design, or Remotion-facing page behavior was changed.

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

## Important Rules Preserved

- Do not touch UI unless explicitly requested.
- Do not modify sidebar/design while working on server preset structure.
- Keep intro preset structure protected: frame/title/CTA/bottom lyric bar flow must not be broken.
- Avoid duplicate engines.
- Keep server preset data flow single-path.
- Do not split intro preset design into unrelated independent pieces from the user perspective.
- Keep files modular so 10-preset batch import can be added safely later.

## Current Progress

Estimated total project progress after this patch: 36–38%.

The preset server layer now has a local smoke-test path, 10-item batch import tooling, and the first real 16:9 intro preset batch JSON.

## Next Recommended Work

1. Run local server: `npm run dev`.
2. In another terminal, run: `npm run test:preset-api`.
3. Test real batch import:
   - `npm run import:preset-batch -- shared/presets/imports/intro-batch-001-010.json`
4. Confirm imported files under:
   - `shared/presets/16x9/batch-001-010/`
5. Add preview/UI wiring only after the import path is confirmed stable.
6. Keep visual design untouched until data/API flow is confirmed stable.

## Notes

This patch was applied directly to `main`. Future larger changes should preferably use a branch/PR flow to preserve rollback safety.
