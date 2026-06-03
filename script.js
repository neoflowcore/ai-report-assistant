const MAX_SOURCE_LINKS = 5;
const MAX_SAMPLE_REPORTS = 3;

const CHATGPT_URL = "https://chatgpt.com/";
const GEMINI_URL = "https://gemini.google.com/app";

const sourceLinksContainer = document.getElementById("sourceLinksContainer");
const sampleReportsContainer = document.getElementById("sampleReportsContainer");

const addSourceLinkBtn = document.getElementById("addSourceLinkBtn");
const addSampleReportBtn = document.getElementById("addSampleReportBtn");

const copyPromptOnlyBtn = document.getElementById("copyPromptOnlyBtn");
const openChatGptBtn = document.getElementById("openChatGptBtn");
const openGeminiBtn = document.getElementById("openGeminiBtn");

const copyStatusMessage = document.getElementById("copyStatusMessage");

const finalReportInput = document.getElementById("finalReportInput");
const finalReportBox = document.getElementById("finalReportBox");
const copyFinalReportBtn = document.getElementById("copyFinalReportBtn");

const draftCountWithSpace = document.getElementById("draftCountWithSpace");
const draftCountWithoutSpace = document.getElementById("draftCountWithoutSpace");

const finalCountWithSpace = document.getElementById("finalCountWithSpace");
const finalCountWithoutSpace = document.getElementById("finalCountWithoutSpace");

const targetLengthInput = document.getElementById("targetLengthInput");
const lengthBasisSelect = document.getElementById("lengthBasisSelect");

const copyAdjustPromptBtn = document.getElementById("copyAdjustPromptBtn");
const openAdjustChatGptBtn = document.getElementById("openAdjustChatGptBtn");
const openAdjustGeminiBtn = document.getElementById("openAdjustGeminiBtn");

const adjustPromptStatusMessage = document.getElementById("adjustPromptStatusMessage");

const trendDirectionSelect = document.getElementById("trendDirectionSelect");
const trendRateInput = document.getElementById("trendRateInput");
const trendSignLabel = document.getElementById("trendSignLabel");
const trendPreviewText = document.getElementById("trendPreviewText");

let latestPrompt = "";

function createSourceLinkInput(index) {
  const wrapper = document.createElement("div");
  wrapper.className = "source-link-row flex gap-2 items-start";

  wrapper.innerHTML = `
    <input
      type="text"
      class="source-link-input flex-1 border rounded-xl p-3"
      placeholder="뉴스 기사 또는 유튜브 영상 링크 ${index} 입력"
    />

    <button
      type="button"
      class="remove-source-link-btn shrink-0 px-3 py-3 rounded-xl border text-sm font-semibold text-red-600 hover:bg-red-50"
    >
      삭제
    </button>
  `;

  return wrapper;
}

function createSampleReportInput(index) {
  const wrapper = document.createElement("div");
  wrapper.className = "sample-report-row bg-white border border-indigo-200 rounded-xl p-4 space-y-2";

  wrapper.innerHTML = `
    <div class="flex items-center justify-between">
      <p class="sample-report-title text-sm font-bold text-indigo-700">
        참고 보고서 ${index}
      </p>

      <button
        type="button"
        class="remove-sample-report-btn px-3 py-1 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50"
      >
        삭제
      </button>
    </div>

    <textarea
      class="sample-report-input w-full h-40 border border-indigo-100 bg-indigo-50/40 rounded-xl p-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-300"
      placeholder="참고 보고서 ${index} 내용을 입력하세요. 목차, 문체, 문단 흐름, 수치 제시 방식, 사례 정리 방식, 결론 도출 방식이 드러나도록 붙여넣으면 좋습니다."
    ></textarea>
  `;

  return wrapper;
}

function addSourceLinkInput() {
  const currentCount = sourceLinksContainer.querySelectorAll(".source-link-row").length;

  if (currentCount >= MAX_SOURCE_LINKS) {
    alert("참고 자료 링크는 최대 5개까지 입력할 수 있습니다.");
    return;
  }

  sourceLinksContainer.appendChild(createSourceLinkInput(currentCount + 1));
  refreshDynamicInputs();
}

function addSampleReportInput() {
  const currentCount = sampleReportsContainer.querySelectorAll(".sample-report-row").length;

  if (currentCount >= MAX_SAMPLE_REPORTS) {
    alert("참고 보고서는 최대 3개까지 입력할 수 있습니다.");
    return;
  }

  sampleReportsContainer.appendChild(createSampleReportInput(currentCount + 1));
  refreshDynamicInputs();
}

function removeSourceLinkInput(button) {
  const rows = sourceLinksContainer.querySelectorAll(".source-link-row");

  if (rows.length <= 1) {
    alert("참고 자료 링크 입력칸은 최소 1개가 필요합니다.");
    return;
  }

  button.closest(".source-link-row").remove();
  refreshDynamicInputs();
}

function removeSampleReportInput(button) {
  const rows = sampleReportsContainer.querySelectorAll(".sample-report-row");

  if (rows.length <= 1) {
    alert("참고 보고서 입력칸은 최소 1개가 필요합니다.");
    return;
  }

  button.closest(".sample-report-row").remove();
  refreshDynamicInputs();
}

function refreshDynamicInputs() {
  const sourceRows = sourceLinksContainer.querySelectorAll(".source-link-row");
  const sampleRows = sampleReportsContainer.querySelectorAll(".sample-report-row");

  sourceRows.forEach((row, index) => {
    const input = row.querySelector(".source-link-input");
    const removeBtn = row.querySelector(".remove-source-link-btn");

    input.placeholder = `뉴스 기사 또는 유튜브 영상 링크 ${index + 1} 입력`;

    if (sourceRows.length === 1) {
      removeBtn.classList.add("hidden");
    } else {
      removeBtn.classList.remove("hidden");
    }
  });

  sampleRows.forEach((row, index) => {
    const title = row.querySelector(".sample-report-title");
    const textarea = row.querySelector(".sample-report-input");
    const removeBtn = row.querySelector(".remove-sample-report-btn");

    title.textContent = `참고 보고서 ${index + 1}`;
    textarea.placeholder = `참고 보고서 ${index + 1} 내용을 입력하세요. 목차, 문체, 문단 흐름, 수치 제시 방식, 사례 정리 방식, 결론 도출 방식이 드러나도록 붙여넣으면 좋습니다.`;

    if (sampleRows.length === 1) {
      removeBtn.classList.add("hidden");
    } else {
      removeBtn.classList.remove("hidden");
    }
  });

  addSourceLinkBtn.disabled = sourceRows.length >= MAX_SOURCE_LINKS;
  addSampleReportBtn.disabled = sampleRows.length >= MAX_SAMPLE_REPORTS;
}

function collectValues(selector) {
  return Array.from(document.querySelectorAll(selector))
    .map((element) => element.value.trim())
    .filter((value) => value.length > 0);
}

function formatNumberedList(items, emptyMessage) {
  if (!items.length) {
    return emptyMessage;
  }

  return items
    .map((item, index) => `${index + 1}. ${item}`)
    .join("\n");
}

function getTrendSign(direction) {
  if (direction === "상승" || direction === "급상승") {
    return "+";
  }

  if (direction === "하락" || direction === "급락") {
    return "-";
  }

  return "±";
}

function getTrendExpression(direction, rate) {
  const sign = getTrendSign(direction);

  if (!rate) {
    if (direction === "보합") {
      return "보합(0.00%) 또는 제한적 변동";
    }

    return `${direction}(변동률 별도 입력 없음)`;
  }

  const numberRate = Number(rate);
  const formattedRate = Number.isNaN(numberRate)
    ? rate
    : numberRate.toFixed(2);

  if (direction === "보합") {
    return `보합(${formattedRate}%)`;
  }

  return `${direction}(${sign}${formattedRate}%)`;
}

function getTrendReportPhrase(direction, rate) {
  const expression = getTrendExpression(direction, rate);

  if (direction === "급상승") {
    return `${expression}으로 나타나 상승폭이 크게 확대된 흐름으로 정리할 수 있음.`;
  }

  if (direction === "상승") {
    return `${expression}으로 나타나 상승세 또는 상승폭 확대 여부를 중심으로 검토할 필요가 있음.`;
  }

  if (direction === "보합") {
    return `${expression}으로 나타나 가격 흐름은 보합권 또는 제한적 변동 수준으로 판단할 수 있음.`;
  }

  if (direction === "하락") {
    return `${expression}으로 나타나 하락세 또는 하락폭 확대·축소 여부를 중심으로 검토할 필요가 있음.`;
  }

  if (direction === "급락") {
    return `${expression}으로 나타나 하락폭이 크게 확대된 흐름으로 정리할 수 있음.`;
  }

  return expression;
}

function updateTrendPreview() {
  const direction = trendDirectionSelect.value;
  const rate = trendRateInput.value.trim();

  const sign = getTrendSign(direction);
  trendSignLabel.textContent = sign;

  if (direction === "상승" || direction === "급상승") {
    trendSignLabel.className = "w-6 text-center font-bold text-red-600";
  } else if (direction === "하락" || direction === "급락") {
    trendSignLabel.className = "w-6 text-center font-bold text-blue-600";
  } else {
    trendSignLabel.className = "w-6 text-center font-bold text-slate-700";
  }

  trendPreviewText.textContent = getTrendReportPhrase(direction, rate);
}

function buildOptimizedPrompt(data) {
  const sourceLinksBlock = formatNumberedList(data.sourceLinks, "입력 없음");

  const sampleReportBlock = data.sampleReports.length
    ? data.sampleReports
        .map((report, index) => `[참고 보고서 ${index + 1}]\n${report}`)
        .join("\n\n")
    : "입력 없음";

  return `
[범용 보고서 형식 분석 및 재구성 프롬프트]

당신은 보고서 작성 전문가이자, 과거 보고서의 형식과 논리 구조를 분석하여 새로운 보고서로 재구성하는 AI 업무 어시스턴트입니다.

당신의 임무는 특정 보고서 양식을 미리 정해두는 것이 아닙니다.
주택 매매 보고서, 전월세 동향 보고서, 토지 거래 보고서, 상가 임대동향 보고서, 개발사업 영향 보고서, 시장동향 보고서 등
어떤 유형의 보고서가 들어와도 먼저 참고 보고서의 형식을 분석한 뒤,
입력된 새 자료를 그 형식에 맞게 배치하여 새로운 보고서를 작성해야 합니다.

중요한 비유로 설명하면,
참고 보고서는 '요리법'이고,
입력 자료는 '재료'입니다.
당신은 요리법을 먼저 분석한 뒤, 새 재료를 가장 적절한 순서와 방식으로 조리하여 완성도 높은 새 보고서를 만들어야 합니다.

────────────────────
1. 입력 자료
────────────────────

[보고서 주제 / 분석 대상]
${data.subject || "입력 없음"}

[지역 또는 분석 범위]
${data.region || "입력 없음"}

[참고 자료 링크]
${sourceLinksBlock}

[핵심 이슈 / 현장 메모]
${data.issue || "입력 없음"}

[수치 자료 / 변동 지표]
${data.indicator || "입력 없음"}

[시장 방향성 / 변동률]
${data.trendExpression || "입력 없음"}

[보고서 표현 참고]
${data.trendReportPhrase || "입력 없음"}

[주요 사례 / 근거 자료]
${data.caseData || "입력 없음"}

[과거 보고서 참고 내용]
${sampleReportBlock}

────────────────────
2. 참고 보고서 형식 분석 지시
────────────────────

과거 보고서 참고 내용이 입력된 경우, 먼저 아래 항목을 분석하세요.

1. 보고서의 전체 제목 구조
2. 대목차 구조
3. 문단 작성 방식
4. 수치 제시 방식
5. 사례 제시 방식
6. 결론 도출 방식
7. 문체 분석

참고 보고서의 문장은 그대로 복사하지 말고, 형식과 논리만 차용하세요.

────────────────────
3. 형식 재구성 지시
────────────────────

참고 보고서가 2개 이상 입력된 경우 다음 기준으로 새 형식을 만드세요.

1. 공통적으로 반복되는 우수한 구조는 유지합니다.
2. 한 보고서에만 있더라도 논리적으로 유용한 구조는 반영합니다.
3. 중복되거나 흐름을 방해하는 목차는 통합합니다.
4. 입력 자료와 맞지 않는 목차는 억지로 유지하지 않습니다.
5. 새 보고서 주제에 꼭 필요한 목차가 없다면 보완 목차를 추가합니다.
6. 최종 형식은 참고 보고서의 장점을 혼합한 새로운 보고서 구조여야 합니다.

중요:
- 보고서 유형을 사전에 주택 매매, 전월세, 상가, 토지 등으로 고정하지 마세요.
- 입력 자료와 참고 보고서의 형식을 보고 스스로 적합한 보고서 유형과 목차를 추론하세요.

────────────────────
4. 참고 자료 링크 분석 지시
────────────────────

참고 자료 링크에는 뉴스 기사, 보도자료, 블로그, 유튜브 영상, 공공기관 자료 등이 입력될 수 있습니다.
링크가 입력된 경우, 보고서 작성 전에 각 링크를 먼저 분석한 뒤 보고서 본문에 필요한 내용만 자연스럽게 반영하세요.

각 링크별로 내부적으로 다음 항목을 확인하세요.

1. 자료 유형
   - 뉴스 기사, 보도자료, 유튜브 영상, 블로그, 공공기관 자료 등 자료 유형을 구분합니다.

2. 제목, 발행 주체, 날짜
   - 확인 가능한 경우 제목, 언론사 또는 발행 기관, 작성일 또는 게시일을 파악합니다.
   - 확인되지 않는 정보는 임의로 만들지 않습니다.

3. 주요 내용
   - 자료의 핵심 내용을 3~5개 수준으로 압축해 파악합니다.
   - 단순 요약에 그치지 말고, 보고서 주제와 관련된 내용만 선별합니다.

4. 핵심 단어와 개념
   - 지역명, 사업명, 정책명, 개발 호재, 거래 동향, 가격 흐름, 수요·공급 변화, 임대료, 공실, 교통, 산업, 상권 등 보고서에 활용 가능한 핵심 단어를 추출합니다.
   - 핵심 단어는 별도 나열만 하지 말고 보고서 문장 속에 자연스럽게 녹입니다.

5. 수치와 사실관계
   - 기사 또는 영상에 숫자, 날짜, 비율, 금액, 사업 규모, 기관명, 인용 발언이 있으면 사실 자료로 활용합니다.
   - 단, 원문에서 확인되지 않은 수치나 발언은 절대 만들지 않습니다.

6. 시장 영향 해석
   - 해당 자료가 입력된 지역 또는 분석 대상에 어떤 영향을 줄 수 있는지 검토합니다.
   - 영향이 직접적이면 본문 분석에 반영하고, 간접적이면 “관련 동향으로 참고 가능” 수준으로 신중하게 표현합니다.

유튜브 영상 링크의 경우 다음 기준을 따르세요.
- 영상 제목, 설명, 자막, transcript, 화면상 확인 가능한 정보가 있으면 이를 분석합니다.
- 자막 또는 transcript를 확인할 수 없는 경우 영상 내용을 임의로 추정하지 않습니다.
- 영상의 주장과 확인된 사실을 구분하고, 과장된 표현은 보고서식 객관 문장으로 바꿉니다.

뉴스 기사 링크의 경우 다음 기준을 따르세요.
- 기사 제목과 본문에서 주요 사실, 이슈, 핵심 키워드, 시장 영향 요인을 추출합니다.
- 기사 문장을 그대로 복사하지 말고, 보고서 문체에 맞게 재구성합니다.
- 기사 원문을 확인할 수 없거나 접근이 제한되면 “링크 원문 확인 필요”로 표시하고 사실처럼 단정하지 않습니다.

중요:
- 참고 자료 링크의 분석 결과를 보고서 앞에 길게 따로 나열하지 마세요.
- 주요 내용, 핵심 단어, 수치, 시장 영향만 보고서의 검토 배경, 주요 이슈, 현장 분석, 종합 판단에 자연스럽게 반영하세요.
- 링크 내용을 확인할 수 없으면 링크 제목이나 URL만 보고 내용을 추정하지 마세요.

────────────────────
5. 입력 자료 배치 지시
────────────────────

새 보고서 작성 시 입력 자료를 다음 기준으로 배치하세요.

1. 보고서 주제 / 분석 대상
   - 제목 또는 첫 문단에 반영합니다.

2. 지역 또는 분석 범위
   - 지역 개황, 분석 범위, 시장 배경 등 적절한 위치에 반영합니다.

3. 참고 자료 링크
   - 링크가 뉴스 기사 또는 유튜브 영상인 경우, 확인 가능한 원문·제목·설명·자막·transcript를 분석해 주요 내용, 핵심 단어, 수치, 시장 영향 요인을 추출합니다.
   - 분석된 내용은 보고서의 검토 배경, 주요 이슈, 수치 해석, 사례 정리, 종합 판단에 자연스럽게 반영합니다.
   - 단순히 링크 목록을 나열하지 말고, 보고서 문장 안에서 “관련 보도에서는…”, “제시된 영상 자료에서는…”처럼 신중하게 활용합니다.
   - 원문 또는 영상 내용을 확인할 수 없는 경우 링크 내용을 임의로 단정하지 않고 “링크 원문 확인 필요” 또는 “영상 내용 추가 확인 필요”로 표시합니다.

4. 핵심 이슈 / 현장 메모
   - 참고 보고서의 주요 이슈, 시장동향, 현장 탐문, 분석 배경 항목에 배치합니다.

5. 수치 자료 / 변동 지표
   - 변동률, 거래량, 매물량, 임대료, 공실률, 가격 변화 등 수치가 필요한 문단에 배치합니다.
   - 변화 전후가 있는 경우 화살표 또는 비교 문장으로 표현합니다.
   - 시장 방향성과 변동률은 보고서 본문에서 “상승(+0.23%)”, “하락(-0.23%)”, “급상승(+0.50%)”, “급락(-0.50%)”, “보합(0.00%)”과 같은 형식으로 표기합니다.
   - 대괄호 형식인 “[상승] [+0.23]%”처럼 쓰지 말고, 반드시 “상승(+0.23%)” 형식으로 자연스럽게 문장 안에 반영합니다.
   - 시장 방향성이 상승 또는 급상승이면 “상승세”, “상승폭 확대”, “강세” 등의 표현을 사용합니다.
   - 시장 방향성이 하락 또는 급락이면 “하락세”, “하락폭 확대”, “약세” 등의 표현을 사용합니다.
   - 시장 방향성이 보합이면 “보합”, “강보합”, “약보합”, “제한적 변동” 중 입력 자료에 맞는 표현을 사용합니다.
   - 단, 급상승·급락 표현은 수치와 현장 메모가 이를 뒷받침할 때만 사용합니다.

6. 주요 사례 / 근거 자료
   - 참고 보고서의 사례 제시 방식에 맞춰 본문 또는 별도 하위 항목에 배치합니다.
   - 사례가 부족하면 임의로 만들지 말고 “추가 확인 필요”로 표시합니다.

────────────────────
6. 최종 출력 지시
────────────────────

최종 결과물은 아래 순서로 작성하세요.

1. 보고서 제목
2. 참고 보고서에서 추출한 형식을 반영한 본문
3. 입력 자료를 바탕으로 한 분석 내용
4. 주요 사례 또는 근거 자료 정리
5. 종합 판단 또는 향후 검토사항
6. 자료 부족 시 추가 확인 필요사항

단, 위 순서를 반드시 고정하지 말고,
참고 보고서의 형식과 입력 자료의 성격에 맞게 자연스럽게 조정하세요.

중요:
- 최종 답변에는 프롬프트 분석 과정 설명을 길게 쓰지 마세요.
- 사용자가 바로 보고서 초안으로 활용할 수 있도록 보고서 본문만 중심으로 작성하세요.

────────────────────
7. 작성 원칙
────────────────────

- 문체는 참고 보고서의 톤을 따릅니다.
- 문장은 공공기관 또는 회사 내부 보고서에 어울리는 객관적 문장으로 작성합니다.
- 확인된 사실, 현장 탐문, 분석 판단을 구분합니다.
- 자료가 부족한 부분은 추정하지 말고 “추가 확인 필요”로 표시합니다.
- 입력되지 않은 사례나 수치를 임의로 만들지 않습니다.
- 참고 보고서의 문장을 그대로 복사하지 않고, 형식과 논리만 차용합니다.
- 최종 보고서는 바로 초안으로 활용 가능한 수준으로 작성합니다.
`;
}

function getInputData() {
  return {
    subject: document.getElementById("subjectInput").value.trim(),
    region: document.getElementById("regionInput").value.trim(),
    sourceLinks: collectValues(".source-link-input"),
    issue: document.getElementById("issueInput").value.trim(),
    indicator: document.getElementById("indicatorInput").value.trim(),
    trendDirection: trendDirectionSelect.value,
    trendRate: trendRateInput.value.trim(),
    trendExpression: getTrendExpression(trendDirectionSelect.value, trendRateInput.value.trim()),
    trendReportPhrase: getTrendReportPhrase(trendDirectionSelect.value, trendRateInput.value.trim()),
    caseData: document.getElementById("caseInput").value.trim(),
    sampleReports: collectValues(".sample-report-input")
  };
}

function validateInputData(data) {
  if (!data.subject && !data.region) {
    alert("보고서 주제 또는 지역/분석 범위 중 하나는 입력해주세요.");
    return false;
  }

  return true;
}

function copyTextFallback(text) {
  const textarea = document.createElement("textarea");

  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";

  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();

  let copied = false;

  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  }

  document.body.removeChild(textarea);

  return copied;
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      return copyTextFallback(text);
    }
  }

  return copyTextFallback(text);
}

async function generateAndCopyPrompt(targetUrl) {
  const data = getInputData();

  if (!validateInputData(data)) {
    return;
  }

  let openedWindow = null;

  if (targetUrl) {
    openedWindow = window.open("about:blank", "_blank");
  }

  latestPrompt = buildOptimizedPrompt(data);

  const copied = await copyTextToClipboard(latestPrompt);

  if (copied) {
    copyStatusMessage.textContent =
      "AI 변환 프롬프트가 복사되었습니다. 열린 AI 채팅창에 붙여넣고 실행하세요.";
    copyStatusMessage.className = "text-sm text-green-700";
  } else {
    copyStatusMessage.textContent =
      "자동 복사에 실패했습니다. 브라우저 권한을 확인하거나 다시 시도해주세요.";
    copyStatusMessage.className = "text-sm text-red-700";
  }

  if (targetUrl) {
    if (openedWindow) {
      openedWindow.location.href = targetUrl;
    } else {
      window.open(targetUrl, "_blank");
    }
  }
}

function countKoreanChars(text, lengthBasis) {
  const targetText = lengthBasis === "공백 제외"
    ? text.replace(/\s/g, "")
    : text;

  return Array.from(targetText).length;
}

function formatPercentValue(value) {
  const percent = value * 100;
  return Number.isInteger(percent)
    ? `${percent}%`
    : `${percent.toFixed(1)}%`;
}

function parseVolumeTarget(rawValue, baseCount) {
  const value = String(rawValue || "")
    .trim()
    .replace(/,/g, "")
    .replace(/\s/g, "")
    .replace(/％/g, "%");

  const rangeMatch = value.match(/^(\d+(?:\.\d+)?)~(\d+(?:\.\d+)?)%$/);
  if (rangeMatch) {
    let lowerRatio = Number(rangeMatch[1]) / 100;
    let upperRatio = Number(rangeMatch[2]) / 100;

    if (lowerRatio > upperRatio) {
      const temp = lowerRatio;
      lowerRatio = upperRatio;
      upperRatio = temp;
    }

    const targetRatio = (lowerRatio + upperRatio) / 2;

    return {
      mode: "range",
      targetRatio,
      lowerRatio,
      upperRatio,
      targetCount: Math.max(1, Math.round(baseCount * targetRatio)),
      lowerCount: Math.max(1, Math.round(baseCount * lowerRatio)),
      upperCount: Math.max(1, Math.round(baseCount * upperRatio)),
      description: `원문 대비 ${formatPercentValue(lowerRatio)}~${formatPercentValue(upperRatio)}`
    };
  }

  const percentMatch = value.match(/^(\d+(?:\.\d+)?)%$/);
  if (percentMatch) {
    const targetRatio = Number(percentMatch[1]) / 100;
    const lowerRatio = Math.max(0.01, targetRatio - 0.05);
    const upperRatio = targetRatio + 0.05;

    return {
      mode: "percent",
      targetRatio,
      lowerRatio,
      upperRatio,
      targetCount: Math.max(1, Math.round(baseCount * targetRatio)),
      lowerCount: Math.max(1, Math.round(baseCount * lowerRatio)),
      upperCount: Math.max(1, Math.round(baseCount * upperRatio)),
      description: `원문 대비 약 ${formatPercentValue(targetRatio)}`
    };
  }

  const fractionMatch = value.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const numerator = Number(fractionMatch[1]);
    const denominator = Number(fractionMatch[2]);

    if (!denominator) {
      return null;
    }

    const targetRatio = numerator / denominator;
    const lowerRatio = Math.max(0.01, targetRatio * 0.90);
    const upperRatio = targetRatio * 1.10;

    return {
      mode: "fraction",
      targetRatio,
      lowerRatio,
      upperRatio,
      targetCount: Math.max(1, Math.round(baseCount * targetRatio)),
      lowerCount: Math.max(1, Math.round(baseCount * lowerRatio)),
      upperCount: Math.max(1, Math.round(baseCount * upperRatio)),
      description: `현재 문서의 약 ${value} 수준`
    };
  }

  const multipleMatch = value.match(/^(\d+(?:\.\d+)?)(배|x|X)$/);
  if (multipleMatch) {
    const targetRatio = Number(multipleMatch[1]);
    const lowerRatio = Math.max(0.01, targetRatio * 0.90);
    const upperRatio = targetRatio * 1.10;

    return {
      mode: "multiple",
      targetRatio,
      lowerRatio,
      upperRatio,
      targetCount: Math.max(1, Math.round(baseCount * targetRatio)),
      lowerCount: Math.max(1, Math.round(baseCount * lowerRatio)),
      upperCount: Math.max(1, Math.round(baseCount * upperRatio)),
      description: `원문 대비 약 ${formatPercentValue(targetRatio)}`
    };
  }

  const numberMatch = value.match(/^(\d+(?:\.\d+)?)(?:자|글자)?$/);
  if (numberMatch) {
    const targetCount = Math.max(1, Math.round(Number(numberMatch[1])));
    const targetRatio = targetCount / baseCount;
    const lowerRatio = Math.max(0.01, targetRatio * 0.90);
    const upperRatio = targetRatio * 1.10;

    return {
      mode: "count",
      targetRatio,
      lowerRatio,
      upperRatio,
      targetCount,
      lowerCount: Math.max(1, Math.round(targetCount * 0.90)),
      upperCount: Math.max(1, Math.round(targetCount * 1.10)),
      description: `참고 글자수 약 ${targetCount.toLocaleString()}자`
    };
  }

  return null;
}

function buildLengthAdjustmentPrompt() {
  const originalText = finalReportInput.value.trim();
  const rawTargetLength = targetLengthInput.value.trim() || "50%";
  const lengthBasis = lengthBasisSelect.value || "공백 포함";

  if (!originalText) {
    alert("먼저 보고서 초안을 붙여넣어 주세요.");
    return null;
  }

  const basisCount = countKoreanChars(originalText, lengthBasis);
  const volumeTarget = parseVolumeTarget(rawTargetLength, basisCount);

  if (!volumeTarget) {
    alert("목표 분량은 50%, 45~55%, 1/3, 0.5배, 1170자 형식으로 입력해 주세요.");
    return null;
  }

  const adjustmentDirection = volumeTarget.targetRatio < 0.95
    ? "축약"
    : volumeTarget.targetRatio > 1.05
      ? "확장"
      : "유지 또는 미세 조정";

  const unusedBasis = lengthBasis === "공백 포함" ? "공백 제외" : "공백 포함";
  const targetRatioText = formatPercentValue(volumeTarget.targetRatio);
  const lowerRatioText = formatPercentValue(volumeTarget.lowerRatio);
  const upperRatioText = formatPercentValue(volumeTarget.upperRatio);

  return `
[원문 대비 분량 조정 AI 최종 조정 프롬프트]

너는 한국어 보고서 전문 편집자다.
아래 원문을 목표 분량에 맞게 편집하라.

────────────────────
[최우선 규칙]
────────────────────

이번 작업의 최우선 목표는 정확한 글자 수 자체가 아니라 원문 대비 분량 비율을 맞추는 것이다.

글자 수는 비율 판단을 위한 참고 기준이며, 결과문의 자연스러움과 보고서 품질을 훼손하지 않는 범위에서 사용한다.

원문 대비 분량 비율이 지정 범위 안에 들어오면 성공으로 간주한다.

특정 글자 수를 억지로 맞추기 위해 문장을 부자연스럽게 늘리거나 줄이지 않는다.

────────────────────
[이번 작업의 분량 조건]
────────────────────

- 사용자가 입력한 목표 분량: ${rawTargetLength}
- 적용된 목표 해석: ${volumeTarget.description}
- 조정 방향: ${adjustmentDirection}

[분량 산정 기준]
- 적용 기준: ${lengthBasis}
- 원문 기준 분량: ${basisCount.toLocaleString()}자
- 목표 참고 분량: 약 ${volumeTarget.targetCount.toLocaleString()}자
- 허용 범위: 약 ${volumeTarget.lowerCount.toLocaleString()}자 ~ ${volumeTarget.upperCount.toLocaleString()}자
- 허용 비율: 원문 대비 ${lowerRatioText} ~ ${upperRatioText}

※ 모든 분량 계산은 ${lengthBasis} 기준으로만 수행한다.
※ ${unusedBasis} 글자 수는 계산에 사용하지 않는다.

정확한 글자 수 하나에 맞추려고 하지 말고, 원문 대비 분량 비율이 자연스럽게 맞도록 조정한다.

────────────────────
1. 편집 목표
────────────────────

원문의 전체 의미와 논리 흐름을 유지한다.
목표 분량은 원문 대비 비율 기준으로 맞춘다.
핵심 사실과 결론은 유지한다.
결과문이 지나치게 길거나 짧지 않도록 조정한다.
목표 비율 달성을 위해 필요한 경우 형식 보존보다 분량 조정을 우선한다.

────────────────────
2. 축약 원칙
────────────────────

분량을 줄여야 할 경우 다음 순서로 압축한다.

1. 중복 문장 삭제
2. 유사 의미 표현 통합
3. 장황한 표현 축약
4. 조사 및 수식어 최소화
5. 문장 내부 표현 압축
6. 부연 설명 축소
7. 중요도가 낮은 배경 설명 삭제
8. 사례가 많으면 핵심 사례 중심으로 압축
9. 결론은 유지하되 간결하게 정리

────────────────────
3. 확장 원칙
────────────────────

분량을 늘려야 할 경우 원문에 없는 새로운 사실은 추가하지 않는다.

다음 방법만 사용한다.

1. 원문 의미를 더 명확하게 풀어 쓴다.
2. 생략된 인과관계를 원문 범위 안에서 보완한다.
3. 문단 간 연결을 자연스럽게 보완한다.
4. 숫자와 사례의 의미를 원문 범위 안에서 설명한다.
5. 결론의 판단 근거를 원문 범위 안에서 조금 더 구체화한다.

새로운 수치, 새로운 사례, 새로운 전망, 새로운 판단은 추가하지 않는다.

────────────────────
4. 반드시 유지할 내용
────────────────────

- 숫자
- 금액
- 날짜
- 비율
- 수치
- 단위
- 고유명사
- 지역명
- 기관명
- 단지명
- 사업명
- 핵심 사실
- 핵심 근거
- 핵심 결론

보고서의 기본 문체와 종결 표현은 가능한 유지한다.
제목, 소제목, 번호 체계, 항목 체계는 가능한 유지한다.

────────────────────
5. 내부 검산
────────────────────

출력 전 반드시 내부적으로 다음을 확인한다.

1. 결과문이 원문 대비 ${lowerRatioText} ~ ${upperRatioText} 범위인지 확인한다.
2. 결과문이 약 ${volumeTarget.lowerCount.toLocaleString()}자 ~ ${volumeTarget.upperCount.toLocaleString()}자 범위인지 확인한다.
3. 범위를 벗어나면 다시 편집한다.
4. 검산 과정은 출력하지 않는다.

────────────────────
6. 금지 사항
────────────────────

- 원문에 없는 새로운 사실 추가 금지
- 숫자, 금액, 날짜, 비율, 고유명사 임의 변경 금지
- 편집 이유 출력 금지
- 계산 과정 출력 금지
- 검산표 출력 금지
- "아래는", "수정했습니다", "요약하면" 등의 안내 문구 사용 금지

────────────────────
7. 출력 방식
────────────────────

최종 편집본만 출력한다.
설명, 해설, 주석, 변경 이유, 계산 과정은 출력하지 않는다.

[원문]
${originalText}
`;
}

async function generateAndCopyAdjustmentPrompt(targetUrl) {
  const adjustmentPrompt = buildLengthAdjustmentPrompt();

  if (!adjustmentPrompt) {
    return;
  }

  let openedWindow = null;

  if (targetUrl) {
    openedWindow = window.open("about:blank", "_blank");
  }

  const copied = await copyTextToClipboard(adjustmentPrompt);

  if (copied) {
    adjustPromptStatusMessage.textContent =
      "글자수 조정 프롬프트가 복사되었습니다. 열린 AI 채팅창에 붙여넣고 실행하세요.";
    adjustPromptStatusMessage.className = "text-sm text-green-700";
  } else {
    adjustPromptStatusMessage.textContent =
      "자동 복사에 실패했습니다. 브라우저 권한을 확인하거나 다시 시도해주세요.";
    adjustPromptStatusMessage.className = "text-sm text-red-700";
  }

  if (targetUrl) {
    if (openedWindow) {
      openedWindow.location.href = targetUrl;
    } else {
      window.open(targetUrl, "_blank");
    }
  }
}

function updateDraftCharacterCount() {
  const text = finalReportInput.value;

  const countWithSpace = countKoreanChars(text, "공백 포함");
  const countWithoutSpace = countKoreanChars(text, "공백 제외");

  draftCountWithSpace.textContent = `띄어쓰기 포함 ${countWithSpace.toLocaleString()}자`;
  draftCountWithoutSpace.textContent = `띄어쓰기 제외 ${countWithoutSpace.toLocaleString()}자`;
}

function updateFinalReportCharacterCount() {
  const text = finalReportBox.value;

  const countWithSpace = countKoreanChars(text, "공백 포함");
  const countWithoutSpace = countKoreanChars(text, "공백 제외");

  finalCountWithSpace.textContent = `띄어쓰기 포함 ${countWithSpace.toLocaleString()}자`;
  finalCountWithoutSpace.textContent = `띄어쓰기 제외 ${countWithoutSpace.toLocaleString()}자`;
}

async function copyFinalReport() {
  const finalReport = finalReportBox.value.trim();

  if (!finalReport) {
    alert("최종 보고서를 붙여넣어 주세요.");
    return;
  }

  const copied = await copyTextToClipboard(finalReport);

  if (copied) {
    alert("최종 보고서가 복사되었습니다.");
  } else {
    alert("복사에 실패했습니다. 최종 보고서 내용을 직접 복사해주세요.");
  }
}

addSourceLinkBtn.addEventListener("click", addSourceLinkInput);
addSampleReportBtn.addEventListener("click", addSampleReportInput);

sourceLinksContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-source-link-btn")) {
    removeSourceLinkInput(event.target);
  }
});

sampleReportsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-sample-report-btn")) {
    removeSampleReportInput(event.target);
  }
});

copyPromptOnlyBtn.addEventListener("click", function () {
  generateAndCopyPrompt(null);
});

openChatGptBtn.addEventListener("click", function () {
  generateAndCopyPrompt(CHATGPT_URL);
});

openGeminiBtn.addEventListener("click", function () {
  generateAndCopyPrompt(GEMINI_URL);
});

copyAdjustPromptBtn.addEventListener("click", function () {
  generateAndCopyAdjustmentPrompt(null);
});

openAdjustChatGptBtn.addEventListener("click", function () {
  generateAndCopyAdjustmentPrompt(CHATGPT_URL);
});

openAdjustGeminiBtn.addEventListener("click", function () {
  generateAndCopyAdjustmentPrompt(GEMINI_URL);
});

trendDirectionSelect.addEventListener("change", updateTrendPreview);
trendRateInput.addEventListener("input", updateTrendPreview);

finalReportInput.addEventListener("input", updateDraftCharacterCount);
finalReportBox.addEventListener("input", updateFinalReportCharacterCount);

copyFinalReportBtn.addEventListener("click", copyFinalReport);

addSourceLinkInput();
addSampleReportInput();
updateDraftCharacterCount();
updateFinalReportCharacterCount();
updateTrendPreview();
