export type KnowledgeChunk = {
  id: string;
  title: string;
  text: string;
  keywords: string[];
};

export const SITE_KNOWLEDGE: KnowledgeChunk[] = [
  {
    id: "overview",
    title: "Linchpin Studio overview",
    keywords: ["overview", "linchpin", "studio", "services", "reels", "content"],
    text:
      "Linchpin Studio creates high-quality influencer-led and brand-led short-form video content for social platforms. The team handles scripting, shooting, editing, content strategy, platform-ready exports, and digital marketing packages.",
  },
  {
    id: "process",
    title: "Production process",
    keywords: ["process", "timeline", "brief", "shoot", "edit", "delivery", "revisions"],
    text:
      "The process is brief and discovery, script and strategy, shoot day, edit and post-production, then delivery and revisions. Standard deliverables include 2 free revisions per reel. Typical batch delivery is 7-10 working days.",
  },
  {
    id: "influencer-reels",
    title: "Influencer reel pricing",
    keywords: ["influencer", "silver", "gold", "platinum", "price", "pricing", "reel"],
    text:
      "Influencer reel tiers: Silver is INR 2,000 per reel with standard influencer, core edits, basic scripting, and single-location shoot. Gold is INR 2,500 per reel with premium influencer, advanced edits, professional scripting, multi-angle shoot, and strategy support. Platinum is INR 3,000 per reel with top-tier influencer, cinematic edits, in-depth scripting, multi-day shoot, and full content strategy. Packages are available for 3, 5, 10, or custom bulk reels.",
  },
  {
    id: "brand-led-reels",
    title: "Brand-led reel pricing",
    keywords: ["brand", "solo", "founder", "diamond", "gold", "price", "pricing"],
    text:
      "Brand-led or solo reels do not use third-party influencer talent. Gold is INR 1,500 per reel with standard edits, core scripting, single-day shoot, and brand-aligned content strategy. Diamond is INR 2,000 per reel with cinematic edits, in-depth scripting, multi-angle or multi-location shoot, and complete content strategy.",
  },
  {
    id: "digital-marketing",
    title: "Digital marketing packages",
    keywords: ["digital", "marketing", "seed", "growth", "scale", "elite", "monthly", "ads"],
    text:
      "Digital marketing packages: Seed is INR 30,000 per month and includes 7 reels, static posts, carousels, stories, 1 influencer, 1 shoot day, 1 Meta ads campaign, and monthly content calendar. Growth is INR 60,000 per month and includes 12 reels, 10 static posts, 5 carousels, 20 stories, 3 influencers, 5 shoot days, brand guidelines, and 5 Meta ad campaigns. Scale is INR 1,00,000 per month and includes 20 influencer reels, static posts, carousels, stories on request, 5 influencers, 8 shoot days, 10 Meta ad campaigns, and analytics dashboard. Elite is INR 1,40,000 per month and includes 30 influencer reels, 15 static posts, 10 carousels, 60 stories, 10 influencers, 12 shoot days, 20 Meta ad campaigns, and a dedicated creative director.",
  },
  {
    id: "deliverables",
    title: "Deliverables",
    keywords: ["included", "deliverables", "revisions", "shoot", "influencer", "bulk"],
    text:
      "Deliverable packages include 3 reels as a lean launch with 1 influencer, 1 shoot day, 2 revisions per reel, and editing. 5 reels include 1 influencer, 1-2 shoot days, 2 revisions per reel, editing, and professional scripting. 10 reels include 2 influencers, up to 3 shoot days, 2 revisions per reel, editing, and professional scripting. Custom bulk includes custom influencer allocation, flexible shoot scheduling, 2 revisions per reel, bulk pricing discussion, and a dedicated project manager.",
  },
  {
    id: "policies",
    title: "Policies and notes",
    keywords: ["policy", "policies", "gst", "payment", "raw", "footage", "cancellation"],
    text:
      "Policies: minimum reel order is 3 reels, no singles. Base brand-led Gold pricing is INR 1,500 per reel. Orders up to 5 reels include 1 influencer, 10 reels include 2 influencers, and extra influencers cost INR 2,500-INR 6,000 depending on profile and reach. Premium influencers require a minimum 3-reel commitment. Extra revisions are charged. 5-reel shoots are capped at 1-2 days and 10-reel shoots at 3 days unless extra fees are agreed. Raw footage access is +40% of the total bill and is delivered after full payment. Prices are exclusive of GST. Payment is 50% advance and 50% on delivery. Cancellations after shoot are charged in full. Content ownership transfers after full payment. Rescheduling requires 48 hours advance notice.",
  },
  {
    id: "contact",
    title: "Contact and handoff",
    keywords: ["contact", "email", "phone", "whatsapp", "hyderabad", "talk", "human"],
    text:
      "For human follow-up, visitors can contact Linchpin Studio by phone or WhatsApp at +91 7416 393 958, by email at info@linchpinsoftsolution.com, or visit the team at AltF Begumpet, Hyderabad. The assistant should collect name, brand or company, phone or email, service interest, budget, timeline, and notes before handoff when possible.",
  },
];

export function retrieveKnowledge(query: string, limit = 4) {
  const terms = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 2);

  const scored = SITE_KNOWLEDGE.map((chunk) => {
    const haystack = `${chunk.title} ${chunk.keywords.join(" ")} ${chunk.text}`.toLowerCase();
    const score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
    return { chunk, score };
  });

  const top = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ chunk }) => chunk);

  return top.length ? top : SITE_KNOWLEDGE.slice(0, limit);
}

export function formatKnowledgeContext(chunks: KnowledgeChunk[]) {
  return chunks.map((chunk) => `## ${chunk.title}\n${chunk.text}`).join("\n\n");
}
