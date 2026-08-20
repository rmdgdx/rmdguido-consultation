# Student Consultation Schedule

Booking website for the consultation hours of **Dr. Ryan Manuel D. Guido** — Rizal Technological University.

Students pick a 30-minute slot (Tuesdays 3:00–6:00 PM, Thursdays 4:00–6:00 PM, Aug 25 – Dec 10, 2026), enter their name, email, and consultation matter (Thesis or Subject Consultation), and upload files for early review (up to 10 MB total). Uploaded files are saved straight into your Google Drive folder; the booking details are emailed to **rmguido@rtu.edu.ph**.

Everything (including the RTU logo) is inside the single `index.html` file.

## 1. Publish on GitHub Pages

1. Create a new repository on GitHub (e.g. `consultation-schedule`).
2. Upload `index.html` and `README.md` (you can include `google-apps-script.gs` too — it does no harm).
3. Go to **Settings → Pages**, choose Branch **main** and folder **/ (root)**, then **Save**.
4. After a minute your site is live at `https://<your-username>.github.io/consultation-schedule/`.

## 2. Google Drive uploads — one-time setup (~5 minutes)

A GitHub page cannot write into Google Drive by itself, so a tiny script running under your Google account receives the files:

1. While signed in as the Google account that owns the Drive folder, open **script.google.com** and click **New project**.
2. Delete the starter code and paste in the contents of **`google-apps-script.gs`** (from this package). Save.
3. Click **Deploy → New deployment → ⚙️ Select type → Web app**.
4. Set **Execute as: Me**, and **Who has access: Anyone**. Click **Deploy** and authorize when asked.
5. Copy the **Web app URL** (it starts with `https://script.google.com/macros/…`).
6. Open `index.html`, find the line near the top of the `<script>` section:
   `const DRIVE_UPLOAD_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";`
   and paste your URL between the quotes. Re-upload `index.html` to GitHub.

Files then appear in your folder named `Student Name — Date — filename`. The folder does **not** need to be shared publicly — the script runs as you.

**Until this step is done** (or if an upload ever fails), the site automatically falls back to attaching the files to the booking email instead, so no student submission is ever lost.

## 3. Booking-email activation

The first booking triggers an activation email from formsubmit.co to rmguido@rtu.edu.ph. Click **Activate** in it once; after that every booking arrives automatically. Submit a test booking right after publishing.

## Changing things later

Edit the configuration block at the top of the `<script>` section in `index.html`:

- `START` / `END` — first and last consultation dates
- `TUE_TIMES` / `THU_TIMES` — the 30-minute slot start times
- `DEST_EMAIL` — where bookings are sent
- `DRIVE_UPLOAD_URL` — your Apps Script web-app URL
- To change the Drive folder, edit `FOLDER_ID` in the Apps Script and re-deploy.
