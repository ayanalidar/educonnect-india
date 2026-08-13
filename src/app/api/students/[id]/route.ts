// PUT /api/students/[id] — update student
// DELETE /api/students/[id] — delete student
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
  const allowed = ["firstName", "lastName", "email", "phone", "city", "targetCountry", "targetProgram", "intake", "budget", "academicScore", "englishScore", "status", "source", "notes"];
  for (const f of allowed) {
    if (body[f] !== undefined) {
      if (["budget", "academicScore"].includes(f)) data[f] = body[f] ? Number(body[f]) : null;
      else data[f] = body[f];
    }
  }

  const student = await db.student.update({ where: { id }, data });
  return NextResponse.json({ student });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.student.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
