"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  ["Short-form systems", "Repeatable reel and short formats with sharp hooks, caption direction, and pacing built for retention."],
  ["Brand films", "Founder stories, launch films, and campaign videos with a tighter cinematic finish."],
  ["Paid creative", "Ad variants shaped around offers, angles, objections, and scroll-stopping openers."],
  ["Motion graphics", "Kinetic type, callouts, UI overlays, title systems, and transition language."],
  ["Strategy calendar", "Monthly ideas, content pillars, scripts, and delivery planning that keeps the queue clear."],
];

const PROCESS = ["Brief", "Script", "Cut", "Review", "Ship"];

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".service-reveal", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: containerRef.current, start: "top 78%" },
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} id="services" className="px-5 py-28 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="service-reveal mb-16 max-w-4xl">
          <span className="section-label">What we do</span>
          <h2 className="font-display text-4xl font-black leading-none tracking-tight text-[#f7f3e8] md:text-6xl">
            Production, editing, and strategy arranged like one operating system.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/46">
            From campaign idea to final export, we shape content that looks
            sharp, feels on-brand, and has a real job to do.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[0.62fr_0.38fr]">
          <div className="service-reveal divide-y divide-white/10 border-y border-white/10">
            {SERVICES.map(([title, desc], index) => (
              <article key={title} className="grid gap-5 py-8 md:grid-cols-[5rem_1fr]">
                <span className="font-mono text-xs text-white/28">0{index + 1}</span>
                <div>
                  <h3 className="font-display text-3xl font-black text-[#f7f3e8]">{title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/48">{desc}</p>
                </div>
              </article>
            ))}
          </div>

          <aside className="service-reveal rounded-[1.75rem] border border-white/10 bg-[#101617] p-6 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3dd6c4]">Production lane</p>
            <div className="mt-8 space-y-5">
              {PROCESS.map((step, index) => (
                <div key={step} className="flex items-center gap-4">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/12 font-mono text-xs text-white/42">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-white/68">{step}</span>
                  {index < PROCESS.length - 1 && <span className="ml-auto h-px flex-1 bg-white/8" />}
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm leading-7 text-white/42">
              Speed only works when the handoffs are controlled. Our process keeps
              creative decisions, revision notes, and exports moving in order.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
