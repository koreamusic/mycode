# Pop WiFi MV Studio — 프리셋 제작 단일 지침서

작성일: 2026-04-25
용도: ChatGPT / Codex / 다음 작업자 공통 프리셋 제작 기준

---

## 0. 현재 단계 결론

이제 이 프로젝트는 앱 구조 개발을 잠시 닫고, 프리셋 제작 단계로 넘어간다.

```txt
현재 할 일: 새 인트로 프리셋 만들기
하지 말 일: 앱 전체 수정, 새 엔진 생성, Remotion 추가, 디자인 구조 재설계
```

현재 완료 상태:

```txt
Intro preset engine: 완료
Render pipeline: 완료
UI: 완료
Shorts 9:16: 완료
Preset authoring spec: 완료
Motion engine: 완료
16:9 50개 import batch 자동 등록 구조: 완료
9:16 공식 shorts-presets.zip 기준 preset-shorts-001~005 추가 완료
```

---

## 1. 절대 금지 사항

프리셋 제작자는 아래 작업을 하면 안 된다.

```txt
Remotion 추가 금지
새 렌더 엔진 생성 금지
새 프리셋 엔진 생성 금지
앱 전체 재디자인 금지
사이드바/페이지 구조 변경 금지
기존 app/scripts 핵심 로직 수정 금지
기존 app/styles/app.css 대규모 변경 금지
shared/presets 외부에 프리셋 정의 금지
JSON 안에 raw CSS 작성 금지
공식 프리셋과 임시 프리셋 중복 생성 금지
```

허용 작업:

```txt
새 프리셋 폴더 생성
새 config.json 생성
필요 시 template.js 원본 보관
필요 시 프리셋 제작 로그 업데이트
```

---

## 2. 프리셋 저장 위치

프리셋은 반드시 아래 경로 안에 만든다.

```txt
popwifi-mv-studio/shared/presets/
```

### 숏츠 9:16

```txt
popwifi-mv-studio/shared/presets/9x16/<batch-id>/<preset-id>/config.json
```

예:

```txt
popwifi-mv-studio/shared/presets/9x16/batch-011-020/preset-shorts-011-rain-glass-ballad/config.json
```

### 롱폼 16:9

```txt
popwifi-mv-studio/shared/presets/16x9/<batch-id>/<preset-id>/config.json
```

예:

```txt
popwifi-mv-studio/shared/presets/16x9/batch-051-060/intro-051-rain-glass-ballad/config.json
```

---

## 3. 현재 번호 기준

현재 기준:

```txt
16x9: intro-batch-001-050 import 원본 존재, 서버 시작 시 materialize
9x16: preset-shorts-001~005 공식 등록 완료
```

새 숏츠 프리셋은 보통 다음부터 시작한다.

```txt
preset-shorts-006
```

새 롱폼 프리셋은 보통 다음부터 시작한다.

```txt
intro-051
```

프리셋은 가능하면 10개 단위로 만든다.

```txt
batch-001-010
batch-011-020
batch-021-030
batch-031-040
batch-041-050
batch-051-060
```

---

## 4. 프리셋 기본 구조

새 프리셋은 `config.json` 하나가 기본이다.

숏츠 예시:

```json
{
  "id": "preset-shorts-006-rain-glass-ballad",
  "name": "Rain Glass Ballad",
  "title": "Rain Glass Ballad",
  "category": "shorts-preset",
  "variant": "ballad",
  "ratio": "9x16",
  "batchId": "batch-001-010",
  "accentColor": "#9BB8FF",
  "tags": ["rain", "ballad", "emotional", "soft"],
  "fonts": {
    "title": "Noto Serif KR",
    "lyric": "Noto Sans KR",
    "karaoke": "Noto Sans KR"
  },
  "karaokeMode": false,
  "karaokeGlow": false,
  "flow": {
    "frameSeconds": 10,
    "titleSeconds": 5,
    "ctaSeconds": 5,
    "bottomBarStartsAfterSeconds": 10,
    "frameExit": "reverse-film-fade"
  },
  "layout": {
    "frameStyle": "vertical-rain-glass-frame",
    "titlePosition": "center-middle",
    "ctaPosition": "center-middle",
    "bottomBarPosition": "bottom-safe",
    "bottomBarAlign": "center",
    "safeArea": "vertical-title-center"
  },
  "visual": {
    "accent": "#9BB8FF",
    "accent2": "#E8D4B0",
    "palette": ["rain blue", "soft gray", "warm ivory", "deep navy"],
    "texture": "rain glass blur, soft glow, emotional night mood",
    "typography": "delicate serif title with clean lyric font"
  },
  "motion": {
    "frameExit": "reverse-film-fade",
    "title": "film-fade",
    "cta": "stamp-in",
    "bottomBar": "warm-fade",
    "end": "piano-shimmer",
    "cadence": "cinematic"
  },
  "cta": {
    "style": "soft emotional CTA buttons",
    "items": ["like", "subscribe", "notification"]
  },
  "bottomBar": {
    "style": "blue-gray transparent rounded lyric bar",
    "endAnimation": "tiny raindrop shimmer",
    "contentFallback": "title"
  },
  "layers": [],
  "createdAt": "2026-04-25",
  "active": true
}
```

---

## 5. 필수 필드

모든 프리셋은 최소한 아래 필드를 가져야 한다.

```txt
id
name
title
category
variant
ratio
batchId
active
flow
layout
visual
motion
cta
bottomBar
```

폴더명과 `id`는 같게 만든다.

```txt
폴더명: preset-shorts-006-rain-glass-ballad
id: preset-shorts-006-rain-glass-ballad
```

폴더와 `ratio`도 반드시 같아야 한다.

```txt
shared/presets/9x16/... -> "ratio": "9x16"
shared/presets/16x9/... -> "ratio": "16x9"
```

---

## 6. category 규칙

숏츠:

```txt
shorts-preset
```

롱폼:

```txt
intro
```

---

## 7. variant 추천값

아래 중 하나를 우선 사용한다.

```txt
jazz
lofi
acoustic
kpop
ballad
citypop
blues
anime
chillwave
cafe
cinematic
retro
minimal
spring
night
```

---

## 8. flow 고정 규칙

인트로 흐름은 고정한다.

```txt
0~5초: 제목 노출
5~10초: 좋아요/구독/알림 CTA 노출
10초 이후: 프레임과 CTA 사라짐
10초 이후: 하단바 유지
```

기본 flow:

```json
"flow": {
  "frameSeconds": 10,
  "titleSeconds": 5,
  "ctaSeconds": 5,
  "bottomBarStartsAfterSeconds": 10,
  "frameExit": "reverse-fade-slide"
}
```

---

## 9. motion token 규칙

motion에는 CSS를 직접 쓰지 않는다.
아래 token만 사용한다.

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

---

## 10. 숏츠 9:16 제작 규칙

숏츠는 세로 화면이다.

추천:

```txt
titlePosition: center-middle, upper-third, lower-third, center-lower
bottomBarPosition: bottom-safe
bottomBarAlign: center 또는 left
safeArea: vertical-title-center, vertical-upper-third, vertical-lower-third
```

피해야 할 것:

```txt
16:9 프리셋 그대로 복사
제목을 화면 끝에 붙이기
CTA와 하단바 겹치기
하단바를 너무 크게 만들기
```

---

## 11. 롱폼 16:9 제작 규칙

롱폼은 가로 화면이다.

추천:

```txt
titlePosition: center-middle, left-middle, lower-third
bottomBarPosition: bottom-safe
bottomBarAlign: center 또는 left
safeArea: horizontal-title-center
```

피해야 할 것:

```txt
숏츠 프리셋 단순 확대
중앙에 모든 요소 몰아넣기
하단바를 너무 크게 만들기
```

---

## 12. 업로드 zip 처리 규칙

사용자가 프리셋 zip을 주면 먼저 구조를 확인한다.

좋은 구조:

```txt
preset-name/config.json
preset-name/template.js
```

현재 앱이 바로 읽는 것은 `config.json`이다.

`template.js`가 canvas draw 기반이면 HTML/CSS preview가 직접 실행하지 못할 수 있다.
그 경우 우선순위는 다음과 같다.

```txt
1. config.json을 먼저 공식 프리셋으로 등록
2. template.js는 원본으로 보관하거나 추후 adapter 대상으로 기록
3. 임시 프리셋과 공식 프리셋이 중복되면 임시 프리셋 제거
```

---

## 13. Codex 작업 요청 템플릿 — 숏츠 10개

아래 문구를 그대로 줘도 된다.

```txt
Pop WiFi MV Studio 숏츠용 9:16 인트로 프리셋 10개를 만들어라.

기준 문서:
popwifi-mv-studio/docs/PRESET_PRODUCTION_SINGLE_GUIDE_KO.md

작업 범위:
- shared/presets/9x16/batch-011-020/ 안에 생성
- preset-shorts-011부터 preset-shorts-020까지 생성
- 각 프리셋은 config.json만 생성
- 앱 구조, JS, CSS, 서버 코드 수정 금지
- Remotion 사용 금지
- raw CSS 금지
- motion token만 사용
- 0~5초 제목, 5~10초 CTA, 10초 이후 하단바 유지
- 장르/분위기는 서로 겹치지 않게 다양하게 구성
- 각 config에는 id/name/title/category/variant/ratio/batchId/flow/layout/visual/motion/cta/bottomBar 포함
- 작업 후 추가한 파일 목록과 한 줄 콘셉트 요약을 이 문서 하단 작업 기록에 추가
```

---

## 14. Codex 작업 요청 템플릿 — 롱폼 10개

```txt
Pop WiFi MV Studio 롱폼용 16:9 인트로 프리셋 10개를 만들어라.

기준 문서:
popwifi-mv-studio/docs/PRESET_PRODUCTION_SINGLE_GUIDE_KO.md

작업 범위:
- shared/presets/16x9/batch-051-060/ 안에 생성
- intro-051부터 intro-060까지 생성
- 각 프리셋은 config.json만 생성
- 앱 구조, JS, CSS, 서버 코드 수정 금지
- Remotion 사용 금지
- raw CSS 금지
- motion token만 사용
- 0~5초 제목, 5~10초 CTA, 10초 이후 하단바 유지
- 숏츠를 단순 확대하지 말고 16:9 와이드 화면에 맞게 설계
- 각 config에는 id/name/title/category/variant/ratio/batchId/flow/layout/visual/motion/cta/bottomBar 포함
- 작업 후 추가한 파일 목록과 한 줄 콘셉트 요약을 이 문서 하단 작업 기록에 추가
```

---

## 15. 검수 체크리스트

작업 후 반드시 확인한다.

```txt
id와 폴더명이 같은가?
ratio와 폴더가 같은가?
batchId와 폴더가 같은가?
active가 true인가?
flow가 10초 구조인가?
motion token이 허용값인가?
raw CSS가 없는가?
cta items가 like/subscribe/notification인가?
bottomBar contentFallback이 title인가?
프리셋 페이지에 표시되는가?
클릭 시 preview가 깨지지 않는가?
```

---

## 16. 현재 공식 숏츠 프리셋

업로드된 `shorts-presets.zip` 기준 공식 숏츠 5개:

```txt
shared/presets/9x16/batch-001-010/preset-shorts-001/config.json
shared/presets/9x16/batch-001-010/preset-shorts-002/config.json
shared/presets/9x16/batch-001-010/preset-shorts-003/config.json
shared/presets/9x16/batch-001-010/preset-shorts-004/config.json
shared/presets/9x16/batch-001-010/preset-shorts-005/config.json
```

기존 보존 프리셋:

```txt
shared/presets/9x16/batch-001-010/moon-dust-window/config.json
```

---

## 17. 현재 공식 롱폼 프리셋 상태

16:9 import 원본:

```txt
shared/presets/imports/intro-batch-001-010.json
shared/presets/imports/intro-batch-011-020.json
shared/presets/imports/intro-batch-021-030.json
shared/presets/imports/intro-batch-031-040.json
shared/presets/imports/intro-batch-041-050.json
```

서버 시작 시 실제 config 구조로 자동 materialize된다.

---

## 18. 작업 기록

### 2026-04-25

완료:

```txt
Motion engine 완료
16:9 import batch 50개 자동 등록 구조 추가
shorts-presets.zip 기준 9:16 공식 프리셋 5개 config 등록
임시 shorts-001~005 중복 config 제거
프리셋 제작 단일 지침서 생성
```

다음 프리셋 제작 시작 번호:

```txt
숏츠: preset-shorts-006 또는 batch-011-020의 preset-shorts-011
롱폼: intro-051
```

---

## 19. 최종 결론

앞으로 ChatGPT나 Codex는 이 문서 하나만 보면 된다.

```txt
이제 할 일은 앱 개발이 아니라 프리셋 제작이다.
새 작업자는 shared/presets 안에 config.json 프리셋만 만든다.
앱 구조는 건드리지 않는다.
```
