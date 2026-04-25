# Pop WiFi MV Studio — Render Output Spec

## Purpose

This document defines the output artifact shape for queued `intro-preview-render` jobs before any FFmpeg execution is connected.

This is a required safety step. Do not connect FFmpeg until this output shape is reviewed and stable.

## Fixed Stack

Use:

- Node.js
- Express
- HTML/CSS/JS preview
- JSON preset data
- FFmpeg-oriented local workflow

Do not introduce Remotion.
Do not introduce another render engine.

## Job Type

Current queue job type:

```txt
intro-preview-render
```

The job is created from:

```txt
data/render-draft.json
```

and queued into:

```txt
data/queue.json
```

## Queue State Flow

```txt
pending -> running -> completed
pending -> running -> failed
```

Do not skip `running`.
Do not execute FFmpeg directly from `pending` without moving the job to `running` first.

## Output Root

All rendered output files must be placed under:

```txt
output/renders/
```

Temporary working files must be placed under:

```txt
temp/renders/
```

Logs must be placed under:

```txt
logs/renders/
```

## Job Folder Naming

Each job should use its queue job id as the folder name.

Example:

```txt
output/renders/render-1710000000000-abc123/
temp/renders/render-1710000000000-abc123/
logs/renders/render-1710000000000-abc123.log
```

## Output File Naming

For an `intro-preview-render` job, the primary output should be:

```txt
intro-preview.mp4
```

Full path example:

```txt
output/renders/render-1710000000000-abc123/intro-preview.mp4
```

Optional future outputs:

```txt
intro-preview.webm
intro-preview-thumbnail.jpg
intro-preview-manifest.json
```

Do not add these optional outputs until the primary MP4 path is stable.

## Result Payload Shape

When a job completes, `queue.completed[0].result` should use this shape:

```json
{
  "outputDir": "output/renders/render-1710000000000-abc123",
  "primaryFile": "output/renders/render-1710000000000-abc123/intro-preview.mp4",
  "logFile": "logs/renders/render-1710000000000-abc123.log",
  "durationSeconds": 12,
  "format": "mp4",
  "createdAt": "2026-04-25T00:00:00.000Z"
}
```

## Error Payload Shape

When a job fails, `queue.failed[0].error` should use this shape:

```json
{
  "message": "Human-readable failure message",
  "code": "RENDER_FAILED",
  "logFile": "logs/renders/render-1710000000000-abc123.log",
  "failedAt": "2026-04-25T00:00:00.000Z"
}
```

## Intro Preview Duration

Current HTML/CSS preview loop is 12 seconds.

So the first local render target should be:

```txt
12 seconds
```

Do not change intro preset source timing:

- frame: 10 seconds
- title: first 5 seconds
- CTA: next 5 seconds
- bottom bar: 10 seconds onward

The 12-second render duration exists only to show the full preview loop, including the 10s+ bottom bar.

## Required Job Payload Fields

A render job must include:

```json
{
  "id": "render-...",
  "type": "intro-preview-render",
  "kind": "longform",
  "status": "pending",
  "preset": {
    "ratio": "16x9",
    "batchId": "batch-001-010",
    "presetId": "intro-001-midnight-jazz-frame",
    "title": "Midnight Jazz Frame",
    "variant": "jazz",
    "flow": {},
    "visual": {},
    "layout": {},
    "cta": {},
    "bottomBar": {}
  }
}
```

## Render Processor Rule

The first processor implementation should only create folders and a manifest file.

Recommended first safe processor output:

```txt
output/renders/<job-id>/intro-preview-manifest.json
```

Only after that works should FFmpeg output be connected.

## Regression Checklist

Before adding FFmpeg:

1. Add a job to queue from render draft.
2. Start next pending job.
3. Create output/temp/log folders.
4. Write manifest JSON.
5. Complete the job with the expected result payload.
6. Confirm no sidebar/page layout changed.
7. Confirm no new render engine was added.
8. Confirm no Remotion dependency was added.

## Current Progress Marker

After this spec, estimated project progress is 87–88%.

Next safe implementation:

- Add a processor skeleton that creates folders and writes `intro-preview-manifest.json` only.
- Do not run FFmpeg yet.
