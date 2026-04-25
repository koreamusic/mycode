# Pop WiFi MV Studio Dev Log — 2026-04-25 Final Preset-Ready Checkpoint

## Purpose

This document closes the current implementation checkpoint and moves the project into the next work mode: preset production.

The current phase is no longer about redesigning the app or rebuilding the preset engine. The next phase is to create, add, review, and refine intro presets using the existing file-based preset system.

## Fixed Rules

- Do not use Remotion.
- Do not redesign the whole app.
- Do not create another preset engine.
- Do not create another render engine.
- Use the existing HTML/CSS preview system.
- Keep the preset system file-based under `shared/presets`.
- Keep JSON token-based.
- Do not put raw CSS blobs in preset JSON.
- Preserve backward compatibility.
- Preserve current sidebar/page structure.

## Completed in This Phase

### Intro preset engine

Completed.

The app can load intro presets from the file-based preset structure:

```txt
shared/presets/<ratio>/<batchId>/<presetId>/config.json
```

### Render pipeline

Completed for current phase.

Render draft, queue creation, queue state transition, manifest processing, dummy MP4 validation, and capture page skeleton are in place.

Final high-fidelity preview-to-MP4 capture remains a later refinement, not a blocker for preset production.

### UI

Completed for current phase.

Do not redesign the whole app in the next phase.

### Shorts 9:16

Completed for current phase.

The uploaded shorts preset zip was inspected and its five official config presets were added.

Current official uploaded shorts presets:

```txt
shared/presets/9x16/batch-001-010/preset-shorts-001/config.json
shared/presets/9x16/batch-001-010/preset-shorts-002/config.json
shared/presets/9x16/batch-001-010/preset-shorts-003/config.json
shared/presets/9x16/batch-001-010/preset-shorts-004/config.json
shared/presets/9x16/batch-001-010/preset-shorts-005/config.json
```

The temporary `shorts-001~005-*` config files that were created before the upload zip was confirmed were removed to avoid duplicate presets.

Existing `moon-dust-window` was preserved.

### Preset authoring spec

Completed for current phase.

The next work should follow the preset authoring guide and the new preset production guide.

### Motion engine

Completed for current phase.

`renderSelectedPresetPreview()` now reads `preset.motion` and applies normalized motion tokens as data attributes:

```txt
data-motion-frame-exit
data-motion-title
data-motion-cta
data-motion-bottom-bar
data-motion-end
data-motion-cadence
```

`app/styles/app.css` maps these data attributes to CSS animations.

Motion flow:

```txt
preset JSON token
-> renderSelectedPresetPreview()
-> data-motion-* attribute
-> app.css animation mapping
```

### 16:9 50 preset import support

Completed for current phase.

The repository has five 16:9 import batch JSON files:

```txt
shared/presets/imports/intro-batch-001-010.json
shared/presets/imports/intro-batch-011-020.json
shared/presets/imports/intro-batch-021-030.json
shared/presets/imports/intro-batch-031-040.json
shared/presets/imports/intro-batch-041-050.json
```

The app API does not read these import files directly. It reads real config files under:

```txt
shared/presets/<ratio>/<batchId>/<presetId>/config.json
```

To close that gap, a startup materializer was added:

```txt
server/core/preset-import-materializer.js
```

It is wired in:

```txt
server.js
```

On server start, the import batches are materialized into real config folders if they do not already exist.

Existing configs are not overwritten.

## Uploaded Shorts Zip Status

Uploaded file handled in this phase:

```txt
shorts-presets.zip
```

Zip structure:

```txt
shorts-presets/preset-shorts-001/config.json
shorts-presets/preset-shorts-001/template.js
shorts-presets/preset-shorts-002/config.json
shorts-presets/preset-shorts-002/template.js
shorts-presets/preset-shorts-003/config.json
shorts-presets/preset-shorts-003/template.js
shorts-presets/preset-shorts-004/config.json
shorts-presets/preset-shorts-004/template.js
shorts-presets/preset-shorts-005/config.json
shorts-presets/preset-shorts-005/template.js
```

Current app behavior uses `config.json` for list/selection/preview metadata.

The uploaded `template.js` files are canvas-draw source templates. They are not directly executed by the current HTML/CSS preview path.

Future options:

1. Build a canvas template adapter for `template.js`.
2. Convert each `template.js` design into HTML/CSS token preview.

Do not decide this during preset production unless the user explicitly asks.

## What Is Not Done Yet

These are not blockers for making more presets, but they remain future work:

1. Local visual test on the user's machine.
2. Confirm server startup materialization result in logs.
3. Confirm 16:9 001-050 appear in the UI.
4. Confirm `preset-shorts-001~005` appear in the shorts UI.
5. Decide whether uploaded canvas `template.js` becomes a render adapter source or gets converted to HTML/CSS preview.
6. Future high-fidelity capture automation and preview-to-MP4 rendering.

## Current Development Progress

Estimated status:

```txt
Overall project: 95-96%
Current engine/preset infrastructure: complete enough for preset production
Remaining work: local validation, template adapter decision, final render/capture polish
```

## Next Work Mode

Next work mode is:

```txt
Preset production
```

Meaning:

- Create more preset packs.
- Keep each preset file-based.
- Use the existing ratio/batch/preset folder structure.
- Add new presets in batches of 10 when possible.
- Do not redesign the app.
- Do not alter the core engine unless a preset cannot load.
- Do not create duplicate temporary presets when official user-supplied preset files exist.

## Recommended Next Step

Create future presets using this guide:

```txt
popwifi-mv-studio/docs/preset-production-guide-ko.md
```

This checkpoint is now closed.
