// PUT /api/country-guides/[id] — update guide
// DELETE /api/country-guides/[id] — delete guide

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  for (const f of ["country", "flag", "capital", "currency", "language", "visaType", "visaProcessingTime", "visaFee", "intakeMonths", "avgTuition", "avgLivingCost", "workWhileStudying", "postStudyVisa", "popularPrograms", "topUniversities", "description", "heroColor"]) {
    if (body[f] !== undefined) data[f] = body[f];
  }

  const guide = await db.countryGuide.update({ where: { id }, data });
  return NextResponse.json({ guide });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.countryGuide.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
