import Script from "next/script";
import ChatWidget from "@/components/chat/ChatWidget";

/* ───────────── small shared helpers ───────────── */
function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="check">
      <i className="ico" data-lucide="check"></i>
      {children}
    </li>
  );
}

/* ───────────── data (repeated sections) ───────────── */
const STATS = [
  { count: "100", suffix: "+", label: "Reels delivered" },
  { count: "50", suffix: "+", label: "Brands served" },
  { count: "20", suffix: "+", label: "Influencers" },
  { count: "4", suffix: "", label: "Reel packages" },
  { static: "2026", label: "Reel brochure" },
] as const;

const FILTERS = [
  { f: "all", label: "All", active: true },
  { f: "influencer", label: "With influencer" },
  { f: "brand", label: "Brand-led" },
  { f: "silver", label: "Silver" },
  { f: "gold", label: "Gold" },
  { f: "platinum", label: "Platinum" },
];

const TIMELINE = [
  { icon: "search", step: "01", title: "Brief & discovery", desc: "Understanding your brand, goals, and audience." },
  { icon: "pen-line", step: "02", title: "Script & strategy", desc: "Professional scripting with content-strategy depth." },
  { icon: "clapperboard", step: "03", title: "Shoot day", desc: "Influencer on-camera, single or multi-location." },
  { icon: "scissors", step: "04", title: "Edit & post", desc: "Cinematic cuts, captions, music, and colour." },
  { icon: "send", step: "05", title: "Deliver & revise", desc: "2 free revisions, 7–10 working day turnaround." },
];


const DELIVERABLES = [
  {
    num: "3",
    unit: "reels package",
    title: "Lean launch",
    feats: [
      "1 Influencer included",
      "1 Shoot day",
      "2 Revisions per reel",
      "Full editing & post-production",
      "Minimum package for premium influencers",
    ],
  },
  {
    num: "5",
    unit: "reels package",
    title: "Steady cadence",
    feats: [
      "1 Influencer included",
      "1–2 Shoot days (max)",
      "2 Revisions per reel",
      "Full editing & post-production",
      "Professional scripting",
    ],
  },
  {
    num: "10",
    unit: "reels package",
    title: "Content engine",
    feats: [
      "2 Influencers included",
      "Up to 3 shoot days (max)",
      "2 Revisions per reel",
      "Full editing & post-production",
      "Professional scripting",
    ],
  },
  {
    num: "∞",
    unit: "custom bulk",
    title: "Built to scale",
    feats: [
      "Custom influencer allocation",
      "Flexible shoot schedule",
      "2 Revisions per reel",
      "Bulk package discussion",
      "Dedicated project manager",
    ],
  },
];

const POLICIES = [
  { num: "01", title: "Minimum reel order", desc: "Minimum 3 reels — no singles. Contact us for a custom quote." },
  { num: "02", title: "Influencer allocation", desc: "≤5 reels: 1 influencer. 10 reels: 2. Additional influencers available on request." },
  { num: "03", title: "Premium influencers", desc: "Minimum 3-reel commitment required for premium talent." },
  { num: "04", title: "Revision policy", desc: "2 free revisions per reel. Additional revisions available on request." },
  { num: "05", title: "Shoot day limits", desc: "5-reel: max 1–2 days. 10-reel: max 3 days. Additional days arranged as needed." },
  { num: "06", title: "Raw footage", desc: "Available on request. Delivered after full payment is received." },
  { num: "07", title: "Influencer selection", desc: "Allocation based on profile, reach, and brand fit. Speak to us to discuss options." },
  { num: "08", title: "Custom bulk", desc: "10+ reels: case-by-case. Includes a dedicated project manager." },
];


export default function Page() {
  return (
    <>
      {/* ═══════════════ NAVBAR ═══════════════ */}
      <nav className="nav" id="nav">
        <div className="container">
          <a href="#hero" aria-label="Linchpin Studio home">
            <img className="nav-logo" src="/lp-studio/assets/linchpin-studio-wordmark.svg" alt="Linchpin Studio" />
          </a>
          <div className="nav-links" id="navLinks">
            <a href="#showcase">Work</a>
            <a href="#process">Process</a>
            <a href="#tracks">Services</a>
            <a href="#deliverables">Packages</a>
            <a href="#contact">Contact</a>
            <a href="https://app.linchpinstudios.in" className="nav-cta-m">Go to Dashboard</a>
            <a href="#contact" className="nav-cta-m">Start a project</a>
          </div>
          <div className="nav-right">
            <a href="https://app.linchpinstudios.in" className="btn btn-ghost nav-cta-d" style={{ padding: "12px 22px" }}>Go to Dashboard</a>
            <a href="#contact" className="btn btn-primary nav-cta-d" style={{ padding: "12px 22px" }}>Start a project</a>
            <button className="nav-toggle" id="navToggle" aria-label="Menu"><i className="ico" data-lucide="menu"></i></button>
          </div>
        </div>
      </nav>

      {/* ═══════════════ S01 — HERO ═══════════════ */}
      <header className="hero section" id="hero" data-screen-label="Hero">
        <div className="orb orb--violet"></div>
        <div className="orb orb--lav"></div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="t-eyebrow" data-reveal>Linchpin Studio presents</span>
            <h1 data-reveal>
              <span className="line"><span>High-quality influencer reels</span></span>
              <span className="line"><span>built to grow your brand.</span></span>
            </h1>
            <p className="hero-sub" data-reveal>We shoot, script, edit, and strategize premium influencer-led content for every social platform — built to grow your brand online, drive sales, and capture qualified leads.</p>
            <div className="hero-cta" data-reveal>
              <a href="#contact" className="btn btn-primary btn-lg">Get started today <i className="ico" data-lucide="arrow-right"></i></a>
              <a href="#tracks" className="btn btn-ghost btn-lg">See what we offer</a>
            </div>
          </div>
          <div className="hero-chips" data-reveal>
            <div className="chip">
              <div className="chip-num">3 production tiers</div>
              <div className="chip-label">Silver, Gold &amp; Platinum</div>
            </div>
            <div className="chip">
              <div className="chip-num">4 package sizes</div>
              <div className="chip-label">3, 5, 10 &amp; custom</div>
            </div>
            <div className="chip">
              <div className="chip-num">100% full service</div>
              <div className="chip-label">Script · Shoot · Edit · Strategy</div>
            </div>
          </div>
        </div>
        <div className="scroll-ind"><div className="line"></div><span>Scroll</span></div>
      </header>

      {/* ═══════════════ S02 — TRUST STATS ═══════════════ */}
      <section className="stats-bar section--alt" aria-label="By the numbers">
        <div className="container">
          <div className="stats-row">
            {STATS.map((s, i) => (
              <div className="stat" key={i}>
                <div className="stat-num">
                  {"static" in s ? (
                    <span className="t-grad">{s.static}</span>
                  ) : (
                    <span className="t-grad" data-count={s.count} data-suffix={s.suffix || undefined}>0</span>
                  )}
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ S03 — REELS SHOWCASE ═══════════════ */}
      <section className="section" id="showcase" data-screen-label="Showcase">
        <div className="container wide">
          <div className="section-head" data-reveal>
            <span className="t-eyebrow">Our work</span>
            <h2 className="section-title">Reels that convert.</h2>
            <p className="section-sub">A neatly curated wall of influencer-led and brand-led reels. Drop your own stills into any frame to preview the layout with real work.</p>
          </div>

          <div className="filter-row" data-reveal id="filterRow">
            {FILTERS.map((f) => (
              <button className={`filter-pill${f.active ? " active" : ""}`} data-filter={f.f} key={f.f}>{f.label}</button>
            ))}
          </div>

          {/* cards injected by /lp-studio/js/reels.js for clean repetition */}
          <div className="reels-grid" id="reelsGrid"></div>

          <div className="showcase-cta" data-reveal>
            <p>Want reels like these for your brand?</p>
            <a href="#contact" className="btn btn-primary btn-lg">Get your custom quote <i className="ico" data-lucide="arrow-right"></i></a>
          </div>
        </div>
      </section>

      {/* ═══════════════ S04 — PROCESS ═══════════════ */}
      <section className="section section--alt" id="process" data-screen-label="Process">
        <div className="container">
          <div className="section-head center" data-reveal>
            <span className="t-eyebrow">How it works</span>
            <h2 className="section-title">From brief to viral — our process.</h2>
          </div>
          <div className="timeline" data-reveal id="timeline">
            <div className="timeline-track">
              <svg className="timeline-svg" preserveAspectRatio="none" viewBox="0 0 1000 6">
                <defs>
                  <filter id="tlglow" x="-20%" y="-400%" width="140%" height="900%">
                    <feGaussianBlur stdDeviation="3" result="b"></feGaussianBlur>
                    <feMerge><feMergeNode in="b"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge>
                  </filter>
                </defs>
                <line x1="0" y1="3" x2="1000" y2="3" stroke="rgba(255,255,255,0.08)" strokeWidth="2"></line>
                <line id="tlLine" x1="0" y1="3" x2="1000" y2="3" stroke="#7c3cff" strokeWidth="3" filter="url(#tlglow)" strokeLinecap="round"></line>
              </svg>
              <div className="timeline-nodes">
                {TIMELINE.map((t) => (
                  <div className="tl-node" key={t.step}>
                    <div className="tl-dot"><i className="ico" data-lucide={t.icon}></i></div>
                    <div className="tl-step">{t.step}</div>
                    <div className="tl-title">{t.title}</div>
                    <div className="tl-desc">{t.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ S05 — TWO TRACKS ═══════════════ */}
      <section className="section" id="tracks" data-screen-label="Two tracks">
        <div className="container">
          <div className="section-head center" data-reveal>
            <span className="t-eyebrow">What we offer</span>
            <h2 className="section-title">Two powerful content tracks.</h2>
          </div>
          <div className="tracks">
            <article className="card hoverable track track--inf" data-reveal>
              <div className="track-ico"><i className="ico" data-lucide="users"></i></div>
              <h3>Reels featuring influencer talent</h3>
              <p className="track-sub">Premium on-camera faces, full production, scripted &amp; strategized.</p>
              <ul>
                <Check>Standard / Premium / Top-tier influencer options</Check>
                <Check>Professional scripting</Check>
                <Check>Multi-angle shoots</Check>
                <Check>Full content strategy</Check>
                <Check>3 / 5 / 10 reel packages</Check>
              </ul>
            </article>
            <article className="card hoverable track track--solo" data-reveal>
              <div className="track-ico"><i className="ico" data-lucide="megaphone"></i></div>
              <h3>Solo / brand-led reels</h3>
              <p className="track-sub">Founder-fronted, product-focused — no third-party talent.</p>
              <ul>
                <Check>Standard / Premium production options</Check>
                <Check>Core to in-depth scripting</Check>
                <Check>Single or multi-location shoots</Check>
                <Check>Brand-aligned content strategy</Check>
                <Check>3 / 5 / 10 reel packages</Check>
              </ul>
            </article>
          </div>
          <div className="callout" data-reveal>
            <i className="ico" data-lucide="shuffle"></i>
            <p><strong>Want more flexibility?</strong> Track 1 and Track 2 can be mixed inside a custom bulk package. Speak to our project coordinator about hybrid campaign builds.</p>
          </div>
        </div>
      </section>

      {/* ═══════════════ S09 — DELIVERABLES ═══════════════ */}
      <section className="section section--alt" id="deliverables" data-screen-label="Deliverables">
        <div className="container wide">
          <div className="section-head center" data-reveal>
            <span className="t-eyebrow">What&apos;s included</span>
            <h2 className="section-title">Everything that&apos;s included.</h2>
            <p className="section-sub">Every package — regardless of tier — comes with the deliverables below.</p>
          </div>
          <div className="deliv-grid">
            {DELIVERABLES.map((d) => (
              <article className="card hoverable deliv" data-reveal key={d.title}>
                <div className="deliv-head"><span className="deliv-num">{d.num}</span><span className="deliv-unit">{d.unit}</span></div>
                <h4>{d.title}</h4>
                <ul>
                  {d.feats.map((f) => <Check key={f}>{f}</Check>)}
                </ul>
              </article>
            ))}
          </div>
          <p className="deliv-note" data-reveal><strong>Higher tiers</strong> unlock advanced scripting, cinematic edits, multi-angle shoots, and full content-strategy support — speak to us to find the right fit for your brand.</p>
        </div>
      </section>

      {/* ═══════════════ S10 — POLICIES ═══════════════ */}
      <section className="section" id="policies" data-screen-label="Policies">
        <div className="container wide">
          <div className="section-head center" data-reveal>
            <span className="t-eyebrow">Policies</span>
            <h2 className="section-title">Clear rules. No surprises.</h2>
            <p className="section-sub">The fine print — clear, upfront, and built to protect both sides.</p>
          </div>
          <div className="policy-grid">
            {POLICIES.map((p) => (
              <article className="card hoverable policy" data-reveal key={p.num}>
                <div className="policy-num">{p.num}</div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════ S11 — CONTACT + FOOTER ═══════════════ */}
      <section className="section contact" id="contact" data-screen-label="Contact">
        <div className="orb orb--violet"></div>
        <div className="orb orb--lav"></div>
        <div className="container contact-inner">
          <span className="t-eyebrow" data-reveal style={{ justifyContent: "center" }}>Let&apos;s work together</span>
          <h2 data-reveal>Ready to make your brand unforgettable?</h2>
          <p className="contact-sub" data-reveal>Every great brand starts with a conversation. Let&apos;s discuss how Linchpin Studio can transform your digital presence.</p>
          <div data-reveal><a href="#contact" className="btn btn-primary btn-lg">Get started today <i className="ico" data-lucide="arrow-right"></i></a></div>
          <div className="contact-row" data-reveal>
            <a href="tel:+917416393958" className="contact-item"><i className="ico" data-lucide="phone"></i>+91 7416 393 958</a>
            <a href="mailto:info@linchpinsoftsolution.com" className="contact-item"><i className="ico" data-lucide="mail"></i>info@linchpinsoftsolution.com</a>
            <span className="contact-item"><i className="ico" data-lucide="map-pin"></i>AltF Begumpet, Hyderabad</span>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <img src="/lp-studio/assets/linchpin-studio-wordmark.svg" alt="Linchpin Studio" />
              <p>Steadfast in all your ways</p>
            </div>
            <nav className="footer-links">
              <a href="#tracks">Services</a>
              <a href="#deliverables">Packages</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
          <div className="footer-bottom">© 2026 Linchpin Studio — by Linchpin Soft Solutions Pvt. Ltd. · All rights reserved · Steadfast in all your ways</div>
        </div>
      </footer>

      {/* ═══════════════ FLOATING CHAT ═══════════════ */}
      <ChatWidget />

      {/* ═══════════════ SCRIPTS ═══════════════ */}
      <Script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js" strategy="afterInteractive" />
      <Script src="/lp-studio/js/reels.js" strategy="afterInteractive" />
      <Script src="/lp-studio/js/main.js" strategy="afterInteractive" />
    </>
  );
}
