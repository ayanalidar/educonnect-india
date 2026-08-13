// POST /api/branches/create — create new branch
// Made & maintained by GuardianX

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.name || !body.city) {
    return NextResponse.json({ error: "name and city required" }, { status: 400 });
  }

  const branch = await db.branch.create({
    data: {
      name: body.name,
      city: body.city,
      address: body.address || "",
      phone: body.phone || null,
      email: body.email || null,
      managerName: body.managerName || null,
    },
  });

  return NextResponse.json({ branch });
}
