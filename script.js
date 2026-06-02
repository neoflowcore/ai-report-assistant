const generateBtn = document.getElementById("generateBtn");
const copyPromptBtn = document.getElementById("copyPromptBtn");
const openChatGPTBtn = document.getElementById("openChatGPTBtn");
const openGeminiBtn = document.getElementById("openGeminiBtn");
const makeRevisionBtn = document.getElementById("makeRevisionBtn");
const copyRevisionBtn = document.getElementById("copyRevisionBtn");

const resultPrompt = document.getElementById("resultPrompt");
const revisionPrompt = document.getElementById("revisionPrompt");

const promptMessage = document.getElementById("promptMessage");
const revisionMessage = document.getElementById("revisionMessage");

function getValue(id) {
  const element = document.getElementById(id);
  const value = element ? element.value.trim() : "";
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

  return `당신은 공공기관 정책보고서, 행정보고서, 검토보고서 작성에 능숙한 전문 보고서 작성 보조 AI입니다.
아래 입력 자료를 바탕으로 사용자가 바로 보고서 초안으로 활용할 수 있는 본문 중심의 보고서를 작성해주세요.

중요한 작업 원칙은 다음과 같습니다.

1. 과거 우수 보고서 참고 내용은 문장을 그대로 복사하지 말고, 제목 구조, 목차 구성, 문체, 문단 흐름, 수치 제시 방식, 결론 도출 방식만 분석하여 참고해주세요.
2. 새 보고서의 주제, 지역, 참고 자료, 핵심 이슈, 수치 자료, 주요 사례를 참고 보고서의 형식과 논리 구조에 맞게 재구성해주세요.
3. 참고 보고서와 유사한 문장, 표현, 문단을 그대로 재사용하지 마세요.
4. 자료가 부족하거나 근거가 불명확한 내용은 임의로 만들지 말고 반드시 "추가 확인 필요"라고 표시해주세요.
5. 최종 출력은 설명문이나 작성 과정이 아니라, 실제 보고서 초안으로 바로 활용할 수 있는 본문 중심으로 작성해주세요.

────────────────────────
[1. 보고서 주제]
${reportTopic}

[2. 분석 지역]
${analysisRegion}

[3. 참고 자료 및 링크]
${referenceLinks}

[4. 핵심 이슈]
${keyIssues}

[5. 수치 자료]
${numericData}

[6. 주요 사례]
${majorCases}

[7. 과거 우수 보고서 참고 내용]
${pastReportFormat}
────────────────────────

다음 순서에 따라 보고서를 작성해주세요.

[1단계. 과거 우수 보고서 형식 분석]
먼저 과거 우수 보고서 참고 내용을 내부적으로 분석해주세요.
단, 분석 결과를 장황하게 따로 출력하지 말고 최종 보고서 구조에 반영해주세요.

분석해야 할 항목은 다음과 같습니다.
- 제목 구조: 제목이 문제 제기형인지, 정책 제안형인지, 현황 분석형인지 파악
- 목차 구성: 배경, 현황, 문제점, 사례, 시사점, 개선방안, 결론의 배열 방식 파악
- 문체: 공공기관 보고서에 적합한 공식성, 간결성, 객관성 수준 파악
- 문단 흐름: 문제 제기 → 근거 제시 → 해석 → 정책적 시사점 → 대안 제시 흐름 파악
- 수치 제시 방식: 통계, 비율, 증감, 비교, 표 활용 방식 파악
- 결론 도출 방식: 단순 요약형인지, 정책 방향 제시형인지, 실행 과제 제안형인지 파악

[2단계. 새 입력 자료 재구성]
아래 입력 자료를 각각 구분해서 반영해주세요.

- 보고서 주제는 전체 보고서의 문제의식과 제목에 반영
- 분석 지역은 현황 분석, 지역 특성, 정책 적용 가능성에 반영
- 참고 자료와 링크는 근거 자료로 활용
- 핵심 이슈는 보고서의 문제점 및 쟁점 분석에 반영
- 수치 자료는 현황 분석과 정책적 시사점 도출에 반영
- 주요 사례는 비교 사례 또는 벤치마킹 사례로 반영
- 과거 우수 보고서 참고 내용은 형식과 논리 전개 방식에만 반영

[3단계. 수치 자료 표현 방식]
수치 자료는 단순히 나열하지 말고 보고서 문장 안에서 자연스럽게 해석해주세요.

수치 자료를 다룰 때는 다음 기준을 적용해주세요.
- 증가, 상승, 확대, 개선, 감소, 하락, 축소, 악화, 보합 등 방향성을 판단할 수 있으면 문장에 반영
- 두 개 이상의 시점이나 비교 대상이 있으면 변화 추세를 해석
- 단일 수치만 있는 경우에는 무리하게 추세를 만들지 말고 현재 수준 중심으로 설명
- 방향성을 판단할 근거가 부족하면 "방향성 추가 확인 필요"라고 표시
- 출처가 명확하지 않은 수치는 "제공 자료 기준"이라고 표시
- 필요한 경우 표로 정리하되, 표 이후에는 반드시 정책적 의미를 문장으로 해석

예시 표현 방식은 다음과 같습니다.
- "최근 5년간 ○○ 지표는 증가세를 보이고 있어, 해당 지역의 정책 수요가 확대되고 있는 것으로 판단된다."
- "반면 ○○ 수치는 감소하는 흐름을 보여 기존 정책의 실효성 점검이 필요한 상황이다."
- "제공된 자료만으로는 증감 방향을 판단하기 어려우므로 추가 확인이 필요하다."

[4단계. 주요 사례 반영 방식]
주요 사례는 단순 소개가 아니라 다음 방식으로 정리해주세요.
- 사례의 핵심 내용 요약
- 분석 지역에 적용 가능한 요소 도출
- 그대로 적용하기 어려운 한계 제시
- 해당 사례가 보고서 주제에 주는 정책적 시사점 정리

[5단계. 작성 스타일]
보고서는 다음 스타일로 작성해주세요.
- 공공기관 내부 보고서에 적합한 공식적이고 객관적인 문체
- 과장된 표현보다 근거 중심의 표현 사용
- 문단마다 핵심 메시지가 분명하게 드러나도록 작성
- 개조식과 서술식을 적절히 혼합
- 정책 담당자가 검토하기 쉬운 구조로 작성
- 불확실한 내용은 단정하지 않고 "추가 확인 필요", "검토 필요"로 표시

[6단계. 최종 보고서 출력 형식]
최종 결과물은 아래 형식을 기본으로 하되, 과거 우수 보고서의 구조가 더 적합하다고 판단되면 그 형식에 맞게 조정해주세요.

1. 보고서 제목

2. 작성 배경 및 필요성
- 보고서 주제와 관련된 문제의식을 제시
- 분석 지역에서 해당 주제가 중요한 이유 설명
- 참고 자료와 핵심 이슈를 바탕으로 정책 검토 필요성 제시

3. 현황 분석
- 분석 지역의 현재 상황 정리
- 제공된 수치 자료를 활용해 변화 방향, 수준, 특징 설명
- 수치 자료가 부족한 부분은 "추가 확인 필요"로 표시

4. 핵심 이슈 및 문제점
- 입력된 핵심 이슈를 중심으로 주요 쟁점 정리
- 각 이슈가 지역에 미치는 영향 설명
- 원인, 영향, 검토 필요 사항을 구분하여 작성

5. 수치 자료 기반 시사점
- 수치 자료를 단순 나열하지 말고 정책적 의미로 해석
- 상승, 하락, 보합 등 방향성을 반영
- 판단 근거가 부족한 경우 "방향성 추가 확인 필요"로 표시

6. 주요 사례 검토
- 주요 사례의 핵심 내용 정리
- 분석 지역에 적용 가능한 요소 제시
- 적용상 한계와 유의점 제시

7. 정책적 시사점
- 현황, 이슈, 수치, 사례를 종합하여 시사점 도출
- 단순 요약이 아니라 정책 판단에 필요한 의미 중심으로 작성

8. 추진 방향 및 개선 방안
- 실무적으로 검토 가능한 개선 방향 제시
- 단기 과제와 중장기 과제를 구분할 수 있으면 구분
- 예산, 조직, 제도, 협력체계 등 추가 검토가 필요한 부분 표시

9. 기대 효과
- 정책 추진 시 예상되는 효과를 객관적으로 작성
- 수치 근거가 부족한 효과는 단정하지 말고 "추가 검토 필요"로 표시

10. 결론
- 전체 내용을 종합하여 보고서의 핵심 메시지 제시
- 향후 검토 또는 의사결정이 필요한 사항 정리

11. 추가 확인 필요 자료
- 보고서 완성도를 높이기 위해 추가로 필요한 통계, 사례, 법령, 예산, 사업 자료를 목록으로 정리

[7단계. 금지 사항]
다음 사항은 하지 마세요.
- 참고 보고서의 문장을 그대로 복사하지 마세요.
- 제공되지 않은 수치나 사례를 임의로 만들지 마세요.
- 근거 없는 정책 효과를 단정하지 마세요.
- 자료가 부족한 부분을 추측으로 채우지 마세요.
- 최종 결과 앞에 "아래는 보고서 초안입니다" 같은 불필요한 설명을 길게 붙이지 마세요.

위 기준에 따라 바로 활용 가능한 보고서 초안을 작성해주세요.`;
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

function showMessage(messageElement, message, type) {
  if (!messageElement) return;

  messageElement.textContent = message;
  messageElement.classList.remove("success", "error");

  if (type) {
    messageElement.classList.add(type);
  }
}

function fallbackCopy(textArea) {
  try {
    if (!textArea) return false;

    const wasReadonly = textArea.hasAttribute("readonly");

    if (wasReadonly) {
      textArea.removeAttribute("readonly");
    }

    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);

    const copied = document.execCommand("copy");

    if (wasReadonly) {
      textArea.setAttribute("readonly", true);
    }

    window.getSelection().removeAllRanges();

    return copied;
  } catch (error) {
    if (textArea) {
      textArea.setAttribute("readonly", true);
    }

    return false;
  }
}

async function copyText(textArea, messageElement, successMessage, emptyMessage) {
  const text = textArea ? textArea.value.trim() : "";

  if (!text) {
    showMessage(messageElement, emptyMessage, "error");
    return false;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      showMessage(messageElement, successMessage, "success");
      return true;
    }

    const copied = fallbackCopy(textArea);

    if (copied) {
      showMessage(messageElement, successMessage, "success");
      return true;
    }

    showMessage(
      messageElement,
      "자동 복사에 실패했습니다. 프롬프트 영역을 직접 선택해 복사해주세요.",
      "error"
    );

    return false;
  } catch (error) {
    const copied = fallbackCopy(textArea);

    if (copied) {
      showMessage(messageElement, successMessage, "success");
      return true;
    }

    showMessage(
      messageElement,
      "브라우저 보안 설정으로 자동 복사에 실패했습니다. 프롬프트 영역을 직접 선택해 복사해주세요.",
      "error"
    );

    return false;
  }
}

generateBtn.addEventListener("click", () => {
  resultPrompt.value = createReportPrompt();
  showMessage(
    promptMessage,
    "AI 보고서 작성용 프롬프트가 생성되었습니다.",
    "success"
  );
});

copyPromptBtn.addEventListener("click", () => {
  copyText(
    resultPrompt,
    promptMessage,
    "AI 보고서 작성용 프롬프트가 복사되었습니다.",
    "복사할 프롬프트가 없습니다. 먼저 프롬프트를 생성해주세요."
  );
});

openChatGPTBtn.addEventListener("click", async () => {
  const copied = await copyText(
    resultPrompt,
    promptMessage,
    "프롬프트가 복사되었습니다. ChatGPT를 새 창으로 엽니다.",
    "복사할 프롬프트가 없습니다. 먼저 프롬프트를 생성해주세요."
  );

  if (copied) {
    window.open("https://chatgpt.com/", "_blank");
  }
});

openGeminiBtn.addEventListener("click", async () => {
  const copied = await copyText(
    resultPrompt,
    promptMessage,
    "프롬프트가 복사되었습니다. Gemini를 새 창으로 엽니다.",
    "복사할 프롬프트가 없습니다. 먼저 프롬프트를 생성해주세요."
  );

  if (copied) {
    window.open("https://gemini.google.com/app", "_blank");
  }
});

makeRevisionBtn.addEventListener("click", () => {
  revisionPrompt.value = createRevisionPrompt();
  showMessage(
    revisionMessage,
    "보고서 초안 수정용 프롬프트가 생성되었습니다.",
    "success"
  );
});

copyRevisionBtn.addEventListener("click", () => {
  copyText(
    revisionPrompt,
    revisionMessage,
    "보고서 초안 수정용 프롬프트가 복사되었습니다.",
    "복사할 수정 프롬프트가 없습니다. 먼저 수정 프롬프트를 생성해주세요."
  );
});
