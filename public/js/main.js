// custom cursor: dot + trailing context label
const dot = document.getElementById('cur-dot');
const curLabel = document.getElementById('cur-label');
window.addEventListener('mousemove', e => {
  dot.style.left = e.clientX + 'px';
  dot.style.top = e.clientY + 'px';
  curLabel.style.left = e.clientX + 'px';
  curLabel.style.top = e.clientY + 'px';
});
document.querySelectorAll('[data-cursor]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    curLabel.textContent = el.dataset.cursor;
    curLabel.classList.add('show');
  });
  el.addEventListener('mouseleave', () => curLabel.classList.remove('show'));
});

// mode toggle
const toggle = document.getElementById('mode-toggle');
const label = toggle.querySelector('.mode-label');
toggle.addEventListener('click', () => {
  const clean = document.body.classList.toggle('clean');
  document.body.classList.toggle('terminal', !clean);
  label.textContent = clean ? 'CLEAN' : 'TERMINAL';
  const boot = document.getElementById('boot');
  if (clean && boot) {
    boot.style.display = 'none';
    document.querySelectorAll('.hide-until-boot').forEach(el => el.style.opacity = 1);
  }
});

// boot sequence (homepage only)
const bootEl = document.getElementById('boot-text');
if (bootEl) {
  const hr = new Date().getHours();
  const greeting = hr < 5 ? 'late night' : hr < 12 ? 'morning' : hr < 17 ? 'afternoon' : hr < 21 ? 'evening' : 'night';
  const lines = [`> good ${greeting}, visitor`, '> initializing display...', '> loading assets... OK', '> establishing identity...'];
  let i = 0;
  (function typeLine() {
    if (document.body.classList.contains('clean')) return;
    if (i < lines.length) {
      bootEl.textContent += lines[i] + '\n';
      i++;
      setTimeout(typeLine, 260);
    } else {
      document.getElementById('boot').style.display = 'none';
      document.querySelectorAll('.hide-until-boot').forEach(el => el.style.opacity = 1);
    }
  })();
}

// typed one-line description on project row hover
document.querySelectorAll('.proj-row').forEach(row => {
  const target = row.querySelector('.desc-reveal');
  const text = '> ' + row.dataset.desc;
  let timer;
  row.addEventListener('mouseenter', () => {
    let i = 0;
    clearInterval(timer);
    target.textContent = '';
    timer = setInterval(() => {
      target.textContent += text[i] || '';
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 18);
  });
  row.addEventListener('mouseleave', () => {
    clearInterval(timer);
    target.textContent = '';
  });
});

// staggered scroll reveal
const revealEls = document.querySelectorAll('.section-head, .proj-row, .case-block, .sub, .about p, .gallery-card');
revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = (i % 6) * 0.06 + 's';
});
const obs = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('in'); });
}, { threshold: 0.15 });
revealEls.forEach(el => obs.observe(el));

// parallax on hero glow + scanlines + data stream
const heroEl = document.querySelector('.hero');
const streamInner = document.getElementById('datastream-inner');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroEl) heroEl.style.setProperty('--py', (y * 0.25) + 'px');
  document.getElementById('scanlines').style.transform = `translateY(${y * 0.08}px)`;
  if (streamInner) streamInner.style.transform = `translateY(${-y * 0.4}px)`;
});

// data stream content (generated once)
if (streamInner) {
  const chars = '01ABCDEF';
  let out = '';
  for (let i = 0; i < 240; i++) out += chars[Math.floor(Math.random() * chars.length)] + (i % 2 ? '\n' : '');
  streamInner.textContent = out;
  streamInner.style.height = '250vh';
}

// particle field in hero
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const mouse = { x: -999, y: -999 };
  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  canvas.parentElement.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  for (let i = 0; i < 60; i++) {
    particles.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3 });
  }
  function tick() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) { p.x += dx / dist * 0.6; p.y += dy / dist * 0.6; }
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(201,196,184,0.35)';
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  tick();
}

// stats panel uptime
const upEl = document.getElementById('uptime');
if (upEl) {
  const start = Date.now();
  setInterval(() => {
    const s = Math.floor((Date.now() - start) / 1000);
    const hh = String(Math.floor(s / 3600)).padStart(2, '0');
    const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    upEl.textContent = `UPTIME: ${hh}:${mm}:${ss}`;
  }, 1000);
}

// section counter
const sections = document.querySelectorAll('section');
const counterEl = document.getElementById('sec-counter');
if (counterEl && sections.length) {
  counterEl.textContent = `01 / ${String(sections.length).padStart(2, '0')}`;
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const idx = Array.from(sections).indexOf(en.target) + 1;
        counterEl.textContent = `${String(idx).padStart(2, '0')} / ${String(sections.length).padStart(2, '0')}`;
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(s => secObs.observe(s));
}

// command palette
const cmdk = document.getElementById('cmdk');
const cmdkInput = document.getElementById('cmdk-input');
const cmdkResults = document.getElementById('cmdk-results');
const commands = [
  { label: 'Home', url: '/' },
  { label: 'Work — all projects', url: '/work' },
  { label: 'About', url: '/#about' },
  { label: 'Contact', url: '/#contact' },
  { label: 'Poster series', url: '/project/poster-series' },
  { label: 'FeedForward', url: '/project/feedforward' },
  { label: 'App redesign case study', url: '/project/uiux-redesign' },
  { label: 'Dashboard & insights', url: '/project/data-dashboard' },
];
function renderCmdk(filter) {
  const f = filter.toLowerCase();
  cmdkResults.innerHTML = '';
  commands.filter(c => c.label.toLowerCase().includes(f)).forEach((c, i) => {
    const el = document.createElement('div');
    el.className = 'cmdk-item' + (i === 0 ? ' active' : '');
    el.textContent = c.label;
    el.addEventListener('click', () => window.location.href = c.url);
    cmdkResults.appendChild(el);
  });
}
function openCmdk() {
  cmdk.classList.remove('hidden');
  cmdkInput.value = '';
  renderCmdk('');
  setTimeout(() => cmdkInput.focus(), 10);
}
function closeCmdk() { cmdk.classList.add('hidden'); }
if (cmdk) {
  window.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openCmdk(); }
    else if (e.key === 'Escape') closeCmdk();
  });
  cmdkInput.addEventListener('input', () => renderCmdk(cmdkInput.value));
  cmdkInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const active = cmdkResults.querySelector('.cmdk-item');
      if (active) active.click();
    }
  });
  cmdk.addEventListener('click', e => { if (e.target === cmdk) closeCmdk(); });
}

// button ripple on click
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const r = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = (e.clientX - r.left - 8) + 'px';
    ripple.style.top = (e.clientY - r.top - 8) + 'px';
    ripple.style.width = ripple.style.height = '16px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});
