const MAX_SOURCE_LINKS = 5;
const MAX_SAMPLE_REPORTS = 3;
const MAX_REPORTS_PER_FOLDER = 10;

const REPORT_DB_NAME = "rebPastReportStorage";
const REPORT_DB_VERSION = 1;
const FOLDER_STORE_NAME = "folders";
const REPORT_STORE_NAME = "reports";

const CHATGPT_URL = "https://chatgpt.com/";
const GEMINI_URL = "https://gemini.google.com/app";

const sourceLinksContainer = document.getElementById("sourceLinksContainer");
const sampleReportsContainer = document.getElementById("sampleReportsContainer");

const addSourceLinkBtn = document.getElementById("addSourceLinkBtn");
const addSampleReportBtn = document.getElementById("addSampleReportBtn");
const saveReportToStorageBtn = document.getElementById("saveReportToStorageBtn");
const openReportStorageBtn = document.getElementById("openReportStorageBtn");
let reportStoragePanel = document.getElementById("reportStoragePanel");
let reportStorageModeText = document.getElementById("reportStorageModeText");
let closeReportStorageBtn = document.getElementById("closeReportStorageBtn");
let newFolderNameInput = document.getElementById("newFolderNameInput");
let createFolderBtn = document.getElementById("createFolderBtn");
let reportStorageStatusMessage = document.getElementById("reportStorageStatusMessage");
let folderSelectForSave = document.getElementById("folderSelectForSave");
let reportTitleForSaveInput = document.getElementById("reportTitleForSaveInput");
let confirmSaveReportBtn = document.getElementById("confirmSaveReportBtn");
let reportStorageList = document.getElementById("reportStorageList");

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
const volumeModeSelect = document.getElementById("volumeModeSelect");
const volumeModeHelpText = document.getElementById("volumeModeHelpText");

const copyAdjustPromptBtn = document.getElementById("copyAdjustPromptBtn");
const openAdjustChatGptBtn = document.getElementById("openAdjustChatGptBtn");
const openAdjustGeminiBtn = document.getElementById("openAdjustGeminiBtn");

const adjustPromptStatusMessage = document.getElementById("adjustPromptStatusMessage");

const previousTrendSignSelect = document.getElementById("previousTrendSignSelect");
const previousTrendRateInput = document.getElementById("previousTrendRateInput");

const trendDirectionSelect = document.getElementById("trendDirectionSelect");
const trendRateInput = document.getElementById("trendRateInput");
const trendSignLabel = document.getElementById("trendSignLabel");
const trendPreviewText = document.getElementById("trendPreviewText");

let latestPrompt = "";
let activeStorageSampleIndex = 0;
let activeStorageMode = "load";
let reportStoragePositionFrame = null;

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
    <div class="flex items-center justify-between gap-2">
      <p class="sample-report-title text-sm font-bold text-indigo-700">
        참고 보고서 ${index}
      </p>

      <div class="flex items-center gap-2 flex-wrap justify-end">
        <button
          type="button"
          class="save-sample-report-btn px-3 py-1 rounded-lg border border-indigo-200 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
        >
          보고서 저장
        </button>

        <button
          type="button"
          class="load-sample-report-btn px-3 py-1 rounded-lg border border-indigo-200 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
        >
          보고서 불러오기
        </button>

        <button
          type="button"
          class="remove-sample-report-btn px-3 py-1 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          삭제
        </button>
      </div>
    </div>

    <textarea
      class="sample-report-input w-full h-40 border border-indigo-100 bg-indigo-50/40 rounded-xl p-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-300"
      placeholder="참고 보고서 ${index} 내용을 입력하세요. 목차, 문체, 문단 흐름, 수치 제시 방식, 사례 정리 방식, 결론 도출 방식이 드러나도록 붙여넣으면 좋습니다."
    ></textarea>
  `;

  return wrapper;
}

function ensureSampleReportActionButtons(row, index) {
  if (!row) {
    return;
  }

  let header = row.querySelector(".flex.items-center.justify-between");

  if (!header) {
    const title = row.querySelector(".sample-report-title");
    header = document.createElement("div");
    header.className = "flex items-center justify-between gap-2";

    if (title) {
      title.parentNode.insertBefore(header, title);
      header.appendChild(title);
    } else {
      row.insertBefore(header, row.firstChild);
      const newTitle = document.createElement("p");
      newTitle.className = "sample-report-title text-sm font-bold text-indigo-700";
      header.appendChild(newTitle);
    }
  }

  let actionWrap = header.querySelector(".sample-report-actions");

  if (!actionWrap) {
    const existingButtonWrap = Array.from(header.children).find((child) => {
      return child !== row.querySelector(".sample-report-title") && child.querySelector && child.querySelector("button");
    });

    if (existingButtonWrap) {
      actionWrap = existingButtonWrap;
      actionWrap.classList.add("sample-report-actions");
    } else {
      actionWrap = document.createElement("div");
      actionWrap.className = "sample-report-actions flex items-center gap-2 flex-wrap justify-end";
      header.appendChild(actionWrap);
    }
  }

  let removeBtn = actionWrap.querySelector(".remove-sample-report-btn") || row.querySelector(".remove-sample-report-btn");

  let saveBtn = actionWrap.querySelector(".save-sample-report-btn");
  if (!saveBtn) {
    saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "save-sample-report-btn px-3 py-1 rounded-lg border border-indigo-200 text-sm font-semibold text-indigo-700 hover:bg-indigo-50";
    saveBtn.textContent = "보고서 저장";
    if (removeBtn && removeBtn.parentNode === actionWrap) {
      actionWrap.insertBefore(saveBtn, removeBtn);
    } else {
      actionWrap.appendChild(saveBtn);
    }
  }

  let loadBtn = actionWrap.querySelector(".load-sample-report-btn");
  if (!loadBtn) {
    loadBtn = document.createElement("button");
    loadBtn.type = "button";
    loadBtn.className = "load-sample-report-btn px-3 py-1 rounded-lg border border-indigo-200 text-sm font-semibold text-indigo-700 hover:bg-indigo-50";
    loadBtn.textContent = "보고서 불러오기";
    if (removeBtn && removeBtn.parentNode === actionWrap) {
      actionWrap.insertBefore(loadBtn, removeBtn);
    } else {
      actionWrap.appendChild(loadBtn);
    }
  }

  if (removeBtn && removeBtn.parentNode !== actionWrap) {
    actionWrap.appendChild(removeBtn);
  }

  saveBtn.dataset.sampleIndex = String(index);
  loadBtn.dataset.sampleIndex = String(index);
}

function ensureReportStorageElements() {
  if (!reportStoragePanel) {
    const panel = document.createElement("div");
    panel.id = "reportStoragePanel";
    panel.className = "fixed right-0 z-50 w-full max-w-[480px] bg-white border border-indigo-200 rounded-l-2xl p-5 space-y-3 shadow-xl overflow-y-auto transition-all duration-300 ease-out translate-x-full opacity-0 pointer-events-none";
    panel.innerHTML = `
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-sm font-bold text-indigo-700">과거 보고서 저장소</p>
          <p id="reportStorageModeText" class="text-xs text-indigo-600 mt-1">
            저장된 보고서는 현재 브라우저에만 보관됩니다. 브라우저 데이터 삭제 시 함께 삭제될 수 있습니다.
          </p>
        </div>

        <button
          id="closeReportStorageBtn"
          type="button"
          class="px-3 py-1 rounded-lg border border-indigo-200 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
        >
          닫기
        </button>
      </div>

      <div class="grid md:grid-cols-3 gap-2">
        <input
          id="newFolderNameInput"
          type="text"
          class="border rounded-xl p-3 text-sm"
          placeholder="새 주제 폴더명"
        />

        <button
          id="createFolderBtn"
          type="button"
          class="px-3 py-3 rounded-xl border border-indigo-200 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
        >
          + 주제 폴더 만들기
        </button>

        <p id="reportStorageStatusMessage" class="text-xs text-slate-500 leading-relaxed md:pt-3">
          폴더별 최대 10개까지 저장할 수 있습니다.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-2">
        <select
          id="folderSelectForSave"
          class="border rounded-xl p-3 text-sm bg-white"
        ></select>

        <input
          id="reportTitleForSaveInput"
          type="text"
          class="border rounded-xl p-3 text-sm"
          placeholder="저장할 보고서 제목"
        />
      </div>

      <button
        id="confirmSaveReportBtn"
        type="button"
        class="w-full px-3 py-3 rounded-xl border border-indigo-200 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
      >
        현재 참고 보고서 저장
      </button>

      <div id="reportStorageList" class="space-y-3"></div>
    `;
    document.body.appendChild(panel);
  }

  reportStoragePanel = document.getElementById("reportStoragePanel");
  reportStorageModeText = document.getElementById("reportStorageModeText");
  closeReportStorageBtn = document.getElementById("closeReportStorageBtn");
  newFolderNameInput = document.getElementById("newFolderNameInput");
  createFolderBtn = document.getElementById("createFolderBtn");
  reportStorageStatusMessage = document.getElementById("reportStorageStatusMessage");
  folderSelectForSave = document.getElementById("folderSelectForSave");
  reportTitleForSaveInput = document.getElementById("reportTitleForSaveInput");
  confirmSaveReportBtn = document.getElementById("confirmSaveReportBtn");
  reportStorageList = document.getElementById("reportStorageList");

  if (reportStoragePanel) {
    reportStoragePanel.classList.remove("top-0", "h-screen");
    reportStoragePanel.classList.add("overflow-y-auto");
  }
}

function getReportStorageAnchorBox() {
  if (!sampleReportsContainer) {
    return null;
  }

  return sampleReportsContainer.closest(".bg-indigo-50");
}

function isMobileReportStorageView() {
  if (window.matchMedia) {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  return (window.innerWidth || document.documentElement.clientWidth || 0) <= 768;
}

function applyReportStoragePanelPosition() {
  if (!reportStoragePanel) {
    return;
  }

  reportStoragePanel.classList.remove("top-0", "h-screen");

  const style = reportStoragePanel.style;
  style.position = "fixed";
  style.overflowY = "auto";

  if (isMobileReportStorageView()) {
    style.top = "0";
    style.left = "0";
    style.right = "0";
    style.bottom = "0";
    style.width = "100%";
    style.maxWidth = "none";
    style.height = "100dvh";
    style.maxHeight = "100dvh";
    return;
  }

  const anchorBox = getReportStorageAnchorBox();
  const margin = 16;
  const gap = 12;
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1200;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 800;

  if (!anchorBox) {
    const fallbackHeight = Math.max(260, viewportHeight - margin * 2);
    style.top = `${margin}px`;
    style.left = "auto";
    style.right = `${margin}px`;
    style.bottom = "auto";
    style.width = "480px";
    style.maxWidth = `calc(100vw - ${margin * 2}px)`;
    style.height = `${fallbackHeight}px`;
    style.maxHeight = `${fallbackHeight}px`;
    return;
  }

  const rect = anchorBox.getBoundingClientRect();
  const maxHeight = Math.max(260, viewportHeight - margin * 2);
  const panelHeight = Math.min(Math.max(rect.height, 260), maxHeight);
  const panelTop = Math.max(margin, Math.min(rect.top, viewportHeight - panelHeight - margin));

  const availableWidth = viewportWidth - rect.right - gap - margin;
  let panelWidth = Math.min(480, Math.max(320, availableWidth));
  let panelLeft = rect.right + gap;

  if (availableWidth < 320) {
    panelWidth = Math.min(480, viewportWidth - margin * 2);
    panelLeft = viewportWidth - panelWidth - margin;
  }

  panelLeft = Math.max(margin, panelLeft);

  style.top = `${Math.round(panelTop)}px`;
  style.left = `${Math.round(panelLeft)}px`;
  style.right = "auto";
  style.bottom = "auto";
  style.width = `${Math.round(panelWidth)}px`;
  style.maxWidth = "480px";
  style.height = `${Math.round(panelHeight)}px`;
  style.maxHeight = `${Math.round(panelHeight)}px`;
}

function isReportStoragePanelOpen() {
  return Boolean(
    reportStoragePanel &&
    !reportStoragePanel.classList.contains("pointer-events-none") &&
    !reportStoragePanel.classList.contains("opacity-0")
  );
}

function requestReportStoragePanelPositionUpdate() {
  if (!isReportStoragePanelOpen()) {
    return;
  }

  if (reportStoragePositionFrame) {
    window.cancelAnimationFrame(reportStoragePositionFrame);
  }

  reportStoragePositionFrame = window.requestAnimationFrame(function () {
    reportStoragePositionFrame = null;
    applyReportStoragePanelPosition();
  });
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
    ensureSampleReportActionButtons(row, index);

    const title = row.querySelector(".sample-report-title");
    const textarea = row.querySelector(".sample-report-input");
    const removeBtn = row.querySelector(".remove-sample-report-btn");
    const saveBtn = row.querySelector(".save-sample-report-btn");
    const loadBtn = row.querySelector(".load-sample-report-btn");

    row.dataset.sampleIndex = String(index);

    if (saveBtn) {
      saveBtn.dataset.sampleIndex = String(index);
    }

    if (loadBtn) {
      loadBtn.dataset.sampleIndex = String(index);
    }

    if (title) {
      title.textContent = `참고 보고서 ${index + 1}`;
    }

    if (textarea) {
      textarea.placeholder = `참고 보고서 ${index + 1} 내용을 입력하세요. 목차, 문체, 문단 흐름, 수치 제시 방식, 사례 정리 방식, 결론 도출 방식이 드러나도록 붙여넣으면 좋습니다.`;
    }

    if (removeBtn) {
      if (sampleRows.length === 1) {
        removeBtn.classList.add("hidden");
      } else {
        removeBtn.classList.remove("hidden");
      }
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
  if (direction === "상승" || direction === "급등") {
    return "+";
  }

  if (direction === "하락" || direction === "급락") {
    return "-";
  }

  return "±";
}

function formatTrendRate(rate) {
  const numberRate = Number(rate);

  return Number.isNaN(numberRate)
    ? rate
    : numberRate.toFixed(2);
}

function getTrendExpression(direction, rate) {
  const sign = getTrendSign(direction);

  if (!rate) {
    if (direction === "보합") {
      return "보합 또는 제한적 변동";
    }

    if (direction === "급등") {
      return "상승폭 확대 또는 가파른 상승세(변동률 별도 입력 없음)";
    }

    if (direction === "급락") {
      return "하락폭 확대 또는 낙폭 심화(변동률 별도 입력 없음)";
    }

    return `${direction}(변동률 별도 입력 없음)`;
  }

  const formattedRate = formatTrendRate(rate);

  if (direction === "보합") {
    return `보합(${formattedRate}%) 또는 보합세 유지`;
  }

  if (direction === "급등") {
    return `가파른 상승세(${sign}${formattedRate}%) 또는 상승폭 확대`;
  }

  if (direction === "급락") {
    return `하락폭 확대(${sign}${formattedRate}%) 또는 낙폭 심화`;
  }

  return `${direction}(${sign}${formattedRate}%)`;
}

function getPreviousTrendExpression(sign, rate) {
  if (!rate) {
    return "입력 없음";
  }

  const formattedRate = formatTrendRate(rate);
  const normalizedSign = sign === "-" ? "-" : "+";

  return `전기 변동률 ${normalizedSign}${formattedRate}%`;
}

function getSignedTrendValue(direction, rate) {
  const numberRate = Number(rate);

  if (!rate || Number.isNaN(numberRate)) {
    return null;
  }

  if (direction === "하락" || direction === "급락") {
    return -numberRate;
  }

  if (direction === "상승" || direction === "급등") {
    return numberRate;
  }

  return 0;
}

function getSignedPreviousTrendValue(sign, rate) {
  const numberRate = Number(rate);

  if (!rate || Number.isNaN(numberRate)) {
    return null;
  }

  if (sign === "-") {
    return -numberRate;
  }

  return numberRate;
}

function getTrendReportPhrase(direction, rate) {
  const expression = getTrendExpression(direction, rate);

  if (direction === "급등") {
    return `${expression}로 나타나 상승폭 확대, 가파른 상승세, 상승 압력 증대 여부를 중심으로 검토할 필요가 있음.`;
  }

  if (direction === "상승") {
    return `${expression}으로 나타나 상승세 지속 또는 상승 전환 여부를 중심으로 검토할 필요가 있음.`;
  }

  if (direction === "보합") {
    return `${expression}로 나타나 가격 흐름은 보합권, 보합세 유지 또는 제한적 변동 수준으로 판단할 수 있음.`;
  }

  if (direction === "하락") {
    return `${expression}으로 나타나 하락세 지속, 하락 전환 또는 하락 조정 여부를 중심으로 검토할 필요가 있음.`;
  }

  if (direction === "급락") {
    return `${expression}로 나타나 하락폭 확대, 낙폭 심화 또는 하락 조정 여부를 중심으로 검토할 필요가 있음.`;
  }

  return expression;
}

function formatPointDiff(value) {
  return Number.isInteger(value)
    ? value.toFixed(0)
    : value.toFixed(2);
}

function getTrendComparisonPhrase(previousSign, previousRate, currentDirection, currentRate) {
  const previousExpression = getPreviousTrendExpression(previousSign, previousRate);
  const currentExpression = getTrendExpression(currentDirection, currentRate);
  const previousValue = getSignedPreviousTrendValue(previousSign, previousRate);
  const currentValue = getSignedTrendValue(currentDirection, currentRate);

  if (previousValue === null && currentValue === null) {
    return "전기 및 현재 변동률이 입력되지 않아 전기 대비 흐름은 별도 판단 필요.";
  }

  if (previousValue === null) {
    return `현재 ${currentExpression}으로 나타났으나, 전기 변동률이 입력되지 않아 전기 대비 상승폭·하락폭 변화는 추가 확인 필요.`;
  }

  if (currentValue === null) {
    return `${previousExpression}으로 나타났으나, 현재 변동률이 입력되지 않아 현재 흐름과의 비교는 추가 확인 필요.`;
  }

  const previousAbs = Math.abs(previousValue);
  const currentAbs = Math.abs(currentValue);
  const absDiff = Math.abs(currentAbs - previousAbs);
  const formattedDiff = formatPointDiff(absDiff);

  if (Math.abs(currentValue - previousValue) < 0.005) {
    return `${previousExpression} 대비 현재 ${currentExpression}로 나타나 전기와 유사한 보합권 또는 제한적 변동 흐름으로 정리할 수 있음.`;
  }

  if (previousValue <= 0 && currentValue > 0) {
    return `${previousExpression} 대비 현재 ${currentExpression}로 나타나 상승 전환 또는 상승 압력 증대 흐름으로 정리할 수 있음.`;
  }

  if (previousValue >= 0 && currentValue < 0) {
    return `${previousExpression} 대비 현재 ${currentExpression}로 나타나 하락 전환 또는 하락 조정 흐름으로 정리할 수 있음.`;
  }

  if (currentValue === 0) {
    return `${previousExpression} 대비 현재 ${currentExpression}로 나타나 보합 전환 또는 보합세 유지 흐름으로 정리할 수 있음.`;
  }

  if (currentValue > 0) {
    if (currentAbs > previousAbs) {
      return `${previousExpression} 대비 현재 ${currentExpression}로 나타나 전기 대비 상승폭이 약 ${formattedDiff}%p 확대된 흐름으로 정리할 수 있음.`;
    }

    return `${previousExpression} 대비 현재 ${currentExpression}로 나타나 전기 대비 상승폭이 약 ${formattedDiff}%p 축소된 흐름으로 정리할 수 있음.`;
  }

  if (currentAbs > previousAbs) {
    return `${previousExpression} 대비 현재 ${currentExpression}로 나타나 전기 대비 하락폭이 약 ${formattedDiff}%p 확대되거나 낙폭이 심화된 흐름으로 정리할 수 있음.`;
  }

  return `${previousExpression} 대비 현재 ${currentExpression}로 나타나 전기 대비 하락폭이 약 ${formattedDiff}%p 축소되거나 하락세가 둔화된 흐름으로 정리할 수 있음.`;
}

function setTrendSignStyle(signLabel, direction) {
  const sign = getTrendSign(direction);
  signLabel.textContent = sign;

  if (direction === "상승" || direction === "급등") {
    signLabel.className = "w-6 text-center font-bold text-red-600";
  } else if (direction === "하락" || direction === "급락") {
    signLabel.className = "w-6 text-center font-bold text-blue-600";
  } else {
    signLabel.className = "w-6 text-center font-bold text-slate-700";
  }
}

function updateTrendPreview() {
  const previousSign = previousTrendSignSelect.value;
  const previousRate = previousTrendRateInput.value.trim();
  const direction = trendDirectionSelect.value;
  const rate = trendRateInput.value.trim();

  setTrendSignStyle(trendSignLabel, direction);

  const currentPhrase = getTrendReportPhrase(direction, rate);
  const comparisonPhrase = getTrendComparisonPhrase(previousSign, previousRate, direction, rate);

  trendPreviewText.textContent = `${currentPhrase} ${comparisonPhrase}`;
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
※ 일반적으로 뉴스 기사 링크 또는 유튜브 영상 링크가 입력됩니다. 가능하면 링크의 제목, 본문·자막·설명, 주요 내용, 핵심 단어, 수치, 발언, 쟁점을 확인해 보고서 작성에 활용하세요.

[핵심 이슈 / 현장 메모]
${data.issue || "입력 없음"}

[수치 자료 / 변동 지표]
${data.indicator || "입력 없음"}

[전기 변동률]
${data.previousTrendExpression || "입력 없음"}

[현재 시장 방향성 / 변동률]
${data.trendExpression || "입력 없음"}

[전기 대비 현재 흐름 참고]
${data.trendComparisonPhrase || data.trendReportPhrase || "입력 없음"}

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
4. 입력 자료 배치 지시
────────────────────

새 보고서 작성 시 입력 자료를 다음 기준으로 배치하세요.

1. 보고서 주제 / 분석 대상
   - 제목 또는 첫 문단에 반영합니다.

2. 지역 또는 분석 범위
   - 지역 개황, 분석 범위, 시장 배경 등 적절한 위치에 반영합니다.

3. 참고 자료 링크
   - 참고 자료 링크는 뉴스 기사 또는 유튜브 영상일 수 있습니다.
   - 가능하면 각 링크에 접속하거나 검색을 통해 제목, 작성·게시 시점, 출처, 본문 내용, 영상 설명, 자막·스크립트, 주요 발언, 반복되는 핵심 단어, 수치, 쟁점을 확인합니다.
   - 뉴스 기사인 경우 제목, 리드문, 본문 핵심 주장, 인용 발언, 정책·개발사업·거래동향·시장심리 관련 내용을 요약해 보고서의 주요 이슈, 시장동향, 근거 자료, 종합 판단에 자연스럽게 반영합니다.
   - 유튜브 영상인 경우 제목, 채널명, 게시일, 설명란, 자막·스크립트 또는 영상에서 확인 가능한 주요 발언과 키워드를 분석해 보고서 문장으로 재구성합니다.
   - 링크 분석 결과는 단순 나열하지 말고 핵심 내용, 주요 단어, 확인된 수치, 시장에 미칠 수 있는 영향 중심으로 본문에 녹입니다.
   - 링크 내용과 사용자가 입력한 핵심 이슈·수치 자료·주요 사례가 서로 연결될 경우, 인과관계와 근거가 드러나도록 같은 문단 또는 인접 문단에 배치합니다.
   - 링크에 접속할 수 없거나 기사 전문·영상 자막을 확인할 수 없는 경우 링크 내용은 임의로 단정하지 않습니다. 이때는 “링크 원문 확인 필요”, “영상 자막 확인 필요”, “추가 확인 필요” 등으로 표시합니다.
   - 출처가 불명확하거나 광고성·의견성 자료로 보이는 경우 확정 사실처럼 쓰지 말고, 참고 의견 또는 시장 심리 자료로 제한해 활용합니다.

4. 핵심 이슈 / 현장 메모
   - 참고 보고서의 주요 이슈, 시장동향, 현장 탐문, 분석 배경 항목에 배치합니다.

5. 수치 자료 / 변동 지표
   - 변동률, 거래량, 매물량, 임대료, 공실률, 가격 변화 등 수치가 필요한 문단에 배치합니다.
   - 변화 전후가 있는 경우 화살표 또는 비교 문장으로 표현합니다.
   - 대괄호 형식인 “[상승] [+0.23]%”처럼 쓰지 말고, 반드시 “상승(+0.23%)”, “하락(-0.23%)”, “보합(0.00%)”처럼 자연스러운 문장 안에 반영합니다.
   - 전기 변동률은 별도 방향성 선택값 없이 부호(+/-)와 소수점 두 자리 수치만으로 해석합니다.
   - 전기 변동률의 +는 전기 상승률, -는 전기 하락률로만 간주하고, 현재 변동률과 비교해 전기 대비 흐름을 반드시 해석합니다.
   - 최종 보고서에서는 “급등”, “급락”이라는 단어를 직접 쓰기보다 한국부동산원 보고서에 어울리는 중립적·객관적 표현으로 바꿔 씁니다.

   [상승세 기술 표현]
   - 상승폭 확대: 상승세가 이전보다 강해진 경우 사용합니다.
   - 상승 전환: 보합 또는 하락에서 상승으로 방향이 바뀐 경우 사용합니다.
   - 상승세 지속: 상승 흐름이 이어지는 경우 사용합니다.
   - 가파른 상승세: 변화폭이 크지만 표현을 완곡하게 처리할 때 사용합니다.
   - 상승 압력 증대: 공급 부족, 개발 기대, 정주 여건 개선 등 상승 요인이 커진 경우 사용합니다.

   [하락세 기술 표현]
   - 하락폭 확대: 하락세가 이전보다 심화된 경우 사용합니다.
   - 하락 전환: 상승 또는 보합에서 하락으로 방향이 바뀐 경우 사용합니다.
   - 하락세 지속: 하락 흐름이 이어지는 경우 사용합니다.
   - 낙폭 심화: 하락 정도가 깊어진 경우 사용합니다.
   - 하락 조정: 과열 이후 가격이 조정받거나 매수심리가 위축된 경우 중립적으로 사용합니다.

   [보합·정체 기술 표현]
   - 보합: 변동이 거의 없는 경우 사용합니다.
   - 보합세 유지: 정체된 상태가 이어지는 경우 사용합니다.
   - 제한적 변동: 변동은 있으나 방향성이 뚜렷하지 않은 경우 사용합니다.
   - 강보합 또는 약보합: 보합권 안에서 소폭 상승 또는 소폭 하락 성격이 있을 때 사용합니다.

   - 예시: “공급 부족 우려와 정주 여건 개선 기대로 상승폭이 확대되었습니다.”
   - 예시: “입주 물량 부담 및 매수 심리 위축으로 전월 대비 하락폭이 심화되는 양상을 보였습니다.”
   - 예시: “거래 관망세가 이어지며 보합세를 유지하였으나, 일부 단지에서는 급매물 위주로 가격 변동이 관측되었습니다.”

6. 주요 사례 / 근거 자료
   - 참고 보고서의 사례 제시 방식에 맞춰 본문 또는 별도 하위 항목에 배치합니다.
   - 사례가 부족하면 임의로 만들지 말고 “추가 확인 필요”로 표시합니다.

────────────────────
5. 최종 출력 지시
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
6. 작성 원칙
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
    previousTrendSign: previousTrendSignSelect.value,
    previousTrendRate: previousTrendRateInput.value.trim(),
    previousTrendExpression: getPreviousTrendExpression(previousTrendSignSelect.value, previousTrendRateInput.value.trim()),
    trendDirection: trendDirectionSelect.value,
    trendRate: trendRateInput.value.trim(),
    trendExpression: getTrendExpression(trendDirectionSelect.value, trendRateInput.value.trim()),
    trendReportPhrase: getTrendReportPhrase(trendDirectionSelect.value, trendRateInput.value.trim()),
    trendComparisonPhrase: getTrendComparisonPhrase(
      previousTrendSignSelect.value,
      previousTrendRateInput.value.trim(),
      trendDirectionSelect.value,
      trendRateInput.value.trim()
    ),
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

function countKoreanChars(text, lengthBasis = "공백 포함") {
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

function getVolumeModeLabel(mode) {
  const labels = {
    percent: "퍼센트(%)",
    range: "퍼센트 범위(%)",
    multiple: "배수(몇 배)",
    fraction: "분수/비율"
  };

  return labels[mode] || labels.percent;
}

function getDefaultTargetByMode(mode) {
  const defaults = {
    percent: "50",
    range: "45~55",
    multiple: "0.5",
    fraction: "1/2"
  };

  return defaults[mode] || defaults.percent;
}

function getPlaceholderByMode(mode) {
  const placeholders = {
    percent: "예: 50 또는 150",
    range: "예: 45~55 또는 145~155",
    multiple: "예: 0.5 또는 1.5",
    fraction: "예: 1/2 또는 3/2"
  };

  return placeholders[mode] || placeholders.percent;
}

function getHelpTextByMode(mode) {
  const helpTexts = {
    percent: "퍼센트 모드: 50 또는 150처럼 입력하면 원문 대비 50% 또는 150%로 조정합니다.",
    range: "퍼센트 범위 모드: 45~55처럼 입력하면 원문 대비 45%~55% 사이로 조정합니다.",
    multiple: "배수 모드: 0.5 또는 1.5처럼 입력하면 원문 대비 0.5배 또는 1.5배로 조정합니다.",
    fraction: "분수/비율 모드: 1/2 또는 3/2처럼 입력하면 원문 대비 1/2 또는 3/2 수준으로 조정합니다."
  };

  return helpTexts[mode] || helpTexts.percent;
}

function updateVolumeModeGuide() {
  const mode = volumeModeSelect.value || "percent";
  targetLengthInput.placeholder = getPlaceholderByMode(mode);
  volumeModeHelpText.textContent = getHelpTextByMode(mode);
}

function buildVolumeTarget(baseCount, mode, targetRatio, description) {
  const tolerance = 0.05;
  const lowerRatio = Math.max(0.01, targetRatio - tolerance);
  const upperRatio = targetRatio + tolerance;

  return {
    mode,
    modeLabel: getVolumeModeLabel(mode),
    targetRatio,
    lowerRatio,
    upperRatio,
    targetCount: Math.max(1, Math.round(baseCount * targetRatio)),
    lowerCount: Math.max(1, Math.round(baseCount * lowerRatio)),
    upperCount: Math.max(1, Math.round(baseCount * upperRatio)),
    description
  };
}

function parseVolumeTarget(rawValue, baseCount, mode) {
  const value = String(rawValue || "")
    .trim()
    .replace(/,/g, "")
    .replace(/\s/g, "")
    .replace(/％/g, "%");

  if (!value) {
    return null;
  }

  if (mode === "percent") {
    const percentMatch = value.match(/^(\d+(?:\.\d+)?)%?$/);

    if (!percentMatch) {
      return null;
    }

    const percent = Number(percentMatch[1]);
    const targetRatio = percent / 100;

    return buildVolumeTarget(
      baseCount,
      mode,
      targetRatio,
      `원문 대비 약 ${formatPercentValue(targetRatio)}`
    );
  }

  if (mode === "range") {
    const rangeMatch = value.match(/^(\d+(?:\.\d+)?)[~-](\d+(?:\.\d+)?)%?$/);

    if (!rangeMatch) {
      return null;
    }

    let lowerRatio = Number(rangeMatch[1]) / 100;
    let upperRatio = Number(rangeMatch[2]) / 100;

    if (lowerRatio > upperRatio) {
      const temp = lowerRatio;
      lowerRatio = upperRatio;
      upperRatio = temp;
    }

    const targetRatio = (lowerRatio + upperRatio) / 2;

    return {
      mode,
      modeLabel: getVolumeModeLabel(mode),
      targetRatio,
      lowerRatio,
      upperRatio,
      targetCount: Math.max(1, Math.round(baseCount * targetRatio)),
      lowerCount: Math.max(1, Math.round(baseCount * lowerRatio)),
      upperCount: Math.max(1, Math.round(baseCount * upperRatio)),
      description: `원문 대비 ${formatPercentValue(lowerRatio)}~${formatPercentValue(upperRatio)}`
    };
  }

  if (mode === "multiple") {
    const multipleMatch = value.match(/^(\d+(?:\.\d+)?)(?:배|x|X)?$/);

    if (!multipleMatch) {
      return null;
    }

    const targetRatio = Number(multipleMatch[1]);

    return buildVolumeTarget(
      baseCount,
      mode,
      targetRatio,
      `원문 대비 약 ${targetRatio}배(${formatPercentValue(targetRatio)})`
    );
  }

  if (mode === "fraction") {
    const fractionMatch = value.match(/^(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);

    if (!fractionMatch) {
      return null;
    }

    const numerator = Number(fractionMatch[1]);
    const denominator = Number(fractionMatch[2]);

    if (!denominator) {
      return null;
    }

    const targetRatio = numerator / denominator;

    return buildVolumeTarget(
      baseCount,
      mode,
      targetRatio,
      `원문 대비 약 ${value} 수준(${formatPercentValue(targetRatio)})`
    );
  }

  return null;
}

function getTargetInputErrorMessage(mode) {
  const messages = {
    percent: "퍼센트 모드에서는 50 또는 150처럼 입력해 주세요.",
    range: "퍼센트 범위 모드에서는 45~55 또는 145~155처럼 입력해 주세요.",
    multiple: "배수 모드에서는 0.5 또는 1.5처럼 입력해 주세요.",
    fraction: "분수/비율 모드에서는 1/2 또는 3/2처럼 입력해 주세요."
  };

  return messages[mode] || messages.percent;
}

function buildLengthAdjustmentPrompt() {
  const originalText = finalReportInput.value.trim();
  const volumeMode = volumeModeSelect.value || "percent";
  const rawTargetLength = targetLengthInput.value.trim() || getDefaultTargetByMode(volumeMode);

  if (!originalText) {
    alert("먼저 보고서 초안을 붙여넣어 주세요.");
    return null;
  }

  const basisCount = countKoreanChars(originalText, "공백 포함");
  const volumeTarget = parseVolumeTarget(rawTargetLength, basisCount, volumeMode);

  if (!volumeTarget) {
    alert(getTargetInputErrorMessage(volumeMode));
    return null;
  }

  const adjustmentDirection = volumeTarget.targetRatio < 0.95
    ? "축약"
    : volumeTarget.targetRatio > 1.05
      ? "확장"
      : "유지 또는 미세 조정";

  const targetRatioText = formatPercentValue(volumeTarget.targetRatio);
  const lowerRatioText = formatPercentValue(volumeTarget.lowerRatio);
  const upperRatioText = formatPercentValue(volumeTarget.upperRatio);

  return `
[원문 대비 분량 비율 조정 AI 최종 조정 프롬프트]

너는 한국어 보고서 전문 편집자다.
아래 원문을 목표 분량 비율에 맞게 편집하라.

────────────────────
[최우선 규칙]
────────────────────

이번 작업의 최우선 목표는 특정 글자 수 기준을 맞추는 것이 아니라 원문 대비 분량 비율을 맞추는 것이다.

글자 수는 비율 판단을 위한 참고값으로만 사용한다.

공백 포함/공백 제외 같은 글자 수 기준 선택은 사용하지 않는다.

원문 대비 분량 비율이 지정 범위 안에 들어오면 성공으로 간주한다.

특정 글자 수를 억지로 맞추기 위해 문장을 부자연스럽게 늘리거나 줄이지 않는다.

────────────────────
[이번 작업의 분량 조건]
────────────────────

- 조정 방식: ${volumeTarget.modeLabel}
- 사용자가 입력한 목표 값: ${rawTargetLength}
- 적용된 목표 해석: ${volumeTarget.description}
- 조정 방향: ${adjustmentDirection}

[분량 산정 기준]
- 적용 기준: 원문 전체 분량 대비 비율
- 원문 기준 분량: ${basisCount.toLocaleString()}자(공백 포함 참고값)
- 목표 참고 분량: 약 ${volumeTarget.targetCount.toLocaleString()}자
- 허용 범위: 약 ${volumeTarget.lowerCount.toLocaleString()}자 ~ ${volumeTarget.upperCount.toLocaleString()}자
- 목표 비율: 원문 대비 약 ${targetRatioText}
- 허용 비율: 원문 대비 ${lowerRatioText} ~ ${upperRatioText}

※ 위 글자 수는 비율 계산을 돕기 위한 공백 포함 참고값이다.
※ 공백 제외 글자 수는 계산에 사용하지 않는다.
※ 최종 판단은 글자 수 기준이 아니라 원문 대비 분량 비율 기준으로 한다.

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
2. 참고 글자 수로 보면 약 ${volumeTarget.lowerCount.toLocaleString()}자 ~ ${volumeTarget.upperCount.toLocaleString()}자 범위인지 확인한다.
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

function openReportDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("이 브라우저는 IndexedDB를 지원하지 않습니다."));
      return;
    }

    const request = indexedDB.open(REPORT_DB_NAME, REPORT_DB_VERSION);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(FOLDER_STORE_NAME)) {
        const folderStore = db.createObjectStore(FOLDER_STORE_NAME, { keyPath: "id" });
        folderStore.createIndex("createdAt", "createdAt", { unique: false });
      }

      if (!db.objectStoreNames.contains(REPORT_STORE_NAME)) {
        const reportStore = db.createObjectStore(REPORT_STORE_NAME, { keyPath: "id" });
        reportStore.createIndex("folderId", "folderId", { unique: false });
        reportStore.createIndex("createdAt", "createdAt", { unique: false });
      }
    };

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function () {
      reject(request.error || new Error("보고서 저장소를 열 수 없습니다."));
    };
  });
}

function createStorageId(prefix) {
  if (window.crypto && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function runReportStore(storeName, mode, callback) {
  return openReportDatabase().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      const request = callback(store);

      request.onsuccess = function () {
        resolve(request.result);
      };

      request.onerror = function () {
        reject(request.error || new Error("저장소 작업 중 오류가 발생했습니다."));
      };

      transaction.oncomplete = function () {
        db.close();
      };

      transaction.onerror = function () {
        db.close();
        reject(transaction.error || new Error("저장소 작업 중 오류가 발생했습니다."));
      };
    });
  });
}

function getAllFromStore(storeName) {
  return runReportStore(storeName, "readonly", (store) => store.getAll());
}

function addToStore(storeName, value) {
  return runReportStore(storeName, "readwrite", (store) => store.add(value));
}

function putToStore(storeName, value) {
  return runReportStore(storeName, "readwrite", (store) => store.put(value));
}

function deleteFromStore(storeName, id) {
  return runReportStore(storeName, "readwrite", (store) => store.delete(id));
}

async function getReportFolders() {
  const folders = await getAllFromStore(FOLDER_STORE_NAME);

  return folders.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

async function getStoredReports() {
  const reports = await getAllFromStore(REPORT_STORE_NAME);

  return reports.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

async function ensureDefaultReportFolder() {
  const folders = await getReportFolders();

  if (folders.length > 0) {
    return folders[0];
  }

  const now = new Date().toISOString();
  const defaultFolder = {
    id: createStorageId("folder"),
    name: "기본 폴더",
    createdAt: now,
    updatedAt: now
  };

  await addToStore(FOLDER_STORE_NAME, defaultFolder);
  return defaultFolder;
}

function setReportStorageStatus(message, type = "normal") {
  if (!reportStorageStatusMessage) {
    return;
  }

  reportStorageStatusMessage.textContent = message;

  if (type === "success") {
    reportStorageStatusMessage.className = "text-xs text-green-700 leading-relaxed md:pt-3";
  } else if (type === "error") {
    reportStorageStatusMessage.className = "text-xs text-red-700 leading-relaxed md:pt-3";
  } else {
    reportStorageStatusMessage.className = "text-xs text-slate-500 leading-relaxed md:pt-3";
  }
}

function getReportPreviewText(text) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();

  if (normalized.length <= 60) {
    return normalized;
  }

  return `${normalized.slice(0, 60)}...`;
}

function formatStoredDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function formatStorageDateSummary(item, createdLabel = "저장", updatedLabel = "수정") {
  const createdText = formatStoredDate(item.createdAt);
  const updatedText = formatStoredDate(item.updatedAt);

  if (!createdText && !updatedText) {
    return "";
  }

  if (!updatedText || updatedText === createdText) {
    return `${createdLabel} ${createdText}`;
  }

  return `${createdLabel} ${createdText} / ${updatedLabel} ${updatedText}`;
}

function getSampleReportInputByIndex(index = activeStorageSampleIndex) {
  const sampleInputs = Array.from(document.querySelectorAll(".sample-report-input"));
  const numericIndex = Number(index);

  if (!Number.isInteger(numericIndex) || numericIndex < 0) {
    return sampleInputs[0] || null;
  }

  return sampleInputs[numericIndex] || sampleInputs[0] || null;
}

function getTextForStorage(index = activeStorageSampleIndex) {
  const targetInput = getSampleReportInputByIndex(index);

  return targetInput ? targetInput.value.trim() : "";
}

function getDefaultReportTitle(text) {
  const firstLine = String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0);

  if (firstLine) {
    return firstLine.length > 30 ? firstLine.slice(0, 30) : firstLine;
  }

  return `과거 보고서 ${formatStoredDate(new Date().toISOString())}`;
}

function insertReportIntoSampleInput(text, index = activeStorageSampleIndex) {
  const targetInput = getSampleReportInputByIndex(index);

  if (!targetInput) {
    return false;
  }

  targetInput.value = text;
  targetInput.focus();
  refreshDynamicInputs();
  return true;
}

async function renderReportStorage() {
  ensureReportStorageElements();

  if (!reportStoragePanel || !folderSelectForSave || !reportStorageList) {
    return;
  }

  try {
    await ensureDefaultReportFolder();
    const folders = await getReportFolders();
    const reports = await getStoredReports();
    const selectedFolderId = folderSelectForSave.value;

    folderSelectForSave.innerHTML = folders
      .map((folder) => `<option value="${folder.id}">${escapeHtml(folder.name)}</option>`)
      .join("");

    if (selectedFolderId && folders.some((folder) => folder.id === selectedFolderId)) {
      folderSelectForSave.value = selectedFolderId;
    }

    reportStorageList.innerHTML = folders.map((folder) => {
      const folderReports = reports.filter((report) => report.folderId === folder.id);
      const reportItems = folderReports.length
        ? folderReports.map((report) => `
          <div class="border border-indigo-100 rounded-xl p-3 bg-indigo-50/40 space-y-2">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p class="text-sm font-bold text-indigo-700 break-words">${escapeHtml(report.title)}</p>
                <p class="text-xs text-slate-500 mt-1">${escapeHtml(formatStorageDateSummary(report, "저장", "수정"))}</p>
              </div>

              <div class="flex shrink-0 items-center gap-2 flex-wrap justify-end">
                <button
                  type="button"
                  class="load-stored-report-btn px-3 py-1 rounded-lg border border-indigo-200 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                  data-report-id="${report.id}"
                >
                  불러오기
                </button>

                <button
                  type="button"
                  class="rename-stored-report-btn px-3 py-1 rounded-lg border border-indigo-200 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                  data-report-id="${report.id}"
                >
                  이름변경
                </button>

                <button
                  type="button"
                  class="delete-stored-report-btn px-3 py-1 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50"
                  data-report-id="${report.id}"
                >
                  삭제
                </button>
              </div>
            </div>

            <p class="text-xs text-slate-600 leading-relaxed break-words">${escapeHtml(getReportPreviewText(report.content))}</p>
          </div>
        `).join("")
        : `<p class="text-xs text-slate-500 leading-relaxed">아직 저장된 보고서가 없습니다.</p>`;

      return `
        <div class="sample-report-row bg-white border border-indigo-200 rounded-xl p-4 space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="text-sm font-bold text-indigo-700 break-words">📁 ${escapeHtml(folder.name)}</p>
              <p class="text-xs text-slate-500 mt-1">${escapeHtml(formatStorageDateSummary(folder, "생성", "수정"))}</p>
            </div>
            <div class="flex shrink-0 items-center gap-2 flex-wrap justify-end">
              <span class="text-xs text-indigo-500">${folderReports.length}/${MAX_REPORTS_PER_FOLDER}</span>
              <button
                type="button"
                class="rename-folder-btn px-3 py-1 rounded-lg border border-indigo-200 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                data-folder-id="${folder.id}"
              >
                폴더명 변경
              </button>
              <button
                type="button"
                class="delete-folder-btn px-3 py-1 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50"
                data-folder-id="${folder.id}"
              >
                폴더 삭제
              </button>
            </div>
          </div>
          <div class="space-y-2">
            ${reportItems}
          </div>
        </div>
      `;
    }).join("");
  } catch (error) {
    setReportStorageStatus(error.message || "보고서 저장소를 불러오지 못했습니다.", "error");
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function openReportStoragePanel(mode = "load", sampleIndex = 0) {
  ensureReportStorageElements();

  if (!reportStoragePanel) {
    alert("보고서 저장소를 열 수 없습니다.");
    return;
  }

  activeStorageMode = mode;
  activeStorageSampleIndex = Number(sampleIndex) || 0;

  const sampleNumber = activeStorageSampleIndex + 1;

  if (reportStorageModeText) {
    reportStorageModeText.textContent = `참고 보고서 ${sampleNumber}에 연결된 저장소입니다. 저장된 보고서는 현재 브라우저에만 보관됩니다.`;
  }

  applyReportStoragePanelPosition();
  reportStoragePanel.classList.remove("hidden", "translate-x-full", "opacity-0", "pointer-events-none");
  reportStoragePanel.classList.add("translate-x-0", "opacity-100");

  await renderReportStorage();
  applyReportStoragePanelPosition();

  if (confirmSaveReportBtn) {
    confirmSaveReportBtn.textContent = `참고 보고서 ${sampleNumber} 저장`;
  }

  if (mode === "save") {
    const textForStorage = getTextForStorage(activeStorageSampleIndex);

    if (reportTitleForSaveInput && textForStorage) {
      reportTitleForSaveInput.value = getDefaultReportTitle(textForStorage);
    }

    setReportStorageStatus(`참고 보고서 ${sampleNumber} 내용을 저장할 폴더를 선택하세요.`);
  } else {
    setReportStorageStatus(`폴더 안의 보고서를 선택하면 참고 보고서 ${sampleNumber} 칸에 불러옵니다.`);
  }
}

function closeReportStoragePanel() {
  ensureReportStorageElements();

  if (!reportStoragePanel) {
    return;
  }

  reportStoragePanel.classList.remove("translate-x-0", "opacity-100");
  reportStoragePanel.classList.add("translate-x-full", "opacity-0", "pointer-events-none");

  if (reportStoragePositionFrame) {
    window.cancelAnimationFrame(reportStoragePositionFrame);
    reportStoragePositionFrame = null;
  }
}

async function createReportFolder() {
  const folderName = newFolderNameInput.value.trim();

  if (!folderName) {
    alert("새 주제 폴더명을 입력해 주세요.");
    return;
  }

  try {
    const folders = await getReportFolders();

    if (folders.some((folder) => folder.name === folderName)) {
      alert("이미 같은 이름의 주제 폴더가 있습니다.");
      return;
    }

    const now = new Date().toISOString();

    await addToStore(FOLDER_STORE_NAME, {
      id: createStorageId("folder"),
      name: folderName,
      createdAt: now,
      updatedAt: now
    });

    newFolderNameInput.value = "";
    setReportStorageStatus("새 주제 폴더가 생성되었습니다.", "success");
    await renderReportStorage();
  } catch (error) {
    setReportStorageStatus(error.message || "주제 폴더를 만들지 못했습니다.", "error");
  }
}

async function saveCurrentSampleReportToStorage() {
  const content = getTextForStorage(activeStorageSampleIndex);

  if (!content) {
    alert(`참고 보고서 ${activeStorageSampleIndex + 1}에 저장할 내용을 먼저 입력해 주세요.`);
    return;
  }

  try {
    await ensureDefaultReportFolder();
    const folders = await getReportFolders();
    const folderId = folderSelectForSave.value || (folders[0] && folders[0].id);

    if (!folderId) {
      alert("저장할 주제 폴더를 먼저 만들어 주세요.");
      return;
    }

    const reports = await getStoredReports();
    const reportsInFolder = reports.filter((report) => report.folderId === folderId);

    if (reportsInFolder.length >= MAX_REPORTS_PER_FOLDER) {
      alert("이 폴더에는 보고서를 최대 10개까지 저장할 수 있습니다.");
      return;
    }

    const title = reportTitleForSaveInput.value.trim() || getDefaultReportTitle(content);
    const now = new Date().toISOString();

    await addToStore(REPORT_STORE_NAME, {
      id: createStorageId("report"),
      folderId,
      title,
      content,
      createdAt: now,
      updatedAt: now
    });

    reportTitleForSaveInput.value = "";
    setReportStorageStatus(`참고 보고서 ${activeStorageSampleIndex + 1} 내용이 저장되었습니다.`, "success");
    await renderReportStorage();
  } catch (error) {
    setReportStorageStatus(error.message || "보고서를 저장하지 못했습니다.", "error");
  }
}

async function loadStoredReport(reportId) {
  try {
    const reports = await getStoredReports();
    const report = reports.find((item) => item.id === reportId);

    if (!report) {
      alert("불러올 보고서를 찾지 못했습니다.");
      return;
    }

    const inserted = insertReportIntoSampleInput(report.content, activeStorageSampleIndex);

    if (inserted) {
      setReportStorageStatus(`저장된 보고서를 참고 보고서 ${activeStorageSampleIndex + 1} 칸에 불러왔습니다.`, "success");
      setTimeout(closeReportStoragePanel, 450);
    }
  } catch (error) {
    setReportStorageStatus(error.message || "보고서를 불러오지 못했습니다.", "error");
  }
}

async function deleteStoredReport(reportId) {
  const shouldDelete = confirm("이 보고서를 저장소에서 삭제할까요?");

  if (!shouldDelete) {
    return;
  }

  try {
    await deleteFromStore(REPORT_STORE_NAME, reportId);
    setReportStorageStatus("저장된 보고서를 삭제했습니다.", "success");
    await renderReportStorage();
  } catch (error) {
    setReportStorageStatus(error.message || "보고서를 삭제하지 못했습니다.", "error");
  }
}

async function renameStoredReport(reportId) {
  try {
    const reports = await getStoredReports();
    const report = reports.find((item) => item.id === reportId);

    if (!report) {
      alert("이름을 변경할 보고서를 찾지 못했습니다.");
      return;
    }

    const nextTitle = prompt("새 보고서 제목을 입력해 주세요.", report.title);

    if (nextTitle === null) {
      return;
    }

    const trimmedTitle = nextTitle.trim();

    if (!trimmedTitle) {
      alert("보고서 제목을 입력해 주세요.");
      return;
    }

    await putToStore(REPORT_STORE_NAME, {
      ...report,
      title: trimmedTitle,
      updatedAt: new Date().toISOString()
    });

    setReportStorageStatus("보고서 이름을 변경했습니다.", "success");
    await renderReportStorage();
  } catch (error) {
    setReportStorageStatus(error.message || "보고서 이름을 변경하지 못했습니다.", "error");
  }
}

async function renameReportFolder(folderId) {
  try {
    const folders = await getReportFolders();
    const folder = folders.find((item) => item.id === folderId);

    if (!folder) {
      alert("이름을 변경할 주제 폴더를 찾지 못했습니다.");
      return;
    }

    const nextName = prompt("새 주제 폴더명을 입력해 주세요.", folder.name);

    if (nextName === null) {
      return;
    }

    const trimmedName = nextName.trim();

    if (!trimmedName) {
      alert("주제 폴더명을 입력해 주세요.");
      return;
    }

    if (folders.some((item) => item.id !== folderId && item.name === trimmedName)) {
      alert("이미 같은 이름의 주제 폴더가 있습니다.");
      return;
    }

    await putToStore(FOLDER_STORE_NAME, {
      ...folder,
      name: trimmedName,
      updatedAt: new Date().toISOString()
    });

    setReportStorageStatus("주제 폴더명을 변경했습니다.", "success");
    await renderReportStorage();
  } catch (error) {
    setReportStorageStatus(error.message || "주제 폴더명을 변경하지 못했습니다.", "error");
  }
}

async function deleteReportFolder(folderId) {
  try {
    const folders = await getReportFolders();
    const folder = folders.find((item) => item.id === folderId);

    if (!folder) {
      alert("삭제할 주제 폴더를 찾지 못했습니다.");
      return;
    }

    const reports = await getStoredReports();
    const reportsInFolder = reports.filter((report) => report.folderId === folderId);
    const confirmMessage = reportsInFolder.length
      ? `이 주제 폴더와 폴더 안의 보고서 ${reportsInFolder.length}개를 모두 삭제할까요?`
      : "이 주제 폴더를 삭제할까요?";

    if (!confirm(confirmMessage)) {
      return;
    }

    for (const report of reportsInFolder) {
      await deleteFromStore(REPORT_STORE_NAME, report.id);
    }

    await deleteFromStore(FOLDER_STORE_NAME, folderId);
    await ensureDefaultReportFolder();

    setReportStorageStatus("주제 폴더를 삭제했습니다.", "success");
    await renderReportStorage();
  } catch (error) {
    setReportStorageStatus(error.message || "주제 폴더를 삭제하지 못했습니다.", "error");
  }
}

addSourceLinkBtn.addEventListener("click", addSourceLinkInput);
addSampleReportBtn.addEventListener("click", addSampleReportInput);

if (saveReportToStorageBtn) {
  saveReportToStorageBtn.addEventListener("click", function () {
    openReportStoragePanel("save");
  });
}

ensureReportStorageElements();

if (openReportStorageBtn) {
  openReportStorageBtn.addEventListener("click", function () {
    openReportStoragePanel("load");
  });
}

if (closeReportStorageBtn) {
  closeReportStorageBtn.addEventListener("click", closeReportStoragePanel);
}

if (createFolderBtn) {
  createFolderBtn.addEventListener("click", createReportFolder);
}

if (confirmSaveReportBtn) {
  confirmSaveReportBtn.addEventListener("click", saveCurrentSampleReportToStorage);
}

window.addEventListener("resize", requestReportStoragePanelPositionUpdate);
window.addEventListener("scroll", requestReportStoragePanelPositionUpdate, { passive: true });

if (reportStorageList) {
  reportStorageList.addEventListener("click", function (event) {
    const loadButton = event.target.closest(".load-stored-report-btn");
    const renameReportButton = event.target.closest(".rename-stored-report-btn");
    const deleteButton = event.target.closest(".delete-stored-report-btn");
    const renameFolderButton = event.target.closest(".rename-folder-btn");
    const deleteFolderButton = event.target.closest(".delete-folder-btn");

    if (loadButton) {
      loadStoredReport(loadButton.dataset.reportId);
    }

    if (renameReportButton) {
      renameStoredReport(renameReportButton.dataset.reportId);
    }

    if (deleteButton) {
      deleteStoredReport(deleteButton.dataset.reportId);
    }

    if (renameFolderButton) {
      renameReportFolder(renameFolderButton.dataset.folderId);
    }

    if (deleteFolderButton) {
      deleteReportFolder(deleteFolderButton.dataset.folderId);
    }
  });
}

sourceLinksContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-source-link-btn")) {
    removeSourceLinkInput(event.target);
  }
});

sampleReportsContainer.addEventListener("click", function (event) {
  const saveButton = event.target.closest(".save-sample-report-btn");
  const loadButton = event.target.closest(".load-sample-report-btn");

  if (saveButton) {
    openReportStoragePanel("save", saveButton.dataset.sampleIndex);
    return;
  }

  if (loadButton) {
    openReportStoragePanel("load", loadButton.dataset.sampleIndex);
    return;
  }

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

volumeModeSelect.addEventListener("change", updateVolumeModeGuide);

previousTrendSignSelect.addEventListener("change", updateTrendPreview);
previousTrendRateInput.addEventListener("input", updateTrendPreview);
trendDirectionSelect.addEventListener("change", updateTrendPreview);
trendRateInput.addEventListener("input", updateTrendPreview);

finalReportInput.addEventListener("input", updateDraftCharacterCount);
finalReportBox.addEventListener("input", updateFinalReportCharacterCount);

copyFinalReportBtn.addEventListener("click", copyFinalReport);

if (sourceLinksContainer.querySelectorAll(".source-link-row").length === 0) {
  addSourceLinkInput();
}

if (sampleReportsContainer.querySelectorAll(".sample-report-row").length === 0) {
  addSampleReportInput();
}

refreshDynamicInputs();
updateDraftCharacterCount();
updateFinalReportCharacterCount();
updateVolumeModeGuide();
updateTrendPreview();
ensureDefaultReportFolder().catch(function () {
  setReportStorageStatus("보고서 저장소 초기화가 필요합니다.", "error");
});
