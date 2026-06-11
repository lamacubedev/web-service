const SHEET_NAME = "문의내용";
const HEADERS = [
  "접수 시각",
  "서비스 ID",
  "서비스명",
  "페이지 URL",
  "문의 유형",
  "이름",
  "회신 이메일",
  "제목",
  "문의 내용",
];

function doGet() {
  const properties = PropertiesService.getScriptProperties();
  return jsonOutput_({
    ok: true,
    service: "menu-rush-contact",
    configured: Boolean(
      properties.getProperty("CONTACT_SHARED_SECRET")
      && properties.getProperty("CONTACT_SPREADSHEET_ID")
    ),
  });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const properties = PropertiesService.getScriptProperties();
    const expectedSecret = properties.getProperty("CONTACT_SHARED_SECRET");
    const spreadsheetId = properties.getProperty("CONTACT_SPREADSHEET_ID");

    if (!expectedSecret || data.secret !== expectedSecret) {
      return jsonOutput_({ ok: false, error: "Unauthorized" });
    }
    if (!spreadsheetId) {
      return jsonOutput_({ ok: false, error: "Spreadsheet is not configured" });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
      if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
      sheet.appendRow([
        new Date(),
        safeCell_(data.serviceId),
        safeCell_(data.serviceName),
        safeCell_(data.pageUrl),
        safeCell_(data.category),
        safeCell_(data.name),
        safeCell_(data.email),
        safeCell_(data.subject),
        safeCell_(data.message),
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonOutput_({ ok: true });
  } catch (error) {
    return jsonOutput_({ ok: false, error: String(error) });
  }
}

function testConfiguration() {
  const properties = PropertiesService.getScriptProperties();
  const expectedSecret = properties.getProperty("CONTACT_SHARED_SECRET");
  const spreadsheetId = properties.getProperty("CONTACT_SPREADSHEET_ID");

  if (!expectedSecret) throw new Error("CONTACT_SHARED_SECRET 스크립트 속성이 없습니다.");
  if (!spreadsheetId) throw new Error("CONTACT_SPREADSHEET_ID 스크립트 속성이 없습니다.");

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  console.log(`연결 성공: ${spreadsheet.getName()} / ${sheet.getName()}`);
}

function safeCell_(value) {
  const text = String(value || "").trim();
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function jsonOutput_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
