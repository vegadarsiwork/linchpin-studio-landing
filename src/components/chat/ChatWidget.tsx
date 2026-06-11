"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./ChatWidget.module.css";
import {
  BUDGET_OPTIONS,
  CONTACT,
  EMPTY_LEAD,
  Lead,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
  extractLead,
  mailtoHref,
  mergeLead,
  whatsappHref,
} from "./lead";

type Role = "user" | "assistant";
interface Message {
  id: string;
  role: Role;
  content: string;
}

const STARTERS = [
  "What package is right for my brand?",
  "How fast can you deliver reels?",
  "Can you help with scripting and shoots?",
];

type FlowStep = "service" | "budget" | "timeline" | "handoff";

type FlowState = {
  id: "recommendation" | "handoff";
  step: FlowStep;
};

type FlowOption = {
  label: string;
  value: string;
  patch?: Partial<Lead>;
};

const STORAGE_KEY = "linchpin-studio-chat-v1";

const FLOW_OPTIONS: Record<FlowStep, FlowOption[]> = {
  service: [
    { label: "Influencer reels", value: "Influencer reels", patch: { service: "Influencer reels" } },
    { label: "Brand-led reels", value: "Brand-led reels", patch: { service: "Brand-led (solo) reels" } },
    { label: "Marketing package", value: "Digital marketing package", patch: { service: "Digital marketing package" } },
    { label: "Not sure yet", value: "Not sure yet", patch: { service: "Custom bulk / not sure" } },
  ],
  budget: BUDGET_OPTIONS.map((option) => ({ label: option, value: option, patch: { budget: option } })),
  timeline: TIMELINE_OPTIONS.map((option) => ({ label: option, value: option, patch: { timeline: option } })),
  handoff: [
    { label: "Send inquiry", value: "Send inquiry" },
    { label: "Continue chatting", value: "Continue chatting" },
  ],
};

const CTA_RE = /(start|get started|quote|choose|talk|inquiry)/i;

const PLAN_DETAILS: Record<string, string> = {
  silver:
    "Silver is the entry influencer reel tier — ideal for a lean start. Includes a standard influencer, core edits, basic scripting, and a single-location shoot.",
  gold:
    "Gold is our signature flexible tier. Influencer Gold includes premium talent, advanced edits, professional scripting, multi-angle shoot, and strategy support. Brand-led Gold includes standard edits, core scripting, and a single-day shoot.",
  platinum:
    "Platinum is the cinematic top-tier influencer reel option. Includes top-tier creator direction, cinematic edits, in-depth scripting, multi-day shoot potential, and full content strategy.",
  diamond:
    "Diamond is the premium brand-led reel tier built for cinematic brand storytelling. Includes in-depth scripting, multi-angle or multi-location production, and complete content strategy.",
  seed:
    "Seed is our early-stage brand building package. Includes 7 reels, static posts, carousels, stories, 1 influencer, 1 shoot day, 1 Meta ads campaign, and a monthly content calendar.",
  growth:
    "Growth is our package for scaling your content engine. Includes 12 reels, 10 static posts, 5 carousels, 20 stories, 3 influencers, 5 shoot days, brand guidelines, and 5 Meta ad campaigns.",
  scale:
    "Scale is our performance-led content marketing package. Includes 20 influencer reels, static posts, carousels, stories on request, 5 influencers, 8 shoot days, 10 Meta ad campaigns, and an analytics dashboard.",
  elite:
    "Elite is our full-stack creative and performance package. Includes 30 influencer reels, 15 static posts, 10 carousels, 60 stories, 10 influencers, 12 shoot days, 20 Meta ad campaigns, and a dedicated creative director.",
};

function planDetailFor(label: string) {
  const normalized = label.toLowerCase();
  const key = Object.keys(PLAN_DETAILS).find((plan) => normalized.includes(plan));
  return key ? PLAN_DETAILS[key] : null;
}

/* tiny inline icons (the page's lucide loader doesn't touch React-rendered nodes) */
const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />
  </svg>
);
const IconSparkle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
  </svg>
);
const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7z" />
  </svg>
);
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="M6 6l12 12" />
  </svg>
);
const IconMinus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
  </svg>
);
const IconAlert = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
  </svg>
);
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconBack = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" />
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.26h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.85a16 16 0 0 0 6.29 6.29l1-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.043zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
const thinkingDelay = (text = "") => Math.min(1400, 520 + text.length * 4);

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"chat" | "lead">("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lead, setLead] = useState<Lead>(EMPTY_LEAD);
  const [flow, setFlow] = useState<FlowState | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const lastSent = useRef<Message[] | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as { messages?: Message[]; lead?: Lead };
      if (Array.isArray(parsed.messages)) setMessages(parsed.messages.slice(-30));
      if (parsed.lead) setLead(mergeLead(EMPTY_LEAD, parsed.lead));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ messages: messages.slice(-30), lead })
      );
    } catch {
      // Storage may be unavailable in some privacy modes; chat still works.
    }
  }, [messages, lead]);

  /* Best-effort lead details detected from everything the user has typed.
     Suggestions only — merged into the form, never sent without the user. */
  const detected = useMemo(() => {
    let acc: Lead = { ...EMPTY_LEAD };
    for (const m of messages) {
      if (m.role === "user") acc = mergeLead(acc, extractLead(m.content));
    }
    return acc;
  }, [messages]);

  /* autoscroll to newest */
  useEffect(() => {
    if (view === "chat")
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open, view]);

  /* focus input when opened */
  useEffect(() => {
    if (open && view === "chat") taRef.current?.focus();
  }, [open, view]);

  /* esc to close (or back out of the form) */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (view === "lead") setView("chat");
      else setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, view]);

  useEffect(() => {
    const onCtaClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>('a[href="#contact"]');
      if (!link) return;

      const label = link.textContent?.replace(/\s+/g, " ").trim() || "Start a project";
      if (!CTA_RE.test(label)) return;

      event.preventDefault();

      const context =
        link.closest("article")?.textContent?.replace(/\s+/g, " ").trim() ||
        link.closest("section")?.textContent?.replace(/\s+/g, " ").trim() ||
        "";
      const text = `${label} ${context}`.toLowerCase();

      const patch: Partial<Lead> = {};
      if (/(seed|growth|scale|elite|digital marketing|meta ad|monthly)/i.test(text)) {
        patch.service = "Digital marketing package";
      } else if (/(brand-led|solo|diamond|founder|product-focused)/i.test(text)) {
        patch.service = "Brand-led (solo) reels";
      } else if (/(silver|gold|platinum|influencer|creator)/i.test(text)) {
        patch.service = "Influencer reels";
      } else {
        patch.service = "Custom bulk / not sure";
      }

      const packageMatch = label.match(/(?:choose|start with)\s+(.+)/i)?.[1]?.trim();
      const selected = packageMatch || (label.toLowerCase().includes("quote") ? "custom quote" : label);
      const note = `CTA clicked: ${selected}. ${patch.service ? `Interest: ${patch.service}.` : ""}`;
      const planDetail = planDetailFor(selected);

      // "Start" / "Get started" = decision-ready → open enquiry form directly
      const isStartCta = /^(start|get started)/i.test(label);

      setLead((prev) => ({
        ...mergeLead(prev, patch),
        notes: prev.notes || note,
      }));

      if (isStartCta) {
        setError(null);
        setFlow(null);
        setOpen(true);
        setView("lead");
        return;
      }

      const reply =
        selected === "custom quote"
          ? "I can help you with a custom quote. Tell me what you want to create, or tap Send an inquiry when you are ready for the team to follow up."
          : planDetail
            ? `${planDetail}\n\nWould you like to send an enquiry for ${selected}?`
            : `You selected ${selected}. Ask me anything about fit, options, or timelines. Would you like to send an enquiry when you are ready?`;

      setError(null);
      setFlow(null);
      setOpen(true);
      setView("chat");
      setLoading(true);
      window.setTimeout(() => {
        setMessages((current) => [...current, { id: uid(), role: "assistant", content: reply }]);
        setLoading(false);
      }, thinkingDelay(reply));
    };

    document.addEventListener("click", onCtaClick);
    return () => document.removeEventListener("click", onCtaClick);
  }, []);

  const autosize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const addAssistant = async (content: string) => {
    setLoading(true);
    await wait(thinkingDelay(content));
    setMessages((m) => [...m, { id: uid(), role: "assistant", content }]);
    setLoading(false);
  };

  const startFlow = async (id: FlowState["id"]) => {
    setError(null);
    setOpen(true);
    setView("chat");

    if (id === "handoff") {
      setFlow({ id, step: "handoff" });
      await addAssistant(
        "I can hand this to the team. If you share your contact details, I will include this chat so they have context."
      );
      return;
    }

    setFlow({ id, step: "service" });
    await addAssistant("Let me guide you quickly. What are you looking for?");
  };

  const completeFlow = () => {
    const recentUser = messages
      .filter((m) => m.role === "user")
      .slice(-3)
      .map((m) => m.content)
      .join(" · ");

    setLead((prev) => {
      const merged = mergeLead(mergeLead(prev, detected), lead);
      return {
        ...merged,
        notes:
          merged.notes ||
          `Guided flow: ${merged.service || "not sure"}, ${merged.budget || "budget not set"}, ${
            merged.timeline || "timeline not set"
          }${recentUser ? `. Recent chat: ${recentUser}` : ""}`.slice(0, 500),
      };
    });
    setFlow(null);
    setView("lead");
  };

  const chooseFlowOption = async (option: FlowOption) => {
    setMessages((m) => [...m, { id: uid(), role: "user", content: option.value }]);
    if (option.patch) setLead((prev) => mergeLead(prev, option.patch || {}));

    if (!flow) return;

    if (flow.step === "service") {
      setFlow({ ...flow, step: "budget" });
      await addAssistant("What budget range should we keep in mind?");
      return;
    }

    if (flow.step === "budget") {
      setFlow({ ...flow, step: "timeline" });
      await addAssistant("What timeline are you working with?");
      return;
    }

    if (flow.step === "timeline") {
      setFlow({ ...flow, step: "handoff" });
      await addAssistant(
        "Good fit. I can send this to the team with your chat context so they can reply with a more exact quote."
      );
      return;
    }

    if (option.value === "Send inquiry") completeFlow();
    else setFlow(null);
  };

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setError(null);
      const userMsg: Message = { id: uid(), role: "user", content: trimmed };
      const history = [...messages, userMsg];
      setMessages(history);
      setFlow(null);
      setInput("");
      if (taRef.current) taRef.current.style.height = "auto";
      setLoading(true);

      // payload the API consumes; server logic is out of scope
      const payload = history.map((m) => ({ role: m.role, content: m.content }));
      lastSent.current = history;

      const botId = uid();
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: payload }),
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);

        const ctype = res.headers.get("content-type") || "";

        // place an empty assistant bubble we can fill
        setMessages((m) => [...m, { id: botId, role: "assistant", content: "" }]);

        if (res.body && !ctype.includes("application/json")) {
          // streamed text (text/plain or SSE-ish): append decoded chunks
          setStreaming(true);
          setLoading(false);
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let acc = "";
          for (;;) {
            const { value, done } = await reader.read();
            if (done) break;
            acc += decoder.decode(value, { stream: true });
            const text = acc;
            setMessages((m) =>
              m.map((msg) => (msg.id === botId ? { ...msg, content: text } : msg))
            );
          }
        } else {
          // single JSON reply
          const data = await res.json();
          const reply =
            data.reply ?? data.message ?? data.content ?? data.text ?? "";
          await wait(thinkingDelay(String(reply)));
          setMessages((m) =>
            m.map((msg) =>
              msg.id === botId ? { ...msg, content: String(reply) } : msg
            )
          );
        }
      } catch (err) {
        // drop the empty bot bubble if present, surface error
        setMessages((m) => m.filter((msg) => !(msg.id === botId && msg.content === "")));
        setMessages((m) => [
          ...m,
          {
            id: uid(),
            role: "assistant",
            content:
              "I can still help collect your inquiry. Share what you need, or tap the inquiry button and the team will follow up directly.",
          },
        ]);
        setError(
          err instanceof Error
            ? `${err.message}. AI chat may not be configured yet.`
            : "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
        setStreaming(false);
      }
    },
    [messages, loading]
  );

  const retry = () => {
    if (!lastSent.current) return;
    const hist = lastSent.current;
    const lastUser = [...hist].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    setMessages(hist.filter((m) => m.id !== lastUser.id));
    send(lastUser.content);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  /* ── Lead capture ─────────────────────────────────────────── */
  const openInquiry = () => {
    setFlow(null);
    // prefill from chat detections + any earlier notes from the conversation
    const recentUser = messages
      .filter((m) => m.role === "user")
      .slice(-3)
      .map((m) => m.content)
      .join(" · ");
    setLead((prev) => {
      const merged = mergeLead(prev, detected);
      if (!merged.notes && recentUser) merged.notes = `From chat: ${recentUser}`.slice(0, 400);
      return merged;
    });
    setView("lead");
  };

  const setField = (k: keyof Lead, v: string) =>
    setLead((prev) => ({ ...prev, [k]: v }));

  const canSend = lead.contact.trim().length > 0;

  const submitLead = async (channel: "email" | "whatsapp") => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lead,
        transcript: messages.map((m) => ({ role: m.role, content: m.content })),
        channel,
        page: window.location.href,
      }),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      throw new Error(data?.error || `Lead delivery failed (${res.status})`);
    }
  };

  const handleHandoff = async (channel: "email" | "whatsapp") => {
    if (!canSend || leadSubmitting) return;
    setLeadSubmitting(true);
    setError(null);
    try {
      await submitLead(channel);
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message} Using the direct ${channel === "email" ? "email" : "WhatsApp"} fallback.`
          : `Lead delivery failed. Using the direct ${channel === "email" ? "email" : "WhatsApp"} fallback.`
      );
    } finally {
      setLeadSubmitting(false);
    }
    const href = channel === "email" ? mailtoHref(lead) : whatsappHref(lead);
    if (channel === "email") window.location.href = href;
    else window.open(href, "_blank", "noopener");

    // confirm in-chat, then drop back to the conversation
    setMessages((m) => [
      ...m,
      {
        id: uid(),
        role: "assistant",
        content:
          channel === "email"
            ? "Opening your email app with the inquiry pre-filled — just hit send and we'll be in touch shortly. 💜"
            : "Opening WhatsApp with your details — just hit send and our team will reply soon. 💜",
      },
    ]);
    setView("chat");
  };

  const empty = messages.length === 0;

  return (
    <div className={`${styles.root} ${open ? styles.open : ""}`}>
      {!open ? (
        <button
          className={styles.fab}
          onClick={() => setOpen(true)}
          aria-label="Open chat with Linchpin Studio"
        >
          <IconChat />
          <span>Chat with us</span>
          <span className={styles.fabPulse} aria-hidden="true" />
        </button>
      ) : (
        <>
        <button
          className={styles.backdrop}
          onClick={() => setOpen(false)}
          aria-label="Minimize chat"
          type="button"
        />
        <div
          className={`${styles.panel} ${view === "lead" ? styles.panelLead : ""}`}
          role="dialog"
          aria-label="Linchpin Studio chat"
          aria-modal="false"
        >
          {/* header */}
          <div className={styles.header}>
            {view === "lead" ? (
              <button className={styles.iconBtn} onClick={() => setView("chat")} aria-label="Back to chat">
                <IconBack />
              </button>
            ) : (
              <div className={styles.avatar} aria-hidden="true"><IconSparkle /></div>
            )}
            <div className={styles.headMeta}>
              <span className={styles.headTitle}>
                {view === "lead" ? "Send an inquiry" : "Linchpin Studio"}
              </span>
              <span className={styles.headStatus}>
                <span className={styles.dot} />
                {view === "lead" ? "We reply within a few hours" : "Usually replies in a few minutes"}
              </span>
            </div>
            <div className={styles.headBtns}>
              {view === "chat" && (
                <button className={styles.iconBtn} onClick={openInquiry} aria-label="Send an inquiry">
                  <IconUser />
                </button>
              )}
              <button className={styles.iconBtn} onClick={() => setOpen(false)} aria-label="Minimize chat">
                <IconMinus />
              </button>
              <button
                className={styles.iconBtn}
                onClick={() => {
                  setOpen(false);
                  setMessages([]);
                  setLead(EMPTY_LEAD);
                  setFlow(null);
                  setError(null);
                  setView("chat");
                  window.localStorage.removeItem(STORAGE_KEY);
                }}
                aria-label="Close chat"
              >
                <IconClose />
              </button>
            </div>
          </div>

          {view === "lead" ? (
            /* ── LEAD FORM ───────────────────────────────────── */
            <>
              <div className={styles.leadCols}>
                {/* Left — form */}
                <div className={styles.leadColForm}>
                  <div className={styles.messages}>
                    <p className={styles.introText}>
                      Fill in what you know — we&apos;ll take it from there. Fields pre-fill from your chat automatically.
                    </p>
                    <div className={styles.leadForm}>
                      <div className={styles.fieldRow}>
                        <div className={styles.field}>
                          <label htmlFor="ld-name">Name</label>
                          <input id="ld-name" className={styles.input} value={lead.name}
                            onChange={(e) => setField("name", e.target.value)} placeholder="Your name" />
                        </div>
                        <div className={styles.field}>
                          <label htmlFor="ld-company">Brand / company</label>
                          <input id="ld-company" className={styles.input} value={lead.company}
                            onChange={(e) => setField("company", e.target.value)} placeholder="Brand or company" />
                        </div>
                      </div>
                      <div className={styles.field}>
                        <label htmlFor="ld-contact">Phone or email <span className={styles.req}>*</span></label>
                        <input id="ld-contact" className={styles.input} value={lead.contact}
                          onChange={(e) => setField("contact", e.target.value)}
                          placeholder="So we can reach you" />
                      </div>
                      <div className={styles.fieldRow}>
                        <div className={styles.field}>
                          <label htmlFor="ld-service">Service interest</label>
                          <select id="ld-service" className={styles.input} value={lead.service}
                            onChange={(e) => setField("service", e.target.value)}>
                            <option value="">Select…</option>
                            {SERVICE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div className={styles.field}>
                          <label htmlFor="ld-budget">Budget</label>
                          <select id="ld-budget" className={styles.input} value={lead.budget}
                            onChange={(e) => setField("budget", e.target.value)}>
                            <option value="">Select…</option>
                            {BUDGET_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className={styles.field}>
                        <label htmlFor="ld-timeline">Timeline</label>
                        <select id="ld-timeline" className={styles.input} value={lead.timeline}
                          onChange={(e) => setField("timeline", e.target.value)}>
                          <option value="">Select…</option>
                          {TIMELINE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div className={styles.field}>
                        <label htmlFor="ld-notes">Notes</label>
                        <textarea id="ld-notes" className={styles.input} rows={5} value={lead.notes}
                          onChange={(e) => setField("notes", e.target.value)}
                          placeholder="Anything else we should know?" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right — direct contact */}
                <div className={styles.leadColDirect}>
                  <div className={styles.directBlock}>
                    <p className={styles.directEyebrow}>No forms?</p>
                    <h3 className={styles.directTitle}>Skip it entirely.</h3>
                    <p className={styles.directSub}>
                      Reach us directly — no wait, no friction. We reply fast on all channels.
                    </p>
                    <a
                      href={`https://wa.me/${CONTACT.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.directWa}
                    >
                      <IconWhatsApp /> Message on WhatsApp
                    </a>
                    <div className={styles.directLinks}>
                      <a href={`tel:+${CONTACT.whatsapp}`} className={styles.directLink}>
                        <IconPhone />{CONTACT.phoneDisplay}
                      </a>
                      <a href={`mailto:${CONTACT.email}`} className={styles.directLink}>
                        <IconMail />{CONTACT.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.leadActions}>
                <div className={styles.leadBtns}>
                  <button className={styles.leadEmail} disabled={!canSend || leadSubmitting}
                    onClick={() => handleHandoff("email")}>
                    <IconMail /> {leadSubmitting ? "Sending..." : "Send inquiry by email"}
                  </button>
                  <button className={styles.leadWa} disabled={!canSend || leadSubmitting}
                    onClick={() => handleHandoff("whatsapp")}>
                    <IconWhatsApp /> Send via WhatsApp
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* ── CHAT ────────────────────────────────────────── */
            <>
              <div className={styles.messages} ref={listRef}>
                {empty ? (
                  <div className={styles.intro}>
                    <p className={styles.introText}>
                      <strong>Hey! 👋 Welcome to Linchpin Studio.</strong> Ask us anything about
                      reels, packages, or production — or start with one of these:
                    </p>
                    <div className={styles.starters}>
                      <span className={styles.starterLabel}>Popular questions</span>
                      {STARTERS.map((s) => (
                        <button key={s} className={styles.starter} onClick={() => send(s)} disabled={loading}>
                          {s}
                        </button>
                      ))}
                    </div>
                    <div className={styles.flowStart}>
                      <span className={styles.starterLabel}>Guided flows</span>
                      <button className={styles.flowButton} onClick={() => startFlow("recommendation")}>
                        Find the right package
                      </button>
                      <button className={styles.flowButton} onClick={() => startFlow("handoff")}>
                        Talk to the team
                      </button>
                    </div>
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`${styles.row} ${m.role === "user" ? styles.rowUser : styles.rowBot}`}
                    >
                      <div className={`${styles.bubble} ${m.role === "user" ? styles.bubbleUser : styles.bubbleBot}`}>
                        {m.content}
                        {streaming && m.role === "assistant" && m.id === messages[messages.length - 1]?.id && (
                          <span className={styles.caret} aria-hidden="true" />
                        )}
                      </div>
                    </div>
                  ))
                )}

                {flow && (
                  <div className={styles.flowOptions}>
                    {FLOW_OPTIONS[flow.step].map((option) => (
                      <button
                        key={option.value}
                        className={styles.flowOption}
                        onClick={() => chooseFlowOption(option)}
                        disabled={loading || streaming}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}

                {loading && !streaming && (
                  <div className={`${styles.row} ${styles.rowBot}`}>
                    <div className={`${styles.bubble} ${styles.bubbleBot}`}>
                      <span className={styles.typing} aria-label="Assistant is typing">
                        <span /><span /><span />
                      </span>
                    </div>
                  </div>
                )}

                {/* non-intrusive lead CTA — only after the user has engaged */}
                {!empty && (
                  <button className={styles.inquiryCta} onClick={openInquiry}>
                    <IconUser /> Send an inquiry &amp; get a quote
                  </button>
                )}
              </div>

              {/* error */}
              {error && (
                <div className={styles.error} role="alert">
                  <IconAlert />
                  <span>{error}</span>
                  <button className={styles.retry} onClick={retry}>Retry</button>
                </div>
              )}

              {/* composer */}
              <form className={styles.composer} onSubmit={onSubmit}>
                <textarea
                  ref={taRef}
                  className={styles.textarea}
                  placeholder="Ask about reels, packages, or production…"
                  value={input}
                  rows={1}
                  onChange={(e) => {
                    setInput(e.target.value);
                    autosize(e.target);
                  }}
                  onKeyDown={onKeyDown}
                  disabled={loading}
                />
                <button
                  className={styles.send}
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                >
                  <IconSend />
                  <span className={styles.srOnly}>Send</span>
                </button>
              </form>
            </>
          )}
        </div>
        </>
      )}
    </div>
  );
}
