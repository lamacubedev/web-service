const elements = {
  loginPanel: document.querySelector("#loginPanel"),
  loginForm: document.querySelector("#adminLoginForm"),
  token: document.querySelector("#adminToken"),
  loginStatus: document.querySelector("#loginStatus"),
  dashboard: document.querySelector("#dashboard"),
  range: document.querySelector("#rangeSelect"),
  refresh: document.querySelector("#refreshButton"),
  logout: document.querySelector("#logoutButton"),
  generatedAt: document.querySelector("#generatedAt"),
  visitorCount: document.querySelector("#visitorCount"),
  pageviewCount: document.querySelector("#pageviewCount"),
  viewsPerVisitor: document.querySelector("#viewsPerVisitor"),
  dailyChart: document.querySelector("#dailyChart"),
};

function number(value) {
  return new Intl.NumberFormat("ko-KR").format(Number(value) || 0);
}

function makeTable(rows, firstKey, firstLabel, secondKey = "pageviews", secondLabel = "조회") {
  if (!rows.length) return '<p class="empty">표시할 데이터가 없습니다.</p>';
  return `
    <table>
      <thead><tr><th>${firstLabel}</th><th>${secondLabel}</th></tr></thead>
      <tbody>${rows.map((row) => `
        <tr><td>${escapeHtml(row[firstKey] || "직접 방문")}</td><td>${number(row[secondKey])}</td></tr>
      `).join("")}</tbody>
    </table>
  `;
}

function escapeHtml(value) {
  const element = document.createElement("span");
  element.textContent = String(value);
  return element.innerHTML;
}

function renderChart(rows) {
  const maximum = Math.max(1, ...rows.map((row) => Number(row.pageviews)));
  elements.dailyChart.innerHTML = rows.map((row) => {
    const height = Math.max(2, Math.round((Number(row.pageviews) / maximum) * 160));
    return `
      <div class="chart-day" title="${escapeHtml(row.date)}: 방문자 ${number(row.visitors)}, 조회 ${number(row.pageviews)}">
        <div class="chart-bar" style="height:${height}px"></div>
        <span>${escapeHtml(row.date.slice(5))}</span>
      </div>
    `;
  }).join("");
}

function render(data) {
  const visitors = Number(data.summary.visitors) || 0;
  const pageviews = Number(data.summary.pageviews) || 0;
  elements.visitorCount.textContent = number(visitors);
  elements.pageviewCount.textContent = number(pageviews);
  elements.viewsPerVisitor.textContent = visitors ? (pageviews / visitors).toFixed(1) : "0";
  elements.generatedAt.textContent = `최근 ${data.days}일 · ${new Date(data.generatedAt).toLocaleString("ko-KR")} 갱신`;
  renderChart(data.daily);
  document.querySelector("#pagesTable").innerHTML = makeTable(data.pages, "path", "페이지");
  let regionNames;
  try {
    regionNames = new Intl.DisplayNames(["ko"], { type: "region" });
  } catch {
    regionNames = null;
  }
  const countries = data.countries.map((row) => ({
    ...row,
    country: regionNames?.of(row.country) || row.country || "알 수 없음",
  }));
  document.querySelector("#countriesTable").innerHTML = makeTable(countries, "country", "국가", "visitors", "방문자");
  document.querySelector("#languagesTable").innerHTML = makeTable(data.languages, "language", "언어");
  document.querySelector("#referrersTable").innerHTML = makeTable(data.referrers, "referrer", "유입 사이트");
}

async function loadStats(token) {
  elements.loginStatus.textContent = "";
  const response = await fetch(`/api/analytics/stats?days=${elements.range.value}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(response.status === 401 ? "관리자 토큰이 올바르지 않습니다." : "통계를 불러오지 못했습니다.");
  const data = await response.json();
  sessionStorage.setItem("menu-rush-admin-token", token);
  render(data);
  elements.loginPanel.hidden = true;
  elements.dashboard.hidden = false;
}

elements.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await loadStats(elements.token.value.trim());
    elements.token.value = "";
  } catch (error) {
    elements.loginStatus.textContent = error.message;
  }
});

elements.refresh.addEventListener("click", () => {
  loadStats(sessionStorage.getItem("menu-rush-admin-token") || "").catch((error) => {
    elements.loginStatus.textContent = error.message;
  });
});
elements.range.addEventListener("change", () => elements.refresh.click());
elements.logout.addEventListener("click", () => {
  sessionStorage.removeItem("menu-rush-admin-token");
  elements.dashboard.hidden = true;
  elements.loginPanel.hidden = false;
  elements.token.focus();
});

const savedToken = sessionStorage.getItem("menu-rush-admin-token");
if (savedToken) loadStats(savedToken).catch(() => sessionStorage.removeItem("menu-rush-admin-token"));
