// GET /api/universities  +  POST /api/universities

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country");
  const q = searchParams.get("q");

  const where: Record<string, unknown> = {};
  if (country && country !== "all") where.country = country;
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { city: { contains: q } },
      { popularCourses: { contains: q } },
    ];
  }

  const universities = await db.university.findMany({
    where,
    orderBy: [{ ranking: "asc" }, { name: "asc" }],
    take: 300,
  });
  return NextResponse.json({ universities });
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.name || !body.country) {
    return NextResponse.json({ error: "Name and country required" }, { status: 400 });
  }

  const u = await db.university.create({
    data: {
      name: body.name,
      country: body.country,
      city: body.city || "",
      type: body.type || "PUBLIC",
      applicationFee: body.applicationFee ? Number(body.applicationFee) : null,
      tuitionFee: body.tuitionFee ? Number(body.tuitionFee) : null,
      popularCourses: body.popularCourses || "",
      intakeMonths: body.intakeMonths || "",
      minIelts: body.minIelts ? Number(body.minIelts) : null,
      minToefl: body.minToefl ? Number(body.minToefl) : null,
      minGpa: body.minGpa ? Number(body.minGpa) : null,
      website: body.website || null,
      logoColor: body.logoColor || "#e85d2f",
      partnerStatus: body.partnerStatus || "PROSPECT",
      commission: body.commission ? Number(body.commission) : 0,
    },
  });
  return NextResponse.json({ university: u });
}
