// GET /api/consultant-profiles/[slug] — public profile by slug
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await db.consultantProfile.findUnique({
    where: { slug },
    include: { user: { select: { name: true, avatarColor: true, email: true, phone: true } } },
  });

  if (!profile || !profile.isActive) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json({ profile });
}
