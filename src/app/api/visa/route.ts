// GET /api/visa  +  POST /api/visa
// Made & maintained by GuardianX

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const visas = await db.visaApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: { student: true },
    take: 100,
  });
  return NextResponse.json({ visas });
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.studentId || !body.country) {
    return NextResponse.json({ error: "studentId and country required" }, { status: 400 });
  }

  const visa = await db.visaApplication.create({
    data: {
      studentId: body.studentId,
      country: body.country,
      visaType: body.visaType || "STUDENT",
      status: body.status || "DRAFT",
      appointmentDate: body.appointmentDate ? new Date(body.appointmentDate) : null,
      notes: body.notes || null,
    },
    include: { student: true },
  });
  return NextResponse.json({ visa });
}
