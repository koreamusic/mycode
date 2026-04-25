# Pop WiFi MV Studio Dev Log — 2026-04-25 Render Draft

## Scope

This patch connects selected intro presets to a render/export preparation state, exposes that state in the existing preset pages, allows the confirmed render draft to be added to the local render queue as a pending job, adds a safe queue worker state-transition skeleton, defines the local render output artifact shape, and adds manifest-only processing.

It does not start actual video rendering.
It does not execute FFmpeg.
It does not add a new render engine.
It does not change the sidebar, page layout, preset list layout, or preview animation structure.

## Fixed Stack

Continue using:

- Node.js
- Express
- HTML/CSS/JS browser preview
- JSON preset data
- FFmpeg-oriented local workflow

Do not introduce Remotion.
Do not introduce a second render or preset engine.

## Completed

### 1. Render draft API added

Added:

- `server/routes/render-draft.js`

API routes:

- `GET /api/render-draft`
  - Returns current render draft state.

- `PUT /api/render-draft/:kind`
  - Saves the selected preset for `longform` or `shorts`.
  - Validates that selected preset has `ratio`, `batchId`, and `presetId`.

Storage file:

- `data/render-draft.json`

The file is written atomically through a temporary `.tmp` file and rename.

### 2. Server route registered

Updated:

- `server.js`

Registered:

```js
registerRenderDraftRoutes(app, context);
```

### 3. Frontend API client connected

Updated:

- `app/scripts/core/api.js`

Added:

- `api.renderDraft()`
- `api.saveRenderDraftPreset(kind, preset)`

### 4. Frontend state extended

Updated:

- `app/scripts/core/state.js`

Added:

- `renderDraft`
- `setRenderDraft(renderDraft)`

### 5. Preset click now saves render draft

Updated:

- `app/scripts/presets/preset-actions.js`

Behavior:

1. User clicks a preset.
2. UI marks the preset as selected.
3. Preview card updates.
4. Selected preset is saved to `data/render-draft.json` through `PUT /api/render-draft/:kind`.
5. App state stores returned render draft.
6. Render draft confirmation panel refreshes immediately.

If draft save fails, the preview remains usable. This avoids breaking the visible preset browsing flow.

### 6. Render draft confirmation panel added

Updated/added:

- `app/pages/longform.html`
- `app/pages/shorts.html`
- `app/scripts/render/render-draft-panel.js`
- `app/scripts/pages/page-init.js`

Behavior:

- Existing preset pages now include a small render draft panel inside the existing side panel.
- The panel reuses the existing `empty-state` style to avoid creating a new CSS route.
- On page hydration, the panel reads `GET /api/render-draft` and displays any saved selected preset.
- After clicking a preset, the panel updates immediately with:
  - title
  - ratio
  - batchId
  - presetId
  - flow summary
  - variant

### 7. Queue job creation from render draft added

Updated:

- `server/routes/queue.js`
- `app/scripts/core/api.js`
- `app/scripts/render/render-draft-panel.js`
- `app/scripts/render/render-draft-actions.js`
- `app/scripts/app.js`

Server API:

- `POST /api/queue/from-render-draft/:kind`

Behavior:

1. Reads `data/render-draft.json`.
2. Finds selected preset for `longform` or `shorts`.
3. Creates a pending queue job.
4. Appends the job to `data/queue.json` under `pending`.
5. Writes queue atomically through `.tmp` + rename.
6. Returns `{ ok: true, job, queue }`.

Job type:

```txt
intro-preview-render
```

Current job status:

```txt
pending
```

Frontend behavior:

- Render draft panel now shows a `큐에 추가` button.
- Clicking it calls `POST /api/queue/from-render-draft/:kind`.
- Returned queue is stored in app state.
- Panel status changes to `큐에 추가됨`.

Important: this only queues the job. It does not run FFmpeg yet.

### 8. Queue worker state-transition skeleton added

Added/updated:

- `server/core/queue-worker.js`
- `server/routes/queue.js`
- `app/scripts/core/api.js`

Server worker APIs:

- `POST /api/queue/worker/start-next`
  - Moves first pending job to `currentJob`.
  - Sets job status to `running`.
  - Refuses if another job is already running.

- `POST /api/queue/worker/complete-current`
  - Moves `currentJob` to `completed`.
  - Sets job status to `completed`.

- `POST /api/queue/worker/fail-current`
  - Moves `currentJob` to `failed`.
  - Sets job status to `failed`.

Frontend API helpers added:

- `api.startNextQueueJob()`
- `api.completeCurrentQueueJob(result)`
- `api.failCurrentQueueJob(error)`

Important: these are state-transition helpers only. They do not execute FFmpeg or create output files.

### 9. Render output artifact spec added

Added:

- `docs/render-output-spec.md`

Defines:

- output root: `output/renders/`
- temp root: `temp/renders/`
- render log root: `logs/renders/`
- job folder naming using queue job id
- primary future output file: `intro-preview.mp4`
- safe first processor output: `intro-preview-manifest.json`
- completed job result payload shape
- failed job error payload shape
- 12-second intro preview target duration

### 10. Render output path helper added

Added:

- `server/core/render-output.js`

Provides:

- `INTRO_PREVIEW_DURATION_SECONDS`
- `getRenderOutputPaths(rootDir, job)`
- `ensureRenderOutputDirs(rootDir, job)`
- `createRenderResultPayload(rootDir, job)`
- `createRenderErrorPayload(rootDir, job, message, code)`

Important: this module only defines paths and payloads. It does not run FFmpeg.

### 11. Manifest-only processor added

Added/updated:

- `server/core/render-processor.js`
- `server/routes/queue.js`
- `app/scripts/core/api.js`

Server API:

- `POST /api/queue/worker/process-current-manifest`

Behavior:

1. Reads `queue.currentJob`.
2. Requires the current job type to be `intro-preview-render`.
3. Creates output/temp/log directories according to `render-output.js`.
4. Writes:
   - `output/renders/<job-id>/intro-preview-manifest.json`
5. Completes the job with the standard render result payload.
6. If manifest processing fails, moves the job to `failed` with the standard error payload.

Frontend helper added:

- `api.processCurrentQueueManifest()`

Important: this processor only creates a manifest JSON file. It does not run FFmpeg and does not create MP4 output.

## Important Rules Preserved

- Do not touch sidebar.
- Do not change page layout.
- Do not create another preview engine.
- Do not duplicate preset data paths.
- Do not change intro timing.
- Do not add Remotion.
- Keep selected preset as data, not hardcoded UI state.
- Do not add a new CSS file for this panel.
- Do not start FFmpeg until the manifest-only pipeline is verified.

## Current Progress

Estimated total project progress after this patch: 89–90%.

The system now supports:

- 50 real intro presets across five 16:9 batches.
- Preset list browsing.
- Selected preset preview.
- Animated HTML/CSS/JS intro preview.
- Visual token differentiation.
- Regression validation.
- Selected preset render/export preparation state.
- Visible render draft confirmation panel in existing preset pages.
- Queue pending job creation from confirmed render draft.
- Queue state transitions: pending → running → completed/failed.
- Render output path/result/error payload spec.
- Manifest-only queue processing.

## Next Recommended Work

1. Run local server:

```bash
npm run dev
```

2. Validate preset batches:

```bash
npm run validate:preset-batches
```

3. Run API smoke test:

```bash
npm run test:preset-api
```

4. Import all five preset batches.

5. Open Longform Intro page.

6. Click a preset and confirm:

- preview updates
- render draft panel updates
- `data/render-draft.json` is created/updated

7. Click `큐에 추가` and confirm:

- panel says `큐에 추가됨`
- `data/queue.json` gets a new `pending` job
- no FFmpeg process starts yet

8. Test manifest-only worker flow manually:

```bash
curl -X POST http://localhost:3100/api/queue/worker/start-next
curl -X POST http://localhost:3100/api/queue/worker/process-current-manifest
```

9. Confirm:

- `output/renders/<job-id>/intro-preview-manifest.json` exists
- `data/queue.json` moved the job to `completed`
- no MP4 was created yet

10. Next implementation target:

- Review generated manifest and define the first FFmpeg-oriented processor step.
- Do not connect full video output until manifest data is confirmed correct.

## Handoff Note

The next worker should inspect the generated manifest and only then begin the FFmpeg-oriented processor. The first FFmpeg step should be minimal and reversible.
