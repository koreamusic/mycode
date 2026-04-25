# Pop WiFi MV Studio — CLAUDE.md

개발 기준, 진행 상태, 다음 작업을 기록합니다.
다음 개발자(또는 Claude 세션)는 이 파일을 먼저 읽고 작업을 이어받습니다.

---

## 프로젝트 구조

```
mycode/
├── popwifi-mv-studio/        ← 실제 앱 (여기서 모든 작업)
│   ├── server.js             ← Express 서버 진입점 (포트 3000)
│   ├── config.json           ← 서버 설정 (ffmpegPath, outputDir 등)
│   ├── app/                  ← 프론트엔드 (바닐라 JS + HTML)
│   │   ├── index.html        ← 앱 셸 (사이드바 + 페이지 영역)
│   │   ├── pages/            ← 8개 페이지 HTML
│   │   └── scripts/          ← 클라이언트 JS 모듈
│   ├── server/               ← 백엔드 모듈
│   │   ├── core/             ← 핵심 로직 (config, queue, render, logger)
│   │   └── routes/           ← API 라우트
│   ├── shared/presets/       ← 프리셋 데이터
│   │   ├── 9x16/             ← 숏츠 프리셋 (디자인 원형)
│   │   ├── 16x9/             ← 롱폼 프리셋 (재설계본)
│   │   └── imports/          ← 배치 import JSON 파일들
│   └── scripts/              ← CLI 유틸 스크립트
└── docs/                     ← 개발 문서

루트의 Vite/React 프로젝트는 삭제됨. 실제 앱은 popwifi-mv-studio/만 사용.
```

---

## 개발 원칙 (절대 준수)

- **PC 중심** — 모바일은 확인/검수용
- **원페이지 금지** — 8개 독립 모듈 페이지로 분리
- **숏츠 = 디자인 원형** — 롱폼은 숏츠 단순 확대 금지, 16:9 재설계 필수
- **사이드바/기능 임의 삭제 금지**
- **프리셋 추가를 위해 전체 앱 구조 재설계 금지**

---

## 현재 진행률 (2026-04-25 기준)

| 영역 | 이전 | 현재 |
|------|------|------|
| 기획/구조 | 90% | **100%** |
| 문서화 | 80% | **95%** |
| 코드 구현 (페이지/API) | 0% | **88%** |
| 프리셋 이식 (config+template+preview) | 0% | **98%** |
| 렌더 시스템 (캡처·FFmpeg) | 0% | **40%** |
| 테스트/안정화 | 0% | **10%** |
| **전체** | **12%** | **~76%** |

---

## 완료된 작업 (이번 세션)

### 보안·안정성
- `router.js` XSS 패치 — `innerHTML` → `DOMParser + replaceChildren`
- 포트 불일치 수정 — 3100 → 3000 전체 통일
- Preset API 입력 검증 — `ratio`/`batchId`/`presetId` whitelist regex
- WebSocket·queue JSON.parse try/catch — 큐 파일 손상 시 서버 크래시 방지
- localhost CORS 제한 — 외부 origin 403 차단
- 구조화 로거 — `server/core/logger.js` (타임스탬프 + 레벨)

### 페이지 구현
- `queue.html` — 큐 상태 표시, WebSocket sync 연동
- `lyrics.html` + `lyrics.js` — 가사 입력 → 줄별 타임코드 마킹 → sync.json 다운로드
- `landing.html` + `landing.js` — 종류·시간 선택 → 테스트 렌더 → 인라인 비디오 프리뷰
- `faq.html` — 전체 흐름, 프리셋 구조, 추가/비활성화/삭제, 롱폼 재설계 규칙, 문제 해결

### 기능 추가
- 프리셋 이미지 미리보기 — `/preset-files` 정적 경로 + `<img>` per 카드
- 프리셋 배치 import UI — Settings 페이지 파일 업로드 + `POST /api/presets/import`
- 설정 저장 — `PATCH /api/config` + 저장 버튼
- 루트 Vite/React 스캐폴드 삭제 (미사용, 혼동 방지)

### 프리셋
- 16x9 롱폼 재설계 5종 완성:
  - `preset-shorts-001` — Neon Box: 단일 박스 → 듀얼 박스 구도
  - `preset-shorts-002` — Slide Frame: 수직 라인 → 수평 슬라이딩 라인
  - `preset-shorts-003` — Draw Frame: 상단 third → 상단 좌측, 시네마틱 비네트
  - `preset-shorts-004` — Twist Box: 중앙 트위스트 → 수평 4컬럼 그리드
  - `preset-shorts-005` — Minimal Line: 어두운 수직 → 밝은 페이퍼, 좌측 앵커
- 각 프리셋: `config.json` + `template.js` + `README.md` 완비
- `sourceRole: "longform-redesign-from-shorts"` + `sourcePreset` 추적 필드 포함
- 9x16 숏츠 프리셋 5종 `template.js` 신규 추가 (기존 config.json만 있었음)
  - 각 프리셋 9x16 수직 구도에 맞는 독립 구현
- `scripts/generate-preset-previews.js` 신규 — node-canvas로 preview.jpg 자동 생성
- **preview.jpg 생성 완료: 16x9 × 6개 + 9x16 × 6개** (총 12개)

---

## 남은 작업

### 우선순위 높음
- [x] `preview.jpg` 생성 — node-canvas 스크립트로 14개 자동 생성 완료
- [x] 음원/이미지 파일 연결 UI — 프로젝트 페이지 소스 폼 (title/artist/musicFile/coverImage/lyricsFile)
- [x] 큐 페이지 동적 렌더링 — currentJob/pending/completed/failed 카드 + WebSocket 실시간 갱신
- [ ] 렌더 파이프라인 실제 테스트 — FFmpeg 설치 환경에서 end-to-end 검증 (로컬 환경 필요)

### 우선순위 중간
- [x] 폰트 관리 기능 — GET /api/fonts + Settings UI + Google Fonts 링크
- [x] moon-dust-window 프리셋 — template.js + preview.jpg 완료 (loose + batch 모두)
- [x] 프리셋 일괄 비활성화/복원 UI — Settings 배치 단위 bulk 관리
- [x] 구조화 에러 로깅 강화 — Express 500 핸들러 + uncaughtException/unhandledRejection
- [ ] Whisper 연동 — 가사 자동 싱크 (외부 도구 필요)
- [ ] 랜딩 검수 비디오 재생 — FFmpeg 필요

### 우선순위 낮음
- [ ] 인증/토큰 — 현재 localhost CORS만 있음

---

## 프리셋 완료 현황

### 16x9 intro-001~050 template.js — **완료**

- batch-001-010 ~ batch-041-050 각 10개, 총 50개
- 구조: `drawBackground + drawRetroGrid/drawFrame + drawTitle + drawSocial + drawBottomBar`
- `t < 5`: 제목만, `t < 10`: CTA 3버튼, `t >= 10`: 하단바 (좋아요/구독/알림)
- 커밋: `cabca5d` (intro-001~010), 이후 배치들 추가 커밋

### 9x16 숏츠 intro-001~050 config.json — **완료**

- batch-001-010 ~ batch-041-050 각 10개, 총 50개
- 커밋: `270d6fa`

### 9x16 숏츠 intro-001~050 template.js — **완료**

- intro-001~010: 커밋 `ffe9271`
- intro-011~050: 커밋 `4ee7268`
- **구조 원칙 (16x9와 다름):**
  - 하단바(bottomBar) 없음
  - `draw()`: drawBackground + drawFrame + drawTitle + (t>=5) drawSocial
  - drawSocial: `['좋아요', '구독']` 2버튼만, 세로 스택, `H*0.62` 시작
  - drawFrame: `roundRect(W*0.06, H*0.10, W*0.88, H*0.72, W*0.035)`
  - drawTitle: `W/2, H*0.40`, font `W*0.055`
- 신규 생성 (기존 `preset-shorts-001~005`와 무관)

### preview.jpg — **미생성 (다음 세션 작업)**

- 16x9 intro 50개 + 9x16 intro 50개 = 100개 생성 필요
- 실행 명령: `node popwifi-mv-studio/scripts/generate-preset-previews.js`
- node-canvas 환경에서 실행

---

## 서버 실행

```bash
cd popwifi-mv-studio
npm install
npm run install:browser   # Playwright 최초 1회
npm start                 # http://localhost:3000
```

FFmpeg 시스템 설치 필수. 미설치 시 렌더 실패.

---

## API 주요 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/health` | 서버 상태 |
| GET/PATCH | `/api/config` | 설정 조회/저장 |
| GET | `/api/presets/:ratio` | 프리셋 목록 |
| POST | `/api/presets/import` | 배치 JSON import |
| GET | `/api/render-draft` | 렌더 드래프트 조회 |
| PUT | `/api/render-draft/:kind` | 렌더 드래프트 저장 |
| GET | `/api/queue` | 큐 상태 |
| POST | `/api/queue/from-render-draft/:kind` | 큐 작업 등록 |
| POST | `/api/queue/worker/process-current-capture-mp4` | 캡처 렌더 실행 |
| GET | `/preset-files/:ratio/:batchId/:presetId/preview.jpg` | 프리셋 썸네일 |

---

## 수정된 주요 파일 목록 (이번 세션)

```
popwifi-mv-studio/
  server.js
  server/core/logger.js          (신규)
  server/core/queue-worker.js
  server/routes/config.js
  server/routes/presets.js
  app/pages/queue.html           (신규)
  app/pages/lyrics.html          (신규)
  app/pages/landing.html
  app/pages/settings.html
  app/pages/faq.html
  app/scripts/core/api.js
  app/scripts/core/router.js
  app/scripts/pages/page-init.js
  app/scripts/pages/lyrics.js    (신규)
  app/scripts/pages/landing.js   (신규)
  app/scripts/presets/preset-loader.js
  shared/presets/16x9/batch-001-010/preset-shorts-001/ (신규)
  shared/presets/16x9/batch-001-010/preset-shorts-002/ (신규)
  shared/presets/16x9/batch-001-010/preset-shorts-003/ (신규)
  shared/presets/16x9/batch-001-010/preset-shorts-004/ (신규)
  shared/presets/16x9/batch-001-010/preset-shorts-005/ (신규)
  shared/presets/9x16/batch-001-010/preset-shorts-001/template.js (신규)
  shared/presets/9x16/batch-001-010/preset-shorts-002/template.js (신규)
  shared/presets/9x16/batch-001-010/preset-shorts-003/template.js (신규)
  shared/presets/9x16/batch-001-010/preset-shorts-004/template.js (신규)
  shared/presets/9x16/batch-001-010/preset-shorts-005/template.js (신규)
  shared/presets/*/preview.jpg (12개, 신규)
  scripts/generate-preset-previews.js (신규)
```
