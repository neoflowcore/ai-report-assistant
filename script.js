const generateBtn = document.getElementById("generateBtn");
const resultBox = document.getElementById("resultBox");

generateBtn.addEventListener("click", function () {
  const region = document.getElementById("regionInput").value.trim();
  const news = document.getElementById("newsInput").value.trim();
  const issue = document.getElementById("issueInput").value.trim();
  const rate = document.getElementById("rateInput").value.trim();
  const sample = document.getElementById("sampleInput").value.trim();

  if (!region) {
    alert("지역을 입력해주세요.");
    return;
  }

  const prompt = `
[AI 지역분석 보고서 작성 프롬프트]

당신은 지역 부동산 동향을 분석하는 전문 보고서 작성 어시스턴트입니다.
아래 입력 자료를 바탕으로 공공기관 내부 보고서 형식의 지역분석 보고서 초안을 작성하세요.

1. 분석 지역:
${region}

2. 관련 뉴스 링크:
${news || "입력된 뉴스 링크 없음"}

3. 지역 부동산 이슈:
${issue || "입력된 부동산 이슈 없음"}

4. 현장 조사 변동률:
${rate || "입력된 변동률 없음"}

5. 참고할 과거 우수 보고서 형식:
${sample || "입력된 참고 보고서 없음"}

작성 기준:
- 제목은 간결하고 공식적으로 작성
- 지역 현황, 주요 이슈, 변동 요인, 현장 의견, 종합 판단 순서로 구성
- 단순 나열이 아니라 원인과 영향을 분석
- 문체는 보고서형 문장으로 작성
- 과장된 표현은 피하고 객관적인 표현 사용
`;

  const report = `
[${region} 지역 부동산 동향 분석 보고서]

1. 검토 배경

본 보고서는 ${region} 지역의 최근 부동산 시장 동향과 현장 조사 내용을 종합하여 작성한 초안입니다. 
관련 뉴스, 지역 내 주요 이슈, 현장 조사 변동률, 과거 우수 보고서 형식을 참고하여 지역 시장의 변화 흐름을 파악하는 데 목적이 있습니다.

2. 지역 현황

${region} 지역은 최근 부동산 시장의 변동성이 확대되고 있는 지역으로, 거래량, 가격 흐름, 개발 이슈, 생활 인프라 변화 등이 복합적으로 작용하고 있습니다. 
특히 현장 조사 결과와 외부 보도자료를 함께 검토할 필요가 있습니다.

3. 주요 뉴스 및 이슈

관련 뉴스:
${news || "관련 뉴스 링크가 입력되지 않았습니다."}

지역 부동산 이슈:
${issue || "지역 부동산 이슈가 입력되지 않았습니다."}

위 내용을 종합하면, 해당 지역의 부동산 시장은 단일 요인보다는 지역 개발, 수요 변화, 정책 환경, 현장 체감 분위기 등이 함께 영향을 미치고 있는 것으로 보입니다.

4. 현장 조사 변동률 분석

입력된 변동률:
${rate || "변동률이 입력되지 않았습니다."}

해당 변동률은 현장 조사 과정에서 확인된 시장 분위기를 수치화한 자료로 볼 수 있습니다. 
변동률이 상승세를 보이는 경우에는 매수 문의 증가, 개발 기대감, 공급 부족 등의 요인을 검토할 필요가 있으며, 
하락세를 보이는 경우에는 거래 위축, 금리 부담, 매수 심리 약화 등의 요인을 함께 분석할 필요가 있습니다.

5. 종합 판단

${region} 지역은 최근 부동산 관련 이슈와 현장 조사 결과를 종합적으로 검토할 때, 단기적 시장 변화뿐 아니라 중장기적 지역 여건 변화까지 함께 살펴볼 필요가 있습니다. 
향후 보고서 작성 시에는 거래량 추이, 가격 변동률, 주요 개발계획, 현장 의견 등을 추가로 반영하면 보다 완성도 높은 분석이 가능할 것으로 판단됩니다.

6. AI 변환 프롬프트

${prompt}
`;

  resultBox.textContent = report;
});
