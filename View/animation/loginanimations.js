document.addEventListener('DOMContentLoaded', () => {
  // ===== Matrix easter egg state =====
  let matrixMode = false;          // off by default
  let eyeClicks = 0;
  let eyeClickTimer = null;        // resets the click streak

  // ===== 1) Falling code background =====
  const codeBg = document.getElementById('codeBg');
  if (!codeBg) return;

  // Normal "IT code" lines
  const codeSnippets = [
    'for(let i=0;i<items.length;i++){}',
    'SELECT * FROM users WHERE id = ?;',
    'const hash = await bcrypt.hash(pw, 12);',
    'curl -X POST /api/login -H "Content-Type: application/json"',
    'npm run build && npm start',
    'git commit -m "feat: auth"'
  ];

  // Matrix glyph pool
  const MATRIX_CHARS = 'ｱｶｻﾀﾅﾊﾏﾔﾗﾜﾝｳｵﾑｼﾂﾈﾎﾕﾒﾘ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function columnsForWidth() {
    const w = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    if (w <= 420) return 6;
    if (w <= 640) return 8;
    if (w <= 960) return 10;
    return 12;
  }

  function randomMatrixLine(len) {
    let s = '';
    for (let i = 0; i < len; i++) {
      s += MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
    }
    return s;
  }

  function makeColumn(i, total) {
    const d = document.createElement('div');
    d.className = 'code-column';

    const laneW = (codeBg.clientWidth || window.innerWidth) / total;
    const x = Math.round(i * laneW + laneW / 2 - 10);
    d.style.left = x + 'px';

    // Sizes/speeds
    const baseFont = (window.innerWidth <= 480) ? 11 : 12;
    d.style.fontSize = (baseFont + Math.random() * 3) + 'px';

    const baseSpeed = (window.innerWidth <= 480) ? 24 : 20;
    const speed = baseSpeed + Math.random() * 18;
    d.style.setProperty('--speed', prefersReduced ? '0s' : `${speed}s`);
    d.style.setProperty('--delay', prefersReduced ? '0s' : `${-Math.random() * speed}s`);
    d.style.setProperty('--colOpacity', (matrixMode ? 0.75 : 0.62) + Math.random() * 0.12);

    // Content
    let block = '';
    const lines = (window.innerHeight <= 700) ? 120 : 160;

    if (matrixMode) {
      // Make each line a fixed-ish width of random glyphs
      const minLen = 18, maxLen = 26;
      for (let k = 0; k < lines; k++) {
        const len = Math.floor(minLen + Math.random() * (maxLen - minLen));
        block += randomMatrixLine(len) + '\n';
      }
    } else {
      for (let k = 0; k < lines; k++) {
        block += codeSnippets[Math.floor(Math.random() * codeSnippets.length)] + '\n';
      }
    }

    d.textContent = block;
    return d;
  }

  function buildColumns() {
    codeBg.innerHTML = '';
    const total = columnsForWidth();
    for (let i = 0; i < total; i++) codeBg.appendChild(makeColumn(i, total));
  }

  // Build initially and on resize
  buildColumns();
  window.addEventListener('resize', buildColumns);

  // ===== 2) Toggle password visibility (black eye) + Easter Egg =====
  const togglePassword = document.getElementById('togglePassword');
  const passwordField = document.getElementById('password');

  if (togglePassword && passwordField) {
    const OPEN_EYE =
      '<path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"/>';
    const CLOSED_EYE =
      '<path d="M2.1 3.51 3.5 2.1 21.9 20.5 20.5 21.9l-3.3-3.3c-1.55.86-3.37 1.4-5.2 1.4-5 0-9.27-3.11-11-7 .74-1.66 1.92-3.14 3.39-4.34L2.1 3.5Zm6.6 6.6 1.14 1.14a4 4 0 0 0 5.1 5.1l-1.14-1.14a 4 4 0 0 1-5.1-5.1Z"/>';

    let hidden = true;
    togglePassword.addEventListener('click', () => {
      // Normal toggle
      hidden = !hidden;
      passwordField.type = hidden ? 'password' : 'text';
      togglePassword.innerHTML = hidden ? OPEN_EYE : CLOSED_EYE;

      // --- Easter egg counting ---
      eyeClicks++;
      if (eyeClickTimer) clearTimeout(eyeClickTimer);
      // Reset streak if no rapid clicks in 3 seconds
      eyeClickTimer = setTimeout(() => eyeClicks = 0, 3000);

      if (eyeClicks >= 10) {
        // Toggle Matrix mode on every 10-click streak
        matrixMode = !matrixMode;
        eyeClicks = 0;

        // Add/remove body class for green theme
        document.body.classList.toggle('matrix', matrixMode);

        // Rebuild columns with new mode
        buildColumns();
      }
    });

    togglePassword.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePassword.click();
      }
    });
  }

// ===== 3) Easter Egg: Remember Me audio =====
const rememberBox = document.getElementById('remember');
let rememberClicks = 0;
let rememberTimer = null;

if (rememberBox) {
  rememberBox.addEventListener('click', () => {
    rememberClicks++;

    // reset if no rapid clicks in 3 seconds
    if (rememberTimer) clearTimeout(rememberTimer);
    rememberTimer = setTimeout(() => (rememberClicks = 0), 3000);

    if (rememberClicks >= 10) {
      rememberClicks = 0;

      // Play your sound from /audio folder
      const audio = new Audio('/audio/The Chain of Silence.mp3');
      audio.volume = 0.8;
      audio.play().catch(err => console.warn('Audio blocked:', err));
    }
  });
}
});
