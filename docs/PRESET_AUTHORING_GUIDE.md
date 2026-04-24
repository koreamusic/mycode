# Pop WiFi MV Studio — Preset Authoring Guide

작성일: 2026-04-25
용도: 프리셋 제작 / 추가 / 삭제 / 수정 규칙

---

## 1. 프리셋의 정의

프리셋은 영상 인트로와 하단바를 그리는 렌더 템플릿이다.

프리셋은 단순 CSS 장식이 아니라, 실제 렌더링에 사용되는 구조다.

---

## 2. 필수 파일

각 프리셋은 반드시 다음 파일을 가진다.

```text
template.js
config.json
preview.jpg
README.md
```

---

## 3. 폴더 구조

```text
shared/presets/
  16x9/
    preset-name/
      template.js
      config.json
      preview.jpg
      README.md

  9x16/
    preset-name/
      template.js
      config.json
      preview.jpg
      README.md
```

---

## 4. template.js 규칙

template.js는 반드시 CommonJS 방식으로 작성한다.

import/export 금지.

```js
function draw(ctx, frame, fps, data) {
  const t = frame / fps;
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  drawBackground(ctx, W, H, t, data);
  drawFrame(ctx, W, H, t, data);

  if (data.introPhase === 'title') {
    drawTitle(ctx, W, H, t, data);
  }

  if (data.introPhase === 'social') {
    drawSocial(ctx, W, H, t, data);
  }

  if (data.introPhase === 'done') {
    drawBottomBar(ctx, W, H, t, data);
  }
}

function drawVisSlot(ctx, x, y, w, h, t, accentColor) {
  // 선택 사항
}

const meta = {
  id: 'preset-name',
  name: 'Preset Name',
  ratio: '16x9',
  accentColor: '#d4a050'
};

module.exports = { draw, drawVisSlot, meta };
```

---

## 5. config.json 규칙

```json
{
  "id": "moon-dust-window",
  "name": "Moon Dust Window",
  "ratio": "16x9",
  "accentColor": "#B8C6FF",
  "tags": ["lofi", "night", "calm"],
  "fonts": {
    "title": "Playfair Display",
    "lyric": "Noto Sans KR",
    "karaoke": "Noto Serif KR"
  },
  "karaokeMode": false,
  "karaokeGlow": false,
  "createdAt": "2026-04-25",
  "active": true
}
```

필수 키:

- id
- name
- ratio
- accentColor
- tags
- fonts
- createdAt
- active

---

## 6. README.md 규칙

각 프리셋 README에는 다음을 적는다.

```md
# Preset Name

## Ratio
16x9 또는 9x16

## Mood
프리셋 분위기

## Source
숏츠 기반인지, 롱폼 재설계인지

## Timeline
0~5초 제목
5~10초 CTA
10초 이후 하단바

## Edit Notes
수정 시 주의할 점
```

---

## 7. preview.jpg 규칙

preview.jpg는 프리셋 선택 화면에서 사용한다.

권장 크기:

- 16x9: 320x180
- 9x16: 180x320

프리뷰는 실제 프리셋의 6~8초 구간 또는 대표 장면을 사용한다.

---

## 8. 프리셋 삭제 규칙

기본 삭제는 비활성화다.

```json
{
  "active": false
}
```

완전 삭제는 별도 관리 기능에서만 수행한다.

삭제 전 반드시 확인 모달을 띄운다.

---

## 9. 프리셋 수정 규칙

기존 안정 프리셋은 직접 덮어쓰지 않는다.

수정이 크면 새 버전으로 만든다.

예:

```text
moon-dust-window-v1
moon-dust-window-v2
```

---

## 10. 프리셋 이름 규칙

파일명은 영문 소문자와 하이픈을 사용한다.

좋은 예:

```text
moon-dust-window
rainy-train-seat
smoke-velvet-bar
```

나쁜 예:

```text
문더스트 윈도우
Moon Dust Window
moon dust window
moon_dust_window
```

---

## 11. 프리셋 화면 표시명

config.json의 name은 사용자에게 보이는 이름이다.

예:

```json
{
  "id": "moon-dust-window",
  "name": "문더스트 윈도우"
}
```

파일명은 영문, 화면 표시명은 한글 가능.

---

## 12. 16x9와 9x16의 관계

같은 이름을 공유할 수 있지만 구현은 분리한다.

```text
shared/presets/9x16/moon-dust-window/template.js
shared/presets/16x9/moon-dust-window/template.js
```

두 template.js는 별도다.

---

## 13. 품질 체크리스트

- [ ] template.js가 CommonJS인가?
- [ ] module.exports가 있는가?
- [ ] config.json에 active가 있는가?
- [ ] preview.jpg가 있는가?
- [ ] README.md가 있는가?
- [ ] 0~5초 제목 구간이 있는가?
- [ ] 5~10초 CTA 구간이 있는가?
- [ ] 10초 이후 하단바 구간이 있는가?
- [ ] 가사가 없을 때 제목이 노출되는가?
- [ ] 모바일 확인 화면에서 깨지지 않는가?
- [ ] PC 미리보기에서 가독성이 좋은가?

---

## 14. 현재 진행률

프리셋 제작 규칙 문서화: 완료
실제 프리셋 변환/생성: 미완료
전체 개발 진행률: 약 12%
