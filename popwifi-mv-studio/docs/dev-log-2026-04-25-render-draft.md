# Pop WiFi MV Studio Dev Log — 2026-04-25 Render Draft

## Scope

This patch connects selected intro presets to a render/export preparation state, exposes that state in the existing preset pages, allows the confirmed render draft to be added to the local render queue as a pending job, adds a safe queue worker state-transition skeleton, defines the local render output artifact shape, adds manifest-only processing, adds a minimal dummy MP4 FFmpeg validation step, and defines the first HTML preview capture page skeleton.

It does not implement final preset rendering.
It does not capture frames yet.
It does not assemble the actual HTML/CSS preview into video yet.
It does not add a new render engine.
It does not change the sidebar, page layout, preset list layout, or preview animation structure.

## Fixed Stack

Continue using:

- Node.js
- Express
- HTML/CSS/JS browser preview
- JSON preset data
- browser capture later
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
- After clicking a preset, the panel updates immediately with title, ratio, batchId, presetId, flow summary, and variant.

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

Frontend behavior:

- Render draft panel now shows a `큐에 추가` button.
- Clicking it calls `POST /api/queue/from-render-draft/:kind`.
- Returned queue is stored in app state.
- Panel status changes to `큐에 추가됨`.

### 8. Queue worker state-transition skeleton added

Added/updated:

- `server/core/queue-worker.js`
- `server/routes/queue.js`
- `app/scripts/core/api.js`

Server worker APIs:

- `POST /api/queue/worker/start-next`
- `POST /api/queue/worker/complete-current`
- `POST /api/queue/worker/fail-current`

Frontend API helpers added:

- `api.startNextQueueJob()`
- `api.completeCurrentQueueJob(result)`
- `api.failCurrentQueueJob(error)`

### 9. Render output artifact spec added

Added:

- `docs/render-output-spec.md`

Defines output/temp/log roots, job folder naming, future `intro-preview.mp4`, safe `intro-preview-manifest.json`, result payload, error payload, and 12-second target duration.

### 10. Render output path helper added

Added:

- `server/core/render-output.js`

Provides render output path and payload helpers only. It does not run FFmpeg.

### 11. Manifest-only processor added

Added/updated:

- `server/core/render-processor.js`
- `server/routes/queue.js`
- `app/scripts/core/api.js`

Server API:

- `POST /api/queue/worker/process-current-manifest`

Behavior:

- Creates output/temp/log directories.
- Writes `output/renders/<job-id>/intro-preview-manifest.json`.
- Completes the job with the standard render result payload.

Important: this processor only creates a manifest JSON file. It does not run FFmpeg and does not create MP4 output.

### 12. Dummy MP4 FFmpeg validation processor added

Updated:

- `server/core/render-processor.js`
- `server/routes/queue.js`
- `app/scripts/core/api.js`

Server API:

- `POST /api/queue/worker/process-current-dummy-mp4`

Behavior:

- Creates output/temp/log directories.
- Writes `intro-preview-manifest.json` with mode `dummy-mp4`.
- Runs FFmpeg to create a 12-second black 1920x1080 MP4.
- Writes FFmpeg stdout/stderr to `logs/renders/<job-id>.log`.
- Completes or fails the job with standard payloads.

Important: this is a pipeline validation output only. It is not final preset rendering and does not capture the HTML/CSS intro design.

### 13. HTML preview capture plan added

Added:

- `docs/html-preview-capture-plan.md`

Defines the Remotion-free real rendering direction:

```txt
queue.currentJob
-> capture page
-> browser frame/screenshot capture
-> FFmpeg assembly
```

The preferred later browser tool is Playwright with Chromium, but Playwright has not been added yet.

### 14. Capture page skeleton added

Added:

- `app/capture/intro-preview.html`
- `app/scripts/capture/intro-preview-capture.js`

Behavior:

- Opens a full-screen black capture canvas.
- Accepts `jobId` as query parameter.
- Reads `GET /api/queue`.
- Finds matching job in `currentJob`, `pending`, `completed`, or `failed`.
- Uses the existing `renderSelectedPresetPreview()` path to render the selected preset preview.
- Hides normal app layout/sidebar by using a dedicated capture page.

Example URL:

```txt
/app/capture/intro-preview.html?jobId=<job-id>
```

Important: this is only a capture page skeleton. It does not yet automate browser screenshots or create frame sequences.

## Important Rules Preserved

- Do not touch sidebar.
- Do not change main page layout.
- Do not create another preview engine.
- Do not duplicate preset data paths.
- Do not change intro timing.
- Do not add Remotion.
- Keep selected preset as data, not hardcoded UI state.
- Do not add Playwright until capture page contract is reviewed.
- Do not treat dummy MP4 as final rendering.

## Current Progress

Estimated total project progress after this patch: 92–93%.

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
- Dummy FFmpeg MP4 pipeline validation.
- Dedicated capture page skeleton for future HTML/CSS preview rendering.

## Next Recommended Work

1. Run local server:

```bash
npm run dev
```

2. Add a queue job and start it.

3. Open capture page manually:

```txt
http://localhost:3100/app/capture/intro-preview.html?jobId=<job-id>
```

4. Confirm:

- selected preset preview appears
- no sidebar is visible
- preview fills capture viewport
- title → CTA → bottom bar animation loop works

5. Next implementation target:

- Add a single screenshot capture helper after capture page is visually confirmed.
- Do not add full frame sequence capture yet.

## Handoff Note

The next worker should first open the capture page manually and inspect it. If the capture page is wrong, fix it before adding Playwright or any browser automation.
