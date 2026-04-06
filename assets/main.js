/* ═══════════════════════════════════════════════════════════════════════════
   SKILLLANCE — Main JavaScript
   Features: Theme toggle, Tutorial demos, Quiz engine, CV interactions
═══════════════════════════════════════════════════════════════════════════ */

// ── HTML Concept Explanations ──────────────────────────────────────────────
const htmlConcepts = {
  header: '<strong>&lt;header&gt;</strong> introduces a page or section with branding, navigation, or a title. It helps users orient themselves.',
  section: '<strong>&lt;section&gt;</strong> groups related content into a meaningful part of the page. Each section usually has its own heading.',
  nav: '<strong>&lt;nav&gt;</strong> contains navigation links that help users move between pages or sections of a website.',
  main: '<strong>&lt;main&gt;</strong> wraps the primary content of a page. There should only be one per page.',
  article: '<strong>&lt;article&gt;</strong> represents self-contained content that could stand alone, like a blog post or news story.',
  aside: '<strong>&lt;aside&gt;</strong> contains content tangentially related to the main content, like sidebars or callout boxes.',
  footer: '<strong>&lt;footer&gt;</strong> typically contains copyright, contact info, or links at the bottom of a page or section.',
  a: '<strong>&lt;a&gt;</strong> creates a hyperlink so users can navigate to another page, section, or external resource.',
  img: '<strong>&lt;img&gt;</strong> embeds an image. Always include descriptive alt text for accessibility.',
  form: '<strong>&lt;form&gt;</strong> creates an interactive section for user input, containing fields, buttons, and validation.',
};

// ── Initialize on DOM Ready ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initTutorialDemos();
  initQuizPage();
  initCvInteractions();
});

// ── Theme Toggle ───────────────────────────────────────────────────────────
function initTheme() {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  
  // Check for saved preference or system preference
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
  
  // Close menu when clicking a link
  links?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── Tutorial Page Demos ────────────────────────────────────────────────────
function initTutorialDemos() {
  // HTML Element Explorer
  const htmlDemo = document.querySelector('[data-html-demo]');
  const htmlOutput = document.querySelector('[data-html-output]');
  
  htmlDemo?.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip[data-concept]');
    if (!chip) return;
    
    htmlDemo.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    
    const concept = chip.dataset.concept;
    if (htmlConcepts[concept]) {
      htmlOutput.innerHTML = htmlConcepts[concept];
    }
  });
  
  // CSS Theme Switcher
  const styleButtons = document.querySelectorAll('[data-style]');
  const styleDemo = document.querySelector('[data-style-demo]');
  
  styleButtons.forEach(button => {
    button.addEventListener('click', () => {
      styleButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      styleDemo.className = `style-demo ${button.dataset.style}`;
    });
  });
  
  // JavaScript Counter Demo (Original)
  const counterBtn = document.querySelector('[data-counter-btn]');
  const counterValue = document.querySelector('[data-counter-value]');
  let count = 0;
  
  counterBtn?.addEventListener('click', () => {
    count += 1;
    counterValue.textContent = count;
    
    // Add a little bounce animation
    counterValue.style.transform = 'scale(1.2)';
    setTimeout(() => {
      counterValue.style.transform = 'scale(1)';
    }, 150);
  });
  
  // ═══ NEW DEMOS ═══
  
  // HTML Try It Editor
  const htmlEditor = document.getElementById('html-editor');
  const htmlPreview = document.getElementById('html-preview');
  const htmlRunBtn = document.getElementById('html-run');
  
  function runHtmlEditor() {
    if (!htmlEditor || !htmlPreview) return;
    htmlPreview.srcdoc = htmlEditor.value;
  }
  
  htmlRunBtn?.addEventListener('click', runHtmlEditor);
  
  // Allow Tab key in textarea
  htmlEditor?.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = htmlEditor.selectionStart;
      htmlEditor.value = htmlEditor.value.substring(0, start) + '  ' + htmlEditor.value.substring(htmlEditor.selectionEnd);
      htmlEditor.selectionStart = htmlEditor.selectionEnd = start + 2;
    }
    // Run on Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') runHtmlEditor();
  });
  
  // Auto-run on page load
  if (htmlEditor && htmlPreview) {
    runHtmlEditor();
  }
  
  // CSS Playground
  const cssBg = document.getElementById('css-bg');
  const cssRadius = document.getElementById('css-radius');
  const cssPadding = document.getElementById('css-padding');
  const cssOpacity = document.getElementById('css-opacity');
  const cssBox = document.getElementById('css-box');
  
  function updateCssPlayground() {
    if (!cssBox) return;
    
    if (cssBg) cssBox.style.backgroundColor = cssBg.value;
    if (cssRadius) {
      cssBox.style.borderRadius = cssRadius.value + 'px';
      document.getElementById('css-radius-val').textContent = cssRadius.value + 'px';
    }
    if (cssPadding) {
      cssBox.style.padding = cssPadding.value + 'px';
      document.getElementById('css-padding-val').textContent = cssPadding.value + 'px';
    }
    if (cssOpacity) {
      cssBox.style.opacity = cssOpacity.value;
      document.getElementById('css-opacity-val').textContent = cssOpacity.value;
    }
  }
  
  [cssBg, cssRadius, cssPadding, cssOpacity].forEach(el => {
    el?.addEventListener('input', updateCssPlayground);
  });
  
  // Enhanced Counter Demo
  const counterDisplay = document.getElementById('counter-display');
  const counterCodeVal = document.getElementById('counter-code-val');
  const btnInc = document.getElementById('btn-inc');
  const btnDec = document.getElementById('btn-dec');
  const btnRst = document.getElementById('btn-rst');
  let counterVal = 0;
  
  function updateCounter(newVal) {
    counterVal = newVal;
    if (counterDisplay) {
      counterDisplay.textContent = counterVal;
      counterDisplay.style.color = counterVal > 0 ? 'var(--green)' : counterVal < 0 ? 'var(--coral)' : 'var(--accent)';
      counterDisplay.style.transform = 'scale(1.15)';
      setTimeout(() => {
        counterDisplay.style.transform = 'scale(1)';
      }, 150);
    }
    if (counterCodeVal) {
      counterCodeVal.textContent = counterVal;
    }
  }
  
  btnInc?.addEventListener('click', () => updateCounter(counterVal + 1));
  btnDec?.addEventListener('click', () => updateCounter(counterVal - 1));
  btnRst?.addEventListener('click', () => updateCounter(0));
  
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
  
  evClick?.addEventListener('click', () => {
    logEvent('click', 'Button clicked — click event fired!');
  });
  
  evHover?.addEventListener('mouseenter', () => {
    logEvent('mouseenter', 'Mouse entered element — hover detected');
  });
  
  evDbl?.addEventListener('dblclick', () => {
    logEvent('dblclick', 'Double-click detected — two clicks in quick succession');
  });
}

// ── Quiz Page Engine ───────────────────────────────────────────────────────
function initQuizPage() {
  if (document.body.dataset.page !== 'quiz') return;
  
  const PASS_THRESHOLD = 70;
  const STORAGE_KEY = 'skilllance-attempts';
  
  // DOM Elements
  const status = document.getElementById('quiz-status');
  const form = document.getElementById('quiz-form');
  const container = document.getElementById('quiz-container');
  const resultContent = document.getElementById('result-content');
  const rewardContent = document.getElementById('reward-content');
  const historyList = document.getElementById('attempt-history');
  const reloadBtn = document.getElementById('reload-quiz');
  
  let questions = [];
  let quizStarted = false;
  let quizSubmitted = false;
  
  // Prevent accidental navigation during quiz
  const beforeUnloadHandler = (e) => {
    if (quizStarted && !quizSubmitted) {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  };
  
  window.addEventListener('beforeunload', beforeUnloadHandler);
  
  // Utility: Shuffle array
  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }
  
  // Utility: Escape HTML
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  
  // Load and render quiz
  async function loadQuiz() {
    quizStarted = false;
    quizSubmitted = false;
    status.textContent = 'Loading questions…';
    resultContent.innerHTML = '<p>Your score will appear here after submission.</p>';
    rewardContent.innerHTML = '<p>Pass the quiz to unlock a special message!</p>';
    
    try {
      const response = await fetch('questions.json');
      if (!response.ok) throw new Error('Failed to load');
      
      const data = await response.json();
      questions = shuffle(data).slice(0, 10);
      renderQuestions(questions);
      status.textContent = `${questions.length} questions loaded. Answer all questions, then submit.`;
    } catch (error) {
      status.textContent = 'Sorry, questions could not be loaded. Please refresh the page.';
      container.innerHTML = '<p style="color: var(--coral);">Error loading quiz data.</p>';
      console.error('Quiz load error:', error);
    }
  }
  
  // Render questions
  function renderQuestions(items) {
    container.innerHTML = items.map((item, index) => `
      <fieldset class="question-card">
        <legend><strong>Q${index + 1}.</strong> ${escapeHtml(item.question)}</legend>
        <div class="option-list">
          ${item.options.map(option => `
            <label class="option-item">
              <input type="radio" name="q${index}" value="${escapeHtml(option)}" />
              <span>${escapeHtml(option)}</span>
            </label>
          `).join('')}
        </div>
      </fieldset>
    `).join('');
  }
  
  // Track when quiz starts
  form?.addEventListener('change', (e) => {
    if (e.target.matches('input[type="radio"]')) {
      quizStarted = true;
      quizSubmitted = false;
      status.textContent = 'Quiz in progress. Your answers are not yet submitted.';
    }
  });
  
  // Submit quiz
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Collect answers
    const answers = questions.map((_, i) => {
      const selected = form.querySelector(`input[name="q${i}"]:checked`);
      return selected ? selected.value : null;
    });
    
    // Check all answered
    if (answers.includes(null)) {
      status.textContent = '⚠️ Please answer every question before submitting.';
      status.style.borderColor = 'var(--amber)';
      status.style.background = 'var(--amber-bg)';
      return;
    }
    
    // Calculate score
    const score = answers.reduce((total, answer, i) => {
      return total + (answer === questions[i].answer ? 1 : 0);
    }, 0);
    
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= PASS_THRESHOLD;
    
    quizSubmitted = true;
    window.removeEventListener('beforeunload', beforeUnloadHandler);
    
    // Update status
    status.textContent = '✓ Quiz submitted successfully!';
    status.style.borderColor = 'var(--green)';
    status.style.background = 'var(--green-bg)';
    
    // Show results
    resultContent.innerHTML = `
      <div class="result-metric">
        <div class="metric-box">
          <span>Score</span>
          <strong>${score}/${questions.length}</strong>
        </div>
        <div class="metric-box">
          <span>Percentage</span>
          <strong>${percentage}%</strong>
        </div>
        <div class="metric-box">
          <span>Status</span>
          <strong class="${passed ? 'pass' : 'fail'}">${passed ? 'PASS' : 'FAIL'}</strong>
        </div>
      </div>
    `;
    
    // Save attempt
    saveAttempt({ score, percentage, passed, date: new Date().toLocaleString() });
    renderHistory();
    
    // Fetch reward if passed
    if (passed) {
      rewardContent.innerHTML = '<p>🎉 Fetching your reward…</p>';
      try {
        const res = await fetch('https://compliments-api.vercel.app/random');
        const data = await res.json();
        rewardContent.innerHTML = `
          <p class="pass"><strong>🏆 Unlocked:</strong> ${escapeHtml(data.compliment || 'Excellent work!')}</p>
        `;
      } catch {
        rewardContent.innerHTML = `
          <p class="pass">🎉 Congratulations on passing! The reward API is unavailable, but your success counts!</p>
        `;
      }
    } else {
      rewardContent.innerHTML = `
        <p class="fail">📚 Not quite there yet. Review the tutorial and try again!</p>
      `;
    }
  });
  
  // Reload quiz
  reloadBtn?.addEventListener('click', () => {
    window.addEventListener('beforeunload', beforeUnloadHandler);
    status.style.borderColor = '';
    status.style.background = '';
    loadQuiz();
  });
  
  // Storage functions
  function saveAttempt(attempt) {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      existing.unshift(attempt);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 10)));
    } catch (e) {
      console.warn('Could not save attempt:', e);
    }
  }
  
  function renderHistory() {
    try {
      const attempts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      historyList.innerHTML = attempts.length
        ? attempts.map(a => `
            <li>
              <strong>${a.score}/10 (${a.percentage}%)</strong>
              <span>${a.passed ? '✓ Passed' : '✗ Failed'} — ${a.date}</span>
            </li>
          `).join('')
        : '<li>No attempts saved yet.</li>';
    } catch {
      historyList.innerHTML = '<li>Could not load history.</li>';
    }
  }
  
  // Initialize
  renderHistory();
  loadQuiz();
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
      }, index * 100);
    });
  });
  
  // Load motivational quote
  const quoteBtn = document.getElementById('load-quote');
  const quoteOutput = document.getElementById('quote-output');
  
  quoteBtn?.addEventListener('click', async () => {
    quoteOutput.innerHTML = '<div class="glass-card"><p>Loading inspiration…</p></div>';
    
    try {
      // Try quotable API first
      const res = await fetch('https://api.quotable.io/random');
      if (!res.ok) throw new Error('API error');
      
      const data = await res.json();
      quoteOutput.innerHTML = `
        <div class="glass-card">
          <p>"${data.content}"</p>
          <p><strong>— ${data.author}</strong></p>
        </div>
      `;
    } catch {
      // Fallback quotes
      const fallbacks = [
        { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { quote: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
        { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
        { quote: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
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
}
