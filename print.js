/* 옥빛중 2027 담임 및 교무분장 희망원 — 공통 설정 및 출력 양식 */
const SCHOOL = "옥빛중학교";
const YEAR = 2027;

// 시트 "설정" 탭을 불러오지 못할 때 쓰는 기본 목록 (2026학년도 업무분장 기준)
const DEFAULT_CONFIG = {
  depts: [
    { name: "교무기획부", tasks: ["인사", "생기부", "성적", "특수"] },
    { name: "교육과정부", tasks: ["자유학기", "창체"] },
    { name: "교육연구부", tasks: ["평가", "학력향상", "사서"] },
    { name: "생활인권부", tasks: ["학폭책임교사", "학폭", "생활인권교육", "전문상담", "보건"] },
    { name: "학생자치부", tasks: ["자치"] },
    { name: "창의인성부", tasks: ["인성", "교원역량"] },
    { name: "정보환경부", tasks: ["과학", "환경"] },
    { name: "안전예체부", tasks: ["예술방과후", "안전", "영양"] },
    { name: "진로상담부", tasks: ["교육복지"] },
    { name: "1학년부", tasks: [] },
    { name: "2학년부", tasks: [] },
    { name: "3학년부", tasks: [] }
  ],
  grades: ["1학년", "2학년", "3학년"],
  teachers: []
};

function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}
function nl(s) { return esc(s).replace(/\n/g, "<br>"); }
function fmtDate(iso) {
  if (!iso) return `${YEAR - 1}년 &nbsp;&nbsp;월 &nbsp;&nbsp;일`;
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

const PRINT_CSS = `
.pf{font-family:"Noto Sans KR","Malgun Gothic",sans-serif;color:#000;background:#fff;max-width:760px;margin:0 auto 24px;padding:18px 20px;border:1px solid #ccc}
.pf h1{text-align:center;font-size:21px;margin:4px 0 2px;letter-spacing:1px}
.pf .subt{text-align:center;font-size:12px;margin:0 0 10px}
.pf table{border-collapse:collapse;width:100%;table-layout:fixed;font-size:12.5px}
.pf td{border:1px solid #000;padding:5px 6px;vertical-align:middle;word-break:keep-all;overflow-wrap:anywhere}
.pf td.h{background:#f0f0f0;text-align:center;font-weight:700}
.pf td.c{text-align:center}
.pf td.tall{height:150px;vertical-align:top}
.pf .small{font-size:11px;color:#333}
.pf .sig{margin-top:10px;font-size:13.5px;line-height:1.9}
.pf .sig .r{text-align:right}
.pf .to{font-size:17px;font-weight:700;margin-top:8px}
.pf .cs{margin-top:10px;border:1px solid #000;padding:6px 8px}
.pf .cs .ct{font-weight:700;font-size:12px;margin-bottom:4px}
.pf .cs table td{font-size:10.5px;line-height:1.4;padding:3px 5px}
.pf .cs p{font-size:10.5px;line-height:1.5;margin:5px 0 0}
.pf .box{display:inline-block;width:13px;height:13px;border:1.5px solid #000;vertical-align:-2px;text-align:center;line-height:11px;font-size:12px;font-weight:700}
.pf .page{break-after:page;page-break-after:always}
.pf .page:last-child{break-after:auto;page-break-after:auto}
@media print{
  @page{size:A4 portrait;margin:14mm 13mm 12mm 13mm}
  .pf{border:none;max-width:none;margin:0;padding:0}
  .pf + .pf{break-before:page;page-break-before:always}
}`;

function injectPrintCss() {
  if (document.getElementById("pfcss")) return;
  const s = document.createElement("style"); s.id = "pfcss"; s.textContent = PRINT_CSS;
  document.head.appendChild(s);
}

const OX = v => v === "O" ? "○" : v === "X" ? "X" : "";

// d: 제출 데이터 1건 → 희망원 + 동의서 (A4 2쪽)
function renderForm(d) {
  const heads = (d.heads || []).filter(h => h && h.dept);
  const headTxt = [0, 1, 2].map(i => heads[i] ? `( ${esc(heads[i].dept)} )부장 ( ${esc(heads[i].years)} )년` : "(　　　)부장 (　)년").join(", ");
  const pick = (arr, i) => esc((arr || [])[i] || "");
  const nonPick = i => { const p = (d.nonPicks || [])[i] || {}; return p.dept ? esc(p.dept + (p.task ? " – " + p.task : "")) : ""; };
  const t = d.transfer || {};
  const transferTxt = d.staff === "신규" ? "신규교사 (해당 없음)" : t.is ? `전임교: ${esc(t.school)} &nbsp; 보직: ${esc(t.post)} &nbsp; 담당학년: ${esc(t.grade)} &nbsp; 담당업무: ${esc(t.task)}` : "전 임 교 : &nbsp;&nbsp;&nbsp;&nbsp; 보 직 : &nbsp;&nbsp;&nbsp;&nbsp; 담당학년 : &nbsp;&nbsp;&nbsp;&nbsp; 담당업무 :";
  const agree = d.consent === "동의";
  return `
<div class="pf">
 <div class="page">
  <h1>${YEAR}학년도 담임 및 교무분장 희망원</h1>
  <p class="subt">(빈칸 없이 모두 작성해 주세요.)</p>
  <table>
   <colgroup><col style="width:13%"><col style="width:20%"><col style="width:12%"><col style="width:15%"><col style="width:12%"><col style="width:28%"></colgroup>
   <tr><td class="h">성명</td><td class="c">${esc(d.name)}</td><td class="h">생년월일</td><td class="c">${esc(d.birth)}</td><td class="h">소지자격</td><td class="c">${esc(d.license)}</td></tr>
   <tr><td class="h">발령교과</td><td class="c">${esc(d.subject)}</td><td class="h">휴대폰</td><td class="c" colspan="3">${esc(d.phone)}</td></tr>
   <tr><td class="h">주소</td><td colspan="5">${esc(d.address)}</td></tr>
   <tr><td class="h">교육 경력</td><td class="c">${esc(d.careerYears)} 년</td><td class="h">본교 발령일</td><td class="c">${esc(d.arrivalDate || (d.staff === "전입" ? "(전입)" : d.staff === "신규" ? "(신규)" : ""))}</td><td class="h small">${YEAR - 1}학년도<br>담당업무</td><td class="c">${esc(d.cur)}</td></tr>
   <tr><td class="h" rowspan="2">주요 경력</td><td class="h">보직(부장)</td><td colspan="4">${headTxt}</td></tr>
   <tr><td class="h">담임</td><td colspan="4">중학교 ( ${esc(d.hrMid ?? "")} )년 &nbsp;&nbsp;&nbsp; 고등학교 ( ${esc(d.hrHigh ?? "")} )년</td></tr>
   <tr><td class="h" rowspan="2">부장<br>희망 여부</td><td class="c" rowspan="2" style="font-size:16px">${OX(d.wantHead)}</td><td class="h" rowspan="2">희망시<br>부장명</td><td colspan="3" class="small c">1, 2, 3지망 다른 부서 기입</td></tr>
   <tr><td colspan="3">1지망: ${pick(d.headPicks, 0)} &nbsp;&nbsp; 2지망: ${pick(d.headPicks, 1)} &nbsp;&nbsp; 3지망: ${pick(d.headPicks, 2)}</td></tr>
   <tr><td class="h" rowspan="2">담임<br>희망 여부</td><td class="c" rowspan="2" style="font-size:16px">${OX(d.wantHR)}</td><td class="h" rowspan="2">희망 학년</td><td colspan="3" class="small c">1, 2, 3지망 다른 학년 기입</td></tr>
   <tr><td colspan="3">1지망: ${pick(d.hrPicks, 0)} &nbsp;&nbsp; 2지망: ${pick(d.hrPicks, 1)} &nbsp;&nbsp; 3지망: ${pick(d.hrPicks, 2)}</td></tr>
   <tr><td class="h" rowspan="2">비담임<br>희망 여부</td><td class="c" rowspan="2" style="font-size:16px">${OX(d.wantNon)}</td><td class="h" rowspan="2">희망시<br>부서명</td><td colspan="3" class="small c">1, 2, 3지망 다른 부서 기입</td></tr>
   <tr><td colspan="3">1지망: ${nonPick(0)}<br>2지망: ${nonPick(1)}<br>3지망: ${nonPick(2)}</td></tr>
   <tr><td class="h" colspan="2">${YEAR - 1}학년도 보직 및 담당업무<br><span class="small">(전입교사만 작성)</span></td><td colspan="4">${transferTxt}</td></tr>
   <tr><td class="h" colspan="2">희망 사유 및 참고사항<br><span class="small">(희망 업무를 맡고자 하는 이유,<br>업무 배정 시 참고사항 등)</span></td><td colspan="4" class="tall">${nl(d.reason)}</td></tr>
  </table>
  <div class="cs">
   <div class="ct">개인정보 수집·이용 동의서</div>
   <table>
    <colgroup><col style="width:17%"><col style="width:63%"><col style="width:20%"></colgroup>
    <tr><td class="h">수집·이용 목적</td><td class="h">수집범위</td><td class="h">보유·이용기간</td></tr>
    <tr><td class="c">학교업무<br>(담임 및 교무분장 배정)</td>
        <td>필수: 성명, 생년월일, 주소, 연락처 · 부가: 소지자격, 발령교과, 교육경력, 본교 발령일, 주요경력, 담당업무, 희망사항</td>
        <td class="c">1년 후 파기</td></tr>
   </table>
   <p>◦ 동의를 거부할 수 있으나, 업무 처리에 번거로움이 발생할 수 있습니다. ◦ 위 수집·이용 목적, 항목, 보유기간 및 동의 거부 권리에 대해 안내받았으며 이에 동의합니다.
   &nbsp; ( 동의 <span class="box">${agree ? "✓" : ""}</span> &nbsp; 미동의 <span class="box">${d.consent === "미동의" ? "✓" : ""}</span> )</p>
  </div>
  <div class="sig">
   <div>위와 같이 ${YEAR}학년도 담임 및 교무분장 희망원을 작성하여 제출합니다.</div>
   <div class="r">${fmtDate(d.submittedAt)}</div>
   <div class="r">작성자 &nbsp; 성명 &nbsp; <b>${esc(d.name)}</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (서명 또는 인)</div>
  </div>
  <div class="to">${SCHOOL}장 귀하</div>
 </div>
</div>`;
}
