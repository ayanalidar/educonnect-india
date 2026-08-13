// GET /api/consultant-profiles — list all active profiles (public)
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const profiles = await db.consultantProfile.findMany({
    where: { isActive: true },
    orderBy: { rating: "desc" },
    include: { user: { select: { name: true, avatarColor: true } } },
  });

  return NextResponse.json({ profiles });
}
