document.addEventListener('DOMContentLoaded', () => {
    const aiChatBtn = document.getElementById('aiChatBtn');
    if (aiChatBtn) {
    aiChatBtn.addEventListener('click', () => {
      window.location.href = '/chat'; // redirect instead of new window
    });
  }



  const codeBg = document.getElementById('codeBg');
  if (!codeBg) return; // now valid inside function

  const codeSnippets = [
    'for(let i=0;i<items.length;i++){}',
    'SELECT * FROM users WHERE id = ?;',
    'const hash = await bcrypt.hash(pw, 12);',
    'curl -X POST /api/login -H "Content-Type: application/json"',
    'npm run build && npm start',
    'git commit -m "feat: auth"'
  ];

  const MATRIX_CHARS = 'ｱｶｻﾀﾅﾊﾏﾔﾗﾜﾝｳｵﾑｼﾂﾈﾎﾕﾒﾘ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const matrixMode = true; // true = random glyphs, false = code snippets

  function columnsForWidth() {
    const w = window.innerWidth;
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

    const laneW = codeBg.clientWidth / total;
    const x = Math.round(i * laneW + laneW / 2 - 10);
    d.style.left = x + 'px';

    const baseFont = (window.innerWidth <= 480) ? 11 : 12;
    d.style.fontSize = (baseFont + Math.random() * 3) + 'px';

    const baseSpeed = (window.innerWidth <= 480) ? 24 : 20;
    const speed = baseSpeed + Math.random() * 18;
    d.style.setProperty('--speed', `${speed}s`);
    d.style.setProperty('--delay', `${-Math.random() * speed}s`);
    d.style.setProperty('--colOpacity', 0.5 + Math.random() * 0.5);

    let block = '';
    const lines = (window.innerHeight <= 700) ? 120 : 160;

    if (matrixMode) {
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

  buildColumns();
  window.addEventListener('resize', buildColumns);

  // open chatroom
 const chatroomCards = document.querySelectorAll('.chatroom-card');

  chatroomCards.forEach(card => {
    card.addEventListener('click', () => {
      const chatroomId = card.getAttribute('data-id');
      if (chatroomId) {
        // Redirect to the chatroom page
        window.location.href = `/chatroom/${chatroomId}`;
      }
    });
  });



});


