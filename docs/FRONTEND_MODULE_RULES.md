# Pop WiFi MV Studio — Frontend Module Rules

작성일: 2026-04-25
상태: 개발 기준 확정

---

## 1. 핵심 원칙

프론트엔드 JavaScript는 단일 거대 app.js로 만들지 않는다.

기존 작업에서 app.js가 2MB 이상 커진 경험이 있으므로, 앞으로는 기능별 모듈 분리를 필수 기준으로 한다.

---

## 2. 금지 사항

다음은 금지한다.

- app.js에 모든 기능 몰아넣기
- 페이지별 로직을 한 파일에 누적하기
- 프리셋 데이터를 app.js에 직접 삽입하기
- 긴 SVG/애니메이션/프리셋 코드를 공통 JS에 직접 작성하기
- 임시 함수가 쌓여 1MB 이상 커지는 구조 방치
- 중복 함수명/중복 selector/중복 상태 전달 구조 만들기

---

## 3. app.js 역할

app.js는 얇은 부트스트랩 파일로 유지한다.

허용 역할:

- 초기 모듈 import
- 서버 상태 확인 호출
- WebSocket 연결 호출
- Router 생성
- 첫 페이지 진입

금지 역할:

- 페이지별 UI 직접 제어
- 프리셋 렌더링 직접 처리
- 대량 데이터 포함
- 긴 HTML 문자열 포함

---

## 4. 권장 폴더 구조

```text
app/scripts/
  app.js                 # 얇은 부트스트랩

  core/
    api.js               # API 호출
    router.js            # 페이지 라우팅 / HTML 로딩
    socket.js            # WebSocket 연결
    state.js             # 공통 상태

  pages/
    page-init.js         # 페이지 진입 후 초기화 분배
    project.js           # 프로젝트 페이지 전용 로직
    longform.js          # 롱폼 프리셋 페이지 전용 로직
    shorts.js            # 숏츠 프리셋 페이지 전용 로직
    lyrics.js            # 가사 마킹 페이지 전용 로직
    landing.js           # 랜딩 검수 페이지 전용 로직
    queue.js             # 렌더 큐 페이지 전용 로직
    settings.js          # 설정 페이지 전용 로직
    faq.js               # FAQ 페이지 전용 로직

  presets/
    preset-loader.js     # 프리셋 목록/프리뷰 관리
    preset-admin.js      # 추가/삭제/비활성화 관리
```

---

## 5. 파일 크기 기준

권장 크기:

- app.js: 5KB 이하
- core 모듈: 파일당 20KB 이하
- page 모듈: 파일당 30KB 이하
- preset 관련 모듈: 파일당 50KB 이하

50KB를 넘으면 기능을 다시 분리한다.

100KB 이상 파일은 구조 점검 대상이다.

---

## 6. 프리셋 코드 분리

프리셋은 app.js 또는 page JS에 넣지 않는다.

프리셋은 반드시 아래 구조로 분리한다.

```text
shared/presets/16x9/preset-name/template.js
shared/presets/9x16/preset-name/template.js
```

프론트는 프리셋 목록과 preview만 불러온다.
실제 렌더 template.js는 서버/렌더러가 사용한다.

---

## 7. 페이지 HTML 분리

각 페이지는 app/index.html 안에 직접 쓰지 않는다.

```text
app/pages/project.html
app/pages/longform.html
app/pages/shorts.html
app/pages/lyrics.html
app/pages/landing.html
app/pages/queue.html
app/pages/settings.html
app/pages/faq.html
```

index.html은 shell만 가진다.

---

## 8. 현재 적용 상태

현재 적용 완료:

- index.html을 shell 구조로 축소
- app.js를 ES module로 전환
- core/state.js 추가
- core/api.js 추가
- core/router.js 추가
- core/socket.js 추가
- pages/page-init.js 추가
- app.js를 얇은 부트스트랩으로 축소

---

## 9. 개발 진행률 반영

문서화는 개발 진행률에 포함하지 않는다.

실제 개발 기준 현재 완료:

- 서버 스캐폴드
- PC 앱 shell
- 페이지 HTML 모듈 로딩
- 프론트 JS 모듈화 기초
- 프리셋 목록 API 기초

실제 개발 진행률: 약 8~10%
