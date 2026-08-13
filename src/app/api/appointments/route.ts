// GET /api/appointments + POST /api/appointments
// Made & maintained by GuardianX

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") || "upcoming"; // upcoming | past | all | cancelled

  const now = new Date();
  const where: Record<string, unknown> = {};
  if (filter === "upcoming") {
    where.startTime = { gte: now };
    where.status = "SCHEDULED";
  } else if (filter === "past") {
    where.startTime = { lt: now };
  } else if (filter === "cancelled") {
    where.status = "CANCELLED";
  }

  const appointments = await db.appointment.findMany({
    where,
    orderBy: { startTime: "asc" },
    include: { student: true },
    take: 50,
  });

  return NextResponse.json({ appointments });
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.title || !body.startTime) {
    return NextResponse.json({ error: "title and startTime required" }, { status: 400 });
  }

  const start = new Date(body.startTime);
  const end = new Date(start.getTime() + (body.duration || 60) * 60000);

  const appt = await db.appointment.create({
    data: {
      studentId: body.studentId || null,
      counselorId: user.id,
      title: body.title,
      description: body.description || null,
      startTime: start,
      endTime: end,
      status: "SCHEDULED",
      type: body.type || "COUNSELING",
      location: body.location || "VIDEO",
      meetingLink: body.location === "VIDEO"
        ? `https://meet.educonnect.in/${Math.random().toString(36).slice(2, 10)}`
        : null,
      branch: user.branch || null,
    },
    include: { student: true },
  });

  return NextResponse.json({ appointment: appt });
}

// PUT to update status (cancel, complete, no-show)
export async function PUT(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { appointmentId, status } = await req.json();
  if (!appointmentId || !status) {
    return NextResponse.json({ error: "appointmentId and status required" }, { status: 400 });
  }

  const appt = await db.appointment.update({
    where: { id: appointmentId },
    data: { status },
  });

  return NextResponse.json({ appointment: appt });
}
