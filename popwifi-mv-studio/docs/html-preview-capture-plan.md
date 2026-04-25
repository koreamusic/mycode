# Pop WiFi MV Studio — HTML Preview Capture Plan

## Purpose

This document defines how the existing HTML/CSS/JS intro preview should become an actual video without introducing Remotion or a second render engine.

This is the step after dummy FFmpeg validation and before real visual rendering.

## Fixed Stack

Use:

- Node.js
- Express
- HTML/CSS/JS preview
- JSON preset data
- Local browser capture
- FFmpeg-oriented assembly

Do not use:

- Remotion
- A second preset engine
- A parallel preview implementation

## Current State

The project already has:

- 50 intro preset JSON configs
- HTML/CSS/JS browser preview
- render draft state
- queue pending jobs
- queue state transitions
- manifest-only processor
- dummy 12-second FFmpeg MP4 validation
- capture page skeleton
- single screenshot capture helper script
- reduced-FPS frame sequence capture helper script
- frame sequence FFmpeg assembly helper script
- queue-integrated capture MP4 processor
- one-click UI render execution from the render draft panel
- Playwright dev dependency for Chromium screenshot capture

The dummy MP4 proves FFmpeg path, output folders, logging, and queue transitions only.
It is not final rendering.

## Target Rendering Strategy

The first real visual render uses this browser-capture pipeline:

```txt
queue.currentJob
-> capture page
-> Playwright Chromium screenshots
-> PNG frame sequence
-> FFmpeg assembly
-> intro-preview.mp4
```

## Why Browser Capture

The preview is already HTML/CSS/JS.
To avoid duplicating design logic, the render captures the existing preview route instead of recreating the design in another renderer.

This prevents:

- preview and output mismatch
- duplicate animation logic
- second engine drift
- Remotion dependency

## Capture Page Requirement

Current capture page:

```txt
/app/capture/intro-preview.html
```

It:

- accepts `jobId` as a query param
- loads queue data from the server
- finds the matching job from current/pending/completed/failed queue groups
- renders only the intro preview canvas area
- hides sidebars, panels, controls, and debug UI
- reuses the existing preview renderer

Manual route:

```txt
/app/capture/intro-preview.html?jobId=<job-id>
```

## Viewport Rules

For 16:9 longform:

```txt
1920x1080
30fps target later
6fps current queue-integrated validation
12 seconds
```

For 9:16 shorts later:

```txt
1080x1920
30fps
12 seconds
```

Do not mix these in the same capture stage.
Longform should be stabilized first.

## Timing Rules

The capture pipeline must preserve:

- frame: 10 seconds
- title: 0–5 seconds
- CTA: 5–10 seconds
- bottom bar: 10 seconds onward
- total preview render target: 12 seconds

## Browser Tool

Browser capture tool:

```txt
Playwright with Chromium
```

Install browser runtime after `npm install`:

```bash
npm run install:browser
```

This runs:

```bash
npx playwright install chromium
```

## Single Screenshot Helper

Helper:

```txt
scripts/capture-intro-screenshot.js
```

Package script:

```bash
npm run capture:intro-screenshot -- <job-id>
```

Default output:

```txt
temp/captures/<job-id>/intro-preview.png
```

This helper does not capture frame sequences, assemble video, or run FFmpeg.

## Reduced-FPS Frame Sequence Helper

Helper:

```txt
scripts/capture-intro-frame-sequence.js
```

Package script:

```bash
npm run capture:intro-frames -- <job-id>
```

Default output:

```txt
temp/captures/<job-id>/frames/frame-000001.png
```

Default capture settings:

```txt
6fps
12 seconds
72 PNG frames
1920x1080 viewport
```

Environment overrides:

```bash
POPWIFI_CAPTURE_FPS=6 POPWIFI_CAPTURE_DURATION=12 npm run capture:intro-frames -- <job-id>
```

## Frame Sequence Assembly Helper

Helper:

```txt
scripts/assemble-intro-frames.js
```

Package script:

```bash
npm run assemble:intro-frames -- <job-id>
```

Default input:

```txt
temp/captures/<job-id>/frames/frame-%06d.png
```

Default output:

```txt
output/captures/<job-id>/intro-preview.mp4
```

Default log:

```txt
logs/captures/<job-id>-assemble.log
```

This is a manual capture test path.

## Queue-Integrated Capture MP4 Processor

Added processor:

```txt
server/core/render-capture-processor.js
```

Server route:

```txt
POST /api/queue/worker/process-current-capture-mp4
```

Frontend helper:

```txt
api.processCurrentQueueCaptureMp4()
```

Behavior:

```txt
queue.currentJob
-> ensure output/temp/log folders
-> open /app/capture/intro-preview.html?jobId=<job-id>
-> capture 6fps / 12s PNG frames to temp/renders/<job-id>/frames/
-> write output/renders/<job-id>/intro-preview-manifest.json
-> assemble frames into output/renders/<job-id>/intro-preview.mp4
-> write logs/renders/<job-id>.log
-> move currentJob to completed
```

Failure behavior:

```txt
capture/assembly error
-> standard render error payload
-> move currentJob to failed
```

## One-Click UI Render Execution

The existing render draft panel now includes:

```txt
큐에 추가
렌더 실행
```

The `렌더 실행` button runs this sequence:

```txt
createQueueJobFromRenderDraft(kind)
-> startNextQueueJob()
-> processCurrentQueueCaptureMp4()
-> update panel status to 렌더 완료
-> show primary output path when available
```

This creates an actual captured preview MP4 through the queue-integrated 6fps validation pipeline.

## First Real Rendering Milestones

### Milestone 1 — Capture Page Static Proof

Status: implemented as capture page skeleton.

### Milestone 2 — Single Screenshot Capture

Status: helper added, Playwright dependency added.

### Milestone 3 — Frame Sequence Capture

Status: reduced-FPS helper added.

### Milestone 4 — FFmpeg Assembly

Status: helper added for manual capture test path.

### Milestone 5 — Queue-Integrated Capture MP4

Status: implemented at 6fps validation level.

### Milestone 6 — One-Click UI Render

Status: implemented through the render draft panel.

Not yet final:

- 30fps production capture
- 9:16 capture-specific viewport
- audio/music integration
- subtitle/lyrics timing integration
- final FFmpeg composition rules

## Avoided Shortcut

Do not directly generate the intro design in FFmpeg filters.
That would create a second design engine and drift from the HTML/CSS preview.

## Required Regression Checks

Before real capture is considered successful:

1. Existing longform preset UI still works.
2. Existing preview still works.
3. Render draft still saves.
4. Queue job still works.
5. Manifest-only processor still works.
6. Dummy MP4 processor still works.
7. Capture output visually matches the selected preset preview.
8. No Remotion dependency added.
9. No new duplicate preview renderer added.

## Current Progress Marker

After one-click UI render execution, estimated project progress is 98–99% for the intro preset render pipeline.

Next safe implementation:

- Run the one-click render locally.
- Inspect generated MP4.
- If visual match is acceptable, add a 30fps option or production quality toggle.
- Then plan 9:16 capture and music/lyrics integration separately.
