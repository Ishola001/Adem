# Website — Setup Guide (v2, with self-service content editor)

This version adds a private admin panel (Decap CMS) so Blog posts, Case Studies, and Free Guides can be edited without touching code. Core pages (Home, About, Services) are still edited directly in the HTML — see the note on that below.

---

## 1. Move hosting from drag-and-drop to GitHub + Netlify

The CMS needs a live connection to a code repository to save changes — the old manual drag-and-drop upload doesn't have that. One-time setup:

1. **Create a GitHub account** at github.com (free).
2. Click **New repository** → name it (e.g. `my-website`) → keep it **Private** → Create.
3. On the new repo's page, click **Add file → Upload files**, then drag in everything from the `site` folder (all files and subfolders: `index.html`, `css/`, `js/`, `content/`, `admin/`, `services/`, `images/`, etc.) → **Commit changes**.
4. Go to **netlify.com** → your existing site (or create a new one) → **Site configuration → Build & deploy → Link repository** (or "Import from Git" if starting fresh) → choose GitHub → select the repo you just created.
5. Leave build settings blank (no build command needed — it's a static site) → Deploy.

Your site is now live from GitHub, and any commit to the repo (including ones the CMS makes) auto-publishes.

## 2. Turn on the login system (Netlify Identity)

1. In your Netlify site dashboard → **Site configuration → Identity** → **Enable Identity**.
2. Under Identity → **Registration**, set to **Invite only** (so only you can create an account).
3. Under Identity → **Services → Git Gateway** → **Enable Git Gateway**. This is what lets the CMS save changes back to GitHub on your behalf.
4. Go to the **Identity** tab → **Invite users** → enter your own email → send the invite → check your inbox and accept it, setting a password.

## 3. Use the content editor

1. Visit `yoursite.com/admin` and log in with the account from step 2.
2. You'll see three sections: **Blog Posts**, **Case Studies**, **Free Guides**.
3. Click into any one, edit the fields, upload images/PDFs directly in the form, and hit **Publish**. It commits to GitHub and Netlify redeploys automatically (takes about a minute to go live).

## 4. Editing Home, About, and Service pages

These remain hand-coded HTML (making every word on every page drag-and-drop editable would need a much bigger rebuild than what's warranted here). To change them: open the file in a text editor and edit the text directly, or send me the change and I'll update it for you.

## 5. The logo

`images/logo.svg` (horizontal) and `images/logo-icon.svg` (icon only, also used for the favicon) currently use the placeholder text **"YourBrand"** in your coral/navy identity. Once you confirm your real business name (see the intake checklist), open the SVG in a text editor — the name is plain text inside a `<text>` tag, easy to swap — or send me the name and I'll update it and regenerate the favicon.

## 6. Connect the forms (Training + Contact)
Still pending — see the earlier setup note: sign up at formspree.io, get your endpoint, and replace `YOUR_FORM_ENDPOINT` in `training.html` and `contact.html`.

## 7. Images
Every dashed box marked "Add: ..." is a placeholder — I didn't embed stock photos in place of your real work, since screenshots of your actual client work (with permission) will always be more credible than generic stock images on a portfolio site. Where you genuinely have no material for something, free, properly licensed stock comes from **unsplash.com** or **pexels.com** — search, download, and drop the file into `images/`, then update the relevant `<img>`/`media-placeholder` tag.

## 8. Case study downloads & Free guides
The **Download full case study (PDF)** and **Download free guide** buttons are wired up and waiting on real files — once you have a PDF for a project or guide, upload it directly through the `/admin` panel (Case Studies / Free Guides collections have a file-upload field) and the button activates automatically.
