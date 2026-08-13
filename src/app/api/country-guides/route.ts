// GET /api/country-guides

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const guides = await db.countryGuide.findMany({
    orderBy: { country: "asc" },
  });

  return NextResponse.json({ guides });
}
