"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

gsap.registerPlugin(ScrollTrigger);

const PLANS = [
  {
    name: "Sprint",
    price: "INR 42k",
    note: "One campaign burst",
    details: "7 short-form assets, caption direction, resizing, and one content angle map.",
  },
  {
    name: "Retainer",
    price: "INR 86k",
    note: "Monthly content rhythm",
    details: "18 assets, edit calendar, weekly review loop, and performance learnings.",
  },
  {
    name: "Studio",
    price: "INR 1.48L",
    note: "Full campaign production",
    details: "Shoot planning, brand film, paid social cutdowns, motion system, and priority queue.",
  },
];

const FAQS = [
  ["How fast do you deliver videos?", "Our standard turnaround is 48 hours for short-form videos under 60 seconds. Brand films and longer formats take 5-7 business days. Retainer and Studio clients get priority queuing."],
  ["Do you handle scripting and ideation too?", "Yes. You can share a brief, a raw idea, or just a product link. We handle research, scripting, storyboarding, production, and editing. You review and approve."],
  ["Do I need to provide raw footage?", "Not necessarily. If you have footage, we can edit it. If you do not, we can source stock footage, create motion graphics, or arrange a shoot depending on your plan."],
];

export default function PackagesFAQ() {
  const containerRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(1);
  const [open, setOpen] = useState(0);

  useGSAP(
    () => {
      gsap.from(".packages-reveal", {
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
    <section ref={containerRef} id="pricing" className="px-5 py-28 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="packages-reveal mb-14 grid gap-6 md:grid-cols-[0.55fr_0.45fr] md:items-end">
          <div>
            <span className="section-label">Packages</span>
            <h2 className="font-display text-4xl font-black leading-none tracking-tight text-[#f7f3e8] md:text-6xl">
              Pick the pace. Keep the creative sharp.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/48">
            Start with a sprint, or plug us into the monthly rhythm. Every plan
            includes edit direction, clean delivery, and platform-ready exports.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.64fr_0.36fr]">
          <div className="packages-reveal grid gap-3 md:grid-cols-3">
            {PLANS.map((plan, index) => (
              <button
                key={plan.name}
                onClick={() => setActive(index)}
                onMouseEnter={() => setActive(index)}
                className={`rounded-[1.5rem] border p-5 text-left transition duration-300 active:translate-y-[1px] ${
                  active === index
                    ? "border-[#3dd6c4]/54 bg-[#101617]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <p className="text-sm font-bold text-white/52">{plan.name}</p>
                <p className="mt-5 font-display text-4xl font-black text-[#f7f3e8]">{plan.price}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3dd6c4]">{plan.note}</p>
                <p className="mt-6 text-sm leading-7 text-white/46">{plan.details}</p>
              </button>
            ))}
          </div>

          <div className="packages-reveal rounded-[1.75rem] border border-white/10 bg-[#101617] p-6">
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-white/34">Questions</p>
            <div className="divide-y divide-white/10">
              {FAQS.map(([q, a], index) => (
                <div key={q} className="py-4">
                  <button
                    className="flex w-full items-center justify-between gap-4 text-left"
                    onClick={() => setOpen(index)}
                  >
                    <span className={`text-sm font-semibold ${open === index ? "text-[#3dd6c4]" : "text-white/72"}`}>{q}</span>
                    <span className="font-mono text-xs text-white/28">0{index + 1}</span>
                  </button>
                  {open === index && <p className="mt-3 text-sm leading-7 text-white/45">{a}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
