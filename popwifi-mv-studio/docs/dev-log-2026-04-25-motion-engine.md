# Pop WiFi MV Studio Dev Log — 2026-04-25 Motion Engine

## Scope

This patch completes the first token-based motion engine for the existing HTML/CSS preset preview system.

It does not introduce Remotion.
It does not redesign the app.
It does not create a second preset engine.
It does not move preset data out of `shared/presets`.
It keeps existing presets backward compatible.

## Completed

### 1. `preset.motion` reader added

Updated:

- `app/scripts/presets/preset-preview.js`

`renderSelectedPresetPreview()` now reads motion tokens from the selected preset JSON.

Supported top-level shape:

```json
{
  "motion": {
    "frameExit": "reverse-soft-collapse",
    "title": "soft-rise",
    "cta": "soft-pop",
    "bottomBar": "soft-rise",
    "end": "glow-pulse",
    "cadence": "standard"
  }
}
```

### 2. Backward-compatible fallback mapping added

Existing presets that do not yet define `preset.motion` continue to work.

Fallback sources:

- `flow.frameExit` -> `motion.frameExit`
- `cta.motion` -> `motion.cta`
- `bottomBar.motion` -> `motion.bottomBar`
- `bottomBar.endAnimation` -> `motion.end`

This preserves the current preset batches while allowing future presets to use explicit motion tokens.

### 3. Motion tokens applied as data attributes

`renderSelectedPresetPreview()` now applies normalized motion data to the preview card as data attributes:

```txt
data-motion-frame-exit
data-motion-title
data-motion-cta
data-motion-bottom-bar
data-motion-end
data-motion-cadence
```

The renderer stays token-based. Preset JSON must not contain raw CSS.

### 4. CSS token mapping added

Updated:

- `app/styles/app.css`

The preview CSS now maps the above data attributes to animation behavior.

Examples:

```css
.preview-card[data-motion-title="neon-pop"] .preset-stage-title { ... }
.preview-card[data-motion-cta="badge-pulse"] .preset-preview-cta { ... }
.preview-card[data-motion-end="vinyl-spin"] .preset-preview-bottom::after { ... }
```

The CSS remains the only place where actual animation implementation lives.

### 5. Supported token groups

Current supported groups:

```txt
frameExit
title
cta
bottomBar
end
cadence
```

Current default values:

```txt
frameExit: reverse-soft-collapse
title: soft-rise
cta: soft-pop
bottomBar: soft-rise
end: glow-pulse
cadence: standard
```

### 6. Current token list

Frame exit:

```txt
reverse-soft-collapse
reverse-fade-slide
reverse-card-fold
reverse-neon-scan
reverse-film-fade
reverse-grid-slide
reverse-smoke-dissolve
reverse-cloud-wipe
reverse-tape-rewind
reverse-warm-fade
none
```

Title:

```txt
soft-rise
fade-up
film-fade
neon-pop
gentle-breathe
slide-left
cloud-drift
type-glow
none
```

CTA:

```txt
soft-pop
badge-pulse
neon-pulse
sticker-pop
stamp-in
arcade-blink
float-pop
synth-glow
none
```

Bottom bar:

```txt
soft-rise
glass-slide
lyric-float
warm-fade
neon-rise
none
```

End animation:

```txt
glow-pulse
vinyl-spin
falling-leaf
equalizer-pulse
piano-shimmer
palm-blink
harmonica-wave
paper-airplane
cassette-spin
coffee-steam
none
```

Cadence:

```txt
slow
standard
snappy
cinematic
```

## Important Rules Preserved

- Do not use Remotion.
- Do not redesign the whole app.
- Use the existing HTML/CSS preview system.
- Keep the preset system file-based under `shared/presets`.
- Keep JSON token-based.
- Do not put raw CSS in preset JSON.
- Keep old presets working even without `motion`.

## Current Progress

Estimated total project progress after this patch: 94–95%.

Completed:

- Intro preset engine: done
- Render pipeline: done
- UI: done
- Shorts 9:16: done
- Preset authoring spec: done
- Motion engine: done, first token-based version

## Next Recommended Work

1. Add explicit `motion` blocks to future preset JSON files.
2. Optionally backfill the existing preset batches with explicit motion tokens later.
3. Keep current fallback logic until all old presets are migrated.
4. Test the longform and shorts preview cards by selecting presets with different `flow.frameExit` and `bottomBar.endAnimation` values.
5. Do not add another animation engine.
