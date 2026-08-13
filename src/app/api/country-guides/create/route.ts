// POST /api/country-guides/create — create new country guide

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.country) {
    return NextResponse.json({ error: "country required" }, { status: 400 });
  }

  const guide = await db.countryGuide.create({
    data: {
      country: body.country,
      flag: body.flag || "🏳️",
      capital: body.capital || "",
      currency: body.currency || "",
      language: body.language || "",
      visaType: body.visaType || "",
      visaProcessingTime: body.visaProcessingTime || "",
      visaFee: body.visaFee || "",
      intakeMonths: body.intakeMonths || "",
      avgTuition: body.avgTuition || "",
      avgLivingCost: body.avgLivingCost || "",
      workWhileStudying: body.workWhileStudying || "",
      postStudyVisa: body.postStudyVisa || "",
      popularPrograms: body.popularPrograms || "",
      topUniversities: body.topUniversities || "",
      description: body.description || "",
      heroColor: body.heroColor || "#e85d2f",
    },
  });

  return NextResponse.json({ guide });
}
