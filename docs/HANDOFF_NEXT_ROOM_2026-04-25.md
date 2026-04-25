# Pop WiFi MV Studio — Handoff Next Room

작성일: 2026-04-25
저장소: `koreamusic/mycode`
프로젝트 경로: `popwifi-mv-studio/`

## 절대 유지 규칙

- Remotion 사용 금지
- 앱 전체 재디자인 금지
- 기존 HTML/CSS 미리보기 시스템 사용
- 프리셋 시스템은 파일 기반 유지
- 프리셋 기준 경로는 `popwifi-mv-studio/shared/presets`
- JSON 안에 raw CSS 저장 금지
- JSON은 토큰만 저장하고, 실제 구현은 JS/CSS에서 처리
- 기존 프리셋과 하위 호환 유지

## 현재 완료 상태

- Intro preset engine: 완료
- Render pipeline: 완료
- UI: 완료
- Shorts 9:16: 완료
- Preset authoring spec: 완료
- Motion engine: 완료
- 16:9 import batch 50개 자동 등록 구조: 완료

## 이번 방에서 완료한 작업

### 1. Motion reader 연결

수정 파일:

```txt
popwifi-mv-studio/app/scripts/presets/preset-preview.js
```

`renderSelectedPresetPreview()`가 이제 `preset.motion`을 읽는다.

지원 shape:

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

### 2. Data attribute 적용

`renderSelectedPresetPreview()`는 motion 값을 preview card에 다음 속성으로 적용한다.

```txt
data-motion-frame-exit
data-motion-title
data-motion-cta
data-motion-bottom-bar
data-motion-end
data-motion-cadence
```

### 3. Backward compatibility 유지

기존 프리셋에 `motion`이 없어도 작동한다.

Fallback:

```txt
flow.frameExit -> motion.frameExit
cta.motion -> motion.cta
bottomBar.motion -> motion.bottomBar
bottomBar.endAnimation -> motion.end
```

### 4. CSS animation mapping 추가

수정 파일:

```txt
popwifi-mv-studio/app/styles/app.css
```

`data-motion-*` 토큰을 CSS 애니메이션으로 매핑했다.

예:

```css
.preview-card[data-motion-title="neon-pop"] .preset-stage-title
.preview-card[data-motion-cta="badge-pulse"] .preset-preview-cta
.preview-card[data-motion-end="vinyl-spin"] .preset-preview-bottom::after
```

### 5. 16:9 import batch 50개 자동 materialize 추가

추가/수정 파일:

```txt
popwifi-mv-studio/server/core/preset-import-materializer.js
popwifi-mv-studio/server.js
```

현재 `shared/presets/imports/intro-batch-001-010.json`부터 `intro-batch-041-050.json`까지 16:9 import 원본 5개가 존재한다.

서버의 실제 프리셋 API는 import JSON을 직접 읽지 않고 다음 구조만 읽는다.

```txt
shared/presets/<ratio>/<batchId>/<presetId>/config.json
```

따라서 서버 시작 시 import JSON을 실제 config 폴더 구조로 자동 생성하도록 보정했다.

동작:

```txt
server start
-> shared/presets/imports/intro-batch-*.json 읽기
-> 각 preset을 shared/presets/16x9/batch-xxx-yyy/<presetId>/config.json 으로 생성
-> 이미 존재하는 config.json은 덮어쓰지 않고 skip
```

이 방식은 기존 파일 기반 규칙을 유지하면서, 50개 import 원본을 실제 앱 프리셋으로 노출시키는 구조다.

### 6. 숏츠 5개 확인 결과

현재 저장소 검색 기준:

```txt
9x16 실제 config: moon-dust-window 1개만 확인됨
9x16 intro-001~005 import batch: 확인 안 됨
숏츠용 5개 프리셋 파일: 현재 mycode 저장소에 없는 것으로 보임
```

즉 숏츠 5개를 만든 적이 있더라도 현재 `koreamusic/mycode` 저장소에는 아직 올라오지 않은 상태로 판단한다.

## 현재 지원 motion token

### frameExit

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

### title

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

### cta

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

### bottomBar

```txt
soft-rise
glass-slide
lyric-float
warm-fade
neon-rise
none
```

### end

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

### cadence

```txt
slow
standard
snappy
cinematic
```

## 문서 업데이트

추가 문서:

```txt
popwifi-mv-studio/docs/dev-log-2026-04-25-motion-engine.md
```

## 다음 작업 권장 순서

1. 로컬에서 서버 실행

```bash
npm run dev
```

2. 서버 로그에서 다음 문구 확인

```txt
Preset imports materialized: created=... skipped=... failed=...
```

3. 롱폼 프리셋 페이지에서 001~050 배치가 보이는지 확인
4. 롱폼 프리셋 선택 테스트
5. 숏츠 프리셋은 현재 5개 원본이 없으므로, 파일을 다시 업로드하거나 별도 생성 필요
6. 기존 프리셋의 motion 명시 backfill은 나중에 일괄 처리

## 현재 진행률

전체 개발 진행률: 약 95%

남은 작업량:

- 실제 로컬 시각 테스트: 1차 필요
- 서버 시작 후 50개 materialize 결과 확인 필요
- 숏츠 5개 파일 추가 필요
- 기존 프리셋 motion 명시 backfill: 선택 작업
- capture 자동화/최종 렌더 세부 고도화: 이후 작업

## 주의

다음 작업자는 motion 때문에 새 엔진을 만들면 안 된다.
현재 구조는 이미 다음 흐름으로 완성되어 있다.

```txt
preset JSON token
-> renderSelectedPresetPreview()
-> data-motion-* attribute
-> app.css animation mapping
```

프리셋 import도 새 엔진이 아니다.
기존 파일 기반 구조를 보정하는 startup materialize 단계일 뿐이다.
