/**
 * Consultation file receiver — saves student uploads into your Google Drive folder.
 * Deploy this as a Web App under YOUR Google account (see README.md), then paste
 * the web-app URL into DRIVE_UPLOAD_URL in index.html.
 *
 * Files are named:  "Student Name — Date — original-filename"
 */

var FOLDER_ID = "1CKaDh4QzaiH-7UhoQKrknA9YmghL_L3x";
var MAX_BYTES = 10 * 1024 * 1024; // 10 MB per file

function doPost(e) {
  try {
    var p = JSON.parse(e.postData.contents);
    if (!p.data || !p.filename) throw new Error("Missing file data");

    var bytes = Utilities.base64Decode(p.data);
    if (bytes.length > MAX_BYTES) throw new Error("File too large (max 10 MB)");

    var safeName = String(p.student || "Student").slice(0, 80) + " — " +
                   String(p.date || "").slice(0, 40) + " — " +
                   String(p.filename).slice(0, 120);

    var blob = Utilities.newBlob(bytes, p.mimeType || "application/octet-stream", safeName);
    DriveApp.getFolderById(FOLDER_ID).createFile(blob);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
