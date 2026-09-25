const SHEET_NAME = 'Leads';
const HEADERS = ['submittedAt', 'formType', 'name', 'contact', 'question', 'source', 'rawData'];

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
  const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  ensureHeaders_(sheet);
  sheet.appendRow([
    payload.submittedAt || new Date().toISOString(),
    payload.formType || 'general',
    payload.name || '',
    payload.contact || payload.email || payload.phone || '',
    payload.question || payload.course || payload.message || '',
    payload.source || 'website',
    JSON.stringify(payload),
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
}
