# Pop WiFi MV Studio — Preset Batch Rules

작성일: 2026-04-25
상태: 개발 기준 확정

---

## 1. 핵심 원칙

프리셋은 한 페이지/한 파일/한 폴더에 무한히 쌓지 않는다.

프리셋 수가 많아질수록 코드 꼬임, 수정 난이도 증가, 로딩 문제, Codex 작업 오류가 발생할 수 있으므로 반드시 10개 단위 배치로 관리한다.

---

## 2. 배치 단위

프리셋은 10개 단위로 묶는다.

```text
batch-001-010
batch-011-020
batch-021-030
batch-031-040
batch-041-050
batch-051-060
```

숏츠와 롱폼 모두 같은 배치 규칙을 사용한다.

---

## 3. 폴더 구조

```text
shared/presets/
  9x16/
    batch-001-010/
      moon-dust-window/
        config.json
        template.js
        preview.jpg
        README.md

  16x9/
    batch-001-010/
      moon-dust-window/
        config.json
        template.js
        preview.jpg
        README.md
```

---

## 4. 금지 사항

- 50개 프리셋을 한 JS 파일에 몰아넣기 금지
- 50개 프리셋을 한 HTML 페이지에 직접 작성 금지
- 모든 프리셋 데이터를 app.js에 넣기 금지
- 프리셋 batch를 무시하고 직접 shared/presets/16x9 아래에 계속 추가 금지
- 기존 안정 batch를 직접 크게 수정 금지

---

## 5. 배치별 책임

각 batch는 자기 안의 10개 프리셋만 관리한다.

예:

```text
batch-001-010: 1~10번 프리셋
batch-011-020: 11~20번 프리셋
batch-021-030: 21~30번 프리셋
```

수정할 때는 해당 batch만 열고 수정한다.

---

## 6. 프론트 표시 방식

프리셋 페이지는 기본적으로 batch 선택 UI를 먼저 보여준다.

예:

```text
[001~010] [011~020] [021~030] [031~040]
```

배치를 선택하면 해당 배치의 10개 프리셋만 표시한다.

---

## 7. API 기준

필수 API:

```text
GET /api/presets/:ratio/batches
GET /api/presets/:ratio/batch/:batchId
GET /api/presets/:ratio/batch/:batchId/:presetId
PATCH /api/presets/:ratio/batch/:batchId/:presetId/deactivate
```

기존 전체 목록 API는 유지하되, UI에서는 batch API를 우선 사용한다.

---

## 8. 개발 진행률 기준

문서화는 개발 진행률에 포함하지 않는다.

이 규칙을 코드 구조에 반영해야 실제 개발 완료로 본다.
