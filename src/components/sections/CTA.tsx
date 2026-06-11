"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import MagneticButton from "@/components/ui/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".cta-reveal", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: containerRef.current, start: "top 78%" },
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} id="contact" className="relative overflow-hidden px-5 py-32 md:px-8">
      <div
        className="absolute inset-0 cinematic-image opacity-44"
        style={{ backgroundImage: "url('/images/cta-studio.png')" }}
      />
      <div className="absolute inset-0 bg-[#0d1011]/78" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0d1011] to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <span className="cta-reveal section-label">Let&apos;s work together</span>
          <h2 className="cta-reveal font-display text-5xl font-black leading-none tracking-tight text-[#f7f3e8] md:text-7xl">
            Bring us the brief. We&apos;ll bring the content engine.
          </h2>
          <p className="cta-reveal mt-6 max-w-2xl text-base leading-8 text-white/56">
            Book a free 20-minute strategy call. We&apos;ll audit what you have,
            find the strongest content angles, and show where production can move faster.
          </p>

          <div className="cta-reveal mt-9 flex flex-col gap-3 sm:flex-row">
            <MagneticButton
              href="mailto:info@linchpinsoftsolution.com"
              className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#3dd6c4] px-7 py-4 text-sm font-black text-[#071011] transition duration-200 hover:bg-[#7fe7db] active:translate-y-[1px] btn-glow"
            >
              Book a free call
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </MagneticButton>
            <a
              href="mailto:info@linchpinsoftsolution.com"
              className="inline-flex items-center justify-center rounded-xl border border-white/14 bg-white/[0.035] px-7 py-4 text-sm font-bold text-white/70 transition duration-200 hover:border-[#3dd6c4]/34 hover:text-white active:translate-y-[1px]"
            >
              info@linchpinsoftsolution.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
