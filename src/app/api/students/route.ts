// GET /api/students  +  POST /api/students
// Made & maintained by GuardianX

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;
  if (q) {
    where.OR = [
      { firstName: { contains: q } },
      { lastName: { contains: q } },
      { email: { contains: q } },
      { city: { contains: q } },
    ];
  }

  const students = await db.student.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { applications: true } },
    },
    take: 200,
  });
  return NextResponse.json({ students });
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const required = ["firstName", "lastName", "email", "phone"];
  for (const f of required) {
    if (!body[f]) return NextResponse.json({ error: `${f} is required` }, { status: 400 });
  }

  const student = await db.student.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email.toLowerCase().trim(),
      phone: body.phone,
      city: body.city || null,
      country: "India",
      targetCountry: body.targetCountry || null,
      targetProgram: body.targetProgram || null,
      intake: body.intake || null,
      budget: body.budget ? Number(body.budget) : null,
      academicScore: body.academicScore ? Number(body.academicScore) : null,
      englishScore: body.englishScore || null,
      status: body.status || "LEAD",
      source: body.source || "Manual",
      counselorId: user.id,
      notes: body.notes || null,
    },
  });
  return NextResponse.json({ student });
}
