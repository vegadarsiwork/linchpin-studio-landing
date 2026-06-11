"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".hero-reveal", {
        y: 28,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] overflow-hidden px-5 pb-20 pt-32 md:px-8 md:pb-24 md:pt-40"
    >
      <div
        className="absolute inset-0 cinematic-image opacity-82"
        style={{ backgroundImage: "url('/images/hero-studio.png')", backgroundPosition: "62% center" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#0d1011_0%,rgba(13,16,17,0.9)_40%,rgba(13,16,17,0.32)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0d1011] to-transparent" />

      <div className="relative mx-auto flex min-h-[calc(100dvh-10rem)] max-w-7xl items-end">
        <div className="max-w-4xl pb-8">
          <p className="hero-reveal section-label">Video systems for fast brands</p>
          <h1 className="hero-reveal font-display max-w-4xl text-[2.65rem] font-black leading-[0.94] tracking-tight text-[#f7f3e8] sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="block md:hidden">
              Content that
              <br />
              feels shot,
              <br />
              cut, and
              <br />
              shipped with
              <br />
              intent.
            </span>
            <span className="hidden md:block">Content that feels shot, cut, and shipped with intent.</span>
          </h1>
          <p className="hero-reveal mt-6 max-w-2xl text-base leading-8 text-white/60 md:text-lg">
            Linchpin Studio builds short-form campaigns, brand films, and paid
            creative for teams that need polished output without agency drag.
          </p>

          <div className="hero-reveal mt-9 flex flex-col gap-3 sm:flex-row">
            <MagneticButton
              href="#contact"
              className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#3dd6c4] px-6 py-3.5 text-sm font-black text-[#071011] transition duration-200 hover:bg-[#7fe7db] active:translate-y-[1px] btn-glow"
            >
              Book a content audit
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </MagneticButton>
            <a
              href="#work"
              className="inline-flex items-center justify-center rounded-xl border border-white/14 bg-white/[0.035] px-6 py-3.5 text-sm font-bold text-white/72 transition duration-200 hover:border-[#3dd6c4]/34 hover:text-white active:translate-y-[1px]"
            >
              View recent work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
