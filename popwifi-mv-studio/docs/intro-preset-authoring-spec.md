# Pop WiFi MV Studio — Intro Preset Authoring Spec

## Purpose

This document defines the official rule for creating, adding, deleting, and maintaining intro presets for Pop WiFi MV Studio.

The goal is to make intro presets manageable by files, not by hardcoded JavaScript, database rows, or hidden manual registration steps.

## Core Rule

```txt
Folder state is the source of truth.
```

That means:

```txt
Preset JSON file exists  -> preset exists in the system
Preset JSON file removed -> preset is removed from the system
```

A preset must not require manual registration in another file after being placed in the correct preset folder.

## Required Folder Structure

Intro presets must be separated by output ratio.

```txt
shared/presets/
  16x9/
    intro-001-example.json
    intro-002-example.json

  9x16/
    intro-001-example.json
    intro-002-example.json
```

### Ratio Meaning

```txt
16x9 -> longform render / horizontal video
9x16 -> shorts render / vertical video
```

Do not mix 16:9 and 9:16 presets in the same folder.

## Preset File Rule

Each intro preset should be one JSON file.

Recommended file naming:

```txt
intro-001-midnight-jazz-frame.json
intro-002-lofi-window-glow.json
intro-003-kpop-neon-card.json
```

Rules:

- File name should start with `intro-`.
- Number should be unique inside its ratio folder.
- Slug should describe the visual idea.
- Do not reuse an existing preset id.

## Required Preset JSON Shape

Every preset JSON file must include these top-level keys:

```txt
id
title
ratio
variant
flow
visual
layout
cta
bottomBar
```

Minimum valid example:

```json
{
  "id": "intro-001-midnight-jazz-frame",
  "title": "Midnight Jazz Frame",
  "ratio": "16x9",
  "variant": "jazz",
  "flow": {
    "frameSeconds": 10,
    "titleSeconds": 5,
    "ctaSeconds": 5,
    "bottomBarStartsAfterSeconds": 10
  },
  "visual": {
    "frameStyle": "thin-gold",
    "background": "dark-blur",
    "colorTheme": "gold-black"
  },
  "layout": {
    "titlePosition": "center",
    "ctaPosition": "center",
    "bottomBarPosition": "bottom"
  },
  "cta": {
    "type": "subscribe",
    "style": "minimal"
  },
  "bottomBar": {
    "style": "rounded-dark",
    "showLyric": true
  }
}
```

## Field Definitions

### id

Stable internal preset id.

Rules:

```txt
Must be unique.
Must not change after release unless intentionally replacing the preset.
Should match the filename slug.
```

Example:

```json
"id": "intro-001-midnight-jazz-frame"
```

### title

Human-readable preset name shown in UI.

Example:

```json
"title": "Midnight Jazz Frame"
```

### ratio

Output ratio.

Allowed values:

```txt
16x9
9x16
```

The ratio must match the folder.

Examples:

```txt
shared/presets/16x9/intro-001.json -> "ratio": "16x9"
shared/presets/9x16/intro-001.json -> "ratio": "9x16"
```

### variant

Visual/music mood category.

Examples:

```txt
jazz
lofi
kpop
ballad
cinematic
anime
minimal
retro
```

This is used for filtering, grouping, and future recommendation logic.

### flow

Timing rule for intro animation.

Required baseline:

```json
"flow": {
  "frameSeconds": 10,
  "titleSeconds": 5,
  "ctaSeconds": 5,
  "bottomBarStartsAfterSeconds": 10
}
```

Meaning:

```txt
0s-5s   -> title visible
5s-10s  -> CTA / like / subscribe / notification visible
10s+    -> frame and CTA disappear, bottom bar continues
```

Do not change this baseline unless a future spec explicitly allows another intro flow.

### visual

Design tokens for frame, background, color, glow, material, and mood.

Example:

```json
"visual": {
  "frameStyle": "thin-gold",
  "background": "dark-blur",
  "colorTheme": "gold-black",
  "glow": "soft",
  "texture": "film-grain"
}
```

Important rule:

```txt
Use design tokens, not raw CSS blobs.
```

Good:

```json
"frameStyle": "thin-gold"
```

Bad:

```json
"css": "border: 1px solid gold; box-shadow: ..."
```

### layout

Positioning tokens for title, CTA, frame, and bottom bar.

Example:

```json
"layout": {
  "titlePosition": "center",
  "ctaPosition": "center",
  "bottomBarPosition": "bottom",
  "safeArea": "title-center"
}
```

Recommended values:

```txt
titlePosition: center, top, lower, left, right
ctaPosition: center, lower, floating
bottomBarPosition: bottom
safeArea: title-center, title-upper, title-lower
```

### cta

Like / subscribe / notification style.

Example:

```json
"cta": {
  "type": "subscribe",
  "style": "minimal",
  "motion": "soft-pop"
}
```

Rules:

```txt
CTA should appear between 5s and 10s.
CTA should disappear with the frame after 10s.
CTA should not remain after the bottom bar starts.
```

### bottomBar

Persistent lower overlay bar after intro frame disappears.

Example:

```json
"bottomBar": {
  "style": "rounded-dark",
  "showLyric": true,
  "fallbackText": "title",
  "animationSlot": "right"
}
```

Rules:

```txt
Bottom bar starts after 10s.
If lyrics exist, show lyrics.
If lyrics do not exist, show title.
Animation element should live near the end/right area of the bar.
```

## Adding a Preset

To add a new longform preset:

```txt
1. Create a JSON file in shared/presets/16x9/
2. Use a unique id.
3. Set ratio to 16x9.
4. Follow the required JSON shape.
5. Restart or refresh the preset loader if needed.
```

To add a new shorts preset:

```txt
1. Create a JSON file in shared/presets/9x16/
2. Use a unique id.
3. Set ratio to 9x16.
4. Follow the required JSON shape.
5. Restart or refresh the preset loader if needed.
```

## Deleting a Preset

To delete a preset:

```txt
Remove the preset JSON file from its ratio folder.
```

Expected behavior:

```txt
Deleted file -> preset disappears from the UI after reload/rescan.
```

Do not keep separate hardcoded lists that continue showing deleted presets.

## Editing a Preset

To edit a preset:

```txt
Open the preset JSON file.
Change design tokens or text fields.
Save the file.
Reload/rescan presets.
```

Rules:

```txt
Do not change id unless replacing the preset.
Do not change ratio without moving the file to the matching ratio folder.
Do not change flow timing unless approved by the intro timing spec.
```

## Validation Rules

A preset should be rejected or skipped if:

```txt
JSON is invalid
id is missing
title is missing
ratio is missing
ratio does not match folder
flow is missing
visual/layout/cta/bottomBar is missing
id is duplicated
```

Invalid presets should not break the full app.

Expected behavior:

```txt
Invalid preset -> skip that preset -> show/log clear error message
```

## Error Message Rules

If preset loading fails, user-facing or developer-facing messages should clearly say why.

Examples:

```txt
Preset JSON is invalid: intro-051-broken.json
Preset ratio mismatch: shared/presets/9x16/intro-020.json has ratio 16x9
Duplicate preset id: intro-001-midnight-jazz-frame
Required field missing: bottomBar
```

Do not show vague messages like:

```txt
Failed
Unknown error
API error
```

## Design Token Rule

Preset JSON should describe design intent with tokens.

Examples:

```json
"visual": {
  "frameStyle": "glass-gold",
  "colorTheme": "midnight-blue-gold",
  "texture": "soft-film-grain"
}
```

The renderer decides how those tokens become HTML/CSS.

This keeps presets portable and prevents the preset system from becoming raw CSS storage.

## Longform vs Shorts Authoring Rule

Longform and shorts presets can share a concept, but they should not be copied blindly.

Example:

```txt
16x9: wide frame, horizontal title-safe layout
9x16: vertical safe area, larger center title, bottom bar adjusted for mobile
```

If the same visual concept exists in both ratios, create separate files:

```txt
shared/presets/16x9/intro-051-midnight-jazz.json
shared/presets/9x16/intro-051-midnight-jazz.json
```

Each file must have the correct ratio.

## Batch Authoring Rule

For large preset creation, use batches of 10.

Recommended batch naming:

```txt
intro-batch-001-010.json
intro-batch-011-020.json
intro-batch-021-030.json
intro-batch-031-040.json
intro-batch-041-050.json
intro-batch-051-060.json
```

Batch files are useful for import/review, but the long-term source of truth should still be the actual preset files in the ratio folders.

## Forbidden Patterns

Do not do these:

```txt
Do not hardcode preset lists in JS.
Do not keep deleted presets in hidden cache files.
Do not require manual registration after placing JSON in the folder.
Do not store preset definitions in DB at this stage.
Do not mix 16x9 and 9x16 presets.
Do not create a second preset engine.
Do not create fallback preset engines.
```

## Preferred Future Loader Behavior

The preferred final behavior is:

```txt
Server starts
-> scans shared/presets/16x9 and shared/presets/9x16
-> validates every JSON file
-> builds in-memory preset index
-> API returns current folder state
```

Optional future behavior:

```txt
chokidar watches shared/presets
-> file added/changed/deleted
-> preset index refreshes automatically
```

## Final Summary

```txt
Preset = JSON file
Folder = source of truth
Add = add file
Delete = delete file
Edit = edit file
Renderer = interprets tokens
```

This rule must be preserved when adding future preset management UI, admin tools, importers, or validators.
