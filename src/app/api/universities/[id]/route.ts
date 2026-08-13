// PUT /api/universities/[id] — update university
// DELETE /api/universities/[id] — delete university
// Made & maintained by GuardianX

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  const allowed = ["name", "country", "city", "type", "applicationFee", "tuitionFee", "popularCourses", "intakeMonths", "minIelts", "minToefl", "minGpa", "website", "logoColor", "partnerStatus", "commission", "ranking", "qsStars"];
  for (const f of allowed) {
    if (body[f] !== undefined) {
      if (["applicationFee", "tuitionFee", "minToefl", "ranking"].includes(f)) data[f] = body[f] ? Number(body[f]) : null;
      else if (["minIelts", "minGpa", "qsStars", "commission"].includes(f)) data[f] = body[f] !== "" ? Number(body[f]) : null;
      else data[f] = body[f];
    }
  }

  const university = await db.university.update({ where: { id }, data });
  return NextResponse.json({ university });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.university.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
