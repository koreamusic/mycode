# Pop WiFi MV Studio — Handoff for Next Room

Date: 2026-04-25

## Purpose

This document is the handoff file for continuing Pop WiFi MV Studio development in a new ChatGPT/Codex session.

Read this first before making any new changes.

## Current Priority

The current priority is not to redesign the whole app.

The immediate next task is:

```txt
Complete the intro preset motion engine.
```

Specifically:

```txt
Preset JSON motion tokens
-> preview renderer data/class mapping
-> CSS keyframe/timeline behavior
-> capture render preserves motion
```

## Hard Rules

Do not break these rules:

```txt
Do not introduce Remotion.
Do not create a second render engine.
Do not hardcode preset lists in JS.
Do not store intro presets in DB at this stage.
Do not merge separated modules back into one giant file.
Do not change sidebar/menu structure unless explicitly requested.
Do not remove existing functions.
Do not treat dummy MP4 as final rendering.
Do not bypass the HTML/CSS preview capture pipeline.
```

## Fixed Stack

Use:

```txt
Node.js
Express
HTML/CSS/JS preview
JSON preset files
Playwright Chromium capture
FFmpeg assembly
```

Do not use:

```txt
Remotion
FFmpeg drawtext as the main lyric/title renderer
A second preset engine
A hidden hardcoded preset cache
```

## What Is Already Implemented

### 1. Intro preset render pipeline

Implemented flow:

```txt
Preset selected
-> render-draft saved
-> queue job created
-> start-next
-> capture page opened
-> Playwright screenshots captured
-> PNG frame sequence assembled by FFmpeg
-> MP4 saved
-> queue job completed
```

### 2. Longform and shorts viewport support

Implemented:

```txt
longform -> 1920x1080
shorts   -> 1080x1920
```

File:

```txt
server/core/render-capture-processor.js
```

Function:

```txt
getViewportForJob(job)
```

### 3. Render buttons and result list

Implemented:

```txt
Render draft panel
- 렌더 실행
- 큐에만 추가
- 렌더 품질 6fps / 30fps
- output path display
- path copy

Project page
- recent render results
- open MP4
- copy path
```

Important files:

```txt
app/scripts/render/render-draft-panel.js
app/scripts/render/render-draft-actions.js
app/scripts/project/render-results.js
app/pages/project.html
```

### 4. Output static serving

Implemented:

```txt
/output -> root output folder
```

File:

```txt
server.js
```

This allows rendered files like:

```txt
/output/renders/<job-id>/intro-preview.mp4
```

to open in the browser.

### 5. Capture page skeleton

Implemented:

```txt
app/capture/intro-preview.html
app/scripts/capture/intro-preview-capture.js
```

The capture page:

```txt
- accepts jobId query parameter
- reads /api/queue
- finds matching job
- reuses renderSelectedPresetPreview()
- hides normal app UI/sidebar
```

### 6. Preset authoring spec

Implemented doc:

```txt
docs/intro-preset-authoring-spec.md
```

Core rule:

```txt
Folder state is the source of truth.
Preset JSON file exists  -> preset exists.
Preset JSON file removed -> preset removed.
```

### 7. Starter preset file

Added:

```txt
shared/presets/16x9/intro-051-basic-template.json
```

This includes a `motion` object, but motion is not yet fully connected to the renderer/CSS.

## Important Current Limitation

The preset JSON can include motion tokens like:

```json
"motion": {
  "titleIn": "fade-rise",
  "titleOut": "fade-out",
  "ctaIn": "soft-pop",
  "ctaOut": "fade-out",
  "frameOut": "reverse-collapse",
  "bottomBarIn": "slide-up-soft",
  "loop": "subtle-breathe"
}
```

But currently these tokens are not fully mapped to real CSS/JS motion behavior.

Current preview renderer mostly displays metadata and uses existing CSS timeline behavior.

Therefore the next real development task is:

```txt
Motion token -> renderer class/data attributes -> CSS animation behavior
```

## Next Task: Motion Engine Completion

### Target behavior

A preset should control visible motion through JSON tokens.

Example:

```json
"motion": {
  "titleIn": "fade-rise",
  "ctaIn": "soft-pop",
  "frameOut": "reverse-collapse",
  "bottomBarIn": "slide-up-soft",
  "loop": "subtle-breathe"
}
```

The renderer should apply these tokens as attributes/classes.

Recommended pattern:

```js
target.dataset.motionTitleIn = preset.motion?.titleIn || 'fade-rise';
target.dataset.motionCtaIn = preset.motion?.ctaIn || 'soft-pop';
target.dataset.motionFrameOut = preset.motion?.frameOut || 'reverse-collapse';
target.dataset.motionBottomBarIn = preset.motion?.bottomBarIn || 'slide-up-soft';
target.dataset.motionLoop = preset.motion?.loop || 'subtle-breathe';
```

Then CSS should use selectors like:

```css
.has-preset-preview[data-motion-title-in="fade-rise"] .preset-stage-title {
  animation-name: fadeRise;
}
```

### Required animation groups

Implement at least these token groups:

```txt
titleIn:
- fade-rise
- soft-zoom
- slide-left
- type-glow

ctaIn:
- soft-pop
- bounce-card
- neon-flicker
- slide-up

frameOut:
- reverse-collapse
- fade-frame
- slide-frame-out

bottomBarIn:
- slide-up-soft
- fade-in
- glass-reveal

loop:
- subtle-breathe
- light-sweep
- tiny-pulse
```

### Do not overbuild

Do not add 100 motion types at once.

Add a small stable set first and verify preview/capture.

## Files Most Likely to Edit Next

```txt
app/scripts/presets/preset-preview.js
app/styles/app.css
shared/presets/16x9/intro-051-basic-template.json
shared/presets/9x16/intro-051-basic-template.json     optional, if creating a shorts template
```

## Current Preset Renderer

File:

```txt
app/scripts/presets/preset-preview.js
```

Important function:

```txt
renderSelectedPresetPreview(kind, preset)
```

Currently it:

```txt
- resolves variant
- applies color tokens
- renders title stage
- renders CTA stage
- renders bottom bar
- displays metadata
```

Needed change:

```txt
Read preset.motion
Apply data attributes/classes to preview target or inner elements
```

## Current CSS

File:

```txt
app/styles/app.css
```

Needed change:

```txt
Add small motion token CSS/keyframes
Keep existing layout intact
Do not add a new CSS file
```

## Preset File Rule

Official preset authoring spec is here:

```txt
docs/intro-preset-authoring-spec.md
```

Important rule:

```txt
Presets are JSON data.
Motion tokens describe intent.
Renderer/CSS implements actual animation.
Do not put raw CSS inside preset JSON.
```

## Download Link for User

User uses mobile and may not see GitHub download menu.

Provide this direct link whenever they ask for files:

```txt
https://github.com/koreamusic/mycode/archive/refs/heads/main.zip
```

After extraction, user should use:

```txt
mycode-main/popwifi-mv-studio/
```

## Local Run Instructions

For PC testing:

```bash
cd popwifi-mv-studio
npm install
npm run install:browser
npm run dev
```

Open:

```txt
http://localhost:3100
```

For render testing, PC also needs FFmpeg installed:

```bash
ffmpeg -version
```

## Current Known Runtime Constraints

The current ChatGPT environment cannot actually run the local Node/Playwright/FFmpeg render stack.

Therefore:

```txt
Design / preset / UI code can be reviewed here.
Actual rendering must be tested on user's PC.
```

If render fails on PC, display clear errors instead of silently failing.

Recent API error improvement was added in:

```txt
app/scripts/core/api.js
```

## Suggested Next Session Prompt

Use this prompt in the next room:

```txt
We are continuing Pop WiFi MV Studio.
Read docs/HANDOFF_NEXT_ROOM_2026-04-25.md first.
Do not use Remotion.
Do not redesign the whole app.
Continue from the current GitHub repo koreamusic/mycode, folder popwifi-mv-studio.
Next task: complete the intro preset motion engine by connecting preset.motion tokens to preview renderer data attributes/classes and CSS animations in app/styles/app.css.
Keep folder-based preset authoring rules from docs/intro-preset-authoring-spec.md.
After implementation, update handoff/dev docs and provide the direct ZIP download link.
```

## Final Current Status

```txt
Intro preset render engine: implemented
Longform capture: implemented
Shorts capture viewport: implemented
Render UI: implemented
Result list/open/copy: implemented
Preset authoring spec: implemented
Starter preset template: implemented
Motion token structure: added
Motion token actual behavior: next task
Full MV music/lyrics: future task after intro motion QA
```
