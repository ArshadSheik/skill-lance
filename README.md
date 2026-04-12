# SkillLance

> An interactive web learning platform for HTML, CSS & JavaScript, built for Individual Project, **CITS5505 Agile Web Development**, Semester 1, 2026 at **The University of Western Australia**.

**Author:** Arshad Sheik | **Student ID:** 25101735 | **Unit:** CITS5505

---

## Overview

SkillLance is a four-page educational web application that teaches core web development concepts through interactive tutorials, a dynamic quiz engine, an AI tool reflection log, and a personalised CV/portfolio page. It is designed and built entirely with vanilla HTML5, CSS3, and JavaScript — no front-end frameworks.

---

## Pages

| Page | File | Description |
|---|---|---|
| Tutorial | `tutorial.html` | Structured lessons on HTML, CSS & JS with live "Try It" code editors, a box model explorer, and a learning-path flow |
| Quiz | `quiz.html` | 10-question randomised quiz loaded via AJAX, with scoring, localStorage history, and API-powered rewards |
| AI Reflection | `reflection.html` | Critical log of 12 real AI interactions during development — prompts, output, bugs found, and corrections made |
| CV | `cv.html` | Interactive curriculum vitae of Arshad Sheik (me) with animated skill bars, experience timeline, and references |

The root `index.html` immediately redirects to `tutorial.html` so the project works correctly on GitHub Pages.

---

## Features

**Tutorial Page**
- Tab-based topic navigation (HTML → CSS → JS → Quiz)
- Syntax-highlighted live code editors with real-time "Try It" preview
- Interactive CSS box model explorer with sliders
- Scroll-linked sticky table of contents with IntersectionObserver
- Scroll-reveal fade-in animations throughout

**Quiz Page**
- Questions loaded dynamically via AJAX Fetch from `data/questions.json`
- Fisher-Yates shuffle produces a unique question order on every attempt
- `beforeunload` browser warning fires if the user navigates away mid-quiz after answering at least one question; cleared on successful submission
- Score, percentage, and pass/fail (≥70%) calculated and displayed on submit
- On pass: confetti animation, animated SVG score ring, and a reward fetched from the [Advice Slip API](https://api.adviceslip.com/) + unique avatar from [Multiavatar API](https://multiavatar.com/)
- On fail: comedic dad joke fetched from [icanhazdadjoke](https://icanhazdadjoke.com/)
- All attempts stored in `localStorage` and displayed in an Attempt History panel

**AI Reflection Page**
- 12 documented AI interactions with exact prompts, code comparisons, and critical assessments
- Critical Findings section identifying ten categories of AI limitation
- Reliability Assessment by task category (Web APIs, CSS, Accessibility, etc.)
- Ethical Considerations and Academic Integrity discussion

**CV Page**
- Animated hero banner with 3D tilt-effect profile photo
- Count-up animated stats row
- Sticky sidebar with animated skill-proficiency bar charts
- Experience timeline with tech-skill tag filter and tab category filter
- Floating action buttons: Download PDF and Back to Top
- Scroll progress indicator bar
- Full references section in UWA Harvard format

**Cross-page**
- Dark / light theme toggle persisted to `localStorage`, respects OS `prefers-color-scheme` on first visit
- Fully responsive layout (mobile, tablet, desktop)
- ARIA labels, skip links, semantic HTML5 elements, and keyboard navigation throughout
- Shared navigation bar and footer on all four pages

---

## Project Structure

```
skill-lance/
│
├── index.html              # Entry point — redirects to tutorial.html
├── tutorial.html           # Tutorial page
├── quiz.html               # Quiz page
├── reflection.html         # AI Reflection Log page
├── cv.html                 # CV / Portfolio page
│
├── assets/
│   ├── style.css           # Shared stylesheet (CSS custom properties, all pages)
│   ├── main.js             # Shared JavaScript (quiz logic, theme, animations)
│   ├── images/
│   │   ├── Profile.jpeg    # Profile photo (cv.html)
│   │   └── img-ai-reflection.png  # Hero illustration (reflection.html)
│   └── docs/
│       └── Arshad-Sheik-Resume.pdf  # Downloadable PDF resume
│
└── data/
    └── questions.json      # Quiz question bank (loaded via AJAX)
```

---

## Technology Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic elements: `<nav>`, `<main>`, `<article>`, `<aside>`, `<figure>`, `<time>`) |
| Styling | CSS3 — custom properties (design tokens), Grid, Flexbox, `@keyframes`, `IntersectionObserver`-driven transitions |
| Scripting | Vanilla JavaScript (ES2020+) — Fetch API, `localStorage`, `IntersectionObserver`, `requestAnimationFrame` |
| Fonts | Google Fonts CDN — Syne, DM Sans, Fira Code, Space Grotesk, IBM Plex Sans/Mono |
| External APIs | Advice Slip, Multiavatar, icanhazdadjoke |
| Frameworks | **None** — no jQuery, Bootstrap, React, Vue, or Angular |

---

## External APIs Used

| API | Used For | Documentation |
|---|---|---|
| [Advice Slip](https://api.adviceslip.com/) | Quiz pass reward — motivational advice slip | https://api.adviceslip.com/ |
| [Multiavatar](https://multiavatar.com/) | Quiz pass reward — unique avatar badge | https://multiavatar.com/ |
| [icanhazdadjoke](https://icanhazdadjoke.com/) | Quiz fail penalty — comedic dad joke | https://icanhazdadjoke.com/ |

---

## Getting Started

No build tools, package managers, or servers required.

**Option 1 — Open locally**

Clone the repository and open `tutorial.html` directly in a browser:

```bash
git clone https://github.com/ArshadSheik/skill-lance.git
cd skill-lance
# Open tutorial.html in Chrome, Firefox, Edge, or Safari
```

> Note: Some browsers block `fetch()` on `file://` URLs due to CORS policy. If questions fail to load locally, use a local server (Option 2).

**Option 2 — Local server (recommended)**

```bash
# Python 3
python -m http.server 8000
# Then visit http://localhost:8000
```

Or use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code.

**Option 3 — GitHub Pages**

The project is configured for GitHub Pages deployment. Push to the `main` branch and enable Pages in repository settings. The site will be available at `https://arshadsheik.github.io/skill-lance/`.

---

## Browser Compatibility

Tested and verified in:

- Google Chrome (latest)
- Mozilla Firefox (latest)
- Microsoft Edge (latest)
- Safari (latest, macOS/iOS)

The project passes [W3C HTML Validator](https://validator.w3.org/) and [W3C CSS Validator](https://jigsaw.w3.org/css-validator/) checks.

---

## Academic Notes

**Unit:** CITS5505 Agile Web Development, Semester 1 2026
**Assessment:** Individual Project — Task 1
**Institution:** The University of Western Australia

This project was developed in accordance with the CITS5505 assessment specification. All AI tool usage is documented and critically evaluated on the AI Reflection page (`reflection.html`) and cited in the references section of `cv.html`. All code is original work by the author; AI assistance was used as a starting point only and all generated output was reviewed, tested, and modified before inclusion.

---

## References

A complete reference list in UWA Harvard format is available in the **Sources Consulted** section at the bottom of `cv.html`. Key sources include:

- Mozilla Developer Network — https://developer.mozilla.org/
- World Wide Web Consortium (W3C) — HTML5 and WCAG 2.1 specifications
- Anthropic. (2026). *Claude* (April 2026 version) [Large language model] — https://claude.ai/
- Google LLC. (n.d.). *Google Fonts* — https://fonts.google.com/
- UWA Library. (2024). *Referencing at UWA* — https://guides.library.uwa.edu.au/referencinguwa

---

## License

This project is submitted as academic coursework at The University of Western Australia. It is not licensed for redistribution or reuse.

© 2026 Arshad Sheik — CITS5505 Agile Web Development · The University of Western Australia