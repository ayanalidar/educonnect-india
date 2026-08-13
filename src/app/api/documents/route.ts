// GET /api/documents — list all OCR documents
// Made & maintained by GuardianX

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");

  const where: Record<string, unknown> = {};
  if (studentId) where.studentId = studentId;

  const docs = await db.documentRecord.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { student: true },
    take: 100,
  });

  return NextResponse.json({ documents: docs });
}
