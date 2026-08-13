// GET /api/invoices  +  POST /api/invoices
// Made & maintained by GuardianX

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

  const invoices = await db.invoice.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { application: { include: { university: true } } },
    take: 100,
  });
  return NextResponse.json({ invoices });
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.studentName || !body.amount) {
    return NextResponse.json({ error: "studentName and amount required" }, { status: 400 });
  }

  const count = await db.invoice.count();
  const number = `INV-2026-${1000 + count + 1}`;

  const invoice = await db.invoice.create({
    data: {
      number,
      studentName: body.studentName,
      applicationId: body.applicationId || null,
      counselorId: user.id,
      amount: Number(body.amount),
      gst: body.gst ? Number(body.gst) : 18,
      status: body.status || "DRAFT",
      dueDate: body.dueDate ? new Date(body.dueDate) : new Date(Date.now() + 30 * 86400000),
    },
  });
  return NextResponse.json({ invoice });
}
