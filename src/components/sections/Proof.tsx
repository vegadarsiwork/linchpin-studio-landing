"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

gsap.registerPlugin(ScrollTrigger);

const CLIENTS = ["UrbanFit", "Glow Republic", "PureNest", "Saffron Bites", "Velvet & Co"];

const PROOF = [
  ["412k", "highest reel view count"],
  ["31", "assets shipped in one campaign"],
  ["38.4%", "paid creative lift"],
];

export default function Proof() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".proof-reveal", {
        y: 24,
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
    <section ref={containerRef} className="relative overflow-hidden border-y border-white/8 px-5 py-24 md:px-8">
      <div
        className="absolute inset-0 cinematic-image opacity-18"
        style={{ backgroundImage: "url('/images/proof-stills.png')" }}
      />
      <div className="absolute inset-0 bg-[#101617]/88" />

      <div className="relative mx-auto max-w-7xl">
        <div className="proof-reveal mb-12 grid gap-6 md:grid-cols-[0.45fr_0.55fr] md:items-end">
          <div>
            <span className="section-label">Selected collaborators</span>
            <h2 className="font-display text-3xl font-black leading-tight text-[#f7f3e8] md:text-5xl">
              Campaign work with a calm production rhythm.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/48">
            We support founders, marketers, and operators who need the polish of
            a studio without turning every delivery into a production maze.
          </p>
        </div>

        <div className="proof-reveal grid gap-8 border-y border-white/10 py-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {CLIENTS.map((client) => (
              <span key={client} className="font-display text-2xl font-black text-[#f7f3e8]/82 md:text-3xl">
                {client}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {PROOF.map(([value, label]) => (
              <div key={value} className="border-l border-white/10 pl-4">
                <p className="font-display text-3xl font-black text-[#3dd6c4]">{value}</p>
                <p className="mt-2 text-xs leading-5 text-white/38">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
