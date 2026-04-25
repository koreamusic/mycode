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
- Playwright dev dependency for Chromium screenshot capture

The dummy MP4 proves FFmpeg path, output folders, logging, and queue transitions only.
It is not final rendering.

## Target Rendering Strategy

The first real visual render should use a browser-capture pipeline:

```txt
queue.currentJob
-> load selected preset data
-> open a local capture page in a browser engine
-> render the same HTML/CSS/JS preview at fixed viewport size
-> capture frames or screenshots for 12 seconds
-> assemble frames into intro-preview.mp4 with FFmpeg
```

## Why Browser Capture

The preview is already HTML/CSS/JS.
To avoid duplicating design logic, the render should capture the existing preview route instead of recreating the design in another renderer.

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
30fps
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

## Frame Capture Plan

Safe first real visual pipeline:

```txt
1. Start current queue job.
2. Create output/temp/log folders.
3. Generate manifest.
4. Open capture page at 1920x1080.
5. Capture still frames to temp/renders/<job-id>/frames/.
6. Use FFmpeg to assemble frames into output/renders/<job-id>/intro-preview.mp4.
7. Complete queue job.
```

## Browser Tool

Browser capture tool:

```txt
Playwright with Chromium
```

Reason:

- reliable local headless browser control
- viewport control
- screenshot capture
- no Remotion dependency
- common Node ecosystem fit

Playwright is now listed in `devDependencies`.

Install browser runtime after `npm install`:

```bash
npm run install:browser
```

This runs:

```bash
npx playwright install chromium
```

## Single Screenshot Helper

Added helper:

```txt
scripts/capture-intro-screenshot.js
```

Package script:

```bash
npm run capture:intro-screenshot -- <job-id>
```

Optional output path:

```bash
npm run capture:intro-screenshot -- <job-id> temp/captures/<job-id>/intro-preview.png
```

Default output:

```txt
temp/captures/<job-id>/intro-preview.png
```

This helper:

- opens `/app/capture/intro-preview.html?jobId=<job-id>`
- sets viewport to `1920x1080`
- waits briefly for preview hydration
- saves one PNG screenshot

It does not capture frame sequences.
It does not assemble video.
It does not run FFmpeg.

## Reduced-FPS Frame Sequence Helper

Added helper:

```txt
scripts/capture-intro-frame-sequence.js
```

Package script:

```bash
npm run capture:intro-frames -- <job-id>
```

Optional output directory:

```bash
npm run capture:intro-frames -- <job-id> temp/captures/<job-id>/frames
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

This helper:

- opens `/app/capture/intro-preview.html?jobId=<job-id>`
- captures PNG frames over time
- saves them as `frame-000001.png`, `frame-000002.png`, etc.

It does not assemble video.
It does not run FFmpeg.

## First Real Rendering Milestones

### Milestone 1 — Capture Page Static Proof

- Build `/app/capture/intro-preview.html`.
- Load one preset by job id.
- Render a still preview frame.
- No FFmpeg.

Status: implemented as capture page skeleton.

### Milestone 2 — Single Screenshot Capture

- Add a Node capture helper.
- Use browser automation to capture one PNG frame.
- Save under `temp/captures/<job-id>/intro-preview.png` first.

Status: helper added, Playwright dependency added.

### Milestone 3 — Frame Sequence Capture

- Capture 12 seconds at reduced test FPS first, for example 6fps.
- Confirm animation phases visually.
- Then move to 30fps.

Status: reduced-FPS helper added, FFmpeg assembly not yet added.

### Milestone 4 — FFmpeg Assembly

- Assemble PNG frames into MP4.
- Output to `output/renders/<job-id>/intro-preview.mp4`.

Status: not implemented for real preview capture.

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

After this reduced-FPS frame sequence helper patch, estimated project progress is 95–96%.

Next safe implementation:

- Run frame capture at 6fps.
- Manually inspect title → CTA → bottom bar frames.
- Then add FFmpeg frame assembly from captured PNGs.
