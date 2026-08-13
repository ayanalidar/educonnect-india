// Conversational AI Chatbot — POST message → LLM response

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const SYSTEM_PROMPT = `You are EduBot, the friendly AI assistant for EduConnect India — a SaaS platform for Indian education consultants. You help prospective students and parents with questions about:

- Studying abroad (UK, US, Canada, Australia, Ireland, Germany, Singapore, etc.)
- Indian universities (IITs, IIMs, BITS, etc.)
- Visa requirements and processes
- Scholarships (Chevening, Fulbright, Commonwealth, DAAD, etc.)
- Application deadlines and requirements
- IELTS/TOEFL preparation
- EduConnect India platform features

Keep responses short (max 80 words), warm, and practical. If asked about specific deadlines or fees, mention that they vary and suggest checking with a counselor. Always offer to connect them with a counselor for personalized guidance via the "Book a Demo" CTA.

If the visitor asks about pricing, mention Starter (₹4,999/mo), Growth (₹14,999/mo), and Enterprise plans.

Never make up specific university deadlines, fees, or visa processing times — always recommend verifying with the official source.`;

export async function POST(req: Request) {
  try {
    const { message, sessionId, visitorName, visitorEmail, source = "WEBSITE" } = await req.json();
    if (!message || !sessionId) {
      return NextResponse.json({ error: "message and sessionId required" }, { status: 400 });
    }

    // Find or create conversation
    let convo = await db.chatConversation.findUnique({
      where: { sessionId },
      include: { messages: { orderBy: { createdAt: "asc" }, take: 10 } },
    });

    if (!convo) {
      convo = await db.chatConversation.create({
        data: {
          sessionId,
          visitorName: visitorName || null,
          visitorEmail: visitorEmail || null,
          source,
        },
        include: { messages: true },
      });
    } else if ((visitorName || visitorEmail) && (!convo.visitorName || !convo.visitorEmail)) {
      await db.chatConversation.update({
        where: { id: convo.id },
        data: {
          visitorName: visitorName || convo.visitorName,
          visitorEmail: visitorEmail || convo.visitorEmail,
        },
      });
    }

    // Save user message
    await db.chatMessage.create({
      data: { conversationId: convo.id, role: "USER", content: message },
    });

    // Build LLM messages
    const llmMessages = [
      { role: "assistant", content: SYSTEM_PROMPT },
      ...convo.messages.slice(-6).map((m) => ({
        role: m.role === "USER" ? "user" : "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    let reply: string;
    try {
      const ZAI = (await import("z-ai-web-dev-sdk")).default;
      const zai = await ZAI.create();
      const completion = await zai.chat.completions.create({
        messages: llmMessages as Array<{ role: string; content: string }>,
        thinking: { type: "disabled" },
      });
      reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (err) {
      console.error("[chat] LLM failed:", err);
      // Fallback rule-based responses
      reply = generateFallbackReply(message);
    }

    // Save assistant message
    await db.chatMessage.create({
      data: { conversationId: convo.id, role: "ASSISTANT", content: reply },
    });

    return NextResponse.json({
      reply,
      conversationId: convo.id,
    });
  } catch (e) {
    console.error("[chat]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

function generateFallbackReply(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("price") || m.includes("cost") || m.includes("pricing")) {
    return "EduConnect India has 3 plans: Starter (₹4,999/mo for 200 students), Growth (₹14,999/mo for 2,000 students with AI matcher + visa module), and Enterprise (custom). Book a free demo to see which fits you best!";
  }
  if (m.includes("visa")) {
    return "Visa requirements vary by country. For UK Tier 4 you need a CAS, for US F1 you need an I-20, for Canada SDS you need GIC + IELTS 6.0. Our Visa Tracker module handles all this — would you like to see a demo?";
  }
  if (m.includes("scholarship")) {
    return "We track 39+ scholarships including Chevening (UK), Fulbright (US), DAAD (Germany), and Vanier (Canada). Our Scholarship Finder matches students automatically based on their profile. Want me to connect you with a counselor?";
  }
  if (m.includes("ielts") || m.includes("toefl")) {
    return "Most universities require IELTS 6.5+ or TOEFL 90+. Top universities like Oxford want IELTS 7.5. Our AI Mock Visa Interviewer helps you practice with voice-based questions!";
  }
  if (m.includes("hello") || m.includes("hi") || m.includes("hey")) {
    return "Hi there! 👋 I'm EduBot, your AI assistant for studying abroad. Ask me about universities, scholarships, visas, or EduConnect India. How can I help?";
  }
  return "Great question! I'd recommend connecting with one of our expert counselors for personalized guidance. Click 'Book a Demo' to schedule a free 30-min consultation. Meanwhile, feel free to ask me about universities, scholarships, or visas!";
}
