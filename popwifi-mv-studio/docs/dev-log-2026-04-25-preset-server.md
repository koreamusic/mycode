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

## Important Rules Preserved

- Do not touch UI unless explicitly requested.
- Do not modify sidebar/design while working on server preset structure.
- Keep intro preset structure protected: frame/title/CTA/bottom lyric bar flow must not be broken.
- Avoid duplicate engines.
- Keep server preset data flow single-path.
- Do not split intro preset design into unrelated independent pieces from the user perspective.
- Keep files modular so 10-preset batch import can be added safely later.

## Current Progress

Estimated total project progress after this patch: 26–28%.

The preset server layer is now ready for the next phase: UI-side preset save/import wiring or batch importer tooling.

## Next Recommended Work

1. Add a small local validation/test script for preset APIs.
2. Add batch import helper for 10 presets at a time.
3. Connect the preset management UI to:
   - batch list
   - preset list
   - create/update preset config
4. Keep visual design untouched until data/API flow is confirmed stable.

## Notes

This patch was applied directly to `main`. Future larger changes should preferably use a branch/PR flow to preserve rollback safety.
