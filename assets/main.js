/* ═══════════════════════════════════════════════════════════════════════════
   SKILLLANCE — Main JavaScript
   Features: Theme toggle, Mobile nav, Tutorial demos,
             ToC tracker, Quiz engine, CV interactions, Confetti, Victory overlay
═══════════════════════════════════════════════════════════════════════════ */

// ── Initialize on DOM Ready ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initTutorialDemos();
  initTocTracker();
  initQuizPage();
  initCvInteractions();
  // Scroll reveal — run synchronously so above-fold content is never hidden
  initScrollReveal();
});

// Also re-check on full load (fonts/images may shift layout)
window.addEventListener('load', () => {
  initScrollReveal();
});



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



// ── TOC Active State Tracker ───────────────────────────────────────────────
function initTocTracker() {
  if (document.body.dataset.page !== 'tutorial') return;

  // ── Sidebar toggle ──────────────────────────────────────────────────────
  const sidebar = document.querySelector('.toc-sidebar');
  const pageWrap = document.querySelector('.page-wrap');
  const toggleBtn = document.getElementById('toc-toggle');

  // Mobile sidebar open button (injected by this script if not present)
  let mobileSidebarBtn = document.getElementById('mobile-toc-btn');
  if (!mobileSidebarBtn) {
    mobileSidebarBtn = document.createElement('button');
    mobileSidebarBtn.id = 'mobile-toc-btn';
    mobileSidebarBtn.className = 'mobile-toc-btn';
    mobileSidebarBtn.setAttribute('aria-label', 'Open table of contents');
    mobileSidebarBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg><span>Contents</span>`;
    document.body.appendChild(mobileSidebarBtn);
  }

  // Overlay backdrop
  let overlay = document.getElementById('toc-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'toc-overlay';
    overlay.className = 'toc-overlay';
    document.body.appendChild(overlay);
  }

  function openMobileSidebar() {
    sidebar?.classList.add('mobile-open');
    overlay.classList.add('active');
    document.body.classList.add('toc-open');
  }

  function closeMobileSidebar() {
    sidebar?.classList.remove('mobile-open');
    overlay.classList.remove('active');
    document.body.classList.remove('toc-open');
  }

  mobileSidebarBtn.addEventListener('click', openMobileSidebar);
  overlay.addEventListener('click', closeMobileSidebar);

  // Close button inside the drawer
  const closeBtn = document.getElementById('toc-close');
  if (closeBtn) closeBtn.addEventListener('click', closeMobileSidebar);

  // Close on sidebar link click (mobile)
  sidebar?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth < 900) closeMobileSidebar();
    });
  });

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
    const sz = document.getElementById('sz-r')?.value || '160';
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
      <div class="question-card" id="qcard-${index}" role="group" aria-labelledby="qlabel-${index}">
        <div class="question-header">
          <span class="question-num">Q${index + 1}</span>
          <p class="question-text" id="qlabel-${index}">${escapeHtml(item.question)}</p>
        </div>
        <div class="option-list">
          ${item.options.map((option, oi) => `
            <label class="option-item" id="opt-${index}-${oi}">
              <input type="radio" name="q${index}" value="${escapeHtml(option)}" aria-describedby="qlabel-${index}" />
              <span>${escapeHtml(option)}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  // ── Start button click ───────────────────────────────────────────
  startBtn?.addEventListener('click', startQuiz);

  // Track when user starts answering (for beforeunload)
  // beforeunload is attached HERE — only after first answer selected, per spec
  let beforeUnloadAttached = false;
  form?.addEventListener('change', (e) => {
    if (e.target.matches('input[type="radio"]')) {
      quizStarted = true;
      quizSubmitted = false;
      // Attach beforeunload only on the very first answer selection
      if (!beforeUnloadAttached) {
        window.addEventListener('beforeunload', beforeUnloadHandler);
        beforeUnloadAttached = true;
      }
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
        <strong>Feedback: </strong>Pass threshold is ${PASS_THRESHOLD}%. ${passed ? 'Well done!👏🎉' : 'Review the tutorial and try again ⏳'}
      </p>
      <button type="button" class="btn btn-secondary" id="retake-quiz-btn" style="margin-top:1rem;width:100%">Retake Quiz 🔄️</button>
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
      beforeUnloadAttached = false;
    });

    // ── Compute tier (shared by overlay + sidebar reward) ─────────────────
    const tier = percentage === 100 ? { label: 'PERFECT', color: '#fbbf24', glow: '#fbbf2480', star: '⭐' }
               : percentage >= 90   ? { label: 'GOLD',    color: '#f59e0b', glow: '#f59e0b80', star: '🥇' }
               : percentage >= 80   ? { label: 'SILVER',  color: '#94a3b8', glow: '#94a3b880', star: '🥈' }
                                    : { label: 'BRONZE',  color: '#fb923c', glow: '#fb923c80', star: '🥉' };

    if (passed && typeof window.launchConfetti === 'function') {
      window.launchConfetti();
      // Show overlay immediately with spinner — avatar/inscription will hot-swap in once fetched
      showVictoryOverlay({ score, total: questions.length, percentage, tier });
    }

    // Save attempt to localStorage
    saveAttempt({ score, total: questions.length, percentage, passed, date: new Date().toLocaleString() });
    renderHistory();

    // ── Reward: two AJAX calls on pass ────────────────────────────────────
    if (passed) {
      rewardContent.innerHTML = `
        <div class="badge-loading">
          <span class="badge-spinner"></span>
          <p style="color:var(--text-2);font-size:0.85rem;margin-top:0.75rem">Forging your badge…</p>
        </div>`;

      // ── AJAX call 1: Advice Slip API — badge inscription ────────────────
      let inscription = null;
      try {
        const adviceRes = await fetch('https://api.adviceslip.com/advice?t=' + Date.now(), { cache: 'no-store' });
        if (!adviceRes.ok) throw new Error('adviceslip ' + adviceRes.status);
        const adviceData = await adviceRes.json();
        inscription = (adviceData.slip && adviceData.slip.advice) ? adviceData.slip.advice : null;
      } catch { /* fall through to next */ }

      // Fallback chain: ninja quotes via allorigins
      if (!inscription) {
        try {
          const fbRes = await fetch(
            'https://api.allorigins.win/get?url=' + encodeURIComponent('https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en'),
            { cache: 'no-store' }
          );
          const fbData = await fbRes.json();
          const fbParsed = JSON.parse(fbData.contents);
          if (fbParsed && fbParsed.quoteText) inscription = fbParsed.quoteText.trim().replace(/\\'/g, "'");
        } catch { /* ignore */ }
      }
      if (!inscription) inscription = 'Every expert was once a beginner. Keep building.';

      // ── AJAX call 2: Multiavatar API — unique badge avatar SVG ──────────
      // Seed locked to score only (no Date.now()) so overlay + sidebar share the same avatar
      const avatarSeed = encodeURIComponent('skilllance-' + score + '-' + percentage);
      const avatarUrl = 'https://api.multiavatar.com/' + avatarSeed + '.svg';

      // ── Hot-swap the victory overlay avatar + inscription once ready ─────
      updateVictoryOverlayBadge({ avatarUrl, inscription, score, total: questions.length, percentage, tier });

      // ── Render the same badge in the sidebar reward panel ────────────────
      rewardContent.innerHTML = `
        <div class="earned-badge" style="--badge-color:${tier.color};--badge-glow:${tier.glow};">
          <div class="badge-tier-label">${tier.star} ${tier.label} TIER</div>

          <div class="badge-medal-wrap">
            <div class="badge-ring-outer">
              <div class="badge-ring-inner">
                <img
                  src="${avatarUrl}"
                  alt="Your unique Web Dev badge avatar"
                  class="badge-avatar-img"
                  width="80" height="80"
                  onerror="this.outerHTML='<span style=\\'font-size:3rem;line-height:1\\'>🏆</span>'"
                />
              </div>
            </div>
            <div class="badge-shine" aria-hidden="true"></div>
          </div>

          <div class="badge-name-plate">
            <p class="badge-title">Web Dev Skills 101</p>
            <p class="badge-subtitle">Certified Passer · ${score}/${questions.length} · ${percentage}%</p>
          </div>

          <div class="badge-inscription-wrap">
            <p class="badge-inscription">"${escapeHtml(inscription)}"</p>
            <p class="badge-api-credit">— Advice Slip API &amp; Multiavatar API</p>
          </div>

          <div class="badge-stamp">ISSUED ${new Date().toLocaleDateString('en-AU', { day:'numeric', month:'short', year:'numeric' }).toUpperCase()}</div>
        </div>`;
    } else {
      rewardContent.innerHTML = '<p>😔 Oh no! Fetching your penalty...</p>';
      try {
        const res = await fetch('https://icanhazdadjoke.com/', {
          headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) throw new Error('Joke API returned ' + res.status);
        const data = await res.json();
        const joke = (data && data.joke) ? data.joke : 'Why do programmers prefer dark mode? Because light attracts bugs!';
        rewardContent.innerHTML = `
        <div class="reward-fail-anim">
          <span class="fail-icon">📚</span>
          <p class="fail" style="font-size:1.05rem;margin-bottom:0.5rem">Not quite there — ${percentage}%</p>
          <p style="color:var(--text-2);font-size:0.9rem;margin-bottom:0.5rem">You need ${PASS_THRESHOLD}% to pass⚠️. <br>Review the <a href="tutorial.html">tutorial</a> and try again!🔄️</p>
          <div style="margin-top:1rem;padding:1rem;background:var(--surface-2);border-left:4px solid var(--coral);border-radius:0 8px 8px 0;">
            <p style="font-size:0.85rem;color:var(--coral);margin-bottom:0.5rem;font-weight:bold;">YOUR PENALTY (A terrible joke):</p>
            <p style="color:var(--text);font-style:italic;">"${escapeHtml(joke)}"</p>
          </div>
        </div>`;
      } catch {
        rewardContent.innerHTML = `
        <div class="reward-fail-anim">
          <span class="fail-icon">📚</span>
          <p class="fail" style="font-size:1.05rem;margin-bottom:0.5rem">Not quite there — ${percentage}%</p>
          <p style="color:var(--text-2);font-size:0.9rem">You need ${PASS_THRESHOLD}% to pass⚠️. <br>Review the <a href="tutorial.html">tutorial</a> and try again!🔄️</p>
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
      historyList.innerHTML = attempts.map(a => {
        // Validate each field — guard against malformed/missing data
        const score      = (typeof a.score      === 'number') ? a.score      : '?';
        const total      = (typeof a.total      === 'number') ? a.total      : 10;
        const percentage = (typeof a.percentage === 'number') ? a.percentage : '?';
        const passed     = (typeof a.passed     === 'boolean') ? a.passed    : false;
        const date       = (typeof a.date       === 'string' && a.date) ? a.date : 'Unknown';
        return `<li><strong>${score}/${total} (${percentage}%)</strong>
        <span>${passed ? '✓ Passed' : '✗ Failed'} — ${date}</span></li>`;
      }).join('');
    } catch { historyList.innerHTML = '<li>Could not load history.</li>'; }
  }

  // Only render history on load — do NOT auto-load quiz
  renderHistory();
}

// ── CV Page Interactions ───────────────────────────────────────────────────
function initCvInteractions() {
  if (document.body.dataset.page !== 'cv') return;

  // ── 0. Typewriter effect on the hero name (loops, keeps first char) ────
  (function initCvTypewriter() {
    const el = document.getElementById('cv-typewriter');
    if (!el) return;
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);

    let i = text.length; // start fully typed
    let deleting = true;  // immediately begin delete cycle

    function tick() {
      if (!deleting) {
        // Typing forward
        el.textContent = text.slice(0, i + 1);
        i++;
        if (i === text.length) {
          deleting = true;
          setTimeout(tick, 2800); // pause fully typed
          return;
        }
        setTimeout(tick, 110 + Math.random() * 60); // slower typing
      } else {
        // Deleting — stop at first character
        el.textContent = text.slice(0, i - 1);
        i--;
        if (i === 1) {
          deleting = false;
          setTimeout(tick, 900); // pause at "A" before retyping
          return;
        }
        setTimeout(tick, 55 + Math.random() * 30); // slower deleting
      }
    }

    setTimeout(tick, 1000); // initial delay
  })();

  // ── 1. Animated Skill Bars (IntersectionObserver) ──────────────────────
  const bars = document.querySelectorAll('.cv-bar-fill');
  if (bars.length) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(bar => barObserver.observe(bar));
  }

  // ── 1b. Count-up animation for stat numbers ────────────────────────────
  const statNums = document.querySelectorAll('.cv-stat-num');
  if (statNums.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target  = parseInt(el.dataset.target, 10);
        const suffix  = el.dataset.suffix || '';
        const dur     = 1400;
        const start   = performance.now();

        function tick(now) {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / dur, 1);
          // Ease-out cubic
          const eased  = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.6 });
    statNums.forEach(n => countObserver.observe(n));
  }

  // ── 2. Profile photo 3D mouse tilt ────────────────────────────────────
  (function initCvPhotoTilt() {
    const wrap = document.getElementById('cv-photo-tilt');
    if (!wrap) return;
    const STRENGTH = 10;
    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const nx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
      const ny = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
      wrap.style.transform =
        `perspective(700px) rotateX(${-ny * STRENGTH}deg) rotateY(${nx * STRENGTH}deg)`;
    });
    wrap.addEventListener('mouseleave', () => {
      wrap.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg)';
    });
  })();

  // ── 3. Experience Tab Filter ────────────────────────────────────────────

  const tabs = document.querySelectorAll('.cv-tab');
  const expItems = document.querySelectorAll('#experience-timeline .exp-item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab state
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter;

      // Show/hide experience items
      expItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.removeAttribute('hidden');
          // Animate back in
          item.style.opacity = '0';
          item.style.transform = 'translateY(8px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          });
        } else {
          item.setAttribute('hidden', '');
          item.style.opacity = '';
          item.style.transform = '';
          item.style.transition = '';
        }
      });
    });
  });

  // ── 4. Tech Skill Tag Filter (highlights matching bullets) ────────────
  const techTags  = document.querySelectorAll('#cv-tech-tags .cv-tech-tag');
  const allBullets = document.querySelectorAll('.exp-bullets li');
  let activeSkill  = null;

  techTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const skill = tag.dataset.skill.toLowerCase();

      // Toggle off if already active
      if (activeSkill === skill) {
        activeSkill = null;
        techTags.forEach(t => t.classList.remove('active'));
        allBullets.forEach(li => li.classList.remove('skill-highlight'));
        return;
      }

      // Activate this tag
      activeSkill = skill;
      techTags.forEach(t => t.classList.toggle('active', t.dataset.skill.toLowerCase() === skill));

      // Highlight matching bullets, dim others
      allBullets.forEach(li => {
        const matches = li.textContent.toLowerCase().includes(skill);
        li.classList.toggle('skill-highlight', matches);
      });

      // Scroll first match into view
      const first = Array.from(allBullets).find(li => li.textContent.toLowerCase().includes(skill));
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // ── 5. Load motivational quote via AJAX ────────────────────────────────

  const quoteBtn = document.getElementById('load-quote');
  const quoteOutput = document.getElementById('quote-output');

  quoteBtn?.addEventListener('click', async () => {
    if (!quoteOutput) return;
    quoteBtn.disabled = true;
    quoteBtn.textContent = 'Fetching...';
    quoteOutput.innerHTML = '<div class="glass-card"><p style="color:var(--text-2);font-size:0.85rem;">Loading...</p></div>';

    try {
      const res = await fetch('https://api.quotable.io/random');
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      quoteOutput.innerHTML = `
        <div class="glass-card" style="margin-top:0.5rem;">
          <p style="color:var(--text);font-style:italic;line-height:1.65;font-size:0.9rem;">"${escapeHtmlCV(data.content)}"</p>
          <p style="color:var(--accent);font-family:'Fira Code',monospace;font-size:0.8rem;margin-top:0.5rem;">— ${escapeHtmlCV(data.author)}</p>
          <p style="color:var(--text-3);font-size:0.7rem;margin-top:0.3rem;">Source: Quotable API (live fetch)</p>
        </div>
      `;
    } catch {
      const fallbacks = [
        { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { quote: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
        { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
        { quote: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
        { quote: "Data is the new oil, but refining it is the real work.", author: "Unknown" },
      ];
      const random = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      quoteOutput.innerHTML = `
        <div class="glass-card" style="margin-top:0.5rem;">
          <p style="color:var(--text);font-style:italic;line-height:1.65;font-size:0.9rem;">"${random.quote}"</p>
          <p style="color:var(--accent);font-family:'Fira Code',monospace;font-size:0.8rem;margin-top:0.5rem;">— ${random.author}</p>
          <p style="color:var(--text-3);font-size:0.7rem;margin-top:0.3rem;">Fallback quote (API unavailable)</p>
        </div>
      `;
    } finally {
      quoteBtn.disabled = false;
      quoteBtn.textContent = 'Fetch Another';
    }
  });

  // ── 4. Scroll-reveal for CV sections ───────────────────────────────────
  const revealTargets = document.querySelectorAll('.cv-section, .cv-sidebar-card');
  if (revealTargets.length) {
    const cvRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('cv-revealed');
          cvRevealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealTargets.forEach(el => {
      el.classList.add('cv-hidden');
      cvRevealObserver.observe(el);
    });
  }

  // ── 6. Scroll progress bar + FAB visibility ────────────────────────────
  const progressBar = document.getElementById('cv-scroll-progress');
  const fabGroup    = document.getElementById('cv-fab-group');
  const fabTop      = document.getElementById('cv-fab-top');
  const heroHeader  = document.querySelector('.cv-hero-banner');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Progress bar
    if (progressBar && docHeight > 0) {
      progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
    }

    // FAB appears after scrolling past hero
    if (fabGroup && heroHeader) {
      const threshold = heroHeader.offsetTop + heroHeader.offsetHeight - 80;
      fabGroup.classList.toggle('cv-fab-visible', scrollTop > threshold);
    }
  }, { passive: true });

  // Back to top
  fabTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}



function escapeHtmlCV(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}



// ── Scroll Reveal ──────────────────────────────────────────────────────────
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.content-section, .glass-card, .info-card, .demo-box, ' +
    '.code-window, .question-card, .cv-sections article, .reflection-block, ' +
    '.callout-card, .quiz-controls, .selector-demo .sel-row, ' +
    '.alert, .tryit-wrap'
  );

  if (!revealElements.length) return;

  // Use a generous viewport extension so elements near the fold are visible immediately
  const viewportHeight = window.innerHeight;
  const BUFFER = 120; // px of extra buffer below fold

  revealElements.forEach(el => {
    // Skip if already processed
    if (el.dataset.revealInit) return;
    el.dataset.revealInit = '1';

    if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
      const rect = el.getBoundingClientRect();
      // Immediately show anything in viewport + buffer zone
      if (rect.top < viewportHeight + BUFFER && rect.bottom > 0) {
        el.classList.add('reveal', 'visible');
      } else {
        el.classList.add('reveal');
      }
    }
  });

  // rootMargin: pre-reveal elements 100px before they enter view (no bottom cut-off)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px 0px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    if (!el.classList.contains('visible')) {
      observer.observe(el);
    }
  });
}

// ── Victory Overlay (Quiz Pass) ────────────────────────────────────────────
function showVictoryOverlay({ score, total, percentage, tier }) {
  // Remove any existing overlay
  document.getElementById('victory-overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'victory-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Quiz passed — victory screen');

  overlay.innerHTML = `
    <div class="victory-backdrop"></div>
    <div class="victory-modal" style="--badge-color:${tier.color};--badge-glow:${tier.glow};">
      <button class="victory-close" id="victory-close-btn" aria-label="Close victory screen">✕</button>

      <div class="victory-rays" aria-hidden="true">
        ${Array.from({length: 12}, (_, i) => `<div class="victory-ray" style="--i:${i}"></div>`).join('')}
      </div>

      <div class="victory-top">
        <div class="victory-stars" aria-hidden="true">
          <span class="vs vs-1">✦</span>
          <span class="vs vs-2">★</span>
          <span class="vs vs-3">✦</span>
        </div>
        <p class="victory-eyebrow">Quiz Complete</p>
        <h2 class="victory-title">You Passed! 🎉</h2>
        <p class="victory-score-line">
          <span class="victory-score-num">${score}<span class="victory-score-den">/${total}</span></span>
          <span class="victory-score-pct">${percentage}%</span>
        </p>
      </div>

      <div class="victory-badge-wrap" id="victory-badge-wrap">
        <div class="victory-badge-ring-outer">
          <div class="victory-badge-ring-inner">
            <div class="victory-badge-avatar-placeholder" id="victory-avatar-slot">
              <span class="badge-spinner" style="width:44px;height:44px;border-width:3px;"></span>
            </div>
          </div>
        </div>
        <div class="victory-badge-shine" aria-hidden="true"></div>
        <div class="victory-badge-pulse" aria-hidden="true"></div>
      </div>

      <div class="victory-tier-pill">
        ${tier.star} ${tier.label} TIER
      </div>

      <p class="victory-subtitle">Your badge is being forged in the sidebar →</p>

      <div class="victory-actions">
        <button type="button" class="btn btn-primary victory-continue-btn" id="victory-continue-btn">
          Awesome! Continue →
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Trap focus on the overlay
  requestAnimationFrame(() => {
    overlay.classList.add('victory-visible');
    document.getElementById('victory-continue-btn')?.focus();
  });

  function closeOverlay() {
    overlay.classList.remove('victory-visible');
    overlay.classList.add('victory-hiding');
    setTimeout(() => overlay.remove(), 500);
  }

  document.getElementById('victory-close-btn')?.addEventListener('click', closeOverlay);
  document.getElementById('victory-continue-btn')?.addEventListener('click', closeOverlay);

  // Close on backdrop click
  overlay.querySelector('.victory-backdrop')?.addEventListener('click', closeOverlay);

  // Close on Escape key
  function onKeyDown(e) {
    if (e.key === 'Escape') { closeOverlay(); document.removeEventListener('keydown', onKeyDown); }
  }
  document.addEventListener('keydown', onKeyDown);

  // Auto-dismiss after 7 seconds
  const autoTimer = setTimeout(() => {
    if (document.getElementById('victory-overlay')) closeOverlay();
  }, 7000);

  overlay.querySelector('.victory-continue-btn')?.addEventListener('click', () => clearTimeout(autoTimer));
}

// ── Hot-swap the victory overlay avatar once AJAX resolves ────────────────
function updateVictoryOverlayBadge({ avatarUrl, inscription, score, total, percentage, tier }) {
  const slot = document.getElementById('victory-avatar-slot');
  if (!slot) return; // overlay already closed — nothing to do

  // Swap spinner → real avatar image (same as sidebar badge)
  slot.innerHTML = `
    <img
      src="${avatarUrl}"
      alt="Your unique Web Dev badge avatar"
      class="badge-avatar-img"
      width="90" height="90"
      style="width:90px;height:90px;border-radius:50%;object-fit:cover;
             animation:victoryAvatarPop 0.45s cubic-bezier(0.34,1.56,0.64,1) both;"
      onerror="this.outerHTML='<span style=\\'font-size:2.5rem;line-height:1\\'>${tier.star}</span>'"
    />`;

  // Also inject inscription below the tier pill if overlay is still open
  const modal = document.querySelector('.victory-modal');
  if (!modal) return;

  // Remove any existing inscription block to avoid duplicates
  modal.querySelector('.victory-inscription-live')?.remove();

  const subtitleEl = modal.querySelector('.victory-subtitle');
  if (subtitleEl) {
    const insc = document.createElement('div');
    insc.className = 'victory-inscription-live';
    insc.innerHTML = `
      <div class="victory-insc-inner">
        <p class="victory-insc-text">"${inscription}"</p>
        <p class="victory-insc-credit">— Advice Slip API</p>
      </div>`;
    subtitleEl.insertAdjacentElement('beforebegin', insc);
  }
}

// ── Confetti Celebration (Quiz Pass) ───────────────────────────────────────
function launchConfetti() {
  const colors = ['#4f46e5', '#0ea5e9', '#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#f97316', '#ec4899', '#10b981'];
  const shapes = ['circle', 'square', 'triangle', 'rect'];
  const TOTAL = 160;

  // Launch in two waves for a burst effect
  spawnBatch(TOTAL * 0.6, 0);
  spawnBatch(TOTAL * 0.4, 600);

  function spawnBatch(count, delayOffset) {
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 12 + 6;
      const duration = (Math.random() * 2.5 + 2.5).toFixed(2);
      const delay = (Math.random() * 1.8 + delayOffset / 1000).toFixed(2);
      const startRotation = Math.floor(Math.random() * 360);
      const drift = (Math.random() * 120 - 60).toFixed(1); // horizontal drift in px

      // Critical fix: set top so translateY(-100vh) starts from visible top
      piece.style.position = 'fixed';
      piece.style.top = '0';
      piece.style.left = (Math.random() * 105 - 2.5) + 'vw';
      piece.style.width = size + 'px';
      piece.style.height = shape === 'rect' ? size * 0.45 + 'px' : size + 'px';
      piece.style.background = color;
      piece.style.zIndex = '99999';
      piece.style.pointerEvents = 'none';
      piece.style.animationDuration = duration + 's';
      piece.style.animationDelay = delay + 's';
      piece.style.animationFillMode = 'both';
      piece.style.animationTimingFunction = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      piece.style.setProperty('--drift', drift + 'px');
      piece.style.setProperty('--start-rot', startRotation + 'deg');

      if (shape === 'circle') {
        piece.style.borderRadius = '50%';
        piece.style.animationName = 'confettiFall';
      } else if (shape === 'triangle') {
        piece.style.width = '0';
        piece.style.height = '0';
        piece.style.background = 'transparent';
        piece.style.borderLeft = size / 2 + 'px solid transparent';
        piece.style.borderRight = size / 2 + 'px solid transparent';
        piece.style.borderBottom = size + 'px solid ' + color;
        piece.style.animationName = 'confettiFallTriangle';
      } else {
        piece.style.borderRadius = shape === 'rect' ? '2px' : '2px';
        piece.style.animationName = 'confettiFall';
      }

      document.body.appendChild(piece);
      const lifetime = (parseFloat(duration) + parseFloat(delay) + 0.5) * 1000;
      setTimeout(() => piece.remove(), lifetime);
    }
  }
}

// Make confetti available globally for quiz
window.launchConfetti = launchConfetti;

// ── Hero Title 3D Tilt Effect ──────────────────────────────────────────────
(function initHeroTilt() {
  const el = document.getElementById('hero-title-3d');
  if (!el) return;

  const STRENGTH = 6;    // max degrees of tilt (subtle)
  const LIFT     = -2;   // slight Z-lift on hover (in px)

  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;

    // Normalise mouse position to -1 … +1
    const nx = (e.clientX - cx) / (rect.width  / 2);
    const ny = (e.clientY - cy) / (rect.height / 2);

    // rotateX based on vertical position (invert so leaning toward mouse)
    const rotX =  -ny * STRENGTH;
    const rotY =   nx * STRENGTH;

    el.style.transform =
      `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${LIFT}px)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  });
})();