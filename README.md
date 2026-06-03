# AI Report Assistant

## 프로젝트명

바이브 코딩으로 완성하는 보고서 혁신

## 서비스명

모두의 부동산 보고서

## 프로젝트 개요

본 프로젝트는 사용자가 보고서 주제, 지역, 참고 자료 링크, 핵심 이슈, 수치 자료, 주요 사례, 과거 우수 보고서 형식을 입력하면 AI 보고서 작성에 최적화된 변환 프롬프트를 생성하는 웹 기반 업무 어시스턴트입니다.

사용자는 생성된 프롬프트를 ChatGPT 또는 Gemini에 붙여넣어 보고서 초안을 만들고, 이후 웹 화면에서 초안을 수기 수정하거나 목표 분량에 맞춘 글자수 조정 프롬프트를 다시 생성할 수 있습니다.

## 주요 기능

- 보고서 주제 및 분석 대상 입력
- 지역 또는 분석 범위 입력
- 참고 자료 링크 최대 5개 입력
- 핵심 이슈 및 현장 메모 입력
- 수치 자료 및 변동 지표 입력
- 시장 방향성 및 변동률 입력
- 주요 사례 및 근거 자료 입력
- 과거 우수 보고서 참고 내용 최대 3개 입력
- AI 변환 프롬프트 자동 생성 및 복사
- ChatGPT / Gemini 바로 열기
- 보고서 초안 글자수 카운트
- 원문 대비 목표 분량 조정 프롬프트 생성
- 최종 보고서 글자수 카운트 및 복사

## 기술 스택

- HTML5
- Tailwind CSS CDN
- JavaScript
- GitHub Pages

## 파일 구조

```text
ai-report-assistant/
├── index.html
├── script.js
├── README.md
└── assets/
    ├── sample-report.txt
    └── reb-logo.png
```

## 배포 방법

1. GitHub에서 새 저장소를 생성합니다.
2. 아래 파일을 저장소 루트에 업로드합니다.
   - `index.html`
   - `script.js`
   - `README.md`
3. `assets` 폴더를 만들고 아래 파일을 넣습니다.
   - `sample-report.txt`
   - `reb-logo.png`
4. GitHub 저장소의 `Settings` → `Pages`에서 배포 브랜치를 선택합니다.
5. 생성된 GitHub Pages 주소로 접속합니다.

## 주의사항

- `index.html`은 `./script.js`를 불러옵니다. 두 파일은 같은 폴더에 있어야 합니다.
- 로고 이미지는 `assets/reb-logo.png` 경로에 넣어야 화면 상단에 표시됩니다.
- Tailwind CSS와 NanumSquareNeo 폰트는 CDN으로 불러옵니다. 인터넷 연결이 필요합니다.
- 브라우저 정책상 클립보드 복사는 HTTPS 환경 또는 GitHub Pages 배포 환경에서 가장 안정적으로 작동합니다.

## 최근 수정 내용

- 기존 `index.html` 내부의 인라인 JavaScript를 `script.js`로 분리했습니다.
- 글자수 조정 프롬프트에서 사용하지 않는 공백 제외 수치 노출을 제거했습니다.
- 목표 분량 조건에 적용 기준, 원문 기준 분량, 목표 참고 분량, 허용 범위, 허용 비율만 남겨 AI가 계산 기준을 헷갈리지 않도록 정리했습니다.
- 프롬프트 내부의 `{목표분량}`, `{목표비율}` 같은 미치환 placeholder를 실제 JavaScript 변수로 치환되도록 수정했습니다.
