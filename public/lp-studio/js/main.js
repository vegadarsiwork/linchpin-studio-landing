/* ═══════════ LINCHPIN STUDIO — interactions ═══════════ */
(function () {
  'use strict';

  /* ── Navbar scroll state ── */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ── */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.addEventListener('click', (e) => { if (e.target.tagName === 'A') navLinks.classList.remove('open'); });
  }

  /* ── Reveal / counters / timeline ──────────────────────────────
     Content is VISIBLE BY DEFAULT in CSS. We add `anim-on` to arm the
     hidden→animate entrance, then GUARANTEE each revealed element ends
     visible via a timer (timers fire even if compositing stalls) so the
     entrance can never leave content stuck invisible. Print / reduced-
     motion / no-anim short-circuit to fully visible. ───────────────── */
  const html = document.documentElement;
  const animOff = () => html.classList.contains('no-anim')
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const inView = (el, frac) => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.height === 0 && r.width === 0) return false; // hidden panels
    const need = Math.min(r.height * (frac || 0.12), vh * 0.4);
    return r.top < vh - need && r.bottom > need;
  };

  // Force an element to its final visible state, killing any frozen animation.
  function finalize(el) {
    el.style.setProperty('opacity', '1', 'important');
    el.style.setProperty('transform', 'none', 'important');
    el.style.setProperty('animation', 'none', 'important');
  }

  // Stagger delay per sibling group (animation-delay, used once armed)
  const revealEls = [...document.querySelectorAll('[data-reveal]')];
  const groups = new Map();
  revealEls.forEach((el) => {
    const key = el.parentElement;
    const i = groups.get(key) || 0;
    el.style.animationDelay = (i * 70) + 'ms';
    groups.set(key, i + 1);
  });
  const pending = revealEls.slice();
  function reveal(el) {
    el.classList.add('in');
    setTimeout(() => finalize(el), 760); // guarantee visible regardless of paint
  }
  function revealCheck() {
    for (let i = pending.length - 1; i >= 0; i--) {
      if (inView(pending[i], 0.12)) { reveal(pending[i]); pending.splice(i, 1); }
    }
  }

  /* counters */
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = '1';
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const dur = 1500; let start = null;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(easeOut(p) * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    setTimeout(() => { el.textContent = target + suffix; }, 1800); // safety
  }
  const counters = [...document.querySelectorAll('[data-count]')];
  function countCheck() {
    for (let i = counters.length - 1; i >= 0; i--) {
      if (inView(counters[i], 0.5)) { countUp(counters[i]); counters.splice(i, 1); }
    }
  }

  /* timeline */
  const tlLine = document.getElementById('tlLine');
  const timeline = document.getElementById('timeline');
  const tlNodes = timeline ? [...timeline.querySelectorAll('.tl-node')] : [];
  let tlDrawn = false;
  function lightNodes() { tlNodes.forEach((n) => n.classList.add('active')); }
  function drawTimeline() {
    if (tlDrawn || !tlLine || !timeline) return;
    if (!inView(timeline, 0.3)) return;
    tlDrawn = true;
    if (animOff()) { tlLine.style.strokeDashoffset = '0'; lightNodes(); return; }
    tlLine.style.transition = 'stroke-dashoffset 1200ms cubic-bezier(0.65,0,0.35,1)';
    requestAnimationFrame(() => { tlLine.style.strokeDashoffset = '0'; });
    tlNodes.forEach((n, i) => setTimeout(() => n.classList.add('active'), 200 + i * 200));
    setTimeout(() => { tlLine.style.strokeDashoffset = '0'; lightNodes(); }, 1600); // safety
  }

  function tick() { revealCheck(); countCheck(); drawTimeline(); }

  // Arm: visible-by-default content gets the entrance treatment.
  if (animOff()) {
    pending.forEach((el) => el.classList.add('in'));
    counters.forEach((el) => { el.dataset.done = '1'; el.textContent = parseInt(el.dataset.count, 10) + (el.dataset.suffix || ''); });
    counters.length = 0;
    if (tlLine) tlLine.style.strokeDashoffset = '0';
    lightNodes();
  } else {
    html.classList.add('anim-on');
    if (tlLine) { tlLine.style.strokeDasharray = '1000'; tlLine.style.strokeDashoffset = '1000'; }
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick, { passive: true });
    tick();
    [120, 400, 900].forEach((d) => setTimeout(tick, d));
  }

  /* ── Pricing track toggle ── */
  const toggle = document.getElementById('priceToggle');
  if (toggle) {
    toggle.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      toggle.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const track = btn.dataset.track;
      document.querySelectorAll('.track-panel').forEach((p) => p.classList.remove('active'));
      document.getElementById('panel-' + track).classList.add('active');
      // re-render lucide icons that may have been display:none
      if (window.lucide) window.lucide.createIcons();
      // reveal + lock the newly shown panel's content
      document.querySelectorAll('#panel-' + track + ' [data-reveal]').forEach((el) => {
        el.classList.add('in');
        el.style.setProperty('opacity', '1', 'important');
        el.style.setProperty('transform', 'none', 'important');
        el.style.setProperty('animation', 'none', 'important');
      });
    });
  }

  /* ── Render Lucide icons ── */
  function renderIcons() { if (window.lucide && window.lucide.createIcons) window.lucide.createIcons(); }
  renderIcons();
  // run again shortly after in case slot/web-components settle
  setTimeout(renderIcons, 300);
})();
