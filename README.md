# Student Consultation Schedule

Booking website for the consultation hours of **Dr. Ryan Manuel D. Guido** — Rizal Technological University.

Students pick a 30-minute slot (Tuesdays 3:00–6:00 PM, Thursdays 4:00–6:00 PM, Aug 25 – Dec 10, 2026), enter their name, email, and consultation matter (Thesis or Subject Consultation), and upload files for early review. Each booking is emailed to **rmguido@rtu.edu.ph** with the files attached.

## How to publish on GitHub Pages

1. Create a new repository on GitHub (e.g. `consultation-schedule`).
2. Upload the files in this folder: `index.html`, `rtu-logo.png`, `README.md`.
3. In the repository, go to **Settings → Pages**, and under *Branch* choose **main** and **/ (root)**, then **Save**.
4. After a minute, your site is live at `https://<your-username>.github.io/consultation-schedule/`. Share this link with students.

## One-time activation (important)

The **first** booking triggers an activation email from formsubmit.co to rmguido@rtu.edu.ph. Click **Activate** in that email once — after that, every booking arrives in your inbox automatically. Submit a test booking yourself right after publishing.

## Changing the schedule later

Open `index.html` and edit the *configuration* block near the top of the `<script>` section:

- `START` / `END` — first and last consultation dates
- `TUE_TIMES` / `THU_TIMES` — the 30-minute slot start times
- `DEST_EMAIL` — where bookings are sent
