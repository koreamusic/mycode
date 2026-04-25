# Pop WiFi MV Studio — Codex 프리셋 제작 전용 지침

## 이 문서의 목적

이 문서는 Codex 또는 ChatGPT에게 Pop WiFi MV Studio 프리셋 제작을 맡길 때 사용하는 전용 지침이다.

이 문서를 받은 작업자는 앱 구조를 고치지 말고, 프리셋 파일만 만들어야 한다.

```txt
목표: 새 인트로 프리셋 config.json 제작
금지: 앱 전체 재디자인, 엔진 수정, Remotion 추가, 새 프리셋 엔진 생성
```

## 현재 프로젝트 상태

현재 Pop WiFi MV Studio는 다음 상태로 본다.

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

따라서 다음 작업은 개발이 아니라 프리셋 제작이다.

## 절대 금지 사항

Codex는 아래 작업을 하면 안 된다.

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
한 프리셋 때문에 전체 구조 변경 금지
공식 프리셋과 임시 프리셋 중복 생성 금지
```

## 허용 작업

Codex가 해도 되는 작업은 아래뿐이다.

```txt
새 프리셋 폴더 생성
새 config.json 생성
필요 시 README.md 또는 preset notes 추가
프리셋 제작 완료 문서 업데이트
```

단, 프리셋 추가 위치는 반드시 아래 경로 안이어야 한다.

```txt
popwifi-mv-studio/shared/presets/
```

## 프리셋 저장 구조

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

## 배치 규칙

프리셋은 가능하면 10개 단위로 만든다.

```txt
batch-001-010
batch-011-020
batch-021-030
batch-031-040
batch-041-050
batch-051-060
```

현재 기준:

```txt
16x9: intro-batch-001-050 import 원본 존재, 서버 시작 시 materialize
9x16: preset-shorts-001~005 공식 등록 완료
```

새 숏츠 프리셋을 만들 때는 보통 다음부터 시작한다.

```txt
preset-shorts-006
```

새 롱폼 프리셋을 만들 때는 보통 다음부터 시작한다.

```txt
intro-051
```

## config.json 필수 구조

새 프리셋 config는 최소한 아래 필드를 포함해야 한다.

```json
{
  "id": "preset-shorts-006-example-name",
  "name": "Example Name",
  "title": "Example Name",
  "category": "shorts-preset",
  "variant": "lofi",
  "ratio": "9x16",
  "batchId": "batch-001-010",
  "accentColor": "#D7C0FF",
  "tags": ["lofi", "night", "soft"],
  "fonts": {
    "title": "Montserrat",
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
    "frameExit": "reverse-fade-slide"
  },
  "layout": {
    "frameStyle": "vertical-soft-window-light-frame",
    "titlePosition": "center-middle",
    "ctaPosition": "center-middle",
    "bottomBarPosition": "bottom-safe",
    "bottomBarAlign": "center",
    "safeArea": "vertical-title-center"
  },
  "visual": {
    "accent": "#D7C0FF",
    "accent2": "#FFD78A",
    "palette": ["night navy", "dusty violet", "warm lamp yellow", "cream white"],
    "texture": "soft blur, dust particles, quiet room tone",
    "typography": "rounded modern sans with relaxed spacing"
  },
  "motion": {
    "frameExit": "reverse-fade-slide",
    "title": "gentle-breathe",
    "cta": "float-pop",
    "bottomBar": "glass-slide",
    "end": "vinyl-spin",
    "cadence": "slow"
  },
  "cta": {
    "style": "compact pill-shaped cozy reaction buttons",
    "items": ["like", "subscribe", "notification"]
  },
  "bottomBar": {
    "style": "vertical-safe translucent rounded bar",
    "endAnimation": "small vinyl spin loop",
    "contentFallback": "title"
  },
  "layers": [],
  "createdAt": "2026-04-25",
  "active": true
}
```

## ratio 규칙

폴더와 JSON의 ratio는 반드시 같아야 한다.

```txt
shared/presets/9x16/...  -> "ratio": "9x16"
shared/presets/16x9/...  -> "ratio": "16x9"
```

틀리면 실패다.

## id 규칙

폴더명과 id는 같게 만든다.

예:

```txt
폴더명: preset-shorts-006-rain-glass-ballad
id: preset-shorts-006-rain-glass-ballad
```

## category 규칙

숏츠:

```txt
shorts-preset
```

롱폼:

```txt
intro
```

## variant 허용값

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

## flow 고정 규칙

인트로 타임라인은 고정한다.

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

## motion token 규칙

motion에는 반드시 token만 사용한다.
raw CSS를 넣지 않는다.

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

## 숏츠 제작 규칙

숏츠는 9:16 세로 화면이다.

추천 layout:

```txt
titlePosition: center-middle, upper-third, lower-third, center-lower
bottomBarPosition: bottom-safe
bottomBarAlign: center 또는 left
safeArea: vertical-title-center, vertical-upper-third, vertical-lower-third
```

피해야 할 것:

```txt
16:9 프리셋을 그대로 복사
제목을 화면 끝에 붙이기
CTA와 하단바 겹치기
하단바를 너무 크게 만들기
```

## 롱폼 제작 규칙

롱폼은 16:9 가로 화면이다.

추천 layout:

```txt
titlePosition: center-middle, left-middle, lower-third
bottomBarPosition: bottom-safe
bottomBarAlign: center 또는 left
safeArea: horizontal-title-center
```

피해야 할 것:

```txt
숏츠 프리셋을 단순 확대
중앙에 모든 요소 몰아넣기
하단바를 너무 크게 만들기
```

## Codex에게 줄 작업 요청 예시 — 숏츠 10개

아래 요청을 받으면 Codex는 앱 구조를 건드리지 말고 프리셋 config 파일만 만든다.

```txt
Pop WiFi MV Studio 숏츠용 9:16 인트로 프리셋 10개를 만들어라.

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
- 작업 후 추가한 파일 목록과 간단한 콘셉트 요약을 문서에 기록
```

## Codex에게 줄 작업 요청 예시 — 롱폼 10개

```txt
Pop WiFi MV Studio 롱폼용 16:9 인트로 프리셋 10개를 만들어라.

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
- 작업 후 추가한 파일 목록과 간단한 콘셉트 요약을 문서에 기록
```

## 작업 완료 시 반드시 남길 기록

프리셋을 만든 뒤에는 다음 문서를 추가하거나 업데이트한다.

```txt
popwifi-mv-studio/docs/preset-production-log-YYYY-MM-DD.md
```

기록 내용:

```txt
생성한 비율
생성한 batch
생성한 preset id 목록
각 프리셋 한 줄 설명
주의할 점
다음에 이어 만들 번호
```

## 검수 체크리스트

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

## 최종 결론

앞으로 Codex나 ChatGPT는 이 문서를 기준으로 프리셋을 만든다.

```txt
이제 할 일은 앱 개발이 아니라 프리셋 제작이다.
새 작업자는 shared/presets 안에 config.json 프리셋만 만든다.
앱 구조는 건드리지 않는다.
```
