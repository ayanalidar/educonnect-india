// TTS endpoint — converts interview question to voice

import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { text, voice = "tongtong", speed = 1.0 } = await req.json();
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });

  // Truncate if too long (TTS API limit: 1024 chars)
  const truncated = text.length > 1024 ? text.slice(0, 1024) : text;

  try {
    const ZAI = (await import("z-ai-web-dev-sdk")).default;
    const zai = await ZAI.create();

    const response = await zai.audio.tts.create({
      input: truncated,
      voice,
      speed,
      response_format: "wav",
      stream: false,
    });

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("[visa-interview/tts] failed:", err);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}
