// GET /api/communications  +  POST /api/communications
// Made & maintained by GuardianX

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel");

  const where: Record<string, unknown> = {};
  if (channel && channel !== "all") where.channel = channel;

  const comms = await db.communication.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { student: true },
    take: 100,
  });
  return NextResponse.json({ communications: comms });
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.channel || !body.body) {
    return NextResponse.json({ error: "channel and body required" }, { status: 400 });
  }

  const comm = await db.communication.create({
    data: {
      studentId: body.studentId || null,
      userId: user.id,
      channel: body.channel,
      direction: "OUTBOUND",
      subject: body.subject || null,
      body: body.body,
      status: "SENT",
    },
    include: { student: true },
  });

  // Simulate delivery confirmation after 1s
  setTimeout(async () => {
    try {
      await db.communication.update({
        where: { id: comm.id },
        data: { status: "DELIVERED" },
      });
    } catch {}
  }, 1200);

  return NextResponse.json({ communication: comm });
}
