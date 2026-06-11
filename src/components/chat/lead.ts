/* ───────── Linchpin Studio — client-side lead capture helpers ─────────
   No persistence: leads are extracted in the browser and handed off via
   mailto: / WhatsApp using the landing page's real contact details.       */

export const CONTACT = {
  email: "info@linchpinsoftsolution.com",
  phoneDisplay: "+91 7416 393 958",
  whatsapp: "917416393958", // wa.me digits, no "+"
};

export interface Lead {
  name: string;
  company: string;
  contact: string; // phone or email
  service: string;
  budget: string;
  timeline: string;
  notes: string;
}

export const EMPTY_LEAD: Lead = {
  name: "",
  company: "",
  contact: "",
  service: "",
  budget: "",
  timeline: "",
  notes: "",
};

export const SERVICE_OPTIONS = [
  "Influencer reels",
  "Brand-led (solo) reels",
  "Digital marketing package",
  "Custom bulk / not sure",
];

export const BUDGET_OPTIONS = [
  "Under ₹10,000",
  "₹10,000 – ₹25,000",
  "₹25,000 – ₹60,000",
  "₹60,000+",
  "Not sure yet",
];

export const TIMELINE_OPTIONS = [
  "ASAP / this week",
  "2 – 4 weeks",
  "1 – 3 months",
  "Just exploring",
];

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_RE = /(\+?\d[\d\s-]{8,}\d)/;
const BUDGET_RE = /₹\s?[\d,]+(?:\s?(?:k|lakh|l))?/i;

/* Heuristic, best-effort extraction from the user's chat turns.
   Everything is a *suggestion* — the user edits before sending. */
export function extractLead(userText: string): Partial<Lead> {
  const out: Partial<Lead> = {};
  const text = userText.trim();
  if (!text) return out;

  const email = text.match(EMAIL_RE)?.[0];
  const phone = text.match(PHONE_RE)?.[0]?.trim();
  if (email) out.contact = email;
  else if (phone) out.contact = phone;

  const name = text.match(/(?:my name is|i am|i'm|this is)\s+([a-z][a-z .'-]{1,38})/i)?.[1];
  if (name) out.name = name.trim().replace(/[.,;].*$/, "");

  const company = text.match(
    /(?:brand|company|business|startup)(?:\s+is|\s+called|\s+name is|:)?\s+([a-z0-9][\w &.'-]{1,38})/i
  )?.[1];
  if (company) out.company = company.trim().replace(/[.,;].*$/, "");

  const low = text.toLowerCase();
  if (/influencer/.test(low)) out.service = SERVICE_OPTIONS[0];
  else if (/(brand-led|solo|founder|product)/.test(low)) out.service = SERVICE_OPTIONS[1];
  else if (/(digital marketing|package|seed|growth|scale|elite|monthly|ads)/.test(low))
    out.service = SERVICE_OPTIONS[2];
  else if (/(bulk|custom)/.test(low)) out.service = SERVICE_OPTIONS[3];

  const budget = text.match(BUDGET_RE)?.[0];
  if (budget) out.budget = budget.replace(/\s+/g, " ").trim();

  if (/(asap|urgent|today|this week|immediately)/.test(low)) out.timeline = TIMELINE_OPTIONS[0];
  else if (/(week|fortnight)/.test(low)) out.timeline = TIMELINE_OPTIONS[1];
  else if (/(month|quarter)/.test(low)) out.timeline = TIMELINE_OPTIONS[2];
  else if (/(explor|browsing|just looking|curious)/.test(low)) out.timeline = TIMELINE_OPTIONS[3];

  return out;
}

/* Merge per-message extractions; earlier-filled fields win unless empty. */
export function mergeLead(base: Lead, patch: Partial<Lead>): Lead {
  const next = { ...base };
  (Object.keys(patch) as (keyof Lead)[]).forEach((k) => {
    if (!next[k] && patch[k]) next[k] = patch[k] as string;
  });
  return next;
}

function val(v: string) {
  return v && v.trim() ? v.trim() : "—";
}

export function buildInquiry(lead: Lead): { subject: string; body: string } {
  const who = lead.name || lead.company || "Website visitor";
  const subject = `New inquiry — ${who}`;
  const body = [
    "New inquiry from the Linchpin Studio website chat:",
    "",
    `Name: ${val(lead.name)}`,
    `Brand / company: ${val(lead.company)}`,
    `Phone / email: ${val(lead.contact)}`,
    `Service interest: ${val(lead.service)}`,
    `Budget: ${val(lead.budget)}`,
    `Timeline: ${val(lead.timeline)}`,
    `Notes: ${val(lead.notes)}`,
  ].join("\n");
  return { subject, body };
}

export function mailtoHref(lead: Lead): string {
  const { subject, body } = buildInquiry(lead);
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function whatsappHref(lead: Lead): string {
  const body = [
    "Hey, I have an enquiry for Linchpin Studio.",
    "My details are as follows:",
    "",
    `Name: ${val(lead.name)}`,
    `Brand / company: ${val(lead.company)}`,
    `Phone / email: ${val(lead.contact)}`,
    `Service I am interested in: ${val(lead.service)}`,
    `Budget: ${val(lead.budget)}`,
    `Timeline: ${val(lead.timeline)}`,
    `Notes: ${val(lead.notes)}`,
  ].join("\n");

  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(body)}`;
}
