/**
 * Student Consultation Schedule — booking backend.
 *
 * Attach this script to a Google Sheet (Extensions → Apps Script), deploy it as a
 * Web App (see README.md), and paste the web-app URL into SCRIPT_URL in index.html.
 *
 * What it does:
 *  - Every booking is appended as a row in the "Bookings" sheet and emailed to you.
 *  - To CONFIRM a booking (and block that slot on the website), type or copy the
 *    time into the "CONFIRMED SLOT" column of that row — e.g.  3:00 PM – 3:30 PM
 *    (easiest: copy it from the "Preferred Times" cell of the same row).
 *  - The website reads the confirmed slots from here and shows them as BOOKED.
 *  - To free a slot again (cancellation), just clear the "CONFIRMED SLOT" cell.
 */

var SHEET_NAME   = "Bookings";
var NOTIFY_EMAIL = "rmguido@rtu.edu.ph";
var SEND_STUDENT_ACK = true;   // set to false to skip the automatic "request received" email to students

var MAX_ATTACH_BYTES = 25 * 1024 * 1024;   // Gmail attachment limit

var HEADERS = ["Timestamp", "Name", "Email", "Matter", "Details",
               "Date", "Date (ISO)", "Preferred Times", "Files", "CONFIRMED SLOT"];

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function isoDate(v) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  return String(v || "").trim();
}

/** The website calls this to learn which slots are confirmed (blocked). */
function doGet(e) {
  try {
    var rows = getSheet().getDataRange().getValues();
    var booked = [];
    for (var i = 1; i < rows.length; i++) {
      var confirmed = String(rows[i][9] || "").trim();   // CONFIRMED SLOT column (J)
      if (confirmed) booked.push({ date: isoDate(rows[i][6]), time: confirmed });
    }
    return json({ ok: true, booked: booked });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/** The website calls this when a student submits a booking. */
function doPost(e) {
  try {
    var p = JSON.parse(e.postData.contents);
    if (!p.name || !p.email || !p.dateISO || !p.times) throw new Error("Missing booking fields");

    /* rebuild any uploaded files as email attachments */
    var attachments = [];
    var fileNames = [];
    var totalBytes = 0;
    (p.files || []).forEach(function (f) {
      if (!f || !f.data || !f.filename) return;
      var bytes = Utilities.base64Decode(f.data);
      totalBytes += bytes.length;
      if (totalBytes > MAX_ATTACH_BYTES) throw new Error("Attachments exceed the 25 MB Gmail limit");
      attachments.push(Utilities.newBlob(bytes, f.mimeType || "application/octet-stream", String(f.filename).slice(0, 150)));
      fileNames.push(String(f.filename).slice(0, 150));
    });

    getSheet().appendRow([
      new Date(),
      String(p.name).slice(0, 120),
      String(p.email).slice(0, 120),
      String(p.matter || "").slice(0, 60),
      String(p.details || "").slice(0, 2000),
      String(p.dateText || "").slice(0, 60),
      "'" + String(p.dateISO).slice(0, 10),   // leading apostrophe keeps it as text
      String(p.times).slice(0, 300),
      fileNames.join(", ") || "None",
      ""                                       // CONFIRMED SLOT — you fill this in
    ]);

    var body =
      "New consultation request:\n\n" +
      "Name: " + p.name + "\n" +
      "Email: " + p.email + "\n" +
      "Matter: " + p.matter + "\n" +
      "Date: " + p.dateText + "\n" +
      "Preferred time(s): " + p.times + "\n" +
      "File(s): " + (fileNames.length ? fileNames.join(", ") + " (attached)" : "None") + "\n" +
      (p.details ? "\nDetails:\n" + p.details + "\n" : "") +
      "\nTo confirm: open the Bookings sheet and put the chosen time in the CONFIRMED SLOT column.\n" +
      SpreadsheetApp.getActiveSpreadsheet().getUrl();
    MailApp.sendEmail(NOTIFY_EMAIL,
      "📅 Consultation request: " + p.name + " — " + p.dateText,
      body,
      attachments.length ? { attachments: attachments } : {});

    if (SEND_STUDENT_ACK) {
      MailApp.sendEmail(String(p.email),
        "Your consultation request was received",
        "Hi " + p.name + ",\n\n" +
        "Your consultation request for " + p.dateText + " (" + p.times + ") has been received.\n" +
        "Your slot is reserved only once Dr. Guido confirms it by email — please watch your inbox.\n\n" +
        "This is an automated acknowledgment.");
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}
