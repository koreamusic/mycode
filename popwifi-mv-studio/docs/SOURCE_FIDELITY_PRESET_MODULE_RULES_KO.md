# Pop WiFi MV Studio — 원본 유지형 프리셋 모듈 규칙

## 목적

인트로 프리셋 작업의 핵심 기준을 고정한다.

사용자가 원하는 것은 새로운 디자인을 임의로 만드는 것이 아니라, 원본 HTML/TSX/JS 안에 있는 디자인, 모션, 파티클, 사각 프레임, CTA, 하단바 구조를 최대한 그대로 유지한 상태에서 현재 앱 구조에 안전하게 이식하는 것이다.

## 최상위 원칙

```txt
원본 유지가 1순위다.
자의적 재디자인은 금지한다.
디자인을 새로 비슷하게 만드는 것도 금지한다.
원본의 모션/파티클/프레임/CTA/하단바를 먼저 그대로 살린다.
원본 오류는 고치되, 오류 수정과 디자인 변경을 섞지 않는다.
```

## 금지 사항

```txt
- 50개 프리셋을 하나의 공통 프레임/공통 CTA/공통 하단바로 뭉개기 금지
- 색상만 바꿔서 서로 다른 프리셋처럼 처리 금지
- 원본에 없는 프레임, 파티클, 모션을 임의로 새로 만들기 금지
- 원본의 움직임을 추상적으로 해석해서 다른 CSS 애니메이션으로 대체 금지
- 모든 프리셋의 파티클/모션/CTA 코드를 app.css 또는 preset-preview.js 한 파일에 몰아넣기 금지
- 원본 파일을 확인하지 않고 “디자인 구현 완료”라고 기록 금지
```

## 올바른 작업 방식

### 1. 원본 보존

원본 파일은 수정하지 않고 보존한다.

권장 위치:

```txt
shared/presets/source-originals/<source-pack-name>/
```

예시:

```txt
shared/presets/source-originals/intro-html-pack-001/original.html
shared/presets/source-originals/intro-html-pack-001/original.css
shared/presets/source-originals/intro-html-pack-001/original.js
shared/presets/source-originals/intro-html-pack-001/README.md
```

원본 안의 함수, 클래스, keyframes, SVG, canvas, particle generator는 먼저 별도 기록한다.

### 2. 프리셋별 개별 모듈화

한 파일에 50개 디자인을 모두 넣지 않는다.

각 프리셋은 자기 모듈을 가진다.

권장 구조:

```txt
shared/presets/16x9/batch-001-010/intro-001-midnight-jazz-frame/
  config.json
  original-map.json
  renderer.html
  renderer.css
  renderer.js
  particles.js
  frame.svg
  README.md
```

필요 없는 파일은 만들지 않아도 되지만, 핵심은 “각 프리셋의 원본 디자인 구현이 독립적으로 추적 가능해야 한다”는 것이다.

### 3. 원본 매핑 파일 필수

각 프리셋에는 원본에서 무엇을 가져왔는지 남긴다.

예시:

```json
{
  "presetId": "intro-001-midnight-jazz-frame",
  "sourceFile": "shared/presets/source-originals/intro-html-pack-001/original.html",
  "sourcePresetIndex": 1,
  "sourcePresetName": "Midnight Jazz Frame",
  "preserved": {
    "frame": true,
    "titleMotion": true,
    "ctaMotion": true,
    "particles": true,
    "bottomBar": true,
    "endAnimation": true
  },
  "changed": [],
  "fixedErrors": []
}
```

### 4. 오류 수정 규칙

원본에도 오류가 있을 수 있다. 오류는 고쳐야 한다.

다만 오류 수정은 반드시 별도 기록한다.

허용되는 수정:

```txt
- 깨진 selector 수정
- 중복 id 수정
- 모바일에서 overflow 나는 위치 보정
- aspect-ratio 깨짐 수정
- syntax error 수정
- 접근 불가능한 asset 경로 수정
- 너무 큰 요소의 safe-area 보정
```

금지되는 수정:

```txt
- 원본 프레임을 다른 모양으로 교체
- 원본 파티클을 전혀 다른 파티클로 교체
- CTA 구조를 공통 버튼 하나로 대체
- 원본 모션을 비슷해 보이는 다른 모션으로 대체
```

## 프리셋 렌더링 구조 제안

현재 `preset-preview.js` 한 파일에 모든 렌더링을 넣는 방식은 위험하다.

권장 구조:

```txt
app/scripts/presets/preset-preview.js
  - 프리셋 선택/렌더러 호출만 담당

app/scripts/presets/renderers/registry.js
  - presetId -> renderer module 매핑

app/scripts/presets/renderers/intro-001-midnight-jazz-frame.js
app/scripts/presets/renderers/intro-002-lofi-window-glow.js
...
  - 각 프리셋 원본 기반 렌더 함수
```

또는 HTML/CSS 중심이면:

```txt
app/scripts/presets/preset-preview.js
  - 선택된 presetId를 보고 해당 renderer.html fragment를 로드

shared/presets/16x9/<batch>/<preset>/renderer.html
shared/presets/16x9/<batch>/<preset>/renderer.css
shared/presets/16x9/<batch>/<preset>/renderer.js
```

## 추천 방향

현재 프로젝트는 HTML/CSS preview system이 기준이므로, 처음에는 다음 방식이 안전하다.

```txt
1. 원본 HTML을 source-originals에 보관
2. 원본에서 preset 1개씩 분리
3. 각 preset 폴더에 renderer.html / renderer.css / renderer.js로 저장
4. preset-preview.js는 해당 renderer를 iframe 또는 isolated preview root로 로드
5. 공통 app.css와 섞지 않는다
6. 10개 단위로 검수한다
```

## 왜 iframe 또는 isolated root가 필요한가

원본 프리셋에는 다음이 섞여 있을 수 있다.

```txt
- 같은 class 이름
- 같은 keyframes 이름
- 전역 CSS 변수
- 전역 JS 함수
- animation 이름 충돌
- canvas/SVG selector 충돌
```

이것을 한 파일에 합치면 디자인이 꼬인다.

따라서 각 프리셋은 가능하면 격리된 preview root 또는 iframe 안에서 실행한다.

## 10개 단위 이식 규칙

50개를 한 번에 이식하지 않는다.

```txt
1차: intro-001~010 원본 디자인 이식
2차: intro-011~020 원본 디자인 이식
3차: intro-021~030 원본 디자인 이식
4차: intro-031~040 원본 디자인 이식
5차: intro-041~050 원본 디자인 이식
```

각 차수 완료 기준:

```txt
- 원본 source 보존 완료
- 각 프리셋 renderer 분리 완료
- 각 프리셋 original-map.json 작성 완료
- UI에서 선택 시 원본과 같은 frame/particle/CTA/bottom bar 확인
- 모바일 미리보기에서 잘리지 않음
- 오류 수정 내역 기록
```

## 완료 판정 기준

프리셋은 아래 조건을 모두 만족해야 완료다.

```txt
1. config.json 존재
2. 원본 source 위치 기록
3. 원본 frame 구현 유지
4. 원본 particle/motion 유지
5. 원본 Like/Subscribe/Notification 구조 유지
6. 원본 bottom bar 구조 유지
7. 오류 수정 내역 기록
8. 앱 미리보기에서 정상 동작
```

## 현재 상태 정정

```txt
50개 config 등록: 완료
50개 원본 디자인/모션/파티클 이식: 미완료
자의적 디자인 추가: 금지
다음 작업: 원본 파일 확인 후 001~010부터 원본 유지형 모듈 이식
```

## 다음 작업자 주의

원본을 보지 않고 구현하지 말 것.

디자인을 예쁘게 새로 만들지 말 것.

사용자가 지적한 핵심은 “다름”이 아니라 “원본 유지”다.
