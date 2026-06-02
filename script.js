const generateBtn = document.getElementById("generateBtn");
const copyPromptBtn = document.getElementById("copyPromptBtn");
const makeRevisionBtn = document.getElementById("makeRevisionBtn");
const copyRevisionBtn = document.getElementById("copyRevisionBtn");

const resultPrompt = document.getElementById("resultPrompt");
const revisionPrompt = document.getElementById("revisionPrompt");

const promptMessage = document.getElementById("promptMessage");
const revisionMessage = document.getElementById("revisionMessage");

function getValue(id) {
  const value = document.getElementById(id).value.trim();
  return value || "미입력";
}

function createReportPrompt() {
  const reportTopic = getValue("reportTopic");
  const analysisRegion = getValue("analysisRegion");
  const referenceLinks = getValue("referenceLinks");
  const keyIssues = getValue("keyIssues");
  const numericData = getValue("numericData");
  const majorCases = getValue("majorCases");
  const pastReportFormat = getValue("pastReportFormat");

  return `당신은 공공기관 정책보고서와 행정 보고서 작성에 능숙한 전문 보고서 작성 보조 AI입니다.
아래 입력 정보를 바탕으로 내부 검토용 보고서 초안을 작성해주세요.

[1. 보고서 기본 정보]
- 보고서 주제: ${reportTopic}
- 분석 지역: ${analysisRegion}

[2. 참고 자료]
다음 참고 자료 링크와 내용을 우선적으로 고려해주세요.
${referenceLinks}

[3. 핵심 이슈]
보고서에서 반드시 다루어야 할 핵심 이슈는 다음과 같습니다.
${keyIssues}

[4. 수치 자료]
보고서에 반영해야 할 수치 자료는 다음과 같습니다.
${numericData}

수치 자료를 사용할 때는 다음 기준을 지켜주세요.
- 수치의 의미를 해석해 주세요.
- 단순 나열이 아니라 정책적 시사점을 도출해 주세요.
- 필요한 경우 표로 정리해 주세요.
- 출처가 불명확한 수치는 "제공 자료 기준"이라고 표시해 주세요.

[5. 주요 사례]
보고서에 참고할 주요 사례는 다음과 같습니다.
${majorCases}

사례를 사용할 때는 다음 기준을 지켜주세요.
- 사례의 핵심 내용을 요약해 주세요.
- 분석 지역에 적용 가능한 요소와 한계를 함께 설명해 주세요.
- 단순 소개가 아니라 정책 설계에 주는 시사점을 제시해 주세요.

[6. 과거 우수 보고서 참고 형식]
다음 내용을 보고서의 구성, 문체, 전개 방식에 반영해주세요.
${pastReportFormat}

[7. 작성 요청 사항]
다음 형식으로 보고서 초안을 작성해주세요.

1. 보고서 제목
2. 작성 배경 및 필요성
3. 현황 분석
4. 핵심 이슈 분석
5. 수치 자료 기반 시사점
6. 주요 사례 검토
7. 정책적 시사점
8. 추진 방향 또는 개선 방안
9. 기대 효과
10. 결론
11. 필요 시 표 또는 목록 형태의 요약

[8. 작성 스타일]
- 공공기관 내부 보고서에 적합한 공식적이고 간결한 문체로 작성해주세요.
- 과장된 표현은 피하고, 근거 중심으로 작성해주세요.
- 문단마다 핵심 메시지가 분명하게 드러나게 작성해주세요.
- 정책 담당자가 바로 검토할 수 있도록 구조화해주세요.
- 불확실한 내용은 단정하지 말고 "추가 확인 필요", "검토 필요" 등으로 표시해주세요.

[9. 추가 요청]
마지막에는 다음 항목을 별도로 정리해주세요.
- 보고서 보완을 위해 추가로 필요한 자료
- 표나 그래프로 만들면 좋은 수치 자료
- 정책 담당자가 검토해야 할 쟁점
- 보고서 제목 후보 3개`;
}

function createRevisionPrompt() {
  const draftText = getValue("draftText");
  const revisionRequest = getValue("revisionRequest");

  return `당신은 공공기관 내부 보고서의 품질을 개선하는 전문 검토자입니다.
아래 보고서 초안을 검토하고, 수정 요청 사항을 반영하여 더 완성도 높은 보고서로 다듬어주세요.

[1. 보고서 초안]
${draftText}

[2. 수정 요청 사항]
${revisionRequest}

[3. 수정 기준]
- 공공기관 내부 보고서에 적합한 공식적이고 간결한 문체로 수정해주세요.
- 문장이 장황한 부분은 간결하게 정리해주세요.
- 근거가 부족한 표현은 보완하거나 "추가 확인 필요"로 표시해주세요.
- 핵심 이슈, 정책적 시사점, 개선 방안이 잘 드러나도록 구조를 정리해주세요.
- 필요하면 제목, 소제목, 표, 목록 형태를 활용해주세요.
- 과장된 표현이나 단정적인 표현은 피해주세요.
- 담당자가 바로 검토할 수 있도록 보고서 형식으로 정리해주세요.

[4. 결과물 형식]
다음 순서로 작성해주세요.

1. 수정된 보고서 초안
2. 주요 수정 사항 요약
3. 추가 보완이 필요한 자료
4. 검토자가 확인해야 할 쟁점`;
}

async function copyText(textArea, messageElement, successMessage, emptyMessage) {
  const text = textArea.value.trim();

  if (!text) {
    messageElement.textContent = emptyMessage;
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    messageElement.textContent = successMessage;
  } catch (error) {
    textArea.select();
    document.execCommand("copy");
    messageElement.textContent = successMessage;
  }
}

generateBtn.addEventListener("click", () => {
  resultPrompt.value = createReportPrompt();
  promptMessage.textContent = "AI 보고서 작성용 프롬프트가 생성되었습니다.";
});

copyPromptBtn.addEventListener("click", () => {
  copyText(
    resultPrompt,
    promptMessage,
    "AI 보고서 작성용 프롬프트가 복사되었습니다.",
    "복사할 프롬프트가 없습니다. 먼저 프롬프트를 생성해주세요."
  );
});

makeRevisionBtn.addEventListener("click", () => {
  revisionPrompt.value = createRevisionPrompt();
  revisionMessage.textContent = "보고서 초안 수정용 프롬프트가 생성되었습니다.";
});

copyRevisionBtn.addEventListener("click", () => {
  copyText(
    revisionPrompt,
    revisionMessage,
    "보고서 초안 수정용 프롬프트가 복사되었습니다.",
    "복사할 수정 프롬프트가 없습니다. 먼저 수정 프롬프트를 생성해주세요."
  );
});
