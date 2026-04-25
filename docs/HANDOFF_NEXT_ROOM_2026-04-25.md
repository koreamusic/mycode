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

2. 롱폼 프리셋 선택 테스트
3. 숏츠 프리셋 선택 테스트
4. `flow.frameExit`, `bottomBar.endAnimation`이 있는 기존 프리셋에서 fallback motion 적용 확인
5. 새 프리셋에는 명시적으로 `motion` 블록 추가
6. 기존 프리셋의 motion 명시 backfill은 나중에 일괄 처리

## 현재 진행률

전체 개발 진행률: 약 94–95%

남은 작업량:

- 실제 로컬 시각 테스트: 1차 필요
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

이 경로만 유지한다.
