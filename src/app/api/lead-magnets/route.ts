// GET /api/lead-magnets
// Made & maintained by GuardianX

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const magnets = await db.leadMagnet.findMany({
    orderBy: { conversions: "desc" },
  });

  const stats = {
    total: magnets.length,
    active: magnets.filter((m) => m.isActive).length,
    totalViews: magnets.reduce((s, m) => s + m.views, 0),
    totalConversions: magnets.reduce((s, m) => s + m.conversions, 0),
    avgConversionRate: magnets.length > 0
      ? Math.round((magnets.reduce((s, m) => s + (m.views > 0 ? (m.conversions / m.views) * 100 : 0), 0) / magnets.length) * 10) / 10
      : 0,
  };

  return NextResponse.json({ magnets, stats });
}

// POST to toggle active state
export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { magnetId, action } = await req.json();
  if (!magnetId) return NextResponse.json({ error: "magnetId required" }, { status: 400 });

  if (action === "toggle") {
    const m = await db.leadMagnet.findUnique({ where: { id: magnetId } });
    if (!m) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const updated = await db.leadMagnet.update({
      where: { id: magnetId },
      data: { isActive: !m.isActive },
    });
    return NextResponse.json({ magnet: updated });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
