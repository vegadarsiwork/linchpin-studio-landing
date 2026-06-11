"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

gsap.registerPlugin(ScrollTrigger);

const WORK = [
  {
    title: "Glow Republic",
    type: "Paid social launch",
    metric: "+38.4% CTR",
    outcome: "Offer-led ad cuts tested across three hooks and two creator angles.",
    image: "/images/work-glow-republic.png",
  },
  {
    title: "PureNest",
    type: "Founder film",
    metric: "2.1m reach",
    outcome: "A founder narrative rebuilt into launch film, reel cuts, and sales page clips.",
    image: "/images/work-purenest.png",
  },
  {
    title: "UrbanFit",
    type: "Reel system",
    metric: "412k views",
    outcome: "A repeatable short-form format with faster openers and a clearer workout payoff.",
    image: "/images/work-urbanfit.png",
  },
  {
    title: "Saffron Bites",
    type: "Menu campaign",
    metric: "31 videos",
    outcome: "A month of menu-led edits built around texture, pace, and location-specific CTAs.",
    image: "/images/work-saffron-bites.png",
  },
];

export default function Work() {
  const containerRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const activeCase = WORK[active];

  useGSAP(
    () => {
      gsap.from(".work-reveal", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: containerRef.current, start: "top 78%" },
      });

      gsap.utils.toArray<HTMLElement>(".work-case").forEach((caseEl, index) => {
        ScrollTrigger.create({
          trigger: caseEl,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: () => setActive(index),
          onEnterBack: () => setActive(index),
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} id="work" className="bg-[#101617] px-5 py-28 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.38fr_0.62fr]">
        <aside className="work-reveal lg:sticky lg:top-28 lg:h-fit">
          <span className="section-label">Recent work</span>
          <h2 className="font-display max-w-xl text-4xl font-black leading-none tracking-tight text-[#f7f3e8] md:text-6xl">
            Case studies you can read at your pace.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/48">
            Each campaign pairs a clear creative job with platform-ready edits,
            reviewable assets, and measurable output.
          </p>

          <div className="mt-10 border-y border-white/10 py-6">
            <span className="font-mono text-xs text-white/30">0{active + 1} / 04</span>
            <h3 className="mt-4 font-display text-3xl font-black text-[#f7f3e8]">{activeCase.title}</h3>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-[#3dd6c4]">{activeCase.type}</p>
            <p className="mt-4 text-sm leading-7 text-white/54">{activeCase.outcome}</p>
            <p className="mt-6 font-mono text-sm text-[#f6c35b]">{activeCase.metric}</p>
          </div>

          <div className="mt-6 space-y-3">
            {WORK.map((item, index) => (
              <button
                key={item.title}
                onClick={() => {
                  setActive(index);
                  document.querySelectorAll(".work-case")[index]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
                className="group flex w-full items-center gap-3 text-left"
              >
                <span className={`h-px flex-1 transition-colors ${active === index ? "bg-[#3dd6c4]" : "bg-white/12 group-hover:bg-white/28"}`} />
                <span className={`min-w-[104px] text-xs font-bold transition-colors ${active === index ? "text-[#3dd6c4]" : "text-white/34 group-hover:text-white/58"}`}>
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className="work-reveal space-y-12">
          {WORK.map((item, index) => (
            <article key={item.title} className="work-case grid gap-6 border-t border-white/10 pt-10 md:grid-cols-[0.42fr_0.58fr] md:items-end">
              <div className="pb-2">
                <span className="font-mono text-xs text-white/28">CASE 0{index + 1}</span>
                <h3 className="mt-4 font-display text-3xl font-black leading-none text-[#f7f3e8] md:text-4xl">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/48">{item.outcome}</p>
              </div>

              <div className="relative mx-auto aspect-[9/14] w-full max-w-[430px] overflow-hidden rounded-[2rem] border border-white/12 bg-[#0d1011] shadow-[0_30px_90px_rgba(0,0,0,0.32)]">
                <div className="h-full cinematic-image transition duration-700 hover:scale-[1.025]" style={{ backgroundImage: `url('${item.image}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1011]/82 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/42">{item.type}</p>
                    <p className="mt-2 font-display text-2xl font-black text-white">{item.title}</p>
                  </div>
                  <span className="font-mono text-sm text-[#3dd6c4]">{item.metric}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
