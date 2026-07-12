# Task 3 — Advanced Styling & JavaScript

A responsive mini web app built for the "Advanced Styling and JavaScript" assignment.

## What it does

1. **Responsive Design (Media Queries)** — layout, image carousel, and quiz reflow across mobile, tablet, and desktop using CSS media queries (`@media` breakpoints at 768px and 480px).
2. **Interactive Quiz & Image Carousel** — a 5-question quiz with live scoring, plus an auto-rotating image carousel with manual arrow/dot controls.
3. **External API Integration** — fetches live data from two public APIs and renders it dynamically:
   - **Open-Meteo** (weather, no API key required) — geocodes a city name then pulls current temperature and conditions.
   - **icanhazdadjoke** (joke API, no API key required) — fetches a random joke on load and on button click.

## Files

- `index.html` — page structure
- `style.css` — styling + media queries
- `script.js` — carousel logic, quiz logic, and API fetch calls

## Run it

Just open `index.html` in a browser, or serve the folder with GitHub Pages:

1. Push this folder to a GitHub repo.
2. Go to **Settings → Pages**, set the source to your main branch.
3. Your live site will be published at `https://<username>.github.io/<repo-name>/`.

## Tech used

HTML5, CSS3 (Flexbox, media queries), vanilla JavaScript (`fetch`, `async/await`, DOM manipulation).
