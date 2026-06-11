import LinchpinLogo from "@/components/ui/LinchpinLogo";

const LINKS = {
  Services: ["Short-Form Videos", "Brand Films", "Social Ads", "Content Strategy", "Motion Graphics"],
  Company: ["About Us", "Our Work", "Packages", "Content Audit"],
  Contact: ["info@linchpinsoftsolution.com", "Instagram", "LinkedIn", "YouTube"],
};

export default function Footer() {
  return (
    <footer className="bg-[#0d1011] border-t border-white/10 pt-16 pb-8 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#3dd6c4] flex items-center justify-center text-[#071011] shadow-lg shadow-[#050707]/25">
                <LinchpinLogo className="w-5 h-5" />
              </div>
              <span className="font-bold text-white tracking-tight">Linchpin Studio</span>
            </div>
            <p className="text-white/30 text-sm leading-relaxed mb-5">
              We create short-form video content and brand films that drive
              real engagement and business results.
            </p>
            <div className="flex gap-3">
              {["in", "yt", "ig"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 rounded-lg border border-white/10 bg-[#101617] flex items-center justify-center text-white/35 hover:text-white hover:border-[#3dd6c4]/45 hover:bg-[#3dd6c4]/10 transition-all duration-200 text-xs font-bold"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href={item.includes("@") ? `mailto:${item}` : "#"}
                      className="text-white/25 hover:text-white/60 text-sm transition-colors duration-200 break-all"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/15 text-xs">
            &copy; {new Date().getFullYear()} Linchpin Studio. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <a key={item} href="#" className="text-white/15 hover:text-white/40 text-xs transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
