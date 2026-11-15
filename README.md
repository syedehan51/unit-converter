# Converted — unit converter website

A free, ad-supported unit converter built with Flask. Converts length,
weight, temperature, volume, speed, and area — all math runs client-side
in JavaScript, so results are instant and nothing is sent to a server.

## Run it locally

```bash
python3 -m venv venv
source venv/bin/activate        # on Windows: venv\Scripts\activate
pip install -r requirements.txt
python3 app.py
```

Then open http://127.0.0.1:5000 in your browser.

## Project structure

```
converter/
├── app.py                 # Flask routes
├── requirements.txt
├── templates/
│   ├── index.html          # the converter page
│   └── privacy.html        # required for AdSense approval
└── static/
    ├── style.css
    └── script.js            # conversion logic + all unit data
```

## Adding more categories or units

Everything lives in `static/script.js` inside the `CATEGORIES` object.
To add a category, add a new key with a `code` (2-letter label), a `base`
unit, and a `units` object mapping unit name → factor relative to the
base unit. Temperature is the one exception (handled with real formulas
since it isn't a pure ratio).

## Before you deploy

- [ ] Fill in the `[DATE]` and `[YOUR EMAIL]` placeholders in
      `templates/privacy.html`
- [ ] Buy a domain (~$10/yr) — matters for both SEO and AdSense approval
- [ ] Turn off Flask debug mode (already off by default when using gunicorn)
- [ ] Pick a host: Render, Railway, PythonAnywhere (free tiers) or a small
      VPS. For most of these, the start command is:
      `gunicorn app:app`

## After you're live

1. Let the site sit with real content and a working privacy policy for a
   bit before applying to AdSense — it needs to actually crawl and index
   your pages.
2. Apply at https://www.google.com/adsense
3. Once approved, go to Settings → Content → Blocking controls in your
   AdSense dashboard to block any ad categories you don't want
   (e.g. Dating, Adult).
4. Paste the AdSense script Google gives you into `templates/index.html`
   before `</head>`.
