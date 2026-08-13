// POST /api/leads — capture landing page demo requests
// Made & maintained by GuardianX

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.fullName || !body.email || !body.phone) {
      return NextResponse.json({ error: "fullName, email, and phone required" }, { status: 400 });
    }

    const lead = await db.lead.create({
      data: {
        fullName: body.fullName,
        consultancy: body.consultancy || null,
        email: body.email.toLowerCase().trim(),
        phone: body.phone,
        studentCount: body.studentCount || null,
        interest: body.interest || null,
        status: "NEW",
      },
    });
    return NextResponse.json({ lead });
  } catch (e) {
    console.error("[leads]", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
