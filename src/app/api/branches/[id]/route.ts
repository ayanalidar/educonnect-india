// PUT /api/branches/[id] — update branch
// DELETE /api/branches/[id] — delete branch

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  for (const f of ["name", "city", "address", "phone", "email", "managerName"]) {
    if (body[f] !== undefined) data[f] = body[f];
  }

  const branch = await db.branch.update({ where: { id }, data });
  return NextResponse.json({ branch });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.branch.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
