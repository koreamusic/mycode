# Pop WiFi MV Studio — Uploaded Original Preset Sources 2026-04-25

## Purpose

The user uploaded the original HTML preset source files. These files must be treated as source-of-truth design references for the next preset implementation phase.

Do not reinterpret, redesign, or replace the original design. Preserve the original frame, motion, particle, CTA, bottom bar, and equalizer behavior first. Fix only confirmed errors separately.

## Uploaded Source Files

```txt
/mnt/data/presets_02_10.html
/mnt/data/presets_11_30.html
/mnt/data/popwifi_presets_all_50.html
/mnt/data/popwifi_presets_31_60_prototype.html
```

## File Inventory

| Uploaded file | Size | SHA-256 | Detected role |
|---|---:|---|---|
| `presets_02_10.html` | 63,918 bytes | `e2804014133f2dc1ebc73fdd09f40882c940cc95b3954c7cf5b2015525186cfc` | Original source for presets 02~10 |
| `presets_11_30.html` | 97,993 bytes | `5c72ecf7a7d07f2b98987c919ebbde3cedb7f0736b9b20ddf1109424e6544b7d` | Original source for presets 11~30 |
| `popwifi_presets_all_50.html` | 271,638 bytes | `b65a989bb6e3a88afd5cf86b9e321253e5a7e64783ac6f2c8b3d75d29f7ca5c6` | Consolidated original source for presets 01~50 |
| `popwifi_presets_31_60_prototype.html` | 69,839 bytes | `2a5de92d7e04fa386be2e1cc5d3910658242474e47e759c03d7f1cc044728388` | Extended prototype source for presets 31~60 |

## Detected Counts

```txt
presets_02_10.html: 9 preset names detected
presets_11_30.html: 20 preset names detected
popwifi_presets_all_50.html: 50 preset names detected
popwifi_presets_31_60_prototype.html: 30 preset names detected
```

## Important Source Notes

### presets_02_10.html

Contains original preset-specific functions for 02~10. These include named frame builders, particle builders, CTA behavior, bottom bar behavior, and equalizer builders.

Detected examples:

```txt
buildPianoFrame
buildMapleFrame
buildFireflyFrame
buildBambooFrame
buildRoseFrame
buildGuitarFrame
buildSnowFrame
buildStarFrame
buildWaveFrame
```

### presets_11_30.html

Contains original preset-specific data and functions for 11~30. This file must be used instead of inventing new visuals for those presets.

### popwifi_presets_all_50.html

Contains consolidated source for presets 01~50. Use this as the main cross-check source for the first 50 preset implementations.

### popwifi_presets_31_60_prototype.html

Contains 31~60 prototype structure. It includes a data-driven `PRESETS` array and common builders such as:

```txt
buildFrameSVG
buildParticlesHTML
buildNoiseSVG
buildEqSVG
applyPreset
applyTime / timeline controls
```

This file is important for 31~60, but for 31~50 it must be compared against `popwifi_presets_all_50.html` before implementation.

## Correct Next Implementation Direction

Do not add a generic visual layer.

The next implementation must be original-source faithful.

Recommended implementation structure:

```txt
shared/presets/source-originals/2026-04-25-uploaded-html/
  presets_02_10.html
  presets_11_30.html
  popwifi_presets_all_50.html
  popwifi_presets_31_60_prototype.html
  README.md
```

Then extract per-preset renderer modules:

```txt
shared/presets/16x9/batch-001-010/<preset-id>/
  config.json
  original-map.json
  renderer.html
  renderer.css
  renderer.js
  particles.js

shared/presets/16x9/batch-011-020/<preset-id>/...
shared/presets/16x9/batch-021-030/<preset-id>/...
shared/presets/16x9/batch-031-040/<preset-id>/...
shared/presets/16x9/batch-041-050/<preset-id>/...
```

## Required Workflow

```txt
1. Preserve the uploaded source files without editing them.
2. Compare `popwifi_presets_all_50.html` against the split source files.
3. Use split files for detailed implementation when available.
4. Use all_50 as master validation for 01~50 consistency.
5. Use 31~60 prototype only for 31~60 extension logic and shared builder patterns.
6. Implement in batches of 10.
7. Do not merge all particle/motion/frame code into one large app.css or preset-preview.js.
8. Use isolated renderer modules or iframe/preview-root isolation to prevent CSS/keyframe/function collisions.
```

## Stop Rule

If the source file for a target preset cannot be located or parsed, stop implementation and mark the preset as blocked. Do not invent a replacement design.

## Current Status

```txt
Uploaded source files received: yes
Source inventory documented: yes
50 config files already materialized: yes
Original visual/motion/particle renderer extraction: not yet complete
Next correct task: source-faithful extraction for intro-001~010 first
```
