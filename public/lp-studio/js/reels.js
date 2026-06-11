/* Reel showcase — 9:16 cards with autoplaying muted video previews,
   click-to-expand player (mute/unmute), Instagram link-outs, image slots. */
(function () {
  const CL = 'https://res.cloudinary.com/drf5dacrb/video/upload';
  // light preview transform (small + auto quality) keeps the grid fast
  const prev = (id) => `${CL}/q_auto,w_540/${id}.mp4`;
  const full = (id) => `${CL}/q_auto/${id}.mp4`;
  const post = (id) => `${CL}/so_0,q_auto,w_540/${id}.jpg`;

  const reels = [
    { id: 'reel-1', brand: 'GV Interiors',     cat: 'Interior showcase reel', tier: 'gold',     dur: '0:28', tags: ['influencer', 'gold'],     cid: 'v1780742629/0606_becg5v' },
    { id: 'reel-2', brand: 'Be You Perfumes',  cat: 'Product launch reel', tier: 'silver',   dur: '0:32', tags: ['brand', 'silver'],        cid: 'v1780743847/IMG_0159_bgvfvc' },
    { id: 'reel-3', brand: 'Butta Bomma Makeup Academy', cat: 'Makeup tutorial reel', tier: 'platinum', dur: '0:24', tags: ['influencer', 'platinum'], cid: 'v1780743796/0606_4_ioxttd' },
    { id: 'reel-4', brand: 'Pernati Culture',  cat: 'Brand story reel',    tier: 'silver',   dur: '0:19', tags: ['brand', 'silver'],        cid: 'v1780743565/0606_2_z3a4hq' },
    { id: 'reel-5', brand: 'Maharsh Edutech',  cat: 'Explainer reel',      tier: 'gold',     dur: '0:30', tags: ['influencer', 'gold'],     cid: 'v1780744346/SRM-1_3_ay013k' },
    { id: 'reel-6', brand: 'Linchpin Soft Solution', cat: 'Brand film',    tier: 'platinum', dur: '0:26', tags: ['influencer', 'platinum'], cid: 'v1780744523/SnapInsta.to_AQOBgukk4pVhGadm70Gk9CKlGV7RNqWlykiYS9kG0ibbeiaWpG2KUsxocpDRwb8FGGqvR6TZgm3XEpmG0j4ZX47YGIkj9vzFS2zvtpI_ss87vq' },
    { id: 'reel-7', brand: 'Maharsh Edutech',  cat: 'Course promo reel',   tier: 'silver',   dur: '0:22', tags: ['brand', 'silver'],        cid: 'v1780744659/Reel-_13_mywojj' },
    { id: 'reel-8', brand: 'Be You Perfumes',  cat: 'Cinematic reel',      tier: 'gold',     dur: '0:41', tags: ['influencer', 'gold'],     cid: 'v1780744833/Reel-_18_2_eepksb' },
  ];

  const grid = document.getElementById('reelsGrid');
  if (!grid) return;

  // Lucide dropped the brand "instagram" glyph — use an inline SVG instead.
  const IG = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>';

  grid.innerHTML = reels.map((r) => {
    const tierLabel = r.tier.charAt(0).toUpperCase() + r.tier.slice(1);
    let media, attrs = '';
    if (r.cid) {
      // Autoplaying muted preview; click expands to player with sound option.
      media = `<video class="reel-vid" muted loop playsinline preload="metadata" poster="${post(r.cid)}" data-src="${prev(r.cid)}"></video>`;
      attrs = ` data-video="${full(r.cid)}" data-title="${r.brand}" role="button" tabindex="0" aria-label="Play ${r.brand} reel"`;
    } else if (r.instagram) {
      media = `<div class="reel-fallback"></div><div class="reel-ig">${IG}</div>`;
      attrs = ` data-ig="${r.instagram}" data-title="${r.brand}" role="button" tabindex="0" aria-label="Watch ${r.brand} reel on Instagram"`;
    } else {
      media = `<image-slot id="${r.id}" shape="rounded" radius="20" placeholder="Drop a reel still"></image-slot>`;
    }
    const cls = r.cid ? ' has-video' : (r.instagram ? ' has-ig' : '');
    const tag = r.instagram
      ? `<span class="dur-badge ig-badge">${IG}Reel</span>`
      : `<span class="dur-badge">${r.dur}</span>`;
    const playInner = r.instagram ? IG : '<i class="ico" data-lucide="play"></i>';
    return `
    <article class="reel${cls}" data-reveal data-tags="${r.tags.join(' ')}"${attrs}>
      <div class="reel-fallback"></div>
      ${media}
      <div class="reel-top">
        <span class="tier-badge ${r.tier}">${tierLabel}</span>
        ${tag}
      </div>
      <div class="reel-play"><span>${playInner}</span></div>
      <div class="reel-overlay">
        <div class="reel-brand">${r.brand}</div>
        <div class="reel-cat">${r.cat}</div>
      </div>
    </article>`;
  }).join('');

  /* ── Lazy autoplay: only play previews that are on screen ── */
  const vids = [...grid.querySelectorAll('.reel-vid')];
  const onScreen = (el) => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    return r.bottom > 0 && r.top < vh;
  };
  function manageAutoplay() {
    vids.forEach((v) => {
      const visible = v.offsetParent !== null && onScreen(v);
      if (visible) {
        if (!v.src) v.src = v.dataset.src;       // load on first reveal
        if (v.paused) v.play().catch(() => {});
      } else if (!v.paused) {
        v.pause();
      }
    });
  }
  window.addEventListener('scroll', manageAutoplay, { passive: true });
  window.addEventListener('resize', manageAutoplay, { passive: true });
  manageAutoplay();
  [300, 800, 1500].forEach((d) => setTimeout(manageAutoplay, d));

  /* ── Filtering ── */
  const filterRow = document.getElementById('filterRow');
  filterRow.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    filterRow.querySelectorAll('.filter-pill').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    grid.querySelectorAll('.reel').forEach((card) => {
      const show = f === 'all' || card.dataset.tags.split(' ').includes(f);
      card.style.display = show ? '' : 'none';
    });
    manageAutoplay();
  });

  /* ── Video lightbox (autoplay muted + mute/unmute toggle) ── */
  const modal = document.createElement('div');
  modal.className = 'reel-modal';
  modal.innerHTML = `
    <div class="reel-modal-backdrop"></div>
    <div class="reel-modal-body">
      <button class="reel-modal-close" aria-label="Close"><i class="ico" data-lucide="x"></i></button>
      <div class="reel-stack" aria-live="polite">
        <button class="reel-nav reel-nav-prev" aria-label="Previous reel"><i class="ico" data-lucide="chevron-left"></i></button>
        <div class="reel-stack-ghost reel-stack-ghost--left"></div>
        <div class="reel-stack-ghost reel-stack-ghost--right"></div>
        <div class="reel-modal-frame">
          <video class="reel-modal-video" loop playsinline preload="metadata"></video>
          <button class="reel-mute" aria-label="Unmute"><i class="ico" data-lucide="volume-x"></i><span>Tap to unmute</span></button>
        </div>
        <button class="reel-nav reel-nav-next" aria-label="Next reel"><i class="ico" data-lucide="chevron-right"></i></button>
      </div>
      <div class="reel-modal-meta">
        <div class="reel-modal-title"></div>
        <div class="reel-modal-count"></div>
      </div>
    </div>`;
  document.body.appendChild(modal);
  const video = modal.querySelector('.reel-modal-video');
  const titleEl = modal.querySelector('.reel-modal-title');
  const countEl = modal.querySelector('.reel-modal-count');
  const muteBtn = modal.querySelector('.reel-mute');
  const prevBtn = modal.querySelector('.reel-nav-prev');
  const nextBtn = modal.querySelector('.reel-nav-next');
  const leftGhost = modal.querySelector('.reel-stack-ghost--left');
  const rightGhost = modal.querySelector('.reel-stack-ghost--right');
  let activeCards = [];
  let activeIndex = 0;

  function renderMute() {
    const off = video.muted;
    muteBtn.classList.toggle('muted', off);
    muteBtn.setAttribute('aria-label', off ? 'Unmute' : 'Mute');
    muteBtn.innerHTML = off
      ? '<i class="ico" data-lucide="volume-x"></i><span>Tap to unmute</span>'
      : '<i class="ico" data-lucide="volume-2"></i><span>Mute</span>';
    if (window.lucide) window.lucide.createIcons();
  }

  function cardPoster(card) {
    return card.querySelector('.reel-vid')?.poster || '';
  }

  function visibleCards() {
    return [...grid.querySelectorAll('.reel[data-video]')].filter((card) => card.offsetParent !== null);
  }

  function syncGhosts() {
    if (!activeCards.length) return;
    const prev = activeCards[(activeIndex - 1 + activeCards.length) % activeCards.length];
    const next = activeCards[(activeIndex + 1) % activeCards.length];
    leftGhost.style.backgroundImage = `url("${cardPoster(prev)}")`;
    rightGhost.style.backgroundImage = `url("${cardPoster(next)}")`;
  }

  function loadCard(card, direction = 'next') {
    if (!card) return;
    video.classList.remove('slide-next', 'slide-prev');
    void video.offsetWidth;
    video.classList.add(direction === 'prev' ? 'slide-prev' : 'slide-next');

    video.src = card.dataset.video;
    const poster = cardPoster(card);
    if (poster) video.poster = poster;
    titleEl.textContent = card.dataset.title || '';
    countEl.textContent = `${activeIndex + 1} / ${activeCards.length}`;
    video.muted = true;                 // muted so autoplay is allowed (no music)
    renderMute();
    syncGhosts();
    video.play().catch(() => {});
  }

  function openModal(card) {
    activeCards = visibleCards();
    activeIndex = Math.max(0, activeCards.indexOf(card));
    loadCard(activeCards[activeIndex]);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function go(delta) {
    if (!activeCards.length) return;
    activeIndex = (activeIndex + delta + activeCards.length) % activeCards.length;
    loadCard(activeCards[activeIndex], delta < 0 ? 'prev' : 'next');
  }

  function closeModal() {
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    try {
      video.pause();
      video.muted = true;
      video.currentTime = 0;
      video.removeAttribute('src');
      while (video.firstChild) video.removeChild(video.firstChild);
      video.load();
      activeCards = [];
      activeIndex = 0;
    } catch (err) { /* no-op */ }
  }

  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    if (!video.muted) video.play().catch(() => {});
    renderMute();
  });

  function activate(card) {
    if (card.dataset.ig) { window.open(card.dataset.ig, '_blank', 'noopener'); return; }
    if (card.dataset.video) openModal(card);
  }
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.reel[data-video], .reel[data-ig]');
    if (card) activate(card);
  });
  grid.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.reel[data-video], .reel[data-ig]');
    if (!card) return;
    e.preventDefault();
    activate(card);
  });
  modal.addEventListener('click', (e) => {
    if (!e.target.closest('.reel-modal-frame') && !e.target.closest('.reel-modal-close')) closeModal();
  });
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); go(-1); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); go(1); });
  modal.querySelector('.reel-modal-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  });
})();
