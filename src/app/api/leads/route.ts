export const runtime = "nodejs";

type LeadPayload = {
  lead?: Record<string, unknown>;
  transcript?: Array<{ role?: string; content?: string }>;
  channel?: string;
  page?: string;
};

const DEFAULT_TO = "info@linchpinsoftsolution.com";

function textValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "-";
}

function buildLeadEmail(payload: LeadPayload) {
  const lead = payload.lead || {};
  const transcript = Array.isArray(payload.transcript) ? payload.transcript : [];
  const who = textValue(lead.name) !== "-" ? textValue(lead.name) : textValue(lead.company);
  const subject = `New website chat inquiry - ${who}`;

  const leadLines = [
    `Name: ${textValue(lead.name)}`,
    `Brand / company: ${textValue(lead.company)}`,
    `Phone / email: ${textValue(lead.contact)}`,
    `Service interest: ${textValue(lead.service)}`,
    `Budget: ${textValue(lead.budget)}`,
    `Timeline: ${textValue(lead.timeline)}`,
    `Preferred channel: ${textValue(payload.channel)}`,
    `Page: ${textValue(payload.page)}`,
    `Notes: ${textValue(lead.notes)}`,
  ];

  const transcriptLines = transcript
    .slice(-30)
    .map((message) => `${message.role === "assistant" ? "Assistant" : "Visitor"}: ${message.content || ""}`);

  return {
    subject,
    text: [
      "New inquiry from the Linchpin Studio website chat.",
      "",
      "Lead details:",
      ...leadLines,
      "",
      "Recent transcript:",
      ...(transcriptLines.length ? transcriptLines : ["-"]),
    ].join("\n"),
  };
}

async function sendWebhook(payload: LeadPayload) {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, source: "linchpin-studio-landing-chat" }),
  });

  if (!res.ok) {
    throw new Error(`Lead webhook failed with ${res.status}.`);
  }

  return true;
}

async function sendEmail(payload: LeadPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const { subject, text } = buildLeadEmail(payload);
  const from = process.env.LEAD_EMAIL_FROM || "Linchpin Studio <onboarding@resend.dev>";
  const to = process.env.LEAD_EMAIL_TO || DEFAULT_TO;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text,
    }),
  });

  if (!res.ok) {
    throw new Error((await res.text()) || `Lead email failed with ${res.status}.`);
  }

  return true;
}

export async function POST(req: Request) {
  let payload: LeadPayload;
  try {
    payload = (await req.json()) as LeadPayload;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const contact = textValue(payload.lead?.contact);
  if (contact === "-") {
    return Response.json({ error: "Phone or email is required." }, { status: 400 });
  }

  try {
    const [webhookSent, emailSent] = await Promise.all([sendWebhook(payload), sendEmail(payload)]);

    if (!webhookSent && !emailSent) {
      return Response.json(
        {
          error:
            "Lead delivery is not configured. Add RESEND_API_KEY or LEAD_WEBHOOK_URL to receive inquiries automatically.",
        },
        { status: 503 }
      );
    }

    return Response.json({ ok: true, delivered: { webhook: webhookSent, email: emailSent } });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Lead delivery failed." },
      { status: 502 }
    );
  }
}
