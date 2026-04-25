# Pop WiFi MV Studio — Current Progress and Next Steps

최초 작성: 2026-04-25
마지막 갱신: 2026-04-25 (2차 개발 세션 반영)

---

## 1. 현재 확정된 개발 기준

- Pop WiFi MV Studio는 PC 중심 제작 스튜디오다.
- 모바일은 제작 중심이 아니라 확인/검수용이다.
- 원페이지 개발은 금지한다.
- 하나의 앱 안에서 페이지/모듈을 분리한다.
- 숏츠 프리셋은 디자인 기준 원형이다.
- 롱폼 16:9 프리셋은 숏츠 프리셋을 기반으로 재설계한다.
- 숏츠 프리셋을 단순 확대/복사해서 롱폼에 적용하면 실패다.
- 프리셋은 쉽게 추가/삭제/비활성화할 수 있어야 한다.
- FAQ 페이지를 만들어 전체 구조와 프리셋 제작법을 문서화한다.

---

## 2. 완료된 문서

```text
CLAUDE.md                                        ← 개발 기준·진행률·다음작업 (루트)
docs/CURRENT_PROGRESS_AND_NEXT_STEPS.md          ← 이 파일
docs/POPWIFI_MV_STUDIO_HANDOFF_2026-04-25.md
docs/POPWIFI_MV_STUDIO_FAQ.md
docs/PC_FIRST_ARCHITECTURE_PLAN.md
docs/SHORTS_TO_LONGFORM_REDESIGN_RULES.md
docs/PRESET_AUTHORING_GUIDE.md
popwifi-mv-studio/docs/                          ← 렌더·프리셋 상세 스펙
```

---

## 3. 완료된 작업 (전체)

### 기획/구조 (완료)
- PC 중심 개발 기준 확정
- 모듈형 8페이지 구조 확정 (프로젝트/롱폼/숏츠/가사/랜딩/FAQ/설정/큐)
- 숏츠→롱폼 재설계 원칙 확정

### 서버/보안 (완료)
- Express 서버, WebSocket, 큐 시스템 구현
- XSS 패치 — router.js innerHTML → DOMParser
- 포트 전체 통일 (3000)
- Preset API 입력 검증 (whitelist regex)
- 큐 파일 손상 시 서버 크래시 방지 (try/catch)
- localhost CORS 제한
- 구조화 로거 (logger.js)
- 설정 저장 API (PATCH /api/config)
- 프리셋 배치 import API (POST /api/presets/import)

### 페이지 구현 (완료)
- project.html — 프로젝트 생성, 최근 렌더 결과
- longform.html — 16:9 프리셋 목록, 프리뷰, 렌더 패널
- shorts.html — 9:16 프리셋 목록, 프리뷰, 렌더 패널
- queue.html — 큐 상태 (진행중/대기/완료/실패), WebSocket sync
- lyrics.html + lyrics.js — 가사 입력 → 타임코드 마킹 → sync.json 다운로드
- landing.html + landing.js — 종류·시간 선택 → 테스트 렌더 → 인라인 비디오 프리뷰
- faq.html — 전체 흐름, 프리셋 구조, 추가/비활성화/삭제, 롱폼 재설계 규칙, 문제 해결
- settings.html — FFmpeg/출력경로 설정 저장, 프리셋 배치 가져오기

### 프리셋 (완료)
- 9x16 숏츠 프리셋 6종 (moon-dust-window + 001~005)
- 16x9 롱폼 재설계 6종 — 각각 실제 좌표·구도 재설계, 단순 확대 없음
  - moon-dust-window, Neon Box, Slide Frame, Draw Frame, Twist Box, Minimal Line
- 각 프리셋: config.json + template.js + README.md
- sourceRole/sourcePreset 추적 필드 포함
- 프리셋 이미지 미리보기 — /preset-files 정적 경로, preset-thumb img 태그

### 렌더 시스템 (부분 완료)
- Playwright 기반 HTML 캡처 렌더링 구현
- FFmpeg 프레임 조립 구현
- 큐 등록 → 시작 → 처리 → 완료/실패 플로우 구현
- WebSocket 실시간 진행률 전송
- durationSeconds 옵션으로 30초/60초 테스트 렌더 지원

---

## 4. 남은 작업

### 우선순위 높음

- [ ] **preview.jpg 생성** — 각 프리셋 썸네일. 캡처 스크립트(`npm run capture:intro-screenshot`) 또는 수동 추가
- [ ] **렌더 파이프라인 end-to-end 테스트** — FFmpeg 설치 환경에서 실제 실행 검증
- [ ] **음원/이미지 파일 연결 UI** — 프로젝트 페이지에서 파일 선택 및 렌더 잡에 연결

### 우선순위 중간

- [ ] **큐 페이지 동적 렌더링** — currentJob/pending/completed 항목을 카드로 표시 (현재 raw JSON)
- [ ] **폰트 관리 기능** — Settings 폰트 새로고침 실제 구현
- [ ] **Whisper 연동** — 가사 자동 타임코드 싱크 (현재 수동 마킹만)
- [ ] **랜딩 비디오 재생 실제 확인** — 렌더 결과 mp4가 `<video>` 태그에 정상 표시되는지 검증

### 우선순위 낮음

- [ ] 프리셋 일괄 비활성화/복원 UI
- [ ] 인증/토큰 (현재 localhost CORS만)
- [ ] 에러 로그 파일 저장 구조

---

## 5. 진행률

| 영역 | 1차 세션 전 | 현재 |
|------|------------|------|
| 기획/구조 | 90% | **100%** |
| 문서화 | 80% | **95%** |
| 코드 구현 (페이지/API) | 0% | **70%** |
| 프리셋 이식 (config+template) | 0% | **70%** |
| 렌더 시스템 | 0% | **40%** |
| 테스트/안정화 | 0% | **10%** |
| **전체** | **12%** | **~55%** |

---

## 6. 서버 실행

```bash
cd popwifi-mv-studio
npm install
npm run install:browser   # Playwright 최초 1회
npm start                 # http://localhost:3000
```

FFmpeg 시스템 설치 필수 (`ffmpeg` 명령이 PATH에 있어야 함).

---

## 7. 최종 목표 흐름

```
프로젝트 생성
→ 음원/이미지/가사 연결        ← 미구현
→ 숏츠 또는 롱폼 프리셋 선택  ✅
→ 가사 마킹                   ✅
→ 720p 랜딩 검수              ✅
→ 최종 렌더 큐 등록            ✅
→ FFmpeg 출력                 ✅ (미테스트)
→ 결과 확인                   ✅
```

모바일은 결과 확인 및 숏츠 화면 검수용 보조 화면으로 유지한다.
