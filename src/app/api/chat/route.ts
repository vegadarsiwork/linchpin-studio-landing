import { SITE_KNOWLEDGE, formatKnowledgeContext } from "@/lib/chat/knowledge";

export const runtime = "nodejs";

type ChatRole = "user" | "assistant" | "system";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

const SYSTEM_PROMPT = `You are Linchpin Studio's website assistant.
Your job is to help website visitors understand Linchpin Studio's services, production process, package options, and next steps.
Use only the provided website knowledge for factual details. Do not quote specific prices — direct visitors to send an inquiry for custom rates.
Keep answers concise, practical, and sales-friendly.
When a visitor seems ready, asks for a quote, asks for a human, or shares contact details, suggest sending an inquiry through the chat form.
Do not invent discounts, guarantees, timelines, or package details.`;

function localReply(messages: ChatMessage[]) {
  const lastUser = [...messages].reverse().find((message) => message.role === "user");
  const text = lastUser?.content.trim().toLowerCase() || "";

  if (/^(hi|hello|hey|yo|hii|heyy|good morning|good afternoon|good evening)[!.?\s]*$/.test(text)) {
    return "Hi! I can help you choose a reel package or connect you with the Linchpin Studio team. What are you planning to create?";
  }

  if (/(seed|growth|scale|elite)/.test(text)) {
    return "Our digital marketing packages — Seed, Growth, Scale, and Elite — scale up in reel volume, influencer allocation, shoot days, Meta ad campaigns, and strategy support. Send us an inquiry and we'll share full details and current rates.";
  }

  if (/(silver|platinum|influencer reel|influencer-led)/.test(text)) {
    return "Influencer reel tiers: Silver is entry-level, Gold is our signature tier with stronger scripting and strategy, and Platinum is cinematic top-tier production. Packages run at 3, 5, 10, or custom bulk reels. Drop us an inquiry for exact rates.";
  }

  if (/(diamond|brand-led|solo|founder)/.test(text)) {
    return "Brand-led reels don't use third-party talent — ideal for founder-fronted or product content. Gold is standard production and Diamond is cinematic storytelling with deeper scripting and multi-location shoots. Send an inquiry for a custom quote.";
  }

  if (/(price|pricing|cost|rate|package|quote)/.test(text)) {
    return "We tailor quotes to your brief — reel count, influencer tier, shoot days, and content strategy all affect the scope. Share your service type, budget range, and timeline and I'll help narrow it down, or send an inquiry for the team to get back to you.";
  }

  if (/(human|person|team|call|contact|whatsapp|phone|talk)/.test(text)) {
    return "Sure. Use the inquiry button in this chat and share your phone or email — I'll pass the conversation context to the team. Or reach us directly at +91 7416 393 958.";
  }

  return null;
}

function cleanMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((message): message is Partial<ChatMessage> => {
      return Boolean(message && typeof message === "object");
    })
    .map((message): ChatMessage => {
      const role: ChatRole =
        message.role === "assistant" || message.role === "system" ? message.role : "user";

      return {
        role,
        content: typeof message.content === "string" ? message.content.slice(0, 1200) : "",
      };
    })
    .filter((message) => message.content.trim().length > 0)
    .slice(-12);
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        error:
          "OpenRouter is not configured. Add OPENROUTER_API_KEY and optionally OPENROUTER_MODEL to the environment.",
      },
      { status: 503 }
    );
  }

  let body: { messages?: unknown };
  try {
    body = (await req.json()) as { messages?: unknown };
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages = cleanMessages(body.messages);
  if (!messages.length) {
    return Response.json({ error: "At least one message is required." }, { status: 400 });
  }

  const cannedReply = localReply(messages);
  if (cannedReply) {
    return Response.json({ reply: cannedReply, model: "local-flow" });
  }

  const knowledge = formatKnowledgeContext(SITE_KNOWLEDGE);

  const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://linchpinstudios.in",
      "X-Title": "Linchpin Studio Landing Chatbot",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || "openrouter/free",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "system",
          content: `Website knowledge:\n\n${knowledge}`,
        },
        ...messages,
      ],
      temperature: 0.35,
      max_tokens: 420,
    }),
  });

  if (!openRouterRes.ok) {
    const error = await openRouterRes.text();
    return Response.json(
      {
        error:
          openRouterRes.status === 429
            ? "The AI model is rate limited right now. Please try again shortly or send an inquiry."
            : error.slice(0, 500) || "AI request failed.",
      },
      { status: openRouterRes.status }
    );
  }

  const data = (await openRouterRes.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    model?: string;
  };

  const reply = data.choices?.[0]?.message?.content?.trim();

  return Response.json({
    reply:
      reply ||
      "I can help with Linchpin Studio's reel pricing, content packages, timelines, and inquiry handoff. Ask me what you need, or send an inquiry if you want the team to respond directly.",
    model: data.model,
  });
}
