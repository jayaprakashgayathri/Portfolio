# Gayathri Jayaprakash — Portfolio

Terminal-rot themed portfolio. Flask backend, plain HTML/CSS/JS frontend.

## Run it locally

```
cd portfolio
pip install -r requirements.txt
python3 app.py
```

Open http://127.0.0.1:5000 in your browser.

## Folder structure

```
portfolio/
  app.py                 -> Flask routes + your project data (edit PROJECTS dict here)
  requirements.txt
  templates/
    base.html            -> shared nav, mode toggle, cursor, footer
    index.html           -> homepage (boot intro, hero, project teaser, about)
    work.html             -> full project grid
    project.html         -> case-study template (problem/approach/result)
  public/                -> static assets (Vercel requires this exact folder name)
    css/style.css        -> all styling, palette, toggle, layout
    js/main.js            -> boot sequence, cursor, toggle, hover effects
    images/               -> put your real images here (see below)
```

## Replacing placeholders

- **Images**: every `[PLACEHOLDER: filename.jpg]` box in the templates marks where
  a real image goes. Drop your file into `public/images/` with that name, then
  swap the `<div class="img-placeholder">` for:
  `<img src="{{ url_for('static', filename='images/filename.jpg') }}" alt="...">`
- **Text**: edit the `PROJECTS` dictionary in `app.py` (title, tagline, problem,
  approach, result) and the bio line in `templates/index.html`.
- **Links**: update the GitHub/LinkedIn/email links in `templates/base.html` and
  `templates/index.html`.

## How it all maps to the plan

- Palette, fonts (VT323 boot + Space Mono body), contrast-safe color rules,
  motion rules, and the Terminal/Clean toggle all live in `static/css/style.css`
  and `static/js/main.js`, matching `portfolio-plan-summary.md`.
- Toggle resets to Terminal mode on every page load (no storage), as planned.
- Boot sequence only runs on the homepage and is skipped instantly if Clean
  mode is selected.

## Deploying (GitHub + Vercel)

Yes — GitHub is the right move. Connect once, and every future push auto-deploys.
No vercel.json or special config needed; Vercel auto-detects the Flask `app`
instance in `app.py`.

1. **Create a GitHub repo** and push this folder:
   ```
   git init
   git add .
   git commit -m "initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. **Go to vercel.com** → sign in → **Add New Project** → **Import** your GitHub repo.
3. Vercel will auto-detect it as a Python/Flask project. Leave the default
   settings as-is and click **Deploy**.
4. Once deployed, you get a live URL (e.g. `your-project.vercel.app`). You can
   attach a custom domain later from the project's **Settings → Domains** tab.

### Making corrections after deploying
This is the part that makes GitHub worth it:
```
# make your edits locally, then:
git add .
git commit -m "describe what you changed"
git push
```
Vercel automatically redeploys within seconds of the push — no manual
redeploy step, no dashboard clicking. This is the entire "make a correction"
workflow going forward.

### A few Vercel-specific notes
- Static files **must** live in `public/` (not Flask's default `static/`
  folder) — this project is already configured that way.
- Each deploy bundles your whole app as one Vercel Function; keep the repo
  under Vercel's 500MB function size limit (your placeholder-based site is
  nowhere close to this).
- `vercel dev` (via the Vercel CLI) can be used instead of `python app.py` if
  you want to test in an environment closer to production before pushing.
