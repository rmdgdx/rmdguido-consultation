# Student Consultation Schedule

Booking website for the consultation hours of **Dr. Ryan Manuel D. Guido** — Rizal Technological University.

Students pick a 30-minute slot (Tuesdays 3:00–6:00 PM, Thursdays 4:00–6:00 PM, Aug 25 – Dec 10, 2026), enter their name, email, and consultation matter (Thesis or Subject Consultation), tick their preferred time slot(s), and can upload a file for early review (up to **25 MB** total — Gmail's attachment limit). Every booking lands as a row in your Google Sheet and is emailed to **rmguido@rtu.edu.ph** **with the uploaded file attached**. Slots you confirm show as **BOOKED** on the site and can't be picked again; fully booked dates are greyed out in the date list.

## 1. One-time setup: the booking sheet (~5 minutes)

1. While signed in to the Google account you want to use, create a new **Google Sheet** at sheets.google.com (name it e.g. "Consultation Bookings").
2. In the Sheet, open **Extensions → Apps Script**. Delete the starter code and paste in the whole contents of **`google-apps-script.gs`** (from this package). Click the 💾 save icon.
3. Click **Deploy → New deployment**. Click the ⚙️ gear, choose **Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Click **Deploy** and approve the authorization prompts (choose your account → Advanced → Go to project → Allow).
4. Copy the **Web app URL** (starts with `https://script.google.com/macros/…`).
5. Open `index.html` in any text editor, find this line near the top of the `<script>` section:
   `const SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";`
   and paste your URL between the quotes. Save.

## 2. Publish on GitHub Pages

1. Create a new repository on GitHub (e.g. `consultation-schedule`).
2. Upload `index.html` and `README.md` (and `google-apps-script.gs` if you like — it does no harm).
3. Go to **Settings → Pages**, choose Branch **main**, folder **/ (root)**, then **Save**.
4. Your site goes live at `https://<your-username>.github.io/consultation-schedule/`. Send a test booking to check everything, then share the link with students.

## 3. Confirming a booking (this is what blocks the slot)

1. Open your Google Sheet — each request is a row, with any uploaded file names in the **Files** column (the files themselves arrive attached to the notification email; students get an automatic "request received" note).
2. In that row, copy the time you choose from **Preferred Times** into the **CONFIRMED SLOT** column, e.g. `3:00 PM – 3:30 PM` (typing just the start time like `3:00 PM` also works).
3. Reply to the student to confirm — and that slot immediately shows as **BOOKED** on the website.
4. Cancellation? Just clear the CONFIRMED SLOT cell and the slot opens up again.

## Changing the schedule later

Edit the configuration block at the top of the `<script>` section in `index.html`:

- `START` / `END` — first and last consultation dates
- `TUE_TIMES` / `THU_TIMES` — the 30-minute slot start times
- `DEST_EMAIL` — the email used in the fallback "email your request" link
- `SCRIPT_URL` — your Apps Script web-app URL
- The notification address for new bookings is `NOTIFY_EMAIL` in the Apps Script (re-deploy after changing it: Deploy → Manage deployments → ✏️ → Version: New → Deploy).
