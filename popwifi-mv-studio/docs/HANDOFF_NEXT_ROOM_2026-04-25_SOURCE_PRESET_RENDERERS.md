# Pop WiFi MV Studio — Next Room Handoff 2026-04-25

## Current Task

Source-faithful intro preset renderer migration.

The goal is not to invent new designs. The goal is to preserve the uploaded original HTML preset designs, including frame, motion, particles, CTA, bottom bar, and equalizer behavior.

## Critical Rule

```txt
원본 유지가 최우선이다.
자의적 디자인 금지.
색상만 바꿔서 다른 프리셋처럼 만드는 것 금지.
원본 프레임/파티클/모션/CTA/하단바/EQ를 보존한다.
원본 오류는 고치되, 디자인 변경과 섞지 않는다.
한 파일에 50개 모션/파티클을 몰아넣지 않는다.
프리셋별로 분리한다.
```

## Required Per-Preset File Structure

Each source-faithful preset must have this structure:

```txt
shared/presets/16x9/<batch>/<preset-id>/
  config.json
  original-map.json
  renderer-data.json
  renderer.html
  renderer.css
  renderer.js
```

Meaning:

```txt
config.json        = app preset metadata
original-map.json  = source tracking and completion state
renderer-data.json = original source values / theme / timeline metadata
renderer.html      = isolated iframe HTML structure
renderer.css       = preset-specific CSS only
renderer.js        = preset-specific frame / particles / EQ / timeline JS only
```

## App Integration Already Done

The app now supports isolated source renderers:

```txt
server.js
- Serves /shared statically.

app/scripts/presets/preset-preview.js
- If a selected preset has sourceOriginal metadata, it tries to load:
  /shared/presets/<ratio>/<batchId>/<presetId>/renderer.html
- The renderer is loaded inside iframe.

app/styles/source-renderer.css
- Styles the iframe container.

app/index.html
- Loads source-renderer.css.
```

## Uploaded Original Source Files

The user uploaded four original preset files. Treat them as source-of-truth, not inspiration:

```txt
/mnt/data/presets_02_10.html
/mnt/data/presets_11_30.html
/mnt/data/popwifi_presets_all_50.html
/mnt/data/popwifi_presets_31_60_prototype.html
```

Repository documentation already added:

```txt
shared/presets/source-originals/2026-04-25-uploaded-html/source-manifest.json
shared/presets/source-originals/2026-04-25-uploaded-html/source-map-02-10.json
docs/uploaded-original-preset-sources-2026-04-25.md
docs/SOURCE_FIDELITY_PRESET_MODULE_RULES_KO.md
```

## Completed Source-Faithful Renderer Work

### Completed 02~10

The 02~10 source-faithful separated renderers are complete.

```txt
02 · 깊은 밤 피아노
03 · 가을 단풍
04 · 새벽 반딧불
05 · 수묵 대나무
06 · 장미 정원
07 · 어쿠스틱 기타
08 · 겨울 설야
09 · 별빛 오르골
10 · 여름 파도
```

Each of the above has:

```txt
renderer-data.json
renderer.css
renderer.js
renderer.html
original-map.json marked renderer-extracted-source-faithful-separated-v1
```

### Completed 11

The first 11~30 source preset was started and completed:

```txt
11 · 빈티지 카세트
```

Files added under:

```txt
shared/presets/16x9/batch-011-020/intro-011-rainy-piano-window/
```

Added/updated files:

```txt
config.json                # aligned to original cassette metadata
original-map.json          # marked renderer-extracted-source-faithful-separated-v1
renderer-data.json
renderer.css
renderer.js
renderer.html
```

Important naming note:

The folder id is still:

```txt
intro-011-rainy-piano-window
```

But the source-faithful displayed preset is:

```txt
11 · 빈티지 카세트 / Tape Rewind
```

Do not rename folders unless a deliberate migration plan exists. For now, keep folder IDs stable and correct metadata/source mapping inside files.

## Current Completion Status

```txt
02~10 source-faithful separated renderers: complete
11 source-faithful separated renderer: complete
12~30 source-faithful separated renderers: not done
31~50 source-faithful separated renderers: not done
```

## Next Immediate Task

Continue with preset 12 from `presets_11_30.html`.

Original source says:

```txt
12 · 오후의 커피
sourceKey: coffee
song: Afternoon Brew
lyric: 따뜻한 커피 한 잔처럼 스며드는 오후
source functions:
- coffee.frame
- coffee.particles
- coffee.eq
```

Current repo folder likely to use next:

```txt
shared/presets/16x9/batch-011-020/intro-012-vinyl-room-lofi/
```

First step in the next room:

```txt
1. Fetch intro-012-vinyl-room-lofi/config.json.
2. Align config metadata to source preset 12 · 오후의 커피.
3. Add original-map.json if missing.
4. Add renderer-data.json.
5. Add renderer.css.
6. Add renderer.js.
7. Add renderer.html.
8. Update original-map.json to renderer-extracted-source-faithful-separated-v1.
```

## Do Not Do

```txt
- Do not create generic shared visual designs.
- Do not replace original source behavior with new pretty effects.
- Do not merge all preset renderers into app.css or preset-preview.js.
- Do not mark a preset complete unless its separated renderer files exist.
- Do not claim 50 source renderers are complete. They are not.
```

## Known Caveat

The current source-faithful renderer implementation for each completed preset is hand-extracted from the uploaded HTML source. It preserves the main original concept and function behavior, but local browser visual testing on the user's machine is still required.

## Local Test Suggestions

From `popwifi-mv-studio/`:

```txt
npm run dev
```

Then check:

```txt
1. Open Longform Intro page.
2. Select batch 001-010 and click 02~10.
3. Confirm iframe source renderer appears.
4. Confirm each preset has different original frame/particles/CTA/bottom bar/EQ.
5. Select batch 011-020 and click 11.
6. Confirm cassette renderer appears with reel frame, dust/scanline, CTA, bottom bar, cassette EQ.
```

## Last Confirmed Commit

The last confirmed source renderer status update in this room:

```txt
f8ff90bc5712764d2ba2b66485d953cded70e78a
```

This marked preset 011 original-map as `renderer-extracted-source-faithful-separated-v1`.
