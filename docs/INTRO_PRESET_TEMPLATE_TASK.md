# intro-001~050 template.js 구현 작업 명세

작성일: 2026-04-25  
담당: GPT (또는 다음 Claude 세션)  
검수: Claude (template.js 완성 후 generate-preset-previews.js 실행해서 preview.jpg 생성)

---

## 개요

`shared/presets/16x9/` 안에 50개의 intro 프리셋 폴더가 있다.  
각 폴더에는 `config.json`만 있고 **`template.js`가 없다.**  
이 파일 50개를 구현하는 것이 이 작업의 전부다.

---

## 폴더 위치

```
popwifi-mv-studio/shared/presets/16x9/
  batch-001-010/
    intro-001-midnight-jazz-frame/   ← config.json 있음, template.js 없음
    intro-002-lofi-window-glow/
    ...
    intro-010-cafe-smooth-jazz/
  batch-011-020/
    intro-011-rainy-piano-window/
    ...
    intro-020-dreamy-cloud-pop/
  batch-021-030/  (intro-021 ~ intro-030)
  batch-031-040/  (intro-031 ~ intro-040)
  batch-041-050/  (intro-041 ~ intro-050)
```

---

## template.js 작성 규칙 (반드시 준수)

### 1. CommonJS 형식

```js
// import/export 절대 금지
function draw(ctx, frame, fps, data) { ... }
function drawVisSlot(ctx, x, y, w, h, t, accentColor) { ... }
function roundRect(ctx, x, y, w, h, r) { ... }
const meta = { id: '...', name: '...', ratio: '16x9', accentColor: '...' };
module.exports = { draw, drawVisSlot, meta };
```

### 2. draw() 함수 시간 구조

모든 intro 프리셋은 다음 3단계를 따른다:

```
t < 5초  → drawTitle()   : 곡 제목 표시 (페이드인)
t < 10초 → drawSocial()  : 좋아요/구독/알림 CTA
t >= 10초 → drawBottomBar() : 가사/제목 하단바
```

config.json의 `flow` 필드 참고:
- `titleSeconds: 5` → 0~5초 타이틀
- `ctaSeconds: 5` → 5~10초 CTA
- `bottomBarStartsAfterSeconds: 10` → 10초 이후 하단바

### 3. 캔버스 좌표

- `W = ctx.canvas.width` (1920px 기준)
- `H = ctx.canvas.height` (1080px 기준)
- 비율 기반 좌표 사용 — 절대값 금지 (예: `W * 0.08`, `H * 0.06`)

### 4. data 객체 사용법

```js
data.song?.title      // 곡 제목
data.currentLyric?.text  // 현재 가사 (없으면 title로 대체)
```

### 5. roundRect 헬퍼

모든 template.js에 동일하게 포함:

```js
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
```

### 6. node-canvas 호환

- `Math.random()` 사용 가능 (단, grain 효과에서만)
- 이미지 로드 불가 → 그라디언트/선/원/사각형/텍스트만 사용
- 외부 라이브러리 require 금지

---

## 레퍼런스 구현 (참고할 기존 template.js)

아래 파일들이 동일 패턴의 완성 예시다. 작성 전 반드시 읽을 것:

```
shared/presets/16x9/batch-001-010/moon-dust-window/template.js   ← 가장 깔끔한 기준
shared/presets/16x9/batch-001-010/preset-shorts-001/template.js  ← Neon Box
shared/presets/16x9/batch-001-010/preset-shorts-002/template.js  ← Slide Frame
shared/presets/16x9/batch-001-010/preset-shorts-003/template.js  ← Draw Frame
shared/presets/16x9/batch-001-010/preset-shorts-004/template.js  ← Twist Box
shared/presets/16x9/batch-001-010/preset-shorts-005/template.js  ← Minimal Line
```

---

## 50개 프리셋 목록 및 디자인 방향

각 항목: `id | mood | 시각적 핵심`  
config.json의 `visual.palette`, `layout.frameStyle`, `bottomBar.style`을 반영해서 구현할 것.

### batch-001-010

| ID | mood | 배경 주조색 | 핵심 요소 |
|----|------|------------|----------|
| intro-001-midnight-jazz-frame | smoky, elegant, late-night jazz | #0a0a0a~#1a1208 | 얇은 골드 코너 프레임, 세리프 타이틀, 골드 뱃지 CTA |
| intro-002-lofi-window-glow | soft, cozy, night-window lofi | #0d0b1a~#1a1530 | 부드러운 라벤더 창문 프레임, 둥근 pill CTA, 크림 타이틀 |
| intro-003-acoustic-spring-card | fresh, acoustic, spring morning | #f5f0e8~#e8f0e0 | 밝은 베이지/민트 그라디언트, 카드 테두리, 봄 느낌 |
| intro-004-kpop-neon-stage | sleek, energetic, modern pop | #050510~#0a0520 | 강렬한 핑크/퍼플 네온 라인, 볼드 타이틀, 에너지 |
| intro-005-ballad-memory-film | emotional, nostalgic, cinematic ballad | #1a1208~#0d0a06 | 세피아 필름 느낌, 부드러운 비네트, 감성 타이틀 |
| intro-006-city-pop-sunset-grid | retro, stylish, sunset city pop | #1a0a1a~#2a1020 | 핑크/오렌지 석양, 레트로 그리드 라인, 시티팝 |
| intro-007-blues-smoke-signature | deep, smoky, old soul blues | #050308~#0a0510 | 딥 퍼플/블루, 연기 느낌 노이즈, 두꺼운 라인 |
| intro-008-anime-sky-breeze | open, lyrical, anime outdoor breeze | #87ceeb~#e0f0ff | 하늘색 그라디언트, 밝고 개방적, 흰색 타이틀 |
| intro-009-chillwave-dream-tape | dreamy, synth, late-night chillwave | #0a0518~#150a2a | 딥 퍼플/핑크 신스 파동, 테이프 릴 느낌 |
| intro-010-cafe-smooth-jazz | warm, cafe, smooth jazz | #1a0e08~#2a1a10 | 따뜻한 브라운/앰버, 카페 조명, 부드러운 곡선 |

### batch-011-020

| ID | mood | 배경 주조색 | 핵심 요소 |
|----|------|------------|----------|
| intro-011-rainy-piano-window | quiet, rainy, emotional piano | #0d1018~#080c14 | 다크 블루 빗줄기 효과(세로선), 창문 프레임 |
| intro-012-vinyl-room-lofi | warm, dusty, bedroom lofi | #1a1208~#120e08 | 따뜻한 황갈색, 바이닐 원형 애니메이션 |
| intro-013-cinematic-black-gold | grand, minimal, premium cinema | #050505~#0a0a0a | 풀블랙, 씬 골드 라인, 프리미엄 시네마틱 |
| intro-014-minimal-white-line | clean, calm, modern minimal | #f8f8f8~#f0f0f0 | 밝은 화이트, 씬 다크 라인, 미니멀 |
| intro-015-retro-tv-dial | nostalgic, analog, old television | #1a1a0a~#0d0d05 | 올리브/세피아, TV 스캔라인 효과, 레트로 |
| intro-016-spring-flower-breeze | bright, floral, soft spring pop | #fff0f5~#ffe8f0 | 연핑크/피치, 꽃잎 느낌 파티클 |
| intro-017-night-drive-synth | dark, moving, night-drive synth | #030510~#08051a | 다크 네이비, 수평 속도선, 신스팝 |
| intro-018-soft-rnb-silk | smooth, intimate, silk R&B | #1a0a14~#120810 | 딥 와인/퍼플, 실크 광택 그라디언트 |
| intro-019-folk-paper-diary | honest, handmade, folk diary | #f5efe0~#ede8d8 | 크림 페이퍼, 손글씨 느낌, 따뜻한 라인 |
| intro-020-dreamy-cloud-pop | soft, floating, dreamy cloud pop | #e8f0ff~#f0f5ff | 연한 스카이 블루, 클라우드 같은 흐림 |

### batch-021-030

| ID | mood | 배경 주조색 | 핵심 요소 |
|----|------|------------|----------|
| intro-021-sax-club-corner | smoky, intimate, late club jazz | #080508~#100810 | 딥 퍼플/블랙, 스팟라이트 느낌 원형 빛 |
| intro-022-blue-hour-lofi | blue hour, quiet, soft lofi | #0a0f1a~#080d18 | 블루아워 딥블루, 차분한 수평선 |
| intro-023-guitar-sunbeam | warm, acoustic, morning sunlight | #1a1005~#251808 | 황금 햇살 그라디언트, 따뜻한 앰버 |
| intro-024-pop-glass-pulse | glossy, bright, modern pop | #0a0a14~#14142a | 유리 반사 효과, 펄스 애니메이션 |
| intro-025-old-photo-ballad | nostalgic, warm, old-photo | #2a1e10~#1a1208 | 세피아/빈티지, 필름 grain, 오래된 사진 |
| intro-026-city-night-sign | retro city, night sign | #050308~#0a0610 | 다크 배경, 레트로 네온사인 글로우 |
| intro-027-rust-blues-lamp | rusty, deep, old lamp blues | #1a0805~#120605 | 녹슨 레드/브라운, 오래된 램프 빛 |
| intro-028-schoolyard-anime-spring | fresh, schoolyard, anime | #f0f8ff~#e8f4e8 | 밝은 하늘+연두, 아니메 봄 교정 |
| intro-029-tape-haze-chillwave | hazy, dreamy, analog chillwave | #0d0818~#180d28 | 퍼플 헤이즈, 테이프 노이즈 선 |
| intro-030-cafe-rain-jazz | rainy cafe, warm, smooth jazz | #0d0a08~#151008 | 따뜻한 다크 브라운, 빗줄기+카페 빛 |

### batch-031-040

| ID | mood | 배경 주조색 | 핵심 요소 |
|----|------|------------|----------|
| intro-031-moonlit-ballad-frame | moonlit, tender, night ballad | #05080f~#080d18 | 달빛 블루, 얇은 프레임, 서정적 |
| intro-032-lofi-cat-desk | cozy, playful, desk lofi night | #1a1208~#100e08 | 따뜻한 책상 조명, 아늑한 브라운 |
| intro-033-golden-hour-folk | golden, honest, open-air folk | #1a1005~#2a1a08 | 황금시간대 앰버, 따뜻하고 열린 |
| intro-034-pink-stage-pop | bright, stage, polished pink pop | #1a0510~#200a18 | 핑크 무대 조명, 반짝임 효과 |
| intro-035-harbor-citypop | harbor night, retro, city pop | #050a14~#080f1e | 항구 야경, 물반사, 레트로 시티팝 |
| intro-036-deep-road-blues | lonely road, heavy, deep blues | #050305~#080508 | 거의 블랙, 외로운 도로 라인 |
| intro-037-anime-rain-platform | rainy, cinematic, anime station | #0a0d14~#080a10 | 다크 플랫폼, 빗줄기, 애니메 감성 |
| intro-038-cosmic-chillwave | cosmic, dreamy, synth chillwave | #030510~#05081a | 우주 딥블루, 별 파티클, 신스 |
| intro-039-cafe-book-corner | quiet cafe, book corner, warm jazz | #1a1208~#120e08 | 따뜻한 카페 코너, 책장 느낌 |
| intro-040-clean-night-minimal | clean, dark, night minimal pop | #080808~#0f0f0f | 다크 미니멀, 씬 화이트 라인 |

### batch-041-050

| ID | mood | 배경 주조색 | 핵심 요소 |
|----|------|------------|----------|
| intro-041-midnight-cinema-rain | midnight, cinematic, rain-lit city | #030508~#050810 | 시네마틱 블랙, 빗속 도시 빛 반사 |
| intro-042-minimal-dust-light | minimal, quiet, dust-light modern | #f5f2ee~#ede8e0 | 먼지 빛 밝은 미니멀, 조용한 현대적 |
| intro-043-retro-cassette-orange | analog, orange, cassette retro | #1a0a05~#200e08 | 카세트 오렌지/브라운, 레트로 아날로그 |
| intro-044-spring-picnic-pop | picnic, bright, soft spring pop | #f0f8e8~#e8f5d8 | 연한 그린/옐로우, 피크닉 봄 |
| intro-045-night-subway-glow | subway, dark, neon night motion | #050508~#080810 | 지하철 다크, 네온 글로우 수평선 |
| intro-046-smooth-lounge-rnb | smooth, lounge, intimate R&B | #0d0810~#150d18 | 딥 퍼플/마룬, 라운지 조명 |
| intro-047-country-dust-road | dusty, warm, country acoustic | #1a1208~#251a10 | 먼지 길 황갈색, 컨트리 따뜻함 |
| intro-048-dream-school-sky | dreamy, school sky, anime youth | #c8e8ff~#e0f0ff | 밝은 하늘색, 청춘 애니메 |
| intro-049-purple-dawn-chillwave | purple dawn, dreamy, synth haze | #0d0518~#180828 | 퍼플 새벽, 신스 헤이즈 |
| intro-050-jazz-candle-table | candlelit, warm, intimate jazz | #0d0805~#150e08 | 촛불 황금빛, 친밀한 재즈 테이블 |

---

## 구현 순서 권장

1회차: batch-001-010 (10개) — 완성 후 preview.jpg 생성해서 확인  
2회차: batch-011-020 (10개)  
3회차: batch-021-030 (10개)  
4회차: batch-031-040 (10개)  
5회차: batch-041-050 (10개)  

---

## preview.jpg 생성 방법

template.js 완성 후 프로젝트 루트에서 실행:

```bash
node popwifi-mv-studio/scripts/generate-preset-previews.js
```

이미 있는 preview.jpg는 건너뜀. 새로 만든 것만 생성.

---

## 완성 기준 체크리스트

각 template.js 완성 시 확인:

- [ ] `module.exports = { draw, drawVisSlot, meta }` 포함
- [ ] `meta.id`가 config.json의 `id`와 일치
- [ ] `meta.ratio === '16x9'`
- [ ] `draw()` 내부에 t < 5 / t < 10 / else 구조
- [ ] `data.song?.title` 사용
- [ ] `node -e "require('./template.js')"` 에러 없음
- [ ] `generate-preset-previews.js` 실행 시 OK

---

## Claude가 이어받을 때 할 일

1. GPT가 작성한 template.js 파일들 검수 (위 체크리스트 기준)
2. `node popwifi-mv-studio/scripts/generate-preset-previews.js` 실행
3. 실패한 항목만 수정
4. 전체 커밋 & 푸시
5. → 이후 9x16 숏츠 intro 프리셋 50개 추가 작업으로 이동

---

## 다음 단계 (template.js 완성 후)

- 9x16 버전 intro 프리셋 50개 설계 및 구현 (숏츠 수직 구도)
- intro 프리셋을 앱 UI에서 선택 가능하도록 카테고리 필터 추가
- 렌더 파이프라인 FFmpeg 환경 테스트
