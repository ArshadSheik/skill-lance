/* ═══════════════════════════════════════════════════════════════════════════
   SKILLLANCE — Main JavaScript v2
   Features: Theme, 3D animations, Tutorial demos, Quiz engine, CV, Floating orbs
═══════════════════════════════════════════════════════════════════════════ */

// ── Initialize on DOM Ready ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initAnimatedGrid();
  initGeoShapes();
  initParticles();
  initFloatingOrbs();
  initTheme();
  initMobileNav();
  initTutorialDemos();
  initTocTracker();
  initQuizPage();
  initCvInteractions();
  initFloatingDecor();
  init3DTilt();
  // Scroll reveal after a tiny delay so elements are painted
  requestAnimationFrame(() => initScrollReveal());
});

// ── Floating Background Orbs ───────────────────────────────────────────────
function initFloatingOrbs() {
  if (document.querySelector('.floating-orbs')) return;
  const container = document.createElement('div');
  container.className = 'floating-orbs';
  container.innerHTML = '<div class="orb orb-1"></div><div class="orb orb-2"></div><div class="orb orb-3"></div>';
  document.body.prepend(container);
}

// ── Theme Toggle ───────────────────────────────────────────────────────────
function initTheme() {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');

  const savedTheme = localStorage.getItem('skilllance-theme');
  let theme = savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  root.setAttribute('data-theme', theme);
  updateThemeIcon(toggle, theme);

  toggle?.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    localStorage.setItem('skilllance-theme', theme);
    updateThemeIcon(toggle, theme);
  });
}

function updateThemeIcon(toggle, theme) {
  if (!toggle) return;
  toggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
}

// ── Mobile Navigation ──────────────────────────────────────────────────────
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  toggle?.addEventListener('click', () => {
    links?.classList.toggle('open');
    toggle.setAttribute('aria-expanded', links?.classList.contains('open'));
  });

  links?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── 3D Card Tilt Effect ────────────────────────────────────────────────────
function init3DTilt() {
  document.querySelectorAll('.path-card-large, .info-card, .path-card, .feature-card-3d').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Hero card 3D parallax — deeper tilt effect
  const heroCard = document.getElementById('hero-how-card');
  if (heroCard) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroCard.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px) scale(1.02)`;
      heroCard.style.boxShadow = `${-x * 20}px ${y * 20}px 50px rgba(129,140,248,0.15), 0 0 40px rgba(129,140,248,0.08)`;
    });
    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = '';
      heroCard.style.boxShadow = '';
    });
  }

  // Hero title subtle 3D effect on hover
  const heroTitle = document.querySelector('.hero-title-3d');
  if (heroTitle) {
    heroTitle.addEventListener('mousemove', (e) => {
      const rect = heroTitle.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroTitle.style.transform = `perspective(1200px) rotateY(${x * 4}deg) rotateX(${-y * 3}deg) translateZ(8px)`;
    });
    heroTitle.addEventListener('mouseleave', () => {
      heroTitle.style.transform = '';
    });
  }
}

// ── Floating Decorative Buttons (Tutorial) ─────────────────────────────────
function initFloatingDecor() {
  if (document.body.dataset.page !== 'tutorial') return;
  if (document.querySelector('.floating-decor')) return;

  const decor = document.createElement('div');
  decor.className = 'floating-decor';
  decor.setAttribute('aria-hidden', 'true');
  decor.innerHTML = `
    <a href="#html" class="float-btn" title="Jump to HTML">🧱</a>
    <a href="#css" class="float-btn" title="Jump to CSS">🎨</a>
    <a href="#js" class="float-btn" title="Jump to JS">⚡</a>
  `;
  document.body.appendChild(decor);

  // Make them clickable
  decor.querySelectorAll('a').forEach(a => {
    a.style.pointerEvents = 'auto';
    a.style.textDecoration = 'none';
  });
}

// ── TOC Active State Tracker ───────────────────────────────────────────────
function initTocTracker() {
  if (document.body.dataset.page !== 'tutorial') return;

  // ── Sidebar toggle ──────────────────────────────────────────────────────
  const sidebar = document.querySelector('.toc-sidebar');
  const pageWrap = document.querySelector('.page-wrap');
  const toggleBtn = document.getElementById('toc-toggle');

  if (sidebar && toggleBtn) {
    // Restore collapse state from localStorage
    const isCollapsed = localStorage.getItem('toc-collapsed') === 'true';
    if (isCollapsed) {
      sidebar.classList.add('collapsed');
      pageWrap?.classList.add('sidebar-collapsed');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }

    toggleBtn.addEventListener('click', () => {
      const collapsed = sidebar.classList.toggle('collapsed');
      pageWrap?.classList.toggle('sidebar-collapsed', collapsed);
      toggleBtn.setAttribute('aria-expanded', String(!collapsed));
      localStorage.setItem('toc-collapsed', collapsed);
    });
  }

  // ── Scroll progress bar ─────────────────────────────────────────────────
  const progressFill = document.getElementById('toc-progress-fill');
  const progressPct  = document.getElementById('toc-progress-pct');

  function updateProgress() {
    const docH    = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docH > 0 ? Math.min(100, Math.round((window.scrollY / docH) * 100)) : 0;
    if (progressFill) progressFill.style.width = scrolled + '%';
    if (progressPct)  progressPct.textContent  = scrolled + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ── Active section highlighting ─────────────────────────────────────────
  const tocLinks = document.querySelectorAll('.toc-links a, .toc-section-link, .toc-quiz-link');
  if (!tocLinks.length) return;

  // Build map of anchor id → link element
  const sections = [];
  tocLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) sections.push({ el, link });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(l => l.classList.remove('active'));
        const match = sections.find(s => s.el === entry.target);
        if (match) match.link.classList.add('active');
      }
    });
  }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s.el));
}

// ── Tutorial Page Demos ────────────────────────────────────────────────────
function initTutorialDemos() {
  // HTML Try It Editor
  const htmlEditor = document.getElementById('html-editor');
  const htmlPreview = document.getElementById('html-preview');
  const htmlRunBtn = document.getElementById('html-run');

  function runHtmlEditor() {
    if (!htmlEditor || !htmlPreview) return;
    htmlPreview.srcdoc = htmlEditor.value;
  }

  htmlRunBtn?.addEventListener('click', runHtmlEditor);

  htmlEditor?.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = htmlEditor.selectionStart;
      htmlEditor.value = htmlEditor.value.substring(0, start) + '  ' + htmlEditor.value.substring(htmlEditor.selectionEnd);
      htmlEditor.selectionStart = htmlEditor.selectionEnd = start + 2;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') runHtmlEditor();
  });

  if (htmlEditor && htmlPreview) runHtmlEditor();

  // Box Model Interactive
  const bmiMg = document.getElementById('bmi-mg');
  const bmiBd = document.getElementById('bmi-bd');
  const bmiPd = document.getElementById('bmi-pd');
  const bmiCode = document.getElementById('bmi-code');

  function updateBoxModel() {
    if (!bmiMg) return;
    const mg = bmiMg.value;
    const bd = bmiBd.value;
    const pd = bmiPd.value;

    document.getElementById('bmi-mg-v').textContent = mg + 'px';
    document.getElementById('bmi-bd-v').textContent = bd + 'px';
    document.getElementById('bmi-pd-v').textContent = pd + 'px';

    const marginEl = document.getElementById('bmi-margin-el');
    const borderEl = document.getElementById('bmi-border-el');
    const paddingEl = document.getElementById('bmi-padding-el');

    if (marginEl) marginEl.style.padding = mg + 'px';
    if (borderEl) borderEl.style.borderWidth = bd + 'px';
    if (paddingEl) paddingEl.style.padding = pd + 'px';

    if (bmiCode) {
      bmiCode.innerHTML =
        `<span style="color:var(--accent)">.box</span> {\n` +
        `  <span style="color:var(--amber)">margin</span>: <span style="color:var(--green)">${mg}px</span>;\n` +
        `  <span style="color:var(--coral)">border</span>: <span style="color:var(--green)">${bd}px solid #333</span>;\n` +
        `  <span style="color:var(--green)">padding</span>: <span style="color:var(--green)">${pd}px</span>;\n` +
        `  box-sizing: border-box;\n}`;
    }
  }

  [bmiMg, bmiBd, bmiPd].forEach(el => el?.addEventListener('input', updateBoxModel));
  if (bmiMg) updateBoxModel();

  // CSS Property Playground
  const cssBox = document.getElementById('css-box');
  const cssGenerated = document.getElementById('css-generated');

  function updateCssPlayground() {
    if (!cssBox) return;

    const bg = document.getElementById('bg-c')?.value || '#818cf8';
    const tc = document.getElementById('tc-c')?.value || '#ffffff';
    const br = document.getElementById('br-r')?.value || '8';
    const sz = document.getElementById('sz-r')?.value || '180';
    const pd = document.getElementById('pd-r')?.value || '16';
    const bw = document.getElementById('bw-r')?.value || '0';
    const bc = document.getElementById('bc-c')?.value || '#1a1714';
    const op = document.getElementById('op-r')?.value || '1';
    const rt = document.getElementById('rt-r')?.value || '0';
    const ff = document.getElementById('ff-s')?.value || "'DM Sans', sans-serif";

    cssBox.style.backgroundColor = bg;
    cssBox.style.color = tc;
    cssBox.style.borderRadius = br + 'px';
    cssBox.style.width = sz + 'px';
    cssBox.style.height = sz + 'px';
    cssBox.style.padding = pd + 'px';
    cssBox.style.borderWidth = bw + 'px';
    cssBox.style.borderStyle = 'solid';
    cssBox.style.borderColor = bc;
    cssBox.style.opacity = op;
    cssBox.style.transform = `rotate(${rt}deg)`;
    cssBox.style.fontFamily = ff;

    // Update value displays
    const updates = {
      'bg-v': bg, 'tc-v': tc, 'br-v': br + 'px', 'sz-v': sz + 'px',
      'pd-v': pd + 'px', 'bw-v': bw + 'px', 'bc-v': bc, 'op-v': op, 'rt-v': rt + '°'
    };
    Object.entries(updates).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    });

    if (cssGenerated) {
      cssGenerated.innerHTML =
        `<span style="color:var(--accent)">.box</span> {\n` +
        `  <span style="color:var(--amber)">background-color</span>: ${bg};\n` +
        `  <span style="color:var(--amber)">color</span>: ${tc};\n` +
        `  <span style="color:var(--amber)">border-radius</span>: ${br}px;\n` +
        `  <span style="color:var(--amber)">width</span>: ${sz}px;\n` +
        `  <span style="color:var(--amber)">height</span>: ${sz}px;\n` +
        `  <span style="color:var(--amber)">padding</span>: ${pd}px;\n` +
        `  <span style="color:var(--amber)">border</span>: ${bw}px solid ${bc};\n` +
        `  <span style="color:var(--amber)">opacity</span>: ${op};\n` +
        `  <span style="color:var(--amber)">transform</span>: rotate(${rt}deg);\n}`;
    }
  }

  ['bg-c', 'tc-c', 'br-r', 'sz-r', 'pd-r', 'bw-r', 'bc-c', 'op-r', 'rt-r', 'ff-s'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateCssPlayground);
  });
  if (cssBox) updateCssPlayground();

  // Counter Demo
  const counterNum = document.getElementById('counter-num');
  const consoleVal = document.getElementById('console-val');
  const btnInc = document.getElementById('btn-inc');
  const btnDec = document.getElementById('btn-dec');
  const btnRst = document.getElementById('btn-rst');
  let counterVal = 0;

  function updateCounter(newVal) {
    counterVal = newVal;
    if (counterNum) {
      counterNum.textContent = counterVal;
      counterNum.setAttribute('aria-label', 'Current count: ' + counterVal);
      counterNum.style.color = counterVal > 0 ? 'var(--green)' : counterVal < 0 ? 'var(--coral)' : 'var(--accent)';
      counterNum.style.transform = 'scale(1.15)';
      setTimeout(() => { counterNum.style.transform = 'scale(1)'; }, 150);
    }
    if (consoleVal) consoleVal.textContent = counterVal;
  }

  btnInc?.addEventListener('click', () => updateCounter(counterVal + 1));
  btnDec?.addEventListener('click', () => updateCounter(counterVal - 1));
  btnRst?.addEventListener('click', () => updateCounter(0));

  // Text Mirror Demo
  const mirrorIn = document.getElementById('mirror-in');
  const mirrorOut = document.getElementById('mirror-out');
  const mirrorCode = document.getElementById('mirror-code');

  mirrorIn?.addEventListener('input', () => {
    const val = mirrorIn.value || 'your text here';
    if (mirrorOut) mirrorOut.textContent = val;
    if (mirrorCode) mirrorCode.textContent = '"' + val + '"';
  });

  // Event Logger Demo
  const eventLog = document.getElementById('event-log');
  const evClick = document.getElementById('ev-click');
  const evHover = document.getElementById('ev-hover');
  const evDbl = document.getElementById('ev-dbl');

  function logEvent(type, message) {
    if (!eventLog) return;
    const now = new Date();
    const ts = now.toTimeString().slice(0, 8);
    const line = document.createElement('div');
    line.className = 'log-line';
    line.innerHTML = `<span class="log-ts">${ts}</span> <span class="log-type">${type}</span> ${message}`;
    eventLog.appendChild(line);
    eventLog.scrollTop = eventLog.scrollHeight;
  }

  evClick?.addEventListener('click', () => logEvent('click', 'Button clicked — click event fired!'));
  evHover?.addEventListener('mouseenter', () => logEvent('mouseenter', 'Mouse entered element — hover detected'));
  evDbl?.addEventListener('dblclick', () => logEvent('dblclick', 'Double-click detected — two clicks in quick succession'));
}

// ── Quiz Page Engine ───────────────────────────────────────────────────────
function initQuizPage() {
  if (document.body.dataset.page !== 'quiz') return;

  const PASS_THRESHOLD = 70;
  const STORAGE_KEY = 'skilllance-attempts';

  // DOM Elements
  const startScreen = document.getElementById('quiz-start-screen');
  const startBtn = document.getElementById('start-quiz-btn');
  const status = document.getElementById('quiz-status');
  const form = document.getElementById('quiz-form');
  const container = document.getElementById('quiz-container');
  const resultContent = document.getElementById('result-content');
  const rewardContent = document.getElementById('reward-content');
  const historyList = document.getElementById('attempt-history');
  const clearBtn = document.getElementById('clear-history');

  let questions = [];
  let quizStarted = false;
  let quizSubmitted = false;

  // Prevent accidental navigation (only active after first answer selected)
  const beforeUnloadHandler = (e) => {
    if (quizStarted && !quizSubmitted) {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  };

  // Fisher-Yates shuffle
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── START QUIZ: triggered by button click ────────────────────────
  async function startQuiz() {
    // Hide start screen, show quiz form
    startScreen.style.display = 'none';
    form.style.display = 'block';

    quizStarted = false;
    quizSubmitted = false;
    resultContent.innerHTML = '<p>Your score will appear here after submission.</p>';
    rewardContent.innerHTML = '<p>Pass the quiz to unlock a special reward!</p>';
    status.textContent = 'Loading questions…';
    status.style.borderColor = '';
    status.style.background = '';

    // Show loading skeleton
    container.innerHTML = Array.from({length: 5}, () => `
      <div class="question-card" style="padding:1.5rem">
        <div class="skeleton" style="height:24px;width:80%;margin-bottom:1rem"></div>
        <div class="skeleton" style="height:44px;width:100%;margin-bottom:0.5rem"></div>
        <div class="skeleton" style="height:44px;width:100%;margin-bottom:0.5rem"></div>
        <div class="skeleton" style="height:44px;width:95%"></div>
      </div>
    `).join('');

    try {
      // AJAX: Fetch questions from local JSON data file
      const response = await fetch('./data/questions.json');
      if (!response.ok) throw new Error('Failed to load questions (HTTP ' + response.status + ')');

      const data = await response.json();
      // Randomise question order each time quiz loads
      questions = shuffle(data).slice(0, 10);
      // Render questions dynamically using JavaScript (not hard-coded in HTML)
      renderQuestions(questions);
      status.textContent = `${questions.length} questions loaded and shuffled. Answer all, then submit.`;

      // Enable beforeunload only now
      window.addEventListener('beforeunload', beforeUnloadHandler);
    } catch (error) {
      status.textContent = 'Could not load questions. Please try again.';
      status.style.borderColor = 'var(--coral)';
      status.style.background = 'var(--coral-bg)';
      container.innerHTML = '<p style="color:var(--coral)">Error: ' + escapeHtml(error.message) + '</p>';
      console.error('Quiz load error:', error);
    }
  }

  // Render questions dynamically via DOM manipulation
  function renderQuestions(items) {
    container.innerHTML = items.map((item, index) => `
      <fieldset class="question-card" id="qcard-${index}">
        <legend><strong>Q${index + 1}.</strong> ${escapeHtml(item.question)}</legend>
        <div class="option-list">
          ${item.options.map((option, oi) => `
            <label class="option-item" id="opt-${index}-${oi}">
              <input type="radio" name="q${index}" value="${escapeHtml(option)}" />
              <span>${escapeHtml(option)}</span>
            </label>
          `).join('')}
        </div>
      </fieldset>
    `).join('');
  }

  // ── Start button click ───────────────────────────────────────────
  startBtn?.addEventListener('click', startQuiz);

  // Track when user starts answering (for beforeunload)
  form?.addEventListener('change', (e) => {
    if (e.target.matches('input[type="radio"]')) {
      quizStarted = true;
      quizSubmitted = false;
      status.textContent = 'Quiz in progress. Submit when you have answered all questions.';
      status.style.borderColor = '';
      status.style.background = '';
      const card = e.target.closest('.question-card');
      if (card) card.classList.remove('unanswered');
    }
  });

  // ── Submit quiz ──────────────────────────────────────────────────
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const answers = questions.map((_, i) => {
      const selected = form.querySelector(`input[name="q${i}"]:checked`);
      return selected ? selected.value : null;
    });

    // Validate: highlight unanswered with specific identification
    const unanswered = [];
    answers.forEach((ans, i) => {
      const card = document.getElementById('qcard-' + i);
      if (ans === null) {
        unanswered.push(i + 1);
        card?.classList.add('unanswered');
      } else {
        card?.classList.remove('unanswered');
      }
    });

    if (unanswered.length > 0) {
      status.textContent = `⚠️ Please answer question${unanswered.length > 1 ? 's' : ''} ${unanswered.join(', ')} before submitting.`;
      status.style.borderColor = 'var(--amber)';
      status.style.background = 'var(--amber-bg)';
      document.getElementById('qcard-' + (unanswered[0] - 1))?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Calculate score
    const score = answers.reduce((total, answer, i) => total + (answer === questions[i].answer ? 1 : 0), 0);
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= PASS_THRESHOLD;

    // Mark quiz as submitted — clear beforeunload warning
    quizSubmitted = true;
    window.removeEventListener('beforeunload', beforeUnloadHandler);

    // Show correct/incorrect per question
    questions.forEach((q, i) => {
      const card = document.getElementById('qcard-' + i);
      const isCorrect = answers[i] === q.answer;
      card?.classList.add(isCorrect ? 'correct' : 'incorrect');
      q.options.forEach((opt, oi) => {
        const label = document.getElementById('opt-' + i + '-' + oi);
        if (opt === q.answer) label?.classList.add('correct-answer');
        else if (opt === answers[i] && !isCorrect) label?.classList.add('wrong-answer');
      });
    });

    form.querySelectorAll('input[type="radio"]').forEach(r => r.disabled = true);

    status.textContent = '✓ Quiz submitted successfully!';
    status.style.borderColor = 'var(--green)';
    status.style.background = 'var(--green-bg)';

    // Animated score ring display
    const circumference = 2 * Math.PI * 50;
    const offset = circumference - (percentage / 100) * circumference;
    const ringColor = passed ? 'var(--green)' : 'var(--coral)';

    resultContent.innerHTML = `
      <div class="score-ring">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle class="score-ring-bg" cx="60" cy="60" r="50"/>
          <circle class="score-ring-fill" cx="60" cy="60" r="50"
            stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"
            style="stroke:${ringColor}"/>
        </svg>
        <div class="score-ring-text">${percentage}%</div>
      </div>
      <div class="result-metric">
        <div class="metric-box"><span>Score</span><strong>${score}/${questions.length}</strong></div>
        <div class="metric-box"><span>Percentage</span><strong>${percentage}%</strong></div>
        <div class="metric-box"><span>Status</span><strong class="${passed ? 'pass' : 'fail'}">${passed ? 'PASS ✓' : 'FAIL ✗'}</strong></div>
      </div>
      <p style="margin-top:1rem;color:var(--text-2);font-size:0.9rem">
        Pass threshold: ${PASS_THRESHOLD}%. ${passed ? 'Well done!' : 'Review the tutorial and try again.'}
      </p>
      <button type="button" class="btn btn-secondary" id="retake-quiz-btn" style="margin-top:1rem;width:100%">Retake Quiz (New Shuffle)</button>
    `;

    // Animate score ring
    requestAnimationFrame(() => {
      const ring = resultContent.querySelector('.score-ring-fill');
      if (ring) ring.style.strokeDashoffset = offset;
    });

    // Retake button
    resultContent.querySelector('#retake-quiz-btn')?.addEventListener('click', () => {
      form.style.display = 'none';
      startScreen.style.display = '';
      form.querySelectorAll('input[type="radio"]').forEach(r => { r.disabled = false; r.checked = false; });
      container.innerHTML = '';
      document.querySelectorAll('.question-card').forEach(c => c.className = 'question-card');
    });

    if (passed && typeof window.launchConfetti === 'function') window.launchConfetti();

    // Save attempt to localStorage
    saveAttempt({ score, total: questions.length, percentage, passed, date: new Date().toLocaleString() });
    renderHistory();

    // Reward: AJAX fetch from public API (only on pass)
    if (passed) {
      rewardContent.innerHTML = '<p>🎉 Fetching your reward…</p>';
      try {
        // Fetch motivational content from a public API
        const res = await fetch('https://api.adviceslip.com/advice');
        const data = await res.json();
        const advice = data.slip ? data.slip.advice : 'You are amazing!';
        rewardContent.innerHTML = `
          <div class="reward-trophy">
            <span class="trophy-icon">🏆</span>
            <p class="pass" style="font-size:1.1rem;margin-bottom:0.75rem"><strong>Champion! You passed!</strong></p>
            <p style="color:var(--text-2);font-size:0.9rem;font-style:italic;margin-bottom:0.5rem">"${escapeHtml(advice)}"</p>
            <p style="color:var(--text-3);font-size:0.75rem">— Advice Slip API</p>
          </div>`;
      } catch {
        rewardContent.innerHTML = `
          <div class="reward-trophy">
            <span class="trophy-icon">🏆</span>
            <p class="pass"><strong>Champion! You passed!</strong></p>
            <p style="color:var(--text-2);font-size:0.9rem">The reward API is unavailable, but your achievement stands!</p>
          </div>`;
      }
    } else {
      rewardContent.innerHTML = '<p>😔 Oh no! Fetching your penalty...</p>';
      try {
        const res = await fetch('https://icanhazdadjoke.com/', {
          headers: { 'Accept': 'application/json' }
        });
        const data = await res.json();
        rewardContent.innerHTML = `
        <div class="reward-fail-anim">
          <span class="fail-icon">📚</span>
          <p class="fail" style="font-size:1.05rem;margin-bottom:0.5rem">Not quite there — ${percentage}%</p>
          <p style="color:var(--text-2);font-size:0.9rem;margin-bottom:0.5rem">You need ${PASS_THRESHOLD}% to pass. Review the <a href="tutorial.html">tutorial</a> and try again!</p>
          <div style="margin-top:1rem;padding:1rem;background:var(--surface-2);border-left:4px solid var(--coral);border-radius:0 8px 8px 0;">
            <p style="font-size:0.85rem;color:var(--coral);margin-bottom:0.5rem;font-weight:bold;">YOUR PENALTY (A terrible joke):</p>
            <p style="color:var(--text);font-style:italic;">"${escapeHtml(data.joke)}"</p>
          </div>
        </div>`;
      } catch {
        rewardContent.innerHTML = `
        <div class="reward-fail-anim">
          <span class="fail-icon">📚</span>
          <p class="fail" style="font-size:1.05rem;margin-bottom:0.5rem">Not quite there — ${percentage}%</p>
          <p style="color:var(--text-2);font-size:0.9rem">You need ${PASS_THRESHOLD}% to pass. Review the <a href="tutorial.html">tutorial</a> and try again!</p>
        </div>`;
      }
    }
  });

  // Clear history
  clearBtn?.addEventListener('click', () => {
    try { localStorage.removeItem(STORAGE_KEY); renderHistory(); } catch (e) { console.warn(e); }
  });

  function saveAttempt(attempt) {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      existing.unshift(attempt);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 20)));
    } catch (e) { console.warn('Could not save attempt:', e); }
  }

  function renderHistory() {
    if (!historyList) return;
    try {
      const attempts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(attempts) || attempts.length === 0) {
        historyList.innerHTML = '<li>No attempts saved yet.</li>';
        return;
      }
      historyList.innerHTML = attempts.map(a => `
        <li><strong>${a.score || 0}/${a.total || 10} (${a.percentage || 0}%)</strong>
        <span>${a.passed ? '✓ Passed' : '✗ Failed'} — ${a.date || 'Unknown'}</span></li>
      `).join('');
    } catch { historyList.innerHTML = '<li>Could not load history.</li>'; }
  }

  // Only render history on load — do NOT auto-load quiz
  renderHistory();
}

// ── CV Page Interactions ───────────────────────────────────────────────────
function initCvInteractions() {
  // Highlight skills animation
  const highlightBtn = document.getElementById('highlight-skills');
  const targets = document.querySelectorAll('.skill-highlight-target');

  highlightBtn?.addEventListener('click', () => {
    targets.forEach((card, index) => {
      setTimeout(() => {
        card.classList.toggle('highlighted');
      }, index * 120);
    });
  });

  // Load motivational quote via AJAX
  const quoteBtn = document.getElementById('load-quote');
  const quoteOutput = document.getElementById('quote-output');

  quoteBtn?.addEventListener('click', async () => {
    if (!quoteOutput) return;
    quoteOutput.innerHTML = '<div class="glass-card"><p>Loading inspiration…</p></div>';

    try {
      // Using zenquotes proxy or fallback
      const res = await fetch('https://api.quotable.io/random');
      if (!res.ok) throw new Error('API error');

      const data = await res.json();
      quoteOutput.innerHTML = `
        <div class="glass-card">
          <p>"${escapeHtmlCV(data.content)}"</p>
          <p><strong>— ${escapeHtmlCV(data.author)}</strong></p>
        </div>
      `;
    } catch {
      const fallbacks = [
        { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { quote: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
        { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
        { quote: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
        { quote: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
      ];
      const random = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      quoteOutput.innerHTML = `
        <div class="glass-card">
          <p>"${random.quote}"</p>
          <p><strong>— ${random.author}</strong></p>
        </div>
      `;
    }
  });

  // Animate skill pills entrance on CV page
  document.querySelectorAll('.skill-pill').forEach((pill, i) => {
    pill.style.animationDelay = (i * 0.05) + 's';
  });
}

function escapeHtmlCV(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Animated SVG Grid Background ───────────────────────────────────────────
function initAnimatedGrid() {
  if (document.querySelector('.animated-grid-bg')) return;
  const grid = document.createElement('div');
  grid.className = 'animated-grid-bg';
  grid.setAttribute('aria-hidden', 'true');
  grid.innerHTML = `
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.15"/>
        </pattern>
        <linearGradient id="grid-fade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:var(--accent);stop-opacity:0.3"/>
          <stop offset="50%" style="stop-color:var(--accent);stop-opacity:0.05"/>
          <stop offset="100%" style="stop-color:var(--accent);stop-opacity:0.2"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" style="color:var(--accent)"/>
    </svg>
  `;
  document.body.prepend(grid);
}

// ── Geometric Floating Shapes ──────────────────────────────────────────────
function initGeoShapes() {
  if (document.querySelector('.geo-shapes')) return;
  const container = document.createElement('div');
  container.className = 'geo-shapes';
  container.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 5; i++) {
    const shape = document.createElement('div');
    shape.className = 'geo-shape';
    container.appendChild(shape);
  }
  document.body.prepend(container);
}

// ── Particle System (Canvas) ───────────────────────────────────────────────
function initParticles() {
  if (document.getElementById('particle-canvas')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((w * h) / 25000), 60);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const color = isDark ? '129,140,248' : '99,102,241';

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${p.opacity})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${color},${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animFrame = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}

// ── Scroll Reveal ──────────────────────────────────────────────────────────
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.content-section, .glass-card, .info-card, .path-card-large, .demo-box, ' +
    '.code-window, .question-card, .cv-sections article, .reflection-block, ' +
    '.callout-card, .hero-card, .quiz-controls, .selector-demo .sel-row, ' +
    '.alert, .tryit-wrap'
  );

  if (!revealElements.length) return;

  // Snapshot viewport size once at init
  const viewportHeight = window.innerHeight;

  revealElements.forEach(el => {
    if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
      const rect = el.getBoundingClientRect();
      // Elements already in the viewport on page load get marked visible immediately — no delayed fade
      if (rect.top < viewportHeight && rect.bottom > 0) {
        el.classList.add('reveal', 'visible');
      } else {
        el.classList.add('reveal');
      }
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop watching once it has appeared — avoids re-triggering
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    // Only observe elements that aren't already visible
    if (!el.classList.contains('visible')) {
      observer.observe(el);
    }
  });
}

// ── Confetti Celebration (Quiz Pass) ───────────────────────────────────────
function launchConfetti() {
  const colors = ['#818cf8', '#06b6d4', '#22c55e', '#fbbf24', '#f87171', '#a78bfa', '#fb923c'];
  const shapes = ['circle', 'square', 'triangle'];

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 5;

    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.width = size + 'px';
    piece.style.height = size + 'px';
    piece.style.background = color;
    piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
    piece.style.animationDelay = Math.random() * 1.5 + 's';

    if (shape === 'circle') piece.style.borderRadius = '50%';
    else if (shape === 'triangle') {
      piece.style.width = '0';
      piece.style.height = '0';
      piece.style.background = 'transparent';
      piece.style.borderLeft = size / 2 + 'px solid transparent';
      piece.style.borderRight = size / 2 + 'px solid transparent';
      piece.style.borderBottom = size + 'px solid ' + color;
    }

    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 5000);
  }
}

// Make confetti available globally for quiz
window.launchConfetti = launchConfetti;