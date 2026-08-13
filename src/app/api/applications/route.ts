// GET /api/applications  +  POST /api/applications

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;

  const applications = await db.application.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      student: true,
      university: true,
    },
    take: 200,
  });
  return NextResponse.json({ applications });
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.studentId || !body.universityId || !body.program) {
    return NextResponse.json({ error: "studentId, universityId, and program are required" }, { status: 400 });
  }

  const app = await db.application.create({
    data: {
      studentId: body.studentId,
      universityId: body.universityId,
      counselorId: user.id,
      program: body.program,
      intake: body.intake || "Fall 2026",
      status: body.status || "DRAFT",
      amount: body.amount ? Number(body.amount) : null,
      submittedAt: body.status && body.status !== "DRAFT" ? new Date() : null,
    },
    include: { student: true, university: true },
  });
  return NextResponse.json({ application: app });
}
